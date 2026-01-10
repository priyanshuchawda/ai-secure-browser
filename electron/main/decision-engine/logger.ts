/**
 * Decision Logger
 * Logs all threat detections and user overrides per FR-006
 * Uses JSONL format with 90-day retention
 */

import { existsSync, mkdirSync, appendFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import {
    DecisionLog,
    ThreatAssessment,
    SecurityDecision,
    EnforcementResult,
    NavigationRequest
} from '../../../src/shared/types';
import { PATHS, THRESHOLDS } from '../../../src/shared/constants';
import {
    generateUUID,
    getCurrentTimestamp,
    formatDateForFilename,
    sanitizeUrlForLogging,
    isOlderThan
} from '../../../src/shared/utils';

/**
 * Decision Logger
 * Records all threat decisions for audit trail
 */
export class DecisionLogger {
    private logsDir: string;

    constructor(logsDir?: string) {
        this.logsDir = logsDir || PATHS.LOGS_DIR;
        this.ensureLogsDir();
    }

    /**
     * Ensure logs directory exists
     */
    private ensureLogsDir(): void {
        if (!existsSync(this.logsDir)) {
            mkdirSync(this.logsDir, { recursive: true });
            console.log(`[Logger] Created logs directory: ${this.logsDir}`);
        }
    }

    /**
     * Get log file path for a specific date
     */
    private getLogFilePath(date: Date = new Date()): string {
        const filename = `decisions-${formatDateForFilename(date)}.jsonl`;
        return join(this.logsDir, filename);
    }

    /**
     * Log a complete decision cycle
     */
    log(
        request: NavigationRequest,
        assessment: ThreatAssessment,
        decision: SecurityDecision,
        enforcement: EnforcementResult
    ): void {
        const logEntry: DecisionLog = {
            id: generateUUID(),
            timestamp: getCurrentTimestamp(),
            request: {
                url: sanitizeUrlForLogging(request.url),
                referrer: request.referrer ? sanitizeUrlForLogging(request.referrer) : null,
                triggerType: request.triggerType
            },
            assessment: {
                threatType: assessment.threatType,
                confidence: assessment.confidence,
                indicators: assessment.indicators.map(i => i.type),
                analysisMethod: assessment.analysisMethod
            },
            decision: {
                action: decision.action,
                rationale: decision.rationale,
                overridable: decision.overridable
            },
            enforcement: {
                blocked: enforcement.blocked,
                warningShown: enforcement.warningShown,
                userOverride: enforcement.userOverride,
                overrideReason: enforcement.overrideReason
            },
            performance: {
                analysisLatency: assessment.analysisLatency,
                totalLatency: Date.now() - new Date(request.timestamp).getTime()
            }
        };

        this.writeLogEntry(logEntry);
    }

    /**
     * Log a simple event (for quick logging without full context)
     */
    logSimple(
        url: string,
        threatType: string | null,
        action: string,
        blocked: boolean
    ): void {
        const logEntry = {
            id: generateUUID(),
            timestamp: getCurrentTimestamp(),
            url: sanitizeUrlForLogging(url),
            threatType,
            action,
            blocked
        };

        this.writeLogEntry(logEntry);
    }

    /**
     * Write a log entry to the daily log file
     */
    private writeLogEntry(entry: object): void {
        try {
            const logPath = this.getLogFilePath();
            const line = JSON.stringify(entry) + '\n';
            appendFileSync(logPath, line);
            console.log(`[Logger] Logged decision for ${(entry as any).url || (entry as any).request?.url || 'unknown'}`);
        } catch (error) {
            console.error('[Logger] Error writing log entry:', error);
        }
    }

    /**
     * Clean up old log files (older than retention period)
     * Should be run periodically (e.g., daily at 2 AM)
     */
    cleanup(): number {
        let filesDeleted = 0;

        try {
            const files = readdirSync(this.logsDir);
            const retentionDays = THRESHOLDS.LOG_RETENTION_DAYS;

            for (const file of files) {
                if (!file.startsWith('decisions-') || !file.endsWith('.jsonl')) {
                    continue;
                }

                // Extract date from filename (decisions-YYYY-MM-DD.jsonl)
                const dateMatch = file.match(/decisions-(\d{4}-\d{2}-\d{2})\.jsonl/);
                if (!dateMatch) continue;

                const fileDate = dateMatch[1];
                if (isOlderThan(fileDate, retentionDays)) {
                    const filePath = join(this.logsDir, file);
                    unlinkSync(filePath);
                    filesDeleted++;
                    console.log(`[Logger] Deleted old log file: ${file}`);
                }
            }

            if (filesDeleted > 0) {
                console.log(`[Logger] Cleanup complete. Deleted ${filesDeleted} files.`);
            }
        } catch (error) {
            console.error('[Logger] Error during cleanup:', error);
        }

        return filesDeleted;
    }

    /**
     * Get list of log files
     */
    getLogFiles(): string[] {
        try {
            return readdirSync(this.logsDir)
                .filter(f => f.startsWith('decisions-') && f.endsWith('.jsonl'))
                .sort()
                .reverse(); // Most recent first
        } catch {
            return [];
        }
    }
}

// Singleton instance
let loggerInstance: DecisionLogger | null = null;

export function getDecisionLogger(): DecisionLogger {
    if (!loggerInstance) {
        loggerInstance = new DecisionLogger();
    }
    return loggerInstance;
}
