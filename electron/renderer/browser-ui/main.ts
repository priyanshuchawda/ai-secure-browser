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
            goBack: () => void;
            goForward: () => void;
            refresh: () => void;
            goHome: () => void;
            getNavState: () => Promise<{ canGoBack: boolean; canGoForward: boolean; currentUrl: string | null }>;
            onNavStateChange: (callback: (state: { canGoBack: boolean; canGoForward: boolean; currentUrl: string | null }) => void) => void;
            // Download protection
            proceedDownload: (downloadId: string) => Promise<{ success: boolean }>;
            cancelDownload: (downloadId: string) => Promise<{ success: boolean }>;
            onDownloadAnalyzed: (callback: (data: DownloadAnalysisData) => void) => void;
            onDownloadProgress: (callback: (data: DownloadProgressData) => void) => void;
            onDownloadComplete: (callback: (data: DownloadCompleteData) => void) => void;
            onDownloadScanning: (callback: (data: DownloadScanningData) => void) => void;
        };
    }
}

// Download analysis data type
interface DownloadAnalysisData {
    downloadId: string;
    info: {
        fileName: string;
        fileSize: number;
        mimeType: string;
        url: string;
        referrer: string;
        domain: string;
    };
    analysis: {
        riskLevel: string;
        riskScore: number;
        reasoning: string;
        sourceReputation: string;
        recommendations: string[];
        shouldBlock: boolean;
        allowOverride: boolean;
    };
}

// Download progress data type
interface DownloadProgressData {
    downloadId: string;
    progress: number;
    received: number;
    total: number;
}

// Download complete data type
interface DownloadCompleteData {
    downloadId: string;
    info: {
        fileName: string;
        fileSize: number;
        mimeType: string;
        url: string;
        referrer: string;
        domain: string;
    };
    savePath: string;
    success: boolean;
}

// Download scanning data type
interface DownloadScanningData {
    downloadId: string;
    info: {
        fileName: string;
        fileSize: number;
        mimeType: string;
        url: string;
        referrer: string;
        domain: string;
    };
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

// DOM Elements - Navigation Controls
const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
const forwardBtn = document.getElementById('forward-btn') as HTMLButtonElement;
const refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement;
const homeBtn = document.getElementById('home-btn') as HTMLButtonElement;

// DOM Elements - Webview
const webviewContainer = document.getElementById('webview-container') as HTMLDivElement;
const browserWebview = document.getElementById('browser-webview') as Electron.WebviewTag;
const browserContent = document.querySelector('.browser-content') as HTMLElement;

// DOM Elements - Download Panel
const downloadPanel = document.getElementById('download-panel') as HTMLDivElement;
const downloadTitle = document.getElementById('download-title') as HTMLHeadingElement;
const downloadBadge = document.getElementById('download-badge') as HTMLDivElement;
const downloadFilename = document.getElementById('download-filename') as HTMLDivElement;
const downloadSize = document.getElementById('download-size') as HTMLSpanElement;
const downloadDomain = document.getElementById('download-domain') as HTMLSpanElement;
const downloadRiskCircle = document.getElementById('download-risk-circle') as HTMLDivElement;
const downloadRiskScore = document.getElementById('download-risk-score') as HTMLSpanElement;
const downloadRiskLevel = document.getElementById('download-risk-level') as HTMLDivElement;
const downloadReasoning = document.getElementById('download-reasoning') as HTMLDivElement;
const downloadRecommendations = document.getElementById('download-recommendations') as HTMLDivElement;
const downloadProceedBtn = document.getElementById('download-proceed-btn') as HTMLButtonElement;
const downloadCancelBtn = document.getElementById('download-cancel-btn') as HTMLButtonElement;
const fileIcon = document.getElementById('file-icon') as HTMLDivElement;

// Track current URL for navigation
let currentUrl: string | null = null;

// Track current download for user decision
let currentDownloadId: string | null = null;

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
            // Error fallback - still navigate
            updateScanStatus('error', fullUrl);
            setTimeout(() => loadUrlInWebview(fullUrl), 1000);
        }

    } catch (error) {
        console.error('[UI] Navigation error:', error);
        updateScanStatus('error', fullUrl);
    }
}

