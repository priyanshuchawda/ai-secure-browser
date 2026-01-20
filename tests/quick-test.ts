/**
 * Quick test for single URL
 * Run with: npx tsx tests/quick-test.ts
 */

import 'dotenv/config';
import { GeminiAnalyzer } from '../electron/main/threat-analysis/ai-analyzer/gemini-client';

async function quickTest() {
    const testUrl = 'https://cha.google.com'; // Non-existent subdomain

    console.log('\n🔍 QUICK TEST: Non-existent domain detection');
    console.log('━'.repeat(50));
    console.log(`URL: ${testUrl}`);
    console.log('Expected: Should be flagged as suspicious/phishing\n');

    const analyzer = new GeminiAnalyzer();

    if (!analyzer.isAvailable()) {
        console.error('❌ Gemini API not available');
        process.exit(1);
    }

    const startTime = Date.now();
    const result = await analyzer.analyze(testUrl);
    const elapsed = Date.now() - startTime;

    console.log('\n📊 ANALYSIS RESULT:');
    console.log('━'.repeat(50));

    if (result) {
        console.log(`Threat Type:     ${result.threatType.toUpperCase()}`);
        console.log(`Confidence:      ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`Recommendation:  ${result.recommendation.toUpperCase()}`);
        console.log(`Analysis Time:   ${elapsed}ms`);

        console.log('\n📋 Indicators:');
        result.indicators.forEach((ind, i) => {
            console.log(`  ${i + 1}. [${ind.severity?.toUpperCase() || 'INFO'}] ${ind.type}`);
            console.log(`     └─ ${ind.description}`);
        });

        // Validate
        console.log('\n━'.repeat(50));
        if (result.threatType === 'safe' && result.confidence > 0.8) {
            console.log('❌ FAIL: Non-existent domain incorrectly marked as safe!');
        } else if (result.threatType !== 'safe' || result.recommendation !== 'allow') {
            console.log('✅ PASS: Non-existent domain correctly flagged as suspicious');
        } else {
            console.log('⚠️  MARGINAL: Low confidence safe - acceptable');
        }
    } else {
        console.log('❌ No result returned from analysis');
    }

    console.log('\n');
}

quickTest().catch(console.error);
