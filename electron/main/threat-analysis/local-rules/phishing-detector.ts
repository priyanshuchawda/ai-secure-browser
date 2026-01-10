/**
 * Local Phishing Detector
 * Pattern-based detection without AI (fast path)
 * Based on research.md Decision 4
 */

import {
    ThreatIndicator,
    IndicatorType,
    Severity,
    ThreatType
} from '../../../../src/shared/types';
import {
    COMMON_TARGETS,
    SUSPICIOUS_TLDS,
    KNOWN_AUTH_PROVIDERS
} from '../../../../src/shared/constants';
import {
    extractDomain,
    levenshteinDistance,
    containsHomographs
} from '../../../../src/shared/utils';

/**
 * Result of local phishing detection
 */
export interface LocalDetectionResult {
    isPhishing: boolean;
    confidence: number;
    indicators: ThreatIndicator[];
    threatType: ThreatType | null;
}

/**
 * Local Phishing Detector
 * Fast, deterministic pattern matching
 */
export class PhishingDetector {
    /**
     * Analyze a URL for phishing indicators
     */
    analyze(url: string): LocalDetectionResult {
        const domain = extractDomain(url);
        if (!domain) {
            return { isPhishing: false, confidence: 0, indicators: [], threatType: null };
        }

        const indicators: ThreatIndicator[] = [];
        let maxSeverity: Severity = Severity.INFO;

        // Check for typosquatting
        const typosquatResult = this.checkTyposquatting(domain);
        if (typosquatResult) {
            indicators.push(typosquatResult);
            if (typosquatResult.severity === Severity.CRITICAL || typosquatResult.severity === Severity.HIGH) {
                maxSeverity = typosquatResult.severity;
            }
        }

        // Check for homograph attacks
        const homographResult = this.checkHomograph(domain);
        if (homographResult) {
            indicators.push(homographResult);
            maxSeverity = Severity.CRITICAL;
        }

        // Check for suspicious TLDs
        const tldResult = this.checkSuspiciousTLD(domain);
        if (tldResult) {
            indicators.push(tldResult);
            if (maxSeverity !== Severity.CRITICAL) {
                maxSeverity = Severity.MEDIUM;
            }
        }

        // Check for credential harvesting paths
        const pathResult = this.checkCredentialPath(url);
        if (pathResult) {
            indicators.push(pathResult);
        }

        // Check if it's a known auth provider (whitelist)
        if (this.isAuthProvider(domain)) {
            return { isPhishing: false, confidence: 1.0, indicators: [], threatType: null };
        }

        // Calculate confidence based on indicators
        const confidence = this.calculateConfidence(indicators, maxSeverity);
        const isPhishing = confidence >= 0.5;

        return {
            isPhishing,
            confidence,
            indicators,
            threatType: isPhishing ? ThreatType.PHISHING : null
        };
    }

    /**
     * Check for typosquatting (similar domains to known brands)
     */
    private checkTyposquatting(domain: string): ThreatIndicator | null {
        // Remove common subdomains
        const baseDomain = domain
            .replace(/^www\./, '')
            .replace(/^login\./, '')
            .replace(/^secure\./, '')
            .replace(/^account\./, '');

        for (const target of COMMON_TARGETS) {
            for (const legitimateDomain of target.domains) {
                const distance = levenshteinDistance(baseDomain, legitimateDomain);

                // Very similar but not exact match (1-2 character difference)
                if (distance > 0 && distance <= 2) {
                    return {
                        type: IndicatorType.DOMAIN_TYPOSQUATTING,
                        description: `Domain "${baseDomain}" is similar to legitimate "${legitimateDomain}" (${target.brand})`,
                        severity: distance === 1 ? Severity.CRITICAL : Severity.HIGH,
                        details: {
                            legitimate: legitimateDomain,
                            suspicious: baseDomain,
                            brand: target.brand,
                            distance
                        }
                    };
                }
            }
        }

        return null;
    }

