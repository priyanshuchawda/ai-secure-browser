import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
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
        ]),
        renderer()
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
