/**
 * Simple VirusTotal Client Test (Compiled Code)
 * Tests the built VirusTotal client
 */

import { getVirusTotalClient } from '../dist-electron/main/virustotal/client.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing Built VirusTotal Client\n');

const client = getVirusTotalClient();

if (!client.isAvailable()) {
    console.error('❌ VirusTotal client not available. Check API key in .env');
    process.exit(1);
}

console.log('✅ VirusTotal client initialized\n');

// Test with a safe URL
console.log('📡 Testing URL check: github.com\n');

try {
    const result = await client.checkUrl('github.com');
    
    console.log('✅ Result received:');
    console.log(`   - Available: ${result.available}`);
    console.log(`   - In Database: ${result.inDatabase}`);
    console.log(`   - Detections: ${result.positives}/${result.total}`);
    console.log(`   - Detection Rate: ${result.detectionRate}%`);
    console.log(`   - Message: ${result.message}`);
    
    if (result.permalink) {
        console.log(`   - Report: ${result.permalink}`);
    }
    
    console.log('\n✅ Test passed!\n');
} catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
}
