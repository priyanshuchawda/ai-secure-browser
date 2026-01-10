/**
 * Electron Preload Script
 * Creates secure bridge between main and renderer processes
 * Uses contextBridge to expose safe APIs
 */

const { contextBridge, ipcRenderer } = require('electron');

// IPC Channels (inline to avoid module resolution issues in preload)
const IPC_CHANNELS = {
    ANALYZE_REQUEST: 'threat:analyze',
    ANALYSIS_RESULT: 'threat:result',
    USER_OVERRIDE: 'threat:override',
    REPORT_FALSE_POSITIVE: 'threat:report-fp',
    GET_STATUS: 'app:status',
    NAVIGATE: 'browser:navigate'
};

/**
 * API exposed to renderer process via contextBridge
 * This is the ONLY way renderer can communicate with main process
 */
const electronAPI = {
    /**
     * Request threat analysis for a URL
     */
    analyzeUrl: (url: string): Promise<unknown> => {
        return ipcRenderer.invoke(IPC_CHANNELS.ANALYZE_REQUEST, { url });
    },

    /**
     * Submit user override decision
     */
    submitOverride: (requestId: string, reason: string): Promise<void> => {
        return ipcRenderer.invoke(IPC_CHANNELS.USER_OVERRIDE, { requestId, reason });
    },

    /**
     * Report a false positive
     */
    reportFalsePositive: (data: {
        url: string;
        threatType: string;
        justification: string;
    }): Promise<void> => {
        return ipcRenderer.invoke(IPC_CHANNELS.REPORT_FALSE_POSITIVE, data);
    },

    /**
     * Navigate browser to URL
     */
    navigate: (url: string): void => {
        ipcRenderer.send(IPC_CHANNELS.NAVIGATE, { url });
    },

    /**
     * Get application status
     */
    getStatus: (): Promise<{ online: boolean; cacheSize: number }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_STATUS);
    },

    /**
     * Listen for analysis results
     */
    onAnalysisResult: (callback: (result: unknown) => void): void => {
        ipcRenderer.on(IPC_CHANNELS.ANALYSIS_RESULT, (_: unknown, result: unknown) => {
            callback(result);
        });
    }
};

// Expose the API to renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

console.log('[Preload] Context bridge initialized');
