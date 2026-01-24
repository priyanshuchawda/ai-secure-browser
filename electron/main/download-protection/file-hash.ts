/**
 * File Hash Calculator
 * Calculates SHA256 hash of downloaded files for VirusTotal scanning
 */

import crypto from 'crypto';
import fs from 'fs';
import { promisify } from 'util';

const stat = promisify(fs.stat);

/**
 * Calculate SHA256 hash of a file using streams (efficient for large files)
 */
export async function calculateFileHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);

        stream.on('data', (chunk) => {
            hash.update(chunk);
        });

        stream.on('end', () => {
            const fileHash = hash.digest('hex');
            console.log(`[HashCalculator] SHA256 calculated: ${fileHash.substring(0, 16)}...`);
            resolve(fileHash);
        });

        stream.on('error', (error) => {
            console.error('[HashCalculator] Error calculating hash:', error);
            reject(error);
        });
    });
}

/**
 * Calculate hash with file info (includes size and timing)
 */
export async function calculateFileHashWithInfo(filePath: string): Promise<{
    hash: string;
    size: number;
    calculationTimeMs: number;
}> {
    const startTime = Date.now();
    
    try {
        // Get file size
        const stats = await stat(filePath);
        const fileSize = stats.size;

        console.log(`[HashCalculator] Calculating hash for ${formatFileSize(fileSize)} file...`);

        // Calculate hash
        const hash = await calculateFileHash(filePath);
        
        const calculationTime = Date.now() - startTime;
        console.log(`[HashCalculator] Hash calculated in ${calculationTime}ms`);

        return {
            hash,
            size: fileSize,
            calculationTimeMs: calculationTime
        };
    } catch (error) {
        console.error('[HashCalculator] Error:', error);
        throw error;
    }
}

/**
 * Format file size for logging
 */
function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Calculate multiple file hashes (MD5, SHA1, SHA256)
 * Useful for comprehensive VirusTotal lookup
 */
export async function calculateMultipleHashes(filePath: string): Promise<{
    md5: string;
    sha1: string;
    sha256: string;
}> {
    return new Promise((resolve, reject) => {
        const md5Hash = crypto.createHash('md5');
        const sha1Hash = crypto.createHash('sha1');
        const sha256Hash = crypto.createHash('sha256');
        
        const stream = fs.createReadStream(filePath);

        stream.on('data', (chunk) => {
            md5Hash.update(chunk);
            sha1Hash.update(chunk);
            sha256Hash.update(chunk);
        });

        stream.on('end', () => {
            const result = {
                md5: md5Hash.digest('hex'),
                sha1: sha1Hash.digest('hex'),
                sha256: sha256Hash.digest('hex')
            };
            
            console.log('[HashCalculator] All hashes calculated:', {
                md5: result.md5.substring(0, 16) + '...',
                sha1: result.sha1.substring(0, 16) + '...',
                sha256: result.sha256.substring(0, 16) + '...'
            });
            
            resolve(result);
        });

        stream.on('error', reject);
    });
}

console.log('[HashCalculator] Module loaded');
