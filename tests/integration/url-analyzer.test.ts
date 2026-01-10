/**
 * URL Content Analyzer Tests
 * Tests for the Gemini URL Context integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @google/genai before importing the module
vi.mock('@google/genai', () => ({
    GoogleGenAI: vi.fn().mockImplementation(() => ({
        models: {
            generateContent: vi.fn()
        }
    }))
}));

// Import after mocking
import { UrlContentAnalyzer, getUrlContentAnalyzer } from '@electron/main/threat-analysis/ai-analyzer/url-analyzer';

describe('UrlContentAnalyzer', () => {
    let originalApiKey: string | undefined;

    beforeEach(() => {
        originalApiKey = process.env.GEMINI_API_KEY;
    });

    afterEach(() => {
        if (originalApiKey) {
            process.env.GEMINI_API_KEY = originalApiKey;
        } else {
            delete process.env.GEMINI_API_KEY;
        }
    });

    describe('isAvailable', () => {
        it('should return false when API key is not configured', () => {
            delete process.env.GEMINI_API_KEY;
            const analyzer = new UrlContentAnalyzer();
            expect(analyzer.isAvailable()).toBe(false);
        });

        it('should return false when API key is placeholder', () => {
            process.env.GEMINI_API_KEY = 'your_gemini_api_key_here';
            const analyzer = new UrlContentAnalyzer();
            expect(analyzer.isAvailable()).toBe(false);
        });
    });

    describe('analyzeWithContent', () => {
        it('should return null when analyzer is not available', async () => {
            delete process.env.GEMINI_API_KEY;
            const analyzer = new UrlContentAnalyzer();
            const result = await analyzer.analyzeWithContent('https://example.com');
            expect(result).toBeNull();
        });
    });
});

describe('Content Analysis Response Schema', () => {
    it('should validate phishing detection response structure', () => {
        const mockResponse = {
            threatType: 'phishing',
            confidence: 0.85,
            indicators: [
                {
                    type: 'credential_harvesting',
                    description: 'Page contains login form targeting different domain',
                    severity: 'high'
                },
                {
                    type: 'brand_mismatch',
                    description: 'Page mentions PayPal but domain is paypa1-secure.tk',
                    severity: 'critical'
                }
            ],
            recommendation: 'block',
            contentAnalysis: {
                pageTitle: 'PayPal - Log In',
                hasLoginForm: true,
                hasSensitiveInputs: true,
                textIndicators: ['Your account has been limited', 'Verify immediately'],
                brandMentions: ['PayPal', 'Security Center']
            }
        };

        expect(mockResponse.threatType).toBe('phishing');
        expect(mockResponse.confidence).toBeGreaterThan(0.5);
        expect(mockResponse.indicators).toHaveLength(2);
        expect(mockResponse.contentAnalysis.hasLoginForm).toBe(true);
        expect(mockResponse.contentAnalysis.brandMentions).toContain('PayPal');
    });

    it('should validate safe response structure', () => {
        const mockSafeResponse = {
            threatType: 'safe',
            confidence: 0.95,
            indicators: [],
            recommendation: 'allow',
            contentAnalysis: {
                pageTitle: 'Google',
                hasLoginForm: false,
                hasSensitiveInputs: false,
                textIndicators: [],
                brandMentions: ['Google']
            }
        };

        expect(mockSafeResponse.threatType).toBe('safe');
        expect(mockSafeResponse.recommendation).toBe('allow');
        expect(mockSafeResponse.indicators).toHaveLength(0);
    });

    it('should handle URL retrieval status properly', () => {
        const responseWithUnsafeUrl = {
            threatType: 'phishing',
            confidence: 0.9,
            indicators: [
                {
                    type: 'unsafe_content',
                    description: 'URL content flagged as unsafe by safety checks',
                    severity: 'high'
                }
            ],
            recommendation: 'block',
            contentAnalysis: {
                pageTitle: 'Unknown',
                hasLoginForm: false,
                hasSensitiveInputs: false,
                textIndicators: [],
                brandMentions: [],
                urlRetrievalStatus: 'unsafe'
            }
        };

        expect(responseWithUnsafeUrl.contentAnalysis.urlRetrievalStatus).toBe('unsafe');
        expect(responseWithUnsafeUrl.indicators[0].type).toBe('unsafe_content');
    });
});
