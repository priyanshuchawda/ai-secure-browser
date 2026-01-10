/**
 * Browser UI Main Script
 * Handles URL input and navigation through secure context bridge
 */

// Export empty to make this a module (required for global augmentation)
export { };

// Declare electronAPI type (exposed by preload script)
declare global {
    interface Window {
        electronAPI: {
            analyzeUrl: (url: string) => Promise<unknown>;
            submitOverride: (requestId: string, reason: string) => Promise<void>;
            reportFalsePositive: (data: { url: string; threatType: string; justification: string }) => Promise<void>;
            navigate: (url: string) => void;
            getStatus: () => Promise<{ online: boolean; cacheSize: number }>;
            onAnalysisResult: (callback: (result: unknown) => void) => void;
        };
    }
}

// Get DOM elements
// DOM Elements - Input & Status
const urlInput = document.getElementById('url-input') as HTMLInputElement;
const goBtn = document.getElementById('go-btn') as HTMLButtonElement;
const statusIndicator = document.getElementById('status') as HTMLDivElement;

// DOM Elements - Panels
const welcomePanel = document.getElementById('welcome-panel') as HTMLDivElement;
const scanPanel = document.getElementById('scan-panel') as HTMLDivElement;

// DOM Elements - Scan Results
const scanTitle = document.getElementById('scan-title') as HTMLHeadingElement;
const scanBadge = document.getElementById('scan-badge') as HTMLDivElement;
const scanUrl = document.getElementById('scan-url') as HTMLDivElement;
const scanScore = document.getElementById('scan-score') as HTMLDivElement;
const scoreValue = scanScore.querySelector('.score-value') as HTMLSpanElement;
const threatTypeEl = document.getElementById('threat-type')?.querySelector('span') as HTMLSpanElement;
const analysisMethodEl = document.getElementById('analysis-method')?.querySelector('span') as HTMLSpanElement;
const indicatorsList = document.getElementById('indicators-list') as HTMLDivElement;
const proceedBtn = document.getElementById('proceed-btn') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;

/**
 * Navigate to URL with threat checking
 */
async function navigateToUrl(): Promise<void> {
    const url = urlInput.value.trim();

    if (!url) return;

    // Add protocol if missing
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
    }

    // Reset UI
    showScanPanel(true);
    updateScanStatus('analyzing', fullUrl);

    console.log('[UI] Navigating to:', fullUrl);

    try {
        // Request threat analysis via context bridge
        const result = await window.electronAPI.analyzeUrl(fullUrl) as {
            success: boolean;
            assessment?: {
                threatType: string | null;
                confidence: number;
                indicators: Array<{ type: string; description: string; severity: string }>;
                analysisMethod: string;
            };
            decision?: {
                action: string;
                rationale: string;
            };
        };

        console.log('[UI] Analysis result:', result);

        if (result.success && result.assessment && result.decision) {
            displayScanResults(result.assessment, result.decision, fullUrl);
        } else {
            // Error fallback
            updateScanStatus('error', fullUrl);
            setTimeout(() => window.electronAPI.navigate(fullUrl), 1000);
        }

    } catch (error) {
        console.error('[UI] Navigation error:', error);
        updateScanStatus('error', fullUrl);
    }
}

/**
 * Show/Hide Scan Panel
 */
function showScanPanel(show: boolean): void {
    if (show) {
        welcomePanel.style.display = 'none';
        scanPanel.style.display = 'block';
    } else {
        welcomePanel.style.display = 'block';
        scanPanel.style.display = 'none';
        // Reset inputs
        urlInput.value = '';
    }
}

/**
 * Update scan status during analysis
 */
function updateScanStatus(status: 'analyzing' | 'error', url: string): void {
    scanUrl.textContent = url;
    indicatorsList.innerHTML = '';
    proceedBtn.style.display = 'none';

    if (status === 'analyzing') {
        scanTitle.textContent = '🔍 Scanning...';
        scanBadge.className = 'scan-badge badge-analyzing';
        scanBadge.textContent = 'Analyzing';
        scoreValue.textContent = '--';
        threatTypeEl.textContent = 'Analyzing content...';
        analysisMethodEl.textContent = 'Gemini AI';
    } else {
        scanTitle.textContent = '⚠️ Error';
        scanBadge.className = 'scan-badge badge-danger';
        scanBadge.textContent = 'Error';
        threatTypeEl.textContent = 'Analysis failed';
    }
}

/**
 * Display final scan results
 */
function displayScanResults(assessment: any, decision: any, url: string): void {
    const isSafe = decision.action === 'allow';
    const isWarning = decision.action === 'warn';
    const isBlock = decision.action === 'block';

    // Calculate score (simple inverse of confidence for display)
    const score = Math.round((1 - assessment.confidence) * 100);
    scoreValue.textContent = isSafe ? '100' : score.toString();

    // Update Header & Badge
    if (isSafe) {
        scanTitle.textContent = '✅ Site is Safe';
        scanBadge.className = 'scan-badge badge-safe';
        scanBadge.textContent = 'Safe';
        scanScore.querySelector('.score-circle')!.className = 'score-circle'; // default green

        // Auto-proceed if safe (optional, but good UX)
        setTimeout(() => {
            window.electronAPI.navigate(url);
            // showScanPanel(false); 
        }, 1500);

    } else if (isWarning) {
        scanTitle.textContent = '⚠️ Suspicious Site';
        scanBadge.className = 'scan-badge badge-warning';
        scanBadge.textContent = 'Warning';
        scanScore.querySelector('.score-circle')!.className = 'score-circle score-warning';
        proceedBtn.style.display = 'block';
        proceedBtn.textContent = '⚠ Proceed Anyway';
        proceedBtn.onclick = () => window.electronAPI.navigate(url);
    } else {
        scanTitle.textContent = '🚫 Malicious Site';
        scanBadge.className = 'scan-badge badge-danger';
        scanBadge.textContent = 'Blocked';
        scanScore.querySelector('.score-circle')!.className = 'score-circle score-danger';
        proceedBtn.style.display = 'none'; // Can't proceed
    }

    // Update Details
    threatTypeEl.textContent = assessment.threatType || 'Safe';
    analysisMethodEl.textContent = assessment.analysisMethod === 'ai_analysis' ? 'Gemini AI (Deep Scan)' : 'Local Rules';

    // List Indicators
    indicatorsList.innerHTML = '';
    if (assessment.indicators && assessment.indicators.length > 0) {
        assessment.indicators.forEach((ind: any) => {
            const div = document.createElement('div');
            div.className = `indicator-item severity-${ind.severity}`;
            div.innerHTML = `<strong>${ind.type}:</strong> ${ind.description}`;
            indicatorsList.appendChild(div);
        });
    } else if (isSafe) {
        indicatorsList.innerHTML = '<div class="indicator-item severity-info">No threats detected. Content is safe.</div>';
    }
}

// Actions
cancelBtn.addEventListener('click', () => {
    showScanPanel(false);
});

// Event listeners
goBtn.addEventListener('click', navigateToUrl);
urlInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        navigateToUrl();
    }
});

// Listen for analysis results
if (window.electronAPI) {
    window.electronAPI.onAnalysisResult((result: unknown) => {
        console.log('[UI] Received analysis result:', result);
    });
}

console.log('[UI] Browser UI initialized');
