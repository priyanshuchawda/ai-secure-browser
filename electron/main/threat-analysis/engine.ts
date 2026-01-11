/**
 * Threat Analysis Engine
 * Orchestrates the threat detection pipeline: Cache → Local Rules → AI
 * Based on research.md Decision 4
 */

import {
    ThreatAssessment,
    AnalysisMethod,
    AnalysisRequest,
    ThreatIndicator,
    ThreatType
} from '../../../src/shared/types';
import { PERFORMANCE, THRESHOLDS, GEMINI } from '../../../src/shared/constants';
import { generateUUID, getCurrentTimestamp, isValidHttpUrl } from '../../../src/shared/utils';
import { getCacheManager } from './cache/cache-manager';
import { getPhishingDetector, LocalDetectionResult } from './local-rules/phishing-detector';
import { getGeminiAnalyzer } from './ai-analyzer/gemini-client';
import { getUrlContentAnalyzer, UrlContentAnalysis } from './ai-analyzer/url-analyzer';

/**
 * Threat Analysis Engine
 * Multi-tier analysis with performance optimization
 */
export class ThreatAnalysisEngine {
    private cacheManager = getCacheManager();
    private phishingDetector = getPhishingDetector();
    private geminiAnalyzer = getGeminiAnalyzer();
    private urlAnalyzer = getUrlContentAnalyzer();

    /**
     * Analyze a URL for threats
     * Pipeline: Cache → Local Rules → AI (if needed)
     */
    async analyze(request: AnalysisRequest): Promise<ThreatAssessment> {
        const startTime = Date.now();
        const requestId = request.requestId || generateUUID();

        console.log(`[Engine] Analyzing: ${request.url.substring(0, 60)}...`);

        // Validate URL
        if (!isValidHttpUrl(request.url)) {
            return this.createSafeAssessment(requestId, request.url, startTime, 'Invalid URL');
        }

        // ===== Stage 1: Cache Lookup (fastest) =====
        if (!request.options?.forceAiAnalysis) {
            const cached = this.cacheManager.lookup(request.url);
            if (cached) {
                cached.requestId = requestId;
                console.log(`[Engine] Cache hit, latency: ${Date.now() - startTime}ms`);
                return cached;
            }
        }

        // ===== Stage 2: Local Rule Detection =====
        const localResult = this.phishingDetector.analyze(request.url);

        // High confidence local detection
        // NOTE: We do NOT return immediately here anymore, because we want Gemini
        // to provide a summary/explanation even for known local threats (User Request).
        // The final assessment will merge local and AI results.
        if (localResult.confidence >= THRESHOLDS.AUTO_BLOCK_CONFIDENCE) {
            console.log(`[Engine] Local high-confidence detection (${localResult.confidence}), proceeding to AI for summary...`);
        }

        // ===== Stage 3: AI Analysis (ALWAYS for all URLs) =====
        // We ALWAYS call AI to verify every URL, not just suspicious ones.
        // This ensures unknown domains get proper verification via:
        // 1. Web Search for domain reputation
        // 2. URL fetch for actual content analysis
        const shouldCallAI = (
            !request.options?.offlineMode &&
            this.geminiAnalyzer.isAvailable()
        );

        if (shouldCallAI) {
            const aiResult = await this.analyzeWithAI(request);
            if (aiResult) {
                // ===== Stage 4: Deep Content Analysis (for medium confidence) =====
                // If AI is uncertain, fetch & analyze page content for better accuracy
                if (
                    GEMINI.URL_CONTEXT_ENABLED &&
                    this.urlAnalyzer.isAvailable() &&
                    aiResult.confidence >= GEMINI.DEEP_ANALYSIS_THRESHOLD &&
                    aiResult.confidence < THRESHOLDS.AUTO_BLOCK_CONFIDENCE &&
                    !request.options?.offlineMode
                ) {
                    console.log('[Engine] Medium confidence, triggering deep content analysis...');
                    const contentResult = await this.analyzeWithContent(request);
                    if (contentResult) {
                        const assessment = this.createAssessmentFromContent(
                            requestId,
                            request.url,
                            contentResult,
                            localResult,
                            startTime
                        );
                        this.cacheManager.store(request.url, assessment);
                        console.log(`[Engine] Deep analysis complete, latency: ${assessment.analysisLatency}ms`);
                        return assessment;
                    }
                }

                const assessment = this.createAssessmentFromAI(
                    requestId,
                    request.url,
                    aiResult,
                    localResult,
                    startTime
                );
                this.cacheManager.store(request.url, assessment);
                console.log(`[Engine] AI analysis complete, latency: ${assessment.analysisLatency}ms`);
                return assessment;
            }
        }

        // ===== Default: Safe or Local Result =====
        if (localResult.indicators.length > 0) {
            const assessment = this.createAssessmentFromLocal(
                requestId,
                request.url,
                localResult,
                startTime
            );
            this.cacheManager.store(request.url, assessment);
            return assessment;
        }

        // No threats detected
        const assessment = this.createSafeAssessment(requestId, request.url, startTime);
        this.cacheManager.store(request.url, assessment);
        return assessment;
    }

