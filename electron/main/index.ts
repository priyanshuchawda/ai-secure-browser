/**
 * Electron Main Process Entry Point
 * Security core that handles request interception and threat detection
 */

// Load environment variables FIRST
import 'dotenv/config';

import { app, BrowserWindow, session, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { getThreatAnalysisEngine } from './threat-analysis/engine';
import { getDecisionEngine } from './decision-engine/decision-engine';
import {
    setupDownloadInterception,
    proceedWithDownload,
    cancelDownload,
    setDownloadCallbacks,
    type DownloadInfo,
    type DownloadAnalysis
} from './download-protection';

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep a global reference to prevent garbage collection
let mainWindow: BrowserWindow | null = null;

// Vite dev server URL (during development)
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

// IPC Channels (must match preload script)
const IPC_CHANNELS = {
    ANALYZE_REQUEST: 'threat:analyze',
    ANALYSIS_RESULT: 'threat:result',
    USER_OVERRIDE: 'threat:override',
    REPORT_FALSE_POSITIVE: 'threat:report-fp',
    GET_STATUS: 'app:status',
    NAVIGATE: 'browser:navigate',
    NAV_BACK: 'browser:back',
    NAV_FORWARD: 'browser:forward',
    NAV_REFRESH: 'browser:refresh',
    NAV_HOME: 'browser:home',
    GET_NAV_STATE: 'browser:get-nav-state',
    // Download protection channels
    DOWNLOAD_ANALYZED: 'download:analyzed',
    DOWNLOAD_PROCEED: 'download:proceed',
    DOWNLOAD_CANCEL: 'download:cancel'
};

// ============================================
// Navigation History Manager (Doubly Linked List)
// ============================================
interface HistoryNode {
    url: string;
    prev: HistoryNode | null;
    next: HistoryNode | null;
}

class NavigationHistory {
    private current: HistoryNode | null = null;
    private homeUrl: string;

    constructor(homeUrl: string = '') {
        this.homeUrl = homeUrl;
    }

    /**
     * Navigate to a new URL (adds to history)
     */
    navigate(url: string): void {
        const newNode: HistoryNode = {
            url,
            prev: this.current,
            next: null
        };

        if (this.current) {
            // Clear forward history when navigating to new page
            this.current.next = newNode;
        }

        this.current = newNode;
    }

    /**
     * Go back in history
     */
    goBack(): string | null {
        if (this.current?.prev) {
            this.current = this.current.prev;
            return this.current.url;
        }
        return null;
    }

    /**
     * Go forward in history
     */
    goForward(): string | null {
        if (this.current?.next) {
            this.current = this.current.next;
            return this.current.url;
        }
        return null;
    }

    /**
     * Check if can go back
     */
    canGoBack(): boolean {
        return this.current?.prev !== null && this.current?.prev !== undefined;
    }

    /**
     * Check if can go forward
     */
    canGoForward(): boolean {
        return this.current?.next !== null && this.current?.next !== undefined;
    }

    /**
     * Get current URL
     */
    getCurrentUrl(): string | null {
        return this.current?.url || null;
    }

    /**
     * Get home URL
     */
    getHomeUrl(): string {
        return this.homeUrl;
    }

    /**
     * Clear history and go home
     */
    goHome(): void {
        this.current = null;
    }

    /**
     * Get navigation state
     */
    getState(): { canGoBack: boolean; canGoForward: boolean; currentUrl: string | null } {
        return {
            canGoBack: this.canGoBack(),
            canGoForward: this.canGoForward(),
            currentUrl: this.getCurrentUrl()
        };
    }
}

// Navigation history instance
const navHistory = new NavigationHistory();

// Initialize engines
const threatEngine = getThreatAnalysisEngine();
const decisionEngine = getDecisionEngine();

/**
 * Create the main browser window
 */
function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.cjs'),
            // Security settings per Constitution Principle I
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false, // Needed for webview
            webviewTag: true // Enable webview tag for embedding websites
        },
        title: 'AI Secure Browser'
    });

    // Load the app
    if (VITE_DEV_SERVER_URL) {
        // Development mode - load from Vite dev server
        mainWindow.loadURL(VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    } else {
        // Production mode - load from built files
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }

    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Setup request interception (FR-001)
    setupRequestInterception();
}

