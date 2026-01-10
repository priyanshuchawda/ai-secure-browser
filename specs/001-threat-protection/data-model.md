# Data Model: Proactive Threat Protection

**Feature**: 001-threat-protection  
**Date**: 2026-01-08  
**Phase**: 1 (Design)

This document defines the core entities, their relationships, validation rules, and state transitions for the threat protection system.

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│ NavigationRequest   │
└──────────┬──────────┘
           │ 1
           │
           │ analyzes
           ↓ *
┌─────────────────────┐
│ ThreatAssessment    │◄──────┐
└──────────┬──────────┘       │ caches
           │ 1                 │
           │                   │
           │ informs      ┌────┴──────────────┐
           ↓ *            │ ThreatIntelligence│
┌─────────────────────┐  └───────────────────┘
│ SecurityDecision    │
└──────────┬──────────┘
           │ 1
           │
           │ produces
           ↓ *
┌─────────────────────┐       ┌─────────────────────┐
│ EnforcementResult   │──────►│ DecisionLog         │
└──────────┬──────────┘       └─────────────────────┘
           │                           │
           │                           │ expires after
           │                           │ 90 days
           ↓ 0..1                      ↓
┌─────────────────────┐       ┌─────────────────────┐
│ WarningDisplay      │       │                     │
└─────────────────────┘       │   (auto-delete)     │
                              │                     │
                              └─────────────────────┘
           │ 0..1
           │ may generate
           ↓
┌─────────────────────┐
│ FalsePositiveReport │
└─────────────────────┘

┌─────────────────────┐
│ ThreatIndicator     │
└─────────────────────┘
           │ *
           └─────────► belongs to ThreatAssessment
```

---

## Core Entities

### 1. NavigationRequest

Represents a user-initiated navigation event captured before page load.

**Properties**:
```typescript
interface NavigationRequest {
  id: UUID;                      // Unique request identifier
  url: URL;                      // Full URL being navigated to
  referrer: URL | null;          // Source of navigation
  triggerType: NavigationTrigger; // How navigation was initiated
  timestamp: ISO8601;            // When interception occurred
  tabId: string;                 // Browser tab identifier
  frameId: number;               // 0 for main frame, >0 for iframe
  redirectChain: URL[];          // Previous URLs in redirect sequence
  headers: Record<string, string>; // HTTP request headers
  method: 'GET' | 'POST';        // HTTP method
}

enum NavigationTrigger {
  LINK_CLICK = 'link_click',
  ADDRESS_BAR = 'address_bar',
  FORM_SUBMIT = 'form_submit',
  REDIRECT = 'redirect',
  BOOKMARK = 'bookmark',
  HISTORY = 'history',
  SCRIPT = 'script'
}
```

**Validation Rules**:
- `url` must be valid HTTP/HTTPS URL (reject data:, javascript:, file: schemes)
- `redirectChain` limited to 10 hops (detect redirect loops)
- `method` must be GET or POST (reject others for security)
- `timestamp` must be within 60 seconds of current time (prevent replay attacks)

**Source**: FR-001 (intercept all navigation events)

---

### 2. ThreatAssessment

Analysis result from the threat detection engine, combining local rules and AI reasoning.

**Properties**:
```typescript
interface ThreatAssessment {
  id: UUID;
  requestId: UUID;               // Foreign key to NavigationRequest
  url: URL;                      // URL analyzed
  threatType: ThreatType | null; // Null if safe
  confidence: number;            // 0.0-1.0 confidence score
  indicators: ThreatIndicator[]; // Specific evidence found
  analysisMethod: AnalysisMethod; // How verdict was determined
  aiModelUsed: string | null;    // e.g., "gemini-2.5-flash"
  analysisLatency: number;       // Milliseconds to complete
  timestamp: ISO8601;
}

enum ThreatType {
  PHISHING = 'phishing',
  MALWARE = 'malware',
  SOCIAL_ENGINEERING = 'social_engineering'
}

