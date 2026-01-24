/**
 * Safety Guidelines Generator
 * Uses Gemini AI to generate context-specific safety advice
 * when users choose to proceed to a flagged site
 */

import { GoogleGenAI } from '@google/genai';
import { ThreatAssessment, ThreatIndicator } from '../../../src/shared/types';

interface SafetyGuidelines {
    summary: string;
    doNots: string[];
    warnings: string[];
    technicalAdvice: string[];
    riskLevel: 'extreme' | 'high' | 'medium';
}

// JSON Schema for safety guidelines response
const SAFETY_GUIDELINES_SCHEMA = {
    type: 'object',
    properties: {
        summary: {
            type: 'string',
            description: 'A brief 2-3 sentence summary of the main risks'
        },
        doNots: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of 3-5 things the user should absolutely NOT do on this site'
        },
        warnings: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of 3-5 specific warnings and red flags to watch for'
        },
        technicalAdvice: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of 3-5 technical precautions the user can take'
        },
        riskLevel: {
            type: 'string',
            enum: ['extreme', 'high', 'medium'],
            description: 'Overall risk level of proceeding to this site'
        }
    },
    required: ['summary', 'doNots', 'warnings', 'technicalAdvice', 'riskLevel']
};

export class SafetyGuidelinesGenerator {
    private client: GoogleGenAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            throw new Error('[SafetyGuidelines] Gemini API key not configured');
        }

        this.client = new GoogleGenAI({ apiKey });
        console.log('[SafetyGuidelines] Generator initialized');
    }

    /**
     * Generate safety guidelines based on threat assessment
     */
    async generateGuidelines(
        assessment: ThreatAssessment,
        url: string
    ): Promise<SafetyGuidelines> {
        console.log('[SafetyGuidelines] Generating guidelines for:', url);

        const prompt = this.buildPrompt(assessment, url);

        try {
            const response = await this.client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseJsonSchema: SAFETY_GUIDELINES_SCHEMA,
                    temperature: 0.3
                }
            });
            
            // Parse JSON response
            const responseText = response.text || '{}';
            const guidelines = JSON.parse(responseText) as SafetyGuidelines;
            
            console.log('[SafetyGuidelines] Generated:', guidelines.doNots.length, 'guidelines');
            return guidelines;

        } catch (error) {
            console.error('[SafetyGuidelines] Error:', error);
            
            // Fallback to generic guidelines
            return this.generateFallbackGuidelines(assessment);
        }
    }

    /**
     * Build prompt for AI to generate guidelines
     */
    private buildPrompt(assessment: ThreatAssessment, url: string): string {
        const indicators = assessment.indicators
            .map(ind => `- ${ind.type}: ${ind.description}`)
            .join('\n');

        return `You are a cybersecurity expert helping users understand risks of visiting a suspicious website.

WEBSITE: ${url}
THREAT TYPE: ${assessment.threatType || 'unknown'}
CONFIDENCE: ${(assessment.confidence * 100).toFixed(0)}%

DETECTED RISK INDICATORS:
${indicators || '- No specific indicators provided'}

The user has decided to proceed despite warnings. Generate SPECIFIC safety guidelines tailored to THIS website's threats.

Requirements:
1. Be direct, clear, and actionable
2. Focus on preventing the most likely attacks based on the threat type
3. Provide 3-5 specific "DO NOT" instructions (what to absolutely avoid)
4. Include 3-5 warning signs to watch for while on the site
5. Give 3-5 technical protection tips they can implement
6. Assess the overall risk level (extreme, high, or medium)

Make the advice SPECIFIC to threat type "${assessment.threatType || 'unknown'}" - avoid generic security advice.`;
    }

    /**
     * Generate fallback guidelines if AI fails
     */
    private generateFallbackGuidelines(assessment: ThreatAssessment): SafetyGuidelines {
        const riskLevel = assessment.confidence >= 0.9 ? 'extreme' :
                         assessment.confidence >= 0.7 ? 'high' : 'medium';
        
        const threatType = assessment.threatType || 'unknown';

        return {
            summary: `This site shows characteristics of ${threatType} with ${(assessment.confidence * 100).toFixed(0)}% confidence`,
            doNots: this.getDefaultDoNots(threatType),
            warnings: this.getDefaultWarnings(threatType),
            technicalAdvice: this.getDefaultTechnicalAdvice(),
            riskLevel
        };
    }

    /**
     * Default "Do Not" guidelines by threat type
     */
    private getDefaultDoNots(threatType: string | null): string[] {
        const common = [
            'DO NOT enter passwords, credit card numbers, or personal information',
            'DO NOT download or run any files from this site',
            'DO NOT click on pop-ups or unexpected download prompts'
        ];

        const specific: Record<string, string[]> = {
            'phishing': [
                'DO NOT enter login credentials - this may be a fake login page',
                'DO NOT provide verification codes or 2FA tokens',
                'DO NOT trust urgent messages asking you to "verify your account"'
            ],
            'malware': [
                'DO NOT download any software, even if it claims to be legitimate',
                'DO NOT click "Allow" on any permission requests',
                'DO NOT run any downloaded files, even PDFs'
            ],
            'social_engineering': [
                'DO NOT fall for time-pressure tactics ("act now or lose access")',
                'DO NOT trust prizes, rewards, or "you\'ve won" messages',
                'DO NOT provide personal information to "verify" anything'
            ],
            'cryptocurrency_scam': [
                'DO NOT connect your crypto wallet to this site',
                'DO NOT send cryptocurrency to any addresses shown',
                'DO NOT trust promises of guaranteed returns or "free crypto"',
                'DO NOT enter your seed phrase or private keys'
            ]
        };

        return [...common, ...(specific[threatType || 'unknown'] || [])];
    }

    /**
     * Default warning signs by threat type
     */
    private getDefaultWarnings(threatType: string | null): string[] {
        const common = [
            'Unexpected popups or redirects',
            'Requests for sensitive information',
            'Urgent or threatening language'
        ];

        const specific: Record<string, string[]> = {
            'phishing': [
                'Login page that looks slightly different than usual',
                'URL doesn\'t exactly match the legitimate site',
                'Poor grammar or spelling in professional communications'
            ],
            'malware': [
                'Automatic download attempts',
                'Fake security warnings or virus alerts',
                'Browser acting slowly or unusually'
            ],
            'cryptocurrency_scam': [
                'Promises of unrealistic returns (100%+ APY)',
                'Pressure to "invest now" or "limited spots"',
                'Requests to share your wallet seed phrase'
            ]
        };

        return [...common, ...(specific[threatType || 'unknown'] || [])];
    }

    /**
     * Default technical protection advice
     */
    private getDefaultTechnicalAdvice(): string[] {
        return [
            'Keep this browser window separate - don\'t open other tabs',
            'Do not log into any accounts while on this site',
            'Clear your browser cache and cookies after visiting',
            'Consider using a VPN or different network if possible',
            'Watch your clipboard - some sites steal copied data'
        ];
    }

    /**
     * Check if generator is available
     */
    isAvailable(): boolean {
        return !!process.env.GEMINI_API_KEY && 
               process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
    }
}

// Singleton instance
let instance: SafetyGuidelinesGenerator | null = null;

export function getSafetyGuidelinesGenerator(): SafetyGuidelinesGenerator {
    if (!instance) {
        instance = new SafetyGuidelinesGenerator();
    }
    return instance;
}
