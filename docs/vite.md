# Vite - Next Generation Frontend Tooling

Vite is a modern build tool that provides lightning-fast development experience through native ES modules and highly optimized production builds via Rolldown. It consists of two major components: a development server with instant server start and Hot Module Replacement (HMR), and a build command that bundles code for production. Vite's dev server serves source files over native ES modules, eliminating the need for bundling during development and enabling sub-second server startup regardless of application size. Vite 8 requires Node.js 20.19+ or 22.12+, with the default browser target set to 'baseline-widely-available' (Chrome 107+, Edge 107+, Firefox 104+, Safari 16+).

The framework-agnostic architecture makes Vite extensible through a powerful plugin system compatible with Rollup and Rolldown plugins, offering full TypeScript support throughout its JavaScript API and plugin interface. Vite supports all major frontend frameworks including Vue, React, Svelte, and Solid, while providing rich built-in features like TypeScript transpilation, JSX support, CSS preprocessing, and asset handling out of the box. Vite 8 introduces the experimental Environment API for managing multiple build environments (client, SSR, edge workers) and the Module Runner for executing transformed code with HMR support in various JavaScript runtimes. New features include Oxc integration for faster transformation, Rolldown as the default bundler for improved performance, and enhanced support for runnable and fetchable dev environments.

## APIs and Key Functions

### Create Development Server

Programmatically create and start a Vite development server with custom configuration.

```js
import { createServer } from 'vite'

// Create development server with custom configuration
const server = await createServer({
  root: process.cwd(),
  server: {
    port: 3000,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [],
  optimizeDeps: {
    include: ['lodash-es']
  }
})

// Start listening on the configured port
await server.listen()

// Print server URLs to console
server.printUrls()

// Bind keyboard shortcuts for CLI interaction
server.bindCLIShortcuts({ print: true })

// Transform a URL programmatically (bypassing HTTP pipeline)
const result = await server.transformRequest('/src/main.js')
console.log(result.code) // Transformed JavaScript code

// Trigger HMR for a specific module
const module = server.moduleGraph.getModuleById('/src/components/App.vue')
if (module) {
  await server.reloadModule(module)
}

// Cleanup: close server when done
await server.close()
```

### Build for Production

Execute production build with custom configuration and output options.

```js
import { build } from 'vite'
import path from 'node:path'

// Single build configuration
const output = await build({
  root: path.resolve(__dirname, './src'),
  base: '/my-app/',
  build: {
    outDir: path.resolve(__dirname, './dist'),
    assetsDir: 'static',
    sourcemap: true,
    minify: 'terser',
    target: 'baseline-widely-available', // Default in Vite 7
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html')
      },
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
})

// Multi-build for different environments (client + SSR)
const clientBuild = build({
  build: {
    outDir: 'dist/client',
    manifest: true
  }
})

const ssrBuild = build({
  build: {
    outDir: 'dist/server',
    ssr: 'src/entry-server.js',
    rollupOptions: {
      output: {
        format: 'esm'
      }
    }
  }
})

await Promise.all([clientBuild, ssrBuild])
```

### Preview Production Build

Start a local server to preview production build output.

```js
import { preview } from 'vite'

const previewServer = await preview({
  preview: {
    port: 8080,
    open: true,
    strictPort: false,
    cors: true,
    headers: {
      'Cache-Control': 'public, max-age=3600'
    },
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist'
  }
})

previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })

// Preview server runs until manually closed
// Access at http://localhost:8080
```

### Define Configuration

Create type-safe Vite configuration with IntelliSense support.

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      overlay: true
    }
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1000
  }
})

// Conditional configuration based on command and mode
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      server: { port: 3000 }
    }
  } else {
    return {
      plugins: [react()],
      build: { minify: 'terser' }
    }
  }
})
```

### Load Environment Variables

Load environment variables from .env files for use in configuration.

```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load all env variables (not just VITE_ prefixed)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.APP_VERSION),
      __API_URL__: JSON.stringify(env.API_URL),
    },
    server: {
      port: env.PORT ? Number(env.PORT) : 5173,
      proxy: {
        '/api': {
          target: env.API_BASE_URL,
          changeOrigin: true
        }
      }
    }
  }
})

// In application code, VITE_ prefixed vars are auto-loaded
// .env.local:
// VITE_API_KEY=abc123
// VITE_FEATURE_FLAG=true

