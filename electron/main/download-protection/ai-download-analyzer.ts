/**
 * AI Download Analyzer
 * Uses Gemini to analyze download safety with improved prompts
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

// MIME type to extension mapping for mismatch detection
const EXPECTED_MIME_TYPES: Record<string, string[]> = {
    '.exe': ['application/x-msdownload', 'application/x-msdos-program', 'application/octet-stream'],
    '.msi': ['application/x-msi', 'application/octet-stream'],
    '.pdf': ['application/pdf'],
    '.doc': ['application/msword'],
    '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    '.xls': ['application/vnd.ms-excel'],
    '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    '.zip': ['application/zip', 'application/x-zip-compressed'],
    '.rar': ['application/x-rar-compressed', 'application/vnd.rar'],
    '.7z': ['application/x-7z-compressed'],
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
    '.mp3': ['audio/mpeg'],
    '.mp4': ['video/mp4'],
    '.js': ['application/javascript', 'text/javascript'],
    '.json': ['application/json'],
    '.html': ['text/html'],
    '.txt': ['text/plain'],
};

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
 * Check for MIME type mismatch (file claiming to be one type but actually another)
 */
function checkMimeTypeMismatch(fileName: string, mimeType: string): {
    hasMismatch: boolean;
    details: string;
} {
    if (!mimeType || mimeType === 'application/octet-stream') {
        return { hasMismatch: false, details: 'Generic binary type - cannot verify' };
    }

    const extension = getFileExtension(fileName);
    const expectedTypes = EXPECTED_MIME_TYPES[extension];

    if (!expectedTypes) {
        return { hasMismatch: false, details: 'Unknown extension - cannot verify' };
    }

    const mimeMatches = expectedTypes.some(expected =>
        mimeType.toLowerCase().includes(expected.toLowerCase())
    );

    if (!mimeMatches) {
        return {
            hasMismatch: true,
            details: `MISMATCH: File claims to be ${extension} but server reports ${mimeType}`
        };
    }

    return { hasMismatch: false, details: 'MIME type matches extension' };
}

/**
 * Check if file is an archive type
 */
function isArchiveFile(fileName: string): boolean {
    const archiveExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso', '.img'];
    const ext = getFileExtension(fileName);
    return archiveExtensions.includes(ext);
}

/**
 * Perform quick local analysis before AI
 */
function performLocalAnalysis(info: DownloadInfo): {
    extensionRisk: ExtensionRisk;
    isTrusted: boolean;
    filenameAnalysis: ReturnType<typeof analyzeFilename>;
    mimeCheck: ReturnType<typeof checkMimeTypeMismatch>;
    isArchive: boolean;
    quickBlock: boolean;
    quickPass: boolean;
} {
    const extension = getFileExtension(info.fileName);
    const extensionRisk = getExtensionRisk(extension);
    const isTrusted = isTrustedDomain(info.domain);
    const filenameAnalysis = analyzeFilename(info.fileName);
    const mimeCheck = checkMimeTypeMismatch(info.fileName, info.mimeType);
    const isArchive = isArchiveFile(info.fileName);

    // Quick block: Critical extension from untrusted source with suspicious filename OR MIME mismatch
    const quickBlock = (extensionRisk === 'critical' && !isTrusted && filenameAnalysis.isSuspicious) ||
        (mimeCheck.hasMismatch && extensionRisk !== 'safe');

    // Quick pass: Safe extension from trusted source with matching MIME
    const quickPass = extensionRisk === 'safe' && isTrusted && !mimeCheck.hasMismatch;

    return {
        extensionRisk,
        isTrusted,
        filenameAnalysis,
        mimeCheck,
        isArchive,
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
 * Search for download URL reputation
 */
async function checkUrlReputation(url: string, domain: string): Promise<string> {
    try {
        const prompt = `<role>Security researcher checking download source reputation</role>
<task>Search for any security warnings, scam reports, or malware associations with this download source.</task>
<url>${url}</url>
<domain>${domain}</domain>
<search_queries>
1. "${domain}" malware download
2. "${domain}" scam virus
3. "is ${domain} safe" download
</search_queries>
<output>Report any red flags found, or state "[CLEAN_REPUTATION]" if no issues found.</output>`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0
            }
        });

        return response.text || '[REPUTATION_CHECK_FAILED]';
    } catch (error) {
        console.warn('[AI-Download] Reputation check failed:', error);
        return '[REPUTATION_CHECK_FAILED] Could not verify source reputation';
    }
}

