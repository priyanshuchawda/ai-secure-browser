/**
 * Application configuration constants
 * Based on research.md decisions and spec.md requirements
 */

// ============================================
// Application Metadata
// ============================================

export const APP_NAME = 'AI Secure Browser';
export const APP_VERSION = '1.0.0';

// ============================================
// Performance Targets (SC-005)
// ============================================

export const PERFORMANCE = {
    /** Maximum analysis time before timeout (ms) - increased for 3-step analysis */
    ANALYSIS_TIMEOUT_MS: 30000,
    /** Target latency for 99% of requests (ms) */
    TARGET_LATENCY_P99_MS: 1000,
    /** Memory cache size (number of entries) */
    MEMORY_CACHE_SIZE: 10000,
    /** Disk cache max entries */
    DISK_CACHE_SIZE: 100000
} as const;

// ============================================
// Thresholds (from research.md Decision 4)
// ============================================

export const THRESHOLDS = {
    /** Auto-block confidence threshold */
    AUTO_BLOCK_CONFIDENCE: 0.9,
    /** Warn (don't block) below this confidence */
    WARN_CONFIDENCE: 0.7,
    /** Cache TTL in days */
    CACHE_TTL_DAYS: 90,
    /** Log retention in days (FR-006) */
    LOG_RETENTION_DAYS: 90,
    /** Max redirect chain hops */
    MAX_REDIRECTS: 10,
    /** False positive report max age in days */
    FEEDBACK_MAX_AGE_DAYS: 7
} as const;

// ============================================
// Gemini AI Configuration
// ============================================

export const GEMINI = {
    /** Primary model to use for threat analysis */
    MODEL: 'gemini-2.5-flash',
    /** Fallback model when primary hits rate limits */
    FALLBACK_MODEL: 'gemini-2.5-flash-lite',
    /** Max tokens for response */
    MAX_OUTPUT_TOKENS: 1024,
    /** Temperature for deterministic outputs */
    TEMPERATURE: 0,
    /** Response format */
    RESPONSE_MIME_TYPE: 'application/json',
    /** Enable URL Context tool for content fetching */
    URL_CONTEXT_ENABLED: true,
    /** Enable Google Search tool for domain grounding */
    GOOGLE_SEARCH_ENABLED: true,
    /** Confidence below this triggers deep content analysis */
    DEEP_ANALYSIS_THRESHOLD: 0.5,
    /** Max latency for deep analysis (ms) */
    DEEP_ANALYSIS_TIMEOUT_MS: 15000
} as const;

// ============================================
// File Paths
// ============================================

export const PATHS = {
    /** Threat intelligence cache */
    THREAT_CACHE: 'data/threat-cache/intelligence.json',
    /** Decision logs directory */
    LOGS_DIR: 'data/logs',
    /** False positive reports directory */
    FEEDBACK_DIR: 'data/feedback',
    /** Auth providers whitelist */
    AUTH_WHITELIST: 'electron/main/threat-analysis/local-rules/auth-providers-whitelist.json'
} as const;

// ============================================
// Known Safe Domains (SC-008)
// ============================================

export const KNOWN_AUTH_PROVIDERS = [
    'accounts.google.com',
    'login.microsoft.com',
    'github.com',
    'auth0.com',
    'okta.com',
    'login.live.com',
    'appleid.apple.com',
    'facebook.com',
    'twitter.com',
    'linkedin.com'
] as const;

// ============================================
// Suspicious TLDs
// ============================================

export const SUSPICIOUS_TLDS = [
    '.tk',
    '.ml',
    '.ga',
    '.cf',
    '.gq',
    '.xyz',
    '.top',
    '.work',
    '.click',
    '.loan',
    '.racing'
] as const;

// ============================================
// Common Brand Domains (for typosquatting detection)
// ============================================

export const COMMON_TARGETS = [
    { brand: 'PayPal', domains: ['paypal.com', 'paypal.me'] },
    { brand: 'Google', domains: ['google.com', 'gmail.com', 'accounts.google.com'] },
    { brand: 'Microsoft', domains: ['microsoft.com', 'outlook.com', 'live.com'] },
    { brand: 'Apple', domains: ['apple.com', 'icloud.com'] },
    { brand: 'Amazon', domains: ['amazon.com', 'aws.amazon.com'] },
    { brand: 'Facebook', domains: ['facebook.com', 'fb.com'] },
    { brand: 'Netflix', domains: ['netflix.com'] },
    { brand: 'Bank of America', domains: ['bankofamerica.com'] },
    { brand: 'Chase', domains: ['chase.com'] },
    { brand: 'Wells Fargo', domains: ['wellsfargo.com'] }
] as const;

// ============================================
// IPC Channels
// ============================================

export const IPC_CHANNELS = {
    /** Request threat analysis */
    ANALYZE_REQUEST: 'threat:analyze',
    /** Get analysis result */
    ANALYSIS_RESULT: 'threat:result',
    /** User override decision */
    USER_OVERRIDE: 'threat:override',
    /** Submit false positive report */
    REPORT_FALSE_POSITIVE: 'threat:report-fp',
    /** Get app status */
    GET_STATUS: 'app:status',
    /** Navigate to URL */
    NAVIGATE: 'browser:navigate'
} as const;
