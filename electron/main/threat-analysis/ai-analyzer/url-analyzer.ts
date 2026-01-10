/**
 * URL Context Analyzer
 * Uses Gemini's URL Context tool for deep content analysis
 * Based on docs/gemini.md URL context documentation
 */

import { GoogleGenAI } from '@google/genai';
import { GeminiThreatAnalysis } from '../../../../src/shared/types';
import { GEMINI } from '../../../../src/shared/constants';

/**
 * Extended analysis result with content insights
 */
export interface UrlContentAnalysis extends GeminiThreatAnalysis {
    contentAnalysis?: {
        pageTitle: string;
        hasLoginForm: boolean;
        hasSensitiveInputs: boolean;
        textIndicators: string[];
        brandMentions: string[];
        urlRetrievalStatus: 'success' | 'failed' | 'unsafe';
    };
}

// JSON Schema for content-aware threat analysis
const CONTENT_ANALYSIS_SCHEMA = {
    type: 'object',
    properties: {
        threatType: {
            type: 'string',
            enum: ['phishing', 'malware', 'social_engineering', 'safe'],
            description: 'The type of threat detected'
        },
        confidence: {
            type: 'number',
            description: 'Confidence score between 0.0 and 1.0'
        },
        indicators: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    type: { type: 'string' },
                    description: { type: 'string' },
                    severity: {
                        type: 'string',
                        enum: ['critical', 'high', 'medium', 'low', 'info']
                    }
                },
                required: ['type', 'description', 'severity']
            }
        },
        recommendation: {
            type: 'string',
            enum: ['block', 'warn', 'allow']
        },
        contentAnalysis: {
            type: 'object',
            properties: {
                pageTitle: { type: 'string', description: 'Title of the page' },
                hasLoginForm: { type: 'boolean', description: 'Whether page has login form' },
                hasSensitiveInputs: { type: 'boolean', description: 'Whether page has password/card inputs' },
                textIndicators: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Suspicious text patterns found (urgency, threats, etc.)'
                },
                brandMentions: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Brand names mentioned on the page'
                }
            },
            required: ['pageTitle', 'hasLoginForm', 'hasSensitiveInputs', 'textIndicators', 'brandMentions']
        }
    },
    required: ['threatType', 'confidence', 'indicators', 'recommendation', 'contentAnalysis']
};

/**
 * URL Content Analyzer
 * Fetches and analyzes page content using Gemini's URL Context tool
 */
export class UrlContentAnalyzer {
    private client: GoogleGenAI | null = null;
    private isInitialized = false;

    constructor() {
        this.initialize();
    }

    /**
     * Initialize the Gemini client
     */
    private initialize(): void {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            console.warn('[UrlAnalyzer] API key not configured. Content analysis disabled.');
            return;
        }