/**
 * Verify software/app legitimacy via Google Search
 * Checks if the software is legitimate and if the download source is official
 */
async function verifySoftwareLegitimacy(fileName: string, domain: string, referrer: string): Promise<{
    isLegitimate: boolean;
    officialSource: boolean;
    softwareName: string;
    searchResult: string;
}> {
    try {
        // Extract software name from filename (e.g., "Lens_Studio_5.15.3_win_setup.exe" -> "Lens Studio")
        const softwareName = fileName
            .replace(/[-_]/g, ' ')
            .replace(/\.(exe|msi|dmg|pkg|deb|rpm|appimage)$/i, '')
            .replace(/\d+(\.\d+)*/, '')  // Remove version numbers
            .replace(/(setup|installer|win|mac|linux|x64|x86|64bit|32bit)/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

        console.log(`[AI-Download] Verifying software: "${softwareName}"`);

        const prompt = `<role>Software security analyst verifying download authenticity</role>

<task>
Search to verify if this file download is legitimate software from an official/authorized source.
</task>

<file_info>
<file_name>${fileName}</file_name>
<software_name>${softwareName}</software_name>
<download_domain>${domain}</download_domain>
<referrer_page>${referrer}</referrer_page>
</file_info>

<search_queries>
1. "${softwareName}" official download
2. "${softwareName}" software legitimate
3. "${softwareName}" official website
4. "${softwareName}" from "${domain}" safe
</search_queries>

<analysis_questions>
1. Is "${softwareName}" a real, legitimate software product?
2. Who is the official publisher/developer?
3. What is the official download source?
4. Is "${domain}" an official or authorized distribution channel for this software?
5. Are there any warnings about fake versions of this software?
</analysis_questions>

<output_format>
Respond with a structured assessment:
- SOFTWARE_STATUS: [LEGITIMATE_SOFTWARE] or [UNKNOWN_SOFTWARE] or [SUSPICIOUS_SOFTWARE]
- OFFICIAL_SOURCE: [OFFICIAL_DISTRIBUTION] or [THIRD_PARTY_DISTRIBUTION] or [SUSPICIOUS_SOURCE]
- DETAILS: Brief explanation
</output_format>`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0
            }
        });

        const result = response.text || '';

        const isLegitimate = result.includes('[LEGITIMATE_SOFTWARE]');
        const officialSource = result.includes('[OFFICIAL_DISTRIBUTION]');

        return {
            isLegitimate,
            officialSource,
            softwareName,
            searchResult: result
        };
    } catch (error: any) {
        // Handle rate limiting - try fallback model
        if (error?.status === 429) {
            console.log('[AI-Download] Rate limited on software verification, using fallback...');
            try {
                const fallbackPrompt = `Is "${fileName}" from "${domain}" a legitimate software download? Brief answer.`;
                const fallbackResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-lite',
                    contents: fallbackPrompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                        temperature: 0
                    }
                });

                const text = fallbackResponse.text?.toLowerCase() || '';
                return {
                    isLegitimate: text.includes('legitimate') || text.includes('official') || text.includes('safe'),
                    officialSource: text.includes('official'),
                    softwareName: fileName,
                    searchResult: fallbackResponse.text || '[FALLBACK_VERIFICATION]'
                };
            } catch {
                // Both models failed
            }
        }

        console.warn('[AI-Download] Software verification failed:', error);
        return {
            isLegitimate: false,
            officialSource: false,
            softwareName: fileName,
            searchResult: '[VERIFICATION_FAILED] Could not verify software legitimacy'
        };
    }
}

