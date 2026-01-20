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
        const prompt = this.buildContentAnalysisPrompt(url, context);

        try {
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
        } catch (error: any) {
            // Check for rate limit error (429) - fallback to lite model
            if (error?.status === 429) {
                console.log('[UrlAnalyzer] Rate limited on primary model, falling back to gemini-2.5-flash-lite...');
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const fallbackResponse = await this.client!.models.generateContent({
                        model: GEMINI.FALLBACK_MODEL,
                        contents: prompt,
                        config: {
                            tools: [{ urlContext: {} }],
                            responseMimeType: undefined,
                            responseJsonSchema: undefined,
                            temperature: GEMINI.TEMPERATURE
                        }
                    });

                    const fallbackText = fallbackResponse.text;
                    if (fallbackText) {
                        const jsonMatch = fallbackText.match(/```json\s*([\s\S]*?)\s*```/) || fallbackText.match(/```\s*([\s\S]*?)\s*```/);
                        const jsonString = jsonMatch ? jsonMatch[1] : fallbackText;
                        const fallbackResult = JSON.parse(jsonString) as UrlContentAnalysis;
                        console.log('[UrlAnalyzer] Fallback analysis complete');
                        return fallbackResult;
                    }
                } catch (fallbackError) {
                    console.error('[UrlAnalyzer] Fallback also failed:', fallbackError);
                }
            }
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
        let contextSection = '';
        if (context?.referrer) {
            contextSection += `\n<referrer>${context.referrer}</referrer>`;
        }
        if (context?.redirectChain && context.redirectChain.length > 0) {
            contextSection += `\n<redirect_chain>${context.redirectChain.join(' → ')}</redirect_chain>`;
        }

        return `<role>
You are a cybersecurity expert specializing in web content analysis and phishing detection.
Your analysis protects users from credential theft, malware, and social engineering attacks.
</role>

<task>
Fetch and analyze the content of this URL for security threats using the URL Context tool.
URL: ${url}
</task>
${contextSection}

<analysis_checklist>
**1. Credential Harvesting Detection**
- Scan for login forms, password fields, credit card inputs
- Check if form action URLs point to the same domain or suspicious external domains
- Look for hidden form fields that may capture extra data

**2. Brand Impersonation Detection**
- Identify what brands/companies are referenced (logos, text, names)
- Compare the actual domain to brands mentioned
- Example: If page shows PayPal branding but domain is "paypa1-security.com" → PHISHING

**3. Social Engineering Tactics**
- Urgency: "Act now!", "Limited time!", "Your account will be suspended!"
- Fear: "Your computer is infected!", "You've been hacked!"
- Greed: "You've won!", "Free prize!", "Claim your reward!"

**4. Technical Red Flags**
- Obfuscated or suspicious JavaScript
- Form actions pointing to different domains
- Excessive redirects
- Missing or invalid SSL references

**5. Content Legitimacy**
- Does the content match what you'd expect from this domain?
- Is the page professionally designed or hastily made?
- Are there spelling/grammar errors typical of phishing?
</analysis_checklist>

<decision_tree>
**PHISHING (confidence 0.8-1.0)**:
- Login form on non-matching domain (paypal form on not-paypal.com)
- Brand impersonation detected
- Urgency + credential request

**SOCIAL_ENGINEERING (confidence 0.7-0.9)**:
- Fear/greed tactics without actual credential forms
- Fake virus warnings
- Prize/lottery scams

**MALWARE (confidence 0.8-1.0)**:
- Content flagged as unsafe
- Forced downloads
- Malicious scripts detected

**SAFE (confidence 0.8-1.0)**:
- Content matches domain purpose
- No credential harvesting
- No brand impersonation
- Professional, legitimate content
</decision_tree>

<output_format>
Return ONLY valid JSON matching this structure:
{
  "threatType": "phishing" | "malware" | "social_engineering" | "safe",
  "confidence": 0.0-1.0,
  "indicators": [
    {"type": "string", "description": "string", "severity": "critical|high|medium|low|info"}
  ],
  "recommendation": "block" | "warn" | "allow",
  "contentAnalysis": {
    "pageTitle": "actual page title",
    "hasLoginForm": true/false,
    "hasSensitiveInputs": true/false,
    "textIndicators": ["any suspicious text patterns found"],
    "brandMentions": ["brands/companies mentioned on page"]
  }
}
</output_format>

<constraints>
- Use URL Context tool to fetch actual page content
- Only report what you actually find in the content
- Brand mismatch (content vs domain) is ALWAYS suspicious
- Login forms on mismatched domains are CRITICAL
- Be conservative: only flag genuine threats with evidence
</constraints>`;
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
