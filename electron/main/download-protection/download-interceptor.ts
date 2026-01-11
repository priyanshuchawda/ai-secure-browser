/**
 * Download Interceptor
 * Intercepts downloads and analyzes them before allowing
 */

import { Session, DownloadItem, WebContents, BrowserWindow, app } from 'electron';
import path from 'path';
import { analyzeDownload, type DownloadInfo, type DownloadAnalysis } from './ai-download-analyzer';

// Store for pending downloads awaiting user decision
interface PendingDownload {
    item: DownloadItem;
    info: DownloadInfo;
    analysis: DownloadAnalysis;
    timestamp: number;
}

// Store for active downloads (being downloaded)
interface ActiveDownload {
    id: string;
    item: DownloadItem;
    info: DownloadInfo;
    savePath: string;
}

const pendingDownloads: Map<string, PendingDownload> = new Map();
const activeDownloads: Map<string, ActiveDownload> = new Map();

// Callback types
type DownloadAnalyzedCallback = (downloadId: string, info: DownloadInfo, analysis: DownloadAnalysis) => void;
type DownloadProgressCallback = (downloadId: string, progress: number, received: number, total: number) => void;
type DownloadCompleteCallback = (downloadId: string, info: DownloadInfo, savePath: string, success: boolean) => void;
type DownloadScanningCallback = (downloadId: string, info: DownloadInfo) => void;

let onDownloadProgress: DownloadProgressCallback | null = null;
let onDownloadComplete: DownloadCompleteCallback | null = null;
let onDownloadScanning: DownloadScanningCallback | null = null;

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return 'unknown';
    }
}

/**
 * Generate unique ID for a download
 */