/**
 * Setup web request interception for threat detection
 * This is the earliest point we can intercept navigation (research.md Decision 1)
 */
function setupRequestInterception(): void {
    const filter = { urls: ['http://*/*', 'https://*/*'] };

    session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
        // Log intercepted request (for development)
        console.log('[Interceptor] Request:', details.url);

        // For now, allow all requests - analysis is done via IPC from renderer
        // Full integration: analyze here and block synchronously
        callback({ cancel: false });
    });

    console.log('[Main] Request interception enabled');
}

/**
 * Setup download protection
 */
function setupDownloadProtection(): void {
    const downloadCallback = (downloadId: string, info: DownloadInfo, analysis: DownloadAnalysis) => {
        console.log('[Main] Download analyzed:', downloadId, analysis.riskLevel);

        // Send to renderer for user decision
        if (mainWindow) {
            mainWindow.webContents.send(IPC_CHANNELS.DOWNLOAD_ANALYZED, {
                downloadId,
                info,
                analysis
            });
        }
    };

    // Setup progress, completion, and scanning callbacks
    setDownloadCallbacks(
        // Progress callback
        (downloadId: string, progress: number, received: number, total: number) => {
            if (mainWindow) {
                mainWindow.webContents.send('download:progress', {
                    downloadId,
                    progress,
                    received,
                    total
                });
            }
        },
        // Completion callback
        (downloadId: string, info: DownloadInfo, savePath: string, success: boolean) => {
            console.log('[Main] Download complete:', downloadId, success ? 'SUCCESS' : 'FAILED');
            if (mainWindow) {
                mainWindow.webContents.send('download:complete', {
                    downloadId,
                    info,
                    savePath,
                    success
                });
            }
        },
        // Scanning callback
        (downloadId: string, info: DownloadInfo) => {
            console.log('[Main] Download scanning started:', downloadId, info.fileName);
            if (mainWindow) {
                mainWindow.webContents.send('download:scanning', {
                    downloadId,
                    info
                });
            }
        }
    );

    // Intercept downloads from the main window's default session
    setupDownloadInterception(
        session.defaultSession,
        mainWindow,
        downloadCallback
    );

    // Also intercept downloads from the webview's partition session
    const webviewSession = session.fromPartition('persist:main');
    setupDownloadInterception(
        webviewSession,
        mainWindow,
        downloadCallback
    );

    console.log('[Main] Download protection enabled for default and webview sessions');
}

/**
 * Setup IPC handlers for renderer communication
 */