/**
 * Analyze download using Gemini AI with improved prompts
 */
export async function analyzeDownload(info: DownloadInfo): Promise<DownloadAnalysis> {
    console.log('[AI-Download] Analyzing:', info.fileName);

    // Perform local analysis first
    const localAnalysis = performLocalAnalysis(info);

    // Quick block for obviously dangerous files
    if (localAnalysis.quickBlock) {
        console.log('[AI-Download] Quick block: Critical file from untrusted source');
        const blockReason = localAnalysis.mimeCheck.hasMismatch
            ? `MIME type mismatch detected: ${localAnalysis.mimeCheck.details}. This is a common malware disguise technique.`
            : 'Executable file from untrusted source with suspicious filename patterns. This is a common malware distribution technique.';

        return {
            riskLevel: 'critical',
            riskScore: 95,
            reasoning: blockReason,
            sourceReputation: 'suspicious',
            recommendations: [
                'Do not download this file',
                'The file type does not match what it claims to be',
                'This is a common technique used to distribute malware'
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
    // Run both checks in parallel for speed
    console.log('[AI-Download] Checking source reputation and software legitimacy...');

    const [reputationResult, softwareVerification] = await Promise.all([
        checkUrlReputation(info.url, info.domain),
        verifySoftwareLegitimacy(info.fileName, info.domain, info.referrer)
    ]);

    console.log('[AI-Download] Reputation check complete');
    console.log('[AI-Download] Software verification:', {
        software: softwareVerification.softwareName,
        isLegitimate: softwareVerification.isLegitimate,
        officialSource: softwareVerification.officialSource
    });

    const extension = getFileExtension(info.fileName);

    // Build software verification context for the prompt
    const softwareContext = softwareVerification.isLegitimate
        ? `[VERIFIED_LEGITIMATE_SOFTWARE] "${softwareVerification.softwareName}" is a known legitimate software.`
        : softwareVerification.searchResult.includes('[UNKNOWN_SOFTWARE]')
            ? `[UNKNOWN_SOFTWARE] Could not verify if "${softwareVerification.softwareName}" is legitimate software.`
            : `[UNVERIFIED_SOFTWARE] Software legitimacy could not be confirmed.`;

    const sourceContext = softwareVerification.officialSource
        ? `[OFFICIAL_SOURCE] This download appears to be from an official/authorized distribution channel.`
        : `[THIRD_PARTY_SOURCE] This download is NOT from the official distribution channel.`;

    const prompt = `<role>
You are an expert malware analyst and cybersecurity specialist protecting users from malicious downloads.
Your analysis determines whether a file download is safe or potentially dangerous.
</role>

<task>
Analyze this file download and provide a security risk assessment.
</task>

<download_info>
<file_name>${info.fileName}</file_name>
<file_extension>${extension}</file_extension>
<file_size>${formatFileSize(info.fileSize)}</file_size>
<download_url>${info.url}</download_url>
<source_domain>${info.domain}</source_domain>
<referrer>${info.referrer || 'Direct download'}</referrer>
<mime_type>${info.mimeType || 'Unknown'}</mime_type>
</download_info>

<local_analysis>
<extension_risk>${localAnalysis.extensionRisk}</extension_risk>
<source_trusted>${localAnalysis.isTrusted ? 'YES - Known trusted domain' : 'NO - Unknown/untrusted source'}</source_trusted>
<double_extension>${localAnalysis.filenameAnalysis.hasDoubleExtension ? 'YES - CRITICAL RED FLAG' : 'No'}</double_extension>
<unicode_chars>${localAnalysis.filenameAnalysis.hasUnicodeCharacters ? 'Yes - May be attempting to spoof filename' : 'No'}</unicode_chars>
<mime_mismatch>${localAnalysis.mimeCheck.hasMismatch ? 'YES - ' + localAnalysis.mimeCheck.details : 'No - ' + localAnalysis.mimeCheck.details}</mime_mismatch>
<is_archive>${localAnalysis.isArchive ? 'YES - Archive files can contain hidden executables' : 'No'}</is_archive>
</local_analysis>

<software_verification>
${softwareContext}
${sourceContext}
<verification_details>${softwareVerification.searchResult.substring(0, 500)}</verification_details>
</software_verification>

<source_reputation>
${reputationResult}
</source_reputation>

<decision_tree>
Follow this decision tree IN ORDER:

**PRIORITY 0 - VERIFIED LEGITIMATE SOFTWARE FROM OFFICIAL SOURCE (SAFE)**
If software_verification shows [VERIFIED_LEGITIMATE_SOFTWARE] AND [OFFICIAL_SOURCE]:
→ riskLevel: "safe" or "low", riskScore: 10-30
→ This is legitimate software from an authorized distribution channel

**PRIORITY 1 - MIME MISMATCH (CRITICAL)**
If mime_mismatch is YES → riskLevel: "critical", riskScore: 90-100
This indicates the file is disguised as something else (common malware trick)

**PRIORITY 2 - DOUBLE EXTENSION (CRITICAL)**
If double_extension is YES → riskLevel: "critical", riskScore: 85-95
Example: "invoice.pdf.exe" is malware pretending to be a PDF

**PRIORITY 3 - MALICIOUS REPUTATION (HIGH/CRITICAL)**
If source_reputation contains scam/malware reports → riskLevel: "high" or "critical"

**PRIORITY 4 - LEGITIMATE SOFTWARE FROM THIRD-PARTY (MEDIUM)**
If [VERIFIED_LEGITIMATE_SOFTWARE] but [THIRD_PARTY_SOURCE]:
→ riskLevel: "medium", riskScore: 40-60
→ Recommend downloading from official source instead

**PRIORITY 5 - EXECUTABLE FROM UNTRUSTED (HIGH)**
If extension_risk is "critical" or "high" AND source_trusted is NO:
→ riskLevel: "high", riskScore: 70-85

**PRIORITY 6 - ARCHIVE FROM UNTRUSTED (MEDIUM)**
If is_archive is YES AND source_trusted is NO:
→ riskLevel: "medium", riskScore: 50-65
Archives can hide executables and should be scanned

**PRIORITY 7 - TRUSTED SOURCE (SAFE/LOW)**
If source_trusted is YES AND no red flags:
→ riskLevel: "safe" or "low", riskScore: 5-25

**PRIORITY 8 - UNKNOWN BUT BENIGN (LOW/MEDIUM)**
If no red flags but source is unknown:
→ riskLevel: "low" or "medium", recommend antivirus scan
</decision_tree>

<examples>
Example 1 - Disguised Malware:
File: invoice.pdf.exe, Domain: random-site.xyz
MIME: application/x-msdownload (but filename ends in .pdf.exe)
Result: {"riskLevel": "critical", "riskScore": 95, "reasoning": "Double extension detected - executable disguised as PDF", "sourceReputation": "suspicious", "recommendations": ["Do not open this file", "This is a known malware distribution technique"]}

Example 2 - Archive from Unknown Source:
File: software.zip, Domain: free-downloads.net
Result: {"riskLevel": "medium", "riskScore": 55, "reasoning": "Archive file from unknown source may contain hidden executables", "sourceReputation": "neutral", "recommendations": ["Extract and scan with antivirus before running any files", "Verify the source is legitimate"]}

Example 3 - Safe Download:
File: document.pdf, Domain: drive.google.com
Result: {"riskLevel": "safe", "riskScore": 5, "reasoning": "PDF file from trusted Google Drive source", "sourceReputation": "trusted", "recommendations": []}

Example 4 - Executable from Known Source:
File: installer.exe, Domain: github.com
Result: {"riskLevel": "low", "riskScore": 20, "reasoning": "Executable from trusted GitHub. Verify it's from the official repository.", "sourceReputation": "trusted", "recommendations": ["Verify this is from an official/trusted repository"]}
</examples>

<constraints>
- MIME mismatch is ALWAYS critical (indicates disguised file)
- Double extensions are ALWAYS critical (indicates malware)
- Archives from untrusted sources should be at least "medium" risk
- Include at least one recommendation for non-safe files
- Be specific about the threat type in reasoning
</constraints>

<output_format>
Return ONLY valid JSON:
{
  "riskLevel": "safe" | "low" | "medium" | "high" | "critical",
  "riskScore": 0-100,
  "reasoning": "specific explanation",
  "sourceReputation": "trusted" | "neutral" | "suspicious" | "malicious",
  "recommendations": ["action items for user"]
}
</output_format>`;

    try {
        console.log('[AI-Download] Sending to Gemini for analysis...');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: downloadAnalysisSchema,
                temperature: 0
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

    } catch (error: any) {
        // Check for rate limit error (429) - fallback to lite model
        if (error?.status === 429) {
            console.log('[AI-Download] Rate limited on gemini-2.5-flash, falling back to gemini-2.5-flash-lite...');
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                const fallbackResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-lite',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: downloadAnalysisSchema,
                        temperature: 0
                    }
                });

                const fallbackResult = JSON.parse(fallbackResponse.text || '{}');
                console.log('[AI-Download] Fallback analysis complete:', fallbackResult.riskLevel);

                const shouldBlock = fallbackResult.riskLevel === 'critical' ||
                    (fallbackResult.riskLevel === 'high' && fallbackResult.riskScore >= 80);

                return {
                    riskLevel: fallbackResult.riskLevel,
                    riskScore: fallbackResult.riskScore,
                    reasoning: fallbackResult.reasoning,
                    sourceReputation: fallbackResult.sourceReputation,
                    recommendations: fallbackResult.recommendations || [],
                    shouldBlock,
                    allowOverride: fallbackResult.riskLevel !== 'critical'
                };
            } catch (fallbackError) {
                console.error('[AI-Download] Fallback also failed:', fallbackError);
                // Continue to local analysis fallback below
            }
        }

        console.error('[AI-Download] Analysis error:', error);

        // Enhanced fallback with MIME check
        let riskScore = localAnalysis.extensionRisk === 'critical' ? 90 :
            localAnalysis.extensionRisk === 'high' ? 70 :
                localAnalysis.extensionRisk === 'medium' ? 50 :
                    localAnalysis.extensionRisk === 'low' ? 30 : 10;

        // Increase risk for MIME mismatch
        if (localAnalysis.mimeCheck.hasMismatch) {
            riskScore = Math.max(riskScore, 85);
        }

        // Increase risk for archives from untrusted sources
        if (localAnalysis.isArchive && !localAnalysis.isTrusted) {
            riskScore = Math.max(riskScore, 55);
        }

        const riskLevel = riskScore >= 85 ? 'critical' :
            riskScore >= 70 ? 'high' :
                riskScore >= 50 ? 'medium' :
                    riskScore >= 25 ? 'low' : 'safe';

        return {
            riskLevel: riskLevel as DownloadAnalysis['riskLevel'],
            riskScore,
            reasoning: localAnalysis.mimeCheck.hasMismatch
                ? `MIME type mismatch detected! ${localAnalysis.mimeCheck.details}`
                : `AI analysis unavailable. Local analysis based on file extension (${localAnalysis.extensionRisk} risk).`,
            sourceReputation: localAnalysis.isTrusted ? 'trusted' : 'neutral',
            recommendations: riskLevel !== 'safe' ?
                ['Scan file with antivirus before opening'] : [],
            shouldBlock: riskLevel === 'critical' && !localAnalysis.isTrusted,
            allowOverride: riskLevel !== 'critical'
        };
    }
}

// Check if AI client is available
export function isAIAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY;
}

console.log('[AI-Download] Analyzer initialized');

