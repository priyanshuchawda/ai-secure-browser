# Quickstart Guide: AI Secure Browser Development

**Feature**: 001-threat-protection  
**Audience**: Developers implementing the threat protection system  
**Prerequisites**: Node.js 20.19+, Git, basic Electron knowledge

---

## 1. Project Setup (5 minutes)

### Clone and Install
```bash
# Clone repository
git clone <repository-url> ai-secure-browser
cd ai-secure-browser

# Checkout feature branch
git checkout -b 001-threat-protection

# Install dependencies
npm install

# Install development tools
npm install -D electron vite vitest playwright typescript @types/node
npm install -D vite-plugin-electron @google/genai

# Verify installation
npm run check-setup
```

### Environment Configuration
```bash
# Create .env file
cp .env.example .env

# Add your Gemini API key (get from https://ai.google.dev/)
echo "GEMINI_API_KEY=your_key_here" >> .env

# Optional: Configure threat intelligence sources
echo "GOOGLE_SAFE_BROWSING_KEY=optional_key" >> .env
```

---

## 2. Architecture Overview (5 minutes)

### Key Components

```
┌─────────────────────────────────────────────────┐
│  Electron Renderer Process (Chromium UI)       │
│  - Warning Pages                                │
│  - Feedback Forms                               │
│  - Browser UI                                   │
└──────────────┬──────────────────────────────────┘
               │ IPC
               ↓
┌─────────────────────────────────────────────────┐
│  Electron Main Process (Node.js Security Core) │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  1. Request Interceptor                  │  │
│  │     (webRequest API)                     │  │
│  └────────────┬─────────────────────────────┘  │
│               ↓                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  2. Threat Analysis Engine               │  │
│  │     - Cache Lookup                       │  │
│  │     - Local Rules                        │  │
│  │     - AI Analysis (Gemini)               │  │
│  └────────────┬─────────────────────────────┘  │
│               ↓                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  3. Decision Engine                      │  │
│  │     (Deterministic Rules)                │  │
│  └────────────┬─────────────────────────────┘  │
│               ↓                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  4. Explanation Service                  │  │
│  │     (User-Friendly Messages)             │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Data Flow (Threat Detection)
1. **User clicks link** → Electron intercepts via `webRequest.onBeforeRequest`
2. **Threat Analysis**: Cache → Local Rules → AI (if needed)
3. **Decision**: Deterministic rules evaluate assessment
4. **Enforcement**: Block/Warn/Allow based on decision
5. **Logging**: Record decision for audit trail

---

## 3. Development Workflow (Test-First)

### Step 1: Write Contract Tests (Before Implementation)

```typescript
// tests/contract/threat-analysis-engine.test.ts
import { describe, it, expect } from 'vitest';
import { ThreatAnalysisEngine } from '@/electron/main/threat-analysis/engine';

describe('Threat Analysis Engine Contract', () => {
  it('should return assessment within 1 second for 99% of requests', async () => {
    const engine = new ThreatAnalysisEngine();
    const start = Date.now();
    
    const assessment = await engine.analyze({
      url: 'https://example.com',
      requestId: crypto.randomUUID()
    });
    
    const latency = Date.now() - start;
    expect(latency).toBeLessThan(1000); // SC-005 requirement
    expect(assessment).toHaveProperty('confidence');
    expect(assessment.confidence).toBeGreaterThanOrEqual(0);
    expect(assessment.confidence).toBeLessThanOrEqual(1);
  });

  it('should detect phishing via typosquatting', async () => {
    const engine = new ThreatAnalysisEngine();
    
    const assessment = await engine.analyze({
      url: 'https://paypa1.com', // Typo: paypal → paypa1
      requestId: crypto.randomUUID()
    });
    
    expect(assessment.threatType).toBe('phishing');
    expect(assessment.indicators).toContainEqual(
      expect.objectContaining({
        type: 'domain_typo',
        severity: 'critical'
      })
    );
  });
});
```

### Step 2: Run Tests (Expect Failures)
```bash
# Run tests in watch mode
npm run test:watch

