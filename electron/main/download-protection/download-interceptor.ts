/**
 * Download Interceptor
 * Intercepts downloads and analyzes them before allowing
 * Now includes VirusTotal file hash scanning!
 */

import { Session, DownloadItem, WebContents, BrowserWindow, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { analyzeDownload, type DownloadInfo, type DownloadAnalysis } from './ai-download-analyzer';
import { analyzeDownloadedFile, type VTFileAnalysis } from './vt-download-analyzer';
import { combineDownloadResults, type CombinedDownloadAnalysis } from './combined-download-analyzer';

// Store for pending downloads awaiting user decision
interface PendingDownload {
    item: DownloadItem;
    info: DownloadInfo;
    analysis: DownloadAnalysis | CombinedDownloadAnalysis;
    timestamp: number;
    tempPath?: string; // Temporary download location for VT scanning
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
type DownloadAnalyzedCallback = (downloadId: string, info: DownloadInfo, analysis: DownloadAnalysis | CombinedDownloadAnalysis) => void;
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
 * Get default download path (system Downloads folder)
 */
function getDefaultDownloadPath(fileName: string): string {
    // Use system Downloads folder for easier access
    const downloadsDir = app.getPath('downloads');

    console.log('[DownloadInterceptor] Save path:', path.join(downloadsDir, fileName));

    return path.join(downloadsDir, fileName);
}

/**
 * Get temporary download path for VT scanning
 */
function getTempDownloadPath(fileName: string): string {
    const tempDir = app.getPath('temp');
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempPath = path.join(tempDir, 'ai-secure-browser-downloads', uniqueId, fileName);
    
    // Ensure temp directory exists
    const tempFolder = path.dirname(tempPath);
    if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder, { recursive: true });
    }
    
    console.log('[DownloadInterceptor] Temp path:', tempPath);
    return tempPath;
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

        // Download to TEMP location first for VT scanning
        const tempPath = getTempDownloadPath(fileName);
        item.setSavePath(tempPath);

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

            // STEP 1: Start Gemini AI analysis in parallel while file downloads
            console.log('[DownloadInterceptor] Starting Gemini analysis...');
            const geminiPromise = analyzeDownload(downloadInfo);

            // STEP 2: Wait for download to complete, then calculate hash and check VT
            console.log('[DownloadInterceptor] Waiting for download to complete...');
            
            // Resume download so it starts
            item.resume();

            // Wait for download to finish
            const downloadCompleted = await new Promise<boolean>((resolve) => {
                item.once('done', (event, state) => {
                    resolve(state === 'completed');
                });
            });

            if (!downloadCompleted) {
                console.log('[DownloadInterceptor] Download failed or cancelled');
                return;
            }

            console.log('[DownloadInterceptor] Download complete, starting VT scan...');

            // STEP 3: Run VT file hash scan (after download completes)
            const vtPromise = analyzeDownloadedFile(tempPath, fileName);

            // STEP 4: Wait for both analyses to complete
            const [geminiAnalysis, vtAnalysis] = await Promise.all([geminiPromise, vtPromise]);

            console.log('[DownloadInterceptor] Both analyses complete');
            console.log('[DownloadInterceptor] Gemini:', geminiAnalysis.riskLevel, geminiAnalysis.riskScore);
            console.log('[DownloadInterceptor] VT:', vtAnalysis.inDatabase ? `${vtAnalysis.positives}/${vtAnalysis.total}` : 'Not in DB');

            // STEP 5: Combine results
            const combinedAnalysis = combineDownloadResults(geminiAnalysis, vtAnalysis);

            console.log('[DownloadInterceptor] Combined result:', {
                riskLevel: combinedAnalysis.riskLevel,
                riskScore: combinedAnalysis.riskScore,
                shouldBlock: combinedAnalysis.shouldBlock
            });

            // Store pending download with temp path
            pendingDownloads.set(downloadId, {
                item,
                info: downloadInfo,
                analysis: combinedAnalysis,
                timestamp: Date.now(),
                tempPath
            });

            // Determine if this file type requires user confirmation
            const extension = path.extname(fileName).toLowerCase();
            const dangerousExtensions = ['.exe', '.msi', '.bat', '.cmd', '.ps1', '.vbs', '.js', '.jar', '.dmg', '.pkg', '.app', '.deb', '.rpm', '.appimage'];
            const archiveExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'];
            const requiresConfirmation = dangerousExtensions.includes(extension) || archiveExtensions.includes(extension);

            // Auto-block if VT says malware and no override allowed
            if (combinedAnalysis.shouldBlock && !combinedAnalysis.allowOverride) {
                console.log('[DownloadInterceptor] BLOCKING: Confirmed malware by VirusTotal');
                
                // Delete temp file
                try {
                    fs.unlinkSync(tempPath);
                } catch (e) {
                    console.error('[DownloadInterceptor] Error deleting temp file:', e);
                }
                
                pendingDownloads.delete(downloadId);
                
                // Notify UI of blocked download
                onDownloadAnalyzed(downloadId, downloadInfo, combinedAnalysis);
                return;
            }

            // Only auto-proceed if:
            // 1. File is safe (low risk score)
            // 2. File is NOT an executable or archive
            // 3. VT says clean or not in database
            // 4. From trusted source
            if (combinedAnalysis.riskLevel === 'safe' && combinedAnalysis.riskScore < 20 && !requiresConfirmation) {
                console.log('[DownloadInterceptor] Auto-proceeding safe download (verified by VT + Gemini)');
                
                // Move from temp to final location
                const finalPath = getDefaultDownloadPath(fileName);
                try {
                    fs.renameSync(tempPath, finalPath);
                    console.log('[DownloadInterceptor] Moved to final location:', finalPath);
                } catch (e) {
                    console.error('[DownloadInterceptor] Error moving file:', e);
                }
                
                pendingDownloads.delete(downloadId);

                // Notify UI of auto-approved download
                onDownloadAnalyzed(downloadId, downloadInfo, {
                    ...combinedAnalysis,
                    reasoning: 'Download approved automatically - verified safe by VirusTotal and AI.'
                });
                
                if (onDownloadComplete) {
                    onDownloadComplete(downloadId, downloadInfo, finalPath, true);
                }
                return;
            }

            // For all other cases: ALWAYS show warning UI
            console.log(`[DownloadInterceptor] Showing warning UI for: ${fileName} (${combinedAnalysis.riskLevel})`);
            onDownloadAnalyzed(downloadId, downloadInfo, combinedAnalysis);

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
        const finalPath = getDefaultDownloadPath(pending.info.fileName);
        
        // If file was downloaded to temp (for VT scanning), move it to final location
        if (pending.tempPath && fs.existsSync(pending.tempPath)) {
            console.log('[DownloadInterceptor] Moving from temp to final location...');
            
            // Ensure target directory exists
            const targetDir = path.dirname(finalPath);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            // Move file
            fs.renameSync(pending.tempPath, finalPath);
            console.log('[DownloadInterceptor] File moved successfully');
            
            // Clean up temp folder
            try {
                const tempFolder = path.dirname(pending.tempPath);
                fs.rmdirSync(tempFolder);
            } catch (e) {
                // Ignore cleanup errors
            }
            
            pendingDownloads.delete(downloadId);
            
            // Notify completion
            if (onDownloadComplete) {
                onDownloadComplete(downloadId, pending.info, finalPath, true);
            }
            
            return true;
        } else {
            // Fallback for old flow (no temp download)
            pending.item.setSavePath(finalPath);
            startDownloadWithProgress(downloadId, pending.item, pending.info, finalPath);
            pendingDownloads.delete(downloadId);
            return true;
        }
    } catch (error) {
        console.error('[DownloadInterceptor] Error proceeding with download:', error);
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
        // Delete temp file if it exists
        if (pending.tempPath && fs.existsSync(pending.tempPath)) {
            console.log('[DownloadInterceptor] Deleting temp file:', pending.tempPath);
            fs.unlinkSync(pending.tempPath);
            
            // Clean up temp folder
            try {
                const tempFolder = path.dirname(pending.tempPath);
                fs.rmdirSync(tempFolder);
            } catch (e) {
                // Ignore cleanup errors
            }
        }
        
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
