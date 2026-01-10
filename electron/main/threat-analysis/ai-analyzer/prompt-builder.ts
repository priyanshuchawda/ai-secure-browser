/**
 * Prompt Builder for Gemini Threat Analysis
 * Creates structured prompts for different threat types
 */

import { ThreatType } from '../../../../src/shared/types';

/**
 * Build URL analysis prompt
 */
export function buildUrlAnalysisPrompt(
    url: string,
    options?: {
        referrer?: string | null;
        redirectChain?: string[];
        focusThreatType?: ThreatType;
    }
): string {
    const parts: string[] = [];

    // Core instruction
    parts.push(`Analyze the following URL for security threats: ${url}`);
    parts.push('');

    // Context
    if (options?.referrer) {
        parts.push(`Referrer URL: ${options.referrer}`);
    }

    if (options?.redirectChain && options.redirectChain.length > 0) {
        parts.push(`Redirect chain: ${options.redirectChain.join(' → ')}`);
    }

    parts.push('');

    // Threat-specific focus
    if (options?.focusThreatType) {
        parts.push(getThreatFocusPrompt(options.focusThreatType));
    } else {
        parts.push(getGeneralThreatPrompt());
    }

    return parts.join('\n');
}

/**
 * Get general threat detection prompt
 */
function getGeneralThreatPrompt(): string {
    return `Analyze for all threat types:

## Phishing Detection
- Domain typosquatting (e.g., paypa1.com, go0gle.com)
- Homograph attacks (Cyrillic/Greek characters)
- Brand impersonation in path/subdomain
- Credential harvesting forms
- Fake login pages

## Malware Detection
- Known malware distribution domains
- Suspicious download patterns (.exe, .scr, .bat)
- Drive-by download indicators
- Compromised site patterns

## Social Engineering
- Fake urgency messages
- Tech support scam patterns
- Deceptive OAuth consent requests
- Manipulation tactics

Respond with structured analysis including:
- Threat type (phishing/malware/social_engineering/safe)
- Confidence score (0.0-1.0)
- Specific indicators found
- Recommended action (block/warn/allow)`;
}

/**
 * Get threat-specific focus prompt
 */
function getThreatFocusPrompt(threatType: ThreatType): string {
    switch (threatType) {
        case ThreatType.PHISHING:
            return `Focus on PHISHING detection:
- Check for domain typosquatting
- Look for homograph attacks (similar-looking characters)
- Identify brand impersonation
- Detect credential harvesting patterns
- Analyze login form characteristics`;

        case ThreatType.MALWARE:
            return `Focus on MALWARE detection:
- Check for known malicious domains
- Identify download-related patterns
- Look for drive-by download indicators
- Analyze file extension in URLs
- Check for obfuscation patterns`;

        case ThreatType.SOCIAL_ENGINEERING:
            return `Focus on SOCIAL ENGINEERING detection:
- Identify fake urgency language
- Look for tech support scam patterns
- Detect deceptive consent requests
- Analyze manipulation tactics
- Check for impersonation attempts`;

        default:
            return getGeneralThreatPrompt();
    }
}

/**
 * Build explanation prompt for user-facing messages
 */
export function buildExplanationPrompt(
    url: string,
    threatType: ThreatType,
    indicators: string[]
): string {
    return `Generate a user-friendly explanation for blocking this URL:

URL: ${url}
Threat Type: ${threatType}
Indicators: ${indicators.join(', ')}

Create a simple, non-technical explanation that:
1. Explains what the threat is
2. Why it's dangerous
3. What the user should do

Keep it under 100 words. Avoid technical jargon.`;
}
