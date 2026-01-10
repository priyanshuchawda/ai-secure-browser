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
    NAVIGATE: 'browser:navigate'
};

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
            preload: path.join(__dirname, '../preload/index.js'),
            // Security settings per Constitution Principle I
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
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
            mainWindow.loadURL(url);
        }
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