# Expected output:
# ✗ tests/contract/threat-analysis-engine.test.ts (2 failed)
#   - should return assessment within 1 second
#   - should detect phishing via typosquatting
```

### Step 3: Implement to Pass Tests
```typescript
// electron/main/threat-analysis/engine.ts
export class ThreatAnalysisEngine {
  async analyze(request: AnalysisRequest): Promise<ThreatAssessment> {
    const start = Date.now();
    
    // 1. Check cache first (fastest path)
    const cached = await this.cache.lookup(request.url);
    if (cached) return cached;
    
    // 2. Run local rules (deterministic)
    const localVerdict = await this.localDetector.analyze(request.url);
    if (localVerdict.confidence > 0.9) {
      return this.buildAssessment(localVerdict, start, 'local_rule');
    }
    
    // 3. Call AI for uncertain cases
    const aiVerdict = await this.geminiClient.analyze(request.url);
    return this.buildAssessment(aiVerdict, start, 'ai');
  }
}
```

### Step 4: Verify Tests Pass
```bash
npm test

# Expected output:
# ✓ tests/contract/threat-analysis-engine.test.ts (2 passed)
```

---

## 4. Running the Application

### Development Mode (with HMR)
```bash
# Start Vite dev server + Electron
npm run dev

# Opens browser window with live reload
# Main process logs: electron/main/ changes trigger restart
# Renderer logs: Hot Module Replacement for UI
```

### Manual Testing
```bash
# Test phishing detection
1. Click address bar in running app
2. Enter: https://paypa1-secure.com
3. Expect: Warning page with phishing indicators

# Test malware blocking
1. Navigate to known malware site (use test URL from PhishTank)
2. Expect: Block page with malware explanation

# Test user override
1. Trigger warning page
2. Click "I understand the risks, proceed anyway"
3. Confirm acknowledgment dialog
4. Check logs: data/logs/decisions-YYYY-MM-DD.jsonl
```

### E2E Tests (Playwright)
```bash
# Run end-to-end tests
npm run test:e2e

# Runs full user scenarios from spec.md
```

---

## 5. Key Implementation Patterns

### Pattern 1: Request Interception
```typescript
// electron/main/request-interceptor/interceptor.ts
import { session } from 'electron';

export function setupInterceptor() {
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: ['http://*', 'https://*'] },
    async (details, callback) => {
      const analysis = await threatEngine.analyze({
        url: details.url,
        requestId: crypto.randomUUID(),
        context: {
          referrer: details.referrer,
          triggerType: inferTriggerType(details)
        }
      });
      
      const decision = await decisionEngine.decide(analysis);
      
      if (decision.action === 'block') {
        callback({ cancel: true });
        await showWarningPage(details.url, analysis, decision);
      } else {
        callback({ cancel: false });
      }
      
      await logger.log({ analysis, decision });
    }
  );
}
```

### Pattern 2: AI Integration with Fallback
```typescript
// electron/main/threat-analysis/ai-analyzer/gemini-client.ts
import { GoogleGenAI } from '@google/genai';

export class GeminiAnalyzer {
  private client: GoogleGenAI;
  
  async analyze(url: string): Promise<AIVerdict> {
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: this.buildPrompt(url),
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: threatSchema
        }
      });
      
      return this.parseResponse(response.text);
      
    } catch (error) {
      // Fallback to local rules on AI failure
      console.warn('Gemini API error, using local rules:', error);
      return this.fallbackToLocalRules(url);
    }
  }
}
```

### Pattern 3: Offline Mode Detection
```typescript
// electron/main/threat-analysis/engine.ts
export class ThreatAnalysisEngine {
  async analyze(request: AnalysisRequest): Promise<ThreatAssessment> {
    const isOnline = await this.networkChecker.check();
    
    if (!isOnline || request.options?.offlineMode) {
      return this.analyzeOffline(request);
    }
    
    return this.analyzeOnline(request);
  }
  