enum AnalysisMethod {
  CACHE_HIT = 'cache',           // From threat intelligence cache
  LOCAL_RULE = 'local_rule',     // Deterministic pattern matching
  AI_ANALYSIS = 'ai',            // Gemini API call
  OFFLINE_FALLBACK = 'offline'   // Offline mode with limited data
}
```

**Validation Rules**:
- `confidence` must be between 0.0 and 1.0
- If `threatType` is not null, `indicators` array must not be empty (require evidence)
- If `analysisMethod === 'ai'`, `aiModelUsed` must not be null
- `analysisLatency` must be ≤ 10,000ms (10 second timeout)

**State Transitions**:
```
[New URL] → [Analyzing]
          ↓
     [Assessed]
          ↓
      (cached for 90 days or until cache invalidation)
```

**Source**: FR-002 (multi-indicator analysis), SC-005 (latency requirement)

---

### 3. ThreatIndicator

Specific evidence detected during threat analysis, used to explain verdict to users.

**Properties**:
```typescript
interface ThreatIndicator {
  type: IndicatorType;
  description: string;           // Human-readable explanation
  severity: Severity;
  details: Record<string, any>;  // Structured evidence
}

enum IndicatorType {
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
  KNOWN_MALICIOUS = 'known_malicious'
}

enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}
```

**Validation Rules**:
- `description` must be non-empty and ≤ 200 characters (concise explanations)
- `details` must contain evidence specific to `type`:
  - `domain_typo`: `{ legitimate: string, typo: string, distance: number }`
  - `credential_form`: `{ inputFields: string[], submitsTo: string }`
  - `new_domain`: `{ registeredDate: ISO8601, ageInDays: number }`

**Example Instances**:
```typescript
{
  type: 'domain_typo',
  description: 'Domain paypa1.com mimics paypal.com',
  severity: 'critical',
  details: { legitimate: 'paypal.com', typo: 'paypa1.com', distance: 1 }
}

{
  type: 'credential_form',
  description: 'Password input detected before page load',
  severity: 'high',
  details: { inputFields: ['username', 'password'], submitsTo: 'http://evil.com/steal' }
}
```

**Source**: FR-007 (specific indicators), FR-010 (threat type distinction)

---

### 4. SecurityDecision

Deterministic decision made by the decision engine, separating AI reasoning from enforcement.

**Properties**:
```typescript
interface SecurityDecision {
  id: UUID;
  assessmentId: UUID;            // Foreign key to ThreatAssessment
  action: DecisionAction;
  rationale: string;             // Why this decision was made
  overridable: boolean;          // Can user proceed anyway?
  requiresExplanation: boolean;  // Show warning page?
  riskLevel: RiskLevel;
  timestamp: ISO8601;
}

enum DecisionAction {
  BLOCK = 'block',               // Prevent navigation completely
  WARN = 'warn',                 // Show warning, allow override
  ALLOW = 'allow',               // Permit navigation
  ALLOW_WITH_INDICATOR = 'allow_with_indicator' // Allow but show cautionary indicator
}