    /**
     * Call Gemini AI for analysis
     */
    private async analyzeWithAI(request: AnalysisRequest) {
        try {
            const timeout = request.options?.maxLatency || PERFORMANCE.ANALYSIS_TIMEOUT_MS;

            const aiPromise = this.geminiAnalyzer.analyze(request.url, {
                referrer: request.context?.referrer,
                redirectChain: request.context?.redirectChain
            });

            // Timeout handling
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('AI analysis timeout')), timeout);
            });

            return await Promise.race([aiPromise, timeoutPromise]) as Awaited<ReturnType<typeof this.geminiAnalyzer.analyze>>;
        } catch (error) {
            console.warn('[Engine] AI analysis failed:', error);
            return null;
        }
    }

    /**
     * Create assessment from local detection result
     */
    private createAssessmentFromLocal(
        requestId: string,
        url: string,
        local: LocalDetectionResult,
        startTime: number
    ): ThreatAssessment {
        return {
            id: generateUUID(),
            requestId,
            url,
            threatType: local.threatType,
            confidence: local.confidence,
            indicators: local.indicators,
            analysisMethod: AnalysisMethod.LOCAL_RULE,
            aiModelUsed: null,
            analysisLatency: Date.now() - startTime,
            timestamp: getCurrentTimestamp()
        };
    }

    /**
     * Create assessment from AI result
     * 
     * IMPORTANT: When AI (with Web Search grounding) says a site is SAFE with high confidence,
     * we trust the AI over local rules. This prevents false positives like:
     * - chat.com being blocked because it's similar to chase.com
     * - Local typosquatting detection doesn't have internet context
     */
    private createAssessmentFromAI(
        requestId: string,
        url: string,
        aiResult: NonNullable<Awaited<ReturnType<typeof this.geminiAnalyzer.analyze>>>,
        localResult: LocalDetectionResult,
        startTime: number
    ): ThreatAssessment {
        // Merge local and AI indicators
        const aiIndicators: ThreatIndicator[] = aiResult.indicators.map((i: { type: string; description: string; severity: string }) => ({
            type: i.type as any,
            description: i.description,
            severity: i.severity as any,
            details: {}
        }));

        // AI OVERRIDE LOGIC:
        // When AI says "safe" with high confidence (≥0.8), trust the AI.
        // The AI has Web Search grounding and can verify legitimate domains.
        // This prevents false positives from local typosquatting detection
        // (e.g., chat.com being mistakenly flagged as a chase.com typo).
        const aiSaysDefinitelySafe = aiResult.threatType === 'safe' && aiResult.confidence >= 0.8;

        if (aiSaysDefinitelySafe) {
            console.log(`[Engine] AI override: Site verified as SAFE by AI (confidence: ${aiResult.confidence})`);
            // Return safe assessment, ignoring local indicators
            return {
                id: generateUUID(),
                requestId,
                url,
                threatType: null,  // Safe
                confidence: aiResult.confidence,
                indicators: [],    // Clear local false-positive indicators
                analysisMethod: AnalysisMethod.AI_ANALYSIS,
                aiModelUsed: 'gemini-2.5-flash',
                analysisLatency: Date.now() - startTime,
                timestamp: getCurrentTimestamp()
            };
        }

        // AI says threat OR low-confidence safe → merge with local results
        const allIndicators = [...localResult.indicators, ...aiIndicators];

        // Use higher confidence between AI and local
        const confidence = Math.max(aiResult.confidence, localResult.confidence);

        // Determine threat type (AI takes priority, then local)
        let threatType: ThreatType | null = null;
        if (aiResult.threatType !== 'safe') {
            threatType = aiResult.threatType as ThreatType;
        } else if (localResult.threatType) {
            // Only use local threat type if AI is uncertain (low confidence safe)
            threatType = localResult.threatType;
        }

        return {
            id: generateUUID(),
            requestId,
            url,
            threatType,
            confidence,
            indicators: allIndicators,
            analysisMethod: AnalysisMethod.AI_ANALYSIS,
            aiModelUsed: 'gemini-2.5-flash',
            analysisLatency: Date.now() - startTime,
            timestamp: getCurrentTimestamp()
        };
    }

    /**
     * Create safe assessment (no threats)
     */
    private createSafeAssessment(
        requestId: string,
        url: string,
        startTime: number,
        reason?: string
    ): ThreatAssessment {
        return {
            id: generateUUID(),
            requestId,
            url,
            threatType: null,
            confidence: 1.0,
            indicators: [],
            analysisMethod: AnalysisMethod.LOCAL_RULE,
            aiModelUsed: null,
            analysisLatency: Date.now() - startTime,
            timestamp: getCurrentTimestamp()
        };
    }

    /**
     * Call URL Content Analyzer for deep analysis
     */
    private async analyzeWithContent(request: AnalysisRequest): Promise<UrlContentAnalysis | null> {
        try {
            const timeout = GEMINI.DEEP_ANALYSIS_TIMEOUT_MS;

            const contentPromise = this.urlAnalyzer.analyzeWithContent(request.url, {
                referrer: request.context?.referrer,
                redirectChain: request.context?.redirectChain
            });

            // Timeout handling
            const timeoutPromise = new Promise<null>((resolve) => {
                setTimeout(() => {
                    console.warn('[Engine] Content analysis timeout');
                    resolve(null);
                }, timeout);
            });

            return await Promise.race([contentPromise, timeoutPromise]);
        } catch (error) {
            console.warn('[Engine] Content analysis failed:', error);
            return null;
        }
    }

    /**
     * Create assessment from URL content analysis result
     * 
     * Same AI override logic as createAssessmentFromAI - trust high-confidence
     * safe verdicts from content analysis over local rules.
     */
    private createAssessmentFromContent(
        requestId: string,
        url: string,
        contentResult: UrlContentAnalysis,
        localResult: LocalDetectionResult,
        startTime: number
    ): ThreatAssessment {
        // Merge local and content-based indicators
        const contentIndicators: ThreatIndicator[] = contentResult.indicators.map((i: { type: string; description: string; severity: string }) => ({
            type: i.type as any,
            description: i.description,
            severity: i.severity as any,
            details: {}
        }));

        // AI OVERRIDE: When content analysis says safe with high confidence, trust it
        const contentSaysDefinitelySafe = contentResult.threatType === 'safe' && contentResult.confidence >= 0.8;

        if (contentSaysDefinitelySafe) {
            console.log(`[Engine] Content analysis override: Site verified as SAFE (confidence: ${contentResult.confidence})`);
            return {
                id: generateUUID(),
                requestId,
                url,
                threatType: null,
                confidence: contentResult.confidence,
                indicators: [],
                analysisMethod: AnalysisMethod.AI_ANALYSIS,
                aiModelUsed: 'gemini-2.5-flash (url-context)',
                analysisLatency: Date.now() - startTime,
                timestamp: getCurrentTimestamp()
            };
        }

        const allIndicators = [...localResult.indicators, ...contentIndicators];

        // Use higher confidence between content and local
        const confidence = Math.max(contentResult.confidence, localResult.confidence);

        // Determine threat type (content takes priority, then local)
        let threatType: ThreatType | null = null;
        if (contentResult.threatType !== 'safe') {
            threatType = contentResult.threatType as ThreatType;
        } else if (localResult.threatType) {
            // Only use local threat type if content analysis is uncertain
            threatType = localResult.threatType;
        }

        return {
            id: generateUUID(),
            requestId,
            url,
            threatType,
            confidence,
            indicators: allIndicators,
            analysisMethod: AnalysisMethod.AI_ANALYSIS,
            aiModelUsed: 'gemini-2.5-flash (url-context)',
            analysisLatency: Date.now() - startTime,
            timestamp: getCurrentTimestamp()
        };
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return this.cacheManager.getStats();
    }
}

// Singleton instance
let engineInstance: ThreatAnalysisEngine | null = null;

export function getThreatAnalysisEngine(): ThreatAnalysisEngine {
    if (!engineInstance) {
        engineInstance = new ThreatAnalysisEngine();
    }
    return engineInstance;
}
