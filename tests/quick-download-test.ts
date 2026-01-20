/**
 * Quick test for download MIME mismatch detection
 */

import 'dotenv/config';
import { analyzeDownload } from '../electron/main/download-protection/ai-download-analyzer';

async function quickTest() {
    console.log('\n🔍 QUICK DOWNLOAD TEST: MIME Mismatch Detection\n');

    // Test: PDF file with executable MIME type (disguised malware)
    const result = await analyzeDownload({
        fileName: 'document.pdf',
        fileSize: 512000,
        mimeType: 'application/x-msdownload',
        url: 'https://suspicious-site.com/document.pdf',
        referrer: '',
        domain: 'suspicious-site.com'
    });

    console.log('━'.repeat(50));
    console.log('Test: PDF file with executable MIME type');
    console.log('━'.repeat(50));
    console.log(`Risk Level:   ${result.riskLevel.toUpperCase()}`);
    console.log(`Risk Score:   ${result.riskScore}/100`);
    console.log(`Should Block: ${result.shouldBlock ? 'YES ⛔' : 'No'}`);
    console.log(`Reasoning:    ${result.reasoning}`);
    console.log('━'.repeat(50));

    if (result.riskLevel === 'critical' || result.riskLevel === 'high') {
        console.log('✅ PASS: Disguised file correctly detected as dangerous');
    } else {
        console.log('❌ FAIL: Should have detected MIME mismatch');
    }
    console.log('\n');
}

quickTest().catch(console.error);