function setupIpcHandlers(): void {
    // Handle threat analysis requests from renderer
    ipcMain.handle(IPC_CHANNELS.ANALYZE_REQUEST, async (_event, { url }) => {
        console.log('[IPC] Analyze request:', url);

        try {
            // Run threat analysis
            const assessment = await threatEngine.analyze({
                url,
                requestId: `req-${Date.now()}`
            });

            // Make security decision
            const decision = decisionEngine.decide(assessment);

            console.log('[IPC] Result:', {
                threatType: assessment.threatType,
                confidence: assessment.confidence,
                action: decision.action
            });

            return {
                success: true,
                assessment: {
                    threatType: assessment.threatType,
                    confidence: assessment.confidence,
                    indicators: assessment.indicators.map(i => ({
                        type: i.type,
                        description: i.description,
                        severity: i.severity
                    }))
                },
                decision: {
                    action: decision.action,
                    rationale: decision.rationale,
                    riskLevel: decision.riskLevel,
                    overridable: decision.overridable
                }
            };
        } catch (error) {
            console.error('[IPC] Analysis error:', error);
            return {
                success: false,
                error: String(error)
            };
        }
    });

    // Handle user override
    ipcMain.handle(IPC_CHANNELS.USER_OVERRIDE, async (_event, { requestId, reason }) => {
        console.log('[IPC] User override:', { requestId, reason });
        // TODO: Log override and proceed with navigation
        return { success: true };
    });

    // Handle false positive reports
    ipcMain.handle(IPC_CHANNELS.REPORT_FALSE_POSITIVE, async (_event, data) => {
        console.log('[IPC] False positive report:', data);
        // TODO: Store false positive report
        return { success: true };
    });

    // Handle app status request
    ipcMain.handle(IPC_CHANNELS.GET_STATUS, async () => {
        const stats = threatEngine.getStats();
        return {
            online: true,
            cacheSize: stats.size,
            cacheHitRate: stats.hitRate
        };
    });

    // Handle navigation requests
    ipcMain.on(IPC_CHANNELS.NAVIGATE, (_event, { url }) => {
        console.log('[IPC] Navigate to:', url);
        if (mainWindow) {
            navHistory.navigate(url);
            mainWindow.loadURL(url);
            // Send updated nav state
            mainWindow.webContents.send('browser:nav-state-changed', navHistory.getState());
        }
    });

    // Handle back navigation
    ipcMain.on(IPC_CHANNELS.NAV_BACK, () => {
        const url = navHistory.goBack();
        console.log('[IPC] Navigate back to:', url);
        if (url && mainWindow) {
            mainWindow.loadURL(url);
            mainWindow.webContents.send('browser:nav-state-changed', navHistory.getState());
        }
    });

    // Handle forward navigation
    ipcMain.on(IPC_CHANNELS.NAV_FORWARD, () => {
        const url = navHistory.goForward();
        console.log('[IPC] Navigate forward to:', url);
        if (url && mainWindow) {
            mainWindow.loadURL(url);
            mainWindow.webContents.send('browser:nav-state-changed', navHistory.getState());
        }
    });

    // Handle refresh
    ipcMain.on(IPC_CHANNELS.NAV_REFRESH, () => {
        const url = navHistory.getCurrentUrl();
        console.log('[IPC] Refresh:', url);
        if (url && mainWindow) {
            mainWindow.loadURL(url);
        }
    });

    // Handle home navigation
    ipcMain.on(IPC_CHANNELS.NAV_HOME, () => {
        console.log('[IPC] Navigate home');
        if (mainWindow) {
            navHistory.goHome();
            // Reload the app's home page
            if (VITE_DEV_SERVER_URL) {
                mainWindow.loadURL(VITE_DEV_SERVER_URL);
            } else {
                mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
            }
            mainWindow.webContents.send('browser:nav-state-changed', navHistory.getState());
        }
    });

    // Handle get navigation state
    ipcMain.handle(IPC_CHANNELS.GET_NAV_STATE, () => {
        return navHistory.getState();
    });

    // Handle download proceed decision
    ipcMain.handle(IPC_CHANNELS.DOWNLOAD_PROCEED, async (_event, { downloadId }) => {
        console.log('[IPC] Download proceed:', downloadId);
        const success = proceedWithDownload(downloadId);
        return { success };
    });

    // Handle download cancel decision
    ipcMain.handle(IPC_CHANNELS.DOWNLOAD_CANCEL, async (_event, { downloadId }) => {
        console.log('[IPC] Download cancel:', downloadId);
        const success = cancelDownload(downloadId);
        return { success };
    });

    console.log('[Main] IPC handlers registered');
}

// ============================================
// App Lifecycle
// ============================================

// Wait for Electron to be ready
app.whenReady().then(() => {
    // Setup IPC handlers before creating window
    setupIpcHandlers();
    createWindow();

    // Setup download protection after window is created
    setupDownloadProtection();

    // On macOS, re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
    contents.setWindowOpenHandler(() => {
        return { action: 'deny' };
    });
});

console.log('[Main] AI Secure Browser starting...');
