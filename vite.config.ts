import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        electron([
            {
                // Main process entry file
                entry: 'electron/main/index.ts',
                vite: {
                    build: {
                        outDir: 'dist-electron/main',
                        rollupOptions: {
                            external: ['electron', '@google/genai', 'dotenv/config']
                        }
                    }
                }
            }
            // Note: Preload script is built separately using esbuild (scripts/build-preload.cjs)
        ])
        // NOTE: renderer() plugin REMOVED - it causes duplicate DOM elements
        // with static HTML-based renderer UIs like ours
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@shared': resolve(__dirname, './src/shared'),
            '@electron': resolve(__dirname, './electron')
        }
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true
    },
    server: {
        port: 5173
    }
})
