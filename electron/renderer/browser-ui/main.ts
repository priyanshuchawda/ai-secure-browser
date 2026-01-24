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
            forceRefresh: (url: string) => Promise<unknown>;  // Force re-analyze bypassing cache
            getSafetyGuidelines: (url: string, assessment: any) => Promise<unknown>;  // Get AI safety guidelines
            checkDomainAcknowledged: (url: string) => Promise<{ acknowledged: boolean }>;  // Check if domain acknowledged
            markDomainAcknowledged: (url: string) => Promise<{ success: boolean }>;  // Mark domain as acknowledged
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
            onOpenUrlInNewTab: (callback: (url: string) => void) => void;  // Handle target="_blank" links
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

// Tab interface
interface Tab {
    id: string;
    title: string;
    url: string | null;
    securityStatus: 'safe' | 'warning' | 'danger' | 'unknown';
    isLoading: boolean;
    webviewElement: Electron.WebviewTag;
}

// TabManager class
class TabManager {
    private tabs: Map<string, Tab> = new Map();
    private activeTabId: string | null = null;
    private tabsContainer: HTMLElement;
    private webviewsContainer: HTMLElement;
    private urlInput: HTMLInputElement;
    private nextTabId = 1;

    constructor(
        tabsContainer: HTMLElement,
        webviewsContainer: HTMLElement,
        urlInput: HTMLInputElement
    ) {
        this.tabsContainer = tabsContainer;
        this.webviewsContainer = webviewsContainer;
        this.urlInput = urlInput;
    }

    /**
     * Create a new tab
     */
    createTab(url: string | null = null, makeActive = true): Tab {
        const tabId = `tab-${this.nextTabId++}`;

        // Create webview element
        const webview = document.createElement('webview') as Electron.WebviewTag;
        webview.id = `webview-${tabId}`;
        webview.src = url || 'about:blank';
        webview.setAttribute('partition', 'persist:main');
        webview.setAttribute('allowpopups', '');
        webview.style.display = 'none';

        // Create tab data
        const tab: Tab = {
            id: tabId,
            title: url ? 'Loading...' : 'New Tab',
            url: url,
            securityStatus: 'unknown',
            isLoading: !!url,
            webviewElement: webview
        };

        // Add webview to container
        this.webviewsContainer.appendChild(webview);

        // Store tab
        this.tabs.set(tabId, tab);

        // Render tab UI
        this.renderTab(tab);

        // Setup webview event listeners
        this.setupWebviewListeners(tab);

        // Make active if requested
        if (makeActive) {
            this.switchTab(tabId);
        }

        console.log('[TabManager] Created tab:', tabId, url);
        return tab;
    }