/**
 * Load URL in the webview
 */
function loadUrlInWebview(url: string): void {
    currentUrl = url;

    // Hide welcome and scan panels, show webview
    welcomePanel.style.display = 'none';
    scanPanel.style.display = 'none';
    webviewContainer.style.display = 'block';
    browserContent.classList.add('webview-active');

    // Load the URL in webview
    browserWebview.src = url;
    urlInput.value = url;

    // Update navigation button states
    updateNavButtons();

    console.log('[UI] Loading in webview:', url);
}

/**
 * Show/Hide Scan Panel
 */
function showScanPanel(show: boolean): void {
    // Hide webview when showing scan panel
    webviewContainer.style.display = 'none';
    browserContent.classList.remove('webview-active');

    if (show) {
        welcomePanel.style.display = 'none';
        scanPanel.style.display = 'block';
    } else {
        welcomePanel.style.display = 'block';
        scanPanel.style.display = 'none';
        // Reset inputs
        urlInput.value = '';
        currentUrl = null;
        updateNavButtons();
    }
}

/**
 * Update navigation button states based on webview state
 */
function updateNavButtons(): void {
    const canGoBack = browserWebview && browserWebview.canGoBack ? browserWebview.canGoBack() : false;
    const canGoForward = browserWebview && browserWebview.canGoForward ? browserWebview.canGoForward() : false;
    const hasUrl = currentUrl !== null;

    backBtn.disabled = !canGoBack;
    forwardBtn.disabled = !canGoForward;
    refreshBtn.disabled = !hasUrl;
}
/**
 * Update scan status during analysis
 */