enum RiskLevel {
  EXTREME = 'extreme',           // Credential theft, malware
  HIGH = 'high',                 // Likely phishing
  MEDIUM = 'medium',             // Suspicious but uncertain
  LOW = 'low',                   // New domain, minor concerns
  SAFE = 'safe'                  // Verified safe
}
```

**Validation Rules**:
- If `action === 'block'`, `requiresExplanation` must be true (FR-004)
- If `riskLevel === 'safe'`, `action` must be 'allow'
- `rationale` must reference at least one indicator from assessment

**Decision Logic**:
```typescript
function makeDecision(assessment: ThreatAssessment): SecurityDecision {
  // High-confidence cached threats → auto-block
  if (assessment.confidence >= 0.9 && assessment.analysisMethod === 'cache') {
    return {
      action: 'block',
      rationale: `Confirmed ${assessment.threatType} in threat database`,
      overridable: true,
      requiresExplanation: true,
      riskLevel: 'extreme'
    };
  }
  
  // AI uncertainty → warn, don't block (minimize false positives)
  if (assessment.confidence < 0.7 && assessment.threatType !== null) {
    return {
      action: 'warn',
      rationale: `Possible ${assessment.threatType}, confidence ${assessment.confidence}`,
      overridable: true,
      requiresExplanation: true,
      riskLevel: 'medium'
    };
  }
  
  // Known authentication providers → whitelist
  if (isAuthProvider(assessment.url)) {
    return {
      action: 'allow',
      rationale: 'Verified authentication provider',
      overridable: false,
      requiresExplanation: false,
      riskLevel: 'safe'
    };
  }
  
  // New domains → cautionary indicator
  if (hasIndicator(assessment, 'new_domain')) {
    return {
      action: 'allow_with_indicator',
      rationale: 'New domain with limited safety information',
      overridable: false,
      requiresExplanation: false,
      riskLevel: 'low'
    };
  }
  
  // Default: allow
  return {
    action: 'allow',
    rationale: 'No threats detected',
    overridable: false,
    requiresExplanation: false,
    riskLevel: 'safe'
  };
}
```

**Source**: FR-003 (block confirmed threats), FR-005 (user override), FR-016 (new domain handling)

---

### 5. EnforcementResult

Outcome of applying a security decision to a navigation request.

**Properties**:
```typescript
interface EnforcementResult {
  id: UUID;
  decisionId: UUID;              // Foreign key to SecurityDecision
  requestId: UUID;               // Foreign key to NavigationRequest
  blocked: boolean;              // Was navigation prevented?
  warningShown: boolean;         // Was warning page displayed?
  userOverride: boolean;         // Did user choose to proceed?
  overrideReason: string | null; // User's justification (if overridden)
  acknowledgedRisks: boolean;    // User explicitly accepted risks?
  timestamp: ISO8601;
}
```

**Validation Rules**:
- If `userOverride === true`, `overrideReason` must be non-null (FR-005)
- If `blocked === true`, `warningShown` must be true (FR-004)
- If `userOverride === true`, `acknowledgedRisks` must be true (explicit consent)

**State Transitions**:
```
[Decision Made] → [Enforcing]
                ↓
         [Warning Shown] (if required)
                ↓
         [User Response]
           ↙        ↘
    [Blocked]    [Override] → [Allowed]
```

**Source**: FR-005 (user override with confirmation), FR-006 (logging)

---

### 6. WarningDisplay

User-facing warning page displayed when threats are detected.

**Properties**:
```typescript
interface WarningDisplay {
  id: UUID;
  enforcementId: UUID;           // Foreign key to EnforcementResult
  threatType: ThreatType;
  severity: Severity;
  explanation: string;           // Plain-language threat description
  indicators: IndicatorExplanation[]; // User-friendly indicator list
  recommendedAction: string;     // "Go back to safety"
  alternativeActions: Action[];  // Override, report false positive
  displayedAt: ISO8601;
  userDismissedAt: ISO8601 | null;
  userChoice: UserChoice | null;
}

interface IndicatorExplanation {
  icon: string;                  // Icon identifier for UI
  title: string;                 // Short headline
  description: string;           // Detailed explanation
  severity: Severity;
}

interface Action {
  label: string;                 // Button text
  type: ActionType;
  requiresConfirmation: boolean;
}

enum ActionType {
  GO_BACK = 'go_back',
  REPORT_FALSE_POSITIVE = 'report_false_positive',
  PROCEED_ANYWAY = 'proceed_anyway'
}