    /**
     * Render tab element in the tab bar
     */
    private renderTab(tab: Tab): void {
        const tabElement = document.createElement('div');
        tabElement.className = 'tab';
        tabElement.dataset.tabId = tab.id;

        tabElement.innerHTML = `
            <div class="tab-security-indicator ${tab.isLoading ? '' : `status-${tab.securityStatus}`}">
                ${tab.isLoading ? '<div class="tab-loading"></div>' : ''}
            </div>
            <span class="tab-title">${tab.title}</span>
            <button class="tab-close" title="Close tab">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
        `;

        // Click to switch tab
        tabElement.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).closest('.tab-close')) {
                this.switchTab(tab.id);
            }
        });

        // Close button
        const closeBtn = tabElement.querySelector('.tab-close');
        closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tab.id);
        });

        this.tabsContainer.appendChild(tabElement);
    }

    /**
     * Update tab UI
     */
    private updateTabUI(tabId: string): void {
        const tab = this.tabs.get(tabId);
        if (!tab) return;

        const tabElement = this.tabsContainer.querySelector(`[data-tab-id="${tabId}"]`);
        if (!tabElement) return;

        const indicator = tabElement.querySelector('.tab-security-indicator');
        const titleElement = tabElement.querySelector('.tab-title');

        if (indicator) {
            indicator.className = `tab-security-indicator ${tab.isLoading ? '' : `status-${tab.securityStatus}`}`;
            indicator.innerHTML = tab.isLoading ? '<div class="tab-loading"></div>' : '';
        }

        if (titleElement) {
            titleElement.textContent = tab.title;
        }
    }

    /**
     * Switch to a different tab
     */
    switchTab(tabId: string): void {
        const tab = this.tabs.get(tabId);
        if (!tab) return;

        // Deactivate previous tab
        if (this.activeTabId) {
            const prevTab = this.tabs.get(this.activeTabId);
            if (prevTab) {
                prevTab.webviewElement.style.display = 'none';
                const prevTabElement = this.tabsContainer.querySelector(`[data-tab-id="${this.activeTabId}"]`);
                prevTabElement?.classList.remove('active');
            }
        }

        // Activate new tab
        this.activeTabId = tabId;
        // CRITICAL: Must be flex for Electron height propagation
        tab.webviewElement.style.display = 'flex';
        tab.webviewElement.style.width = '100%';
        tab.webviewElement.style.height = '100%';

        const tabElement = this.tabsContainer.querySelector(`[data-tab-id="${tabId}"]`);
        tabElement?.classList.add('active');

        // Update URL bar
        this.urlInput.value = tab.url || '';

        // Update navigation buttons
        updateNavButtons();

        console.log('[TabManager] Switched to tab:', tabId);
    }

    /**
     * Close a tab
     */
    closeTab(tabId: string): void {
        const tab = this.tabs.get(tabId);
        if (!tab) return;

        // Don't close if it's the last tab
        if (this.tabs.size === 1) {
            console.log('[TabManager] Cannot close last tab');
            return;
        }

        // Remove webview
        tab.webviewElement.remove();

        // Remove tab element
        const tabElement = this.tabsContainer.querySelector(`[data-tab-id="${tabId}"]`);
        tabElement?.remove();

        // Remove from map
        this.tabs.delete(tabId);

        // If closing active tab, switch to another tab
        if (this.activeTabId === tabId) {
            const remainingTabs = Array.from(this.tabs.keys());
            if (remainingTabs.length > 0) {
                this.switchTab(remainingTabs[0]);
            }
        }

        console.log('[TabManager] Closed tab:', tabId);
    }

    /**
     * Navigate active tab to URL (from address bar)
     */
    async navigateActiveTab(url: string): Promise<void> {
        if (!this.activeTabId) return;
        await this.analyzeAndNavigate(this.activeTabId, url, 'address-bar');
    }

    /**
     * Analyze URL and navigate if safe (shared logic for address bar and link clicks)
     */
    async analyzeAndNavigate(tabId: string, url: string, source: 'address-bar' | 'link-click'): Promise<void> {
        const tab = this.tabs.get(tabId);
        if (!tab) return;

        // Update tab state
        tab.url = url;
        tab.isLoading = true;
        tab.title = source === 'link-click' ? 'Scanning link...' : 'Loading...';
        tab.securityStatus = 'unknown';
        this.updateTabUI(tab.id);

        try {
            // Run threat analysis first (fast from cache)
            const result = await window.electronAPI.analyzeUrl(url) as any;

            if (result.success && result.assessment && result.decision) {
                // Update tab security status
                if (result.decision.action === 'allow') {
                    tab.securityStatus = 'safe';
                } else if (result.decision.action === 'warn') {
                    tab.securityStatus = 'warning';
                } else {
                    tab.securityStatus = 'danger';
                }

                // Check if domain is acknowledged (for blocked/warned sites)
                const isBlocked = result.decision.action === 'block';
                const isWarning = result.decision.action === 'warn';
                
                if (isBlocked || isWarning) {
                    const ackResult = await window.electronAPI.checkDomainAcknowledged(url) as { acknowledged: boolean };
                    if (ackResult.acknowledged) {
                        console.log('[TabManager] Domain already acknowledged, loading directly');
                        // Skip warning UI, load directly
                        this.loadUrlInTab(tab.id, url);
                        return;
                    }
                }

                // Show scan panel only if we need to show results
                showScanPanel(true);
                updateScanStatus('analyzing', url);

                // Update scan title to indicate source
                const scanTitleEl = document.getElementById('scan-title') as HTMLHeadingElement;
                if (source === 'link-click') {
                    scanTitleEl.textContent = 'Scanning Link...';
                }

                await displayScanResults(result.assessment, result.decision, url, tab);
            } else {
                showScanPanel(true);
                updateScanStatus('error', url);
                setTimeout(() => this.loadUrlInTab(tab.id, url), 1000);
            }
        } catch (error) {
            console.error('[TabManager] Navigation error:', error);
            showScanPanel(true);
            updateScanStatus('error', url);
        }
    }

    /**
     * Load URL in tab's webview
     */
    loadUrlInTab(tabId: string, url: string): void {
        const tab = this.tabs.get(tabId);
        if (!tab) return;

        // Hide panels, show webview
        welcomePanel.style.display = 'none';
        scanPanel.style.display = 'none';
        webviewContainer.style.display = 'flex';
        browserContent.classList.add('webview-active');

        // Update tab
        tab.url = url;
        tab.webviewElement.src = url;
        tab.isLoading = true;
        this.updateTabUI(tabId);

        console.log('[TabManager] Loading URL in tab:', tabId, url);
    }

    /**
     * Get active tab
     */
    getActiveTab(): Tab | null {
        return this.activeTabId ? this.tabs.get(this.activeTabId) || null : null;
    }

    /**
     * Get active webview
     */
    getActiveWebview(): Electron.WebviewTag | null {
        const tab = this.getActiveTab();
        return tab ? tab.webviewElement : null;
    }

    /**
     * Update active tab title
     */
    updateActiveTabTitle(title: string): void {
        const tab = this.getActiveTab();
        if (tab) {
            tab.title = title || tab.url || 'Untitled';
            this.updateTabUI(tab.id);
        }
    }

    /**
     * Setup webview event listeners for a tab
     */
    private setupWebviewListeners(tab: Tab): void {
        const webview = tab.webviewElement;

        // Intercept link clicks and form submissions BEFORE navigation
        webview.addEventListener('will-navigate', async (event: any) => {
            const targetUrl = event.url;
            const currentUrl = tab.url;

            console.log('[TabManager] will-navigate event:', targetUrl, 'from:', currentUrl);

            // Only skip scanning for same-page anchor links (#section)
            // SECURITY: Do NOT skip same-domain - each page must be scanned
            // (compromised pages, user content, different paths can be malicious)
            if (currentUrl && targetUrl.startsWith(currentUrl.split('#')[0] + '#')) {
                console.log('[TabManager] Same-page anchor - skipping scan');
                return;
            }

            // Prevent the navigation until we analyze
            event.preventDefault();
            
            // Run security analysis for ALL link clicks (including same-domain)
            // Cache will handle fast repeated visits to same URL
            await this.analyzeAndNavigate(tab.id, targetUrl, 'link-click');
        });

        // Page title updated
        webview.addEventListener('page-title-updated', (event: any) => {
            if (this.activeTabId === tab.id) {
                tab.title = event.title || tab.url || 'Untitled';
                this.updateTabUI(tab.id);
            }
        });

        // Navigation events
        webview.addEventListener('did-navigate', (event: any) => {
            if (this.activeTabId === tab.id) {
                tab.url = event.url;
                this.urlInput.value = event.url;
                updateNavButtons();
            }
        });

        webview.addEventListener('did-navigate-in-page', (event: any) => {
            if (this.activeTabId === tab.id) {
                tab.url = event.url;
                this.urlInput.value = event.url;
                updateNavButtons();
            }
        });

        // Loading finished
        webview.addEventListener('did-finish-load', () => {
            tab.isLoading = false;
            this.updateTabUI(tab.id);
            if (this.activeTabId === tab.id) {
                updateNavButtons();
            }
        });

        webview.addEventListener('dom-ready', () => {
            const guardScript = `
                (() => {
                    const sendBlocked = (text, reason) => {
                        window.postMessage({ type: 'clipboard-blocked', text, reason }, '*');
                    };

                    const isCryptoAddress = (text) => {
                        const trimmed = String(text || '').trim();
                        if (!trimmed) return false;
                        const patterns = [
                            /\\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\\b/,
                            /\\bbc1[ac-hj-np-z02-9]{11,71}\\b/i,
                            /\\b0x[a-fA-F0-9]{40}\\b/,
                            /\\b[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}\\b/,
                            /\\bD{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}\\b/,
                            /\\bX[1-9A-HJ-NP-Za-km-z]{33}\\b/,
                            /\\br[0-9a-zA-Z]{24,34}\\b/
                        ];
                        return patterns.some((re) => re.test(trimmed));
                    };

                    const COPY_GESTURE_WINDOW_MS = 1000;
                    let lastUserCopyAt = 0;

                    const recordUserCopyShortcut = (event) => {
                        const key = String(event?.key || '').toLowerCase();
                        const code = String(event?.code || '');
                        const isCopyKey = key === 'c' || code === 'KeyC';
                        if ((event.ctrlKey || event.metaKey) && isCopyKey) {
                            lastUserCopyAt = Date.now();
                        }
                    };

                    document.addEventListener('keydown', recordUserCopyShortcut, true);

                    const hasRecentUserCopy = () => Date.now() - lastUserCopyAt <= COPY_GESTURE_WINDOW_MS;

                    const getBlockReason = (text, requireUserGesture) => {
                        if (isCryptoAddress(text)) return 'crypto-address';
                        if (requireUserGesture && !hasRecentUserCopy()) return 'user-gesture-required';
                        return null;
                    };

                    const originalWriteText = navigator.clipboard?.writeText?.bind(navigator.clipboard);
                    const originalWrite = navigator.clipboard?.write?.bind(navigator.clipboard);
                    if (originalWriteText) {
                        navigator.clipboard.writeText = async (text) => {
                            const reason = getBlockReason(text, true);
                            if (reason) {
                                sendBlocked(text, reason);
                                throw new DOMException('Clipboard write blocked', 'NotAllowedError');
                            }
                            return originalWriteText(text);
                        };
                    }
                    if (originalWrite) {
                        navigator.clipboard.write = async (items) => {
                            const gestureReason = getBlockReason('', true);
                            if (gestureReason) {
                                sendBlocked('', gestureReason);
                                throw new DOMException('Clipboard write blocked', 'NotAllowedError');
                            }
                            try {
                                for (const item of items || []) {
                                    for (const type of item.types || []) {
                                        if (type === 'text/plain') {
                                            const blob = await item.getType(type);
                                            const text = await blob.text();
                                            const reason = getBlockReason(text, false);
                                            if (reason) {
                                                sendBlocked(text, reason);
                                                throw new DOMException('Clipboard write blocked', 'NotAllowedError');
                                            }
                                        }
                                    }
                                }
                            } catch (error) {
                                if (error instanceof DOMException) {
                                    throw error;
                                }
                            }
                            return originalWrite(items);
                        };
                    }

                    const originalExec = document.execCommand?.bind(document);
                    if (originalExec) {
                        document.execCommand = (commandId, showUI, value) => {
                            if (String(commandId).toLowerCase() === 'copy') {
                                const selectedText = window.getSelection()?.toString() || '';
                                const reason = getBlockReason(selectedText, true);
                                if (reason) {
                                    sendBlocked(selectedText, reason);
                                    return false;
                                }
                            }
                            return originalExec(commandId, showUI, value);
                        };
                    }
                })();
            `;
            webview.executeJavaScript(guardScript).catch((error) => {
                console.warn('[UI] Clipboard guard injection failed:', error);
            });
        });

        // Loading failed
        webview.addEventListener('did-fail-load', (event: any) => {
            if (event.errorCode && event.errorCode !== -3) {
                console.warn(`[TabManager] Tab ${tab.id} load failed:`, event.errorDescription);
            }
            tab.isLoading = false;
            this.updateTabUI(tab.id);
        });

        // Started loading
        webview.addEventListener('did-start-loading', () => {
            tab.isLoading = true;
            this.updateTabUI(tab.id);
        });

        // Stopped loading
        webview.addEventListener('did-stop-loading', () => {
            tab.isLoading = false;
            this.updateTabUI(tab.id);
        });

        // Handle new window requests (target="_blank" links)
        webview.addEventListener('new-window', (event: any) => {
            const url = event.url;
            console.log('[TabManager] New window requested:', url);

            // Create a new tab and run security analysis before navigating
            const newTab = this.createTab(null, true);
            void this.analyzeAndNavigate(newTab.id, url, 'link-click');

            // Prevent the default behavior (which would try to open a new electron window)
            event.preventDefault();
        });
    }

    /**
     * Get number of tabs
     */
    getTabCount(): number {
        return this.tabs.size;
    }
}

