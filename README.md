# 🛡️ AI Secure Browser

An intelligent web browser with **real-time phishing and threat detection** powered by Google Gemini AI. The browser verifies every URL using a multi-step analysis pipeline that combines Google Search reputation checks with actual page content analysis.

![Electron](https://img.shields.io/badge/Electron-31-47848F?style=flat-square&logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-8E75B2?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🔍 Three-Step AI Analysis Pipeline

Every URL goes through a comprehensive verification process:

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Google Search                                       │
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

### 🎯 Threat Detection Capabilities

| Threat Type | Detection Method |
|-------------|-----------------|
| **Phishing** | Typosquatting detection, brand impersonation, fake login forms |
| **Malware** | Suspicious downloads, malicious file extensions |
| **Social Engineering** | Urgency tactics, fear-based messaging, too-good-to-be-true offers |
| **Homograph Attacks** | Unicode lookalike characters, character substitution |

### 🧠 Smart Decision Making

- **AI Override Logic**: When Gemini verifies a site as safe with high confidence, it overrides local false positives
- **Zero False Positives on Legitimate Sites**: Sites like `chat.com` won't be blocked just because they're similar to `chase.com`
- **Conservative Blocking**: Only blocks sites with actual evidence of malicious intent

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API Key

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

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |

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

## 🏗️ Architecture

```
ai-secure-browser/
├── electron/
│   ├── main/
│   │   ├── threat-analysis/
│   │   │   ├── engine.ts              # Main analysis orchestrator
│   │   │   ├── ai-analyzer/
│   │   │   │   ├── gemini-client.ts   # 3-step Gemini analysis
│   │   │   │   └── url-analyzer.ts    # URL content analysis
│   │   │   ├── local-rules/
│   │   │   │   └── phishing-detector.ts  # Pattern-based detection
│   │   │   └── cache/
│   │   │       └── cache-manager.ts   # Result caching
│   │   └── decision-engine/
│   │       └── decision-engine.ts     # Threat → Action conversion
│   ├── preload/
│   │   └── index.ts                   # Secure IPC bridge
│   └── renderer/
│       └── browser-ui/                # Browser interface
├── src/
│   └── shared/
│       ├── types.ts                   # TypeScript interfaces
│       ├── constants.ts               # Configuration
│       └── utils.ts                   # Helper functions
└── docs/
    ├── gemini.md                      # Gemini API documentation
    └── gemini_structured.md           # Structured outputs guide
```

## 📊 Analysis Flow

1. **Cache Check**: First, check if we've analyzed this domain before
2. **Local Rules**: Quick pattern matching for obvious threats (typosquatting, homographs)
3. **AI Analysis**: 
   - **Google Search**: Verify domain reputation via web search
   - **URL Fetch**: Analyze actual page content
   - **Final Decision**: Combine both signals for accurate verdict
4. **Decision Engine**: Convert threat assessment to action (allow/warn/block)

## 🛡️ Security Features

- **Proactive Protection**: Every URL is analyzed before navigation
- **Multi-layered Detection**: Local rules + AI grounding + Content analysis
- **False Positive Prevention**: AI can override local rule mistakes
- **Transparent Decisions**: Warning pages explain why a site was blocked
- **User Override**: Users can proceed to blocked sites at their own risk

## 🔬 Example Detections

| URL | Result | Reason |
|-----|--------|--------|
| `https://paypa1.com` | 🚫 BLOCKED | Typosquatting PayPal (1→l) |
| `https://chat.com` | ✅ ALLOWED | AI verified: Legitimate ChatGPT site |
| `https://priyanshutech.xyz` | ✅ ALLOWED | AI verified: Personal portfolio, no threats |
| `https://sbiiiiii.com` | 🚫 BLOCKED | Suspicious domain impersonating SBI bank |

## 📝 API Reference

### Gemini Client

```typescript
// Three-step analysis
const result = await geminiAnalyzer.analyze(url, {
    referrer: document.referrer,
    redirectChain: ['url1', 'url2']
});

// Result structure
interface GeminiThreatAnalysis {
    threatType: 'phishing' | 'malware' | 'social_engineering' | 'safe';
    confidence: number;  // 0.0 to 1.0
    indicators: ThreatIndicator[];
    recommendation: 'block' | 'warn' | 'allow';
}
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful threat analysis
- [Electron](https://www.electronjs.org/) for cross-platform desktop support
- [Vite](https://vitejs.dev/) for blazing fast development

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/priyanshuchawda">Priyanshu Chawda</a>
</p>
