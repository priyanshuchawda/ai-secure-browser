/**
 * Core TypeScript types for AI Secure Browser
 * Based on data-model.md entity specifications
 */

// ============================================
// Navigation Request (FR-001)
// ============================================

export interface NavigationRequest {
    id: string;                        // UUID
    url: string;                       // Full URL being navigated to
    referrer: string | null;           // Source of navigation
    triggerType: NavigationTrigger;    // How navigation was initiated
    timestamp: string;                 // ISO8601
    tabId: string;                     // Browser tab identifier
    frameId: number;                   // 0 for main frame, >0 for iframe
    redirectChain: string[];           // Previous URLs in redirect sequence (max 10)
    headers: Record<string, string>;   // HTTP request headers
    method: 'GET' | 'POST';            // HTTP method
}

export enum NavigationTrigger {
    LINK_CLICK = 'link_click',
    ADDRESS_BAR = 'address_bar',
    FORM_SUBMIT = 'form_submit',
    REDIRECT = 'redirect',
    BOOKMARK = 'bookmark',
    HISTORY = 'history',
    SCRIPT = 'script'
}

// ============================================
// Threat Assessment (FR-002, FR-010)
// ============================================

export interface ThreatAssessment {
    id: string;                        // UUID
    requestId: string;                 // Foreign key to NavigationRequest
    url: string;                       // URL analyzed
    threatType: ThreatType | null;     // Null if safe
    confidence: number;                // 0.0-1.0 confidence score
    indicators: ThreatIndicator[];     // Specific evidence found
    analysisMethod: AnalysisMethod;    // How verdict was determined
    aiModelUsed: string | null;        // e.g., "gemini-2.5-flash"
    analysisLatency: number;           // Milliseconds to complete
    timestamp: string;                 // ISO8601
    virusTotalResult?: VirusTotalResult; // NEW: VirusTotal scan data
}

export enum ThreatType {
    PHISHING = 'phishing',
    MALWARE = 'malware',
    SOCIAL_ENGINEERING = 'social_engineering'
}

export enum AnalysisMethod {
    CACHE_HIT = 'cache',               // From threat intelligence cache
    LOCAL_RULE = 'local_rule',         // Deterministic pattern matching
    AI_ANALYSIS = 'ai',                // Gemini API call
    OFFLINE_FALLBACK = 'offline'       // Offline mode with limited data
}

// ============================================
// Threat Indicator (FR-007, FR-010)
// ============================================

export interface ThreatIndicator {
    type: IndicatorType;
    description: string;               // Human-readable explanation (max 200 chars)
    severity: Severity;
    details: Record<string, unknown>;  // Structured evidence (type-specific)
}

export enum IndicatorType {
    DOMAIN_TYPOSQUATTING = 'domain_typo',
    DOMAIN_HOMOGRAPH = 'domain_homograph',
    SUSPICIOUS_TLD = 'suspicious_tld',
    NEW_DOMAIN = 'new_domain',
    CREDENTIAL_FORM = 'credential_form',
    JAVASCRIPT_OBFUSCATION = 'js_obfuscation',
    DRIVE_BY_DOWNLOAD = 'drive_by_download',
    FAKE_URGENCY = 'fake_urgency',
    IMPERSONATION = 'impersonation',
    DECEPTIVE_CONSENT = 'deceptive_consent',
    KNOWN_MALICIOUS = 'known_malicious',
    // Content-based indicators (from URL Context analysis)
    UNSAFE_CONTENT = 'unsafe_content',
    CREDENTIAL_HARVESTING = 'credential_harvesting',
    FAKE_URGENCY_TEXT = 'fake_urgency_text',
    BRAND_MISMATCH = 'brand_mismatch',
    SUSPICIOUS_FORM = 'suspicious_form'
}

export enum Severity {
    CRITICAL = 'critical',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    INFO = 'info'
}

// ============================================
// Security Decision (FR-003, FR-005)
// ============================================