// Get DOM elements
// DOM Elements - Input & Status
const urlInput = document.getElementById('url-input') as HTMLInputElement;
const goBtn = document.getElementById('go-btn') as HTMLButtonElement;
const statusIndicator = document.getElementById('status') as HTMLDivElement;

// DOM Elements - Tabs
const tabBar = document.getElementById('tab-bar') as HTMLDivElement;
const tabsContainer = document.getElementById('tabs-container') as HTMLDivElement;
const newTabBtn = document.getElementById('new-tab-btn') as HTMLButtonElement;

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
const webviewsContainer = document.getElementById('webviews-container') as HTMLDivElement;
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

// Initialize TabManager
const tabManager = new TabManager(tabsContainer, webviewsContainer, urlInput);

// Track current URL for navigation (kept for compatibility)
let currentUrl: string | null = null;

// Track current download for user decision
let currentDownloadId: string | null = null;

// Create initial tab
tabManager.createTab(null, true);

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

    console.log('[UI] Navigating to:', fullUrl);

    // Use TabManager to navigate
    await tabManager.navigateActiveTab(fullUrl);
}

/**
 * Load URL in the webview (legacy function - now uses TabManager)
 */
function loadUrlInWebview(url: string): void {
    const activeTab = tabManager.getActiveTab();
    if (activeTab) {
        tabManager.loadUrlInTab(activeTab.id, url);
        currentUrl = url;
    }
}

