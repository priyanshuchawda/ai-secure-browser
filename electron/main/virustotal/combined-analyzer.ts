/**
 * Combined Threat Analyzer
 * 
 * Integrates both Gemini AI and VirusTotal for comprehensive threat detection
 * Uses prompt engineering to combine results intelligently
 */

import { getVirusTotalClient } from './client.js';
import { VirusTotalResult, ThreatType, ThreatIndicator, IndicatorType, Severity } from '../../../src/shared/types.js';

export interface CombinedAnalysisResult {
    virusTotal: VirusTotalResult;
    combinedConfidence: number;      // 0.0-1.0 combined score
    threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    recommendation: 'allow' | 'warn' | 'block';
    indicators: ThreatIndicator[];
    rationale: string;               // Human-readable explanation
}

export class CombinedThreatAnalyzer {
    private vtClient = getVirusTotalClient();

    /**
     * Analyze URL with both VirusTotal and provide combined assessment
     */
    async analyzeUrl(url: string, geminiConfidence?: number, geminiThreatType?: ThreatType | null): Promise<CombinedAnalysisResult> {
        // Get VirusTotal results
        const vtResult = await this.vtClient.checkUrl(url);

        // Combine VirusTotal + Gemini results
        return this.combineResults(vtResult, geminiConfidence, geminiThreatType);
    }

    /**
     * Combine VirusTotal and Gemini results using intelligent logic
     * 
     * Decision Matrix:
     * 1. HIGH VT detections (>15%) → ALWAYS BLOCK (override Gemini)
     * 2. MEDIUM VT detections (5-15%) + High Gemini → BLOCK
     * 3. LOW VT detections (1-5%) + High Gemini → WARN
     * 4. CLEAN VT (0%) + High Gemini → Use Gemini (may be new threat)
     * 5. CLEAN VT + Safe Gemini → ALLOW
     * 6. VT unavailable → Use Gemini only
     */
    private combineResults(
        vtResult: VirusTotalResult,
        geminiConfidence: number = 0,
        geminiThreatType: ThreatType | null = null
    ): CombinedAnalysisResult {
        const indicators: ThreatIndicator[] = [];
        
        // ===== Case 1: VirusTotal unavailable =====
        if (!vtResult.available) {
            return {
                virusTotal: vtResult,
                combinedConfidence: geminiConfidence,
                threatLevel: this.confidenceToThreatLevel(geminiConfidence),
                recommendation: this.getRecommendation(geminiConfidence, 0),
                indicators: [],
                rationale: 'VirusTotal unavailable. Assessment based on AI analysis only.'
            };
        }

        // ===== Case 2: URL not in database yet =====
        if (!vtResult.inDatabase) {
            const message = vtResult.submitted
                ? 'URL submitted to VirusTotal for scanning. AI analysis used for decision.'
                : 'URL not in VirusTotal database. AI analysis used for decision.';
            
            return {
                virusTotal: vtResult,
                combinedConfidence: geminiConfidence,
                threatLevel: this.confidenceToThreatLevel(geminiConfidence),
                recommendation: this.getRecommendation(geminiConfidence, 0),
                indicators: [],
                rationale: message
            };
        }

        // ===== Case 3: VirusTotal has data - combine intelligently =====
        const vtDetectionRate = vtResult.detectionRate;
        const vtPositives = vtResult.positives;
        const vtTotal = vtResult.total;

        // Add VirusTotal indicator
        if (vtPositives > 0) {
            indicators.push({
                type: IndicatorType.KNOWN_MALICIOUS,
                description: `${vtPositives}/${vtTotal} antivirus scanners detected this URL as malicious`,
                severity: this.detectionRateToSeverity(vtDetectionRate),
                details: {
                    detectionRate: vtDetectionRate,
                    positives: vtPositives,
                    total: vtTotal,
                    scanDate: vtResult.scanDate,
                    permalink: vtResult.permalink
                }
            });
        }

        // ===== Decision Logic =====
        let combinedConfidence: number;
        let threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
        let recommendation: 'allow' | 'warn' | 'block';
        let rationale: string;

        if (vtDetectionRate >= 15) {
            // CRITICAL: High VT detection → ALWAYS BLOCK
            combinedConfidence = 0.95;
            threatLevel = 'critical';
            recommendation = 'block';
            rationale = `CRITICAL THREAT: ${vtPositives} out of ${vtTotal} security scanners flagged this URL as malicious. This is a confirmed threat.`;
        } else if (vtDetectionRate >= 5 && vtDetectionRate < 15) {
            // HIGH: Medium VT detection
            if (geminiThreatType !== null && geminiConfidence >= 0.7) {
                // Both agree it's dangerous → BLOCK
                combinedConfidence = Math.max(0.85, geminiConfidence);
                threatLevel = 'high';
                recommendation = 'block';
                rationale = `HIGH RISK: Multiple security scanners (${vtPositives}/${vtTotal}) and AI analysis both detected threats. Strong evidence of malicious intent.`;
            } else {
                // VT suspicious, but Gemini uncertain or says safe → WARN
                combinedConfidence = 0.6;
                threatLevel = 'medium';
                recommendation = 'warn';
                rationale = `SUSPICIOUS: ${vtPositives} security scanners detected potential threats, but AI analysis is inconclusive. Proceed with extreme caution.`;
            }
        }else if (vtDetectionRate > 0 && vtDetectionRate < 5) {
            // LOW: Low VT detection (1-4 positives, likely false positives)
            if (geminiThreatType !== null && geminiConfidence >= 0.8) {
                // Gemini strongly says DANGEROUS → BLOCK (trust AI for new threats)
                combinedConfidence = geminiConfidence;
                threatLevel = 'high';
                recommendation = 'block';
                rationale = `AI detected sophisticated threats that few antivirus scanners caught. This may be a new or evolving threat. (${vtPositives}/${vtTotal} scanners also flagged it)`;
            } else if (geminiThreatType !== null && geminiConfidence >= 0.5) {
                // Both somewhat suspicious → WARN
                combinedConfidence = 0.5;
                threatLevel = 'medium';
                recommendation = 'warn';
                rationale = `MODERATE RISK: ${vtPositives} scanner(s) and AI analysis show some suspicious patterns. Likely safe but verify carefully.`;
            } else {
                // Gemini says safe, VT has few detections → ALLOW (likely false positive)
                combinedConfidence = 0.2;
                threatLevel = 'low';
                recommendation = 'allow';
                rationale = `LOW RISK: Only ${vtPositives}/${vtTotal} scanners flagged this (likely false positive). AI analysis confirms site is legitimate.`;
            }
        }else {
            // CLEAN: VT detects nothing (0 positives)
            if (geminiThreatType !== null && geminiConfidence >= 0.8) {
                // Gemini detects THREAT but VT doesn't → NEW THREAT (zero-day)
                combinedConfidence = geminiConfidence * 0.9; // Slightly reduce confidence
                threatLevel = 'high';
                recommendation = 'block';
                rationale = `POTENTIAL NEW THREAT: AI detected sophisticated attacks (${(geminiConfidence * 100).toFixed(0)}% confidence) that aren't in antivirus databases yet. This may be a zero-day threat or sophisticated phishing.`;
            } else if (geminiThreatType !== null && geminiConfidence >= 0.5) {
                // Gemini somewhat suspicious but VT clean → WARN
                combinedConfidence = geminiConfidence * 0.7;
                threatLevel = 'low';
                recommendation = 'warn';
                rationale = `No known malware detected, but AI found some suspicious patterns. Site is probably safe but review carefully.`;
            } else {
                // Both agree it's safe (VT clean + Gemini says safe) → ALLOW
                combinedConfidence = 0.05;
                threatLevel = 'safe';
                recommendation = 'allow';
                rationale = `VERIFIED SAFE: No threats detected by ${vtTotal} security scanners and AI analysis confirms legitimacy.`;
            }
        }

        return {
            virusTotal: vtResult,
            combinedConfidence,
            threatLevel,
            recommendation,
            indicators,
            rationale
        };
    }

