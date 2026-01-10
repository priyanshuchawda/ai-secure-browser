/**
 * Gemini AI Client for Threat Analysis
 * Uses structured outputs per docs/gemini_structured.md
 * 
 * TWO-STEP SEQUENTIAL ANALYSIS:
 * 1. Google Search → Get domain reputation
 * 2. URL Context (Fetch) → Get page content
 * 3. Final Analysis → Combine both signals for decision
 */

import { GoogleGenAI } from '@google/genai';
import { GeminiThreatAnalysis } from '../../../../src/shared/types';
import { GEMINI } from '../../../../src/shared/constants';

// JSON Schema for threat analysis response
const THREAT_ANALYSIS_SCHEMA = {
    type: 'object',
    properties: {
        threatType: {
            type: 'string',
            enum: ['phishing', 'malware', 'social_engineering', 'safe'],
            description: 'The type of threat detected, or "safe" if no threat'
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
                    type: {
                        type: 'string',
                        description: 'Type of indicator (domain_typo, credential_form, fake_urgency, etc.)'
                    },
                    description: {
                        type: 'string',
                        description: 'Human-readable explanation of the indicator'
                    },
                    severity: {
                        type: 'string',
                        enum: ['critical', 'high', 'medium', 'low', 'info']
                    }
                },
                required: ['type', 'description', 'severity']
            },
            description: 'List of specific threat indicators detected'
        },
        recommendation: {
            type: 'string',
            enum: ['block', 'warn', 'allow'],
            description: 'Recommended action based on analysis'
        }
    },
    required: ['threatType', 'confidence', 'indicators', 'recommendation']
};

/**
 * Gemini AI Analyzer
 * Performs AI-powered threat analysis using Gemini 2.5 Flash
 * with sequential Google Search → URL Fetch → Final Decision flow
 */
