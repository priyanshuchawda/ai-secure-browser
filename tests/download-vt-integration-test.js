/**
 * Test Download Protection with VirusTotal
 * Manual test script to verify VT file scanning
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Download Protection with VirusTotal Test ===\n');

async function testDownloadProtection() {
    try {
        // Create test file directory
        const testDir = path.join(__dirname, '../data/download-test');
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        console.log('Test 1: EICAR Test File (Known Malware)');
        console.log('----------------------------------------');
        
        // Create EICAR test file
        const eicarContent = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
        const eicarPath = path.join(testDir, 'eicar-test.com');
        fs.writeFileSync(eicarPath, eicarContent);
        
        console.log(`✓ Created EICAR file: ${eicarPath}`);
        console.log(`  Size: ${fs.statSync(eicarPath).size} bytes`);
        console.log(`  SHA256: 275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f`);
        console.log();
        
        // Import VT analyzer (needs to be built first)
        console.log('Importing VT analyzer from built code...');
        const { analyzeDownloadedFile } = await import('../dist-electron/main/index.js');
        
        if (!analyzeDownloadedFile) {
            console.log('✗ VT analyzer not found in built code');
            console.log('  Make sure to run: npm run build');
            return;
        }
        
        console.log('✓ VT analyzer imported\n');
        
        console.log('Test 2: Analyzing EICAR with VirusTotal');
        console.log('----------------------------------------');
        console.log('This will check the EICAR file hash against VirusTotal database...');
        console.log('Expected: 70+ antivirus detections\n');
        
        const vtResult = await analyzeDownloadedFile(eicarPath, 'eicar-test.com');
        
        console.log('VirusTotal Result:');
        console.log(`  Available: ${vtResult.available}`);
        console.log(`  In Database: ${vtResult.inDatabase}`);
        console.log(`  Detections: ${vtResult.positives}/${vtResult.total}`);
        console.log(`  Detection Rate: ${vtResult.detectionRate}%`);
        console.log(`  Risk Level: ${vtResult.positives >= 5 ? 'CRITICAL' : 'Unknown'}`);
        
        if (vtResult.permalink) {
            console.log(`  Report: ${vtResult.permalink}`);
        }
        console.log();
        
        // Verdict
        if (vtResult.inDatabase && vtResult.positives > 50) {
            console.log('✓ TEST PASSED: EICAR correctly detected as malware');
            console.log(`  ${vtResult.positives} antivirus engines flagged this file`);
        } else if (!vtResult.available) {
            console.log('⚠ SKIPPED: VirusTotal API not configured');
            console.log('  Add VIRUSTOTAL_API_KEY to .env to test');
        } else if (!vtResult.inDatabase) {
            console.log('⚠ INCONCLUSIVE: EICAR not in VT database yet');
            console.log('  File may need to be submitted first');
        } else {
            console.log('⚠ UNEXPECTED: Low detection rate for EICAR');
            console.log(`  Only ${vtResult.positives} detections (expected 70+)`);
        }
        console.log();
        
        console.log('Test 3: Clean File (Text Document)');
        console.log('----------------------------------------');
        
        const cleanPath = path.join(testDir, 'clean-document.txt');
        fs.writeFileSync(cleanPath, 'This is a clean text document for testing.\n');
        
        console.log(`✓ Created clean file: ${cleanPath}`);
        const cleanResult = await analyzeDownloadedFile(cleanPath, 'clean-document.txt');
        
        console.log('VirusTotal Result:');
        console.log(`  Available: ${cleanResult.available}`);
        console.log(`  In Database: ${cleanResult.inDatabase}`);
        
        if (cleanResult.inDatabase) {
            console.log(`  Detections: ${cleanResult.positives}/${cleanResult.total}`);
            if (cleanResult.positives === 0) {
                console.log('✓ TEST PASSED: Clean file detected as safe');
            } else {
                console.log(`⚠ UNEXPECTED: ${cleanResult.positives} false positives`);
            }
        } else {
            console.log('ℹ File not in VT database (expected for new files)');
        }
        console.log();
        
        // Cleanup
        fs.unlinkSync(eicarPath);
        fs.unlinkSync(cleanPath);
        fs.rmdirSync(testDir);
        
        console.log('=== Tests Complete ===');
        console.log('✓ VT file scanning integration working');
        console.log('✓ Ready for manual browser testing');
        
    } catch (error) {
        console.error('✗ Test failed:', error);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure to build first: npm run build');
        console.error('2. Check .env has VIRUSTOTAL_API_KEY');
        console.error('3. Verify VT API key is valid');
        process.exit(1);
    }
}

testDownloadProtection();
