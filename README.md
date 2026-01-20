# AI Secure Browser

An intelligent web browser with **real-time phishing and threat detection** powered by AI. The browser verifies every URL and download using a multi-step analysis pipeline that combines web search reputation checks with actual page content analysis.

![Electron](https://img.shields.io/badge/Electron-31-47848F?style=flat-square&logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)
![AI](https://img.shields.io/badge/AI-Powered-8E75B2?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

### URL Threat Analysis (Three-Step AI Pipeline)

Every URL goes through a comprehensive verification process:

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Web Search                                          │
│  Search for domain reputation, reviews, and safety reports  │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: URL Context (Fetch)                                 │
│  Fetch actual page content and analyze for threats          │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Final Decision                                      │
│  Combine both signals for accurate threat assessment        │
└─────────────────────────────────────────────────────────────┘
```

### Download Protection

AI-powered download security that intercepts and analyzes every file before download:

```
┌─────────────────────────────────────────────────────────────┐
│  DOWNLOAD PROTECTION FLOW                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User clicks download → Pause & Analyze                      │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────────────┐     ┌──────────────────────────┐   │
│  │ Quick Safety Check  │────►│ Dangerous Extension?     │   │
│  │ (Local Rules)       │     │ (.exe, .scr, .bat, etc.) │   │
│  └──────────┬──────────┘     └──────────────────────────┘   │
│             │                                                │
│             ▼                                                │
│  ┌─────────────────────┐                                    │
│  │ AI Risk Analysis    │                                    │
│  │ - Source reputation │                                    │
│  │ - Software verify   │ ← NEW: Google Search verification  │
│  │ - Official source?  │ ← NEW: Is it from official site?   │
│  └──────────┬──────────┘                                    │
│             │                                                │
│             ▼                                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  SAFE → Auto-download | WARNING → User decides      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### Download Risk Levels

| Risk Level | Extension Examples | Action |
|------------|-------------------|--------|
| **Safe** | .pdf, .jpg, .mp3, .docx | Auto-proceed |
| **Low** | .zip, .rar, .7z | Show panel, allow proceed |
| **Medium** | .jar, .py, .sh | Show warning, allow proceed |
| **High** | .msi, .dll, .reg | Show warning, allow proceed |
| **Critical** | .exe, .scr, .bat (untrusted) | Block (no override) |

### Software Legitimacy Verification (NEW!)

Downloads are verified with a two-step Google Search check:

| Check | What It Does |
|-------|-------------|
| **Is this real software?** | Searches to verify the app exists (e.g., "Lens Studio" → Snap Inc.) |
| **Is this the official source?** | Checks if the download domain is authorized |

**Example:**
```
File: Lens_Studio_5.15.3_win_setup.exe
Domain: storage.googleapis.com

AI Search Result:
✅ LEGITIMATE_SOFTWARE - Lens Studio is official AR software by Snap Inc.
✅ OFFICIAL_SOURCE - Snap uses Google Cloud Storage for distribution

→ Risk Score: LOW (25)
```

### Intelligent Caching (NEW!)

```
┌─────────────────────────────────────────────────────────────┐
│  CACHE SYSTEM                                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  First Visit → Full AI Analysis → Cache Result               │
│                                                              │
│  Return Visit → ⚡ Instant from Cache (2ms)                  │
│                 └─→ [🔄 Re-check with AI] button available   │
│                                                              │
│  Cache Persistence:                                          │
│  • Saves immediately for first 5 entries                     │
│  • Saves every 5 writes thereafter                           │
│  • Flushes on app quit                                       │
│  • Location: data/threat-cache/intelligence.json             │
└─────────────────────────────────────────────────────────────┘
```

### Browser Navigation

Full browser-like navigation with webview integration:

- **Back/Forward** - Navigate through browser history
- **Refresh** - Reload current page
- **Home** - Return to welcome screen
- **URL Bar** - Real-time URL tracking
- **Webview** - Websites load inside app, keeping navigation always visible

### Threat Detection Capabilities

| Threat Type | Detection Method |
|-------------|-----------------|
| **Phishing** | Typosquatting detection, brand impersonation, fake login forms |
| **Malware** | Suspicious downloads, malicious file extensions |
| **Social Engineering** | Urgency tactics, fear-based messaging, too-good-to-be-true offers |
| **Homograph Attacks** | Unicode lookalike characters, character substitution |
| **Dangerous Downloads** | Executable analysis, source reputation, double extension detection |
| **Fake Software** | AI verifies software legitimacy via web search |

### Smart Decision Making

- **AI Override Logic**: When AI verifies a site as safe with high confidence, it overrides local false positives
- **Zero False Positives on Legitimate Sites**: Sites like `chat.com` won't be blocked just because they're similar to `chase.com`
- **Conservative Blocking**: Only blocks sites with actual evidence of malicious intent
- **Download Intelligence**: Context-aware download analysis (executables from GitHub = safe, from unknown domain = risky)
- **Software Verification**: Google Search confirms if software is legitimate before download

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- AI API Key (Gemini)

### Installation

```bash
# Clone the repository
git clone https://github.com/priyanshuchawda/ai-secure-browser.git
cd ai-secure-browser

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Running the App

```bash
# Development mode with hot-reload
npm run dev

# Build for production
npm run build
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Gemini AI API key | Yes |

### Analysis Thresholds

Edit `src/shared/constants.ts` to customize:

```typescript
export const THRESHOLDS = {
    AUTO_BLOCK_CONFIDENCE: 0.9,  // Block if confidence >= 90%
    WARN_CONFIDENCE: 0.7,        // Warn if confidence >= 70%
};

export const PERFORMANCE = {
    ANALYSIS_TIMEOUT_MS: 30000,  // 30 second timeout for 3-step analysis
};
```

## Architecture

```
ai-secure-browser/
├── electron/
│   ├── main/
│   │   ├── threat-analysis/
│   │   │   ├── engine.ts              # Main analysis orchestrator
│   │   │   ├── ai-analyzer/
│   │   │   │   ├── gemini-client.ts   # 3-step AI analysis
│   │   │   │   └── url-analyzer.ts    # URL content analysis
│   │   │   ├── local-rules/
│   │   │   │   └── phishing-detector.ts  # Pattern-based detection
│   │   │   └── cache/
│   │   │       └── cache-manager.ts   # Result caching
│   │   ├── download-protection/       # NEW: Download security
│   │   │   ├── download-rules.ts      # Extension risk classifications
│   │   │   ├── ai-download-analyzer.ts # AI download analysis
│   │   │   └── download-interceptor.ts # Download interception
│   │   └── decision-engine/
│   │       └── decision-engine.ts     # Threat → Action conversion
│   ├── preload/
│   │   └── index.ts                   # Secure IPC bridge
│   └── renderer/
│       └── browser-ui/                # Browser interface
│           ├── main.ts                # UI logic
│           └── styles.css             # Styling
├── src/
│   └── shared/
│       ├── types.ts                   # TypeScript interfaces
│       ├── constants.ts               # Configuration
│       └── utils.ts                   # Helper functions
└── docs/
    ├── gemini.md                      # AI API documentation
    └── gemini_structured.md           # Structured outputs guide
```

## Analysis Flow

### URL Analysis
1. **Cache Check**: First, check if we've analyzed this domain before
2. **Local Rules**: Quick pattern matching for obvious threats (typosquatting, homographs)
3. **AI Analysis**: 
   - **Web Search**: Verify domain reputation via web search
   - **URL Fetch**: Analyze actual page content
   - **Final Decision**: Combine both signals for accurate verdict
4. **Decision Engine**: Convert threat assessment to action (allow/warn/block)

### Download Analysis
1. **Intercept**: Pause download before it starts
2. **Quick Check**: Local rules check file extension and source
3. **AI Analysis**: Gemini analyzes file type, source reputation, and context
4. **User Decision**: Show warning panel with risk assessment
5. **Proceed/Cancel**: User decides based on analysis

## Security Features

- **Proactive Protection**: Every URL is analyzed before navigation
- **Download Interception**: All downloads are scanned before allowing
- **Multi-layered Detection**: Local rules + AI grounding + Content analysis
- **False Positive Prevention**: AI can override local rule mistakes
- **Transparent Decisions**: Warning pages explain why a site/download was blocked
- **User Override**: Users can proceed to blocked sites at their own risk (except critical)

## Example Detections

### URL Examples
| URL | Result | Reason |
|-----|--------|--------|
| `https://paypa1.com` | BLOCKED | Typosquatting PayPal (1→l) |
| `https://chat.com` | ALLOWED | AI verified: Legitimate ChatGPT site |
| `https://github.com` | ALLOWED | Trusted source |

### Download Examples
| File | Source | Result | Reason |
|------|--------|--------|--------|
| `nodejs-installer.msi` | nodejs.org | SAFE | Trusted source |
| `setup.exe` | unknown-downloads.xyz | BLOCKED | Unknown source, critical extension |
| `document.pdf` | drive.google.com | SAFE | Safe extension, trusted source |
| `invoice.pdf.exe` | any | BLOCKED | Double extension attack |

## API Reference

### AI Client

```typescript
// Three-step analysis
const result = await aiAnalyzer.analyze(url, {
    referrer: document.referrer,
    redirectChain: ['url1', 'url2']
});

// Result structure
interface AIThreatAnalysis {
    threatType: 'phishing' | 'malware' | 'social_engineering' | 'safe';
    confidence: number;  // 0.0 to 1.0
    indicators: ThreatIndicator[];
    recommendation: 'block' | 'warn' | 'allow';
}
```

### Download Analyzer

```typescript
// Download analysis
const analysis = await analyzeDownload({
    fileName: 'setup.exe',
    fileSize: 45000000,
    mimeType: 'application/octet-stream',
    url: 'https://example.com/setup.exe',
    domain: 'example.com'
});

// Result structure
interface DownloadAnalysis {
    riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;  // 0-100
    reasoning: string;
    sourceReputation: 'trusted' | 'neutral' | 'suspicious' | 'malicious';
    recommendations: string[];
    shouldBlock: boolean;
    allowOverride: boolean;
}
```

## Roadmap

### Current Features (v1.0) ✅
- [x] URL Threat Analysis (3-step AI pipeline)
- [x] Download Protection with AI analysis
- [x] Browser Navigation (Back, Forward, Refresh, Home)
- [x] Website Safety Caching (LRU + Disk persistence)
- [x] Download Progress Tracking & Notifications
- [x] Auto-save downloads to system Downloads folder
- [x] Software Legitimacy Verification (Google Search)
- [x] Cache Persistence (saves on quit, immediate for first entries)
- [x] Re-check with AI button (force refresh cached results)
- [x] AI Failure Graceful Handling (reduced confidence when unavailable)

### Upcoming Features (v1.1) - NEXT PRIORITIES
- [ ] **Multi-tab Browsing** - Open multiple sites in tabs
- [ ] **Browser History** - Track and manage browsing history
- [ ] **Bookmarks** - Save and organize favorite websites
- [ ] **SHA256 Hash Checking** - Check file hashes against VirusTotal/malware databases
- [ ] **Download History** - View past downloads with security info
- [ ] **Settings Page** - Configure thresholds, API keys, download location

### Security Enhancements (v1.2)
- [ ] **Sandboxing** - Isolate and analyze suspicious files in a sandbox
- [ ] **Password Manager** - Secure password storage with AI-powered security warnings
- [ ] **Certificate Checking** - Verify SSL certificates and warn about issues
- [ ] **Cookie Management** - Smart cookie consent handling
- [ ] **Ad/Tracker Blocker** - Block intrusive ads and trackers

### Future Roadmap (v2.0)
- [ ] **Extension Support** - Support for Chrome extensions
- [ ] **Sync Across Devices** - Cloud sync for settings, bookmarks, history
- [ ] **VPN Integration** - Built-in VPN for private browsing
- [ ] **Parental Controls** - Website filtering and time limits
- [ ] **Dark Web Monitoring** - Alert when credentials are found on dark web
- [ ] **AI-Powered Search** - Smart search with AI summarization

### Experimental Features (Research)
- [ ] **Real-time Content Analysis** - Analyze page content as you browse
- [ ] **AI Form Detection** - Detect and warn about credential harvesting forms
- [ ] **Network Traffic Analysis** - Monitor and analyze network traffic for threats
- [ ] **Machine Learning Model** - On-device ML model for faster threat detection

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Gemini AI](https://deepmind.google/technologies/gemini/) for powerful threat analysis
- [Electron](https://www.electronjs.org/) for cross-platform desktop support
- [Vite](https://vitejs.dev/) for blazing fast development

---

<p align="center">
  Made with love by <a href="https://github.com/priyanshuchawda">Priyanshu Chawda</a>
</p>
