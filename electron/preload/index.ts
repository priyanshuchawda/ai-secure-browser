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
     * Force refresh analysis (bypass cache and re-analyze with AI)
     */
    forceRefresh: (url: string): Promise<unknown> => {
        return ipcRenderer.invoke('security:forceRefresh', { url });
    },

    /**
     * Listen for analysis results
     */
    onAnalysisResult: (callback: (result: unknown) => void): void => {
        ipcRenderer.on(IPC_CHANNELS.ANALYSIS_RESULT, (_: unknown, result: unknown) => {
            callback(result);
        });
    },

    /**
     * Navigate back in history
     */
    goBack: (): void => {
        ipcRenderer.send(IPC_CHANNELS.NAV_BACK);
    },

    /**
     * Navigate forward in history
     */
    goForward: (): void => {
        ipcRenderer.send(IPC_CHANNELS.NAV_FORWARD);
    },

    /**
     * Refresh current page
     */
    refresh: (): void => {
        ipcRenderer.send(IPC_CHANNELS.NAV_REFRESH);
    },

    /**
     * Go to home page
     */
    goHome: (): void => {
        ipcRenderer.send(IPC_CHANNELS.NAV_HOME);
    },

    /**
     * Get current navigation state
     */
    getNavState: (): Promise<{ canGoBack: boolean; canGoForward: boolean; currentUrl: string | null }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_NAV_STATE);
    },

    /**
     * Listen for navigation state changes
     */
    onNavStateChange: (callback: (state: { canGoBack: boolean; canGoForward: boolean; currentUrl: string | null }) => void): void => {
        ipcRenderer.on('browser:nav-state-changed', (_: unknown, state: any) => {
            callback(state);
        });
    },

    /**
     * Listen for requests to open URL in new tab (from target="_blank" links)
     */
    onOpenUrlInNewTab: (callback: (url: string) => void): void => {
        ipcRenderer.on('open-url-in-new-tab', (_: unknown, url: string) => {
            callback(url);
        });
    },

    // --- Download Protection ---

    /**
     * Proceed with a download
     */
    proceedDownload: (downloadId: string): Promise<{ success: boolean }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.DOWNLOAD_PROCEED, { downloadId });
    },

    /**
     * Cancel a download
     */
    cancelDownload: (downloadId: string): Promise<{ success: boolean }> => {
        return ipcRenderer.invoke(IPC_CHANNELS.DOWNLOAD_CANCEL, { downloadId });
    },

    /**
     * Listen for download analysis results
     */
    onDownloadAnalyzed: (callback: (data: {
        downloadId: string;
        info: { fileName: string; fileSize: number; mimeType: string; url: string; referrer: string; domain: string };
        analysis: { riskLevel: string; riskScore: number; reasoning: string; sourceReputation: string; recommendations: string[]; shouldBlock: boolean; allowOverride: boolean };
    }) => void): void => {
        ipcRenderer.on(IPC_CHANNELS.DOWNLOAD_ANALYZED, (_: unknown, data: any) => {
            callback(data);
        });
    },

    /**
     * Listen for download progress updates
     */
    onDownloadProgress: (callback: (data: {
        downloadId: string;
        progress: number;
        received: number;
        total: number;
    }) => void): void => {
        ipcRenderer.on('download:progress', (_: unknown, data: any) => {
            callback(data);
        });
    },

    /**
     * Listen for download completion
     */
    onDownloadComplete: (callback: (data: {
        downloadId: string;
        info: { fileName: string; fileSize: number; mimeType: string; url: string; referrer: string; domain: string };
        savePath: string;
        success: boolean;
    }) => void): void => {
        ipcRenderer.on('download:complete', (_: unknown, data: any) => {
            callback(data);
        });
    },

    /**
     * Listen for download scanning started
     */
    onDownloadScanning: (callback: (data: {
        downloadId: string;
        info: { fileName: string; fileSize: number; mimeType: string; url: string; referrer: string; domain: string };
    }) => void): void => {
        ipcRenderer.on('download:scanning', (_: unknown, data: any) => {
            callback(data);
        });
    }
};

// Expose the API to renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

console.log('[Preload] Context bridge initialized');