export class GeminiAnalyzer {
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
            console.warn('[Gemini] API key not configured. AI analysis will be disabled.');
            console.warn('[Gemini] Set GEMINI_API_KEY in .env file');
            return;
        }

        try {
            this.client = new GoogleGenAI({ apiKey });
            this.isInitialized = true;
            console.log('[Gemini] Client initialized successfully');
        } catch (error) {
            console.error('[Gemini] Failed to initialize client:', error);
        }
    }

    /**
     * Check if AI analysis is available
     */
    isAvailable(): boolean {
        return this.isInitialized && this.client !== null;
    }

    /**
     * Analyze a URL for security threats using TWO-STEP sequential analysis:
     * 1. Google Search for domain reputation
     * 2. URL Context fetch for page content
     * 3. Final decision combining both signals
     */
    async analyze(url: string, context?: {
        referrer?: string | null;
        redirectChain?: string[];
    }): Promise<GeminiThreatAnalysis | null> {
        if (!this.isAvailable()) {
            console.log('[Gemini] AI analysis not available, skipping');
            return null;
        }

        const startTime = Date.now();

        try {
            // ===== STEP 1: Google Search for domain reputation =====
            console.log(`[Gemini] Step 1: Google Search for domain reputation...`);
            const searchResult = await this.doGoogleSearch(url);
            console.log(`[Gemini] Search complete: ${searchResult ? 'found info' : 'no results'}`);

            // ===== STEP 2: URL Context fetch for page content =====
            console.log(`[Gemini] Step 2: Fetching page content...`);
            const contentResult = await this.doUrlFetch(url);
            console.log(`[Gemini] Fetch complete: ${contentResult ? 'got content' : 'failed'}`);

            // ===== STEP 3: Final analysis combining both signals =====
            console.log(`[Gemini] Step 3: Final analysis with both signals...`);
            const result = await this.doFinalAnalysis(url, searchResult, contentResult, context);

            const latency = Date.now() - startTime;
            console.log(`[Gemini] Analysis complete in ${latency}ms:`, {
                url: url.substring(0, 50),
                threatType: result?.threatType,
                confidence: result?.confidence
            });

            return result;
        } catch (error) {
            console.error('[Gemini] Analysis error:', error);
            return null;
        }
    }

    /**
     * Step 1: Use Google Search to get domain reputation info
     */
    private async doGoogleSearch(url: string): Promise<string | null> {
        try {
            const domain = new URL(url).hostname;
            const prompt = `Search for information about the domain "${domain}". 
Find:
1. Is this a legitimate website? 
2. What company/person owns it?
3. Are there any scam reports or security warnings?
4. What is the purpose of this website?

Search queries to try:
- "${domain}" reviews
- "is ${domain} safe"
- "${domain}" scam or legit
- "${domain}" official website

Summarize what you find in a brief report.`;

            const response = await this.client!.models.generateContent({
                model: GEMINI.MODEL,
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: GEMINI.TEMPERATURE
                }
            });

            return response.text || null;
        } catch (error) {
            console.warn('[Gemini] Google Search step failed:', error);
            return null;
        }
    }

    /**
     * Step 2: Use URL Context to fetch and analyze page content
     */
    private async doUrlFetch(url: string): Promise<string | null> {
        try {
            const prompt = `Fetch the content from this URL and describe what you see: ${url}

Analyze:
1. What is the page title?
2. What is the main purpose of this page?
3. Does it have login forms or password fields?
4. Does it ask for sensitive information (credit card, SSN, etc.)?
5. What brands or companies are mentioned?
6. Are there any urgency messages like "Act now!" or "Your account is at risk!"?
7. Does the content match what you'd expect from the domain name?

Provide a factual summary of the page content.`;

            const response = await this.client!.models.generateContent({
                model: GEMINI.MODEL,
                contents: prompt,
                config: {
                    tools: [{ urlContext: {} }],
                    temperature: GEMINI.TEMPERATURE
                }
            });

            // Check if URL fetch was successful
            const urlMetadata = response.candidates?.[0]?.urlContextMetadata;
            if (urlMetadata?.urlMetadata?.[0]?.urlRetrievalStatus === 'URL_RETRIEVAL_STATUS_UNSAFE') {
                return '[UNSAFE_CONTENT_BLOCKED] The URL content was blocked by safety filters.';
            }

            return response.text || null;
        } catch (error) {
            console.warn('[Gemini] URL fetch step failed:', error);
            return null;
        }
    }

    /**
     * Step 3: Final analysis combining Google Search + URL Content
     */
    private async doFinalAnalysis(
        url: string,
        searchResult: string | null,
        contentResult: string | null,
        context?: {
            referrer?: string | null;
            redirectChain?: string[];
        }
    ): Promise<GeminiThreatAnalysis | null> {
        const prompt = this.buildFinalAnalysisPrompt(url, searchResult, contentResult, context);

        const response = await this.client!.models.generateContent({
            model: GEMINI.MODEL,
            contents: prompt,
            config: {
                // No tools needed - we already have all the information
                responseMimeType: GEMINI.RESPONSE_MIME_TYPE,
                responseJsonSchema: THREAT_ANALYSIS_SCHEMA,
                temperature: GEMINI.TEMPERATURE
            }
        });

        const text = response.text;
        if (!text) {
            console.warn('[Gemini] Empty response from final analysis');
            return null;
        }

        try {
            return JSON.parse(text) as GeminiThreatAnalysis;
        } catch (e) {
            console.warn('[Gemini] Failed to parse final analysis JSON:', e);
            // Try to extract JSON from the text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0]) as GeminiThreatAnalysis;
                } catch {
                    // Fall through to default
                }
            }
            return {
                threatType: 'safe',
                confidence: 0.5,
                indicators: [{ type: 'analysis_error', description: 'Could not complete analysis', severity: 'low' }],
                recommendation: 'warn'
            };
        }
    }

    /**
     * Build the final analysis prompt with all gathered information
     */
    private buildFinalAnalysisPrompt(
        url: string,
        searchResult: string | null,
        contentResult: string | null,
        context?: {
            referrer?: string | null;
            redirectChain?: string[];
        }
    ): string {
        let prompt = `You are a cybersecurity expert. Analyze this URL for security threats based on the information gathered.

## URL to Analyze
${url}

## STEP 1 - Google Search Results (Domain Reputation)
${searchResult ? searchResult : '[No search results available - could not verify domain reputation]'}

## STEP 2 - Page Content Analysis
${contentResult ? contentResult : '[Could not fetch page content]'}
`;

        if (context?.referrer) {
            prompt += `\n## Referrer\n${context.referrer}\n`;
        }

        if (context?.redirectChain && context.redirectChain.length > 0) {
            prompt += `\n## Redirect Chain\n${context.redirectChain.join(' -> ')}\n`;
        }

        prompt += `
## Your Task
Based on BOTH the Google Search results AND the page content analysis, determine if this URL is a threat.

Consider:
1. **Domain Reputation**: What did Google Search reveal about this domain? Is it a known legitimate site?
2. **Content Analysis**: Does the page content match what you'd expect? Any suspicious forms or urgency tactics?
3. **Consistency**: Does the domain name match the content? (e.g., a banking page on a non-bank domain is suspicious)

## Decision Guidelines
- If Google Search shows this is a LEGITIMATE known website with good reputation, mark as 'safe' (confidence 0.9-1.0)
- If the domain is unknown BUT the content looks like a normal personal/business site without phishing indicators, mark as 'safe' (confidence 0.7-0.9)
- If there are phishing indicators (fake login, brand impersonation, urgency tactics), mark as 'phishing' with appropriate confidence
- DO NOT flag a site as phishing just because the TLD is uncommon (.xyz, .io, etc.) - many legitimate sites use these
- DO NOT flag personal portfolios, blogs, or small business sites as phishing unless there's actual evidence of malicious intent

Return your analysis as JSON with:
- threatType: 'phishing', 'malware', 'social_engineering', or 'safe'
- confidence: 0.0 to 1.0
- indicators: specific evidence for your decision (from search or content)
- recommendation: 'block', 'warn', or 'allow'`;

        return prompt;
    }
}

// Singleton instance
let geminiInstance: GeminiAnalyzer | null = null;

export function getGeminiAnalyzer(): GeminiAnalyzer {
    if (!geminiInstance) {
        geminiInstance = new GeminiAnalyzer();
    }
    return geminiInstance;
}
