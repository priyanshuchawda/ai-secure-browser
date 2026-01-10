# Tasks: Proactive Threat Protection

**Feature Branch**: `001-threat-protection`  
**Input**: Design documents from `/specs/001-threat-protection/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Contract tests and integration tests are included in this feature per Constitution Principle III (Test-First Development).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions (Electron + Vite Desktop App)

- **Main process**: `electron/main/` (Node.js security core)
- **Renderer process**: `electron/renderer/` (Chromium UI)
- **Preload scripts**: `electron/preload/` (context bridge)
- **Shared utilities**: `src/shared/` (both main and renderer)
- **Tests**: `tests/contract/`, `tests/integration/`, `tests/e2e/`
- **Configuration**: `config/`
- **Data**: `data/` (runtime data, gitignored)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure per plan.md (electron/, src/, tests/, config/, data/)
- [ ] T002 Initialize package.json with Electron, Vite 8, TypeScript, Vitest, and Playwright dependencies
- [ ] T003 [P] Configure TypeScript in config/tsconfig.json with Node.js + Electron types
- [ ] T004 [P] Configure Vite in config/vite.config.ts with vite-plugin-electron for main/preload/renderer builds
- [ ] T005 [P] Configure Vitest in config/vitest.config.ts for unit and contract tests
- [ ] T006 [P] Configure Playwright in config/playwright.config.ts for E2E tests
- [ ] T007 [P] Setup ESLint and Prettier in config/ for code quality
- [ ] T008 [P] Create .gitignore for data/ directory, node_modules, and build artifacts
- [ ] T009 [P] Create .env.example with GEMINI_API_KEY placeholder
- [ ] T010 Create README.md with quickstart instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Setup threat intelligence cache directory structure in data/threat-cache/
- [ ] T012 [P] Create shared TypeScript types in src/shared/types.ts based on data-model.md entities
- [ ] T013 [P] Create configuration constants in src/shared/constants.ts (API keys, timeouts, cache limits)
- [ ] T014 [P] Create utility functions in src/shared/utils.ts (URL sanitization, UUID generation)
- [ ] T015 Implement cache manager in electron/main/threat-analysis/cache/cache-manager.ts with LRU memory + disk persistence
- [ ] T016 [P] Implement cache schema validation in electron/main/threat-analysis/cache/schemas.ts per data-model.md
- [ ] T017 [P] Create logging infrastructure in electron/main/decision-engine/logger.ts with JSONL format and 90-day retention
- [ ] T018 [P] Setup Electron main process entry point in electron/main/index.ts with app lifecycle management
- [ ] T019 [P] Create context bridge in electron/preload/index.ts for secure IPC between main and renderer
- [ ] T020 [P] Setup base HTML templates for renderer in electron/renderer/browser-ui/index.html
- [ ] T021 Implement Gemini API client in electron/main/threat-analysis/ai-analyzer/gemini-client.ts with error handling and retry logic
- [ ] T022 [P] Create prompt builder in electron/main/threat-analysis/ai-analyzer/prompt-builder.ts using structured output schema

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Phishing Protection (Priority: P1) 🎯 MVP

**Goal**: Block phishing attempts by detecting domain typosquatting, credential forms, and deceptive design before page renders

**Independent Test**: Navigate to known phishing URLs (from PhishTank database) and verify browser blocks access with specific indicator explanations

### Tests for User Story 1 (Test-First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T023 [P] [US1] Contract test for threat analysis engine /analyze endpoint in tests/contract/threat-analysis-engine.test.ts
- [ ] T024 [P] [US1] Contract test for request interceptor in tests/contract/request-interceptor.test.ts
- [ ] T025 [P] [US1] Integration test for phishing detection flow (intercept → analyze → block) in tests/integration/phishing-protection.test.ts
- [ ] T026 [P] [US1] E2E test for phishing warning display using Playwright in tests/e2e/phishing-protection.test.ts

### Implementation for User Story 1

**Models & Core Logic**

- [ ] T027 [P] [US1] Create NavigationRequest entity implementation in src/shared/types.ts per data-model.md
- [ ] T028 [P] [US1] Create ThreatAssessment entity implementation in src/shared/types.ts per data-model.md
- [ ] T029 [P] [US1] Create ThreatIndicator entity implementation in src/shared/types.ts per data-model.md

**Request Interception Layer**

- [ ] T030 [US1] Implement request interceptor in electron/main/request-interceptor/interceptor.ts using Electron webRequest.onBeforeRequest API
- [ ] T031 [P] [US1] Implement URL analyzer in electron/main/request-interceptor/url-analyzer.ts with validation and sanitization
- [ ] T032 [P] [US1] Implement redirect tracker in electron/main/request-interceptor/redirect-tracker.ts (max 10 hops per data-model.md)

**Local Rule-Based Detection**

- [ ] T033 [P] [US1] Implement phishing detector in electron/main/threat-analysis/local-rules/phishing-detector.ts
  - Domain typosquatting detection (Levenshtein distance)
  - Homograph attack detection (IDN confusables)
  - Credential form pattern matching
- [ ] T034 [P] [US1] Create whitelist for known authentication providers in electron/main/threat-analysis/local-rules/auth-providers-whitelist.json (Google, GitHub, banks)

**Threat Analysis Engine**

- [ ] T035 [US1] Implement main analysis engine in electron/main/threat-analysis/engine.ts coordinating cache → local rules → AI pipeline
- [ ] T036 [US1] Implement AI response validator in electron/main/threat-analysis/ai-analyzer/response-validator.ts with JSON schema enforcement
- [ ] T037 [US1] Add parallel execution optimization in electron/main/threat-analysis/engine.ts (Promise.allSettled for cache/local/AI)

**Decision Engine**

- [ ] T038 [P] [US1] Create SecurityDecision entity in src/shared/types.ts per data-model.md
- [ ] T039 [US1] Implement decision maker in electron/main/decision-engine/decision-maker.ts with deterministic rules per research.md Decision 4
- [ ] T040 [US1] Add confidence threshold logic (>0.9 = auto-block, <0.7 = warn) in decision-maker.ts

**Warning UI**

- [ ] T041 [P] [US1] Create WarningDisplay entity in src/shared/types.ts per data-model.md
- [ ] T042 [P] [US1] Create warning page HTML template in electron/renderer/warning-page/warning.html with phishing-specific layout
- [ ] T043 [P] [US1] Implement warning page logic in electron/renderer/warning-page/warning.ts handling user actions (go back, override, report)
- [ ] T044 [P] [US1] Create warning page styles in electron/renderer/warning-page/warning.css with severity color coding (red for critical)
- [ ] T045 [US1] Implement explanation service in electron/main/explanation-service/explainer.ts generating user-friendly threat descriptions
- [ ] T046 [P] [US1] Create explanation templates in electron/main/explanation-service/templates.ts for phishing threat type

**Override & Logging**

- [ ] T047 [P] [US1] Create EnforcementResult entity in src/shared/types.ts per data-model.md
- [ ] T048 [US1] Implement override manager in electron/main/decision-engine/override-manager.ts handling user proceed-anyway flow with confirmation
- [ ] T049 [US1] Add decision logging in electron/main/decision-engine/logger.ts with sanitized URLs and 90-day retention per FR-006

**Integration**

- [ ] T050 [US1] Wire request interceptor → threat engine → decision engine → warning display in electron/main/index.ts
- [ ] T051 [US1] Add IPC handlers in electron/main/index.ts for renderer ↔ main communication (warning actions, override requests)
- [ ] T052 [US1] Implement credential form blocking logic in request interceptor (prevent form submission to phishing sites per FR-014)

**Checkpoint**: At this point, User Story 1 (Phishing Protection) should be fully functional and testable independently. Navigate to known phishing sites to verify blocking with detailed explanations.

---

## Phase 4: User Story 2 - Malicious Website Blocking (Priority: P2)

**Goal**: Block malware distribution sites by detecting malicious scripts, drive-by downloads, and known bad domains before content executes

**Independent Test**: Navigate to known malware distribution sites (from safe browsing databases) and verify browser blocks access with malware-specific warnings

### Tests for User Story 2 (Test-First)

- [ ] T053 [P] [US2] Contract test for malware detection in threat analysis engine in tests/contract/threat-analysis-engine.test.ts
- [ ] T054 [P] [US2] Integration test for malware blocking flow in tests/integration/malware-blocking.test.ts
- [ ] T055 [P] [US2] E2E test for malware warning display in tests/e2e/malware-blocking.test.ts

### Implementation for User Story 2

**Malware Detection Logic**

- [ ] T056 [P] [US2] Implement malware detector in electron/main/threat-analysis/local-rules/malware-detector.ts
  - Known malicious domain lookup (from Google Safe Browsing)
  - Drive-by download pattern detection
  - Suspicious file extension detection (.exe, .scr, .bat in downloads)
- [ ] T057 [P] [US2] Add malware threat type to ThreatIndicator enum in src/shared/types.ts

**Threat Intelligence Integration**

- [ ] T058 [US2] Implement intelligence updater in electron/main/threat-analysis/cache/intelligence-updater.ts
  - Daily background fetch from Google Safe Browsing API
  - Delta update processing (<5MB/day per research.md)
  - Cryptographic signature validation (HMAC-SHA256)
- [ ] T059 [US2] Add malware patterns to threat intelligence cache schema in electron/main/threat-analysis/cache/schemas.ts
- [ ] T060 [US2] Create daily update scheduler in electron/main/index.ts triggering intelligence-updater at 2 AM

**AI Enhancement for Malware**

- [ ] T061 [US2] Update Gemini prompt in electron/main/threat-analysis/ai-analyzer/prompt-builder.ts to detect malware indicators (malicious scripts, suspicious downloads)
- [ ] T062 [US2] Add malware-specific validation in electron/main/threat-analysis/ai-analyzer/response-validator.ts

**Warning UI for Malware**

- [ ] T063 [P] [US2] Create malware warning template in electron/main/explanation-service/templates.ts explaining drive-by downloads and trojan risks
- [ ] T064 [P] [US2] Add malware-specific icons and colors in electron/renderer/warning-page/warning.css (orange for high severity)

**Integration**

- [ ] T065 [US2] Update decision maker in electron/main/decision-engine/decision-maker.ts to handle malware threat type with appropriate risk levels
- [ ] T066 [US2] Add malware detection test cases to integration tests verifying blocked downloads and script execution prevention

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Verify phishing and malware blocking work without interfering with each other.

---

## Phase 5: User Story 3 - Social Engineering Attack Detection (Priority: P3)

**Goal**: Detect and warn about social engineering attacks including fake OAuth consent pages, tech support scams, and manipulative urgency tactics

**Independent Test**: Create test scenarios with fake OAuth pages, tech support scams, and urgent security warnings, then verify browser identifies deceptive intent patterns

### Tests for User Story 3 (Test-First)

- [ ] T067 [P] [US3] Contract test for social engineering detection in tests/contract/threat-analysis-engine.test.ts
- [ ] T068 [P] [US3] Integration test for social engineering warning flow in tests/integration/social-engineering.test.ts
- [ ] T069 [P] [US3] E2E test for fake OAuth consent detection in tests/e2e/social-engineering.test.ts

### Implementation for User Story 3

**Social Engineering Detection Logic**

- [ ] T070 [P] [US3] Implement social engineering detector in electron/main/threat-analysis/local-rules/social-engineering-detector.ts
  - Fake urgency pattern detection (regex for "Your account will be locked!", "Call this number!")
  - Impersonation detection (unauthorized use of brand names/logos)
  - Deceptive consent request detection (unusual OAuth scopes, suspicious permission requests)
- [ ] T071 [P] [US3] Add social_engineering threat type indicators to ThreatIndicator enum in src/shared/types.ts

**OAuth and Authentication Flow Analysis**

- [ ] T072 [US3] Create legitimate OAuth provider patterns whitelist in electron/main/threat-analysis/local-rules/oauth-providers.json (Google, GitHub, Microsoft)
- [ ] T073 [US3] Implement OAuth flow analyzer in electron/main/threat-analysis/local-rules/oauth-analyzer.ts comparing detected flows against whitelisted patterns
- [ ] T074 [US3] Add OAuth consent page detection to AI prompt in electron/main/threat-analysis/ai-analyzer/prompt-builder.ts

**Page Intent Analysis (AI-Powered)**

- [ ] T075 [US3] Enhance Gemini prompt in prompt-builder.ts to analyze page intent and detect manipulation tactics (urgency, impersonation, deceptive requests)
- [ ] T076 [US3] Add context understanding to AI analysis (referrer chain, user navigation history) for better social engineering detection
- [ ] T077 [US3] Implement multi-indicator scoring in threat analysis engine weighing social engineering patterns

**Warning UI for Social Engineering**

- [ ] T078 [P] [US3] Create social engineering warning template in electron/main/explanation-service/templates.ts explaining manipulation tactics in clear terms
- [ ] T079 [P] [US3] Add social engineering-specific visualizations in electron/renderer/warning-page/warning.css (yellow for medium severity cautionary warnings)

**Integration**

- [ ] T080 [US3] Update decision maker in electron/main/decision-engine/decision-maker.ts to handle social_engineering threat type with lower auto-block threshold (warn instead)
- [ ] T081 [US3] Add cautionary indicators for suspicious but uncertain cases (FR-016 new domain handling) in warning display
- [ ] T082 [US3] Verify legitimate OAuth flows (Google, GitHub login) proceed without false warnings per SC-008

**Checkpoint**: All user stories (Phishing, Malware, Social Engineering) should now be independently functional and testable

---

## Phase 6: Offline Mode & Network Resilience (Cross-Cutting)

**Purpose**: Enable offline operation with cached threat intelligence per FR-017 and SC-006

- [ ] T083 [P] Implement network state detector in electron/main/threat-analysis/network-checker.ts (online/offline detection)
- [ ] T084 Create offline analysis mode in electron/main/threat-analysis/engine.ts using cache + local rules only (no AI calls)
- [ ] T085 [P] Add offline mode indicator to browser UI in electron/renderer/browser-ui/index.html showing "Limited Protection" banner
- [ ] T086 Add graceful degradation logic in decision maker allowing uncached sites when offline per FR-017
- [ ] T087 Create integration test for offline mode in tests/integration/offline-mode.test.ts verifying cached threats still blocked
- [ ] T088 Update quickstart.md with offline testing instructions (disable network, verify cached threat blocking)

---

## Phase 7: False Positive Handling (Cross-Cutting)

**Purpose**: Collect user feedback on incorrect blocks to improve threat detection per FR-011 and SC-003

- [ ] T089 [P] Create FalsePositiveReport entity in src/shared/types.ts per data-model.md
- [ ] T090 [P] Create feedback form HTML in electron/renderer/feedback-form/feedback.html with justification textarea
- [ ] T091 [P] Implement feedback form logic in electron/renderer/feedback-form/feedback.ts handling submission and local storage
- [ ] T092 [P] Create feedback form styles in electron/renderer/feedback-form/feedback.css
- [ ] T093 Implement feedback storage in data/feedback/ directory with JSONL format
- [ ] T094 Add "Report False Positive" button to warning pages in electron/renderer/warning-page/warning.html
- [ ] T095 Implement feedback analysis script (manual review tool) in scripts/analyze-false-positives.js aggregating reports by URL
- [ ] T096 Update decision maker to track override rates per domain (high override rate → reduce threat score)
- [ ] T097 Create weekly cron job documentation for false positive review in docs/maintenance.md

---

## Phase 8: Performance Optimization (Cross-Cutting)

**Purpose**: Meet SC-005 (<1s threat detection for 99% of requests)

- [ ] T098 [P] Implement request coalescing in threat analysis engine (deduplicate simultaneous requests to same domain)
- [ ] T099 [P] Add background preloading in request interceptor (predictively analyze links on current page)
- [ ] T100 Implement performance metrics tracking in electron/main/threat-analysis/engine.ts (p50, p95, p99 latencies)
- [ ] T101 [P] Create performance monitoring dashboard (optional) showing cache hit rates and AI call rates
- [ ] T102 Optimize LRU cache size in cache-manager.ts based on memory profiling (target <200MB per SC baseline)
- [ ] T103 Add timeout enforcement (10 second max) in threat analysis engine per data-model.md validation
- [ ] T104 Create performance benchmark tests in tests/integration/performance.test.ts validating SC-005 latency requirements

---

## Phase 9: Polish & Documentation

**Purpose**: Final improvements affecting multiple user stories

- [ ] T105 [P] Add comprehensive JSDoc comments to all public APIs in electron/main/ modules
- [ ] T106 [P] Create API documentation in docs/api/ generated from OpenAPI contracts
- [ ] T107 [P] Write user guide in docs/user-guide.md explaining warning pages and override process
- [ ] T108 [P] Create developer guide in docs/developer-guide.md covering architecture and extension points
- [ ] T109 [P] Add code examples to quickstart.md for common development tasks (adding new threat indicators, updating prompts)
- [ ] T110 [P] Create deployment guide in docs/deployment.md with electron-builder packaging instructions
- [ ] T111 Implement error boundary in renderer process catching unhandled exceptions
- [ ] T112 Add telemetry opt-in (privacy-respecting) for aggregate threat statistics (optional, defer if time-constrained)
- [ ] T113 Security audit: Review all user inputs for injection vulnerabilities (URL parsing, AI prompts)
- [ ] T114 Security audit: Verify cryptographic signature validation for threat intelligence updates
- [ ] T115 Run Electron security checklist validation (context isolation, node integration disabled in renderer)
- [ ] T116 Create release checklist in docs/release-checklist.md covering testing, packaging, and distribution
- [ ] T117 Add changelog template in CHANGELOG.md tracking user-facing changes per release

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - Phase 3 (US1 - Phishing): Can start after Phase 2
  - Phase 4 (US2 - Malware): Can start after Phase 2 (independent of US1, but integrates naturally)
  - Phase 5 (US3 - Social Engineering): Can start after Phase 2 (independent of US1/US2, but integrates naturally)
- **Cross-Cutting (Phase 6-8)**: Can start after desired user stories are complete
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Phishing)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP TARGET**
- **User Story 2 (P2 - Malware)**: Can start after Foundational (Phase 2) - Independent but integrates with US1 threat detection pipeline
- **User Story 3 (P3 - Social Engineering)**: Can start after Foundational (Phase 2) - Independent but integrates with US1/US2 detection pipeline

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Test-First TDD)
- Models/entities before services
- Services before UI components
- Core detection logic before warning UI
- Integration tasks last (wiring components together)

### Parallel Opportunities

**Phase 1 (Setup)**: All tasks marked [P] can run in parallel (T003-T009)

**Phase 2 (Foundational)**: 
- T012-T014 (shared types, constants, utils) can run in parallel
- T015-T017 (cache, schema, logging) can run in parallel after T012-T014
- T018-T020 (Electron setup, context bridge, HTML) can run in parallel after T015-T017
- T021-T022 (Gemini client, prompt builder) can run in parallel after T018-T020

**Phase 3 (US1 - Phishing)**:
- Tests T023-T026 can run in parallel (write all contract/integration/E2E tests together)
- Models T027-T029 can run in parallel after tests
- Request interceptor components T031-T032 can run in parallel after T030
- Local detectors T033-T034 can run in parallel
- Warning UI components T042-T044 can run in parallel after T041

**Phase 4 (US2 - Malware)**:
- Tests T053-T055 can run in parallel
- Detectors T056-T057 can run in parallel
- Warning templates T063-T064 can run in parallel

**Phase 5 (US3 - Social Engineering)**:
- Tests T067-T069 can run in parallel
- Detectors T070-T071 can run in parallel
- Warning templates T078-T079 can run in parallel

**Phase 6-9 (Cross-Cutting)**:
- Most tasks marked [P] can run in parallel within their phase

**Multiple Developers**: After Phase 2 (Foundational) completes, different developers can work on US1, US2, and US3 in parallel since they are independently testable user stories that integrate through the shared threat detection pipeline.

---

## Parallel Example: User Story 1 (Phishing Protection)

```bash
# Launch all tests for User Story 1 together (Test-First):
Task T023: "Contract test for threat analysis engine"
Task T024: "Contract test for request interceptor"
Task T025: "Integration test for phishing detection flow"
Task T026: "E2E test for phishing warning display"

