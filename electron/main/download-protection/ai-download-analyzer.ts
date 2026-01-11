/**
 * AI Download Analyzer
 * Uses Gemini to analyze download safety
 */

import { GoogleGenAI } from '@google/genai';
import {
    getExtensionRisk,
    isTrustedDomain,
    analyzeFilename,
    getFileExtension,
    type ExtensionRisk
} from './download-rules';

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Download analysis result
export interface DownloadAnalysis {
    riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    riskScore: number; // 0-100
    reasoning: string;
    sourceReputation: 'trusted' | 'neutral' | 'suspicious' | 'malicious';
    recommendations: string[];
    shouldBlock: boolean;
    allowOverride: boolean;
}

// Download info passed from interceptor
export interface DownloadInfo {
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
    referrer: string;
    domain: string;
}

// JSON schema for structured output
const downloadAnalysisSchema = {
    type: "object",
    properties: {
        riskLevel: {
            type: "string",
            enum: ["safe", "low", "medium", "high", "critical"],
            description: "Overall risk level of this download"
        },
        riskScore: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            description: "Numerical risk score from 0 (safe) to 100 (critical)"
        },
        reasoning: {
            type: "string",
            description: "Brief explanation of the risk assessment"
        },
        sourceReputation: {
            type: "string",
            enum: ["trusted", "neutral", "suspicious", "malicious"],
            description: "Reputation of the download source"
        },
        recommendations: {
            type: "array",
            items: { type: "string" },
            description: "List of safety recommendations for the user"
        }
    },
    required: ["riskLevel", "riskScore", "reasoning", "sourceReputation", "recommendations"]
};

/**
 * Perform quick local analysis before AI
 */
function performLocalAnalysis(info: DownloadInfo): {
    extensionRisk: ExtensionRisk;
    isTrusted: boolean;
    filenameAnalysis: ReturnType<typeof analyzeFilename>;
    quickBlock: boolean;
    quickPass: boolean;
} {
    const extension = getFileExtension(info.fileName);
    const extensionRisk = getExtensionRisk(extension);
    const isTrusted = isTrustedDomain(info.domain);
    const filenameAnalysis = analyzeFilename(info.fileName);

    // Quick block: Critical extension from untrusted source with suspicious filename
    const quickBlock = extensionRisk === 'critical' &&
        !isTrusted &&
        filenameAnalysis.isSuspicious;

    // Quick pass: Safe extension from trusted source
    const quickPass = extensionRisk === 'safe' && isTrusted;

    return {
        extensionRisk,
        isTrusted,
        filenameAnalysis,
        quickBlock,
        quickPass
    };
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
    if (bytes === 0) return 'Unknown';
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Analyze download using Gemini AI
 */
export async function analyzeDownload(info: DownloadInfo): Promise<DownloadAnalysis> {
    console.log('[AI-Download] Analyzing:', info.fileName);

    // Perform local analysis first
    const localAnalysis = performLocalAnalysis(info);

    // Quick block for obviously dangerous files
    if (localAnalysis.quickBlock) {
        console.log('[AI-Download] Quick block: Critical file from untrusted source');
        return {
            riskLevel: 'critical',
            riskScore: 95,
            reasoning: 'Executable file from untrusted source with suspicious filename patterns. This is a common malware distribution technique.',
            sourceReputation: 'suspicious',
            recommendations: [
                'Do not download this file',
                'Executables should only be downloaded from official sources',
                'This file has suspicious filename patterns'
            ],
            shouldBlock: true,
            allowOverride: false
        };
    }

    // Quick pass for safe files
    if (localAnalysis.quickPass) {
        console.log('[AI-Download] Quick pass: Safe file from trusted source');
        return {
            riskLevel: 'safe',
            riskScore: 5,
            reasoning: 'Document/media file from a trusted source. No security concerns detected.',
            sourceReputation: 'trusted',
            recommendations: [],
            shouldBlock: false,
            allowOverride: true
        };
    }

    // For everything else, use AI analysis
    try {
        const extension = getFileExtension(info.fileName);

        const prompt = `You are a cybersecurity expert analyzing a file download for potential security threats.

DOWNLOAD DETAILS:
- File Name: ${info.fileName}
- File Extension: ${extension}
- File Size: ${formatFileSize(info.fileSize)}
- Download URL: ${info.url}
- Source Domain: ${info.domain}
- Referrer Page: ${info.referrer || 'Direct download'}
- MIME Type: ${info.mimeType || 'Unknown'}

LOCAL ANALYSIS RESULTS:
- Extension Risk Level: ${localAnalysis.extensionRisk}
- Source Trusted: ${localAnalysis.isTrusted ? 'Yes' : 'No'}
- Has Double Extension: ${localAnalysis.filenameAnalysis.hasDoubleExtension ? 'YES - SUSPICIOUS' : 'No'}
- Has Unicode Characters: ${localAnalysis.filenameAnalysis.hasUnicodeCharacters ? 'Yes' : 'No'}

ANALYZE THIS DOWNLOAD FOR:
1. Is this file type expected from this website/domain?
2. Does the source domain appear legitimate for distributing this type of file?
3. Are there any red flags (mismatched extension/MIME type, suspicious patterns)?
4. What is the overall security risk?

IMPORTANT CONTEXT:
- Executables (.exe, .msi) from unknown sources are HIGH risk
- Document files (.pdf, .docx) are generally LOW risk but can contain macros
- Archives (.zip, .rar) can hide executables
- Double extensions like "file.pdf.exe" are CRITICAL risk (malware trick)
- Trusted sources include: github.com, microsoft.com, google.com, official software sites

Provide your security assessment.`;

        console.log('[AI-Download] Sending to Gemini for analysis...');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: downloadAnalysisSchema
            }
        });

        const result = JSON.parse(response.text || '{}');

        console.log('[AI-Download] Analysis complete:', result.riskLevel, result.riskScore);

        // Determine if we should block
        const shouldBlock = result.riskLevel === 'critical' ||
            (result.riskLevel === 'high' && result.riskScore >= 80);

        // Allow override for everything except critical
        const allowOverride = result.riskLevel !== 'critical';

        return {
            riskLevel: result.riskLevel,
            riskScore: result.riskScore,
            reasoning: result.reasoning,
            sourceReputation: result.sourceReputation,
            recommendations: result.recommendations || [],
            shouldBlock,
            allowOverride
        };

    } catch (error) {
        console.error('[AI-Download] Analysis error:', error);

        // Fallback to local analysis on error
        const riskScore = localAnalysis.extensionRisk === 'critical' ? 90 :
            localAnalysis.extensionRisk === 'high' ? 70 :
                localAnalysis.extensionRisk === 'medium' ? 50 :
                    localAnalysis.extensionRisk === 'low' ? 30 : 10;

        return {
            riskLevel: localAnalysis.extensionRisk === 'safe' ? 'safe' :
                localAnalysis.extensionRisk as DownloadAnalysis['riskLevel'],
            riskScore,
            reasoning: `AI analysis unavailable. Local analysis based on file extension (${localAnalysis.extensionRisk} risk).`,
            sourceReputation: localAnalysis.isTrusted ? 'trusted' : 'neutral',
            recommendations: localAnalysis.extensionRisk !== 'safe' ?
                ['Scan file with antivirus before opening'] : [],
            shouldBlock: localAnalysis.extensionRisk === 'critical' && !localAnalysis.isTrusted,
            allowOverride: localAnalysis.extensionRisk !== 'critical'
        };
    }
}

// Check if AI client is available
export function isAIAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY;
}

console.log('[AI-Download] Analyzer initialized');