/**
 * Show/Hide Scan Panel
 */
function showScanPanel(show: boolean): void {
    // Hide webview when showing scan panel
    webviewContainer.style.display = 'none';
    browserContent.classList.remove('webview-active');
    proceedBtn.disabled = false;
    proceedBtn.style.display = 'none';
    const existingRecheck = document.getElementById('recheck-btn');
    if (existingRecheck) {
        existingRecheck.remove();
    }

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
    const webview = tabManager.getActiveWebview();
    const activeTab = tabManager.getActiveTab();

    // Wrap in try-catch because webview may not be ready (dom-ready not fired yet)
    let canGoBack = false;
    let canGoForward = false;

    try {
        if (webview && typeof webview.canGoBack === 'function') {
            canGoBack = webview.canGoBack();
        }
        if (webview && typeof webview.canGoForward === 'function') {
            canGoForward = webview.canGoForward();
        }
    } catch (e) {
        // Webview not ready yet, buttons stay disabled
        console.log('[UI] Webview not ready for navigation check');
    }

    const hasUrl = activeTab?.url !== null && activeTab?.url !== '';

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
async function displayScanResults(assessment: any, decision: any, url: string, tab: Tab): Promise<void> {
    const isSafe = decision.action === 'allow';
    const isWarning = decision.action === 'warn';
    const isBlock = decision.action === 'block';
    const existingRecheck = document.getElementById('recheck-btn');
    if (existingRecheck) {
        existingRecheck.remove();
    }
    proceedBtn.disabled = false;

    // Check if result is from cache or local rules (not fresh AI analysis)
    const isFromCache = assessment.fromCache === true;
    const isLocalRulesOnly = assessment.analysisMethod === 'local_rule' || assessment.analysisMethod === 'offline';
    const canRecheck = isFromCache || isLocalRulesOnly;

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
        proceedBtn.onclick = () => {
            // Mark domain as acknowledged for warning-level threats
            window.electronAPI.markDomainAcknowledged(url).then(() => {
                console.log('[UI] Domain marked as acknowledged (warning)');
            }).catch(error => {
                console.error('[UI] Error marking acknowledgment:', error);
            });
            loadUrlInWebview(url);
        };
    } else {
        scanTitle.textContent = 'Malicious Site';
        scanBadge.className = 'scan-badge badge-danger';
        scanBadge.textContent = 'Blocked';
        scanScore.querySelector('.score-circle')!.className = 'score-circle score-danger';
        
        console.log('[UI] Setting up Proceed with Caution button');
        
        // Add "Proceed with Caution" button for blocked sites
        proceedBtn.style.display = 'block';
        proceedBtn.textContent = '⚠️ Proceed with Caution';
        proceedBtn.className = 'btn-primary btn-danger';
        proceedBtn.onclick = async () => {
            console.log('[UI] Proceed with Caution button clicked');
            // Show safety guidelines before proceeding
            await showSafetyGuidelines(url, assessment, tab);
        };
    }

    // Update Details - show analysis method with cache indicator
    threatTypeEl.textContent = assessment.threatType || 'Safe';
    let methodText = 'AI (Deep Scan)';
    if (isFromCache) {
        methodText = '⚡ From Cache';
    } else if (isLocalRulesOnly) {
        methodText = 'Local Rules';
    } else if (assessment.analysisMethod === 'ai' || assessment.analysisMethod === 'ai_analysis') {
        methodText = '🤖 AI Analysis';
    }
    analysisMethodEl.textContent = methodText;

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

    // Add "Re-check with AI" button if result is from cache or local rules
    if (canRecheck) {
        // Remove existing recheck button if any
        const existingRecheck = document.getElementById('recheck-btn');
        if (existingRecheck) existingRecheck.remove();

        const recheckBtn = document.createElement('button');
        recheckBtn.id = 'recheck-btn';
        recheckBtn.className = 'btn-secondary';
        recheckBtn.textContent = '🔄 Re-check with AI';
        recheckBtn.style.marginLeft = '10px';
        recheckBtn.onclick = async () => {
            recheckBtn.disabled = true;
            recheckBtn.textContent = '⏳ Analyzing...';

            try {
                const result = await window.electronAPI.forceRefresh(url) as any;
                if (result.success && result.assessment && result.decision) {
                    await displayScanResults(result.assessment, result.decision, url, tab);
                } else {
                    recheckBtn.textContent = '❌ Failed - Try Again';
                    recheckBtn.disabled = false;
                }
            } catch (error) {
                console.error('[UI] Recheck failed:', error);
                recheckBtn.textContent = '❌ Failed - Try Again';
                recheckBtn.disabled = false;
            }
        };

        // Add button next to the proceed button
        proceedBtn.parentElement?.appendChild(recheckBtn);

        // Also add a note about cached result
        const cacheNote = document.createElement('div');
        cacheNote.className = 'indicator-item severity-info cache-note';
        cacheNote.innerHTML = isFromCache
            ? '💡 <em>Result from cache. Click "Re-check with AI" for fresh analysis.</em>'
            : '💡 <em>Analyzed with local rules. Click "Re-check with AI" for deeper AI analysis.</em>';
        indicatorsList.appendChild(cacheNote);
    }
}