export interface SecurityDecision {
    id: string;                        // UUID
    assessmentId: string;              // Foreign key to ThreatAssessment
    action: DecisionAction;
    rationale: string;                 // Why this decision was made
    overridable: boolean;              // Can user proceed anyway?
    requiresExplanation: boolean;      // Show warning page?
    riskLevel: RiskLevel;
    timestamp: string;                 // ISO8601
}

export enum DecisionAction {
    BLOCK = 'block',                   // Prevent navigation completely
    WARN = 'warn',                     // Show warning, allow override
    ALLOW = 'allow',                   // Permit navigation
    ALLOW_WITH_INDICATOR = 'allow_with_indicator' // Allow but show cautionary indicator
}

export enum RiskLevel {
    EXTREME = 'extreme',               // Credential theft, malware
    HIGH = 'high',                     // Likely phishing
    MEDIUM = 'medium',                 // Suspicious but uncertain
    LOW = 'low',                       // New domain, minor concerns
    SAFE = 'safe'                      // Verified safe
}

// ============================================
// Enforcement Result (FR-005, FR-006)
// ============================================

export interface EnforcementResult {
    id: string;                        // UUID
    decisionId: string;                // Foreign key to SecurityDecision
    requestId: string;                 // Foreign key to NavigationRequest
    blocked: boolean;                  // Was navigation prevented?
    warningShown: boolean;             // Was warning page displayed?
    userOverride: boolean;             // Did user choose to proceed?
    overrideReason: string | null;     // User's justification (if overridden)
    acknowledgedRisks: boolean;        // User explicitly accepted risks?
    timestamp: string;                 // ISO8601
}

// ============================================
// Warning Display (FR-004, FR-007)
// ============================================

export interface WarningDisplay {
    id: string;                        // UUID
    enforcementId: string;             // Foreign key to EnforcementResult
    threatType: ThreatType;
    severity: Severity;
    explanation: string;               // Plain-language threat description
    indicators: IndicatorExplanation[]; // User-friendly indicator list
    recommendedAction: string;         // "Go back to safety"
    alternativeActions: ActionOption[]; // Override, report false positive
    displayedAt: string;               // ISO8601
    userDismissedAt: string | null;    // ISO8601
    userChoice: UserChoice | null;
}

export interface IndicatorExplanation {
    icon: string;                      // Icon identifier for UI
    title: string;                     // Short headline
    description: string;               // Detailed explanation
    severity: Severity;
}

export interface ActionOption {
    label: string;                     // Button text
    type: ActionType;
    requiresConfirmation: boolean;
}

export enum ActionType {
    GO_BACK = 'go_back',
    REPORT_FALSE_POSITIVE = 'report_false_positive',
    PROCEED_ANYWAY = 'proceed_anyway'
}

export enum UserChoice {
    WENT_BACK = 'went_back',
    REPORTED_FALSE_POSITIVE = 'reported_false_positive',
    PROCEEDED = 'proceeded'
}

// ============================================
// Threat Intelligence Cache (FR-008, FR-009)
// ============================================

export interface ThreatIntelligence {
    version: string;                   // YYYY-MM-DD-HH format
    lastUpdated: string;               // ISO8601
    signature: string;                 // HMAC-SHA256 for integrity
    domains: Map<string, DomainVerdict>;
    patterns: ThreatPattern[];
    statistics: CacheStatistics;
}

export interface DomainVerdict {
    domain: string;
    verdict: ThreatType | 'safe';
    confidence: number;
    lastVerified: string;              // ISO8601
    source: IntelligenceSource;
    expiresAt: string;                 // ISO8601 (90-day TTL)
}

export enum IntelligenceSource {
    GOOGLE_SAFE_BROWSING = 'google_safebrowsing',
    PHISHTANK = 'phishtank',
    GEMINI_AI = 'gemini',
    LOCAL_RULE = 'local_rule',
    USER_REPORT = 'user_report'
}

export interface ThreatPattern {
    regex: string;                     // URL pattern to match
    threatType: ThreatType;
    description: string;
    addedAt: string;                   // ISO8601
}