enum UserChoice {
  WENT_BACK = 'went_back',
  REPORTED_FALSE_POSITIVE = 'reported_false_positive',
  PROCEEDED = 'proceeded'
}
```

**Validation Rules**:
- `explanation` must be non-technical language (SC-004 comprehension requirement)
- `indicators` array must match those in corresponding `ThreatAssessment`
- If `userChoice === 'proceeded'`, corresponding `EnforcementResult.userOverride` must be true

**Example Display**:
```typescript
{
  id: '...',
  enforcementId: '...',
  threatType: 'phishing',
  severity: 'critical',
  explanation: 'This website is pretending to be PayPal to steal your password.',
  indicators: [
    {
      icon: 'domain-mismatch',
      title: 'Fake Website Address',
      description: 'Real PayPal: paypal.com → This fake site: paypa1.com (notice the "1")',
      severity: 'critical'
    },
    {
      icon: 'suspicious-form',
      title: 'Immediate Password Request',
      description: 'Legitimate sites don\'t ask for passwords before loading the page.',
      severity: 'high'
    }
  ],
  recommendedAction: 'Go back to stay safe',
  alternativeActions: [
    { label: 'Report incorrect block', type: 'report_false_positive', requiresConfirmation: false },
    { label: 'I understand the risks, proceed anyway', type: 'proceed_anyway', requiresConfirmation: true }
  ]
}
```

**Source**: FR-004 (warning display), FR-007 (detailed indicators), SC-004 (comprehension)

---

### 7. ThreatIntelligence

Cached threat data enabling offline operation and fast lookups.

**Properties**:
```typescript
interface ThreatIntelligence {
  version: string;               // YYYY-MM-DD-HH format
  lastUpdated: ISO8601;
  signature: string;             // HMAC-SHA256 for integrity
  domains: Map<string, DomainVerdict>;
  patterns: ThreatPattern[];
  statistics: CacheStatistics;
}

interface DomainVerdict {
  domain: string;
  verdict: ThreatType | 'safe';
  confidence: number;
  lastVerified: ISO8601;
  source: IntelligenceSource;
  expiresAt: ISO8601;            // 90-day TTL
}

enum IntelligenceSource {
  GOOGLE_SAFE_BROWSING = 'google_safebrowsing',
  PHISHTANK = 'phishtank',
  GEMINI_AI = 'gemini',
  LOCAL_RULE = 'local_rule',
  USER_REPORT = 'user_report'
}

interface ThreatPattern {
  regex: string;                 // URL pattern to match
  threatType: ThreatType;
  description: string;
  addedAt: ISO8601;
}