/**
 * Show AI-generated safety guidelines for proceeding to a flagged site
 */
async function showSafetyGuidelines(url: string, assessment: any, tab: Tab): Promise<void> {
    try {
        // Disable button and show loading
        proceedBtn.disabled = true;
        proceedBtn.textContent = '⏳ Generating Guidelines...';

        // Get safety guidelines from AI
        const result = await window.electronAPI.getSafetyGuidelines(url, assessment) as any;

        if (!result.success || !result.guidelines) {
            throw new Error('Failed to generate guidelines');
        }

        const guidelines = result.guidelines;

        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1e1e1e;
            border: 2px solid #dc3545;
            border-radius: 8px;
            max-width: 700px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 30px;
            color: #e0e0e0;
        `;

        // Build modal HTML
        let html = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #dc3545; margin: 0 0 10px 0;">⚠️ Safety Guidelines</h2>
                <div style="font-size: 12px; color: #999;">You are about to visit a flagged site at your own risk</div>
                <div style="margin-top: 10px; padding: 10px; background: #2a2a2a; border-radius: 4px; font-size: 13px; word-break: break-all;">
                    ${url}
                </div>
            </div>

            <div style="background: #2a2a2a; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; color: #ffc107; font-size: 16px;">📋 Summary</h3>
                <p style="margin: 0; line-height: 1.6;">${guidelines.summary}</p>
            </div>

            <div style="background: #2a2a2a; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; color: #dc3545; font-size: 16px;">🚫 DO NOT:</h3>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                    ${guidelines.doNots.map((item: string) => `<li>${item}</li>`).join('')}
                </ul>
            </div>

            <div style="background: #2a2a2a; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; color: #ff9800; font-size: 16px;">⚠️ Warnings:</h3>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                    ${guidelines.warnings.map((item: string) => `<li>${item}</li>`).join('')}
                </ul>
            </div>

            <div style="background: #2a2a2a; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 12px 0; color: #17a2b8; font-size: 16px;">🔧 Technical Advice:</h3>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                    ${guidelines.technicalAdvice.map((item: string) => `<li>${item}</li>`).join('')}
                </ul>
            </div>

            <div style="text-align: center; padding: 15px; background: #2a2a2a; border-radius: 6px; margin-bottom: 25px;">
                <div style="font-size: 14px; color: #999; margin-bottom: 5px;">Risk Level</div>
                <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${guidelines.riskLevel.toUpperCase()}</div>
            </div>

            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="cancel-proceed" style="
                    padding: 12px 30px;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                ">Cancel</button>
                <button id="confirm-proceed" style="
                    padding: 12px 30px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                ">I Understand, Proceed</button>
            </div>

            <div style="margin-top: 20px; text-align: center; font-size: 11px; color: #666;">
                🤖 Guidelines ${result.fromCache ? 'from cache' : 'generated by AI'} • Visit at your own risk
            </div>
        `;

        modalContent.innerHTML = html;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Button handlers
        const cancelBtn = document.getElementById('cancel-proceed')!;
        const confirmBtn = document.getElementById('confirm-proceed')!;

        cancelBtn.onclick = () => {
            document.body.removeChild(modal);
            proceedBtn.disabled = false;
            proceedBtn.textContent = '⚠️ Proceed with Caution';
        };

        confirmBtn.onclick = () => {
            document.body.removeChild(modal);
            // Mark domain as acknowledged for this session
            window.electronAPI.markDomainAcknowledged(url).then(() => {
                console.log('[UI] Domain marked as acknowledged');
            }).catch(error => {
                console.error('[UI] Error marking acknowledgment:', error);
            });
            showScanPanel(false);
            loadUrlInWebview(url);
        };

    } catch (error) {
        console.error('[UI] Failed to show safety guidelines:', error);
        
        // Fallback: just proceed with simple confirmation
        const confirmed = confirm(
            `⚠️ WARNING: This site has been flagged as malicious.\n\n` +
            `Threats detected: ${assessment.threatType || 'Multiple threats'}\n\n` +
            `Proceed at your own risk?`
        );
        
        if (confirmed) {
            showScanPanel(false);
            loadUrlInWebview(url);
        }
        
        proceedBtn.disabled = false;
        proceedBtn.textContent = '⚠️ Proceed with Caution';
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

// New Tab button
newTabBtn.addEventListener('click', () => {
    console.log('[UI] New tab button clicked');
    tabManager.createTab(null, true);
    // Show welcome panel
    welcomePanel.style.display = 'block';
    scanPanel.style.display = 'none';
    webviewContainer.style.display = 'none';
    browserContent.classList.remove('webview-active');
});

// Navigation button event listeners - use active webview
backBtn.addEventListener('click', () => {
    console.log('[UI] Back button clicked');
    const webview = tabManager.getActiveWebview();
    if (webview && webview.canGoBack()) {
        webview.goBack();
    }
});

forwardBtn.addEventListener('click', () => {
    console.log('[UI] Forward button clicked');
    const webview = tabManager.getActiveWebview();
    if (webview && webview.canGoForward()) {
        webview.goForward();
    }
});

refreshBtn.addEventListener('click', () => {
    console.log('[UI] Refresh button clicked');
    const webview = tabManager.getActiveWebview();
    if (webview) {
        webview.reload();
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
    window.electronAPI.onDownloadAnalyzed(async (data) => {
        console.log('[UI] Received download analysis:', data);

        // Auto-approve safe downloads (score < 20) - actually proceed with download
        if (data.analysis.riskLevel === 'safe' && data.analysis.riskScore < 20) {
            console.log('[UI] Auto-approved safe download, proceeding automatically');
            showDownloadNotification(data.info.fileName, 'Download approved - starting...', 'success');

            // Actually proceed with the download
            try {
                await window.electronAPI.proceedDownload(data.downloadId);
                console.log('[UI] Auto-download started:', data.downloadId);
            } catch (error) {
                console.error('[UI] Auto-download failed:', error);
                showDownloadNotification(data.info.fileName, 'Download failed', 'error');
            }
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

// ============================================
// Handle target="_blank" links (open in new tab)
// ============================================
if (window.electronAPI && window.electronAPI.onOpenUrlInNewTab) {
    window.electronAPI.onOpenUrlInNewTab((url) => {
        console.log('[UI] Opening URL in new tab:', url);
        const newTab = tabManager.createTab(null, true);
        void tabManager.analyzeAndNavigate(newTab.id, url, 'link-click');
    });
    console.log('[UI] New tab URL listener registered');
}

window.addEventListener('message', (event) => {
    if (event?.data?.type === 'clipboard-blocked') {
        const text = String(event.data.text || '');
        const reason = String(event.data.reason || '');
        let message = 'Blocked suspicious clipboard change';
        if (reason === 'user-gesture-required') {
            message = 'Clipboard copy blocked. Use Ctrl/Cmd+C to copy.';
        } else if (text) {
            const display = text.length > 10 ? `${text.slice(0, 6)}...${text.slice(-4)}` : text;
            message = `Blocked suspicious clipboard change (${display})`;
        }
        showDownloadNotification('Clipboard Blocked', message, 'error');
        console.warn('[UI] Clipboard write blocked:', event.data.reason, text);
    }
});

console.log('[UI] Browser UI initialized');
