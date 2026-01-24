/**
 * Combined Download Analyzer
 * Merges VirusTotal and Gemini AI results for download decisions
 */

import type { DownloadAnalysis } from './ai-download-analyzer';
import type { VTFileAnalysis } from './vt-download-analyzer';
import { getVTRiskLevel, formatVTResult } from './vt-download-analyzer';

/**
 * Combined analysis result
 */
export interface CombinedDownloadAnalysis extends DownloadAnalysis {
    vtResult?: VTFileAnalysis;
    combinedReasoning: string;
    vtFormatted: string;
}

/**
 * Combine VirusTotal and Gemini AI results
 * Decision matrix prioritizes known threats from VT, uses AI for unknown files
 */
export function combineDownloadResults(
    geminiAnalysis: DownloadAnalysis,
    vtAnalysis: VTFileAnalysis
): CombinedDownloadAnalysis {
    console.log('[Combined-Download] Merging VT + Gemini results...');
    console.log('[Combined-Download] VT:', vtAnalysis.inDatabase ? `${vtAnalysis.positives}/${vtAnalysis.total} detections` : 'Not in database');
    console.log('[Combined-Download] Gemini:', geminiAnalysis.riskLevel, geminiAnalysis.riskScore);

    // If VT unavailable or file not in database, use Gemini-only
    if (!vtAnalysis.available || !vtAnalysis.inDatabase) {
        console.log('[Combined-Download] Using Gemini-only assessment (VT unavailable/unknown file)');
        return {
            ...geminiAnalysis,
            vtResult: vtAnalysis,
            combinedReasoning: vtAnalysis.available 
                ? `File not in VirusTotal database (unknown). ${geminiAnalysis.reasoning}`
                : `VirusTotal unavailable. ${geminiAnalysis.reasoning}`,
            vtFormatted: formatVTResult(vtAnalysis)
        };
    }

    // VT found the file - analyze detections
    const vtRiskLevel = getVTRiskLevel(vtAnalysis.detectionRate, vtAnalysis.positives);
    const vtDetections = vtAnalysis.positives;
    const geminiRiskLevel = geminiAnalysis.riskLevel;
    const geminiRiskScore = geminiAnalysis.riskScore;

    // Decision Matrix (prioritize VT for known malware)
    
    // **PRIORITY 1: VT CRITICAL (>10% or 5+ detections)**
    if (vtDetections >= 5 || vtAnalysis.detectionRate >= 10) {
        console.log('[Combined-Download] CRITICAL: High VT detection rate');
        return {
            riskLevel: 'critical',
            riskScore: Math.max(95, geminiRiskScore),
            reasoning: `KNOWN MALWARE: ${vtDetections}/${vtAnalysis.total} antivirus scanners detected this file as malware.`,
            sourceReputation: 'malicious',
            recommendations: [
                'DO NOT open this file - it is confirmed malware',
                'Delete this file immediately',
                `${vtDetections} antivirus engines flagged this as dangerous`
            ],
            shouldBlock: true,
            allowOverride: false, // NEVER allow override for confirmed malware
            vtResult: vtAnalysis,
            combinedReasoning: `VirusTotal confirmed malware: ${vtDetections}/${vtAnalysis.total} detections. ${geminiAnalysis.reasoning}`,
            vtFormatted: formatVTResult(vtAnalysis)
        };
    }

    // **PRIORITY 2: VT HIGH (2-4 detections)**
    if (vtDetections >= 2) {
        console.log('[Combined-Download] HIGH: Multiple VT detections');
        
        // If Gemini also says risky → Definitely block
        const finalRiskLevel = (geminiRiskLevel === 'high' || geminiRiskLevel === 'critical') 
            ? 'critical' 
            : 'high';
        
        return {
            riskLevel: finalRiskLevel,
            riskScore: Math.max(80, geminiRiskScore),
            reasoning: `LIKELY MALWARE: ${vtDetections} antivirus scanners detected potential threats.`,
            sourceReputation: geminiRiskLevel === 'safe' ? 'suspicious' : 'malicious',
            recommendations: [
                'Do not open this file',
                `${vtDetections}/${vtAnalysis.total} scanners detected malware`,
                'This may be a false positive, but caution recommended',
                ...geminiAnalysis.recommendations
            ],
            shouldBlock: finalRiskLevel === 'critical',
            allowOverride: finalRiskLevel !== 'critical',
            vtResult: vtAnalysis,
            combinedReasoning: `VirusTotal: ${vtDetections}/${vtAnalysis.total} detections. ${geminiAnalysis.reasoning}`,
            vtFormatted: formatVTResult(vtAnalysis)
        };
    }

    // **PRIORITY 3: VT LOW (1 detection only)**
    if (vtDetections === 1) {
        console.log('[Combined-Download] LOW: Single VT detection (possible false positive)');
        
        // Single detection - defer to Gemini's assessment
        // If Gemini also says risky → Block
        // If Gemini says safe → Just warn
        
        if (geminiRiskLevel === 'high' || geminiRiskLevel === 'critical') {
            return {
                riskLevel: 'high',
                riskScore: Math.max(70, geminiRiskScore),
                reasoning: `SUSPICIOUS: 1 antivirus scanner detected a threat, and AI analysis confirms risk. ${geminiAnalysis.reasoning}`,
                sourceReputation: 'suspicious',
                recommendations: [
                    'Exercise caution - both VirusTotal and AI detected potential risks',
                    '1 scanner detection may be a false positive, but AI also flagged concerns',
                    ...geminiAnalysis.recommendations
                ],
                shouldBlock: true,
                allowOverride: true,
                vtResult: vtAnalysis,
                combinedReasoning: `VT: 1/${vtAnalysis.total} detection + AI flagged as risky. ${geminiAnalysis.reasoning}`,
                vtFormatted: formatVTResult(vtAnalysis)
            };
        } else {
            // Gemini says safe, only 1 VT detection → Likely false positive
            return {
                riskLevel: 'medium',
                riskScore: Math.max(40, geminiRiskScore),
                reasoning: `LOW RISK: Only 1 antivirus scanner detected a threat (likely false positive). ${geminiAnalysis.reasoning}`,
                sourceReputation: geminiAnalysis.sourceReputation,
                recommendations: [
                    '1 scanner detection may be a false positive',
                    'AI analysis suggests this file is legitimate',
                    'Scan with your own antivirus to be safe'
                ],
                shouldBlock: false,
                allowOverride: true,
                vtResult: vtAnalysis,
                combinedReasoning: `VT: 1/${vtAnalysis.total} detection (possible false positive). ${geminiAnalysis.reasoning}`,
                vtFormatted: formatVTResult(vtAnalysis)
            };
        }
    }

    // **PRIORITY 4: VT CLEAN (0 detections)**
    console.log('[Combined-Download] VT clean (0 detections), using Gemini assessment');
    
    // VT says clean - defer to Gemini's analysis
    // But if Gemini says critical/high, slightly downgrade (VT didn't find anything)
    
    let finalRiskLevel = geminiRiskLevel;
    let finalRiskScore = geminiRiskScore;
    
    if (geminiRiskLevel === 'critical') {
        // VT clean but Gemini critical → Downgrade to high (might be zero-day)
        finalRiskLevel = 'high';
        finalRiskScore = Math.min(75, geminiRiskScore);
    }
    
    return {
        riskLevel: finalRiskLevel,
        riskScore: finalRiskScore,
        reasoning: `VirusTotal: Clean (0/${vtAnalysis.total} detections). ${geminiAnalysis.reasoning}`,
        sourceReputation: geminiAnalysis.sourceReputation,
        recommendations: geminiRiskLevel === 'safe' 
            ? ['File verified clean by VirusTotal'] 
            : [
                'VirusTotal found no malware, but AI analysis suggests caution',
                'This could be a new/unknown threat not yet in virus databases',
                ...geminiAnalysis.recommendations
            ],
        shouldBlock: geminiAnalysis.shouldBlock && (geminiRiskLevel === 'high' || geminiRiskLevel === 'critical'),
        allowOverride: geminiAnalysis.allowOverride,
        vtResult: vtAnalysis,
        combinedReasoning: `VT clean. ${geminiAnalysis.reasoning}`,
        vtFormatted: formatVTResult(vtAnalysis)
    };
}

/**
 * Get color for VT detection rate (for UI display)
 */
export function getVTColor(detectionRate: number, positives: number): string {
    if (positives === 0) return 'green';
    if (detectionRate >= 10 || positives >= 5) return 'red';
    if (detectionRate >= 5 || positives >= 3) return 'orange';
    if (positives >= 2) return 'yellow';
    return 'gray';
}

console.log('[Combined-Download] Module loaded');
