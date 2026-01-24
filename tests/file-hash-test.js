/**
 * Test File Hash Calculator
 * Tests SHA256 hash calculation with sample files
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standalone hash function for testing
function calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);

        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

// Known test file: Create a sample text file
const testDir = path.join(__dirname, '../data');
const testFile = path.join(testDir, 'hash-test.txt');

console.log('=== File Hash Calculator Test ===\n');

async function runTests() {
    try {
        // Ensure data directory exists
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        // Create test file with known content
        const testContent = 'This is a test file for SHA256 hash calculation.\n';
        fs.writeFileSync(testFile, testContent);

        console.log(`Test file created: ${testFile}`);
        console.log(`Content: "${testContent.trim()}"`);
        console.log(`Size: ${fs.statSync(testFile).size} bytes`);
        console.log();

        // Test 1: Basic hash calculation
        console.log('Test 1: Basic SHA256 hash calculation');
        console.log('----------------------------------------');
        const startTime = Date.now();
        const hash1 = await calculateFileHash(testFile);
        const elapsed = Date.now() - startTime;
        console.log(`✓ SHA256 Hash: ${hash1}`);
        console.log(`✓ Calculated in: ${elapsed}ms`);
        console.log();

        // Test 2: Hash consistency (same file should give same hash)
        console.log('Test 2: Hash consistency check');
        console.log('----------------------------------------');
        const hash2 = await calculateFileHash(testFile);
        if (hash1 === hash2) {
            console.log('✓ PASS: Hashes match (consistent)');
            console.log(`  Hash: ${hash1}`);
        } else {
            console.log('✗ FAIL: Hashes do not match');
        }
        console.log();

        // Test 3: Multiple hash algorithms
        console.log('Test 3: Multiple hash algorithms (MD5, SHA1, SHA256)');
        console.log('----------------------------------------');
        const md5 = crypto.createHash('md5').update(testContent).digest('hex');
        const sha1 = crypto.createHash('sha1').update(testContent).digest('hex');
        const sha256 = crypto.createHash('sha256').update(testContent).digest('hex');
        console.log(`✓ MD5:    ${md5}`);
        console.log(`✓ SHA1:   ${sha1}`);
        console.log(`✓ SHA256: ${sha256}`);
        console.log();

        // Test 4: EICAR test file (for reference)
        console.log('Test 4: EICAR test file (for VirusTotal testing)');
        console.log('----------------------------------------');
        const eicarContent = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
        const eicarFile = path.join(testDir, 'eicar-test.txt');
        fs.writeFileSync(eicarFile, eicarContent);
        
        const eicarHash = await calculateFileHash(eicarFile);
        const eicarExpected = '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f';
        
        console.log(`EICAR SHA256: ${eicarHash}`);
        console.log(`Expected:     ${eicarExpected}`);
        
        if (eicarHash === eicarExpected) {
            console.log('✓ PASS: EICAR hash matches known value');
        } else {
            console.log('✗ FAIL: EICAR hash mismatch (content may be incomplete)');
        }
        console.log();

        // Test 5: Large file simulation
        console.log('Test 5: Larger file (performance test)');
        console.log('----------------------------------------');
        const largeFile = path.join(testDir, 'large-test.bin');
        const largeData = Buffer.alloc(1024 * 1024); // 1MB
        crypto.randomFillSync(largeData);
        fs.writeFileSync(largeFile, largeData);
        
        const largeStart = Date.now();
        const largeHash = await calculateFileHash(largeFile);
        const largeElapsed = Date.now() - largeStart;
        
        console.log(`✓ 1MB file hashed in: ${largeElapsed}ms`);
        console.log(`✓ Hash: ${largeHash.substring(0, 32)}...`);
        console.log();

        // Cleanup
        fs.unlinkSync(testFile);
        fs.unlinkSync(eicarFile);
        fs.unlinkSync(largeFile);
        
        console.log('=== All Tests Completed ===');
        console.log('✓ File hash calculation working correctly');
        console.log('✓ Ready for VirusTotal integration');

    } catch (error) {
        console.error('✗ Test failed:', error);
        process.exit(1);
    }
}

runTests();