// src/main.js:
console.log(import.meta.env.VITE_API_KEY) // 'abc123'
console.log(import.meta.env.MODE) // 'development' or 'production'
```

### Create Custom Plugin

Author Vite plugins to extend build and dev server functionality.

```js
import { Plugin } from 'vite'

// Simple transform plugin
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',

    // Transform custom file types
    transform(code, id) {
      if (id.endsWith('.custom')) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null
        }
      }
    }
  }
}

// Virtual module plugin
export function virtualModulePlugin(): Plugin {
  const virtualModuleId = 'virtual:my-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'virtual-module',

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const config = { apiUrl: 'https://api.example.com' }`
      }
    }
  }
}

// HMR plugin with custom handling
export function hmrPlugin(): Plugin {
  return {
    name: 'custom-hmr',

    handleHotUpdate({ file, server, modules }) {
      if (file.endsWith('.data.json')) {
        console.log('Data file updated:', file)

        // Send custom event to client
        server.ws.send({
          type: 'custom',
          event: 'data-update',
          data: { file }
        })

        // Prevent default HMR
        return []
      }
    }
  }
}

// Usage in vite.config.js
import { defineConfig } from 'vite'
import { myPlugin, virtualModulePlugin, hmrPlugin } from './plugins'

export default defineConfig({
  plugins: [
    myPlugin(),
    virtualModulePlugin(),
    hmrPlugin()
  ]
})
```

### Middleware Mode Integration

Integrate Vite dev server into existing Node.js servers (Express, Koa, etc).

```js
import express from 'express'
import { createServer as createViteServer } from 'vite'

const app = express()

// Create Vite server in middleware mode
const vite = await createViteServer({
  server: {
    middlewareMode: true
  },
  appType: 'custom'
})

// Use vite's connect middleware
app.use(vite.middlewares)

// Custom API routes
app.get('/api/users', async (req, res) => {
  res.json({ users: ['Alice', 'Bob'] })
})

// SSR route handler
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // Transform index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8'
    )
    template = await vite.transformIndexHtml(url, template)

    // Load and render app
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')
    const appHtml = await render(url)

    const html = template.replace(`<!--ssr-outlet-->`, appHtml)
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    vite.ssrFixStacktrace(e)
    next(e)
  }
})

app.listen(5173)
```

### Resolve Configuration

Programmatically resolve Vite configuration with all defaults applied.

```js
import { resolveConfig } from 'vite'

// Resolve config for development
const devConfig = await resolveConfig(
  {
    configFile: './vite.config.js',
    mode: 'development'
  },
  'serve',
  'development',
  'development'
)

console.log(devConfig.root) // Resolved project root
console.log(devConfig.server.port) // Resolved port number
console.log(devConfig.plugins) // All resolved plugins

// Check if an ID is considered an asset
const isAsset = devConfig.assetsInclude('/images/logo.png')
console.log(isAsset) // true

// Resolve config for production build
const buildConfig = await resolveConfig(
  { mode: 'production' },
  'build',
  'production',
  'production'
)

console.log(buildConfig.build.outDir) // 'dist'
console.log(buildConfig.build.minify) // 'esbuild' or 'terser'
```

### Optimize Dependencies

Programmatically optimize dependencies using esbuild (typically used by CLI).

```js
import { resolveConfig, optimizeDeps } from 'vite'

// Resolve configuration first
const config = await resolveConfig(
  { configFile: './vite.config.js' },
  'build',
  'production'
)

// Run dependency optimization
const metadata = await optimizeDeps(config, true)

console.log('Optimized dependencies:', Object.keys(metadata.optimized))
console.log('Discovered dependencies:', Object.keys(metadata.discovered))

// Access optimization metadata
for (const [id, info] of Object.entries(metadata.optimized)) {
  console.log(`${id}: ${info.file}`)
  console.log(`  Browser hash: ${info.browserHash}`)
  console.log(`  Needs interop: ${info.needsInterop}`)
}

// Use in custom build pipeline
import { build } from 'vite'

// Pre-optimize deps before building
await optimizeDeps(config)

// Then run the build
await build(config)
```

### Environment API Configuration (Experimental)

Configure multiple build environments for client, SSR, and edge workers.

```js
import { defineConfig } from 'vite'

// Configure multiple environments (Vite 7+)
export default defineConfig({
  build: {
    sourcemap: false, // Inherited by all environments
  },
  optimizeDeps: {
    include: ['lib'], // Only applies to client environment
  },
  environments: {
    // Client environment (browser) - configured via top-level options
    client: {
      build: {
        outDir: 'dist/client'
      }
    },
    // SSR environment (Node.js server)
    ssr: {
      build: {
        outDir: 'dist/server',
        target: 'node20'
      }
    },
    // Edge environment (Cloudflare Workers, etc.)
    edge: {
      resolve: {
        noExternal: true,
        conditions: ['edge', 'worker']
      },
      build: {
        outDir: 'dist/edge',
        rollupOptions: {
          external: ['cloudflare:workers']
        }
      }
    }
  }
})

// Access environments in server
import { createServer } from 'vite'

const server = await createServer()
const ssrEnvironment = server.environments.ssr
const clientEnvironment = server.environments.client

// Transform module in specific environment
const result = await ssrEnvironment.transformRequest('/src/app.js')
```

### Module Runner API (Experimental)

Create and use Module Runners to execute transformed code in different JavaScript runtimes.

```js
import {
  createServerModuleRunner,
  ModuleRunner,
  ESModulesEvaluator
} from 'vite'

// Create a module runner connected to Vite dev server
const server = await createServer({
  server: { middlewareMode: true }
})

const runner = await createServerModuleRunner(server.environments.ssr)

// Execute module and get exports
const mod = await runner.import('/src/entry-server.js')
const { render } = mod
const html = await render({ url: '/about' })

// Module runner automatically handles HMR updates
// Modules are invalidated and re-executed on file changes

// Create custom module runner for non-Node runtimes
import { createWebSocketModuleRunnerTransport } from 'vite/module-runner'

const transport = createWebSocketModuleRunnerTransport({
  fetchModule: async (id) => {
    const response = await fetch(`/__vite_module__${id}`)
    return response.json()
  }
})

const customRunner = new ModuleRunner({
  evaluator: new ESModulesEvaluator(),
  transport,
  hmr: {
    logger: console
  }
})

// Execute modules in custom runtime
await customRunner.import('/src/app.js')

// Cleanup
await runner.close()
await server.close()
```

### Create Builder API

Create a builder instance for advanced multi-environment builds.

```js
import { createBuilder } from 'vite'

// Create builder for coordinated multi-environment builds
const builder = await createBuilder({
  environments: {
    client: {
      build: { outDir: 'dist/client' }
    },
    ssr: {
      build: { outDir: 'dist/server' }
    }
  }
})

// Build all environments in parallel
await builder.build()

// Or build specific environments
await builder.build(builder.environments.client)
await builder.build(builder.environments.ssr)

// Access individual build environments
const clientEnv = builder.environments.client
const ssrEnv = builder.environments.ssr

// Cleanup
await builder.close()
```

### Command Line Interface

Vite CLI commands for development, build, and preview workflows.

```bash
# Start dev server on default port (5173)
vite

# Start dev server on custom port with CORS enabled
vite --port 3000 --host 0.0.0.0 --cors --open

# Force re-optimize dependencies
vite --force

# Start with custom config file
vite --config vite.custom.config.js --mode staging

# Build for production
vite build

# Build with source maps and custom output directory
vite build --sourcemap --outDir build --base /my-app/

# Build for SSR
vite build --ssr src/entry-server.js

# Build in watch mode for development
vite build --watch

# Preview production build
vite preview

# Preview on custom port
vite preview --port 8080 --open

# Optimize dependencies (useful for CI/CD)
vite optimize

# Show debug logs for specific features
vite --debug hmr,transform

# Enable profiling for performance analysis
vite build --profile
```

### Merge Configurations

Deep merge multiple Vite configuration objects.

```js
import { defineConfig, mergeConfig } from 'vite'

// Base configuration
const baseConfig = defineConfig({
  plugins: [],
  server: { port: 3000 },
  build: { outDir: 'dist' }
})

// Environment-specific overrides
const prodConfig = {
  build: {
    minify: 'terser',
    sourcemap: false
  }
}

// Merge configurations
export default defineConfig(({ mode }) => {
  if (mode === 'production') {
    return mergeConfig(baseConfig, prodConfig)
  }
  return baseConfig
})

// Merge with callback config
export default defineConfig((configEnv) => {
  const baseConfigResolved = typeof baseConfig === 'function'
    ? baseConfig(configEnv)
    : baseConfig

  return mergeConfig(baseConfigResolved, {
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  })
})
```

### CSS Preprocessing

Transform CSS with preprocessors and extract CSS modules.

```js
import { preprocessCSS } from 'vite'

// Preprocess SCSS file
const result = await preprocessCSS(
  `$primary: #3498db;
   .button { background: $primary; }`,
  'styles.scss',
  resolvedConfig
)

console.log(result.code) // Compiled CSS
console.log(result.map) // Source map
console.log(result.deps) // Set of dependency file paths

// CSS Modules processing
const moduleResult = await preprocessCSS(
  `.title { color: red; }`,
  'component.module.css',
  resolvedConfig
)

console.log(moduleResult.modules) // { title: '_title_abc123' }
console.log(moduleResult.code) // ._title_abc123 { color: red; }

// Usage in vite.config.js for custom CSS processing
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/variables.scss";`,
        api: 'modern-compiler'
      },
      less: {
        math: 'always'
      }
    },
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('postcss-nested')
      ]
    }
  }
})
```

### Transform with esbuild

Transform JavaScript/TypeScript code using esbuild for fast transpilation.

```js
import { transformWithEsbuild } from 'vite'