function updateScanStatus(status: 'analyzing' | 'error', url: string): void {
    scanUrl.textContent = url;
    indicatorsList.innerHTML = '';
    proceedBtn.style.display = 'none';

    if (status === 'analyzing') {
        scanTitle.textContent = 'Scanning...';
        scanBadge.className = 'scan-badge badge-analyzing';
        scanBadge.textContent = 'Analyzing';
        scoreValue.textContent = '--';
        threatTypeEl.textContent = 'Analyzing content...';
        analysisMethodEl.textContent = 'AI';
    } else {
        scanTitle.textContent = 'Error';
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
        scanTitle.textContent = 'Site is Safe';
        scanBadge.className = 'scan-badge badge-safe';
        scanBadge.textContent = 'Safe';
        scanScore.querySelector('.score-circle')!.className = 'score-circle'; // default green

        // Show proceed button so user can see the result before navigating
        proceedBtn.style.display = 'block';
        proceedBtn.textContent = 'Proceed to Site';
        proceedBtn.className = 'btn-primary';
        proceedBtn.onclick = () => loadUrlInWebview(url);

    } else if (isWarning) {
        scanTitle.textContent = 'Suspicious Site';
        scanBadge.className = 'scan-badge badge-warning';
        scanBadge.textContent = 'Warning';
        scanScore.querySelector('.score-circle')!.className = 'score-circle score-warning';
        proceedBtn.style.display = 'block';
        proceedBtn.textContent = 'Proceed Anyway (Risk)';
        proceedBtn.className = 'btn-primary btn-warning';
        proceedBtn.onclick = () => loadUrlInWebview(url);
    } else {
        scanTitle.textContent = 'Malicious Site';
        scanBadge.className = 'scan-badge badge-danger';
        scanBadge.textContent = 'Blocked';
        scanScore.querySelector('.score-circle')!.className = 'score-circle score-danger';
        proceedBtn.style.display = 'none'; // Can't proceed
    }

    // Update Details
    threatTypeEl.textContent = assessment.threatType || 'Safe';
    analysisMethodEl.textContent = assessment.analysisMethod === 'ai_analysis' ? 'AI (Deep Scan)' : 'Local Rules';

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

homeBtn.addEventListener('click', () => {
    console.log('[UI] Home button clicked');
    // Hide webview and show welcome panel
    webviewContainer.style.display = 'none';
    browserContent.classList.remove('webview-active');
    welcomePanel.style.display = 'block';
    scanPanel.style.display = 'none';
    urlInput.value = '';
    currentUrl = null;
    updateNavButtons();
});

// Navigation button event listeners - use webview directly
backBtn.addEventListener('click', () => {
    console.log('[UI] Back button clicked');
    if (browserWebview && browserWebview.canGoBack()) {
        browserWebview.goBack();
    }
});

forwardBtn.addEventListener('click', () => {
    console.log('[UI] Forward button clicked');
    if (browserWebview && browserWebview.canGoForward()) {
        browserWebview.goForward();
    }
});

refreshBtn.addEventListener('click', () => {
    console.log('[UI] Refresh button clicked');
    if (browserWebview) {
        browserWebview.reload();
    }
});

// ============================================
// Webview Event Listeners
// ============================================

// Update URL bar when webview navigates
browserWebview.addEventListener('did-navigate', (event: any) => {
    console.log('[UI] Webview navigated to:', event.url);
    currentUrl = event.url;
    urlInput.value = event.url;
    updateNavButtons();
});

browserWebview.addEventListener('did-navigate-in-page', (event: any) => {
    console.log('[UI] Webview in-page navigation:', event.url);
    currentUrl = event.url;
    urlInput.value = event.url;
    updateNavButtons();
});

// Update nav buttons when webview finishes loading
browserWebview.addEventListener('did-finish-load', () => {
    console.log('[UI] Webview finished loading');
    updateNavButtons();
});

// Handle webview loading errors
browserWebview.addEventListener('did-fail-load', (event: any) => {
    console.error('[UI] Webview failed to load:', event.errorDescription);

    // Show error message to user for significant errors (not just cancelled loads)
    if (event.errorCode && event.errorCode !== -3) { // -3 is ERR_ABORTED (user cancelled)
        // Could show an error page here
        console.warn(`[UI] Load failed: ${event.errorDescription} (${event.errorCode})`);
    }
});

// ============================================
// Download Protection
// ============================================

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
    if (bytes === 0 || bytes === -1) return 'Unknown size';
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Show download panel with analysis results
 */
function showDownloadPanel(data: DownloadAnalysisData): void {
    const { downloadId, info, analysis } = data;

    console.log('[UI] Showing download panel:', downloadId, analysis.riskLevel);

    currentDownloadId = downloadId;

    // Update file info
    downloadFilename.textContent = info.fileName;
    downloadSize.textContent = formatFileSize(info.fileSize);
    downloadDomain.textContent = info.domain;

    // Update risk score
    downloadRiskScore.textContent = analysis.riskScore.toString();
    downloadRiskCircle.className = `risk-score-circle risk-${analysis.riskLevel}`;

    // Update risk level text
    const riskLabels: Record<string, string> = {
        'safe': 'Safe Download',
        'low': 'Low Risk',
        'medium': 'Medium Risk',
        'high': 'High Risk',
        'critical': 'Critical - Blocked'
    };
    downloadRiskLevel.textContent = riskLabels[analysis.riskLevel] || analysis.riskLevel;
    downloadRiskLevel.className = `risk-level level-${analysis.riskLevel}`;

    // Update reasoning
    downloadReasoning.textContent = analysis.reasoning;

    // Update badge
    downloadBadge.textContent = analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1);
    downloadBadge.className = `download-badge badge-${analysis.riskLevel}`;

    // Update title based on risk
    if (analysis.shouldBlock && !analysis.allowOverride) {
        downloadTitle.textContent = 'Download Blocked';
    } else if (analysis.riskLevel === 'safe') {
        downloadTitle.textContent = 'Download Approved';
    } else {
        downloadTitle.textContent = 'Download Security Check';
    }

    // Update file icon color
    fileIcon.className = 'file-icon';
    if (analysis.riskLevel === 'critical' || analysis.riskLevel === 'high') {
        fileIcon.classList.add('icon-danger');
    } else if (analysis.riskLevel === 'medium') {
        fileIcon.classList.add('icon-warning');
    } else if (analysis.riskLevel === 'safe') {
        fileIcon.classList.add('icon-safe');
    }

    // Update recommendations
    downloadRecommendations.innerHTML = '';
    if (analysis.recommendations && analysis.recommendations.length > 0) {
        analysis.recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.textContent = rec;
            downloadRecommendations.appendChild(item);
        });
    }

    // Show/hide proceed button based on override allowed
    if (analysis.allowOverride) {
        downloadProceedBtn.style.display = 'block';
        if (analysis.riskLevel === 'safe' || analysis.riskLevel === 'low') {
            downloadProceedBtn.textContent = 'Download';
            downloadProceedBtn.className = 'btn-primary';
        } else if (analysis.riskLevel === 'medium') {
            downloadProceedBtn.textContent = 'Download Anyway';
            downloadProceedBtn.className = 'btn-primary btn-warning';
        } else {
            downloadProceedBtn.textContent = 'Download at Your Own Risk';
            downloadProceedBtn.className = 'btn-primary btn-danger';
        }
    } else {
        downloadProceedBtn.style.display = 'none';
    }

    // Show the panel
    downloadPanel.style.display = 'flex';
}

