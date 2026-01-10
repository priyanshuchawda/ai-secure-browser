/**
 * Shared utility functions
 * Used across main and renderer processes
 */

import { randomUUID } from 'crypto';

// ============================================
// UUID Generation
// ============================================

/**
 * Generate a new UUID v4
 */
export function generateUUID(): string {
    return randomUUID();
}

// ============================================
// URL Utilities
// ============================================

/**
 * Extract the domain from a URL
 */
export function extractDomain(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.hostname.toLowerCase();
    } catch {
        return '';
    }
}

/**
 * Check if URL is HTTP/HTTPS (allowed protocols)
 */
export function isValidHttpUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Sanitize URL for logging (remove sensitive query params)
 */
export function sanitizeUrlForLogging(url: string): string {
    try {
        const parsed = new URL(url);
        const sensitiveParams = ['token', 'key', 'password', 'secret', 'auth', 'session', 'code'];

        for (const param of sensitiveParams) {
            if (parsed.searchParams.has(param)) {
                parsed.searchParams.set(param, '[REDACTED]');
            }
        }

        return parsed.toString();
    } catch {
        return url;
    }
}

// ============================================
// String Utilities
// ============================================

/**
 * Calculate Levenshtein distance between two strings
 * Used for typosquatting detection
 */
export function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Check if a string contains common homograph characters
 * (characters that look like ASCII but aren't)
 */
export function containsHomographs(str: string): boolean {
    // Common homograph characters (Cyrillic, Greek, etc. that look like Latin)
    const homographPattern = /[а-яА-ЯіІєЄїЇёЁ]/; // Basic Cyrillic
    return homographPattern.test(str);
}

// ============================================
// Date Utilities
// ============================================

/**
 * Get current ISO8601 timestamp
 */
export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Check if a date is older than specified days
 */
export function isOlderThan(dateStr: string, days: number): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays > days;
}

/**
 * Format date for log filename (YYYY-MM-DD)
 */
export function formatDateForFilename(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

// ============================================
// Validation Utilities
// ============================================

/**
 * Validate confidence score is in range [0, 1]
 */
export function isValidConfidence(confidence: number): boolean {
    return typeof confidence === 'number' && confidence >= 0 && confidence <= 1;
}

/**
 * Truncate string to max length
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
}

// ============================================
// Object Utilities
// ============================================

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