  private async analyzeOffline(request: AnalysisRequest) {
    // Cache + local rules only (no AI calls)
    const cached = await this.cache.lookup(request.url);
    if (cached) return cached;
    
    const localVerdict = await this.localDetector.analyze(request.url);
    return this.buildAssessment(localVerdict, Date.now(), 'offline');
  }
}
```

---

## 6. Debugging Tips

### Enable Debug Logging
```bash
# Set environment variable
export DEBUG=ai-secure-browser:*

# Run with verbose output
npm run dev
```

### Inspect Decision Logs
```bash
# View today's decisions
cat data/logs/decisions-$(date +%Y-%m-%d).jsonl | jq '.decision.action' | sort | uniq -c

# Find false positives (high override rate)
cat data/logs/*.jsonl | jq 'select(.enforcement.userOverride == true) | .request.url' | sort | uniq -c | sort -rn | head -10
```

### Test AI Prompts Directly
```bash
# Interactive prompt testing
npm run test:ai-prompt

# Paste URL to analyze, see structured output
# Iterate on prompt engineering in ai-analyzer/prompt-builder.ts
```

### Cache Management
```bash
# View cache stats
npm run cache:stats

# Clear cache (force fresh analysis)
npm run cache:clear

# Update threat intelligence
npm run cache:update
```

---

## 7. Common Issues & Solutions

### Issue: "Gemini API rate limit exceeded"
**Solution**: Increase cache hit rate or implement request queue
```typescript
// electron/main/threat-analysis/ai-analyzer/rate-limiter.ts
export class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  
  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await fn());
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }
}
```

### Issue: "Tests timeout on CI"
**Solution**: Mock Gemini API in tests
```typescript
// tests/mocks/gemini-client.mock.ts
export class MockGeminiClient {
  async analyze(url: string) {
    // Return cached responses for predictable tests
    return mockResponses[url] || defaultSafeResponse;
  }
}
```

### Issue: "False positive rate exceeds 2%"
**Solution**: Tune confidence thresholds
```typescript
// electron/main/decision-engine/decision-maker.ts
function makeDecision(assessment: ThreatAssessment): SecurityDecision {
  // Lower threshold for known-safe domains
  if (isWhitelisted(assessment.url) && assessment.confidence < 0.95) {
    return { action: 'allow', rationale: 'Whitelisted domain' };
  }
  
  // Higher threshold for uncertain verdicts
  if (assessment.confidence < 0.85) {
    return { action: 'warn', rationale: 'Uncertain verdict' };
  }
}
```

---

## 8. Next Steps

### Phase 2: Implementation Tasks
1. **Task 1**: Implement Request Interceptor
   - Set up Electron webRequest hooks
   - Extract navigation context
   - Unit tests for URL parsing

2. **Task 2**: Build Local Rule Engine
   - Typosquatting detector
   - Regex pattern matching
   - Domain blacklist lookup

3. **Task 3**: Integrate Gemini AI
   - API client with retry logic
   - Prompt engineering for threat detection
   - Response validation with JSON schema

4. **Task 4**: Implement Decision Engine
   - Deterministic rule evaluation
   - Override handling
   - Decision logging

5. **Task 5**: Create Warning UI
   - HTML/CSS for warning pages
   - Indicator visualizations
   - User action handling

6. **Task 6**: Build Cache System
   - LRU in-memory cache
   - Disk persistence (JSON)
   - Daily intelligence updates

### Generate Implementation Tasks
```bash
# Run tasks generation command (Phase 2)
npm run speckit:tasks

# Creates specs/001-threat-protection/tasks.md
# with dependency-ordered implementation checklist
```

---

## Resources

- **Electron Docs**: https://www.electronjs.org/docs/latest/
- **Vite Docs**: https://vite.dev/
- **Gemini API**: https://ai.google.dev/gemini-api/docs
- **Project Constitution**: `.specify/memory/constitution.md`
- **Feature Spec**: `specs/001-threat-protection/spec.md`
- **Data Model**: `specs/001-threat-protection/data-model.md`
- **API Contracts**: `specs/001-threat-protection/contracts/`

---

**Ready to start coding!** Follow the test-first workflow, consult the contracts for API boundaries, and reference the data model for entity schemas. All implementation must trace back to requirements in spec.md.
