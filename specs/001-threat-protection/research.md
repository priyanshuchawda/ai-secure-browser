# Research & Technical Decisions: Proactive Threat Protection

**Feature**: 001-threat-protection  
**Date**: 2026-01-08  
**Status**: Phase 0 Complete

This document captures research findings and technical decisions for implementing the AI-driven threat protection browser. All decisions are traced to specific requirements from spec.md.

---

## 1. Request Interception in Electron

**Context**: FR-001 requires intercepting all web navigation events before page content renders.

### Decision: Use Electron's `webRequest` API with `onBeforeRequest` hook

**Rationale**:
- Intercepts navigation at the earliest possible point (before DNS lookup)
- Blocks synchronously, preventing any content fetch
- Covers all navigation types: links, redirects, form submissions, iframes
- Standard Electron API with stable support

**Implementation Pattern**:
```typescript
// electron/main/request-interceptor/interceptor.ts
session.defaultSession.webRequest.onBeforeRequest(
  { urls: ['http://*', 'https://*'] },
  async (details, callback) => {
    const threat = await analyzeThreat(details.url);
    if (threat.isBlocked) {
      callback({ cancel: true });
      showWarningPage(threat);
    } else {
      callback({ cancel: false });
    }
  }
);
```

**Alternatives Considered**:
1. **Chromium Content Scripts**: Rejected - runs after page load (too late)
2. **DNS-level blocking**: Rejected - cannot inspect full URL or provide explanations
3. **Proxy server**: Rejected - adds complexity, deployment overhead

**References**:
- Electron webRequest API: https://www.electronjs.org/docs/latest/api/web-request
- Blocking patterns: docs/electron.md (request interception examples)

---

## 2. AI Model Selection for Threat Analysis

**Context**: FR-002, FR-010 require multi-indicator threat analysis distinguishing phishing, malware, social engineering.

### Decision: Google Gemini 2.5 Flash with structured outputs

**Rationale**:
- **Fast inference**: Sub-second responses meet SC-005 (<1s for 99% of requests)
- **Structured outputs**: JSON schema validation ensures parseable, type-safe results (prevents hallucinated responses)
- **Multimodal understanding**: Analyzes page HTML, screenshots, URL patterns
- **Cost-effective**: Lower token cost than Pro models, sufficient for classification tasks
- **Grounding capability**: Can verify facts against Google Search for novel threats

**Prompt Strategy** (FR-007 - specific indicators):
```typescript
const schema = {
  threatType: enum(['phishing', 'malware', 'social_engineering', 'safe']),
  confidence: number, // 0.0-1.0
  indicators: array({
    type: string, // "domain_mismatch", "suspicious_form", etc.
    description: string,
    severity: enum(['critical', 'high', 'medium', 'low'])
  }),
  recommendation: enum(['block', 'warn', 'allow'])
};

const prompt = `
Analyze this URL for security threats: ${url}
Context: ${pageMetadata}

Detect:
1. Phishing: Domain spoofing, credential forms, deceptive branding
2. Malware: Drive-by downloads, malicious scripts, known bad domains
3. Social Engineering: Fake urgency, impersonation, manipulative consent

Respond with structured analysis.
`;
```

**Alternatives Considered**:
1. **Local ML model** (ONNX/TensorFlow.js): Rejected - inferior accuracy for complex reasoning, large model size (>500MB)
2. **Gemini Pro**: Rejected - higher cost, overkill for classification
3. **OpenAI GPT-4**: Rejected - higher latency, more expensive, no grounding
4. **Claude**: Rejected - limited multimodal support, no grounding

**Fallback Strategy** (SC-010 - 95% local processing):
- Local rule-based detection runs first (domain blacklists, regex patterns)
- AI called only for uncertain cases or new domains
- Cached verdicts (90-day TTL) avoid repeat AI calls
- Offline mode uses only local rules + cache

**References**:
- Gemini API docs: docs/gemini.md
- Structured outputs: docs/gemini_structured.md
- Token counting: ~100 tokens per URL analysis

---

## 3. Threat Intelligence Cache Strategy

**Context**: FR-008, FR-009, SC-006 require local-first operation with cached intelligence and offline support.

### Decision: Local JSON file cache with daily delta updates

