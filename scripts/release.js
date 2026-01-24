#!/usr/bin/env node

/**
 * Release Script - Build and publish to GitHub Releases
 * Usage: node scripts/release.js <version>
 * Example: node scripts/release.js v1.0.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(command, options = {}) {
    console.log(`\n▶ ${command}`);
    try {
        execSync(command, { stdio: 'inherit', ...options });
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        process.exit(1);
    }
}

function getVersion() {
    const version = process.argv[2];
    if (!version) {
        console.error('❌ Version required. Usage: node scripts/release.js v1.0.0');
        process.exit(1);
    }
    return version.startsWith('v') ? version : `v${version}`;
}

function checkGhInstalled() {
    try {
        execSync('gh --version', { stdio: 'pipe' });
    } catch {
        console.error('❌ GitHub CLI (gh) is not installed.');
        console.error('Install from: https://cli.github.com/');
        process.exit(1);
    }
}

function getReleasFiles() {
    const releaseDir = path.join(process.cwd(), 'release');
    
    if (!fs.existsSync(releaseDir)) {
        console.error('❌ Release directory not found. Run npm run build first.');
        process.exit(1);
    }
    
    const files = fs.readdirSync(releaseDir)
        .filter(file => {
            const ext = path.extname(file);
            return ['.exe', '.dmg', '.AppImage', '.deb', '.zip'].includes(ext);
        })
        .map(file => path.join(releaseDir, file));
    
    if (files.length === 0) {
        console.error('❌ No release files found in ./release directory');
        process.exit(1);
    }
    
    return files;
}

async function main() {
    console.log('🚀 AI Secure Browser - GitHub Release\n');
    
    const version = getVersion();
    console.log(`📦 Version: ${version}`);
    
    // Check prerequisites
    checkGhInstalled();
    
    // Step 1: Build the app
    console.log('\n📦 Building application...');
    run('npm run dist');
    
    // Step 2: Get release files
    const files = getReleasFiles();
    console.log('\n📁 Found release files:');
    files.forEach(file => console.log(`   - ${path.basename(file)}`));
    
    // Step 3: Create git tag
    console.log(`\n🏷️  Creating git tag ${version}...`);
    run(`git tag -a ${version} -m "Release ${version}"`);
    run(`git push origin ${version}`);
    
    // Step 4: Create GitHub release
    console.log(`\n🌐 Creating GitHub release ${version}...`);
    const releaseNotes = `## AI Secure Browser ${version}

### Download

Choose the installer for your platform:

- **Windows**: \`.exe\` (installer) or \`-portable.exe\` (no install needed)
- **macOS**: \`.dmg\` (drag & drop installer)
- **Linux**: \`.AppImage\` (portable) or \`.deb\` (Debian/Ubuntu)

### Installation

1. Download the appropriate file for your OS
2. Set up your \`.env\` file with \`GEMINI_API_KEY\`
3. Run the application

### Features

✅ Real-time URL threat detection
✅ Download protection with AI analysis
✅ Intelligent caching
✅ Browser navigation (back, forward, refresh)

See README.md for full documentation.
`;
    
    // Create release with notes
    fs.writeFileSync('.release-notes.tmp', releaseNotes);
    run(`gh release create ${version} --title "AI Secure Browser ${version}" --notes-file .release-notes.tmp`);
    fs.unlinkSync('.release-notes.tmp');
    
    // Step 5: Upload release files
    console.log('\n📤 Uploading release files...');
    files.forEach(file => {
        run(`gh release upload ${version} "${file}"`);
    });
    
    console.log('\n✅ Release published successfully!');
    console.log(`🔗 View at: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/${version}`);
}

main().catch(error => {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
});
