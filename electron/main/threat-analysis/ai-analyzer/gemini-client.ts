/**
 * Gemini AI Client for Threat Analysis
 * Uses structured outputs per docs/gemini_structured.md
 * 
 * TWO-STEP SEQUENTIAL ANALYSIS:
 * 1. Web Search → Get domain reputation
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
 * with sequential Web Search → URL Fetch → Final Decision flow
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
            console.warn('[AI] API key not configured. AI analysis will be disabled.');
            console.warn('[AI] Set GEMINI_API_KEY in .env file');
            return;
        }

        try {
            this.client = new GoogleGenAI({ apiKey });
            this.isInitialized = true;
            console.log('[AI] Client initialized successfully');
        } catch (error) {
            console.error('[AI] Failed to initialize client:', error);
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
     * 1. Web Search for domain reputation
     * 2. URL Context fetch for page content
     * 3. Final decision combining both signals
     */
    async analyze(url: string, context?: {
        referrer?: string | null;
        redirectChain?: string[];
    }): Promise<GeminiThreatAnalysis | null> {
        if (!this.isAvailable()) {
            console.log('[AI] AI analysis not available, skipping');
            return null;
        }

        const startTime = Date.now();

        try {
            // ===== STEP 1: Web Search for domain reputation =====
            console.log(`[AI] Step 1: Web Search for domain reputation...`);
            const searchResult = await this.doGoogleSearch(url);
            console.log(`[AI] Search complete: ${searchResult ? 'found info' : 'no results'}`);

            // ===== STEP 2: URL Context fetch for page content =====
            console.log(`[AI] Step 2: Fetching page content...`);
            const contentResult = await this.doUrlFetch(url);
            console.log(`[AI] Fetch complete: ${contentResult ? 'got content' : 'failed'}`);

            // ===== STEP 3: Final analysis combining both signals =====
            console.log(`[AI] Step 3: Final analysis with both signals...`);
            const result = await this.doFinalAnalysis(url, searchResult, contentResult, context);

            const latency = Date.now() - startTime;
            console.log(`[AI] Analysis complete in ${latency}ms:`, {
                url: url.substring(0, 50),
                threatType: result?.threatType,
                confidence: result?.confidence
            });

            return result;
        } catch (error) {
            console.error('[AI] Analysis error:', error);
            return null;
        }
    }

    /**
     * Step 1: Use Web Search to get domain reputation info
     */
    private async doGoogleSearch(url: string, useFallback: boolean = false): Promise<string | null> {
        try {
            const domain = new URL(url).hostname;
            const model = useFallback ? GEMINI.FALLBACK_MODEL : GEMINI.MODEL;
            const prompt = `<role>
You are a security researcher investigating domain reputation.
</role>

<task>
Search for information about the domain "${domain}" to determine if it is legitimate or potentially malicious.
</task>

<search_queries>
Execute these search queries in order:
1. "${domain}" site reputation
2. "${domain}" scam OR fraud OR phishing
3. "${domain}" official website owner
4. "is ${domain} safe" reviews
</search_queries>

<constraints>
- Report ONLY factual findings from search results
- If NO search results are found, explicitly state: "[NO_REPUTATION_DATA]"
- If the domain appears in scam reports, state: "[SCAM_REPORTS_FOUND]"
- If the domain is verified as legitimate (official company), state: "[VERIFIED_LEGITIMATE]"
</constraints>

<output_format>
Structure your response as:
1. **Domain Owner**: [Company/Person name or "Unknown"]
2. **Reputation Status**: [VERIFIED_LEGITIMATE | NO_REPUTATION_DATA | SCAM_REPORTS_FOUND | MIXED_REVIEWS]
3. **Key Findings**: [Brief summary of what search revealed]
4. **Red Flags**: [Any concerning findings, or "None found"]
</output_format>`;

            const response = await this.client!.models.generateContent({
                model: model,
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: GEMINI.TEMPERATURE
                }
            });

            return response.text || '[NO_REPUTATION_DATA] Search returned no results.';
        } catch (error: any) {
            // Check for rate limit error (429)
            if (error?.status === 429 && !useFallback) {
                console.log(`[AI] Rate limited on search, falling back to ${GEMINI.FALLBACK_MODEL}...`);
                await new Promise(resolve => setTimeout(resolve, 500));
                return this.doGoogleSearch(url, true);
            }
            console.warn('[AI] Web Search step failed:', error);
            return '[NO_REPUTATION_DATA] Web search failed due to error.';
        }
    }

    /**
     * Step 2: Use URL Context to fetch and analyze page content
     */
    private async doUrlFetch(url: string, useFallback: boolean = false): Promise<string | null> {
        try {
            const model = useFallback ? GEMINI.FALLBACK_MODEL : GEMINI.MODEL;
            const prompt = `<role>
You are a web content analyst examining a URL for security assessment.
</role>

<task>
Fetch and analyze the content at: ${url}
</task>

<instructions>
**STEP 1 - ACCESSIBILITY CHECK (MANDATORY FIRST)**
Before any content analysis, determine if the website is accessible.

If the URL has ANY of these issues, your response MUST start with the corresponding tag:
- DNS error, domain not found → START with: "[DOMAIN_NOT_ACCESSIBLE]"
- 404 Not Found, page doesn't exist → START with: "[ERROR_PAGE_404]"
- Connection refused, timeout → START with: "[CONNECTION_FAILED]"
- Blank page, no content → START with: "[MINIMAL_CONTENT]"
- Redirect to error page → START with: "[ERROR_REDIRECT]"

**STEP 2 - CONTENT ANALYSIS (Only if accessible)**
If the site IS accessible, analyze and report:
</instructions>

<analysis_checklist>
1. **Page Title**: What is the exact title tag?
2. **Primary Purpose**: What is this page for? (e-commerce, blog, login, info, etc.)
3. **Login/Credential Forms**: Are there password fields, login forms, or "Sign In" buttons?
4. **Sensitive Data Requests**: Does it ask for credit cards, SSN, bank info, or personal documents?
5. **Brand References**: What companies, logos, or brand names appear?
6. **Urgency Tactics**: Any messages like "Act now!", "Account suspended!", "Verify immediately!"?
7. **Domain-Content Match**: Does the content match what you'd expect from this domain name?
8. **SSL/Security Indicators**: Any security warnings or certificate issues?
</analysis_checklist>

<output_format>
If NOT accessible: "[STATUS_TAG] Brief explanation of the error"

If accessible:
**Accessibility**: ACCESSIBLE
**Page Title**: [title]
**Purpose**: [description]
**Risk Indicators Found**: [list any suspicious elements, or "None"]
**Content Summary**: [2-3 sentence description]
</output_format>`;

            const response = await this.client!.models.generateContent({
                model: model,
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

            // Check for retrieval failure
            if (urlMetadata?.urlMetadata?.[0]?.urlRetrievalStatus === 'URL_RETRIEVAL_STATUS_ERROR') {
                return '[DOMAIN_NOT_ACCESSIBLE] Failed to retrieve URL content - domain may not exist or is unreachable.';
            }

            return response.text || '[MINIMAL_CONTENT] No content returned from URL fetch.';
        } catch (error: any) {
            // Check for rate limit error (429)
            if (error?.status === 429 && !useFallback) {
                console.log(`[AI] Rate limited on fetch, falling back to ${GEMINI.FALLBACK_MODEL}...`);
                await new Promise(resolve => setTimeout(resolve, 500));
                return this.doUrlFetch(url, true);
            }
            console.warn('[AI] URL fetch step failed:', error);
            return '[DOMAIN_NOT_ACCESSIBLE] URL fetch failed - domain may not exist or connection error.';
        }
    }

    /**
     * Step 3: Final analysis combining Web Search + URL Content
     */
    private async doFinalAnalysis(
        url: string,
        searchResult: string | null,
        contentResult: string | null,
        context?: {
            referrer?: string | null;
            redirectChain?: string[];
        },
        useFallback: boolean = false
    ): Promise<GeminiThreatAnalysis | null> {
        const prompt = this.buildFinalAnalysisPrompt(url, searchResult, contentResult, context);
        const model = useFallback ? GEMINI.FALLBACK_MODEL : GEMINI.MODEL;

        try {
            const response = await this.client!.models.generateContent({
                model: model,
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
                console.warn('[AI] Empty response from final analysis');
                return null;
            }

            try {
                return JSON.parse(text) as GeminiThreatAnalysis;
            } catch (e) {
                console.warn('[AI] Failed to parse final analysis JSON:', e);
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
        } catch (error: any) {
            // Check for rate limit error (429)
            if (error?.status === 429 && !useFallback) {
                console.log(`[AI] Rate limited on ${GEMINI.MODEL}, falling back to ${GEMINI.FALLBACK_MODEL}...`);
                // Wait a bit before retrying with fallback model
                await new Promise(resolve => setTimeout(resolve, 500));
                return this.doFinalAnalysis(url, searchResult, contentResult, context, true);
            }
            throw error; // Re-throw if not rate limited or already using fallback
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
        let contextSection = '';
        if (context?.referrer) {
            contextSection += `\n<referrer>${context.referrer}</referrer>\n`;
        }
        if (context?.redirectChain && context.redirectChain.length > 0) {
            contextSection += `\n<redirect_chain>${context.redirectChain.join(' → ')}</redirect_chain>\n`;
        }

        return `<role>
You are an expert cybersecurity analyst specializing in phishing detection and malicious website identification.
Your decisions protect users from financial fraud, identity theft, and malware infections.
</role>

<task>
Analyze the URL "${url}" for security threats and provide a threat assessment.
</task>

<evidence>
<web_search_results>
${searchResult || '[NO_REPUTATION_DATA] No search results available - domain reputation unknown'}
</web_search_results>

<page_content_analysis>
${contentResult || '[CONTENT_UNAVAILABLE] Could not fetch page content'}
</page_content_analysis>
${contextSection}
</evidence>

<decision_tree>
Follow this decision tree IN ORDER. Stop at the first matching condition:

**PRIORITY 1 - INACCESSIBLE DOMAINS (BLOCK)**
If page_content_analysis contains ANY of these tags:
- "[DOMAIN_NOT_ACCESSIBLE]", "[ERROR_PAGE_404]", "[CONNECTION_FAILED]", "[ERROR_REDIRECT]", "[MINIMAL_CONTENT]"
→ threatType: "phishing", confidence: 0.75, recommendation: "warn"
→ Reasoning: Non-existent or broken domains are commonly used in phishing campaigns

**PRIORITY 2 - KNOWN MALICIOUS (BLOCK)**  
If web_search_results contains "[SCAM_REPORTS_FOUND]" OR mentions phishing/scam reports:
→ threatType: "phishing", confidence: 0.85-0.95, recommendation: "block"

**PRIORITY 3 - UNSAFE CONTENT (BLOCK)**
If page_content_analysis contains "[UNSAFE_CONTENT_BLOCKED]":
→ threatType: "malware", confidence: 0.9, recommendation: "block"

**PRIORITY 4 - PHISHING INDICATORS (WARN/BLOCK)**
If page analysis reveals ANY of these red flags:
- Login forms on non-official domains (e.g., paypal-secure.xyz asking for PayPal credentials)
- Brand impersonation (mentions Google, Microsoft, banks but domain doesn't match)
- Urgency tactics ("Account suspended!", "Verify immediately!", "24 hours to act!")
- Requests for sensitive data (SSN, credit card) outside of legitimate contexts
→ threatType: "phishing", confidence: 0.7-0.9, recommendation: "warn" or "block"

**PRIORITY 5 - VERIFIED LEGITIMATE (ALLOW)**
If web_search_results contains "[VERIFIED_LEGITIMATE]" AND content matches expected purpose:
→ threatType: "safe", confidence: 0.9-1.0, recommendation: "allow"

**PRIORITY 6 - UNKNOWN BUT BENIGN (ALLOW WITH CAUTION)**
If domain is unknown BUT:
- Site is accessible with real content
- No phishing indicators found
- Content appears legitimate (blog, business, portfolio, etc.)
→ threatType: "safe", confidence: 0.7-0.85, recommendation: "allow"
</decision_tree>

<examples>
Example 1 - Inaccessible Domain:
URL: https://secure-paypal-verify.xyz
Search: [NO_REPUTATION_DATA]
Content: [DOMAIN_NOT_ACCESSIBLE] DNS lookup failed
Decision: {"threatType": "phishing", "confidence": 0.75, "indicators": [{"type": "domain_nonexistent", "description": "Domain does not resolve - common phishing pattern", "severity": "high"}], "recommendation": "warn"}

Example 2 - Brand Impersonation:
URL: https://microsoft-account-verify.com
Search: No official Microsoft association found
Content: Login form asking for Microsoft credentials, urgency message about account suspension
Decision: {"threatType": "phishing", "confidence": 0.9, "indicators": [{"type": "brand_impersonation", "description": "Microsoft credentials requested on non-Microsoft domain", "severity": "critical"}, {"type": "urgency_tactics", "description": "Account suspension message to create panic", "severity": "high"}], "recommendation": "block"}

Example 3 - Legitimate Site:
URL: https://docs.google.com
Search: [VERIFIED_LEGITIMATE] Official Google service
Content: Google Docs interface, standard Google branding, no suspicious elements
Decision: {"threatType": "safe", "confidence": 0.98, "indicators": [{"type": "verified_legitimate", "description": "Official Google domain with matching content", "severity": "info"}], "recommendation": "allow"}

Example 4 - Unknown Personal Site:
URL: https://john-developer.io
Search: [NO_REPUTATION_DATA] Personal portfolio site
Content: Developer portfolio with projects, no login forms, no sensitive data requests
Decision: {"threatType": "safe", "confidence": 0.8, "indicators": [{"type": "benign_content", "description": "Personal portfolio with no malicious indicators", "severity": "info"}], "recommendation": "allow"}
</examples>

<constraints>
- You MUST follow the decision tree priority order
- Include at least one indicator with evidence from the search or content analysis
- Confidence MUST be between 0.0 and 1.0
- DO NOT mark sites as phishing just because they use uncommon TLDs (.xyz, .io, .dev, etc.)
- DO NOT mark sites as phishing just because they are unknown - require actual malicious indicators
- Non-existent domains ARE always suspicious - they cannot be legitimate
</constraints>

<output_format>
Return ONLY valid JSON matching this schema:
{
  "threatType": "phishing" | "malware" | "social_engineering" | "safe",
  "confidence": number (0.0-1.0),
  "indicators": [{"type": string, "description": string, "severity": "critical"|"high"|"medium"|"low"|"info"}],
  "recommendation": "block" | "warn" | "allow"
}
</output_format>`;
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