**Rationale**:
- **Simplicity**: No database setup, pure Node.js file operations
- **Fast reads**: In-memory LRU cache backed by disk
- **Privacy**: No remote queries for known threats
- **Offline-first**: Works completely disconnected after initial sync

**Cache Schema**:
```typescript
interface ThreatCache {
  version: string; // YYYY-MM-DD-HH format
  domains: {
    [domain: string]: {
      verdict: 'phishing' | 'malware' | 'social_engineering' | 'safe';
      confidence: number;
      lastVerified: ISO8601;
      source: 'gemini' | 'google_safebrowsing' | 'phishtank' | 'local_rule';
    }
  };
  patterns: {
    urlRegex: Array<{ pattern: string; threatType: string }>;
    domainSuffixes: Array<{ suffix: string; verdict: string }>;
  };
  signature: string; // HMAC-SHA256 for integrity
}
```

**Update Process**:
- Daily background fetch from threat intelligence sources:
  1. Google Safe Browsing API (hashed prefix queries for privacy)
  2. PhishTank database (open-source phishing feed)
  3. Gemini AI enrichment (analyze new domains)
- Delta updates minimize bandwidth (<5MB/day)
- Cryptographic signatures prevent tampering
- Rollback on validation failure

**Alternatives Considered**:
1. **SQLite database**: Rejected - unnecessary complexity for key-value lookups
2. **Remote API calls**: Rejected - violates privacy requirement (SC-010)
3. **Blockchain-based**: Rejected - overkill, performance penalty

**References**:
- LRU cache: Node.js `lru-cache` package
- Safe Browsing: https://developers.google.com/safe-browsing

---

## 4. Decision Engine Architecture

**Context**: Constitution Principle IV requires separating AI reasoning from enforcement. FR-005, FR-006 require user overrides and logging.

### Decision: Three-stage pipeline (Analysis → Decision → Enforcement)

**Rationale**:
- **Testability**: Each stage has clear inputs/outputs for contract tests
- **Safety**: Deterministic rules gate AI recommendations (prevents false blocks)
- **Auditability**: Decision logs capture reasoning chain (FR-006)
- **User agency**: Override mechanism respects user choice while maintaining accountability

**Pipeline Design**:
```typescript
// Stage 1: Analysis (ThreatAnalysisEngine)
interface ThreatAssessment {
  url: string;
  threatType: ThreatType | null;
  confidence: number;
  indicators: Indicator[];
  analysisMethod: 'local_rule' | 'ai' | 'cache';
}

// Stage 2: Decision (DecisionEngine)
interface SecurityDecision {
  action: 'block' | 'warn' | 'allow';
  rationale: string;
  overridable: boolean;
  requiresExplanation: boolean;
}

// Stage 3: Enforcement (RequestInterceptor)
interface EnforcementResult {
  blocked: boolean;
  warningShown: boolean;
  userOverride: boolean;
  timestamp: ISO8601;
}
```

**Decision Rules** (prevent false positives):
```typescript
function makeDecision(assessment: ThreatAssessment): SecurityDecision {
  // Rule 1: High-confidence threats from trusted sources → auto-block
  if (assessment.confidence > 0.9 && assessment.analysisMethod === 'cache') {
    return { action: 'block', overridable: true };
  }
  
  // Rule 2: AI uncertainty → warn, don't block (prevents false positives)
  if (assessment.confidence < 0.7 && assessment.threatType !== null) {
    return { action: 'warn', overridable: true };
  }
  
  // Rule 3: Known safe domains → allow (whitelist for SC-008)
  if (isKnownAuthProvider(assessment.url)) {
    return { action: 'allow', overridable: false };
  }
  
  // Rule 4: New domains → cautionary indicator, but allow (FR-016)
  if (isNewDomain(assessment.url)) {
    return { action: 'warn', overridable: false };
  }
}
```

**Alternatives Considered**:
1. **Direct AI enforcement**: Rejected - no safety net for hallucinations
2. **Two-stage (Analysis → Enforcement)**: Rejected - mixes concerns, hard to test
3. **ML-based decision engine**: Rejected - violates Constitution Principle VII (prefer deterministic)

---

## 5. User Explanation & Warning UI

**Context**: FR-004, FR-007 require clear, non-technical explanations with specific indicators. SC-004 measures comprehension.