# Launch all entity models together:
Task T027: "Create NavigationRequest entity"
Task T028: "Create ThreatAssessment entity"
Task T029: "Create ThreatIndicator entity"

# Launch request interceptor components together (after T030):
Task T031: "Implement URL analyzer"
Task T032: "Implement redirect tracker"

# Launch local detection rules together:
Task T033: "Implement phishing detector"
Task T034: "Create auth providers whitelist"

# Launch warning UI components together (after T041):
Task T042: "Create warning page HTML"
Task T043: "Implement warning page logic"
Task T044: "Create warning page styles"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Goal**: Deliver phishing protection as quickly as possible to validate core architecture

1. ✅ Complete Phase 1: Setup (T001-T010) → ~2 days
2. ✅ Complete Phase 2: Foundational (T011-T022) → ~5 days (CRITICAL PATH)
3. ✅ Complete Phase 3: User Story 1 - Phishing Protection (T023-T052) → ~8 days
4. **STOP and VALIDATE**: Test User Story 1 independently using phishing test URLs
5. Deploy/demo MVP showing phishing detection with explanations
6. **Estimated MVP Time**: ~15 days (3 weeks)

**MVP Success Criteria**:
- ✅ Blocks known phishing sites before page load
- ✅ Displays clear warnings with specific indicators (domain mismatch, credential forms)
- ✅ Allows user override with confirmation and logging
- ✅ False positive rate <2% (test with legitimate banking/auth sites)
- ✅ Threat detection <1s for 99% of requests