    /**
     * Convert confidence score to threat level
     */
    private confidenceToThreatLevel(confidence: number): 'safe' | 'low' | 'medium' | 'high' | 'critical' {
        if (confidence >= 0.9) return 'critical';
        if (confidence >= 0.7) return 'high';
        if (confidence >= 0.5) return 'medium';
        if (confidence >= 0.3) return 'low';
        return 'safe';
    }

    /**
     * Convert VT detection rate to severity
     */
    private detectionRateToSeverity(detectionRate: number): Severity {
        if (detectionRate >= 15) return Severity.CRITICAL;
        if (detectionRate >= 5) return Severity.HIGH;
        if (detectionRate >= 2) return Severity.MEDIUM;
        if (detectionRate > 0) return Severity.LOW;
        return Severity.INFO;
    }

    /**
     * Get recommendation based on combined analysis
     */
    private getRecommendation(geminiConfidence: number, vtDetectionRate: number): 'allow' | 'warn' | 'block' {
        if (vtDetectionRate >= 15 || geminiConfidence >= 0.8) return 'block';
        if (vtDetectionRate >= 5 || geminiConfidence >= 0.5) return 'warn';
        return 'allow';
    }
}

// Singleton instance
let instance: CombinedThreatAnalyzer | null = null;

export function getCombinedAnalyzer(): CombinedThreatAnalyzer {
    if (!instance) {
        instance = new CombinedThreatAnalyzer();
    }
    return instance;
}
