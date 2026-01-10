/**
 * Decision Engine
 * Converts ThreatAssessment to SecurityDecision using deterministic rules
 * Based on research.md Decision 4 and data-model.md decision logic
 */

import {
    ThreatAssessment,
    SecurityDecision,
    DecisionAction,
    RiskLevel,
    AnalysisMethod
} from '../../../src/shared/types';
import { THRESHOLDS, KNOWN_AUTH_PROVIDERS } from '../../../src/shared/constants';
import { generateUUID, getCurrentTimestamp, extractDomain } from '../../../src/shared/utils';

/**
 * Decision Engine
 * Deterministic rules for converting AI outputs to enforcement actions
 */
export class DecisionEngine {
    /**
     * Make a security decision based on threat assessment
     */
    decide(assessment: ThreatAssessment): SecurityDecision {
        const decision = this.makeDecision(assessment);
        console.log(`[Decision] ${assessment.url.substring(0, 40)}... → ${decision.action} (${decision.riskLevel})`);
        return decision;
    }

    /**
     * Core decision logic
     */
    private makeDecision(assessment: ThreatAssessment): SecurityDecision {
        // No threat detected
        if (!assessment.threatType) {
            return this.createDecision(assessment.id, {
                action: DecisionAction.ALLOW,
                rationale: 'No threats detected',
                overridable: false,
                requiresExplanation: false,
                riskLevel: RiskLevel.SAFE
            });
        }

        // Known authentication providers → whitelist (FR-008, SC-008)
        const domain = extractDomain(assessment.url);
        if (this.isAuthProvider(domain)) {
            return this.createDecision(assessment.id, {
                action: DecisionAction.ALLOW,
                rationale: 'Verified authentication provider',
                overridable: false,
                requiresExplanation: false,
                riskLevel: RiskLevel.SAFE
            });
        }

        // High-confidence cached threats → auto-block (≥0.9)
        if (assessment.confidence >= THRESHOLDS.AUTO_BLOCK_CONFIDENCE &&
            assessment.analysisMethod === AnalysisMethod.CACHE_HIT) {
            return this.createDecision(assessment.id, {
                action: DecisionAction.BLOCK,
                rationale: `Confirmed ${assessment.threatType} in threat database`,
                overridable: true,
                requiresExplanation: true,
                riskLevel: RiskLevel.EXTREME
            });
        }

        // High-confidence AI/local detection → block
        if (assessment.confidence >= THRESHOLDS.AUTO_BLOCK_CONFIDENCE) {
            return this.createDecision(assessment.id, {
                action: DecisionAction.BLOCK,
                rationale: `High-confidence ${assessment.threatType} detection (${(assessment.confidence * 100).toFixed(0)}%)`,
                overridable: true,
                requiresExplanation: true,
                riskLevel: RiskLevel.EXTREME
            });
        }

        // Medium-high confidence → block with high risk
        if (assessment.confidence >= 0.7) {
            return this.createDecision(assessment.id, {
                action: DecisionAction.BLOCK,
                rationale: `Likely ${assessment.threatType}, confidence ${(assessment.confidence * 100).toFixed(0)}%`,
                overridable: true,
                requiresExplanation: true,
                riskLevel: RiskLevel.HIGH
            });
        }

        // AI uncertainty → warn, don't block (minimize false positives)
        if (assessment.confidence < THRESHOLDS.WARN_CONFIDENCE) {
            return this.createDecision(assessment.id, {
                action: DecisionAction.WARN,
                rationale: `Possible ${assessment.threatType}, confidence ${(assessment.confidence * 100).toFixed(0)}%`,
                overridable: true,
                requiresExplanation: true,
                riskLevel: RiskLevel.MEDIUM
            });
        }

        // Default for medium confidence: warn
        return this.createDecision(assessment.id, {
            action: DecisionAction.WARN,
            rationale: `Suspicious ${assessment.threatType} indicators detected`,
            overridable: true,
            requiresExplanation: true,
            riskLevel: RiskLevel.MEDIUM
        });
    }

    /**
     * Create a SecurityDecision object
     */
    private createDecision(
        assessmentId: string,
        params: {
            action: DecisionAction;
            rationale: string;
            overridable: boolean;
            requiresExplanation: boolean;
            riskLevel: RiskLevel;
        }
    ): SecurityDecision {
        return {
            id: generateUUID(),
            assessmentId,
            action: params.action,
            rationale: params.rationale,
            overridable: params.overridable,
            requiresExplanation: params.requiresExplanation,
            riskLevel: params.riskLevel,
            timestamp: getCurrentTimestamp()
        };
    }

    /**
     * Check if domain is a known auth provider
     */
    private isAuthProvider(domain: string): boolean {
        const baseDomain = domain.replace(/^www\./, '');
        return KNOWN_AUTH_PROVIDERS.some(provider =>
            baseDomain === provider || baseDomain.endsWith('.' + provider)
        );
    }

    /**
     * Determine if a decision should show a warning page
     */
    shouldShowWarning(decision: SecurityDecision): boolean {
        return decision.action === DecisionAction.BLOCK ||
            decision.action === DecisionAction.WARN;
    }

    /**
     * Determine if navigation should be blocked
     */
    shouldBlock(decision: SecurityDecision): boolean {
        return decision.action === DecisionAction.BLOCK;
    }
}

// Singleton instance
let decisionEngineInstance: DecisionEngine | null = null;

export function getDecisionEngine(): DecisionEngine {
    if (!decisionEngineInstance) {
        decisionEngineInstance = new DecisionEngine();
    }
    return decisionEngineInstance;
}