### Decision: Template-based explanations with threat-specific visualizations

**Rationale**:
- **Clarity**: Pre-tested templates for common threats (verified with target users)
- **Specificity**: Dynamic indicator injection (e.g., "Domain 'paypa1.com' mimics 'paypal.com'")
- **Actionability**: Clear next steps ("Go back", "Report false positive", "Proceed anyway")
- **Visual learning**: Color-coded severity, icon indicators, side-by-side comparisons

**Warning Page Structure**:
```html
<!-- renderer/warning-page/warning.html -->
<div class="threat-warning">
  <header class="severity-critical">
    <icon type="shield-alert" />
    <h1>Phishing Attempt Blocked</h1>
  </header>
  
  <section class="explanation">
    <p class="plain-language">
      This website is pretending to be {{legitimate_site}} to steal your password.
    </p>
  </section>
  
  <section class="indicators">
    <h2>Why we blocked this site:</h2>
    <ul>
      <li>
        <icon type="domain" />
        <strong>Domain mismatch:</strong> 
        Real site: <code>paypal.com</code> → Fake site: <code class="danger">paypa1.com</code>
      </li>
      <li>
        <icon type="form" />
        <strong>Suspicious login form:</strong> 
        Requests password before loading actual page
      </li>
    </ul>
  </section>
  
  <footer class="actions">
    <button class="primary" onclick="goBack()">Go Back (Recommended)</button>
    <button class="secondary" onclick="reportFalsePositive()">Not a threat? Report it</button>
    <button class="danger" onclick="proceedAnyway()">I understand the risk, proceed anyway</button>
  </footer>
</div>
```

**Explanation Templates** (FR-010 - threat type specific):

**Phishing**:
> "This website is trying to steal your {{credential_type}} by impersonating {{legitimate_brand}}. The real website is {{correct_url}}, but this fake site is {{fake_url}}."

**Malware**:
> "This website tries to install harmful software on your computer. It may download viruses, spyware, or programs that steal your files."

**Social Engineering**:
> "This website uses manipulation tactics to trick you. It may create fake urgency ('Your account will be locked!'), impersonate tech support, or request unusual permissions."

**Alternatives Considered**:
1. **AI-generated explanations**: Rejected - inconsistent phrasing, potential hallucinations
2. **Technical jargon**: Rejected - fails SC-004 comprehension requirement
3. **Minimal warnings**: Rejected - users ignore generic "danger" messages

**User Testing** (SC-004):
- A/B test templates with non-technical users
- Measure understanding: "What threat did we detect?" (target: >90% correct answers)
- Iterate based on feedback

---

## 6. False Positive Handling

**Context**: FR-011, FR-012 require false positive feedback and minimizing incorrect blocks. SC-003 sets <2% false positive rate.

### Decision: In-browser feedback form with local storage and periodic AI retraining prompts

**Rationale**:
- **User-friendly**: One-click "Report False Positive" button on warning page
- **Privacy**: Reports stored locally, user chooses when to submit
- **Continuous improvement**: Feedback used to refine local rules and retrain AI prompts
- **Transparency**: Users see impact ("Your feedback helped us improve!")

**Feedback Schema**:
```typescript
interface FalsePositiveReport {
  id: uuid;
  url: string;
  threatType: ThreatType;
  userJustification: string; // Free text
  timestamp: ISO8601;
  context: {
    originalAssessment: ThreatAssessment;
    userAction: 'proceeded_safely' | 'blocked_incorrectly';
  };
  submitted: boolean; // Sync to Gemini for retraining
}
```

**Mitigation Strategy** (achieve SC-003):
1. **Whitelist known-good domains**: Major auth providers (Google, GitHub, banks)
2. **Confidence thresholds**: Only auto-block >0.9 confidence
3. **User override tracking**: High override rate (>50%) for a domain → reduce threat score
4. **Weekly review**: Analyze false positive reports, update local rules
5. **Canary testing**: Test new threat rules on synthetic benign sites before deployment

**Alternatives Considered**:
1. **No feedback mechanism**: Rejected - no path to improvement
2. **Automatic remote telemetry**: Rejected - violates privacy
3. **Manual review queue**: Rejected - doesn't scale, requires human moderators

---

## 7. Offline Mode & Network Resilience