// Transform TypeScript to JavaScript
const tsCode = `
  interface User {
    name: string;
    age: number;
  }

  const user: User = { name: 'Alice', age: 30 };
  export default user;
`

const result = await transformWithEsbuild(
  tsCode,
  'user.ts',
  {
    loader: 'ts',
    target: 'es2020',
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
)

console.log(result.code) // Transpiled JavaScript
console.log(result.map) // Source map

// Transform JSX with custom pragma
const jsxCode = `
  export const App = () => <div className="app">Hello</div>
`

const jsxResult = await transformWithEsbuild(
  jsxCode,
  'App.jsx',
  {
    loader: 'jsx',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  }
)

console.log(jsxResult.code) // React.createElement('div', ...)
```

### Transform with Oxc

Transform JavaScript/TypeScript code using Oxc for even faster transpilation (Vite 8+).

```js
import { transformWithOxc } from 'vite'

// Transform TypeScript with Oxc (faster than esbuild)
const tsCode = `
  interface Config {
    apiUrl: string;
    timeout: number;
  }

  export const config: Config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
  };
`

const result = await transformWithOxc(
  tsCode,
  'config.ts',
  {
    lang: 'ts',
    target: 'es2020'
  }
)

console.log(result.code) // Transpiled JavaScript
console.log(result.map) // Source map

// Transform JSX with Oxc
const jsxCode = `
  export const Button = ({ label }) => (
    <button className="btn">{label}</button>
  )
`

const jsxResult = await transformWithOxc(
  jsxCode,
  'Button.jsx',
  {
    lang: 'jsx',
    jsx: {
      runtime: 'automatic',
      importSource: 'react'
    }
  }
)

console.log(jsxResult.code) // Transformed with automatic JSX runtime
```

## Use Cases and Integration

Vite excels in modern frontend development workflows across single-page applications, multi-page applications, libraries, and server-side rendering scenarios. The instant server start makes it ideal for large-scale applications where traditional bundlers struggle with slow startup times. During development, Vite's native ESM approach means modules are transformed on-demand only when requested by the browser, enabling sub-100ms HMR regardless of application size. The plugin system allows seamless integration with any framework through official plugins (@vitejs/plugin-vue, @vitejs/plugin-react, @vitejs/plugin-svelte) while maintaining compatibility with both Rollup and Rolldown plugin ecosystems. Vite 8's experimental Environment API enables projects to define multiple build environments (client, SSR, edge workers) that can be developed and built concurrently, matching production architectures more closely during development.

Production builds leverage Rolldown's high-performance optimization capabilities including tree-shaking, code splitting, and asset optimization to generate highly efficient bundles targeting baseline-widely-available browsers by default. Rolldown provides significantly faster build times compared to traditional bundlers while maintaining compatibility with the Rollup plugin ecosystem. Vite's library mode enables building reusable component libraries with multiple output formats (ES modules, CommonJS, UMD), while the enhanced SSR support provides first-class integration with meta-frameworks like Nuxt, SvelteKit, and Astro. The Module Runner API allows code execution in different JavaScript runtimes (Node.js, Cloudflare Workers, Deno) with full HMR support, enabling framework authors to build advanced SSR and edge computing solutions. The middleware mode facilitates custom server integration for projects requiring backend logic alongside the dev server, and the JavaScript API enables programmatic control for advanced use cases like testing, custom build pipelines, and tooling integration. Vite 8 also introduces Oxc for faster TypeScript and JSX transformation, providing an alternative to esbuild with improved performance. Environment variable handling, TypeScript support, and CSS preprocessing work out of the box, reducing configuration overhead while maintaining full customization options for complex requirements.

optional from here down
### Electron Main Process Entry Point

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Example of an Electron main process entry point (`electron/main.ts`) that creates a BrowserWindow and loads the application content.

```typescript
import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: 'Main window',
  })

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // Load your file
    win.loadFile('dist/index.html');
  }
})
```

--------------------------------

### Install vite-plugin-electron

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Installs the vite-plugin-electron package as a development dependency.

```sh
npm i -D vite-plugin-electron
```

--------------------------------

### JavaScript API Usage Example

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Demonstrates how to use the `build` and `startup` functions from `vite-plugin-electron` in a Vite configuration file to manage the Electron application build and startup process.

```js
import { build, startup } from 'vite-plugin-electron'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

