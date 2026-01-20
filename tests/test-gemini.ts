/**
 * Test script for Gemini threat analysis
 * Run with: npx tsx tests/test-gemini.ts
 */

import 'dotenv/config';
import { GeminiAnalyzer } from '../electron/main/threat-analysis/ai-analyzer/gemini-client';

// Test cases
const TEST_URLS = [
    // Should be flagged as suspicious (non-existent domain)
    { url: 'https://cha.google.com', expected: 'should warn - non-existent subdomain' },
    { url: 'https://secure-paypal-verify.xyz', expected: 'should warn/block - suspicious domain' },

    // Should be safe (legitimate domains)
    { url: 'https://google.com', expected: 'should allow - verified legitimate' },
    { url: 'https://github.com', expected: 'should allow - verified legitimate' },
];

async function runTests() {
    console.log('\n========================================');
    console.log('  GEMINI THREAT ANALYSIS TEST SUITE');
    console.log('========================================\n');

    const analyzer = new GeminiAnalyzer();

    if (!analyzer.isAvailable()) {
        console.error('❌ Gemini API not available. Check GEMINI_API_KEY in .env');
        process.exit(1);
    }

    console.log('✅ Gemini client initialized\n');

    for (const testCase of TEST_URLS) {
        console.log('─'.repeat(50));
        console.log(`🔍 Testing: ${testCase.url}`);
        console.log(`   Expected: ${testCase.expected}`);
        console.log('─'.repeat(50));

        const startTime = Date.now();

        try {
            const result = await analyzer.analyze(testCase.url);
            const elapsed = Date.now() - startTime;

            if (result) {
                console.log('\n📊 RESULT:');
                console.log(`   Threat Type: ${result.threatType}`);
                console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
                console.log(`   Recommendation: ${result.recommendation}`);
                console.log(`   Time: ${elapsed}ms`);

                if (result.indicators && result.indicators.length > 0) {
                    console.log('\n   📋 Indicators:');
                    result.indicators.forEach((ind, i) => {
                        console.log(`      ${i + 1}. [${ind.severity?.toUpperCase() || 'INFO'}] ${ind.type}: ${ind.description}`);
                    });
                }

                // Validate result
                const isAccessible = testCase.url.includes('google.com') && !testCase.url.includes('cha.') || testCase.url.includes('github.com');

                if (!isAccessible && result.threatType === 'safe' && result.confidence > 0.8) {
                    console.log('\n   ⚠️  WARNING: Non-existent domain marked as safe with high confidence!');
                } else if (isAccessible && result.threatType !== 'safe') {
                    console.log('\n   ⚠️  WARNING: Legitimate site marked as threat!');
                } else {
                    console.log('\n   ✅ Result seems appropriate');
                }
            } else {
                console.log('\n   ❌ No result returned');
            }
        } catch (error) {
            console.error(`\n   ❌ Error: ${error}`);
        }

        console.log('\n');
    }

    console.log('========================================');
    console.log('  TEST SUITE COMPLETE');
    console.log('========================================\n');
}

// Run tests
runTests().catch(console.error);