export interface CacheStatistics {
    totalDomains: number;
    threatsCount: number;
    safeDomains: number;
    cacheHitRate: number;              // Percentage (0-100)
    lastUpdateDuration: number;        // Milliseconds
}

// ============================================
// Decision Log (FR-006)
// ============================================

export interface DecisionLog {
    id: string;                        // UUID
    timestamp: string;                 // ISO8601
    request: {
        url: string;                     // Sanitized (no sensitive query params)
        referrer: string | null;
        triggerType: NavigationTrigger;
    };
    assessment: {
        threatType: ThreatType | null;
        confidence: number;
        indicators: string[];            // Indicator types only (no details)
        analysisMethod: AnalysisMethod;
    };
    decision: {
        action: DecisionAction;
        rationale: string;
        overridable: boolean;
    };
    enforcement: {
        blocked: boolean;
        warningShown: boolean;
        userOverride: boolean;
        overrideReason: string | null;
    };
    performance: {
        analysisLatency: number;
        totalLatency: number;
    };
}

// ============================================
// False Positive Report (FR-011)
// ============================================

export interface FalsePositiveReport {
    id: string;                        // UUID
    logId: string;                     // Reference to DecisionLog
    url: string;
    threatType: ThreatType;
    userJustification: string;         // Free text (max 1000 chars)
    context: {
        originalConfidence: number;
        indicators: string[];
        userAction: 'proceeded_safely' | 'blocked_incorrectly';
    };
    submittedAt: string;               // ISO8601
    status: ReportStatus;
    resolution: string | null;         // How it was resolved
}

export enum ReportStatus {
    PENDING = 'pending',               // Stored locally, not yet reviewed
    SUBMITTED = 'submitted',           // Sent to improvement system
    CONFIRMED = 'confirmed',           // Verified as false positive
    REJECTED = 'rejected',             // Was actually a threat
    UNCLEAR = 'unclear'                // Needs more investigation
}

// ============================================
// API Request/Response Types
// ============================================

export interface AnalysisRequest {
    url: string;
    requestId: string;
    skipCache?: boolean;  // Force fresh analysis, bypass cache
    context?: {
        referrer?: string | null;
        triggerType?: NavigationTrigger;
        redirectChain?: string[];
        headers?: Record<string, string>;
    };
    options?: {
        forceAiAnalysis?: boolean;
        maxLatency?: number;
        offlineMode?: boolean;
    };
}

export interface AnalysisResponse {
    assessment: ThreatAssessment;
    decision: SecurityDecision;
    explanation?: WarningDisplay;
}

// ============================================
// Gemini AI Types
// ============================================

export interface GeminiThreatAnalysis {
    threatType: 'phishing' | 'malware' | 'social_engineering' | 'safe';
    confidence: number;
    indicators: Array<{
        type: string;
        description: string;
        severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    }>;
    recommendation: 'block' | 'warn' | 'allow';
    groundingMetadata?: {
        searchEntryPoint?: any;
        webSearchQueries?: string[];
        groundingChunks?: any[];
        groundingSupports?: any[];
    };
}

// ============================================
// VirusTotal Types
// ============================================

export interface VirusTotalResult {
    available: boolean;              // Is VirusTotal check completed?
    inDatabase: boolean;             // Was URL/file found in VT database?
    submitted?: boolean;             // Was item submitted for scanning?
    detectionRate: number;           // Percentage (0-100)
    positives: number;               // Number of scanners that detected threat
    total: number;                   // Total number of scanners
    scanDate: string | null;         // Last scan date (ISO8601)
    permalink: string | null;        // Link to VT report
    scans?: Record<string, any>;     // Individual scanner results
    sha256?: string;                 // File hash (for file scans)
    message: string;                 // Human-readable summary
}

export interface VirusTotalUrlReport extends VirusTotalResult {
    url: string;
}

export interface VirusTotalFileReport extends VirusTotalResult {
    sha256: string;
    md5?: string;
    filename?: string;
}