/**
 * Hide download panel
 */
function hideDownloadPanel(): void {
    downloadPanel.style.display = 'none';
    currentDownloadId = null;
}

// Download panel button handlers
downloadProceedBtn.addEventListener('click', async () => {
    if (!currentDownloadId) return;

    console.log('[UI] User proceeding with download:', currentDownloadId);
    const result = await window.electronAPI.proceedDownload(currentDownloadId);
    console.log('[UI] Proceed result:', result);
    hideDownloadPanel();
});

downloadCancelBtn.addEventListener('click', async () => {
    if (!currentDownloadId) return;

    console.log('[UI] User cancelling download:', currentDownloadId);
    const result = await window.electronAPI.cancelDownload(currentDownloadId);
    console.log('[UI] Cancel result:', result);
    hideDownloadPanel();
});

// Listen for download analysis results
if (window.electronAPI && window.electronAPI.onDownloadAnalyzed) {
    window.electronAPI.onDownloadAnalyzed((data) => {
        console.log('[UI] Received download analysis:', data);

        // Don't show panel for auto-approved safe downloads (score < 20)
        if (data.analysis.riskLevel === 'safe' && data.analysis.riskScore < 20) {
            console.log('[UI] Auto-approved safe download, showing notification');
            showDownloadNotification(data.info.fileName, 'Starting download...', 'info');
            return;
        }

        showDownloadPanel(data);
    });

    // Listen for download progress
    window.electronAPI.onDownloadProgress((data) => {
        console.log(`[UI] Download progress: ${data.downloadId} - ${data.progress}%`);
        updateDownloadProgress(data.downloadId, data.progress, data.received, data.total);
    });

    // Listen for download scanning (before analysis)
    window.electronAPI.onDownloadScanning((data) => {
        console.log('[UI] Download scanning started:', data.downloadId, data.info.fileName);
        showDownloadNotification(data.info.fileName, 'Scanning file for threats...', 'scanning');
    });

    // Listen for download completion
    window.electronAPI.onDownloadComplete((data) => {
        console.log('[UI] Download complete:', data.downloadId, data.success);
        if (data.success) {
            showDownloadNotification(data.info.fileName, `Downloaded to ${data.savePath}`, 'success');
        } else {
            showDownloadNotification(data.info.fileName, 'Download failed', 'error');
        }
    });

    console.log('[UI] Download protection listener registered');
}

// Track active download progress
const activeDownloadProgress: Map<string, number> = new Map();

/**
 * Update download progress (could show in a progress bar)
 */
function updateDownloadProgress(downloadId: string, progress: number, received: number, total: number): void {
    activeDownloadProgress.set(downloadId, progress);
    // For now just log, but could update a UI progress bar
    console.log(`[UI] Progress: ${downloadId} at ${progress}%`);
}

/**
 * Show download notification toast
 */
function showDownloadNotification(fileName: string, message: string, type: 'info' | 'success' | 'error' | 'scanning'): void {
    // Get icon based on type
    const getIcon = () => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'scanning': return '⏳';
            default: return '↓';
        }
    };

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `download-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${getIcon()}</div>
        <div class="notification-content">
            <div class="notification-title">${fileName}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

console.log('[UI] Browser UI initialized');