**Context**: FR-017, SC-006 require operation with cached intelligence when network unavailable.

### Decision: Graceful degradation with cache-first strategy

**Rationale**:
- **User experience**: Browser remains functional offline (essential for travel, poor connectivity)
- **Security**: Cached threats still blocked (90% protection per SC-006)
- **Transparency**: UI indicates "Offline Mode - Limited Protection"

**Degradation Levels**:
```typescript
enum NetworkState {
  ONLINE_FULL,      // Cache + AI + intelligence updates
  ONLINE_LIMITED,   // Cache + AI, no updates (temp network issue)
  OFFLINE           // Cache only (no AI calls)
}

function analyzeOffline(url: string): ThreatAssessment {
  // Level 1: Check cache (covers 90% of threats per SC-006)
  const cached = threatCache.lookup(url);
  if (cached) return cached;
  
  // Level 2: Local rule-based detection (regex, known patterns)
  const localVerdict = localRules.analyze(url);
  if (localVerdict.threatType) return localVerdict;
  
  // Level 3: Allow with cautionary indicator (FR-017)
  return {
    threatType: null,
    confidence: 0.5,
    indicators: [{ type: 'offline_mode', description: 'Limited protection' }],
    analysisMethod: 'offline_fallback'
  };
}
```

**User Communication**:
```html
<div class="offline-banner">
  <icon type="wifi-off" />
  Offline Mode: Using cached threat data. Some threats may not be detected.
</div>
```

**Alternatives Considered**:
1. **Block all uncached sites offline**: Rejected - breaks usability
2. **No offline support**: Rejected - violates FR-017
3. **Peer-to-peer threat sharing**: Rejected - privacy concerns, complexity

---

## 8. Logging & Audit Trail

**Context**: FR-006 requires logging all threat detections and user overrides with 90-day retention.

### Decision: Structured JSONL logs with automatic rotation and privacy-preserving redaction

**Rationale**:
- **JSONL format**: One log entry per line, easy parsing, streaming-friendly
- **Structured fields**: Enables analytics (false positive rate, threat trends)
- **Privacy**: URLs logged, but no page content or user credentials
- **Automatic cleanup**: Daily cron job deletes logs >90 days

**Log Schema**:
```typescript
interface DecisionLog {
  timestamp: ISO8601;
  url: string; // Sanitized (no query params with sensitive data)
  threatAssessment: ThreatAssessment;
  decision: SecurityDecision;
  enforcement: EnforcementResult;
  userOverride?: {
    reason: string;
    acknowledgedRisks: boolean;
  };
}
```

**Example Log Entry**:
```json
{
  "timestamp": "2026-01-08T10:23:45.123Z",
  "url": "https://paypa1-secure.com/login",
  "threatAssessment": {
    "threatType": "phishing",
    "confidence": 0.95,
    "indicators": [
      {"type": "domain_typo", "description": "paypa1 vs paypal", "severity": "critical"}
    ],
    "analysisMethod": "ai"
  },
  "decision": {
    "action": "block",
    "rationale": "High-confidence phishing attempt targeting PayPal users",
    "overridable": true
  },
  "enforcement": {
    "blocked": true,
    "warningShown": true,
    "userOverride": false
  }
}
```

**Alternatives Considered**:
1. **Centralized logging server**: Rejected - violates privacy
2. **No logging**: Rejected - violates FR-006, prevents auditing
3. **Encrypted logs**: Considered but deferred (YAGNI unless required)

---

## 9. Performance Optimization

**Context**: SC-005 requires <1s threat detection for 99% of requests.

### Decision: Multi-tier caching and parallel execution

**Optimization Strategies**:

**1. In-Memory LRU Cache** (100ms target):
- 10,000 most recent URL verdicts
- Instant lookup for repeated navigation
- Covers ~80% of requests (users revisit sites)

**2. Disk Cache with Indexed Lookup** (200ms target):
- B-tree index on domain names
- 100,000+ known threats
- Covers 90% of uncached requests