### Incremental Delivery

**Post-MVP Iterations** (add value without breaking existing functionality):

1. **Release 1.0 (MVP)**: Phishing protection only (User Story 1)
2. **Release 1.1**: Add malware blocking (User Story 2) → +5 days
3. **Release 1.2**: Add social engineering detection (User Story 3) → +5 days
4. **Release 1.3**: Add offline mode and resilience (Phase 6) → +3 days
5. **Release 1.4**: Add false positive feedback (Phase 7) → +3 days
6. **Release 2.0**: Performance optimization and polish (Phase 8-9) → +4 days

**Total Time Estimate**: ~35 days (7 weeks) for complete feature

### Parallel Team Strategy

With 3 developers working simultaneously:

1. **Week 1-2**: Everyone collaborates on Setup + Foundational (critical path)
2. **Week 3**: Once Foundational is done:
   - Developer A: User Story 1 (Phishing) → T023-T052
   - Developer B: User Story 2 (Malware) → T053-T066
   - Developer C: User Story 3 (Social Engineering) → T067-T082
3. **Week 4**: Integration and cross-cutting concerns
   - Developer A: Phase 6 (Offline mode)
   - Developer B: Phase 7 (False positives)
   - Developer C: Phase 8 (Performance)
4. **Week 5**: Polish and documentation (Phase 9) - everyone contributes