build({
  entry: 'electron/main.ts',
  vite: {
    mode: process.env.NODE_ENV,
    build: {
      minify: isProd,
      watch: isDev ? {} : null,
    },
    plugins: [{
      name: 'plugin-start-electron',
      closeBundle() {
        if (isDev) {
          // Startup Electron App
          startup()
        }
      },
    }],
  },
})
```

--------------------------------

### ElectronOptions Interface

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Defines the configuration options for the vite-plugin-electron plugin. It allows specifying the entry point, Vite configuration, and a callback for when the Electron app starts.

```ts
export interface ElectronOptions {
  /**
   * Shortcut of `build.lib.entry`
   */
  entry?: import('vite').LibraryOptions['entry']
  vite?: import('vite').InlineConfig
  /**
   * Triggered when Vite is built every time -- `vite serve` command only.
   *
   * If this `onstart` is passed, Electron App will not start automatically.
   * However, you can start Electroo App via `startup` function.
   */
  onstart?: (args: {
    /**
     * Electron App startup function.
     * It will mount the Electron App child-process to `process.electronApp`.
     * @param argv default value `['.', '--no-sandbox']`
     * @param options options for `child_process.spawn`
     * @param customElectronPkg custom electron package name (default: 'electron')
     */
    startup: (argv?: string[], options?: import('node:child_process').SpawnOptions, customElectronPkg?: string) => Promise<void>
    /** Reload Electron-Renderer */
    reload: () => void
  }) => void | Promise<void>
}
```

--------------------------------

### Recommended Project Structure

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Illustrates a recommended project structure for an Electron application using Vite, highlighting the placement of the Electron main process file and the Vite configuration file.

```diff
+ ├─┬ electron
+ │ └── main.ts
  ├─┬ src
  │ ├── main.ts
  │ ├── style.css
  │ └── vite-env.d.ts
  ├── .gitignore
  ├── favicon.svg
  ├── index.html
  ├── package.json
  ├── tsconfig.json
