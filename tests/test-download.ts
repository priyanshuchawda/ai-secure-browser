/**
 * Test script for Download Analyzer
 * Run with: npx tsx tests/test-download.ts
 */

import 'dotenv/config';
import { analyzeDownload, type DownloadInfo } from '../electron/main/download-protection/ai-download-analyzer';

// Test cases covering various scenarios
const TEST_DOWNLOADS: Array<{ info: DownloadInfo; expected: string }> = [
    // CRITICAL: Double extension (malware disguise)
    {
        info: {
            fileName: 'invoice.pdf.exe',
            fileSize: 1024000,
            mimeType: 'application/x-msdownload',
            url: 'https://random-site.xyz/invoice.pdf.exe',
            referrer: 'https://phishing-email-link.com',
            domain: 'random-site.xyz'
        },
        expected: 'CRITICAL - Double extension malware disguise'
    },

    // CRITICAL: MIME type mismatch
    {
        info: {
            fileName: 'document.pdf',
            fileSize: 512000,
            mimeType: 'application/x-msdownload', // Executable MIME for a "PDF"
            url: 'https://suspicious-site.com/document.pdf',
            referrer: '',
            domain: 'suspicious-site.com'
        },
        expected: 'CRITICAL - MIME mismatch (PDF claims to be executable)'
    },

    // MEDIUM: Archive from unknown source
    {
        info: {
            fileName: 'free-software.zip',
            fileSize: 50000000,
            mimeType: 'application/zip',
            url: 'https://free-downloads.net/free-software.zip',
            referrer: 'https://google.com/search',
            domain: 'free-downloads.net'
        },
        expected: 'MEDIUM - Archive from unknown source'
    },

    // SAFE: PDF from trusted source
    {
        info: {
            fileName: 'report.pdf',
            fileSize: 1024000,
            mimeType: 'application/pdf',
            url: 'https://drive.google.com/download/report.pdf',
            referrer: 'https://drive.google.com',
            domain: 'drive.google.com'
        },
        expected: 'SAFE - PDF from trusted Google Drive'
    },

    // LOW: Executable from GitHub (trusted but still exe)
    {
        info: {
            fileName: 'installer.exe',
            fileSize: 25000000,
            mimeType: 'application/x-msdownload',
            url: 'https://github.com/releases/download/v1.0/installer.exe',
            referrer: 'https://github.com/project/releases',
            domain: 'github.com'
        },
        expected: 'LOW - Executable from trusted GitHub'
    }
];

async function runDownloadTests() {
    console.log('\n========================================');
    console.log('  DOWNLOAD ANALYZER TEST SUITE');
    console.log('========================================\n');

    for (const testCase of TEST_DOWNLOADS) {
        console.log('─'.repeat(55));
        console.log(`📦 File: ${testCase.info.fileName}`);
        console.log(`   Domain: ${testCase.info.domain}`);
        console.log(`   Expected: ${testCase.expected}`);
        console.log('─'.repeat(55));

        const startTime = Date.now();

        try {
            const result = await analyzeDownload(testCase.info);
            const elapsed = Date.now() - startTime;

            const riskEmoji = result.riskLevel === 'critical' ? '🔴' :
                result.riskLevel === 'high' ? '🟠' :
                    result.riskLevel === 'medium' ? '🟡' :
                        result.riskLevel === 'low' ? '🟢' : '✅';

            console.log(`\n${riskEmoji} RESULT: ${result.riskLevel.toUpperCase()} (${result.riskScore}/100)`);
            console.log(`   Reputation: ${result.sourceReputation}`);
            console.log(`   Should Block: ${result.shouldBlock ? 'YES' : 'No'}`);
            console.log(`   Time: ${elapsed}ms`);
            console.log(`   Reasoning: ${result.reasoning.substring(0, 100)}...`);

            if (result.recommendations.length > 0) {
                console.log('   Recommendations:');
                result.recommendations.forEach((rec, i) => {
                    console.log(`     ${i + 1}. ${rec}`);
                });
            }
        } catch (error) {
            console.error(`   ❌ Error: ${error}`);
        }

        console.log('\n');

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('========================================');
    console.log('  TEST SUITE COMPLETE');
    console.log('========================================\n');
}

// Run tests
runDownloadTests().catch(console.error);