function generateDownloadId(): string {
    return `dl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get default download path (project root/downloads folder)
 */
function getDefaultDownloadPath(fileName: string): string {
    // Use project root directory for downloads
    const projectRoot = app.getAppPath();
    const downloadsDir = path.join(projectRoot, 'downloads');

    // Ensure downloads directory exists
    const fs = require('fs');
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    return path.join(downloadsDir, fileName);
}

/**
 * Setup download progress, completion, and scanning callbacks
 */
export function setDownloadCallbacks(
    progressCallback: DownloadProgressCallback,
    completeCallback: DownloadCompleteCallback,
    scanningCallback?: DownloadScanningCallback
): void {
    onDownloadProgress = progressCallback;
    onDownloadComplete = completeCallback;
    if (scanningCallback) {
        onDownloadScanning = scanningCallback;
    }
}

/**
 * Setup download interception on a session
 */
export function setupDownloadInterception(
    session: Session,
    mainWindow: BrowserWindow | null,
    onDownloadAnalyzed: DownloadAnalyzedCallback
): void {
    console.log('[DownloadInterceptor] Setting up download interception...');

    session.on('will-download', async (event, item: DownloadItem, webContents: WebContents) => {
        const downloadId = generateDownloadId();
        const fileName = item.getFilename();
        const fileSize = item.getTotalBytes();
        const mimeType = item.getMimeType();
        const url = item.getURL();
        const referrer = webContents.getURL();
        const domain = extractDomain(url);

        console.log('[DownloadInterceptor] Download initiated:', {
            downloadId,
            fileName,
            fileSize,
            domain
        });

        // Set default save path (no prompt)
        const savePath = getDefaultDownloadPath(fileName);
        item.setSavePath(savePath);

        // Pause the download while we analyze
        item.pause();

        const downloadInfo: DownloadInfo = {
            fileName,
            fileSize,
            mimeType,
            url,
            referrer,
            domain
        };

        try {
            // Notify UI that scanning is starting
            if (onDownloadScanning) {
                onDownloadScanning(downloadId, downloadInfo);
            }

            // Analyze the download
            console.log('[DownloadInterceptor] Analyzing download...');
            const analysis = await analyzeDownload(downloadInfo);

            console.log('[DownloadInterceptor] Analysis result:', {
                riskLevel: analysis.riskLevel,
                riskScore: analysis.riskScore,
                shouldBlock: analysis.shouldBlock
            });

            // Store pending download
            pendingDownloads.set(downloadId, {
                item,
                info: downloadInfo,
                analysis,
                timestamp: Date.now()
            });

            // If safe, auto-proceed with progress tracking
            if (analysis.riskLevel === 'safe' && analysis.riskScore < 20) {
                console.log('[DownloadInterceptor] Auto-proceeding safe download');
                startDownloadWithProgress(downloadId, item, downloadInfo, savePath);
                pendingDownloads.delete(downloadId);

                // Notify UI of auto-approved download (with progress)
                onDownloadAnalyzed(downloadId, downloadInfo, {
                    ...analysis,
                    reasoning: 'Download approved automatically - safe file from trusted source.'
                });
                return;
            }

            // For risky downloads, notify the UI
            onDownloadAnalyzed(downloadId, downloadInfo, analysis);

            // If should block and no override allowed, cancel immediately
            if (analysis.shouldBlock && !analysis.allowOverride) {
                console.log('[DownloadInterceptor] Blocking dangerous download');
                item.cancel();
                pendingDownloads.delete(downloadId);
            }

        } catch (error) {
            console.error('[DownloadInterceptor] Error during analysis:', error);

            // On error, pause and notify UI with warning
            const fallbackAnalysis: DownloadAnalysis = {
                riskLevel: 'medium',
                riskScore: 50,
                reasoning: 'Unable to analyze download. Proceed with caution.',
                sourceReputation: 'neutral',
                recommendations: ['Scan with antivirus before opening'],
                shouldBlock: false,
                allowOverride: true
            };

            pendingDownloads.set(downloadId, {
                item,
                info: downloadInfo,
                analysis: fallbackAnalysis,
                timestamp: Date.now()
            });

            onDownloadAnalyzed(downloadId, downloadInfo, fallbackAnalysis);
        }
    });

    console.log('[DownloadInterceptor] Download interception enabled');
}

/**
 * Start download with progress tracking
 */
function startDownloadWithProgress(
    downloadId: string,
    item: DownloadItem,
    info: DownloadInfo,
    savePath: string
): void {
    // Store as active download
    activeDownloads.set(downloadId, {
        id: downloadId,
        item,
        info,
        savePath
    });

    // Track progress
    item.on('updated', (event, state) => {
        if (state === 'progressing') {
            const received = item.getReceivedBytes();
            const total = item.getTotalBytes();
            const progress = total > 0 ? Math.round((received / total) * 100) : 0;

            console.log(`[DownloadInterceptor] Progress: ${progress}% (${received}/${total})`);

            if (onDownloadProgress) {
                onDownloadProgress(downloadId, progress, received, total);
            }
        } else if (state === 'interrupted') {
            console.log('[DownloadInterceptor] Download interrupted');
        }
    });

    // Track completion
    item.once('done', (event, state) => {
        activeDownloads.delete(downloadId);

        if (state === 'completed') {
            console.log('[DownloadInterceptor] Download completed:', savePath);
            if (onDownloadComplete) {
                onDownloadComplete(downloadId, info, savePath, true);
            }
        } else {
            console.log('[DownloadInterceptor] Download failed:', state);
            if (onDownloadComplete) {
                onDownloadComplete(downloadId, info, savePath, false);
            }
        }
    });

    // Resume the download
    item.resume();
}

/**
 * User decision to proceed with download
 */
export function proceedWithDownload(downloadId: string): boolean {
    const pending = pendingDownloads.get(downloadId);
    if (!pending) {
        console.warn('[DownloadInterceptor] Download not found:', downloadId);
        return false;
    }

    console.log('[DownloadInterceptor] User proceeding with download:', downloadId);

    try {
        const savePath = getDefaultDownloadPath(pending.info.fileName);
        pending.item.setSavePath(savePath);
        startDownloadWithProgress(downloadId, pending.item, pending.info, savePath);
        pendingDownloads.delete(downloadId);
        return true;
    } catch (error) {
        console.error('[DownloadInterceptor] Error resuming download:', error);
        return false;
    }
}

/**
 * User decision to cancel download
 */
export function cancelDownload(downloadId: string): boolean {
    const pending = pendingDownloads.get(downloadId);
    if (!pending) {
        console.warn('[DownloadInterceptor] Download not found:', downloadId);
        return false;
    }

    console.log('[DownloadInterceptor] User cancelled download:', downloadId);

    try {
        pending.item.cancel();
        pendingDownloads.delete(downloadId);
        return true;
    } catch (error) {
        console.error('[DownloadInterceptor] Error cancelling download:', error);
        return false;
    }
}

/**
 * Get pending download by ID
 */
export function getPendingDownload(downloadId: string): PendingDownload | undefined {
    return pendingDownloads.get(downloadId);
}

/**
 * Get active download by ID
 */
export function getActiveDownload(downloadId: string): ActiveDownload | undefined {
    return activeDownloads.get(downloadId);
}

/**
 * Clean up old pending downloads (older than 5 minutes)
 */
export function cleanupPendingDownloads(): void {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    for (const [id, download] of pendingDownloads.entries()) {
        if (now - download.timestamp > maxAge) {
            console.log('[DownloadInterceptor] Cleaning up stale download:', id);
            try {
                download.item.cancel();
            } catch {
                // Item may already be gone
            }
            pendingDownloads.delete(id);
        }
    }
}

// Cleanup interval
setInterval(cleanupPendingDownloads, 60 * 1000); // Every minute

console.log('[DownloadInterceptor] Module loaded');
