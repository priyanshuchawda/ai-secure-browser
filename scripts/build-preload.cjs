/**
 * Build script for Electron preload script
 * Uses esbuild to generate a proper CommonJS bundle
 */
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, '../dist-electron/preload');
const outFile = path.join(outDir, 'index.cjs');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

console.log('[Preload Build] Building preload script...');

esbuild.buildSync({
    entryPoints: [path.join(__dirname, '../electron/preload/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: outFile,
    external: ['electron'],
    minify: false,
    sourcemap: false,
});

console.log('[Preload Build] ✓ Built:', outFile);