        try {
            this.client = new GoogleGenAI({ apiKey });
            this.isInitialized = true;
            console.log('[UrlAnalyzer] Client initialized successfully');
        } catch (error) {
            console.error('[UrlAnalyzer] Failed to initialize client:', error);
        }
    }

    /**
     * Check if content analysis is available
     */
    isAvailable(): boolean {
        return this.isInitialized && this.client !== null;
    }

    /**
     * Analyze URL with content fetching using URL Context tool
     * This provides deeper analysis by examining actual page content
     */
    async analyzeWithContent(url: string, context?: {
        referrer?: string | null;
        redirectChain?: string[];
    }): Promise<UrlContentAnalysis | null> {
        if (!this.isAvailable()) {
            console.log('[UrlAnalyzer] Content analysis not available, skipping');
            return null;
        }

        const startTime = Date.now();

        try {
            const prompt = this.buildContentAnalysisPrompt(url, context);

            console.log(`[UrlAnalyzer] Fetching and analyzing content for: ${url.substring(0, 60)}...`);

            const response = await this.client!.models.generateContent({
                model: GEMINI.MODEL,
                contents: prompt,
                config: {
                    // Enable URL Context tool to fetch page content
                    tools: [{ urlContext: {} }],
                    // Sending responseMimeType: 'application/json' with tools is currently unsupported
                    // We must parse the JSON manually from the text response
                    responseMimeType: undefined,
                    responseJsonSchema: undefined,
                    temperature: GEMINI.TEMPERATURE
                }
            });

            const text = response.text;
            if (!text) {
                console.warn('[UrlAnalyzer] Empty response received');
                return null;
            }

            let result: UrlContentAnalysis;

            // Manually parse JSON from text when tools are used
            try {
                // Extract JSON from markdown code blocks if present
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
                const jsonString = jsonMatch ? jsonMatch[1] : text;
                result = JSON.parse(jsonString) as UrlContentAnalysis;
            } catch (e) {
                console.warn('[UrlAnalyzer] Failed to parse JSON from tool response', e);
                // Fallback or return null
                return null;
            }

            // Check URL context metadata for retrieval status
            const urlMetadata = response.candidates?.[0]?.urlContextMetadata;
            if (urlMetadata?.urlMetadata) {
                const retrievalStatus = urlMetadata.urlMetadata[0]?.urlRetrievalStatus;
                if (result.contentAnalysis) {
                    if (retrievalStatus === 'URL_RETRIEVAL_STATUS_SUCCESS') {
                        result.contentAnalysis.urlRetrievalStatus = 'success';
                    } else if (retrievalStatus === 'URL_RETRIEVAL_STATUS_UNSAFE') {
                        result.contentAnalysis.urlRetrievalStatus = 'unsafe';
                        // Boost confidence if URL was flagged as unsafe
                        result.confidence = Math.max(result.confidence, 0.8);
                        result.indicators.push({
                            type: 'unsafe_content',
                            description: 'URL content flagged as unsafe by safety checks',
                            severity: 'high'
                        });
                    } else {
                        result.contentAnalysis.urlRetrievalStatus = 'failed';
                    }
                }
            }

            const latency = Date.now() - startTime;
            console.log(`[UrlAnalyzer] Content analysis complete in ${latency}ms:`, {
                url: url.substring(0, 50),
                threatType: result.threatType,
                confidence: result.confidence,
                hasLoginForm: result.contentAnalysis?.hasLoginForm,
                retrievalStatus: result.contentAnalysis?.urlRetrievalStatus
            });

            return result;
        } catch (error) {
            console.error('[UrlAnalyzer] Content analysis error:', error);
            return null;
        }
    }

    /**
     * Build prompt for content-aware analysis
     */
    private buildContentAnalysisPrompt(url: string, context?: {
        referrer?: string | null;
        redirectChain?: string[];
    }): string {
        let prompt = `Fetch and analyze the content of this URL for security threats: ${url}

You are a cybersecurity expert. Use the URL Context tool to fetch the page content and analyze it for threats.

## Content Analysis Tasks:
1. **Check for Credential Harvesting Forms**
   - Look for login forms, password fields, credit card inputs
   - Verify if form targets match the apparent domain

2. **Detect Brand Impersonation**
   - Compare page branding (logos, colors, text) to legitimate sites
   - Check if domain matches brand mentioned on page
   - Look for mismatched SSL certificates

3. **Identify Social Engineering Tactics**
   - Fake urgency: "Your account will be suspended!", "Act now!"
   - Fear tactics: "Your computer is infected", "You've been hacked"
   - Too-good-to-be-true: "You've won!", "Free iPhone"

4. **Check Page Structure**
   - Analyze form action URLs
   - Look for obfuscated JavaScript
   - Check for suspicious redirects

5. **Verify Brand Consistency**
   - Does the domain match brands mentioned on the page?
   - Are there logo/branding inconsistencies?`;

        if (context?.referrer) {
            prompt += `\n\nReferrer: ${context.referrer}`;
        }

        if (context?.redirectChain && context.redirectChain.length > 0) {
            prompt += `\n\nRedirect chain: ${context.redirectChain.join(' -> ')}`;
        }

        prompt += `

Provide structured analysis with:
- threatType: 'phishing', 'malware', 'social_engineering', or 'safe'
- confidence: 0.0 to 1.0
- indicators: specific content-based evidence found
- recommendation: 'block', 'warn', or 'allow'
- contentAnalysis: page details (title, forms, text patterns, brands)

Be thorough but conservative: only flag genuine threats with evidence.`;

        return prompt;
    }
}

// Singleton instance
let urlAnalyzerInstance: UrlContentAnalyzer | null = null;

export function getUrlContentAnalyzer(): UrlContentAnalyzer {
    if (!urlAnalyzerInstance) {
        urlAnalyzerInstance = new UrlContentAnalyzer();
    }
    return urlAnalyzerInstance;
}