+ └── vite.config.ts
```

--------------------------------

### Build Formats (Module Type)

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Details the output formats and file suffixes for the main process, preload scripts, and renderer process when the project is configured with `"type": "module"`.

```log
{ "type": "module" }
┏————————————————————┳——————————┳———————————┓
│       built        │  format  │   suffix  │
┠————————————————————╂——————————╂———————————┨
│ main process       │   esm    │    .js    │
┠————————————————————╂——————————╂———————————┨
│ preload scripts    │   cjs    │   .mjs    │ diff
┠————————————————————╂——————————╂———————————┨
│ renderer process   │    -     │    .js    │
┗————————————————————┸——————————┸———————————┛
```

--------------------------------

### Configure vite.config.ts with Simple API

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Configures vite-plugin-electron using the simple API in vite.config.ts. It specifies entry points for the main process and preload scripts.

```js
import electron from 'vite-plugin-electron/simple'

export default {
  plugins: [
    electron({
      main: {
        // Shortcut of `build.lib.entry`
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`
        input: 'electron/preload.ts',
      },
      // Optional: Use Node.js API in the Renderer process
      renderer: {},
    }),
  ],
}
```

--------------------------------

### Build Formats (CommonJS Type - Default)

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Details the output formats and file suffixes for the main process, preload scripts, and renderer process when the project uses the default CommonJS module type.

```log
{ "type": "commonjs" } - default
┏————————————————————┳——————————┳———————————┓
│       built        │  format  │   suffix  │
┠————————————————————╂——————————╂———————————┨
│ main process       │   cjs    │    .js    │
┠————————————————————╂——————————╂———————————┨
│ preload scripts    │   cjs    │    .js    │ diff
┠————————————————————╂——————————╂———————————┨
│ renderer process   │    -     │    .js    │
┗————————————————————┸——————————┸———————————┛
```

--------------------------------

### Update package.json for Electron Main Entry

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Adds the 'main' field to package.json to specify the compiled main process entry point for Electron.

```json
{
  "main": "dist-electron/main.mjs"
}
```

--------------------------------

### vite-plugin-electron JavaScript API Reference

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Provides a reference to the core JavaScript APIs exposed by `vite-plugin-electron`. These functions are designed to be used within your Vite configuration for managing Electron builds and processes.

```APIDOC
vite-plugin-electron JavaScript API:

- `ElectronOptions` - type definition for plugin configuration.
- `resolveViteConfig` - function, Resolves the default Vite `InlineConfig` for building the Electron-Main process.
- `withExternalBuiltins` - function, A utility function for managing external dependencies.
- `build` - function, Initiates the Electron application build process with specified options.
- `startup` - function, Starts or restarts the Electron application.

Usage Recommendation:
It is recommended to use TypeScript or enable JS type checking in your IDE (like VS Code) to leverage the full IntelliSense and validation capabilities of these typed APIs.
```

--------------------------------

### Configure vite.config.ts with Flat API

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Configures vite-plugin-electron using the flat API in vite.config.ts, offering more flexibility for custom configurations.

```js
import electron from 'vite-plugin-electron'

export default {
  plugins: [
    electron({
      entry: 'electron/main.ts',
    }),
  ],
}
```

--------------------------------

### Configure External Node.js Modules

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.zh-CN.md

Demonstrates how to configure external Node.js modules within the Vite build process for vite-plugin-electron. This is particularly useful for native C/C++ modules that Vite might not build correctly. The `external` option in Rollup's configuration prevents Vite from bundling these modules, allowing them to be loaded as external packages.

```javascript
electron({
  entry: 'electron/main.ts',
  vite: {
    build: {
      rollupOptions: {
        // Here are some C/C++ modules them can't be built properly.
        external: [
          'serialport',
          'sqlite3',
        ],
      },
    },
  },
}),
```

--------------------------------

### Using vite-plugin-native

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Integrates the `vite-plugin-native` into the Vite configuration to handle native modules. This plugin provides an alternative approach to managing native dependencies within a Vite-based Electron project.

```js
import native from 'vite-plugin-native'

export default {
  plugins: [
    electron({
      entry: 'electron/main.ts',
      vite: {
        plugins: [
          native(/* options */),
        ],
      },
    }),
  ],
}
```

--------------------------------

### Hot Reloading Preload Scripts

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Explains how to implement hot-reloading for preload scripts in Electron applications using `vite-plugin-electron`. When preload scripts are rebuilt, an event is sent to the main process, which can then trigger a renderer process reload.

```js
// electron/main.ts

process.on('message', (msg) => {
  if (msg === 'electron-vite&type=hot-reload') {
    for (const win of BrowserWindow.getAllWindows()) {
      // Hot reload preload scripts
      win.webContents.reload()
    }
  }
})
```

--------------------------------

### Not Bundle CJS Modules in Development

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Configures `vite-plugin-electron` to exclude CommonJS modules from bundling during the development (`serve`) command. This leverages Vite's 'Not Bundle' feature for faster development builds by skipping the bundling of certain Node.js modules.

```js
import electron from 'vite-plugin-electron'
import { notBundle } from 'vite-plugin-electron/plugin'

export default defineConfig(({ command }) => ({
  plugins: [
    electron({
      entry: 'electron/main.ts',
      vite: {
        plugins: [
          command === 'serve' && notBundle(/* NotBundleOptions */),
        ],
      },
    }),
  ]
}))
```

--------------------------------

### External C/C++ Modules in Vite

Source: https://github.com/electron-vite/vite-plugin-electron/blob/main/README.md

Configures Vite to treat specific C/C++ native modules as external, preventing Vite from attempting to build them directly. This is useful when native modules are complex or have build processes not compatible with Vite's default bundling.

```js
export default {
  plugins: [
    electron({
      entry: 'electron/main.ts',
      vite: {
        build: {
          rollupOptions: {
            // Here are some C/C++ modules them can't be built properly
            external: [
              'serialport',
              'sqlite3',
            ],
          },
        },
      },
    }),
  ],
}
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.