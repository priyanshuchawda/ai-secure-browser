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
            },
            {
                // Preload scripts - MUST be CommonJS for Electron
                entry: 'electron/preload/index.ts',
                vite: {
                    build: {
                        outDir: 'dist-electron/preload',
                        lib: {
                            entry: 'electron/preload/index.ts',
                            formats: ['cjs'],
                            fileName: () => 'index.cjs'
                        },
                        rollupOptions: {
                            external: ['electron'],
                            output: {
                                format: 'cjs',
                                entryFileNames: 'index.cjs'
                            }
                        }
                    }
                },
                onstart(options) {
                    options.reload()
                }
            }
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