**3. Parallel Analysis** (800ms target for AI calls):
```typescript
async function analyzeThreat(url: string): Promise<ThreatAssessment> {
  const [cachedVerdict, localRules, aiAnalysis] = await Promise.allSettled([
    cache.lookup(url),           // ~10ms
    localDetector.analyze(url),  // ~50ms
    geminiClient.analyze(url)    // ~500ms (only if needed)
  ]);
  
  // Return first definitive result (short-circuit on cache hit)
  if (cachedVerdict.value) return cachedVerdict.value;
  if (localRules.value.confidence > 0.9) return localRules.value;
  return aiAnalysis.value;
}
```

**4. Request Coalescing**:
- Deduplicate simultaneous requests to same domain
- One analysis shared by multiple tabs

**5. Background Preloading**:
- Predictively analyze links on current page
- Results ready before user clicks

**Measurement**:
```typescript
interface PerformanceMetrics {
  p50: number; // Median latency
  p95: number; // 95th percentile (SC-005 target)
  p99: number; // 99th percentile
  cacheHitRate: number;
  aiCallRate: number; // Should be <10% for SC-010
}
```

**Alternatives Considered**:
1. **Synchronous blocking calls**: Rejected - violates SC-005
2. **Always call AI**: Rejected - too slow, violates SC-010
3. **Client-side analysis in renderer**: Rejected - security boundary violation

---

## 10. Development & Build Tooling

**Context**: Need fast iteration during development, optimized production builds.

### Decision: Vite 8 with Electron + TypeScript

**Rationale**:
- **HMR for renderer**: Sub-second UI updates during development
- **TypeScript native**: No Babel overhead, strict typing catches errors early
- **Rolldown bundler**: Faster builds than Rollup, tree-shaking, code splitting
- **Electron integration**: vite-plugin-electron handles main/preload/renderer builds

**Development Workflow**:
```bash
# Start dev server (main + renderer with HMR)
npm run dev

# Run tests in watch mode
npm run test:watch

# Build for production (multi-platform)
npm run build
npm run package # electron-builder
```

**Build Optimizations**:
- **Code splitting**: Main, preload, renderer bundles
- **Tree shaking**: Remove unused Gemini SDK features
- **Minification**: Rolldown (faster than Terser)
- **Source maps**: Development only (excluded from production)

**Alternatives Considered**:
1. **Webpack**: Rejected - slower, more complex configuration
2. **Parcel**: Rejected - less control, larger bundle sizes
3. **esbuild alone**: Rejected - lacks Electron integration

**References**:
- Vite config: docs/vite.md
- Electron + Vite setup: docs/vite.md (electron integration examples)

---

## Summary of Key Technical Decisions

| Requirement | Technology Choice | Rationale |
|-------------|-------------------|-----------|
| Request interception (FR-001) | Electron `webRequest.onBeforeRequest` | Earliest possible hook, synchronous blocking |
| Threat analysis (FR-002) | Gemini 2.5 Flash + structured outputs | Fast, accurate, cost-effective, JSON validation |
| Local intelligence (FR-008/009) | JSON file cache + LRU memory cache | Simple, fast, offline-capable, privacy-preserving |
| Decision logic (Constitution IV) | Three-stage pipeline (Analysis→Decision→Enforcement) | Separates AI reasoning from enforcement, testable |
| User explanations (FR-004/007) | Template-based with dynamic indicators | Consistent, comprehensible, tested with users |
| False positives (FR-011) | In-browser feedback form + local storage | Privacy-friendly, enables continuous improvement |
| Offline mode (FR-017) | Cache-first with local rules fallback | Maintains functionality without network |
| Logging (FR-006) | JSONL with 90-day auto-deletion | Structured, auditable, privacy-compliant |
| Performance (SC-005) | Multi-tier caching + parallel execution | Meets <1s latency target for 99% of requests |
| Development (Constitution II) | Vite 8 + TypeScript + Vitest | Fast iteration, type safety, test-first workflow |

---

## Open Questions for Phase 1 (Design)

1. **Rate limiting**: How to handle Gemini API rate limits gracefully? (Use exponential backoff, queue requests, fallback to cache)
2. **Cache size limits**: When to evict old entries? (LRU with 10k in-memory, 100k on disk, prune entries >90 days)
3. **Multi-language support**: How to localize threat explanations? (Use i18n library, defer to post-MVP)
4. **Certificate validation**: Should we verify HTTPS certificates explicitly? (Defer to Chromium's built-in validation)

---

**Next Steps**: Proceed to Phase 1 (Design) to generate data-model.md and API contracts.