    /**
     * Check for homograph attacks (lookalike characters)
     */
    private checkHomograph(domain: string): ThreatIndicator | null {
        if (containsHomographs(domain)) {
            return {
                type: IndicatorType.DOMAIN_HOMOGRAPH,
                description: `Domain contains characters that look like English letters but aren't (homograph attack)`,
                severity: Severity.CRITICAL,
                details: {
                    domain,
                    reason: 'Contains non-ASCII characters that resemble Latin letters'
                }
            };
        }

        // Check for common character substitutions (not caught by homographs)
        const substitutions: Array<[RegExp, string]> = [
            [/0/g, 'o'],  // 0 → o
            [/1/g, 'l'],  // 1 → l
            [/1/g, 'i'],  // 1 → i  
            [/5/g, 's'],  // 5 → s
            [/3/g, 'e'],  // 3 → e
        ];

        for (const [pattern, replacement] of substitutions) {
            if (pattern.test(domain)) {
                const normalized = domain.replace(pattern, replacement);

                for (const target of COMMON_TARGETS) {
                    for (const legitimateDomain of target.domains) {
                        if (normalized === legitimateDomain.replace(/\.(com|net|org)$/, '').replace('.', '')) {
                            return {
                                type: IndicatorType.DOMAIN_HOMOGRAPH,
                                description: `Domain uses number/letter substitution to impersonate "${legitimateDomain}"`,
                                severity: Severity.HIGH,
                                details: {
                                    suspicious: domain,
                                    normalized,
                                    legitimate: legitimateDomain,
                                    brand: target.brand
                                }
                            };
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * Check for suspicious TLDs
     */
    private checkSuspiciousTLD(domain: string): ThreatIndicator | null {
        for (const tld of SUSPICIOUS_TLDS) {
            if (domain.endsWith(tld)) {
                return {
                    type: IndicatorType.SUSPICIOUS_TLD,
                    description: `Domain uses suspicious TLD "${tld}" commonly associated with malicious sites`,
                    severity: Severity.MEDIUM,
                    details: {
                        domain,
                        tld
                    }
                };
            }
        }

        return null;
    }

    /**
     * Check for credential harvesting paths
     */
    private checkCredentialPath(url: string): ThreatIndicator | null {
        const credentialPatterns = [
            /\/login/i,
            /\/signin/i,
            /\/sign-in/i,
            /\/password/i,
            /\/reset[-_]?password/i,
            /\/account/i,
            /\/verify/i,
            /\/secure/i,
            /\/auth/i,
            /\/oauth/i,
            /\/confirm/i
        ];

        try {
            const parsed = new URL(url);
            const path = parsed.pathname.toLowerCase();

            for (const pattern of credentialPatterns) {
                if (pattern.test(path)) {
                    return {
                        type: IndicatorType.CREDENTIAL_FORM,
                        description: `URL path suggests credential collection ("${path}")`,
                        severity: Severity.LOW,  // Low by itself, high with other indicators
                        details: {
                            path,
                            pattern: pattern.source
                        }
                    };
                }
            }
        } catch {
            // Invalid URL
        }

        return null;
    }

    /**
     * Check if domain is a known authentication provider
     */
    private isAuthProvider(domain: string): boolean {
        // Remove www. prefix
        const baseDomain = domain.replace(/^www\./, '');

        return KNOWN_AUTH_PROVIDERS.some(provider =>
            baseDomain === provider || baseDomain.endsWith('.' + provider)
        );
    }

    /**
     * Calculate overall confidence score
     */
    private calculateConfidence(indicators: ThreatIndicator[], maxSeverity: Severity): number {
        if (indicators.length === 0) {
            return 0;
        }

        // Base confidence by max severity
        let confidence = 0;
        switch (maxSeverity) {
            case Severity.CRITICAL:
                confidence = 0.95;
                break;
            case Severity.HIGH:
                confidence = 0.8;
                break;
            case Severity.MEDIUM:
                confidence = 0.5;
                break;
            case Severity.LOW:
                confidence = 0.3;
                break;
            default:
                confidence = 0.1;
        }

        // Boost confidence with multiple indicators
        if (indicators.length >= 2) {
            confidence = Math.min(1.0, confidence + 0.1);
        }
        if (indicators.length >= 3) {
            confidence = Math.min(1.0, confidence + 0.1);
        }

        return confidence;
    }
}

// Singleton instance
let detectorInstance: PhishingDetector | null = null;

export function getPhishingDetector(): PhishingDetector {
    if (!detectorInstance) {
        detectorInstance = new PhishingDetector();
    }
    return detectorInstance;
}
