/**
 * VirusTotal Client Wrapper
 * 
 * Provides a clean interface to VirusTotal API with:
 * - Rate limiting (4 req/min for free tier)
 * - Request queuing
 * - Error handling & retries
 * - Result caching
 */

import VirusTotalAPI from 'virustotal-api';
import { VirusTotalResult } from '../../../src/shared/types.js';

interface QueueItem {
    url?: string;
    hash?: string;
    resolve: (result: VirusTotalResult) => void;
    reject: (error: Error) => void;
}

export class VirusTotalClient {
    private client: any;
    private apiKey: string;
    private requestQueue: QueueItem[] = [];
    private isProcessing = false;
    private lastRequestTime = 0;
    private readonly RATE_LIMIT_MS = 15000; // 15 seconds between requests (4 req/min)
    private readonly MAX_RETRIES = 2;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.VIRUSTOTAL_API_KEY || '';
        
        if (!this.apiKey) {
            console.warn('[VirusTotal] No API key provided. Service will be unavailable.');
        } else {
            this.client = new VirusTotalAPI(this.apiKey);
            console.log('[VirusTotal] Client initialized successfully');
        }
    }

    /**
     * Check if VirusTotal is available
     */
    isAvailable(): boolean {
        return !!this.apiKey && !!this.client;
    }

    /**
     * Check URL reputation
     * Returns threat score and scanner results
     */
    async checkUrl(url: string): Promise<VirusTotalResult> {
        if (!this.isAvailable()) {
            return this.createUnavailableResult('VirusTotal API not configured');
        }

        return new Promise((resolve, reject) => {
            this.requestQueue.push({ url, resolve, reject });
            this.processQueue();
        });
    }

    /**
     * Check file by hash (SHA256)
     */
    async checkFileHash(hash: string): Promise<VirusTotalResult> {
        if (!this.isAvailable()) {
            return this.createUnavailableResult('VirusTotal API not configured');
        }

        return new Promise((resolve, reject) => {
            this.requestQueue.push({ hash, resolve, reject });
            this.processQueue();
        });
    }

    /**
     * Process request queue with rate limiting
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        while (this.requestQueue.length > 0) {
            // Respect rate limit
            const timeSinceLastRequest = Date.now() - this.lastRequestTime;
            if (timeSinceLastRequest < this.RATE_LIMIT_MS) {
                const waitTime = this.RATE_LIMIT_MS - timeSinceLastRequest;
                console.log(`[VirusTotal] Rate limit: waiting ${waitTime}ms`);
                await this.sleep(waitTime);
            }

            const item = this.requestQueue.shift();
            if (!item) continue;

            try {
                this.lastRequestTime = Date.now();

                let result: VirusTotalResult;
                if (item.url) {
                    result = await this.performUrlCheck(item.url);
                } else if (item.hash) {
                    result = await this.performHashCheck(item.hash);
                } else {
                    throw new Error('Invalid queue item: no URL or hash');
                }

                item.resolve(result);
            } catch (error) {
                console.error('[VirusTotal] Request failed:', error);
                item.reject(error instanceof Error ? error : new Error(String(error)));
            }
        }

        this.isProcessing = false;
    }

    /**
     * Perform URL reputation check
     */
    private async performUrlCheck(url: string, retryCount = 0): Promise<VirusTotalResult> {
        try {
            console.log(`[VirusTotal] Checking URL: ${url}`);
            const response = await this.client.urlReport(url);

            if (!response) {
                throw new Error('No response from VirusTotal');
            }

            // Response code meanings:
            // 1 = Report available
            // 0 = URL not in database
            // -2 = Still queued for analysis
            if (response.response_code === 1) {
                return this.parseUrlReport(response, url);
            } else if (response.response_code === 0) {
                // URL not in database - submit for scanning
                console.log(`[VirusTotal] URL not in database, submitting: ${url}`);
                await this.client.urlScan(url);
                
                return {
                    available: true,
                    inDatabase: false,
                    submitted: true,
                    detectionRate: 0,
                    positives: 0,
                    total: 0,
                    scanDate: null,
                    permalink: null,
                    message: 'URL submitted for scanning. Results will be available in a few minutes.'
                };
            } else if (response.response_code === -2) {
                // Still being analyzed
                if (retryCount < this.MAX_RETRIES) {
                    console.log(`[VirusTotal] Analysis in progress, retrying (${retryCount + 1}/${this.MAX_RETRIES})...`);
                    await this.sleep(5000); // Wait 5 seconds
                    return this.performUrlCheck(url, retryCount + 1);
                }
                
                return {
                    available: true,
                    inDatabase: true,
                    detectionRate: 0,
                    positives: 0,
                    total: 0,
                    scanDate: null,
                    permalink: null,
                    message: 'Analysis still in progress. Please try again later.'
                };
            } else {
                throw new Error(`Unexpected response code: ${response.response_code}`);
            }
        } catch (error) {
            console.error('[VirusTotal] URL check failed:', error);
            throw error;
        }
    }

    /**
     * Perform file hash check
     */
    private async performHashCheck(hash: string): Promise<VirusTotalResult> {
        try {
            console.log(`[VirusTotal] Checking file hash: ${hash.substring(0, 16)}...`);
            const response = await this.client.fileReport(hash);

            if (!response) {
                throw new Error('No response from VirusTotal');
            }

            if (response.response_code === 1) {
                return this.parseFileReport(response, hash);
            } else if (response.response_code === 0) {
                return {
                    available: true,
                    inDatabase: false,
                    detectionRate: 0,
                    positives: 0,
                    total: 0,
                    scanDate: null,
                    permalink: null,
                    message: 'File not found in VirusTotal database.'
                };
            } else {
                throw new Error(`Unexpected response code: ${response.response_code}`);
            }
        } catch (error) {
            console.error('[VirusTotal] Hash check failed:', error);
            throw error;
        }
    }

    /**
     * Parse URL report response
     */
    private parseUrlReport(response: any, url: string): VirusTotalResult {
        const positives = response.positives || 0;
        const total = response.total || 0;
        const detectionRate = total > 0 ? (positives / total) * 100 : 0;

        return {
            available: true,
            inDatabase: true,
            detectionRate: Math.round(detectionRate * 100) / 100,
            positives,
            total,
            scanDate: response.scan_date || null,
            permalink: response.permalink || null,
            scans: response.scans || {},
            message: this.generateMessage(positives, total)
        };
    }

    /**
     * Parse file report response
     */
    private parseFileReport(response: any, hash: string): VirusTotalResult {
        const positives = response.positives || 0;
        const total = response.total || 0;
        const detectionRate = total > 0 ? (positives / total) * 100 : 0;

        return {
            available: true,
            inDatabase: true,
            detectionRate: Math.round(detectionRate * 100) / 100,
            positives,
            total,
            scanDate: response.scan_date || null,
            permalink: response.permalink || null,
            scans: response.scans || {},
            sha256: response.sha256 || hash,
            message: this.generateMessage(positives, total)
        };
    }

    /**
     * Generate human-readable message based on detection rate
     */
    private generateMessage(positives: number, total: number): string {
        if (positives === 0) {
            return `Clean - No threats detected by ${total} scanners`;
        } else if (positives === 1) {
            return `Low risk - 1 out of ${total} scanners detected a threat (likely false positive)`;
        } else if (positives <= 5) {
            return `Suspicious - ${positives} out of ${total} scanners detected threats`;
        } else if (positives <= 15) {
            return `Dangerous - ${positives} out of ${total} scanners detected threats`;
        } else {
            return `Critical - ${positives} out of ${total} scanners detected malware`;
        }
    }

    /**
     * Create result for when VirusTotal is unavailable
     */
    private createUnavailableResult(reason: string): VirusTotalResult {
        return {
            available: false,
            inDatabase: false,
            detectionRate: 0,
            positives: 0,
            total: 0,
            scanDate: null,
            permalink: null,
            message: reason
        };
    }

    /**
     * Sleep helper for rate limiting
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get current queue size (for monitoring)
     */
    getQueueSize(): number {
        return this.requestQueue.length;
    }
}

// Singleton instance
let instance: VirusTotalClient | null = null;

export function getVirusTotalClient(): VirusTotalClient {
    if (!instance) {
        instance = new VirusTotalClient();
    }
    return instance;
}