interface CacheStatistics {
  totalDomains: number;
  threatsCount: number;
  safeDomains: number;
  cacheHitRate: number;          // Percentage (0-100)
  lastUpdateDuration: number;    // Milliseconds
}
```

**Validation Rules**:
- `version` must follow semantic versioning pattern
- `signature` must validate against known public key (prevent tampering)
- `domains` limited to 100,000 entries (memory constraint)
- `expiresAt` must be ≤ 90 days from `lastVerified` (FR-009)

**Update Process**:
1. Fetch delta updates from intelligence sources
2. Merge with existing cache
3. Prune expired entries (`expiresAt` < now)
4. Compute new signature
5. Atomic write to disk

**Source**: FR-008 (local-first), FR-009 (cached intelligence), SC-006 (offline operation)

---

### 8. DecisionLog

Audit trail of all threat detections and enforcement actions.

**Properties**:
```typescript
interface DecisionLog {
  id: UUID;
  timestamp: ISO8601;
  request: {
    url: string;                 // Sanitized (no sensitive query params)
    referrer: string | null;
    triggerType: NavigationTrigger;
  };
  assessment: {
    threatType: ThreatType | null;
    confidence: number;
    indicators: string[];        // Indicator types only (no details)
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
```

**Validation Rules**:
- `url` must be sanitized (remove tokens, session IDs from query params)
- Logs older than 90 days auto-deleted (FR-006 retention policy)
- No personally identifiable information (PII) in logs (privacy)

**Log Rotation**:
- Daily log files: `decisions-YYYY-MM-DD.jsonl`
- Automatic cleanup cron job (runs daily at 2 AM)
- Compression for logs older than 7 days (gzip)

**Source**: FR-006 (logging with 90-day retention)

---

### 9. FalsePositiveReport

User feedback on incorrect threat detections, used to improve the system.

**Properties**:
```typescript
interface FalsePositiveReport {
  id: UUID;
  logId: UUID;                   // Reference to DecisionLog
  url: string;
  threatType: ThreatType;
  userJustification: string;     // Free text (max 1000 chars)
  context: {
    originalConfidence: number;
    indicators: string[];
    userAction: 'proceeded_safely' | 'blocked_incorrectly';
  };
  submittedAt: ISO8601;
  status: ReportStatus;
  resolution: string | null;     // How it was resolved
}

enum ReportStatus {
  PENDING = 'pending',           // Stored locally, not yet reviewed
  SUBMITTED = 'submitted',       // Sent to improvement system
  CONFIRMED = 'confirmed',       // Verified as false positive
  REJECTED = 'rejected',         // Was actually a threat
  UNCLEAR = 'unclear'            // Needs more investigation
}
```

**Validation Rules**:
- `userJustification` required and non-empty (min 10 chars)
- `url` must match the URL in referenced `DecisionLog`
- `submittedAt` must be within 7 days of original detection (timely feedback)

**Feedback Loop**:
1. User reports false positive via warning page
2. Stored locally in `data/feedback/`
3. Periodically (weekly), aggregate and anonymize reports
4. Use reports to refine local rules and AI prompts
5. High-frequency false positives → add to whitelist

**Source**: FR-011 (false positive feedback), SC-003 (<2% false positive rate)

---

## Validation Summary

| Entity | Key Constraints | Retention |
|--------|----------------|-----------|
| NavigationRequest | Valid HTTP/HTTPS URL, max 10 redirects | Session-only (not persisted) |
| ThreatAssessment | Confidence 0.0-1.0, latency ≤10s | Cached 90 days |
| ThreatIndicator | Description ≤200 chars, evidence required | Embedded in ThreatAssessment |
| SecurityDecision | Action must match risk level | Logged in DecisionLog |
| EnforcementResult | Override requires reason + acknowledgment | Logged in DecisionLog |
| WarningDisplay | Plain language (SC-004 comprehension) | Session-only (not persisted) |
| ThreatIntelligence | Max 100k domains, 90-day TTL, signed | Updated daily, kept indefinitely |
| DecisionLog | Sanitized URLs, no PII | 90 days (auto-delete) |
| FalsePositiveReport | Justification ≥10 chars, ≤7 days old | Stored until resolved |

---

## State Machine: Navigation Request Lifecycle

```
                    [Start]
                       ↓
              [URL Intercepted]
                       ↓
          ┌──────[Check Cache]──────┐
          │                         │
     [Cache Hit]              [Cache Miss]
          │                         │
          │                    [Analyze Threat]
          │                    (AI or Local Rules)
          │                         │
          └──────────┬──────────────┘
                     ↓
            [Generate Assessment]
                     ↓
            [Make Security Decision]
                     ↓
            ┌───────┴───────┐
            │               │
       [Allow]          [Block/Warn]
            │               │
            │         [Show Warning]
            │               │
            │         [User Response]
            │          ↙          ↘
            │    [Go Back]    [Override]
            │                     │
            │               [Log Override]
            │                     │
            └───────┬─────────────┘
                    ↓
            [Log Decision]
                    ↓
             [Navigation Completes]
                    ↓
                  [End]
```

---

## Performance Considerations

### Memory Footprint
- In-memory cache: ~50MB (10,000 recent verdicts)
- Full threat intelligence: ~100MB compressed
- Active sessions: ~10MB per browser window
- **Total baseline**: ~200MB

### Disk Usage
- Threat cache: 100MB (updated daily)
- Decision logs: ~10MB per day → 900MB for 90 days
- False positive reports: ~1MB per month
- **Total**: ~1GB

### Lookup Performance
- In-memory cache hit: <1ms (SC-005 target: 99% under 1s)
- Disk cache hit: 10-50ms
- Local rule matching: 50-100ms
- AI analysis: 500-800ms (only for uncertain cases)

---

**Next Steps**: Generate API contracts in `contracts/` directory for each entity interaction.