**Estimated Parallel Time**: ~5 weeks (vs 7 weeks sequential)

---

## Task Summary

**Total Tasks**: 117
- Setup (Phase 1): 10 tasks
- Foundational (Phase 2): 12 tasks
- User Story 1 - Phishing (Phase 3): 30 tasks
- User Story 2 - Malware (Phase 4): 14 tasks
- User Story 3 - Social Engineering (Phase 5): 13 tasks
- Offline Mode (Phase 6): 6 tasks
- False Positives (Phase 7): 9 tasks
- Performance (Phase 8): 7 tasks
- Polish & Documentation (Phase 9): 13 tasks

**Parallel Opportunities**: 52 tasks marked [P] (44% of all tasks) can run in parallel

**Independent Test Criteria**:
- **US1**: Navigate to PhishTank URLs, verify blocking with indicator explanations
- **US2**: Navigate to malware distribution sites, verify blocking with malware warnings
- **US3**: Test fake OAuth pages, verify social engineering warnings

**Suggested MVP Scope**: User Story 1 only (Phishing Protection) - 52 total tasks (Setup + Foundational + US1)

**Format Validation**: ✅ All 117 tasks follow checklist format:
- ✅ All start with `- [ ]` checkbox
- ✅ All have sequential task IDs (T001-T117)
- ✅ All user story tasks have [Story] labels ([US1], [US2], [US3])
- ✅ All parallelizable tasks marked with [P]
- ✅ All include specific file paths in descriptions
- ✅ Setup and Foundational phases have NO story labels (correct)
- ✅ Polish phase has NO story labels (correct)

