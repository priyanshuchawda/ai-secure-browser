/**
 * VirusTotal Download Analyzer
 * Checks downloaded files against VirusTotal database
 */

import { getVirusTotalClient } from '../virustotal/client';
import { calculateFileHash } from './file-hash';
import type { VirusTotalFileReport } from '../../../src/shared/types';

// VT file analysis result
export interface VTFileAnalysis {
    available: boolean;
    inDatabase: boolean;
    hash: string;
    detectionRate: number; // 0-100 percentage
    positives: number; // Number of AV engines that detected it
    total: number; // Total AV engines
    scanDate: string | null;
    permalink: string | null;
    error?: string;
}

/**
 * Analyze a downloaded file using VirusTotal
 */
export async function analyzeDownloadedFile(
    filePath: string,
    fileName: string
): Promise<VTFileAnalysis> {
    console.log(`[VT-Download] Analyzing file: ${fileName}`);
    
    const vtClient = getVirusTotalClient();
    
    // Check if VT is available
    if (!vtClient.isAvailable()) {
        console.log('[VT-Download] VirusTotal not configured');
        return {
            available: false,
            inDatabase: false,
            hash: '',
            detectionRate: 0,
            positives: 0,
            total: 0,
            scanDate: null,
            permalink: null,
            error: 'VirusTotal API key not configured'
        };
    }

    try {
        // Step 1: Calculate file hash
        console.log('[VT-Download] Calculating SHA256 hash...');
        const hash = await calculateFileHash(filePath);
        console.log(`[VT-Download] Hash: ${hash.substring(0, 16)}...`);

        // Step 2: Check hash against VirusTotal
        console.log('[VT-Download] Checking hash against VirusTotal...');
        const vtResult = await vtClient.checkFileHash(hash);

        if (!vtResult.available) {
            console.log('[VT-Download] VirusTotal unavailable');
            return {
                available: false,
                inDatabase: false,
                hash,
                detectionRate: 0,
                positives: 0,
                total: 0,
                scanDate: null,
                permalink: null,
                error: 'VirusTotal service unavailable'
            };
        }

        if (!vtResult.inDatabase) {
            console.log('[VT-Download] File not in VirusTotal database');
            return {
                available: true,
                inDatabase: false,
                hash,
                detectionRate: 0,
                positives: 0,
                total: 0,
                scanDate: null,
                permalink: null
            };
        }

        // File found in database
        const detectionRate = vtResult.total > 0 
            ? Math.round((vtResult.positives / vtResult.total) * 100)
            : 0;

        console.log(`[VT-Download] VirusTotal result: ${vtResult.positives}/${vtResult.total} detections (${detectionRate}%)`);

        return {
            available: true,
            inDatabase: true,
            hash,
            detectionRate,
            positives: vtResult.positives,
            total: vtResult.total,
            scanDate: vtResult.scanDate || null,
            permalink: vtResult.permalink || null
        };

    } catch (error) {
        console.error('[VT-Download] Error analyzing file:', error);
        return {
            available: false,
            inDatabase: false,
            hash: '',
            detectionRate: 0,
            positives: 0,
            total: 0,
            scanDate: null,
            permalink: null,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Get risk level based on VT detections
 */
export function getVTRiskLevel(detectionRate: number, positives: number): 
    'critical' | 'high' | 'medium' | 'low' | 'safe' {
    
    if (positives === 0) return 'safe';
    if (detectionRate >= 10 || positives >= 5) return 'critical'; // 10%+ or 5+ detections
    if (detectionRate >= 5 || positives >= 3) return 'high';      // 5%+ or 3+ detections
    if (detectionRate >= 2 || positives >= 2) return 'medium';    // 2%+ or 2+ detections
    return 'low';  // 1 detection only
}

/**
 * Format VT result for display
 */
export function formatVTResult(vtResult: VTFileAnalysis): string {
    if (!vtResult.available) {
        return 'VirusTotal: Not available';
    }
    
    if (!vtResult.inDatabase) {
        return 'VirusTotal: File not in database (unknown)';
    }
    
    if (vtResult.positives === 0) {
        return `VirusTotal: Clean (0/${vtResult.total} scanners)`;
    }
    
    return `VirusTotal: ${vtResult.positives}/${vtResult.total} scanners detected malware (${vtResult.detectionRate}%)`;
}

console.log('[VT-Download] Module loaded');
