/**
 * Cache Manager for Threat Intelligence
 * Implements LRU memory cache + disk persistence
 * Based on research.md Decision 3
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import {
    ThreatAssessment,
    ThreatType,
    DomainVerdict,
    IntelligenceSource,
    AnalysisMethod
} from '../../../../src/shared/types';
import {
    PERFORMANCE,
    THRESHOLDS,
    PATHS
} from '../../../../src/shared/constants';
import {
    extractDomain,
    getCurrentTimestamp,
    isOlderThan,
    generateUUID
} from '../../../../src/shared/utils';

/**
 * Simple LRU Cache implementation
 */
class LRUCache<K, V> {
    private cache = new Map<K, V>();
    private maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        const value = this.cache.get(key);
        if (value !== undefined) {
            // Move to front (most recently used)
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return value;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove oldest (first) entry
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, value);
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }

    delete(key: K): boolean {
        return this.cache.delete(key);
    }

    get size(): number {
        return this.cache.size;
    }

    clear(): void {
        this.cache.clear();
    }
}

/**
 * Disk cache structure
 */
interface DiskCache {
    version: string;
    lastUpdated: string;
    domains: Record<string, DomainVerdict>;
}

/**
 * Cache Manager
 * Provides fast threat intelligence lookup with memory + disk caching
 */
export class CacheManager {
    private memoryCache: LRUCache<string, ThreatAssessment>;
    private diskCachePath: string;
    private diskCache: DiskCache | null = null;
    private stats = {
        hits: 0,
        misses: 0,
        writes: 0
    };

    constructor(cachePath?: string) {
        this.memoryCache = new LRUCache<string, ThreatAssessment>(PERFORMANCE.MEMORY_CACHE_SIZE);
        this.diskCachePath = cachePath || PATHS.THREAT_CACHE;
        this.loadDiskCache();
    }

    /**
     * Load disk cache from file
     */
    private loadDiskCache(): void {
        try {
            if (existsSync(this.diskCachePath)) {
                const data = readFileSync(this.diskCachePath, 'utf-8');
                this.diskCache = JSON.parse(data);
                console.log(`[Cache] Loaded ${Object.keys(this.diskCache?.domains || {}).length} domains from disk`);
            } else {
                this.diskCache = {
                    version: '1.0.0',
                    lastUpdated: getCurrentTimestamp(),
                    domains: {}
                };
                console.log('[Cache] Initialized empty disk cache');
            }
        } catch (error) {
            console.error('[Cache] Error loading disk cache:', error);
            this.diskCache = {
                version: '1.0.0',
                lastUpdated: getCurrentTimestamp(),
                domains: {}
            };
        }
    }

    /**
     * Save disk cache to file
     */
    private saveDiskCache(): void {
        try {
            const dir = dirname(this.diskCachePath);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }

            if (this.diskCache) {
                this.diskCache.lastUpdated = getCurrentTimestamp();
                writeFileSync(this.diskCachePath, JSON.stringify(this.diskCache, null, 2));
                console.log('[Cache] Saved disk cache');
            }
        } catch (error) {
            console.error('[Cache] Error saving disk cache:', error);
        }
    }

    /**
     * Look up a URL in the cache
     * Returns ThreatAssessment if found and not expired
     */
    lookup(url: string): ThreatAssessment | null {
        const domain = extractDomain(url);
        if (!domain) {
            return null;
        }

        // Check memory cache first (fastest)
        const memCached = this.memoryCache.get(url);
        if (memCached) {
            this.stats.hits++;
            console.log(`[Cache] Memory hit for ${domain}`);
            return memCached;
        }

        // Check disk cache
        const diskEntry = this.diskCache?.domains[domain];
        if (diskEntry) {
            // Check if expired
            if (isOlderThan(diskEntry.expiresAt, 0)) {
                this.stats.misses++;
                delete this.diskCache!.domains[domain];
                return null;
            }

            this.stats.hits++;
            console.log(`[Cache] Disk hit for ${domain}`);

            // Convert DomainVerdict to ThreatAssessment
            const assessment: ThreatAssessment = {
                id: generateUUID(),
                requestId: '',
                url,
                threatType: diskEntry.verdict === 'safe' ? null : diskEntry.verdict,
                confidence: diskEntry.confidence,
                indicators: [],
                analysisMethod: AnalysisMethod.CACHE_HIT,
                aiModelUsed: null,
                analysisLatency: 1, // Cache hit is ~1ms
                timestamp: getCurrentTimestamp()
            };

            // Store in memory cache for faster future lookups
            this.memoryCache.set(url, assessment);

            return assessment;
        }

        this.stats.misses++;
        return null;
    }

    /**
     * Store an assessment in the cache
     */
    store(url: string, assessment: ThreatAssessment): void {
        const domain = extractDomain(url);
        if (!domain) {
            return;
        }

        // Store in memory cache
        this.memoryCache.set(url, assessment);
        this.stats.writes++;

        // Store in disk cache for persistence
        if (this.diskCache) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + THRESHOLDS.CACHE_TTL_DAYS);

            this.diskCache.domains[domain] = {
                domain,
                verdict: assessment.threatType ?? 'safe',
                confidence: assessment.confidence,
                lastVerified: getCurrentTimestamp(),
                source: this.getSource(assessment.analysisMethod),
                expiresAt: expiresAt.toISOString()
            };

            // Periodically save to disk (every 10 writes)
            if (this.stats.writes % 10 === 0) {
                this.saveDiskCache();
            }
        }

        console.log(`[Cache] Stored assessment for ${domain}`);
    }

    /**
     * Convert analysis method to intelligence source
     */
    private getSource(method: AnalysisMethod): IntelligenceSource {
        switch (method) {
            case AnalysisMethod.AI_ANALYSIS:
                return IntelligenceSource.GEMINI_AI;
            case AnalysisMethod.LOCAL_RULE:
                return IntelligenceSource.LOCAL_RULE;
            default:
                return IntelligenceSource.LOCAL_RULE;
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): { hits: number; misses: number; writes: number; hitRate: number; size: number } {
        const total = this.stats.hits + this.stats.misses;
        return {
            ...this.stats,
            hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
            size: this.memoryCache.size
        };
    }

    /**
     * Clear all caches
     */
    clear(): void {
        this.memoryCache.clear();
        this.diskCache = {
            version: '1.0.0',
            lastUpdated: getCurrentTimestamp(),
            domains: {}
        };
        this.saveDiskCache();
        console.log('[Cache] Cleared all caches');
    }

    /**
     * Force save disk cache
     */
    flush(): void {
        this.saveDiskCache();
    }

    /**
     * Prune expired entries from disk cache
     */
    prune(): number {
        if (!this.diskCache) return 0;

        let pruned = 0;
        const now = new Date().toISOString();

        for (const [domain, entry] of Object.entries(this.diskCache.domains)) {
            if (entry.expiresAt < now) {
                delete this.diskCache.domains[domain];
                pruned++;
            }
        }

        if (pruned > 0) {
            this.saveDiskCache();
            console.log(`[Cache] Pruned ${pruned} expired entries`);
        }

        return pruned;
    }
}

// Singleton instance
let cacheManagerInstance: CacheManager | null = null;

export function getCacheManager(): CacheManager {
    if (!cacheManagerInstance) {
        cacheManagerInstance = new CacheManager();
    }
    return cacheManagerInstance;
}