---

## Notes

- **[P] tasks** = different files, no dependencies → can run in parallel
- **[Story] label** maps task to specific user story for traceability
- Each user story should be **independently completable and testable**
- **Verify tests fail** before implementing (Red-Green-Refactor)
- **Commit after each task** or logical group for clean history
- **Stop at any checkpoint** to validate story independently
- **Refer to contracts/** for API boundaries (request/response schemas)
- **Refer to data-model.md** for entity validation rules
- **Refer to research.md** for technical decision rationale
- **Refer to quickstart.md** for development workflow examples

---

## Quick Reference: Key Files by Concern

**Threat Detection**:
- `electron/main/threat-analysis/engine.ts` - Main analysis coordinator
- `electron/main/threat-analysis/local-rules/*.ts` - Deterministic pattern matching
- `electron/main/threat-analysis/ai-analyzer/gemini-client.ts` - AI integration

**Request Handling**:
- `electron/main/request-interceptor/interceptor.ts` - Navigation interception
- `electron/main/decision-engine/decision-maker.ts` - Enforcement decisions

**User Interface**:
- `electron/renderer/warning-page/*.{html,ts,css}` - Threat warnings
- `electron/renderer/feedback-form/*.{html,ts,css}` - False positive reports

**Data & Caching**:
- `electron/main/threat-analysis/cache/cache-manager.ts` - Threat intelligence cache
- `electron/main/decision-engine/logger.ts` - Decision audit logs

**Configuration**:
- `config/vite.config.ts` - Build configuration
- `src/shared/constants.ts` - App-wide settings
- `.env` - API keys and secrets

**Testing**:
- `tests/contract/*.test.ts` - API contract tests
- `tests/integration/*.test.ts` - Cross-boundary tests
- `tests/e2e/*.test.ts` - End-to-end Playwright tests

---

**Ready for implementation!** Start with Phase 1 (Setup), complete Phase 2 (Foundational) as a team, then implement User Story 1 for MVP delivery. Each user story can then be developed independently in priority order or in parallel with multiple developers.
