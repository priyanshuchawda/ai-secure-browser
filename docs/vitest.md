### Install Vitest via Package Managers

Source: https://vitest.dev/guide/index

Installation commands for adding Vitest as a development dependency across multiple package managers (npm, yarn, pnpm, bun). Choose one command based on your project's package manager. Requires Vite >=v6.0.0 and Node >=v20.0.0.

```bash
npm install -D vitest
```

```bash
yarn add -D vitest
```

```bash
pnpm add -D vitest
```

```bash
bun add -D vitest
```

--------------------------------

### Initialize Vitest Browser Mode

Source: https://vitest.dev/guide/browser

Installs Vitest with browser support and sets up the necessary configuration. This command simplifies the initial setup process for browser testing.

```bash
npx vitest init browser
```

```bash
yarn exec vitest init browser
```

```bash
pnpx vitest init browser
```

```bash
bunx vitest init browser
```

--------------------------------

### Vitest Configuration with `vitest.config.ts`

Source: https://vitest.dev/guide/index

Configure Vitest using a dedicated `vitest.config.ts` file when not using Vite or when a separate configuration is needed. This file allows defining test-specific options. It relies on `vitest/config` for its configuration.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
  },
})
```

--------------------------------

### Install Vitest UI

Source: https://vitest.dev/guide/ui

Installs the Vitest UI package as a development dependency. This is the first step to enable the interactive testing UI.

```bash
npm i -D @vitest/ui
```

--------------------------------

### Install Istanbul Coverage Provider Package

Source: https://vitest.dev/guide/coverage

Installs the Istanbul coverage provider package as a development dependency. This package enables instrumented code coverage collection in Vitest and can be installed manually or automatically when starting Vitest.

```bash
npm i -D @vitest/coverage-istanbul
```

--------------------------------

### Configure Test Script in package.json

Source: https://vitest.dev/guide/index

Adds a test script to package.json that runs Vitest when executing `npm run test`, `yarn test`, or `pnpm test`. This configuration enables easy test execution from the command line.

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

--------------------------------

### Start Vitest with UI

Source: https://vitest.dev/guide/ui

Launches Vitest with the interactive UI enabled. This command starts the development server and opens the UI in the browser.

```bash
vitest --ui
```

--------------------------------

### Vitest Project Configuration for Default Fixtures

Source: https://vitest.dev/guide/test-context

Provides an example Vitest configuration file ('vitest.config.ts') that defines multiple projects, each with a potentially different value for the 'url' provide option. This complements the 'injected: true' fixture setup to enable project-specific fixture values.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'project-new',
        },
      },
      {
        test: {
          name: 'project-full',
          provide: {
            url: '/full',
          },
        },
      },
      {
        test: {
          name: 'project-empty',
          provide: {
            url: '/empty',
          },
        },
      },
    ],
  },
})
```

--------------------------------

### Configure Different Browser Setups with Setup Files and Providers

Source: https://vitest.dev/guide/browser/multiple-setups

Define multiple browser instances with different configuration options including setup files, custom names, and provided values. Each instance can have independent configurations while running the same tests, with values injected via the provide field.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        {
          browser: 'chromium',
          name: 'chromium-1',
          setupFiles: ['./ratio-setup.ts'],
          provide: {
            ratio: 1,
          },
        },
        {
          browser: 'chromium',
          name: 'chromium-2',
          provide: {
            ratio: 2,
          },
        },
      ],
    },
  },
})
```

--------------------------------

### Configuring Multiple Test Projects in Vitest

Source: https://vitest.dev/guide/index

Set up and run different test configurations within the same project using the `projects` array in `vitest.config.ts`. This allows defining multiple test environments or configurations, specified by glob patterns or explicit configuration objects for each project.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      // you can use a list of glob patterns to define your projects
      // Vitest expects a list of config files
      // or directories where there is a config file
      'packages/*',
      'tests/*/vitest.config.{e2e,unit}.ts',
      // you can even run the same tests,
      // but with different configs in the same "vitest" process
      {
        test: {
          name: 'happy-dom',
          root: './shared_tests',
          environment: 'happy-dom',
          setupFiles: ['./setup.happy-dom.ts'],
        },
      },
      {
        test: {
          name: 'node',
          root: './shared_tests',
          environment: 'node',
          setupFiles: ['./setup.node.ts'],
        },
      },
    ],
  },
})
```

--------------------------------

### Write Vitest Test Case

Source: https://vitest.dev/guide/index

Creates a test file using Vitest's test and expect functions to verify that the sum function correctly adds 1 + 2 to equal 3. Test files must contain `.test.` or `.spec.` in their filename to be recognized by Vitest.

```javascript
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

--------------------------------

### Manually Install Vitest Browser Preview Provider

Source: https://vitest.dev/guide/browser

Manually installs Vitest along with the browser preview provider. The preview provider is suitable for quickly previewing test behavior but is not recommended for CI environments.

```bash
npm install -D vitest @vitest/browser-preview
```

```bash
yarn add -D vitest @vitest/browser-preview
```

```bash
pnpm add -D vitest @vitest/browser-preview
```

```bash
bun add -D vitest @vitest/browser-preview
```

--------------------------------

### Vite Configuration with Vitest Integration (`vite.config.ts`)

Source: https://vitest.dev/guide/index

Integrate Vitest configuration directly into your existing `vite.config.ts` file. This approach leverages Vite's configuration and requires adding a triple-slash directive for Vitest types. The `test` property within `defineConfig` is used to specify Vitest options.

```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ...
  },
})
```

--------------------------------

### Vitest v4: Standalone Mode Configuration in package.json

Source: https://vitest.dev/guide/migration

Provides examples of configuring Vitest's standalone mode within a `package.json` file. Demonstrates how to initiate standalone mode and subsequently run specific test files using command-line arguments.

```json
{
  "scripts": {
    "test:dev": "vitest --standalone"
  }
}
```

```bash
# Start Vitest in standalone mode, without running any files on start
$ pnpm run test:dev

# Run math.test.ts immediately
$ pnpm run test:dev math.test.ts
```

--------------------------------

### Create a Custom Vitest Environment

Source: https://vitest.dev/guide/environment

This example shows how to create a custom Vitest environment. It defines a package structure and exports an `Environment` object with `name`, `viteEnvironment`, and optional `setupVM` and `setup` functions. The `setupVM` function is used for environments supporting the 'experimental-vm' pool and returns VM context and teardown logic. The `setup` function provides custom setup and teardown logic for the environment.

```typescript
import type { Environment } from 'vitest/environments'

export default <Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',
  // optional - only if you support "experimental-vm" pool
  async setupVM() {
    const vm = await import('node:vm')
    const context = vm.createContext()
    return {
      getVmContext() {
        return context
      },
      teardown() {
        // called after all tests with this env have been run
      }
    }
  },
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      }
    }
  }
}
```

--------------------------------

### Configure Vitest DOM Environment

Source: https://vitest.dev/guide/features

Provides examples for installing and configuring DOM environments (happy-dom or jsdom) for Vitest. After installation, the `environment` option in `vitest.config.ts` should be updated to specify the desired environment ('happy-dom', 'jsdom', or 'node').

```bash
# Install happy-dom
npm i -D happy-dom

# Install jsdom
npm i -D jsdom
```

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom', // or 'jsdom', 'node'
  },
})
```

--------------------------------

### Install V8 Coverage Provider Package

Source: https://vitest.dev/guide/coverage

Installs the V8 coverage provider package as a development dependency. This package is required to use V8 for code coverage collection in Vitest and can be installed manually or automatically when starting Vitest.

```bash
npm i -D @vitest/coverage-v8
```

--------------------------------

### Create Vitest Instance Without Starting Tests

Source: https://vitest.dev/guide/advanced

Creates a Vitest instance using the `createVitest` function. It returns the same Vitest instance as `startVitest` but does not initiate test execution or validate installed packages. Accepts run mode, CLI options, Vite overrides, and Vitest options.

```javascript
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
```

--------------------------------

### Istanbul Coverage Instrumentation Example

Source: https://vitest.dev/guide/coverage

Demonstrates how Istanbul instruments source code by adding coverage tracking counters for branches and functions. This simplified example shows branch and function coverage counters being incremented at runtime to track code execution paths. The instrumented code stores coverage data in a global object for reporting.

```javascript
// Simplified example of branch and function coverage counters
const coverage = {
  branches: { 1: [0, 0] },
  functions: { 1: 0 },
}

export function getUsername(id) {
  // Function coverage increased when this is invoked
  coverage.functions['1']++

  if (id == null) {
    // Branch coverage increased when this is invoked
    coverage.branches['1'][0]++

    throw new Error('User ID is required')
  }
  // Implicit else coverage increased when if-statement condition not met
  coverage.branches['1'][1]++

  return database.getUser(id)
}

globalThis.__VITEST_COVERAGE__ ||= {}
globalThis.__VITEST_COVERAGE__[filename] = coverage
```

--------------------------------

### Manually Install Vitest Browser Playwright Provider

Source: https://vitest.dev/guide/browser

Manually installs Vitest and the browser Playwright provider. Playwright is recommended for CI and local testing, offering robust browser automation and parallel execution capabilities.

```bash
npm install -D vitest @vitest/browser-playwright
```

```bash
yarn add -D vitest @vitest/browser-playwright
```

```bash
pnpm add -D vitest @vitest/browser-playwright
```

```bash
bun add -D vitest @vitest/browser-playwright
```

--------------------------------

### Manually Install Vitest Browser WebdriverIO Provider

Source: https://vitest.dev/guide/browser

Manually installs Vitest and the browser WebdriverIO provider. WebdriverIO is an alternative for CI and local testing, utilizing the WebDriver protocol for browser automation.

```bash
npm install -D vitest @vitest/browser-webdriverio
```

```bash
yarn add -D vitest @vitest/browser-webdriverio
```

```bash
pnpm add -D vitest @vitest/browser-webdriverio
```

```bash
bun add -D vitest @vitest/browser-webdriverio
```

--------------------------------

### Configure Vitest Browser Mode with Qwik Integration (SSR)

Source: https://vitest.dev/guide/browser

Example Vitest configuration for Qwik projects, enabling browser mode with Playwright and optionally using an SSR plugin for testing.

```typescript
import { defineConfig } from 'vitest/config'
import { qwikVite } from '@builder.io/qwik/optimizer'
import { playwright } from '@vitest/browser-playwright'

// optional, run the tests in SSR mode
import { testSSR } from 'vitest-browser-qwik/ssr-plugin'

export default defineConfig({
  plugins: [testSSR(), qwikVite()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    },
  },
})
```

--------------------------------

### Merging Vite and Vitest Configurations

Source: https://vitest.dev/guide/index

Combine separate Vite and Vitest configuration files using `mergeConfig`. This is useful when maintaining distinct configuration files for development and testing. The `mergeConfig` utility from `vitest/config` allows merging Vite's configuration with Vitest's specific settings.

```typescript
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    // ...
  },
}))
```

```typescript
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],
})
```

--------------------------------

### Initialize Vitest project configuration

Source: https://vitest.dev/guide/cli

Setup Vitest project configuration for specific features like browser testing. Currently supports browser configuration initialization.

```bash
vitest init browser
```

--------------------------------

### Combine Reporters with Multiple Output Files

Source: https://vitest.dev/guide/reporters

Demonstrates configuring multiple reporters to write their output to distinct files. This example sets up 'junit', 'json', and 'verbose' reporters with specified output file paths.

```typescript
export default defineConfig({
  test: {
    reporters: ['junit', 'json', 'verbose'],
    outputFile: {
      junit: './junit-report.xml',
      json: './json-report.json',
    },
  },
})
```

--------------------------------

### Preview HTML Report with Vite

Source: https://vitest.dev/guide/ui

Serves the generated static HTML report using Vite's preview command. This allows you to view the report in a browser before deployment.

```sh
npx vite preview --outDir ./html
```

--------------------------------

### Configure Reporters with Custom Options

Source: https://vitest.dev/guide/reporters

Shows how to configure reporters with specific options. This example demonstrates adding the 'junit' reporter with a custom suite name.

```typescript
export default defineConfig({
  test: {
    reporters: [
      'default',
      ['junit', { suiteName: 'UI tests' }]
    ],
  },
})
```

--------------------------------

### Vitest beforeEach Hook with Setup

Source: https://vitest.dev/guide/migration

Adapts a Jest `beforeEach` hook to Vitest syntax. Vitest allows hooks to return teardown functions, requiring a block body syntax if the hook performs asynchronous setup or returns a value other than undefined/null.

```typescript
beforeEach(() => setActivePinia(createTestingPinia()))
```

```typescript
beforeEach(() => { setActivePinia(createTestingPinia()) })
```

--------------------------------

### Lit Element Testing with Vitest Browser Lit (TypeScript)

Source: https://vitest.dev/guide/browser

This snippet shows how to test a Lit element using `vitest-browser-lit`. It renders a Lit component within the test environment. The example sets up the basic rendering of a `<greeter-button>` element. This requires the `vitest-browser-lit` package and a `greeter-button` element defined elsewhere.

```typescript
import { render } from 'vitest-browser-lit'
import { html } from 'lit'
import './greeter-button'

test('greeting appears on click', async () => {
  const screen = render(html`<greeter-button name="World"></greeter-button>`)


```

--------------------------------

### Filter Browser Instances with --project CLI Flag

Source: https://vitest.dev/guide/browser/multiple-setups

Run specific browser instances using the --project flag from the command line. Vitest automatically assigns browser names as project names, or merges them with root config names using the format 'custom -> custom (browser)'.

```shell
vitest --project=chromium
```

--------------------------------

### Extending Vitest Test Context with Custom Fixtures

Source: https://vitest.dev/guide/test-context

Demonstrates how to extend Vitest's `test` API using `test.extend` to define custom fixtures like `todos` and `archive`. This allows for reusable setup, execution, and cleanup logic across tests.

```typescript
import { test as baseTest } from 'vitest'

const todos = []
const archive = []

export const test = baseTest.extend({
  todos: async ({}, use) => {
    // setup the fixture before each test function
    todos.push(1, 2, 3)

    // use the fixture value
    await use(todos)

    // cleanup the fixture after each test function
    todos.length = 0
  },
  archive
})
```

--------------------------------

### Profile Main Thread Performance with Node.js Args

Source: https://vitest.dev/guide/profiling-test-performance

Profile the main thread of Vitest, which includes Vite's usage and global setup files. This is done by passing Node.js profiling arguments directly when executing Vitest from the command line. The generated CPU profiles can help identify performance issues in Vite plugins or setup scripts.

```bash
$ node --cpu-prof --cpu-prof-dir=main-profile ./node_modules/vitest/vitest.mjs --run
```

--------------------------------

### Combine Multiple Reporters

Source: https://vitest.dev/guide/reporters

Illustrates how to use multiple reporters simultaneously to generate test output in different formats. This example uses 'json' and 'default' reporters.

```bash
npx vitest --reporter=json --reporter=default
```

```typescript
export default defineConfig({
  test: {
    reporters: ['json', 'default'],
    outputFile: './test-output.json'
  },
})
```

--------------------------------

### React Component Testing with Vitest Browser React (TypeScript)

Source: https://vitest.dev/guide/browser

An example of testing a React component using `vitest-browser-react`. It renders a React component that fetches data, simulates a click event to trigger the fetch, and asserts the content of a heading element and the disabled state of a button. This requires the `vitest-browser-react` package and a `fetch.jsx` file.

```typescript
import { render } from 'vitest-browser-react'
import Fetch from './fetch'

test('loads and displays greeting', async () => {
  // Render a React element into the DOM
  const screen = render(<Fetch url="/greeting" />)

  await screen.getByText('Load Greeting').click()
  // wait before throwing an error if it cannot find an element
  const heading = screen.getByRole('heading')

  // assert that the alert message is correct
  await expect.element(heading).toHaveTextContent('hello there')
  await expect.element(screen.getByRole('button')).toBeDisabled()
})
```

--------------------------------

### Create Simple Sum Function

Source: https://vitest.dev/guide/index

Basic JavaScript function that adds two numbers together. This function will be tested in the subsequent test file to demonstrate Vitest's testing capabilities and assertion methods.

```javascript
export function sum(a, b) {
  return a + b
}
```

--------------------------------

### Configure Multiple Browser Instances in Vitest

Source: https://vitest.dev/guide/browser/multiple-setups

Set up Vitest to run tests across multiple browsers (Chromium, Firefox, WebKit) using the browser.instances configuration option. This approach provides improved caching compared to test projects since all instances share the same Vite server.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
  },
})
```

--------------------------------

### GitHub Actions Workflow for Vitest Test Sharding

Source: https://vitest.dev/guide/improving-performance

This workflow automates Vitest test execution across multiple shards on GitHub Actions. It checks out code, sets up Node.js and pnpm, installs dependencies, runs tests using sharding, uploads test reports as artifacts, and then merges these reports.

```yaml
name: Tests
on:
  push:
    branches:
      - main
jobs:
  tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@a7487c7e89a18df4991f7f222e4898a00d66ddda # v4.1.0

      - name: Install dependencies
        run: pnpm i

      - name: Run tests
        run: pnpm run test --reporter=blob --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: Upload blob report to GitHub Actions Artifacts
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shardIndex }}
          path: .vitest-reports/*
          include-hidden-files: true
          retention-days: 1

  merge-reports:
    if: ${{ !cancelled() }}
    needs: [tests]

    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@a7487c7e89a18df4991f7f222e4898a00d66ddda # v4.1.0

      - name: Install dependencies
        run: pnpm i

      - name: Download blob reports from GitHub Actions Artifacts
        uses: actions/download-artifact@v4
        with:
          path: .vitest-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge reports
        run: npx vitest --merge-reports
```

--------------------------------

### Automatic Fixtures with Tuple Syntax in Vitest (TypeScript)

Source: https://vitest.dev/guide/test-context

Shows how to use the tuple syntax for defining fixtures in Vitest, enabling features like automatic initialization. The 'auto: true' option ensures the fixture setup and teardown functions run even if the fixture is not directly used in a test.

```typescript
import { test as base } from 'vitest'

const test = base.extend({
  fixture: [
    async ({}, use) => {
      // this function will run
      setup()
      await use()
      teardown()
    },
    { auto: true } // Mark as an automatic fixture
  ],
})

test('works correctly')
```

--------------------------------

### Configure Vitest Browser Mode with Solid Integration

Source: https://vitest.dev/guide/browser

Example Vitest configuration enabling browser mode with Playwright for SolidJS projects. It uses the Vite plugin for Solid.

```typescript
import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```

--------------------------------

### Testing SolidJS Components with @testing-library/solid

Source: https://vitest.dev/guide/browser

Demonstrates testing a SolidJS component that uses routing and parameters. It renders the component with a specific route and asserts that the correct parameter is displayed.

```tsx
// based on @testing-library/solid API
// https://testing-library.com/docs/solid-testing-library/api

import { render } from '@testing-library/solid'

it('uses params', async () => {
  const App = () => (
    <>
      <Route
        path="/ids/:id"
        component={() => (
          <p>
            Id:
            {useParams()?.id}
          </p>
        )}
      />
      <Route path="/" component={() => <p>Start</p>} />
    </>
  )
  const { baseElement } = render(() => <App />, { location: 'ids/1234' })
  const screen = page.elementLocator(baseElement)

  await expect.screen(screen.getByText('Id: 1234')).toBeInTheDocument()
})
```

--------------------------------

### Configure Vitest Browser Mode with Marko Integration

Source: https://vitest.dev/guide/browser

Example Vitest configuration enabling browser mode with Playwright for Marko projects. It includes the Marko Vite plugin.

```typescript
import { defineConfig } from 'vitest/config'
import marko from '@marko/vite'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [marko()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```

--------------------------------

### Start Vitest Tests Programmatically

Source: https://vitest.dev/guide/advanced

Starts Vitest tests using the Node API. It accepts run mode, CLI filters, CLI options, Vite overrides, and Vitest options. Returns a Vitest instance. If watch mode is off, it calls close automatically. If watch mode is on and the terminal supports TTY, console shortcuts are registered. Filters can be applied to narrow down test file paths. CLI arguments can override test configurations, and Vite config takes precedence.

```typescript
import { startVitest } from 'vitest/node'

async function runTests() {
  const vitest = await startVitest('test')
  // Access test results after execution
  console.log(vitest.state.getTestModules()) // [TestModule]
  await vitest.close()
}

runTests()
```

```javascript
import { startVitest } from 'vitest/node'

const vitest = await startVitest('test')

await vitest.close()
```

--------------------------------

### Migrate vitest.workspace.js to vitest.config.ts

Source: https://vitest.dev/guide/migration

Illustrates the transition from using a separate `vitest.workspace.js` file to defining projects directly within `vitest.config.ts`. This consolidates configuration and simplifies project management.

```typescript
import { defineWorkspace } from 'vitest/config' // [!code --]

export default defineWorkspace([
  './packages/*',
  {
    test: {
      name: 'unit',
    },
  }
])
```

--------------------------------

### Test User Interactions with Vitest Browser API

Source: https://vitest.dev/guide/browser/component-testing

Shows recommended patterns for testing actual user interactions like button clicks and form input using Vitest's page API. Includes examples of getting elements by role and filling input fields, contrasted with implementation-detail testing to avoid.

```tsx
// Good: Test actual user interactions
await page.getByRole('button', { name: /submit/i }).click()
await page.getByLabelText(/email/i).fill('user@example.com')

// Avoid: Testing implementation details
// component.setState({ email: 'user@example.com' })
```

--------------------------------

### Vue Component Testing with Vitest Browser Vue (TypeScript)

Source: https://vitest.dev/guide/browser

An example of testing a Vue component using `vitest-browser-vue`. It renders a Vue component, interacts with its elements using `render`'s screen object, and makes DOM assertions. This requires the `vitest-browser-vue` package and a `Component.vue` file.

```typescript
import { render } from 'vitest-browser-vue'
import Component from './Component.vue'

test('properly handles v-model', async () => {
  const screen = render(Component)

  // Asserts initial state.
  await expect.element(screen.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // Get the input DOM node by querying the associated label.
  const usernameInput = screen.getByLabelText(/username/i)

  // Type the name into the input. This already validates that the input
  // is filled correctly, no need to check the value manually.
  await usernameInput.fill('Bob')

  await expect.element(screen.getByText('Hi, my name is Bob')).toBeInTheDocument()
})
```

--------------------------------

### Configure Vitest Browser Mode with Svelte Integration

Source: https://vitest.dev/guide/browser

Example Vitest configuration enabling browser mode with Playwright for Svelte projects. It includes the necessary Vite plugin for Svelte.

```typescript
import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [svelte()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```

--------------------------------

### Svelte Component Testing with Vitest Browser Svelte (TypeScript)

Source: https://vitest.dev/guide/browser

Demonstrates testing a Svelte component using `vitest-browser-svelte`. It renders the Svelte component, simulates a button click, and asserts that the resulting greeting is displayed. This requires the `vitest-browser-svelte` package and a `greeter.svelte` file.

```typescript
import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'

import Greeter from './greeter.svelte'

test('greeting appears on click', async () => {
  const screen = render(Greeter, { name: 'World' })

  const button = screen.getByRole('button')
  await button.click()
  const greeting = screen.getByText(/hello world/iu)

  await expect.element(greeting).toBeInTheDocument()
})
```

--------------------------------

### Define Browser Instance Names for Project Filtering

Source: https://vitest.dev/guide/browser/multiple-setups

Configure explicit names for browser instances to enable filtering and distinguish between multiple instances of the same browser. Vitest uses browser name as default project name, but custom names can be assigned.

```typescript
export default defineConfig({
  test: {
    browser: {
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox', name: 'custom' },
      ]
    }
  }
})
```

```typescript
export default defineConfig({
  test: {
    name: 'custom',
    browser: {
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox', name: 'manual' },
      ]
    }
  }
})
```

--------------------------------

### Benchmark Tests with Vitest and Tinybench

Source: https://vitest.dev/guide/features

Experimental feature for running benchmark tests using Tinybench. It allows comparing the performance of different code implementations within describe blocks.

```typescript
import { bench, describe } from 'vitest'

describe('sort', () => {
  bench('normal', () => {
    const x = [1, 5, 4, 2, 3]
    x.sort((a, b) => {
      return a - b
    })
  })

  bench('reverse', () => {
    const x = [1, 5, 4, 2, 3]
    x.reverse().sort((a, b) => {
      return a - b
    })
  })
})
```

--------------------------------

### Configure Multiple Vitest Projects (Unit and Browser)

Source: https://vitest.dev/guide/browser

This configuration demonstrates how to set up multiple testing projects within Vitest. It includes separate configurations for unit (Node-based) and browser-based testing, each with its own include paths and environments.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          // an example of file based convention,
          // you don't have to follow it
          include: [
            'tests/unit/**/*.{test,spec}.ts',
            'tests/**/*.unit.{test,spec}.ts',
          ],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        test: {
          // an example of file based convention,
          // you don't have to follow it
          include: [
            'tests/browser/**/*.{test,spec}.ts',
            'tests/**/*.browser.{test,spec}.ts',
          ],
          name: 'browser',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
```

--------------------------------

### Configure custom coverage reporters in Vitest

Source: https://vitest.dev/guide/coverage

Registers custom coverage reporters by package name or absolute path in the Vitest configuration. Reporters must implement Istanbul's reporter interface and can receive configuration options passed from the setup.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: [
        // Specify reporter using name of the NPM package
        ['@vitest/custom-coverage-reporter', { someOption: true }],

        // Specify reporter using local path
        '/absolute/path/to/custom-reporter.cjs',
      ],
    },
  },
})
```

--------------------------------

### Configure HTTP Request Mocking with MSW in Vitest

Source: https://vitest.dev/guide/mocking/requests

Sets up Mock Service Worker (MSW) to mock HTTP GET requests to a specified endpoint. It includes defining mock data, setting up request handlers, starting the mock server before tests, closing it after all tests, and resetting handlers between tests for isolation. This setup is crucial for testing components that interact with external APIs without making actual network calls.

```javascript
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

export const restHandlers = [
  http.get('https://rest-endpoint.example/path/to/posts', () => {
    return HttpResponse.json(posts)
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```

--------------------------------

### Testing Marko Components with @marko/testing-library

Source: https://vitest.dev/guide/browser

Shows how to test a Marko component using @marko/testing-library. It renders a 'Greeting' component with a name prop and asserts that the rendered output contains the expected text and matches an inline snapshot.

```ts
// based on @testing-library/marko API
// https://testing-library.com/docs/marko-testing-library/api

import { render, screen } from '@marko/testing-library'
import Greeting from './greeting.marko'

test('renders a message', async () => {
  const { baseElement } = await render(Greeting, { name: 'Marko' })
  const screen = page.elementLocator(baseElement)
  await expect.element(screen.getByText(/Marko/)).toBeInTheDocument()
  expect(container.firstChild).toMatchInlineSnapshot(
    `<h1>Hello, Marko!</h1>`
  )
})
```

--------------------------------

### Configure Vitest Browser Mode with React Integration

Source: https://vitest.dev/guide/browser

Example Vitest configuration enabling browser mode with Playwright, specifically for React projects. It includes the necessary Vite plugin for React.

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```

--------------------------------

### Configure Reporters via CLI and Config File

Source: https://vitest.dev/guide/reporters

Demonstrates how to set Vitest reporters using the command line interface or within the vitest.config.ts file. This allows flexibility in choosing how test results are displayed.

```bash
npx vitest --reporter=verbose
```

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['verbose']
  },
})
```

--------------------------------

### Configure Vitest with Multiple Pools using Projects

Source: https://vitest.dev/guide/advanced/pool

Demonstrates how to use Vitest's `projects` feature to run tests with different pools. This example configures one project to use the default 'threads' pool and another to use a custom pool runner, allowing for diverse test execution strategies within a single project.

```typescript
import customPool from './my-custom-pool.ts'

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          pool: 'threads',
        },
      },
      {
        extends: true,
        test: {
          pool: customPool({
            customProperty: true,
          })
        }
      }
    ],
  },
})
```

--------------------------------

### Snapshot Test Example (TypeScript)

Source: https://vitest.dev/guide/snapshot

A simple Vitest test case that utilizes snapshot testing. It defines an object with a nested 'foo' property and uses `expect().toMatchSnapshot()` to generate or compare against a snapshot.

```typescript
test('foo snapshot test', () => {
  const bar = {
    foo: {
      x: 1,
      y: 2,
    },
  }

  expect(bar).toMatchSnapshot()
})
```

--------------------------------

### Greeting Component Test with Vitest Browser (Qwik)

Source: https://vitest.dev/guide/browser

Tests a Qwik component's greeting message after a button click using Vitest's browser testing capabilities. It renders the component, simulates a click, and asserts the presence of the greeting text.

```tsx
import { render } from 'vitest-browser-qwik'
import Greeting from './greeting'

test('greeting appears on click', async () => {
  // renderSSR and renderHook are also available
  const screen = render(<Greeting />)

  const button = screen.getByRole('button')
  await button.click()
  const greeting = screen.getByText(/hello world/iu)

  await expect.element(greeting).toBeInTheDocument()
})
```

--------------------------------

### Start Vitest in Watch Mode

Source: https://vitest.dev/guide/features

Initiates Vitest in watch mode, automatically rerunning tests when source or test files change. This mode is default in development. Explicit control can be achieved with `vitest watch` or `vitest run`.

```bash
$ vitest
```

--------------------------------

### Basic Browser Mode Test with DOM Assertions (JavaScript)

Source: https://vitest.dev/guide/browser

A basic Vitest Browser Mode test written in JavaScript. It renders DOM elements using a custom `render` function and uses `vitest/browser`'s `page` object to locate and interact with elements, asserting their presence and content. This example requires a local `my-render-function.js`.

```javascript
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'
import { render } from './my-render-function.js'

test('properly handles form inputs', async () => {
  render() // mount DOM elements

  // Asserts initial state.
  await expect.element(page.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // Get the input DOM node by querying the associated label.
  const usernameInput = page.getByLabelText(/username/i)

  // Type the name into the input. This already validates that the input
  // is filled correctly, no need to check the value manually.
  await usernameInput.fill('Bob')

  await expect.element(page.getByText('Hi, my name is Bob')).toBeInTheDocument()
})
```

--------------------------------

### Snapshot Comment Header Difference (Jest vs Vitest)

Source: https://vitest.dev/guide/snapshot

Illustrates the difference in the comment header generated in snapshot files between Jest and Vitest. Vitest uses a link to its own documentation.

```diff
- // Jest Snapshot v1, https://goo.gl/fbAQLP
+ // Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html
```

--------------------------------

### Mock Timers with setTimeout and setInterval in Vitest

Source: https://vitest.dev/guide/mocking/timers

Complete example showing how to use vi.useFakeTimers() to mock timer functions in Vitest tests. Demonstrates testing delayed execution with setTimeout, interval execution with setInterval, and controlling timer advancement using vi.runAllTimers(), vi.advanceTimersByTime(), and vi.advanceTimersToNextTimer(). Requires Vitest framework and mock functions.

```javascript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function executeAfterTwoHours(func) {
  setTimeout(func, 1000 * 60 * 60 * 2) // 2 hours
}

function executeEveryMinute(func) {
  setInterval(func, 1000 * 60) // 1 minute
}

const mock = vi.fn(() => console.log('executed'))

describe('delayed execution', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should execute the function', () => {
    executeAfterTwoHours(mock)
    vi.runAllTimers()
    expect(mock).toHaveBeenCalledTimes(1)
  })
  it('should not execute the function', () => {
    executeAfterTwoHours(mock)
    // advancing by 2ms won't trigger the func
    vi.advanceTimersByTime(2)
    expect(mock).not.toHaveBeenCalled()
  })
  it('should execute every minute', () => {
    executeEveryMinute(mock)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(1)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(2)
  })
})
```

--------------------------------

### Configure Vitest Browser Mode with Vue Integration

Source: https://vitest.dev/guide/browser

Example Vitest configuration enabling browser mode with Playwright for Vue projects. It integrates the Vite plugin for Vue.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```

--------------------------------

### Implement custom coverage reporter extending ReportBase

Source: https://vitest.dev/guide/coverage

Creates a custom Istanbul coverage reporter by extending ReportBase class. Implements lifecycle hooks (onStart, onEnd) to generate custom coverage reports with access to configuration options and file writing utilities.

```javascript
const { ReportBase } = require('istanbul-lib-report')

module.exports = class CustomReporter extends ReportBase {
  constructor(opts) {
    super()

    // Options passed from configuration are available here
    this.file = opts.file
  }

  onStart(root, context) {
    this.contentWriter = context.writer.writeFile(this.file)
    this.contentWriter.println('Start of custom coverage report')
  }

  onEnd() {
    this.contentWriter.println('End of custom coverage report')
    this.contentWriter.close()
  }
}
```

--------------------------------

### Custom Serializer Implementation (TypeScript)

Source: https://vitest.dev/guide/snapshot

This is a separate TypeScript file containing the implementation of a custom snapshot serializer. It exports an object with `serialize` and `test` methods, adhering to the `SnapshotSerializer` interface.

```typescript
import { SnapshotSerializer } from 'vitest'

export default {
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return `Pretty foo: ${printer(
      val.foo,
      config,
      indentation,
      depth,
      refs,
    )}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
  },
} satisfies SnapshotSerializer
```

--------------------------------

### Extendable Fixtures in Vitest (TypeScript)

Source: https://vitest.dev/guide/test-context

Demonstrates how to extend Vitest's test environment to include custom fixtures like 'todos' and 'archive'. It shows how fixtures are initialized based on their usage in tests and emphasizes the importance of object destructuring for accessing context.

```typescript
import { test as baseTest } from 'vitest'

const test = baseTest.extend({
  todos: async ({ task }, use) => {
    await use([1, 2, 3])
  },
  archive: []
})

// todos will not run
test('skip', () => {})
test('skip', ({ archive }) => {})

// todos will run
test('run', ({ todos }) => {})
```

--------------------------------

### Use Injected Values in Vitest Tests

Source: https://vitest.dev/guide/browser/multiple-setups

Access injected provider values in test files using the inject() function from Vitest. This allows tests to use configuration-specific values that vary across different browser instances.

```typescript
import { expect, inject, test } from 'vitest'
import { globalSetupModifier } from './example.js'

test('ratio works', () => {
  expect(inject('ratio') * globalSetupModifier).toBe(14)
})
```

--------------------------------

### Configure Vitest Test Coverage

Source: https://vitest.dev/guide/features

This configuration enables Vitest's test coverage reporting. It relies on the 'v8' or 'istanbul' reporters. The script 'coverage' in package.json executes Vitest with the --coverage flag.

```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

--------------------------------

### Using Custom Vitest Fixtures in Tests

Source: https://vitest.dev/guide/test-context

Shows how to import and use custom fixtures (`todos`, `archive`) defined using `test.extend` in separate test files. It verifies the state of the fixtures before and after test operations.

```typescript
import { expect } from 'vitest'
import { test } from './my-test.js'

test('add items to todos', ({ todos }) => {
  expect(todos.length).toBe(3)

  todos.push(4)
  expect(todos.length).toBe(4)
})

test('move items from todos to archive', ({ todos, archive }) => {
  expect(todos.length).toBe(3)
  expect(archive.length).toBe(0)

  archive.push(todos.pop())
  expect(todos.length).toBe(2)
  expect(archive.length).toBe(1)
})
```

--------------------------------

### Configure Project Isolation in Vitest

Source: https://vitest.dev/guide/migration

This code group illustrates how to configure project isolation settings within Vitest's `test.projects` configuration. It shows examples for setting up non-isolated unit tests, isolated integration tests, and managing parallel vs. sequential test execution by controlling `isolate` and `fileParallelism`.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        // Non-isolated unit tests
        name: 'Unit tests',
        isolate: false,
        exclude: ['**.integration.test.ts'],
      },
      {
        // Isolated integration tests
        name: 'Integration tests',
        include: ['**.integration.test.ts'],
      },
    ],
  },
})
```

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'Parallel',
        exclude: ['**.sequantial.test.ts'],
      },
      {
        name: 'Sequential',
        include: ['**.sequantial.test.ts'],
        fileParallelism: false,
      },
    ],
  },
})
```

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'Production env',
        execArgv: ['--env-file=.env.prod']
      },
      {
        name: 'Staging env',
        execArgv: ['--env-file=.env.staging']
      },
    ],
  },
})
```

--------------------------------

### Command-Line Vitest Test Sharding for High CPU Machines

Source: https://vitest.dev/guide/improving-performance

This example demonstrates how to shard Vitest tests across multiple processes on machines with high CPU counts. It uses environment variables to control the number of workers per shard and runs tests in parallel using shell commands, followed by merging the reports.

```sh
# Example for splitting tests on 32 CPU to 4 shards.
# As each process needs 1 main thread, there's 7 threads for test runners (1+7)*4 = 32
# Use VITEST_MAX_WORKERS:
VITEST_MAX_WORKERS=7 vitest run --reporter=blob --shard=1/4 & \
VITEST_MAX_WORKERS=7 vitest run --reporter=blob --shard=2/4 & \
VITEST_MAX_WORKERS=7 vitest run --reporter=blob --shard=3/4 & \
VITEST_MAX_WORKERS=7 vitest run --reporter=blob --shard=4/4 & \
wait # https://man7.org/linux/man-pages/man2/waitpid.2.html

vitest run --merge-reports
```

--------------------------------

### Migrate vitest.config.js workspace to projects configuration

Source: https://vitest.dev/guide/migration

Demonstrates how to migrate the 'workspace' configuration option to the new 'projects' option in Vitest. This change involves updating the structure and potentially the source of project definitions.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: './vitest.workspace.js', // [!code --]
    projects: [ // [!code ++]
      './packages/*', // [!code ++]
      {
        test: { // [!code ++]
          name: 'unit',
        }, // [!code ++]
      }, // [!code ++]
    ]
  }
})
```

--------------------------------

### Update Snapshots via CLI

Source: https://vitest.dev/guide/snapshot

Provides command-line options to update snapshots when changes are expected. Use the `--update` or `-u` flag with the `vitest` command to update all failed snapshots.

```bash
vitest -u
```

--------------------------------

### Setup Chrome for CI with WebdriverIO in GitHub Actions

Source: https://vitest.dev/guide/browser/visual-regression-testing

Integrates the setup-chrome action into a GitHub Actions workflow to provide a specific Chrome browser version for WebdriverIO tests. This is essential for consistent visual testing in a CI environment.

```yaml
# ...the rest of the workflow
- uses: browser-actions/setup-chrome@v1
  with:
    chrome-version: 120
```

--------------------------------

### Configure Default Reporter Options

Source: https://vitest.dev/guide/reporters

Shows how to customize the default reporter, specifically disabling the summary output by setting the 'summary' option to false within the configuration.

```typescript
export default defineConfig({
  test: {
    reporters: [
      ['default', { summary: false }]
    ]
  },
})
```

--------------------------------

### Automatic Fixture Initialization with Vitest

Source: https://vitest.dev/guide/test-context

Shows how to configure a file-scoped fixture in Vitest to automatically initialize before any test runs. This is achieved by setting the 'auto' option to true within the fixture's options.

```typescript
const test = baseTest.extend({
  perFile: [
    ({}, use) => use([]),
    {
      scope: 'file',
      // always run this hook before any test
      auto: true
    },
  ],
})
```

--------------------------------

### Update Vitest browser context import

Source: https://vitest.dev/guide/migration

Demonstrates the change in importing browser context modules in Vitest. The import path for `page` has been updated from `@vitest/browser/context` to `vitest/browser`.

```typescript
import { page } from '@vitest/browser/context' // [!code --]
import { page } from 'vitest/browser' // [!code ++]

test('example', async () => {
  await page.getByRole('button').click()
})
```

--------------------------------

### Implement custom coverage provider module in Vitest

Source: https://vitest.dev/guide/coverage

Creates a custom coverage provider implementing CoverageProviderModule and CoverageProvider interfaces. Provides initialization logic and coverage functionality through methods like getProvider() and initialize(ctx).

```typescript
import type {
  CoverageProvider,
  CoverageProviderModule,
  ResolvedCoverageOptions,
  Vitest
} from 'vitest'

const CustomCoverageProviderModule: CoverageProviderModule = {
  getProvider(): CoverageProvider {
    return new CustomCoverageProvider()
  },

  // Implements rest of the CoverageProviderModule ...
}

class CustomCoverageProvider implements CoverageProvider {
  name = 'custom-coverage-provider'
  options!: ResolvedCoverageOptions

  initialize(ctx: Vitest) {
    this.options = ctx.config.coverage
  }

  // Implements rest of the CoverageProvider ...
}

export default CustomCoverageProviderModule
```

--------------------------------

### Direct Reporter Output to a File

Source: https://vitest.dev/guide/reporters

Explains how to redirect the output of reporters like 'json', 'html', or 'junit' to a specified file using the 'outputFile' configuration option in the CLI or config file.

```bash
npx vitest --reporter=json --outputFile=./test-output.json
```

```typescript
export default defineConfig({
  test: {
    reporters: ['json'],
    outputFile: './test-output.json'
  },
})
```

--------------------------------

### Configure Custom Reporters for Vitest

Source: https://vitest.dev/guide/reporters

Allows integration of third-party reporters from NPM or local custom reporter files. Reporters can be specified via the CLI or in vitest.config.ts. Custom reporters must implement the Reporter interface.

```bash
npx vitest --reporter=some-published-vitest-reporter
```

```typescript
export default defineConfig({
  test: {
    reporters: ['some-published-vitest-reporter']
  },
})
```

```bash
npx vitest --reporter=./path/to/reporter.ts
```

--------------------------------

### Configure Vitest HTML Reporter

Source: https://vitest.dev/guide/ui

Configures Vitest to use the 'html' reporter, which generates a static HTML report identical to the Vitest UI. This is useful for previewing test results without a running development server.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['html'],
  },
})
```

--------------------------------

### Snapshot Output with Custom Serializer

Source: https://vitest.dev/guide/snapshot

This shows the expected snapshot output after applying the custom serializer defined earlier. Notice how the 'foo' property is formatted differently.

```text
Pretty foo: Object {
  "x": 1,
  "y": 2,
}
```

--------------------------------

### Configure Browser Options via CLI with Dot Notation

Source: https://vitest.dev/guide/browser

Command-line syntax for passing browser configuration options to Vitest using dot notation. This allows setting specific browser properties like headless mode without modifying config files.

```shell
npx vitest --browser.headless
```

--------------------------------

### Configure WebSocket Request Mocking with MSW in Vitest

Source: https://vitest.dev/guide/mocking/requests

Provides an example of mocking WebSocket connections using Mock Service Worker (MSW) in Vitest. It sets up a mock WebSocket server that listens for connections and messages, echoing back received messages. The example includes server lifecycle management and handler resetting, essential for testing real-time communication features.

```javascript
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { ws } from 'msw'

const chat = ws.link('wss://chat.example.com')

const wsHandlers = [
  chat.addEventListener('connection', ({ client }) => {
    client.addEventListener('message', (event) => {
      console.log('Received message from client:', event.data)
      // Echo the received message back to the client
      client.send(`Server received: ${event.data}`)
    })
  }),
]

const server = setupServer(...wsHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```

--------------------------------

### Configure In-Source Testing with Vitest

Source: https://vitest.dev/guide/in-source

Set up in-source testing by wrapping tests in an `if (import.meta.vitest)` block and configuring the `includeSource` option in vitest.config.ts. The example demonstrates defining an `add` function with inline test cases that verify behavior for zero, single, and multiple arguments.

```typescript
// the implementation
export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0)
}

// in-source test suites
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add()).toBe(0)
    expect(add(1)).toBe(1)
    expect(add(1, 2, 3)).toBe(6)
  })
}
```

--------------------------------

### Ignoring Next Statement or Block in TypeScript

Source: https://vitest.dev/guide/coverage

Shows how to use `v8 ignore next` with `@preserve` to exclude the immediately following statement, function, class, or expression from coverage reports. This is useful for ignoring setup code or specific lines that don't need coverage.

```ts
/* v8 ignore next -- @preserve */
console.log('Ignored') // [!code error]
console.log('Included')

/* v8 ignore next -- @preserve */
function ignored() { // [!code error]
  console.log('all') // [!code error]
  // [!code error]
  console.log('lines') // [!code error]
  // [!code error]
  console.log('are') // [!code error]
  // [!code error]
  console.log('ignored') // [!code error]
} // [!code error]

/* v8 ignore next -- @preserve */
class Ignored { // [!code error]
  ignored() {} // [!code error]
  alsoIgnored() {} // [!code error]
} // [!code error]

/* v8 ignore next -- @preserve */
condition // [!code error]
  ? console.log('ignored') // [!code error]
  : console.log('also ignored') // [!code error]

```

--------------------------------

### Ignoring Switch Case or Default in TypeScript

Source: https://vitest.dev/guide/coverage

Provides examples of how to ignore specific `case` statements or the `default` block within a `switch` statement using `v8 ignore next` with `@preserve`. This helps in excluding certain branches of a switch statement from code coverage calculations.

```ts
switch (type) {
  case 1:
    return 'Included'

  /* v8 ignore next -- @preserve */
  case 2: // [!code error]
    return 'Ignored' // [!code error]

  case 3:
    return 'Included'

  /* v8 ignore next -- @preserve */
  default: // [!code error]
    return 'Ignored' // [!code error]
}

```

--------------------------------

### Update Vitest Browser Provider configuration

Source: https://vitest.dev/guide/migration

Shows the updated browser provider configuration in Vitest, changing from a string to an object-based approach for better flexibility. This includes updates to `provider` and `launch` options for custom configurations.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright' // [!code ++]

export default defineConfig({
  test: {
    browser: {
      provider: 'playwright', // [!code --]
      provider: playwright({
        launchOptions: { // [!code ++]
          slowMo: 100, // [!code ++]
        }, // [!code ++]
      }), // [!code ++]
      instances: [
        {
          browser: 'chromium',
          launch: { // [!code --]
            slowMo: 100, // [!code --]
          }, // [!code --]
        },
      ],
    },
  },
})
```

--------------------------------

### Implement a Custom Pool Worker Class

Source: https://vitest.dev/guide/advanced/pool

This TypeScript code outlines the structure for a `CustomPoolWorker` class, implementing the `PoolWorker` interface from Vitest. It includes methods for sending messages, listening to events, starting, stopping, and handling serialization, providing the core logic for a custom test runner.

```typescript
import type { PoolOptions, PoolWorker, WorkerRequest } from 'vitest/node'

// Assuming CustomOptions is defined elsewhere
// interface CustomOptions { [key: string]: any }

class CustomPoolWorker implements PoolWorker {
  name = 'custom-pool'
  private customOptions: CustomOptions

  constructor(options: PoolOptions, customOptions: CustomOptions) {
    this.customOptions = customOptions
  }

  send(message: WorkerRequest): void {
    // Provide way to send your worker a message
  }

  on(event: string, callback: (arg: any) => void): void {
    // Provide way to listen to your workers events, e.g. message, error, exit
  }

  off(event: string, callback: (arg: any) => void): void {
    // Provide way to unsubscribe `on` listeners
  }

  async start() {
    // do something when the worker is started
  }

  async stop() {
    // cleanup the state
  }

  deserialize(data) {
    return data
  }
}
```

--------------------------------

### Use toMatchFileSnapshot for File Content Comparison

Source: https://vitest.dev/guide/snapshot

Compares the output against the content of a specified file. This is useful for scenarios where the expected output is complex or benefits from being in its own file, allowing for better readability and syntax highlighting.

```typescript
import { expect, it } from 'vitest'

it('render basic', async () => {
  const result = renderHTML(h('div', { class: 'foo' }))
  await expect(result).toMatchFileSnapshot('./test/basic.output.html')
})
```

--------------------------------

### startVitest API

Source: https://vitest.dev/guide/advanced/tests

Initiates Vitest, validates packages, and runs tests immediately. It returns a Vitest instance with access to test module states.

```APIDOC
## `startVitest`

### Description
Initiates Vitest, validates the packages are installed and runs tests immediately. It returns a Vitest instance that allows access to test module states.

### Method
`startVitest(cliFilters, testConfigOverrides, viteConfigOverrides, vitestCustomOptions)`

### Parameters

#### `cliFilters` (Array<string>)
- Optional. Filters to apply to the tests, similar to CLI arguments.

#### `testConfigOverrides` (object)
- Optional. Overrides for the Vitest test configuration.

#### `viteConfigOverrides` (object)
- Optional. Overrides for the Vite configuration.

#### `vitestCustomOptions` (object)
- Optional. Custom options for Vitest.

### Request Example
```ts
import { startVitest } from 'vitest/node'

const vitest = await startVitest(
  'test', // CLI filters
  [], // override test config
  {},
  {},
  {},
)
const testModules = vitest.state.getTestModules()
for (const testModule of testModules) {
  console.log(testModule.moduleId, testModule.ok() ? 'passed' : 'failed')
}
```

### Response
#### Success Response (Vitest Instance)
- `vitest` (object) - An instance of Vitest with methods to interact with the test runner.
  - `state.getTestModules()`: Returns an array of test modules.

#### Response Example
```json
// Logs test module IDs and their status (passed/failed)
```
```

--------------------------------

### Define Original Class for Mocking

Source: https://vitest.dev/guide/mocking/classes

Example class definition with static method, instance properties, arrow function method, and regular methods. This serves as the reference class to be mocked in tests.

```typescript
class Dog {
  name: string

  constructor(name: string) {
    this.name = name
  }

  static getType(): string {
    return 'animal'
  }

  greet = (): string => {
    return `Hi! My name is ${this.name}!`
  }

  speak(): string {
    return 'bark!'
  }

  isHungry() {}
  feed() {}
}
```

--------------------------------

### Dynamic Fixture Scoping with test.scoped (TypeScript)

Source: https://vitest.dev/guide/test-context

Illustrates a practical application of `test.scoped()` for dynamically setting up fixtures based on context, such as different database schemas. This pattern is useful for managing resources that depend on specific configurations within a test suite.

```typescript
const test = baseTest.extend<{
  db: Database
  schema: string
}>({
  db: async ({ schema }, use) => {
    const db = await createDb({ schema })
    await use(db)
    await cleanup(db)
  },
  schema: '',
})

describe('one type of schema', () => {
  test.scoped({ schema: 'schema-1' })

  // ... tests
})

describe('another type of schema', () => {
  test.scoped({ schema: 'schema-2' })

  // ... tests
})
```

--------------------------------

### Start Vitest and Run Tests Programmatically (TypeScript)

Source: https://vitest.dev/guide/advanced/tests

Initiates Vitest, validates packages, and immediately runs tests using the startVitest function. It returns a Vitest instance from which test module information can be retrieved. Dependencies include 'vitest/node'.

```typescript
import { startVitest } from 'vitest/node'

const vitest = await startVitest(
  'test',
  [], // CLI filters
  {},
  {},
  {},
)
const testModules = vitest.state.getTestModules()
for (const testModule of testModules) {
  console.log(testModule.moduleId, testModule.ok() ? 'passed' : 'failed')
}
```

--------------------------------

### Snapshot Formatting Comparison (Jest vs Vitest)

Source: https://vitest.dev/guide/snapshot

Compares the snapshot output for an array of objects in Jest and Vitest when `printBasicPrototype` is handled differently. Vitest provides a cleaner, more concise output by default.

```typescript
import { expect, test } from 'vitest'

test('snapshot', () => {
  const bar = [
    {
      foo: 'bar',
    },
  ]

  // in Jest
  expect(bar).toMatchInlineSnapshot(`
    Array [
      Object {
        "foo": "bar",
      },
    ]
  `)

  // in Vitest
  expect(bar).toMatchInlineSnapshot(`
    [
      {
        "foo": "bar",
      },
    ]
  `)
})
```

--------------------------------

### Test readHelloWorld with memfs

Source: https://vitest.dev/guide/mocking/file-system

This Vitest test suite demonstrates how to test the 'readHelloWorld' function using 'memfs' for file system mocking. It mocks 'node:fs' and 'node:fs/promises', resets the in-memory file system before each test using 'vol.reset()', and writes/reads files to verify the function's behavior. It also shows how to populate the in-memory file system with multiple files using 'vol.fromJSON'.

```typescript
import { beforeEach, expect, it, vi } from 'vitest'
import { fs, vol } from 'memfs'
import { readHelloWorld } from './read-hello-world.js'

// tell vitest to use fs mock from __mocks__ folder
// this can be done in a setup file if fs should always be mocked
vi.mock('node:fs')
vi.mock('node:fs/promises')

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset()
})

it('should return correct text', () => {
  const path = '/hello-world.txt'
  fs.writeFileSync(path, 'hello world')

  const text = readHelloWorld(path)
  expect(text).toBe('hello world')
})

it('can return a value multiple times', () => {
  // you can use vol.fromJSON to define several files
  vol.fromJSON(
    {
      './dir1/hw.txt': 'hello dir1',
      './dir2/hw.txt': 'hello dir2',
    },
    // default cwd
    '/tmp',
  )

  expect(readHelloWorld('/tmp/dir1/hw.txt')).toBe('hello dir1')
  expect(readHelloWorld('/tmp/dir2/hw.txt')).toBe('hello dir2')
})
```

--------------------------------

### Chaining Vitest Test.extend for More Fixtures

Source: https://vitest.dev/guide/test-context

Illustrates how to further extend an already extended `test` object to add more fixtures or override existing ones. This allows for building complex fixture hierarchies.

```typescript
import { test as todosTest } from './my-test.js'

export const test = todosTest.extend({
  settings: {
    // ...
  }
})
```

--------------------------------

### Configure Vitest with unstubEnvs Option

Source: https://vitest.dev/guide/mocking

Enable the unstubEnvs option in vitest.config.ts to automatically restore environment variable values between tests when using vi.stubEnv helper.

```typescript
export default defineConfig({
  test: {
    unstubEnvs: true,
  },
})
```

--------------------------------

### Async Test Case with Promise Callback

Source: https://vitest.dev/guide/migration

Rewrites a test case from a callback-based 'done' function to an async Promise-based structure for compatibility with Vitest, which does not support the callback style.

```javascript
it('should work', (done) => { 
  // ...
  done()
})
```

```javascript
it('should work', () => new Promise(done => { 
  // ...
  done()
}))
```

--------------------------------

### Update Vitest browser utils import

Source: https://vitest.dev/guide/migration

Illustrates the updated import path for utility functions in Vitest browser module. Utilities previously imported from `@vitest/browser/utils` should now be imported from `vitest/browser`.

```typescript
import { getElementError } from '@vitest/browser/utils' // [!code --]
import { utils } from 'vitest/browser' // [!code ++]
const { getElementError } = utils
```

--------------------------------

### GitHub Actions Workflow for Updating Screenshots

Source: https://vitest.dev/guide/browser/visual-regression-testing

This YAML workflow is configured to be manually triggered via `workflow_dispatch`. It sets up Node.js, installs dependencies, installs Playwright browsers, runs visual regression tests with an update flag, checks for changes, commits and pushes them if found, and generates a summary report for the GitHub Actions run. It includes safety checks to avoid running on the main branch and to prevent concurrent runs on the same branch.

```yaml
name: Update Visual Regression Screenshots

on:
  workflow_dispatch: # manual trigger only

env:
  AUTHOR_NAME: 'github-actions[bot]'
  AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com'
  COMMIT_MESSAGE: |
    test: update visual regression screenshots

    Co-authored-by: ${{ github.actor }} <${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com>

jobs:
  update-screenshots:
    runs-on: ubuntu-24.04

    # safety first: don't run on main
    if: github.ref_name != github.event.repository.default_branch

    # one at a time per branch
    concurrency:
      group: visual-regression-screenshots@${{ github.ref_name }}
      cancel-in-progress: true

    permissions:
      contents: write # needs to push changes

    steps:
      - name: Checkout selected branch
        uses: actions/checkout@v4
        with:
          ref: ${{ github.ref_name }}
          # use PAT if triggering other workflows
          # token: ${{ secrets.GITHUB_TOKEN }}

      - name: Configure Git
        run: |
          git config --global user.name "${{ env.AUTHOR_NAME }}"
          git config --global user.email "${{ env.AUTHOR_EMAIL }}"

      # your setup steps here (node, pnpm, whatever)
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx --no playwright install --with-deps --only-shell

      # the magic happens below 🪄
      - name: Update Visual Regression Screenshots
        run: npm run test:visual --update

      # check what changed
      - name: Check for changes
        id: check_changes
        run: |
          CHANGED_FILES=$(git status --porcelain | awk '{print $2}')
          if [ "${CHANGED_FILES:+x}" ]; then
            echo "changes=true" >> $GITHUB_OUTPUT
            echo "Changes detected"

            # save the list for the summary
            echo "changed_files<<EOF" >> $GITHUB_OUTPUT
            echo "$CHANGED_FILES" >> $GITHUB_OUTPUT
            echo "EOF" >> $GITHUB_OUTPUT
            echo "changed_count=$(echo "$CHANGED_FILES" | wc -l)" >> $GITHUB_OUTPUT
          else
            echo "changes=false" >> $GITHUB_OUTPUT
            echo "No changes detected"
          fi

      # commit if there are changes
      - name: Commit changes
        if: steps.check_changes.outputs.changes == 'true'
        run: |
          git add -A
          git commit -m "${{ env.COMMIT_MESSAGE }}"

      - name: Push changes
        if: steps.check_changes.outputs.changes == 'true'
        run: git push origin ${{ github.ref_name }}

      # pretty summary for humans
      - name: Summary
        run: |
          if [[ "${{ steps.check_changes.outputs.changes }}" == "true" ]]; then
            echo "### 📸 Visual Regression Screenshots Updated" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "Successfully updated **${{ steps.check_changes.outputs.changed_count }}** screenshot(s) on `${{ github.ref_name }}`" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "#### Changed Files:" >> $GITHUB_STEP_SUMMARY
            echo "```" >> $GITHUB_STEP_SUMMARY
            echo "${{ steps.check_changes.outputs.changed_files }}" >> $GITHUB_STEP_SUMMARY
            echo "```" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "✅ The updated screenshots have been committed and pushed. Your visual regression baseline is now up to date!" >> $GITHUB_STEP_SUMMARY
          else
            echo "### ℹ️ No Screenshot Updates Required" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "The visual regression test command ran successfully but no screenshots needed updating." >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "All screenshots are already up to date! 🎉" >> $GITHUB_STEP_SUMMARY
          fi

```

--------------------------------

### Output HTML Report with Vitest

Source: https://vitest.dev/guide/reporters

Generates an interactive HTML report for test results, viewable via a GUI. The report can be output to a specified file or a new HTML file will be created if no outputFile is set. Requires the '@vitest/ui' package.

```bash
npx vitest --reporter=html
```

```typescript
export default defineConfig({
  test: {
    reporters: ['html']
  },
})
```

--------------------------------

### Type-Safe Hooks with Vitest Extended Context

Source: https://vitest.dev/guide/test-context

Demonstrates how `beforeEach` and `afterEach` hooks, when defined on a Vitest `test` object extended with custom fixtures, are aware of the extended context and provide type safety.

```typescript
const test = baseTest.extend<{ todos: number[] }>({ /* ... */ });

test.beforeEach(({ todos }) => {
  todos.push(1)
})

test.afterEach(({ todos }) => {
  console.log(todos)
})
```

--------------------------------

### Mock Functions with vi.spyOn and vi.fn in Vitest

Source: https://vitest.dev/guide/mocking/functions

Demonstrates spying on object methods with vi.spyOn() to track method calls and verify behavior, and using vi.fn() to create mock function callbacks. The example shows mocking the getLatest method with custom implementations and verifying callback invocations when items are added to a messages collection.

```javascript
import { afterEach, describe, expect, it, vi } from 'vitest'

const messages = {
  items: [
    { message: 'Simple test message', from: 'Testman' },
  ],
  addItem(item) {
    messages.items.push(item)
    messages.callbacks.forEach(callback => callback(item))
  },
  onItem(callback) {
    messages.callbacks.push(callback)
  },
  getLatest,
}

function getLatest(index = messages.items.length - 1) {
  return messages.items[index]
}

it('should get the latest message with a spy', () => {
  const spy = vi.spyOn(messages, 'getLatest')
  expect(spy.getMockName()).toEqual('getLatest')

  expect(messages.getLatest()).toEqual(
    messages.items[messages.items.length - 1],
  )

  expect(spy).toHaveBeenCalledTimes(1)

  spy.mockImplementationOnce(() => 'access-restricted')
  expect(messages.getLatest()).toEqual('access-restricted')

  expect(spy).toHaveBeenCalledTimes(2)
})

it('passing down the mock', () => {
  const callback = vi.fn()
  messages.onItem(callback)

  messages.addItem({ message: 'Another test message', from: 'Testman' })
  expect(callback).toHaveBeenCalledWith({
    message: 'Another test message',
    from: 'Testman',
  })
})
```

--------------------------------

### In-Source Testing with Vitest

Source: https://vitest.dev/guide/features

Allows tests to be written directly within source files, enabling access to private states and improving feedback loops. Tests are conditionally executed when `import.meta.vitest` is true.

```typescript
// the implementation
export function add(...args: number[]): number {
  return args.reduce((a, b) => a + b, 0)
}

// in-source test suites
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add()).toBe(0)
    expect(add(1)).toBe(1)
    expect(add(1, 2, 3)).toBe(6)
  })
}
```

--------------------------------

### Mocking with Tinyspy in Vitest

Source: https://vitest.dev/guide/features

Showcases mocking functions using the built-in Tinyspy library with Jest-compatible APIs on the `vi` object. It demonstrates creating mock functions, calling them, and asserting their calls and return values. Compatibility is improved with `test.globals` set to `true` when using third-party matchers.

```typescript
import { expect, vi } from 'vitest'

const fn = vi.fn()

fn('hello', 1)

expect(vi.isMockFunction(fn)).toBe(true)
expect(fn.mock.calls[0]).toEqual(['hello', 1])

fn.mockImplementation((arg: string) => arg)

fn('world', 2)

expect(fn.mock.results[1].value).toBe('world')
```

--------------------------------

### Refactor Import to Avoid Barrel File Issues

Source: https://vitest.dev/guide/profiling-test-performance

This example demonstrates refactoring an import statement to directly target a specific file instead of going through a barrel file (index.ts). This change can significantly reduce the number of files transformed by Vitest, improving test performance, as shown in the file tree structure.

```typescript
import { formatter } from '../src/utils' // [!code --] 
import { formatter } from '../src/utils/formatters' // [!code ++]
```

--------------------------------

### Handling Asynchronous Matchers in Vitest

Source: https://vitest.dev/guide/extending-matchers

Illustrates how to define and use asynchronous custom matchers in Vitest. The example shows an async matcher 'toBeAsyncAssertion' and how to `await` its invocation in the test case.

```typescript
expect.extend({
  async toBeAsyncAssertion() {
    // ...
  }
})

await expect().toBeAsyncAssertion()
```

--------------------------------

### Configure Test Runner Profiling with Vitest CLI Args

Source: https://vitest.dev/guide/profiling-test-performance

Configure Vitest to generate CPU and heap profiles for the test runner. This is achieved by passing Node.js execution arguments via the `execArgv` option in the Vitest configuration file. These profiles help in analyzing the performance of the test execution environment itself.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fileParallelism: false,
    execArgv: [
      '--cpu-prof',
      '--cpu-prof-dir=test-runner-profile',
      '--heap-prof',
      '--heap-prof-dir=test-runner-profile'
    ],
  },
})
```

--------------------------------

### Customize JUnit Reporter Options

Source: https://vitest.dev/guide/reporters

Allows customization of the JUnit reporter, including suite name and classname template. The classnameTemplate supports 'filename' and 'filepath' placeholders. This is configured within vitest.config.ts.

```typescript
export default defineConfig({
  test: {
    reporters: [
      ['junit', { suiteName: 'custom suite name', classnameTemplate: 'filename:{filename} - filepath:{filepath}' }]
    ]
  },
})
```

--------------------------------

### Configure Dot Reporter in Vitest

Source: https://vitest.dev/guide/reporters

The dot reporter provides minimal output, printing a single dot for each completed test. It only shows details for failed tests and a summary for the suite. This is useful for a concise overview of test runs.

```bash
npx vitest --reporter=dot
```

--------------------------------

### Configure `printBasicPrototype` for Snapshot Formatting (TypeScript)

Source: https://vitest.dev/guide/snapshot

This configuration snippet shows how to explicitly set `printBasicPrototype` to `true` in `vitest.config.ts` to mimic Jest's older snapshot formatting behavior.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotFormat: {
      printBasicPrototype: true,
    },
  },
})
```

--------------------------------

### Type Mismatch Error Example in expectTypeOf

Source: https://vitest.dev/guide/testing-types

Shows an example of a type mismatch assertion that will fail, where the actual type `{a: number}` does not match the expected type `{a: string}`. Illustrates how Vitest and expect-type generate error messages with MismatchInfo to clarify the difference between expected and actual types.

```typescript
expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: string }>()
```

--------------------------------

### Vitest CLI: Running Type Checking

Source: https://vitest.dev/guide/testing-types

Provides examples of how to run Vitest with type checking enabled using common package managers like npm, yarn, pnpm, and bun. These commands execute the `test` script defined in `package.json`, which includes the `--typecheck` flag.

```bash
npm run test
```

```bash
yarn test
```

```bash
pnpm run test
```

```bash
bun test
```

--------------------------------

### Using Bound Expect in Vitest Tests

Source: https://vitest.dev/guide/test-context

Shows how to use the test context's `expect` API, which is bound to the current test. This is particularly useful for running snapshot tests concurrently, as it avoids conflicts with global `expect`.

```typescript
import { it } from 'vitest'

it('math is easy', ({ expect }) => {
  expect(2 + 2).toBe(4)
})
```

```typescript
import { it } from 'vitest'

it.concurrent('math is easy', ({ expect }) => {
  expect(2 + 2).toMatchInlineSnapshot()
})

it.concurrent('math is hard', ({ expect }) => {
  expect(2 * 2).toMatchInlineSnapshot()
})
```

--------------------------------

### Configure Vitest Hook Sequencing

Source: https://vitest.dev/guide/migration

Configures Vitest to run hooks sequentially, mimicking Jest's behavior. By default, Vitest runs hooks in a stack. This configuration changes it to a list.

```typescript
export default defineConfig({
  test: {
    sequence: { 
      hooks: 'list'
    }
  }
})
```

--------------------------------

### Verbose Vitest Reporter Annotation Output (Successful Tests)

Source: https://vitest.dev/guide/test-annotations

Illustrates how the verbose Vitest reporter displays annotations even for successful tests. Annotations are listed after the test passes, showing the type, file, and line number of their origin.

```text
✓ example.test.js > an example of a test with annotation

  ❯ example.test.js:9:15 notice
    ↳ annotation 1
  ❯ example.test.js:10:15 warning
    ↳ annotation 2
```

--------------------------------

### Configure Vitest Environment Variables Loading

Source: https://vitest.dev/guide/features

Configures Vitest to load environment variables prefixed with 'VITE_' from .env files, maintaining compatibility with Vite's conventions. Uses Vite's `loadEnv` utility for explicit loading.

```typescript
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  test: {
    // mode defines what ".env.{mode}" file to choose if exists
    env: loadEnv(mode, process.cwd(), ''),
  },
}))
```

--------------------------------

### Import Vitest Types

Source: https://vitest.dev/guide/migration

Replaces Jest-specific type imports with Vitest's own `Mock` type. Vitest does not have a `jest` namespace, so types must be imported directly from 'vitest'.

```typescript
let fn: jest.Mock<(name: string) => number>
```

```typescript
import type { Mock } from 'vitest'
let fn: Mock<(name: string) => number>
```

--------------------------------

### Error Snapshot Formatting Difference (Vitest)

Source: https://vitest.dev/guide/snapshot

Demonstrates the specific formatting difference for `Error` objects when using `toThrowErrorMatchingInlineSnapshot` in Vitest compared to Jest, particularly regarding the error message inclusion.

```javascript
import { expect, test } from 'vitest'

test('snapshot', () => {
  // in Jest and Vitest
  expect(new Error('error')).toMatchInlineSnapshot(`[Error: error]`)

  // Jest snapshots `Error.message` for `Error` instance
  // Vitest prints the same value as toMatchInlineSnapshot
  expect(() => {
    throw new Error('error')
  }).toThrowErrorMatchingInlineSnapshot(`"error"`) // [!code --]
  }).toThrowErrorMatchingInlineSnapshot(`[Error: error]`) // [!code ++]
})
```

--------------------------------

### Vitest Snapshot Testing

Source: https://vitest.dev/guide/features

Implements Jest-compatible snapshot testing in Vitest. This allows for verifying UI component output or complex data structures by comparing them against a stored snapshot. Ensure the `expect` object is correctly imported.

```typescript
import { expect, it } from 'vitest'

it('renders correctly', () => {
  const result = render()
  expect(result).toMatchSnapshot()
})
```

--------------------------------

### Configure TAP Flat Reporter for Vitest

Source: https://vitest.dev/guide/reporters

Outputs test results in a TAP-compliant flat list format. This can be configured via the CLI or in the vitest.config.ts file. It differs from the default TAP reporter by not nesting test suites.

```bash
npx vitest --reporter=tap-flat
```

```typescript
export default defineConfig({
  test: {
    reporters: ['tap-flat']
  },
})
```

--------------------------------

### Adding Annotations to Vitest Tests

Source: https://vitest.dev/guide/test-context

Demonstrates how to use the `annotate` function from the test context to add annotations to a test. These annotations can include messages, types, and attachments, and are displayed by reporters.

```typescript
test('annotations API', async ({ annotate }) => {
  await annotate('https://github.com/vitest-dev/vitest/pull/7953', 'issues')
})
```

--------------------------------

### Sharding Vitest Tests in CI

Source: https://vitest.dev/guide/features

Utilizes `--shard` and `--reporter=blob` flags to distribute test execution across multiple machines in a CI environment. `--merge-reports` combines results from sharded runs.

```bash
vitest --shard=1/2 --reporter=blob --coverage
vitest --shard=2/2 --reporter=blob --coverage
vitest --merge-reports --reporter=junit --coverage
```

--------------------------------

### Set Custom Timeout for Vitest Hooks (TypeScript)

Source: https://vitest.dev/guide/filtering

Set a custom timeout in milliseconds for Vitest hooks like `beforeAll`. Similar to tests, hooks also have a default timeout of 5 seconds, which can be overridden by passing the timeout value as the second argument to the hook function. This is useful for asynchronous setup or teardown operations that require more time.

```typescript
import { beforeAll } from 'vitest'

beforeAll(async () => { /* ... */ }, 1000)
```

--------------------------------

### Output JUnit XML Report with Vitest

Source: https://vitest.dev/guide/reporters

Generates test results in JUnit XML format. This can be done via the CLI or by configuring the 'junit' reporter in vitest.config.ts. The output can be printed to the terminal or saved to a file.

```bash
npx vitest --reporter=junit
```

```typescript
export default defineConfig({
  test: {
    reporters: ['junit']
  },
})
```

--------------------------------

### Greeting Component Test with Vitest Browser (Preact)

Source: https://vitest.dev/guide/browser

Tests a Preact component's greeting message after a button click using Vitest's browser testing capabilities. It renders the component, simulates a click, and asserts the presence of the greeting text.

```tsx
import { render } from 'vitest-browser-preact'
import { createElement } from 'preact'
import Greeting from '.Greeting'

test('greeting appears on click', async () => {
  const screen = render(<Greeting />)

  const button = screen.getByRole('button')
  await button.click()
  const greeting = screen.getByText(/hello world/iu)

  await expect.element(greeting).toBeInTheDocument()
})
```

--------------------------------

### Disable File Parallelism (CLI)

Source: https://vitest.dev/guide/improving-performance

Disables parallelism across test files using the `--no-file-parallelism` CLI flag. This can improve startup time for certain projects.

```bash
vitest --no-file-parallelism
```

--------------------------------

### Type Testing with Vitest and expect-type

Source: https://vitest.dev/guide/features

Experimental feature for writing type tests to catch regressions using the `expect-type` package. It provides an API similar to Vitest's runtime assertions for type checking.

```typescript
import { assertType, expectTypeOf, test } from 'vitest'
import { mount } from './mount.js'

test('my types work properly', () => {
  expectTypeOf(mount).toBeFunction()
  expectTypeOf(mount).parameter(0).toExtend<{ name: string }>()

  // @ts-expect-error name is a string
  assertType(mount({ name: 42 }))
})
```

--------------------------------

### Spying on Constructors with `spyOn` and `fn` in Vitest

Source: https://vitest.dev/guide/migration

Demonstrates how to spy on constructors using `vi.spyOn` in Vitest v4 and later. Requires mock implementations to use `function` or `class` keywords. Incorrect usage with arrow functions will result in a 'not a constructor' error.

```typescript
const cart = {
  Apples: class Apples {
    getApples() {
      return 42
    }
  }
}

const Spy = vi.spyOn(cart, 'Apples')
  .mockImplementation(() => ({ getApples: () => 0 })) // [!code --]
  // with a function keyword
  .mockImplementation(function () {
    this.getApples = () => 0
  })
  // with a custom class
  .mockImplementation(class MockApples {
    getApples() {
      return 0
    }
  })

const mock = new Spy()
```

--------------------------------

### Configure Custom Reporter in Vitest Config

Source: https://vitest.dev/guide/advanced/reporters

Provides an example of how to integrate a custom reporter into your Vitest configuration file (`vitest.config.ts`). It shows importing the custom reporter and adding it to the `reporters` array.

```typescript
import { defineConfig } from 'vitest/config'
import CustomReporter from './custom-reporter.js'

export default defineConfig({
  test: {
    reporters: [new CustomReporter()],
  },
})
```

--------------------------------

### Mock fs and fs/promises using memfs

Source: https://vitest.dev/guide/mocking/file-system

This snippet demonstrates how to mock the 'node:fs' and 'node:fs/promises' modules using 'memfs'. It involves creating '__mocks__/fs.cjs' and '__mocks__/fs/promises.cjs' files to redirect all file system calls to an in-memory file system. This ensures tests do not interact with the actual disk, making them faster and safer.

```typescript
// we can also use `import`, but then
// every export should be explicitly defined

const { fs } = require('memfs')
module.exports = fs
```

```typescript
// we can also use `import`, but then
// every export should be explicitly defined

const { fs } = require('memfs')
module.exports = fs.promises
```

--------------------------------

### Integrate and Test Component Data Flow with Vitest

Source: https://vitest.dev/guide/browser/component-testing

Illustrates an integration testing strategy where multiple components collaborate. This example tests a `ProductList` component's ability to filter and display products based on user interaction. It uses `render` to mount the component and `userEvent` to simulate user interactions like selecting an option from a dropdown. Assertions verify the correct rendering and filtering of products.

```tsx
import { ProductList } from '../components/ProductList'
import userEvent from '@testing-library/user-event'

test('ProductList filters and displays products correctly', async () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
    { id: 2, name: 'Book', category: 'Education', price: 29 }
  ]

  const { getByLabelText, getByText, queryByText } = render(
    <ProductList products={mockProducts} />
  )

  // Initially shows all products
  await expect.element(getByText('Laptop')).toBeInTheDocument()
  await expect.element(getByText('Book')).toBeInTheDocument()

  // Filter by category
  await userEvent.selectOptions(
    getByLabelText(/category/i),
    'Electronics'
  )

  // Only electronics should remain
  await expect.element(getByText('Laptop')).toBeInTheDocument()
  await expect.element(queryByText('Book')).not.toBeInTheDocument()
})
```

--------------------------------

### Vitest: Importing Actual Modules

Source: https://vitest.dev/guide/migration

Shows the difference between Jest's 'requireActual' and Vitest's 'importActual' for importing the original implementation of a module when performing partial mocks. Vitest requires an asynchronous 'await' when using 'importActual'.

```typescript
const { cloneDeep } = jest.requireActual('lodash/cloneDeep') // [!code --]
const { cloneDeep } = await vi.importActual('lodash/cloneDeep') // [!code ++]
```

--------------------------------

### Mock Exported Function with vi.mock

Source: https://vitest.dev/guide/mocking

Replace an exported function with a mock implementation using `vi.mock()`. This method hoists the mock call to the top of the file, executing before all imports. Useful for controlling function behavior during testing.

```javascript
export function method() {}
```

```typescript
import { method } from './example.js'

vi.mock('./example.js', () => ({
  method: vi.fn()
}))
```

--------------------------------

### Vitest Module Mock Transformation Example

Source: https://vitest.dev/guide/mocking/modules

Demonstrates how Vitest transforms static imports with vi.mock calls into dynamic imports. The transformation moves mock registrations to the top of the file and wraps imports with __handle_mock__ to ensure mocks are registered before module evaluation occurs.

```typescript
import { answer } from './answer.js'

vi.mock(import('./answer.js'))

console.log(answer)
```

```typescript
vi.mock('./answer.js')

const __vitest_module_0__ = await __handle_mock__(
  () => import('./answer.js')
)
// to keep the live binding, we have to access
// the export on the module namespace
console.log(__vitest_module_0__.answer())
```

--------------------------------

### Mock import.meta.env with Manual Reset in beforeEach

Source: https://vitest.dev/guide/mocking

Change environment variables by assigning new values to import.meta.env properties. Store the original value before tests and reset it in a beforeEach hook to ensure clean state between test cases.

```typescript
import { beforeEach, expect, it } from 'vitest'

// you can reset it in beforeEach hook manually
const originalViteEnv = import.meta.env.VITE_ENV

beforeEach(() => {
  import.meta.env.VITE_ENV = originalViteEnv
})

it('changes value', () => {
  import.meta.env.VITE_ENV = 'staging'
  expect(import.meta.env.VITE_ENV).toBe('staging')
})
```

--------------------------------

### Run tests with npm, yarn, pnpm, and bun

Source: https://vitest.dev/guide/projects

Execute Vitest tests using different package managers. All commands run the test script defined in package.json and support the same CLI options across all package managers.

```bash
npm run test
```

```bash
yarn test
```

```bash
pnpm run test
```

```bash
bun run test
```

--------------------------------

### Configure Headless Mode in Vitest Config

Source: https://vitest.dev/guide/browser

TypeScript configuration file for enabling headless browser mode with Playwright provider. Sets up Vitest to run tests in the background without a user interface for automated testing workflows.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
    },
  }
})
```

--------------------------------

### Update Vitest Pool Configuration Options

Source: https://vitest.dev/guide/migration

This snippet demonstrates the migration of pool configuration options from older Vitest versions to the new architecture. It shows how `poolOptions` (including `forks`, `vmThreads`, `memoryLimit`, `execArgv`, `isolate`, `singleFork`) are replaced by top-level options like `maxWorkers`, `isolate`, `vmMemoryLimit`, and `execArgv`. This change simplifies configuration and removes the need for nested `poolOptions`.

```typescript
export default defineConfig({
  test: {
    poolOptions: { // [!code --]
      forks: { // [!code --]
        execArgv: ['--expose-gc'], // [!code --]
        isolate: false, // [!code --]
        singleFork: true, // [!code --]
      }, // [!code --]
      vmThreads: { // [!code --]
        memoryLimit: '300Mb' // [!code --]
      }, // [!code --]
    }, // [!code --]
    execArgv: ['--expose-gc'], // [!code ++]
    isolate: false, // [!code ++]
    maxWorkers: 1, // [!code ++]
    vmMemoryLimit: '300Mb', // [!code ++]
  }
})
```

--------------------------------

### Configure Vitest coverage include and exclude patterns

Source: https://vitest.dev/guide/migration

Demonstrates how to configure coverage.include and coverage.exclude patterns in Vitest 4.0. The include pattern specifies which files to analyze for coverage, while exclude removes matching files from the report. Removed options (all, extensions) are shown commented out for reference.

```typescript
export default defineConfig({
  test: {
    coverage: {
      // Include covered and uncovered files matching this pattern:
      include: ['packages/**/src/**.{js,jsx,ts,tsx}'],

      // Exclusion is applied for the files that match include pattern above
      // No need to define root level *.config.ts files or node_modules, as we didn't add those in include
      exclude: ['**/some-pattern/**'],

      // These options are removed now
      all: true,
      extensions: ['js', 'ts'],
    }
  }
})
```

--------------------------------

### Configure Project-Specific Isolation

Source: https://vitest.dev/guide/improving-performance

Sets up different isolation settings for distinct project configurations within `vitest.config.js`. It defines 'Isolated' and 'Non-isolated' projects, allowing fine-grained control over isolation behavior.

```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'Isolated',
        isolate: true, // (default value)
        exclude: ['**.non-isolated.test.ts'],
      },
      {
        name: 'Non-isolated',
        isolate: false,
        include: ['**.non-isolated.test.ts'],
      }
    ]
  },
})
```

--------------------------------

### Output TAP Report with Vitest

Source: https://vitest.dev/guide/reporters

Outputs test results following the Test Anything Protocol (TAP) standard. This reporter can be enabled using the CLI command or by including 'tap' in the reporters array within vitest.config.ts.

```bash
npx vitest --reporter=tap
```

```typescript
export default defineConfig({
  test: {
    reporters: ['tap']
  },
})
```

--------------------------------

### Resolve Vitest and Vite Configuration

Source: https://vitest.dev/guide/advanced

Resolves the Vitest and Vite configuration based on provided options and Vite overrides. If no options are given, it defaults to `process.cwd()`. Returns both the resolved Vitest configuration and Vite configuration. Note that `viteConfig.test` might not be fully resolved, and this method does not resolve `projects`.

```typescript
import { resolveConfig } from 'vitest/node'

const { vitestConfig, viteConfig } = await resolveConfig({
  mode: 'custom',
  configFile: false,
  resolve: {
    conditions: ['custom']
  },
  test: {
    setupFiles: ['/my-setup-file.js'],
    pool: 'threads',
  },
})
```

--------------------------------

### Spy on Getter Property of Mocked Class

Source: https://vitest.dev/guide/mocking/classes

Use vi.spyOn() with 'get' option to mock and spy on class properties. Enables assertion on property access and allows returning custom values.

```typescript
const dog = new Dog('Cooper')

const nameSpy = vi.spyOn(dog, 'name', 'get').mockReturnValue('Max')

expect(dog.name).toBe('Max')
expect(nameSpy).toHaveBeenCalledTimes(1)
```

--------------------------------

### Configure Hanging Process Reporter for Vitest

Source: https://vitest.dev/guide/reporters

Displays a list of processes that prevent Vitest from exiting safely. This reporter is useful for debugging and can be used alongside other reporters. Configuration is available via CLI or vitest.config.ts.

```bash
npx vitest --reporter=hanging-process
```

```typescript
export default defineConfig({
  test: {
    reporters: ['hanging-process']
  },
})
```

--------------------------------

### Define Per-File and Per-Worker Context in Vitest

Source: https://vitest.dev/guide/test-context

Demonstrates how to extend Vitest's test object to define fixtures with 'file' and 'worker' scopes. These fixtures are initialized once per file or worker, respectively. The 'use' function is used to provide the fixture value.

```typescript
import { test as baseTest } from 'vitest'

export const test = baseTest.extend({
  perFile: [
    ({}, use) => use([]),
    { scope: 'file' },
  ],
  perWorker: [
    ({}, use) => use([]),
    { scope: 'worker' },
  ],
})
```

--------------------------------

### Run Tests with Specific Browser via CLI

Source: https://vitest.dev/guide/browser

Command-line interface for running Vitest tests in a specified browser. The --browser flag accepts browser names like 'chromium' to execute tests in that browser environment.

```shell
npx vitest --browser=chromium
```

--------------------------------

### Restore previous Vitest exclude behavior with legacy patterns

Source: https://vitest.dev/guide/migration

Demonstrates how to manually restore Vitest v3 exclusion patterns in v4 by combining configDefaults.exclude with legacy exclusion patterns for dist, cypress, config files, and cache directories.

```typescript
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'
    ],
  },
})
```

--------------------------------

### DOM Assertions and Interactivity API (TypeScript)

Source: https://vitest.dev/guide/browser

Demonstrates using Vitest's Browser Mode with TypeScript, showcasing DOM assertions via `@testing-library/jest-dom` and user interactions using `userEvent` from `vitest/browser`. It covers finding elements by text and label, filling input fields, and basic assertions.

```typescript
import { expect } from 'vitest'
import { page } from 'vitest/browser'
// element is rendered correctly
await expect.element(page.getByText('Hello World')).toBeInTheDocument()
```

```typescript
import { page, userEvent } from 'vitest/browser'
await userEvent.fill(page.getByLabelText(/username/i), 'Alice')
// or just locator.fill
await page.getByLabelText(/username/i).fill('Alice')
```

--------------------------------

### Configure Vitest Coverage Provider Selection

Source: https://vitest.dev/guide/coverage

Sets up Vitest configuration to select between V8 or Istanbul as the code coverage provider. The provider option determines which coverage collection method will be used during test execution. By default, V8 is used unless explicitly configured otherwise.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8' // or 'istanbul'
    },
  },
})
```

--------------------------------

### Mock Exported Class with vi.mock and Fake Class

Source: https://vitest.dev/guide/mocking

Create a fake class implementation to replace an exported class using `vi.mock()`. This allows you to control class instantiation and method behavior in tests while maintaining the class structure.

```javascript
export class SomeClass {}
```

```typescript
import { SomeClass } from './example.js'

vi.mock(import('./example.js'), () => {
  const SomeClass = vi.fn(class FakeClass {
    someMethod = vi.fn()
  })
  return { SomeClass }
})
```

--------------------------------

### Configure Vitest Test Timeout

Source: https://vitest.dev/guide/migration

Migrates Jest's `jest.setTimeout` to Vitest's `vi.setConfig` for configuring test timeouts. This allows setting a custom duration for test executions.

```typescript
jest.setTimeout(5_000)
```

```typescript
vi.setConfig({ testTimeout: 5_000 })
```

--------------------------------

### Configure GraphQL Request Mocking with MSW in Vitest

Source: https://vitest.dev/guide/mocking/requests

Demonstrates how to mock GraphQL queries using Mock Service Worker (MSW) within a Vitest environment. It defines mock data for posts and sets up a GraphQL handler for the 'ListPosts' query. Similar to HTTP mocking, it includes server setup, start/close lifecycle hooks, and handler resetting for test isolation.

```javascript
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { graphql, HttpResponse } from 'msw'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

const graphqlHandlers = [
  graphql.query('ListPosts', () => {
    return HttpResponse.json({
      data: { posts },
    })
  }),
]

const server = setupServer(...graphqlHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```

--------------------------------

### Use toMatchSnapshot for Value Comparison

Source: https://vitest.dev/guide/snapshot

Compares a value against a stored snapshot. Vitest creates a snapshot file on the first run and compares subsequent outputs against it. The test fails if they don't match, indicating an unexpected change or the need to update the reference snapshot.

```typescript
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchSnapshot()
})
```

--------------------------------

### Vitest v4: Standalone Mode with Filename Filter CLI

Source: https://vitest.dev/guide/migration

Shows how to use the `--standalone` flag with a filename filter in Vitest v4's CLI. This allows specific test files to be run automatically when standalone mode is activated, enhancing re-usable script creation.

```sh
# In Vitest v3 and below this command would ignore "math.test.ts" filename filter.
# In Vitest v4 the math.test.ts will run automatically.
$ vitest --standalone math.test.ts
```

--------------------------------

### Using AbortSignal for Test Timeouts in Vitest

Source: https://vitest.dev/guide/test-context

Shows how to use the `signal` provided by the test context, which is an `AbortSignal`. This signal is aborted when the test times out, the user cancels the run, or `vitest.cancelCurrentRun` is called.

```typescript
it('stop request when test times out', async ({ signal }) => {
  await fetch('/resource', { signal })
}, 2000)
```

--------------------------------

### Disable File Parallelism (Configuration)

Source: https://vitest.dev/guide/improving-performance

Configures Vitest to disable file parallelism by setting `test.fileParallelism` to `false` in `vitest.config.js`. This option is useful for optimizing test startup times.

```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fileParallelism: false,
  },
})
```

--------------------------------

### Mock Exported Class with vi.spyOn

Source: https://vitest.dev/guide/mocking

Spy on an exported class and provide a fake implementation using `vi.spyOn()`. This approach allows you to intercept class instantiation and control method behavior. Note: This does not work in Browser Mode.

```typescript
import * as mod from './example.js'

vi.spyOn(mod, 'SomeClass').mockImplementation(class FakeClass {
  someMethod = vi.fn()
})
```

--------------------------------

### Switch Execution Pool (CLI)

Source: https://vitest.dev/guide/improving-performance

Switches the test execution pool to 'threads' using the `--pool=threads` CLI flag. This can offer better performance than the default 'forks' pool in larger projects.

```bash
vitest --pool=threads
```

--------------------------------

### Accessing Test Task Name in Vitest

Source: https://vitest.dev/guide/test-context

Demonstrates how to access the test context and log the name of the current task using the `task` property. This is useful for debugging or dynamically naming tests.

```typescript
import { it } from 'vitest'

it('should work', ({ task }) => {
  // prints name of the test
  console.log(task.name)
})
```

--------------------------------

### Install Playwright Browsers for CI in GitHub Actions

Source: https://vitest.dev/guide/browser/visual-regression-testing

Sets up the necessary Playwright browsers within a GitHub Actions workflow before running visual regression tests. This ensures a consistent browser environment for consistent test results.

```yaml
# ...the rest of the workflow
- name: Install Playwright Browsers
  run: npx --no playwright install --with-deps --only-shell
```

--------------------------------

### Add Custom Snapshot Serializer via Configuration (TypeScript)

Source: https://vitest.dev/guide/snapshot

This code illustrates how to configure Vitest to use a custom snapshot serializer defined in a separate file. The `snapshotSerializers` array in `vitest.config.ts` specifies the path to the custom serializer module.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotSerializers: ['path/to/custom-serializer.ts'],
  },
})
```

--------------------------------

### Stub Environment Variables with Automatic Reset

Source: https://vitest.dev/guide/mocking

Use vi.stubEnv helper with unstubEnvs config option enabled to automatically reset environment variable values between tests. This approach eliminates manual reset logic in beforeEach hooks.

```typescript
import { expect, it, vi } from 'vitest'

// before running tests "VITE_ENV" is "test"
import.meta.env.VITE_ENV === 'test'

it('changes value', () => {
  vi.stubEnv('VITE_ENV', 'staging')
  expect(import.meta.env.VITE_ENV).toBe('staging')
})

it('the value is restored before running an other test', () => {
  expect(import.meta.env.VITE_ENV).toBe('test')
})
```

--------------------------------

### Test Sharding for Parallel Execution

Source: https://vitest.dev/guide/improving-performance

Enables test sharding by using the `--shard` option with the `--reporter=blob` flag to distribute test files across multiple machines. Results are merged using `--merge-reports`.

```sh
# Run on 1st of 3 machines
vitest run --reporter=blob --shard=1/3

# Run on 2nd of 3 machines
vitest run --reporter=blob --shard=2/3

# Run on 3rd of 3 machines
vitest run --reporter=blob --shard=3/3

# Merge reports after all shards have run
vitest run --merge-reports
```

--------------------------------

### Disable Test Isolation (Configuration)

Source: https://vitest.dev/guide/improving-performance

Configures Vitest to disable test isolation by setting the `test.isolate` property to `false` in `vitest.config.js`. This is suitable for projects that manage state effectively.

```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    isolate: false,
  },
})
```

--------------------------------

### Configure Tree Reporter in Vitest

Source: https://vitest.dev/guide/reporters

The tree reporter displays test results hierarchically, similar to the default reporter, but shows individual tests after their suite finishes. The CLI command enables this reporter. The summary can be optionally disabled.

```bash
npx vitest --reporter=tree
```

--------------------------------

### Configure Tree Reporter in vitest.config.ts

Source: https://vitest.dev/guide/reporters

This configuration sets the 'tree' reporter for Vitest tests. The 'summary: false' option disables the summary section of the report. This reporter provides a detailed, hierarchical view of test execution.

```typescript
export default defineConfig({
  test: {
    reporters: [
      ['tree', { summary: false }]
    ]
  },
})
```

--------------------------------

### Configure Parallel and Sequential Vitest Test Files

Source: https://vitest.dev/guide/recipes

Manage test execution parallelism in Vitest by splitting test files into parallel and sequential groups using the `projects` option. This allows specifying different configurations, such as disabling file parallelism for specific test suites using `fileParallelism: false`.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'Parallel',
        exclude: ['**.sequantial.test.ts'],
      },
      {
        name: 'Sequential',
        include: ['**.sequantial.test.ts'],
        fileParallelism: false,
      },
    ],
  },
})
```

--------------------------------

### Configure custom coverage provider in Vitest

Source: https://vitest.dev/guide/coverage

Enables a custom coverage provider by setting provider to 'custom' and specifying the module path. The customProviderModule must export a CoverageProviderModule object as the default export.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'custom',
      customProviderModule: 'my-custom-coverage-provider'
    },
  },
})
```

--------------------------------

### Skipping Tests Conditionally in Vitest

Source: https://vitest.dev/guide/test-context

Illustrates the usage of the `skip` function from the test context to skip test execution. It can be used unconditionally or conditionally based on a boolean expression, with an optional note.

```typescript
import { expect, it } from 'vitest'

it('math is hard', ({ skip }) => {
  skip()
  expect(2 + 2).toBe(5)
})
```

```typescript
it('math is hard', ({ skip, mind }) => {
  skip(mind === 'foggy')
  expect(2 + 2).toBe(5)
})
```

--------------------------------

### Mock Exported Function with vi.spyOn

Source: https://vitest.dev/guide/mocking

Spy on and mock an exported function using `vi.spyOn()` with custom implementation. Provides flexibility in controlling function behavior while maintaining a reference to the original. Note: This does not work in Browser Mode.

```typescript
import * as exports from './example.js'

vi.spyOn(exports, 'method').mockImplementation(() => {})
```

--------------------------------

### Vitest Type Inference with test.extend Generics

Source: https://vitest.dev/guide/test-context

Explains Vitest's preference for explicitly defining fixture types using generics with `test.extend`, especially when the `use` function is involved. This approach ensures accurate type inference for fixtures and their dependencies.

```typescript
import { test as baseTest } from 'vitest'

const test = baseTest.extend({
  todos: ({ schema }, use) => use([]),
  schema: 'test'
// Explicitly define the fixture types using generics
}) as unknown as VitestTest<{
  todos: number[]
  schema: string
}>;

test('types are correct', ({ todos, schema }) => {
  // todos: number[]
  // schema: string
  // ...
})
```

--------------------------------

### Implement readHelloWorld function

Source: https://vitest.dev/guide/mocking/file-system

This TypeScript function 'readHelloWorld' reads the content of a file at the specified path and returns it as a UTF-8 encoded string. It uses the 'readFileSync' function from the 'node:fs' module. This function is designed to be tested with a mocked file system.

```typescript
import { readFileSync } from 'node:fs'

export function readHelloWorld(path) {
  return readFileSync(path, 'utf-8')
}
```

--------------------------------

### Use toMatchInlineSnapshot for Inline Value Comparison

Source: https://vitest.dev/guide/snapshot

Stores the snapshot directly within the test file. This method modifies the test file to include the expected output as a string, making it visible without switching files. Useful for quick checks and maintaining context.

```typescript
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchInlineSnapshot()
})
```

```typescript
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchInlineSnapshot('"FOOBAR"')
})
```

--------------------------------

### Mocking Exported Variables in Vitest

Source: https://vitest.dev/guide/browser

Illustrates how to mock exported variables by exporting a method that modifies the variable's value. This approach is necessary because exported variables themselves cannot be directly spied on or mocked in Vitest.

```javascript
// module.js
export let MODE = 'test'
export function changeMode(newMode) {
  MODE = newMode
}
```

```typescript
// module.test.ts
import { expect } from 'vitest'
import { changeMode, MODE } from './module.js'

changeMode('production')
expect(MODE).toBe('production')
```

--------------------------------

### Switch Execution Pool (Configuration)

Source: https://vitest.dev/guide/improving-performance

Sets the test execution pool to 'threads' in `vitest.config.js` by configuring `test.pool: 'threads'`. This may improve test run times, especially in large projects.

```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'threads',
  },
})
```

--------------------------------

### Vitest Module Mocking Pitfall: Function Implementation (JavaScript)

Source: https://vitest.dev/guide/mocking/modules

The implementation of `foobar.js` used in the pitfall examples. It exports both `foo` and `foobar`, where `foobar` internally calls `foo`. This internal call is the source of the limitation discussed.

```javascript
export function foo() {
  return 'foo'
}

export function foobar(injectedFoo) {
  return injectedFoo === foo // false
}
```

--------------------------------

### Run Vitest with test file filter

Source: https://vitest.dev/guide/cli

Start Vitest and filter test files by name inclusion. The filter checks for substring matches in file paths and does not support regex or glob patterns unless processed by the terminal before reaching Vitest.

```bash
vitest foobar
```

--------------------------------

### Disable Test Isolation (CLI)

Source: https://vitest.dev/guide/improving-performance

Disables test isolation for all test files, potentially speeding up execution for projects without side effects. This is done using the `--no-isolate` flag.

```bash
vitest --no-isolate
```

--------------------------------

### Configure GitHub Actions Reporter for Vitest

Source: https://vitest.dev/guide/reporters

Outputs workflow commands for GitHub Actions to create annotations for test failures. This reporter is enabled by default in GitHub Actions environments but can be explicitly configured with options like `onWritePath` for path normalization and `displayAnnotations` to control annotation display.

```typescript
export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
  },
})
```

```typescript
export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS
      ? [
          'default',
          ['github-actions', { onWritePath(path) {
            return path.replace(/^\/app\//, `${process.env.GITHUB_WORKSPACE}/`)
          } }],
        ]
      : ['default'],
  },
})
```

```typescript
export default defineConfig({
  test: {
    reporters: [
      ['github-actions', { displayAnnotations: false }],
    ],
  },
})
```

--------------------------------

### Workaround for Vitest Worker Termination Errors

Source: https://vitest.dev/guide/common-errors

Addresses the 'Failed to terminate worker' error in Vitest, often occurring when using NodeJS's `fetch` with the default `pool: 'threads'`. It suggests switching to `pool: 'forks'` or `pool: 'vmForks'` as a workaround.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',
  },
})
```

```bash
vitest --pool=forks
```

--------------------------------

### Provide TypeScript Fixture Types with Vitest Generics

Source: https://vitest.dev/guide/test-context

Illustrates how to define custom fixture types for Vitest using TypeScript generics. By passing an interface to `test.extend`, you ensure type safety for your custom fixtures when they are used in tests.

```typescript
interface MyFixtures {
  todos: number[]
  archive: number[]
}

const test = baseTest.extend<MyFixtures>({
  todos: [],
  archive: []
})

test('types are defined correctly', ({ todos, archive }) => {
  expectTypeOf(todos).toEqualTypeOf<number[]>()
  expectTypeOf(archive).toEqualTypeOf<number[]>()
})
```

--------------------------------

### Test Multiple Query Strategies with .or

Source: https://vitest.dev/guide/browser/component-testing

This example demonstrates how to find an element using multiple query strategies combined with the `.or()` method for auto-retrying. It shows finding a submit button by accessible name, test ID, and exact text, highlighting the use of specific getBy* methods in Vitest.

```tsx
const submitButton = page.getByRole('button', { name: /submit/i }) // By accessible name
  .or(page.getByTestId('submit-button')) // By test ID
  .or(page.getByText('Submit')) // By exact text
```

--------------------------------

### Enable Browser Mode in Vitest Config

Source: https://vitest.dev/guide/browser

This configuration enables Vitest's browser testing mode using the Playwright provider. It requires setting `browser.enabled` to true and specifying at least one browser instance.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  }
})
```

--------------------------------

### Enable Coverage via Vitest Configuration File

Source: https://vitest.dev/guide/coverage

Enables code coverage collection by setting the coverage.enabled option in vitest.config.ts. This approach allows persistent configuration of coverage collection without requiring CLI flags for each test run.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true
    },
  },
})
```

--------------------------------

### Configure coverage include and exclude patterns in Vitest

Source: https://vitest.dev/guide/coverage

Defines both inclusion and exclusion patterns for coverage reporting. Files matching the include pattern are added to the report, while those matching exclude patterns are removed, allowing fine-grained control over coverage scope.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/utils/users.ts']
    },
  },
})
```

--------------------------------

### Default Fixture Values with 'injected: true' in Vitest (TypeScript)

Source: https://vitest.dev/guide/test-context

Explains how to set default values for fixtures that can be overridden per project using the 'injected: true' option. This allows for project-specific configurations, as demonstrated with the 'url' fixture.

```typescript
import { test as base } from 'vitest'

const test = base.extend({
  url: [
    // default value if "url" is not defined in the config
    '/default',
    // mark the fixture as "injected" to allow the override
    { injected: true },
  ],
})

test('works correctly', ({ url }) => {
  // url is "/default" in "project-new"
  // url is "/full" in "project-full"
  // url is "/empty" in "project-empty"
})
```

--------------------------------

### Output JSON Report with Vitest

Source: https://vitest.dev/guide/reporters

Generates test results in a JSON format compatible with Jest's --json option. This reporter can be activated using the CLI or by setting 'json' in the reporters array in vitest.config.ts. Coverage information is included if enabled.

```bash
npx vitest --reporter=json
```

```typescript
export default defineConfig({
  test: {
    reporters: ['json']
  },
})
```

--------------------------------

### Inspect Rendered Output for Debugging

Source: https://vitest.dev/guide/browser/component-testing

Provides code examples for debugging component rendering issues by inspecting element queries. It suggests logging element counts and trying alternative queries when initial attempts fail to find elements, aiding in identifying rendering or query problems.

```tsx
// Debug why elements can't be found
const button = page.getByRole('button', { name: /submit/i })
console.log('Button count:', button.length) // Should be 1

// Try alternative queries if the first one fails
if (button.length === 0) {
  console.log('All buttons:', page.getByRole('button').length)
  console.log('By test ID:', page.getByTestId('submit-btn').length)
}
```

--------------------------------

### Vitest `onTestFailed` Hook in Test Context

Source: https://vitest.dev/guide/test-context

Explains the usage of the `onTestFailed` hook, which is bound to the current test within the test context. This is useful for applying specific failure handling logic to individual concurrent tests.

```typescript
# onTestFailed hook bound to the current test
# This API is useful if you are running tests concurrently and need to have a special handling only for this specific test.
```

--------------------------------

### Vitest `onTestFinished` Hook in Test Context

Source: https://vitest.dev/guide/test-context

Details the `onTestFinished` hook, also bound to the current test in the context. Similar to `onTestFailed`, it's beneficial for managing specific cleanup or post-execution logic in concurrent test scenarios.

```typescript
# onTestFinished hook bound to the current test
# This API is useful if you are running tests concurrently and need to have a special handling only for this specific test.
```

--------------------------------

### Configure Dot Reporter in vitest.config.ts

Source: https://vitest.dev/guide/reporters

This configuration sets the 'dot' reporter for Vitest tests. This reporter is known for its minimal output, showing a single character for each test's status. It's ideal for quick visual checks of test execution.

```typescript
export default defineConfig({
  test: {
    reporters: ['dot']
  },
})
```

--------------------------------

### Mock Part of Module while Preserving Originals

Source: https://vitest.dev/guide/mocking

Selectively mock specific exports from a module while keeping others with original behavior. This approach uses dynamic import and spread operators to preserve non-mocked functions while replacing targeted ones.

```typescript
import { mocked, original } from './some-path.js'

vi.mock(import('./some-path.js'), async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    mocked: vi.fn()
  }
})
original() // has original behaviour
mocked() // is a spy function
```

--------------------------------

### Run Concurrent Tests in Vitest

Source: https://vitest.dev/guide/features

Demonstrates running tests concurrently using `.concurrent` on individual tests or entire describe blocks. This speeds up test execution by running multiple tests in parallel. Ensure `expect` is used from the local test context for accurate snapshot and assertion detection in concurrent tests.

```typescript
import { describe, it } from 'vitest'

// The two tests marked with concurrent will be started in parallel
describe('suite', () => {
  it('serial test', async () => { /* ... */ })
  it.concurrent('concurrent test 1', async ({ expect }) => { /* ... */ })
  it.concurrent('concurrent test 2', async ({ expect }) => { /* ... */ })
})

// All tests within this suite will be started in parallel
describe.concurrent('suite', () => {
  it('concurrent test 1', async ({ expect }) => { /* ... */ })
  it('concurrent test 2', async ({ expect }) => { /* ... */ })
  it.concurrent('concurrent test 3', async ({ expect }) => { /* ... */ })
})
```

--------------------------------

### Default Vitest Reporter Annotation Output (Failed Tests)

Source: https://vitest.dev/guide/test-annotations

Shows how the default Vitest reporter displays annotations when a test fails. Annotations are printed below the error message, categorized by type (e.g., 'notice', 'warning'), and include the file and line number where they were called.

```text
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

  FAIL  example.test.js > an example of a test with annotation
Error: thrown error
  ❯ example.test.js:11:21
      9 |    await annotate('annotation 1')
      10|    await annotate('annotation 2', 'warning')
      11|    throw new Error('thrown error')
        |          ^
      12|  })

  ❯ example.test.js:9:15 notice
    ↳ annotation 1
  ❯ example.test.js:10:15 warning
    ↳ annotation 2

  ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
```

--------------------------------

### Use toMatchScreenshot for Visual Regression Testing

Source: https://vitest.dev/guide/snapshot

Captures a screenshot of a UI component or page and compares it against a reference image. This is part of Vitest's visual regression testing capabilities, integrated with browser mode to detect unintended visual changes.

```typescript
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

test('button looks correct', async () => {
  const button = page.getByRole('button')
  await expect(button).toMatchScreenshot('primary-button')
})
```

--------------------------------

### Configure Blob Reporter for Vitest

Source: https://vitest.dev/guide/reporters

Stores test results locally for later merging. Results are stored in the `.vitest-reports` folder by default, but can be customized using `--outputFile` or `--outputFile.blob`. Recommended for use with `--shard` and merging reports with `--merge-reports`. Does not work in watch mode.

```bash
npx vitest --reporter=blob --outputFile=reports/blob-1.json
```

```bash
npx vitest --merge-reports=reports --reporter=json --reporter=default
```

--------------------------------

### Configure coverage include pattern in Vitest

Source: https://vitest.dev/guide/coverage

Sets up Vitest to include specific source files in coverage reports using glob patterns. By default, only imported files are shown; this configuration ensures uncovered files are also included in the report.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}']
    },
  },
})
```

--------------------------------

### Configure Vitest with a Custom Pool

Source: https://vitest.dev/guide/advanced/pool

This snippet shows how to configure Vitest to use a custom pool runner by default. It imports a custom pool implementation and passes it to the `pool` option in `vitest.config.ts`, optionally with custom properties.

```typescript
import { defineConfig } from 'vitest/config'
import customPool from './my-custom-pool.ts'

export default defineConfig({
  test: {
    // will run every file with a custom pool by default
    pool: customPool({
      customProperty: true,
    })
  },
})
```

--------------------------------

### Adding @preserve to Ignore Hints (Diff)

Source: https://vitest.dev/guide/coverage

Demonstrates how to add the `@preserve` keyword to existing v8 and istanbul ignore hints. This is useful when using TypeScript with esbuild, which might strip comments unless they are marked as legal comments. The `@preserve` tag helps ensure these hints are retained in the final build.

```diff
-/* istanbul ignore if */
+/* istanbul ignore if -- @preserve */
if (condition) {

-/* v8 ignore if */
+/* v8 ignore if -- @preserve */
if (condition) {

```

--------------------------------

### Parse CLI Arguments for Vitest

Source: https://vitest.dev/guide/advanced

Parses command-line arguments for Vitest, accepting either a space-separated string or an array of strings. It returns an object containing filters and options that can be passed to `createVitest` or `startVitest`. This is useful for programmatically controlling Vitest's execution based on CLI-like input.

```javascript
import { parseCLI } from 'vitest/node'

const result = parseCLI('vitest ./files.ts --coverage --browser=chrome')

console.log(result.options)
// Expected output:
// {
//   coverage: { enabled: true },
//   browser: { name: 'chrome', enabled: true }
// }

console.log(result.filter)
// Expected output:
// ['./files.ts']
```

--------------------------------

### Configure Verbose Reporter in vitest.config.ts

Source: https://vitest.dev/guide/reporters

This configuration sets the 'verbose' reporter for Vitest tests. The 'summary: false' option disables the test summary output at the end of the run. This is useful for reducing verbosity when only individual test results are needed.

```typescript
export default defineConfig({
  test: {
    reporters: [
      ['verbose', { summary: false }]
    ]
  },
})
```

--------------------------------

### TAP Reporter Annotation Output in Vitest

Source: https://vitest.dev/guide/test-annotations

Shows the output format for annotations using the TAP and TAP-flat reporters in Vitest. Annotations are displayed as diagnostic messages on new lines, prefixed with '#', and include the annotation type and message. Attachments are ignored.

```text
ok 1 - an example of a test with annotation # time=143.15ms
    # notice: the message of the annotation
```

--------------------------------

### Vitest Test/Describe Function Argument Order

Source: https://vitest.dev/guide/migration

Demonstrates the corrected argument order for providing test options to the 'test' and 'describe' functions in Vitest. Previously, options could be the third argument; now they must be the second argument before the callback function. Numeric timeouts remain supported as the last argument.

```typescript
test('example', () => { /* ... */ }, { retry: 2 }) // [!code --]
test('example', { retry: 2 }, () => { /* ... */ }) // [!code ++]
```

--------------------------------

### Custom Message Separator in Snapshots (Jest vs Vitest)

Source: https://vitest.dev/guide/snapshot

Highlights the difference in how custom messages are displayed in snapshot files when using `toThrowErrorMatchingSnapshot`. Vitest uses `>` while Jest uses `:`. Also shows the default error snapshot format difference.

```javascript
import { expect, test } from 'vitest'

test('toThrowErrorMatchingSnapshot', () => {
  expect(() => {
    throw new Error('error')
  }).toThrowErrorMatchingSnapshot('hint')
})
```

--------------------------------

### Mock Current Date with vi.setSystemTime

Source: https://vitest.dev/guide/mocking

Override the system time using `vi.setSystemTime()` to test date-dependent code. The mocked time persists between tests and should be reset manually with `vi.useRealTimers()`. Note: `vi.useFakeTimers()` also affects Date behavior.

```typescript
const mockDate = new Date(2022, 0, 1)
vi.setSystemTime(mockDate)
const now = new Date()
expect(now.valueOf()).toBe(mockDate.valueOf())
vi.useRealTimers()
```

--------------------------------

### Configure Vitest coverage with undefined include pattern

Source: https://vitest.dev/guide/migration

Shows configuration for coverage when include is not defined, which causes the report to include only files loaded during test execution. The exclude pattern is still applied to filter out matching files from the loaded set.

```typescript
export default defineConfig({
  test: {
    coverage: {
      // Include not set, include only files that are loaded during test run
      include: undefined,

      // Loaded files that match this pattern will be excluded:
      exclude: ['**/some-pattern/**'],
    }
  }
})
```

--------------------------------

### Spy on Object Returned from Function with Caching

Source: https://vitest.dev/guide/mocking

Mock a function to return a cached object instance, ensuring the same object reference is returned on each call. This allows you to spy on method calls across the entire test by maintaining object identity.

```javascript
export function useObject() {
  return { method: () => true }
}
```

```typescript
import { useObject } from './example.js'

vi.mock(import('./example.js'), () => {
  let _cache
  const useObject = () => {
    if (!_cache) {
      _cache = {
        method: vi.fn(),
      }
    }
    return _cache
  }
  return { useObject }
})

const obj = useObject()
expect(obj.method).toHaveBeenCalled()
```

--------------------------------

### GitHub Actions Reporter Annotation Output in Vitest

Source: https://vitest.dev/guide/test-annotations

Explains how the GitHub Actions reporter formats annotations as GitHub Actions notice messages by default. The annotation type ('notice', 'warning', 'error') can be controlled via the second argument to `annotate`. Any other type defaults to a notice.

```text
::notice ::the message of the annotation
```

--------------------------------

### Handle Unhandled Rejections and Exceptions in Node.js

Source: https://vitest.dev/guide/features

Set up custom event listeners in Node.js to manually handle unhandledRejection and uncaughtException events. This prevents Vitest from automatically reporting these errors, allowing you to implement custom error handling logic.

```TypeScript
// in Node.js
process.on('unhandledRejection', () => {
  // your own handler
})

process.on('uncaughtException', () => {
  // your own handler
})
```

--------------------------------

### Mock Exported Variables with vi.spyOn

Source: https://vitest.dev/guide/mocking

Use `vi.spyOn()` to mock exported variables by spying on the getter property. This approach allows you to intercept and control the return value of exported variables in tests. Note: This does not work in Browser Mode.

```javascript
export const getter = 'variable'
```

```typescript
import * as exports from './example.js'

vi.spyOn(exports, 'getter', 'get').mockReturnValue('mocked')
```

--------------------------------

### Stub Global Variable with vi.stubGlobal

Source: https://vitest.dev/guide/mocking

Mock a global variable by assigning a value using the vi.stubGlobal helper. Note that values do not automatically reset between tests unless the unstubGlobals config option is enabled or vi.unstubAllGlobals is called manually.

```typescript
vi.stubGlobal('__VERSION__', '1.0.0')
expect(__VERSION__).toBe('1.0.0')
```

--------------------------------

### Configure Vue Snapshot Serializer in Vitest

Source: https://vitest.dev/guide/migration

Configures Vitest to use `jest-serializer-vue` for handling Vue component snapshots. This is necessary to prevent excessive escaping of quotes in snapshot output, especially when migrating from Jest with a vue-cli preset.

```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotSerializers: ['jest-serializer-vue']
  }
})
```

--------------------------------

### Spying on Module Exports in Vitest Browser Mode

Source: https://vitest.dev/guide/browser

Demonstrates spying on module exports in Vitest's browser mode. This method circumvents the limitation of directly calling `vi.spyOn` on imported objects by using `vi.mock` with the `{ spy: true }` option.

```typescript
import { vi } from 'vitest'
import * as module from './module.js'

vi.mock('./module.js', { spy: true })

vi.mocked(module.method).mockImplementation(() => {
  // ...
})
```

--------------------------------

### Enable Trace Generation via CLI

Source: https://vitest.dev/guide/browser/trace-view

Enable trace file generation using the command-line interface by passing the --browser.trace=on flag to the vitest command.

```bash
vitest --browser.trace=on
```

--------------------------------

### Vitest v4: Module Mocking Changes and Instance Isolation

Source: https://vitest.dev/guide/migration

Illustrates changes in Vitest v4's module mocking, including `vi.fn().getMockName()` behavior, `vi.restoreAllMocks` scope, and automocked instance method isolation. Automocked instance methods share state with the prototype unless custom implementations are provided.

```typescript
import { AutoMockedClass } from './example.js'
const instance1 = new AutoMockedClass()
const instance2 = new AutoMockedClass()

instance1.method.mockReturnValue(42)

expect(instance1.method()).toBe(42)
expect(instance2.method()).toBe(undefined)

expect(AutoMockedClass.prototype.method).toHaveBeenCalledTimes(2)

instance1.method.mockReset()
AutoMockedClass.prototype.method.mockReturnValue(100)

expect(instance1.method()).toBe(100)
expect(instance2.method()).toBe(100)

expect(AutoMockedClass.prototype.method).toHaveBeenCalledTimes(4)
```

--------------------------------

### Integrate Testing Library with Vitest Browser Mode for Solid.js

Source: https://vitest.dev/guide/browser/component-testing

Demonstrates how to use Testing Library's render function with Vitest's page.elementLocator() to bridge DOM output and interact with components. This pattern works for frameworks without official Vitest browser packages. Shows rendering a Solid.js Counter component, querying elements, and testing user interactions with assertions.

```jsx
// For Solid.js components
import { render } from '@testing-library/solid'
import { page } from 'vitest/browser'

test('Solid component handles user interaction', async () => {
  // Use Testing Library to render the component
  const { baseElement, getByRole } = render(() =>
    <Counter initialValue={0} />
  )

  // Bridge to Vitest's browser mode for interactions and assertions
  const screen = page.elementLocator(baseElement)

  // Use Vitest's page queries for finding elements
  const incrementButton = screen.getByRole('button', { name: /increment/i })

  // Use Vitest's assertions and interactions
  await expect.element(screen.getByText('Count: 0')).toBeInTheDocument()

  // Trigger user interaction using Vitest's page API
  await incrementButton.click()

  await expect.element(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

--------------------------------

### Ignoring Entire File in TypeScript

Source: https://vitest.dev/guide/coverage

Demonstrates how to ignore an entire TypeScript file from code coverage reports by using the `v8 ignore file -- @preserve` hint. This is useful for utility files or test-specific code that does not need to be included in the coverage metrics.

```ts
/* v8 ignore file -- @preserve */
export function ignored() { // [!code error]
  return 'Whole file is ignored'// [!code error]
}// [!code error]

```

--------------------------------

### Configure Verbose Reporter in Vitest

Source: https://vitest.dev/guide/reporters

The verbose reporter prints every test case as it finishes, including task locations if enabled. It also reports test errors immediately and full errors at the end. This reporter shows annotations even for passing tests. Configuration can disable the summary.

```bash
npx vitest --reporter=verbose
```

```bash
npx vitest --reporter=verbose --includeTaskLocation
```

--------------------------------

### JUnit Reporter Annotation Output in Vitest

Source: https://vitest.dev/guide/test-annotations

Demonstrates how the JUnit reporter formats annotations within the `<testcase>` tag. Annotations are represented as `<property>` tags, with the annotation type as the 'name' attribute and the message as the 'value' attribute. Attachments are ignored.

```xml
<testcase classname="basic/example.test.js" name="an example of a test with annotation" time="0.14315">
    <properties>
        <property name="notice" value="the message of the annotation">
        </property>
    </properties>
</testcase>
```

--------------------------------

### Set test directory location in Vitest configuration

Source: https://vitest.dev/guide/migration

Configures the test.dir option to specify where test files are located. This is the recommended approach for limiting test file discovery instead of using exclude patterns, as it offers better performance.

```typescript
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: './frontend/tests',
  },
})
```

--------------------------------

### Configure Vitest Reporter Output

Source: https://vitest.dev/guide/migration

This snippet shows how to configure the Vitest reporter to display test results in a tree format, reverting from the default flat list introduced with the 'verbose' reporter. It replaces the `reporters: ['verbose']` setting with `reporters: ['tree']` to achieve the desired output structure.

```typescript
export default defineConfig({
  test: {
    reporters: ['verbose'], // [!code --]
    reporters: ['tree'], // [!code ++]
  }
})
```

--------------------------------

### Resolve Module Not Found with tsconfig-paths in Vitest

Source: https://vitest.dev/guide/common-errors

Handles 'Cannot find module' errors in Vitest when using `baseUrl` in `tsconfig.json` by integrating `vite-tsconfig-paths`. This plugin helps Vite understand tsconfig paths, otherwise, paths might need to be rewritten to be relative to the current file.

```typescript
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()]
})
```

--------------------------------

### Worker Initialization for Custom Pool

Source: https://vitest.dev/guide/advanced/pool

This TypeScript snippet shows how to initialize a Vitest worker for a custom pool. It uses the `init` function from `vitest/worker` to define callbacks for sending/receiving messages, handling teardown, and custom serialization/deserialization, along with test collection and execution logic.

```typescript
import { init, runBaseTests } from 'vitest/worker'

init({
  post: (response) => {
    // Provide way to send this message to CustomPoolRunner's onWorker as message event
  },
  on: (callback) => {
    // Provide a way to listen CustomPoolRunner's "postMessage" calls
  },
  off: (callback) => {
    // Optional, provide a way to remove listeners added by "on" calls
  },
  teardown: () => {
    // Optional, provide a way to teardown worker, e.g. unsubscribe all the `on` listeners
  },
  serialize: (value) => {
    // Optional, provide custom serializer for `post` calls
  },
  deserialize: (value) => {
    // Optional, provide custom deserializer for `on` callbacks
  },
  runTests: state => runBaseTests('run', state),
  collectTests: state => runBaseTests('collect', state),
})
```

--------------------------------

### Handle Error Events in Browser Environment

Source: https://vitest.dev/guide/features

Set up custom event listeners in the browser to manually handle error and unhandledrejection events. This allows you to intercept and handle errors in browser-based tests without Vitest's automatic error reporting.

```TypeScript
// in the browser
window.addEventListener('error', () => {
  // your own handler
})

window.addEventListener('unhandledrejection', () => {
  // your own handler
})
```

--------------------------------

### Context Destructuring for Vitest Fixtures (TypeScript)

Source: https://vitest.dev/guide/test-context

Illustrates the correct way to access test context when using extended fixtures in Vitest. It highlights the necessity of using object destructuring (e.g., `{ todos }`) instead of accessing the context object directly (e.g., `context.todos`) to ensure fixtures are properly resolved.

```typescript
test('context must be destructured', ({ todos }) => { // [!code ++]
  expect(todos.length).toBe(2)
})
```

--------------------------------

### VS Code Debug Launch Configuration for Vitest

Source: https://vitest.dev/guide/debugging

JSON launch configuration for VS Code debugger to debug individual Vitest test files. This configuration enables automatic child process attachment, skips internal Node files, and uses the integrated terminal for output. Set the debug configuration to 'Debug Current Test File' and press F5 to start debugging.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test File",
      "autoAttachChildProcesses": true,
      "skipFiles": ["<node_internals>/**", "**/node_modules/**"],
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${relativeFile}"],
      "smartStep": true,
      "console": "integratedTerminal"
    }
  ]
}
```

--------------------------------

### Handle Newly Added Files for Testing (TypeScript)

Source: https://vitest.dev/guide/advanced/tests

Shows how to handle newly added files by checking if they match any project glob patterns and then rerunning relevant test specifications. This is an alternative to `getModuleSpecifications` when files are newly created. It utilizes `project.matchesGlobPattern` and `project.createSpecification`.

```typescript
watcher.on('add', async (file) => {
  const specifications = []
  for (const project of vitest.projects) {
    if (project.matchesGlobPattern(file)) {
      specifications.push(project.createSpecification(file))
    }
  }

  if (specifications.length) {
    await vitest.rerunTestSpecifications(specifications)
  }
})
```

--------------------------------

### Define a Custom Pool Runner Initializer

Source: https://vitest.dev/guide/advanced/pool

This TypeScript snippet defines the `customPool` function, which acts as a factory for creating a `PoolRunnerInitializer`. It returns an object containing the pool's name and a function to create a `CustomPoolWorker`, enabling custom test execution logic.

```typescript
import type { PoolRunnerInitializer } from 'vitest/node'

// Assuming CustomOptions is defined elsewhere
// interface CustomOptions { [key: string]: any }

export function customPool(customOptions: CustomOptions): PoolRunnerInitializer {
  return {
    name: 'custom-pool',
    createPoolWorker: options => new CustomPoolWorker(options, customOptions),
  }
}
```

--------------------------------

### Import Module as Object in Test

Source: https://vitest.dev/guide/mocking/modules

This JavaScript code demonstrates importing all exports from './example.js' into a test file as a single namespace object named 'exampleObject'. This allows for module-level mocking or inspection within tests.

```javascript
import * as exampleObject from './example.js'
```

--------------------------------

### Adjusting Vitest Alias for Relative Paths

Source: https://vitest.dev/guide/common-errors

Corrects module import issues in Vitest by modifying the `alias` configuration. It demonstrates how to change an alias from being relative to the root to being relative to the current file's import meta URL, resolving discrepancies in path interpretation.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': './src/',
      '@/': new URL('./src/', import.meta.url).pathname
    }
  }
})
```

--------------------------------

### Create Custom Reporter with BaseReporter in JavaScript

Source: https://vitest.dev/guide/advanced/reporters

Shows how to create a custom reporter from scratch by extending the `BaseReporter` class and implementing necessary methods. This approach provides full control over reporting logic.

```javascript
import { BaseReporter } from 'vitest/reporters'

export default class CustomReporter extends BaseReporter {
  onTestModuleCollected() {
    const files = this.ctx.state.getFiles(this.watchFilters)
    this.reportTestSummary(files)
  }
}
```

--------------------------------

### Ignoring Try/Catch Blocks in TypeScript

Source: https://vitest.dev/guide/coverage

Demonstrates how to ignore entire `try` or `catch` blocks from coverage using `v8 ignore next` with `@preserve`. This allows selective exclusion of error handling code or specific parts of the try-catch mechanism from coverage metrics. Note: Requires rolldown-vite for full esbuild compatibility.

```ts
/* v8 ignore next -- @preserve */
try { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]
catch (error) { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]

try {
  console.log('Included')
}
catch (error) {
  /* v8 ignore next -- @preserve */
  console.log('Ignored') // [!code error]
  /* v8 ignore next -- @preserve */
  console.log('Ignored') // [!code error]
}

// Requires rolldown-vite due to esbuild's lack of support.
// See https://vite.dev/guide/rolldown.html#how-to-try-rolldown
try {
  console.log('Included')
}
catch (error) /* v8 ignore next */ { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]

```

--------------------------------

### Scoping Fixture Values to Test Suites with test.scoped (TypeScript)

Source: https://vitest.dev/guide/test-context

Demonstrates the use of `test.scoped()` in Vitest to override fixture values for a specific test suite and its nested suites. This allows for localized configuration changes without affecting other parts of the test suite.

```typescript
import { test as baseTest, describe, expect } from 'vitest'

const test = baseTest.extend({
  dependency: 'default',
  dependant: ({ dependency }, use) => use({ dependency })
})

describe('use scoped values', () => {
  test.scoped({ dependency: 'new' })

  test('uses scoped value', ({ dependant }) => {
    // `dependant` uses the new overridden value that is scoped
    // to all tests in this suite
    expect(dependant).toEqual({ dependency: 'new' })
  })

  describe('keeps using scoped value', () => {
    test('uses scoped value', ({ dependant }) => {
      // nested suite inherited the value
      expect(dependant).toEqual({ dependency: 'new' })
    })
  })
})

test('keep using the default values', ({ dependant }) => {
  // the `dependency` is using the default
  // value outside of the suite with .scoped
  expect(dependant).toEqual({ dependency: 'default' })
})
```

--------------------------------

### Type Assertion Failure Example for toBeString

Source: https://vitest.dev/guide/testing-types

Demonstrates a failing type assertion where `expectTypeOf(1).toBeString()` is expected to fail. The `toBe...` methods resolve to non-callable types when the actual type doesn't match, producing a 'not callable' error that indicates a type mismatch.

```typescript
expectTypeOf(1).toBeString()
```

--------------------------------

### Vitest Module Mocking with Default Export

Source: https://vitest.dev/guide/migration

Illustrates how to correctly mock a module in Vitest when the module's factory function should return a default export. Unlike Jest, where the factory's return value is the default export, Vitest requires an object with an explicit 'default' property.

```typescript
jest.mock('./some-path', () => 'hello') // [!code --]
vi.mock('./some-path', () => ({
  default: 'hello',
})) // [!code ++]
```

--------------------------------

### Mock System Time in Vitest Test Suite

Source: https://vitest.dev/guide/mocking/dates

Demonstrates how to mock system dates and timers in Vitest tests using fake timers. The example tests a purchase function that only allows transactions during business hours (9-17). Uses vi.useFakeTimers() to enable mocking, vi.setSystemTime() to set specific dates, and vi.useRealTimers() to restore real time after tests. This ensures consistent test behavior regardless of actual system time.

```javascript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const businessHours = [9, 17]

function purchase() {
  const currentHour = new Date().getHours()
  const [open, close] = businessHours

  if (currentHour > open && currentHour < close) {
    return { message: 'Success' }
  }

  return { message: 'Error' }
}

describe('purchasing flow', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('allows purchases within business hours', () => {
    // set hour within business hours
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    // access Date.now() will result in the date set above
    expect(purchase()).toEqual({ message: 'Success' })
  })

  it('disallows purchases outside of business hours', () => {
    // set hour outside business hours
    const date = new Date(2000, 1, 1, 19)
    vi.setSystemTime(date)

    // access Date.now() will result in the date set above
    expect(purchase()).toEqual({ message: 'Error' })
  })
})
```

--------------------------------

### Test for Uncaught Errors Using onTestFinished Hook

Source: https://vitest.dev/guide/features

Create a test that verifies an uncaught error was not handled by registering an unhandledRejection listener and using the onTestFinished hook for cleanup. This approach uses vi.fn() to track if the error handler was called and expect.poll() to wait for the assertion.

```TypeScript
test('my function throws uncaught error', async ({ onTestFinished }) => {
  const unhandledRejectionListener = vi.fn()
  process.on('unhandledRejection', unhandledRejectionListener)
  onTestFinished(() => {
    process.off('unhandledRejection', unhandledRejectionListener)
  })

  callMyFunctionThatRejectsError()

  await expect.poll(unhandledRejectionListener).toHaveBeenCalled()
})
```

--------------------------------

### Ignoring Conditional Blocks (if/else) in TypeScript

Source: https://vitest.dev/guide/coverage

Illustrates how to ignore specific `if` or `else` blocks from coverage reports using `v8 ignore if` and `v8 ignore else` with the `@preserve` tag. This prevents certain conditional logic from being counted towards code coverage.

```ts
/* v8 ignore if -- @preserve */
if (parameter) { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]
else {
  console.log('Included')
}

/* v8 ignore else -- @preserve */
if (parameter) {
  console.log('Included')
}
else { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]

```

--------------------------------

### Vitest Mock State Persistence

Source: https://vitest.dev/guide/migration

Demonstrates the persistent nature of mock state in Vitest compared to Jest. In Vitest, 'mock.mockClear()' does not reset the mock state, allowing access to the same mock state object before and after clearing. This differs from Jest, which recreates the mock state.

```typescript
const mock = vi.fn()
const state = mock.mock
mock.mockClear()

expect(state).toBe(mock.mock) // fails in Jest
```

--------------------------------

### Configure Production Build with unbuild

Source: https://vitest.dev/guide/in-source

Set up unbuild configuration to replace `import.meta.vitest` with undefined, allowing the bundler to eliminate test code during the production build process.

```javascript
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  replace: {
    'import.meta.vitest': 'undefined',
  },
})
```

--------------------------------

### Specify Vitest Test Execution by File and Line Number (CLI)

Source: https://vitest.dev/guide/filtering

Execute a specific test or hook within a file by providing the filename and line number to the Vitest CLI. This feature requires the full filename (relative or absolute) and supports specifying a single line number or a range of line numbers. It's helpful for debugging or quickly testing a specific piece of code.

```bash
$ vitest basic/foo.test.ts:10
$ vitest basic/foo.js:10
$ vitest ./basic/foo.js:10
$ vitest /users/project/basic/foo.js:10
$ vitest basic/foo.test.ts:10, basic/foo.test.ts:25
```

--------------------------------

### Create Vitest Instance Without Running Tests (TypeScript)

Source: https://vitest.dev/guide/advanced/tests

Creates a Vitest instance without automatically running tests, using the createVitest function. This method requires manual test execution and closing of the Vitest instance. It doesn't validate package installations and provides hooks for cancellation, closing, and test reruns. Dependencies include 'vitest/node'.

```typescript
import { createVitest } from 'vitest/node'

const vitest = await createVitest(
  'test',
  {},
  {},
  {},
)

vitest.onCancel(() => {})
vitest.onClose(() => {})
vitest.onTestsRerun((files) => {})

try {
  await vitest.start(['my-filter'])
}
catch (err) {
}
finally {
  await vitest.close()
}
```

--------------------------------

### Add Custom Snapshot Serializer using API (TypeScript)

Source: https://vitest.dev/guide/snapshot

This snippet demonstrates how to add a custom snapshot serializer directly within a test file using Vitest's `expect.addSnapshotSerializer` API. It defines `serialize` and `test` methods to customize snapshot output for objects with a 'foo' property.

```typescript
expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return `Pretty foo: ${printer(
      val.foo,
      config,
      indentation,
      depth,
      refs,
    )}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
  },
})
```

--------------------------------

### Run Only Specific Vitest Suites and Tests (TypeScript)

Source: https://vitest.dev/guide/filtering

Utilize the `.only` decorator in Vitest to exclusively run a particular test suite or an individual test. When `.only` is used on a suite or test, all other tests and suites that are not marked with `.only` will be skipped. This is invaluable for focusing on a specific set of tests during development or debugging.

```typescript
import { assert, describe, it } from 'vitest'

// Only this suite (and others marked with only) are run
describe.only('suite', () => {
  it('test', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('another suite', () => {
  it('skipped test', () => {
    // Test skipped, as tests are running in Only mode
    assert.equal(Math.sqrt(4), 3)
  })

  it.only('test', () => {
    // Only this test (and others marked with only) are run
    assert.equal(Math.sqrt(4), 2)
  })
})
```

--------------------------------

### Skip Vitest Suites and Tests (TypeScript)

Source: https://vitest.dev/guide/filtering

Use the `.skip` decorator in Vitest to exclude entire test suites or individual tests from the execution. This is helpful for temporarily disabling tests during development or when a feature is not yet implemented. Both `describe` and `it` blocks can be marked with `.skip`.

```typescript
import { assert, describe, it } from 'vitest'

describe.skip('skipped suite', () => {
  it('test', () => {
    // Suite skipped, no error
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('suite', () => {
  it.skip('skipped test', () => {
    // Test skipped, no error
    assert.equal(Math.sqrt(4), 3)
  })
})
```

--------------------------------

### Manually Rerun Tests on File Changes (TypeScript)

Source: https://vitest.dev/guide/advanced/tests

Demonstrates how to manually rerun tests when files change using the Vitest advanced API. It involves invalidating files and calling rerunTestSpecifications. This example assumes a watcher is set up externally and Vitest's default watcher behavior is modified.

```typescript
watcher.on('change', async (file) => {
  const specifications = vitest.getModuleSpecifications(file)
  if (specifications.length) {
    vitest.invalidateFile(file)
    await vitest.rerunTestSpecifications(specifications)
  }
})
```

--------------------------------

### Vitest Snapshot Formatting for Custom Elements

Source: https://vitest.dev/guide/migration

This code snippet illustrates the change in Vitest snapshot formatting for custom elements. Before Vitest 4.0, only the custom element tag was included. After Vitest 4.0, the snapshot now includes the contents of the shadow root. The `printShadowRoot` option can be set to `false` to revert to the previous behavior.

```javascript
// before Vite 4.0
exports[`custom element with shadow root 1`] = `
"<body>
  <div>
    <custom-element />
  </div>
</body>"
`

// after Vite 4.0
exports[`custom element with shadow root 1`] = `
"<body>
  <div>
    <custom-element>
      #shadow-root
        <span
          class="some-name"
          data-test-id="33"
          id="5"
        >
          hello
        </span>
    </custom-element>
  </div>
</body>"
`
```

--------------------------------

### Type Testing with expectTypeOf and assertType in Vitest

Source: https://vitest.dev/guide/testing-types

Demonstrates how to write type tests in Vitest using `expectTypeOf` and `assertType` to validate function signatures and parameter types. The example shows testing a mount function with type assertions and error expectations. Type errors inside test files are treated as test failures, allowing comprehensive type validation.

```typescript
import { assertType, expectTypeOf } from 'vitest'
import { mount } from './mount.js'

test('my types work properly', () => {
  expectTypeOf(mount).toBeFunction()
  expectTypeOf(mount).parameter(0).toExtend<{ name: string }>()

  // @ts-expect-error name is a string
  assertType(mount({ name: 42 }))
})
```

--------------------------------

### Filter Vitest Tests by Filename (CLI)

Source: https://vitest.dev/guide/filtering

Execute test files containing a specific string in their name using the Vitest CLI. This is useful for quickly running a subset of tests related to a particular feature or module. The CLI command searches for the provided pattern within filenames.

```bash
$ vitest basic
```

--------------------------------

### Mark Unimplemented Vitest Suites and Tests (TypeScript)

Source: https://vitest.dev/guide/filtering

Use the `.todo` decorator in Vitest to mark test suites or individual tests that are planned but not yet implemented. Vitest will report these as 'todo' entries, indicating that they need attention without causing the test run to fail. This helps in organizing test development and tracking incomplete test cases.

```typescript
import { describe, it } from 'vitest'

// An entry will be shown in the report for this suite
describe.todo('unimplemented suite')

// An entry will be shown in the report for this test
describe('suite', () => {
  it.todo('unimplemented test')
})
```

--------------------------------

### Vitest Module Mocking Pitfall: Internal Method Calls (JavaScript)

Source: https://vitest.dev/guide/mocking/modules

Highlights a limitation in Vitest's module mocking where calling methods within the same file cannot be mocked from the outside. The example shows `foobar.js` calling `foo()`, and how mocking `foo` externally does not affect its invocation within `foobar`.

```javascript
export function foo() {
  return 'foo'
}

export function foobar() {
  return `${foo()}bar`
}
```

--------------------------------

### Debug File Transformations with VITEST_DEBUG_DUMP

Source: https://vitest.dev/guide/profiling-test-performance

Enable debugging to dump transformed files to the file system. This is useful for identifying unnecessary file transformations, often caused by barrel files. The `VITEST_DEBUG_DUMP=true` environment variable instructs Vitest to write the processed files into a `.vitest-dump` directory, allowing for inspection of the transformation pipeline.

```bash
$ VITEST_DEBUG_DUMP=true vitest --run
```

--------------------------------

### Disable Isolation for Specific Vitest Test Files

Source: https://vitest.dev/guide/recipes

Configure Vitest projects to disable isolation for unit tests while keeping integration tests isolated. This can speed up test runs by running non-isolated tests in the same Node.js process. It uses the `isolate: false` option within the `projects` array in `vitest.config.ts`.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        // Non-isolated unit tests
        name: 'Unit tests',
        isolate: false,
        exclude: ['**.integration.test.ts'],
      },
      {
        // Isolated integration tests
        name: 'Integration tests',
        include: ['**.integration.test.ts'],
      },
    ],
  },
})
```

--------------------------------

### Vitest Type Checking: False Positive with Typo

Source: https://vitest.dev/guide/testing-types

Highlights a potential pitfall when using `@ts-expect-error` with `assertType` in Vitest. This example shows how a typo in the variable name can lead to a false positive, as the assertion expects an error but the actual code fails due to a `ReferenceError` instead of a type mismatch.

```typescript
// @ts-expect-error answer is not a string
assertType<string>(answr)
```

--------------------------------

### Configure Vitest with project inheritance using extends option

Source: https://vitest.dev/guide/projects

Define multiple test projects with selective inheritance from root-level configuration using the extends option. Projects with extends: true inherit root options like plugins and pool, while extends: false creates isolated configurations.

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'threads',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
      {
        extends: false,
        test: {
          name: 'integration',
          include: ['**/*.integration.test.ts'],
        },
      },
    ],
  },
})
```

--------------------------------

### Annotate Test Cases with Messages and Files in Vitest (TypeScript)

Source: https://vitest.dev/guide/test-annotations

Demonstrates how to use the `annotate` function within a Vitest test to add custom messages and file attachments. Annotations can include text, a type (e.g., 'error'), or an object with a 'body'. The `annotate` function is asynchronous and should be awaited, though Vitest automatically awaits non-awaited annotations before test completion.

```typescript
test('hello world', async ({ annotate }) => {
  await annotate('this is my test')

  if (condition) {
    await annotate('this should\'ve errored', 'error')
  }

  const file = createTestSpecificFile()
  await annotate('creates a file', { body: file })
})
```

--------------------------------

### Filter Vitest Tests by Full Name Pattern (CLI)

Source: https://vitest.dev/guide/filtering

Filter tests based on their full name, including the test description, using the `-t` or `--testNamePattern` option in the Vitest CLI. This allows for more granular control over which tests are executed, beyond just filename matching. It is particularly useful when tests have descriptive names within the test file.

```bash
$ vitest -t "My Feature: should do something"
```

--------------------------------

### Vitest CLI argument format and variations

Source: https://vitest.dev/guide/cli

Vitest supports flexible CLI argument formats including camelCase and kebab-case, multiple value passing, and boolean negation with no- prefix or false values.

```bash
vitest --reporter dot --reporter=default
```

```bash
vitest --no-api
vitest --api=false
```

--------------------------------

### Define Projects using Glob Patterns in Vitest Config

Source: https://vitest.dev/guide/projects

Configure Vitest to recognize projects defined by glob patterns within the `projects` array in your `vitest.config.ts`. This allows specifying directories or files that represent individual projects. Dependencies include `vitest/config`. It accepts string patterns and returns a defineConfig object.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
  },
})
```

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*',
      '!packages/excluded'
    ],
  },
})
```

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/!(business)',
      'packages/business/*',
    ],
  },
})
```

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.{e2e,unit}.ts'],
  },
})
```

--------------------------------

### Stub Global Variable with vi.stubGlobal (TypeScript)

Source: https://vitest.dev/guide/mocking/globals

This snippet demonstrates how to mock a global variable, specifically `IntersectionObserver`, using Vitest's `vi.stubGlobal` function. It first creates a mock function for `IntersectionObserver` and then stubs the global object with this mock. This allows the mocked global to be accessed directly or via `window.IntersectionObserver` within tests.

```typescript
import { vi } from 'vitest'

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// now you can access it as `IntersectionObserver` or `window.IntersectionObserver`
```

--------------------------------

### Set Custom Timeout for Vitest Tests (TypeScript)

Source: https://vitest.dev/guide/filtering

Specify a custom timeout in milliseconds for individual Vitest tests. By default, tests have a 5-second timeout. This option allows you to override the default for tests that might take longer to execute. The timeout is passed as the third argument to the `test` function.

```typescript
import { test } from 'vitest'

test('name', async () => { /* ... */ }, 1000)
```

--------------------------------

### Define Projects with Inline Configuration in Vitest

Source: https://vitest.dev/guide/projects

Define projects using inline configuration objects within the `projects` array in `vitest.config.ts`. This allows for more granular control, including extending root configurations and setting project-specific environments and names. Dependencies include `vitest/config`. It accepts an array of glob patterns or configuration objects.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*',
      {
        extends: true,
        test: {
          include: ['tests/**/*.{browser}.test.{ts,js}'],
          name: 'happy-dom',
          environment: 'happy-dom',
        }
      },
      {
        test: {
          include: ['tests/**/*.{node}.test.{ts,js}'],
          name: { label: 'node', color: 'green' },
          environment: 'node',
        }
      }
    ]
  }
})
```

--------------------------------

### Run tests related to source files

Source: https://vitest.dev/guide/cli

Execute only tests that cover specified source files using static imports. Works with both relative and absolute paths. Useful with lint-staged tools and CI pipelines by combining with --run flag.

```bash
vitest related /src/index.ts /src/hello-world.js
```

```javascript
export default {
  '*.{js,ts}': 'vitest related --run',
}
```

--------------------------------

### Run Vitest benchmark tests

Source: https://vitest.dev/guide/cli

Execute only benchmark tests that compare performance results, excluding regular unit tests.

```bash
vitest bench
```

--------------------------------

### Run Vitest with filename and line number

Source: https://vitest.dev/guide/cli

Execute Vitest for a specific test at a given line number using the format filename:lineNumber. Requires full filename (relative or absolute path). Supports single line numbers and comma-separated line numbers, but not ranges.

```bash
$ vitest basic/foo.test.ts:10
```

```bash
$ vitest basic/foo.js:10 # ✅
$ vitest ./basic/foo.js:10 # ✅
$ vitest /users/project/basic/foo.js:10 # ✅
$ vitest foo:10 # ❌
$ vitest ./basic/foo:10 # ❌
```

```bash
$ vitest basic/foo.test.ts:10, basic/foo.test.ts:25 # ✅
$ vitest basic/foo.test.ts:10-25 # ❌
```

--------------------------------

### Mock External Dependencies with Vitest

Source: https://vitest.dev/guide/browser/component-testing

Provides patterns for mocking external APIs and services to isolate component logic and improve test reliability. Recommends Mock Service Worker (MSW) for API requests and shows module mocking syntax for component dependencies.

```tsx
// For API requests, we recommend using MSW (Mock Service Worker)
// See: https://vitest.dev/guide/mocking/requests
// This provides more realistic request/response mocking

// For module mocking, use the import() syntax
vi.mock(import('../components/UserCard'), () => ({
  default: vi.fn(() => <div>Mocked UserCard</div>)
}))
```

--------------------------------

### Configure Production Build with webpack

Source: https://vitest.dev/guide/in-source

Use webpack's DefinePlugin to replace `import.meta.vitest` with undefined, enabling dead code elimination for removing test blocks from production builds.

```javascript
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'import.meta.vitest': 'undefined',
    })
  ],
}
```

--------------------------------

### Run tests for a specific project using --project flag

Source: https://vitest.dev/guide/projects

Filter test execution to a single project using the --project CLI option. This allows running tests only from the specified project instead of all configured projects.

```bash
npm run test --project e2e
```

```bash
yarn test --project e2e
```

```bash
pnpm run test --project e2e
```

```bash
bun run test --project e2e
```

--------------------------------

### Handle Constructor Return Values Correctly

Source: https://vitest.dev/guide/mocking/classes

Demonstrates the difference between using class syntax vs arrow functions in constructors. Arrow function constructors that return objects break instanceof checks, so use class syntax for proper prototype binding.

```typescript
const CorrectDogClass = vi.fn(function (name) {
  this.name = name
})

const IncorrectDogClass = vi.fn(name => ({
  name
}))

const Marti = new CorrectDogClass('Marti')
const Newt = new IncorrectDogClass('Newt')

Marti instanceof CorrectDogClass // ✅ true
Newt instanceof IncorrectDogClass // ❌ false!
```

--------------------------------

### createVitest API

Source: https://vitest.dev/guide/advanced/tests

Creates a Vitest instance without running any tests. This method is useful for more granular control over the Vitest lifecycle and execution.

```APIDOC
## `createVitest`

### Description
Creates a Vitest instance without running any tests. This method does not validate required packages and doesn't automatically close Vitest. It provides methods to manually start, cancel, and close the Vitest process, and to handle lifecycle events.

### Method
`createVitest(cliFilters, testConfigOverrides, viteConfigOverrides, vitestCustomOptions)`

### Parameters

#### `cliFilters` (Array<string>)
- Optional. Filters to apply to the tests, similar to CLI arguments.

#### `testConfigOverrides` (object)
- Optional. Overrides for the Vitest test configuration.

#### `viteConfigOverrides` (object)
- Optional. Overrides for the Vite configuration.

#### `vitestCustomOptions` (object)
- Optional. Custom options for Vitest.

### Request Example
```ts
import { createVitest } from 'vitest/node'

const vitest = await createVitest(
  'test', // CLI filters
  {},
  {},
  {},
)

// called when `vitest.cancelCurrentRun()` is invoked
vitest.onCancel(() => {})
// called during `vitest.close()` call
vitest.onClose(() => {})
// called when Vitest reruns test files
vitest.onTestsRerun((files) => {})

try {
  // this will set process.exitCode to 1 if tests failed,
  // and won't close the process automatically
  await vitest.start(['my-filter'])
}
catch (err) {
  // this can throw
  // "FilesNotFoundError" if no files were found
  // "GitNotFoundError" with `--changed` and repository is not initialized
}
finally {
  await vitest.close()
}
```

### Response
#### Success Response (Vitest Instance)
- `vitest` (object) - An instance of Vitest with methods to interact with the test runner.
  - `onCancel(callback)`: Registers a callback for when a run is cancelled.
  - `onClose(callback)`: Registers a callback for when Vitest is closing.
  - `onTestsRerun(callback)`: Registers a callback for when tests are rerun.
  - `start(filters)`: Starts running tests.
  - `close()`: Closes the Vitest instance.

#### Response Example
```json
// Vitest instance object
```

### Additional Notes
- It is recommended to call `init()` to initialize reporters and coverage providers if you intend to keep the `Vitest` instance.
- Enable `watch` mode for certain features to work correctly in a continuous process.
- Use `runTestSpecifications` or `rerunTestSpecifications` to run tests manually after reporters are initialized.
- To disable the watcher, pass `server.watch: null` or `server.watch: { ignored: ['*/*'] }` in the Vite config.
```

--------------------------------

### Define Exports in JavaScript Module

Source: https://vitest.dev/guide/mocking/modules

This JavaScript code defines a module named 'example.js' that exports a function 'answer' and a constant 'variable'. These exports can be imported and used in other modules or test files.

```javascript
export function answer() {
  // ...
  return 42
}

export const variable = 'example'
```

--------------------------------

### List matching tests with Vitest

Source: https://vitest.dev/guide/cli

Print a list of all matching tests based on file filter and test name pattern. Supports JSON output format and file-only listing. Can save JSON output to a file or stdout.

```bash
vitest list filename.spec.ts -t="some-test"
```

```bash
vitest list filename.spec.ts -t="some-test" --json=./file.json
```

```bash
vitest list --filesOnly
```

--------------------------------

### Vitest Browser Mode: Custom Factory Resolution (TypeScript)

Source: https://vitest.dev/guide/mocking/modules

Illustrates the logic for resolving a custom factory in Vitest's Browser Mode. It shows how factory keys are obtained and used to construct a mocked module, exporting mocked properties based on the factory's return value.

```typescript
const resolvedFactoryKeys = await resolveBrowserFactory(url)
const mockedModule = `
const __private_module__ = getFactoryReturnValue(${url})
${resolvedFactoryKeys.map(key => `export const ${key} = __private_module__["${key}"]`).join('
')}
`
```

--------------------------------

### Mock Class with vi.fn()

Source: https://vitest.dev/guide/mocking/classes

Recreate a class using vi.fn() with mocked static methods, constructor, and instance methods. All methods are automatically mocked and can be asserted with Vitest matchers.

```typescript
const Dog = vi.fn(class {
  static getType = vi.fn(() => 'mocked animal')

  constructor(name) {
    this.name = name
  }

  greet = vi.fn(() => `Hi! My name is ${this.name}!`)
  speak = vi.fn(() => 'loud bark!')
  feed = vi.fn()
})
```

--------------------------------

### Write Meaningful Test Descriptions

Source: https://vitest.dev/guide/browser/component-testing

Illustrates best practices for test naming by showing user-facing behavior descriptions versus implementation-focused descriptions. Good test names describe what users should experience, not internal state changes.

```tsx
// Good: Describes user-facing behavior
test('shows error message when email format is invalid')
test('disables submit button while form is submitting')

// Avoid: Implementation-focused descriptions
test('calls validateEmail function')
test('sets isSubmitting state to true')
```

--------------------------------

### Configure Production Build with Rollup

Source: https://vitest.dev/guide/in-source

Use the @rollup/plugin-replace plugin to replace `import.meta.vitest` with undefined during the build process. This enables dead code elimination to remove test blocks from production bundles.

```javascript
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      'import.meta.vitest': 'undefined',
    })
  ],
}
```

--------------------------------

### View Trace File with Playwright Trace Viewer

Source: https://vitest.dev/guide/browser/trace-view

Open and inspect generated trace files using the Playwright Trace Viewer command-line tool. This launches an interactive viewer displaying actions and screenshots captured during the test execution.

```bash
npx playwright show-trace "path-to-trace-file"
```

--------------------------------

### Configure TypeScript Support for import.meta.vitest

Source: https://vitest.dev/guide/in-source

Add TypeScript support for `import.meta.vitest` by including the vitest/importMeta type definitions in tsconfig.json. This enables IDE autocomplete and type checking for the vitest testing APIs within source files.

```json
{
  "compilerOptions": {
    "types": [
      "vitest/importMeta"
    ]
  }
}
```

--------------------------------

### Configure Vitest Scripts in package.json

Source: https://vitest.dev/guide/browser/visual-regression-testing

Defines separate npm scripts for unit and visual regression tests in package.json. This allows developers to run unit tests locally without visual test overhead, while visual tests are reserved for CI environments.

```json
{
  "scripts": {
    "test:unit": "vitest --exclude tests/visual/*.test.ts",
    "test:visual": "vitest tests/visual/*.test.ts"
  }
}
```

--------------------------------

### Assert Method Calls on Mocked Class Instances

Source: https://vitest.dev/guide/mocking/classes

Create new instances of mocked class and verify method calls using Vitest assertions. Shows that methods are instance-specific when assigned directly.

```typescript
const Cooper = new Dog('Cooper')
Cooper.speak() // loud bark!
Cooper.greet() // Hi! My name is Cooper!

// you can use built-in assertions to check the validity of the call
expect(Cooper.speak).toHaveBeenCalled()
expect(Cooper.greet).toHaveBeenCalled()

const Max = new Dog('Max')

// methods are not shared between instances if you assigned them directly
expect(Max.speak).not.toHaveBeenCalled()
expect(Max.greet).not.toHaveBeenCalled()
```

--------------------------------

### Test Accessibility with Keyboard Navigation and ARIA Attributes

Source: https://vitest.dev/guide/browser/component-testing

Demonstrates testing keyboard navigation, focus management, and ARIA attributes to ensure components are accessible to all users. Shows testing Tab key navigation, focus state, and aria-modal attributes.

```tsx
// Test keyboard navigation
await userEvent.keyboard('{Tab}')
await expect.element(document.activeElement).toHaveFocus()

// Test ARIA attributes
await expect.element(modal).toHaveAttribute('aria-modal', 'true')
```

--------------------------------

### Access Built-in Environments and Populate Globals

Source: https://vitest.dev/guide/environment

This code snippet illustrates how to access Vitest's built-in environments and use the `populateGlobal` utility function. It imports `builtinEnvironments` and `populateGlobal` from `vitest/environments`. `builtinEnvironments` provides an object containing available environments like `jsdom`, `happy-dom`, `node`, and `edge-runtime`. The `populateGlobal` function is used to move properties from an object into the global namespace, with options to bind functions.

```typescript
import { builtinEnvironments, populateGlobal } from 'vitest/environments'

console.log(builtinEnvironments) // { jsdom, happy-dom, node, edge-runtime }

// Example of populateGlobal usage (assuming 'global' and 'original' are defined)
// interface PopulateOptions {
//   // should non-class functions be bind to the global namespace
//   bindFunctions?: boolean
// }

// interface PopulateResult {
//   // a list of all keys that were copied, even if value doesn't exist on original object
//   keys: Set<string>
//   // a map of original object that might have been overridden with keys
//   // you can return these values inside `teardown` function
//   originals: Map<string | symbol, any>
// }

// export function populateGlobal(global: any, original: any, options: PopulateOptions): PopulateResult
```

--------------------------------

### Merge shared Vitest config with project-specific configuration

Source: https://vitest.dev/guide/projects

Combine a shared Vitest configuration with project-specific settings using mergeConfig and defineProject. This approach allows reusing common configurations across multiple projects while maintaining project-specific overrides.

```typescript
import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../vitest.shared.js'

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      environment: 'jsdom',
    }
  })
)
```

--------------------------------

### Run Vitest in watch mode

Source: https://vitest.dev/guide/cli

Run all test suites and automatically rerun tests when files change. Equivalent to calling vitest without arguments. Falls back to run mode in CI or non-interactive environments.

```bash
vitest watch
```

--------------------------------

### Import Named Exports in Test

Source: https://vitest.dev/guide/mocking/modules

This JavaScript code shows how to import specific named exports ('answer', 'variable') from './example.js' into a test file. This is a common way to consume module members and is compatible with module mocking strategies.

```javascript
import { answer, variable } from './example.js'
```

--------------------------------

### Type-Safe Project Configuration with defineProject in Vitest

Source: https://vitest.dev/guide/projects

Use `defineProject` in individual project configuration files (e.g., `packages/a/vitest.config.ts`) for type safety. This method helps catch errors by preventing the use of unsupported configuration options within project-specific configs. Dependencies include `vitest/config`. It returns a project configuration object.

```typescript
// @errors: 2769
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    environment: 'jsdom',
    reporters: ['json']
  }
})
```

--------------------------------

### Test Stateful Component with State Transitions

Source: https://vitest.dev/guide/browser/component-testing

Tests a ShoppingCart component that manages items and state changes. Verifies initial empty state, item addition, and quantity updates using Vitest and React Testing Library. Demonstrates testing user interactions and DOM element verification.

```tsx
test('ShoppingCart manages items correctly', async () => {
  const { getByText, getByTestId } = render(<ShoppingCart />)

  // Initially empty
  await expect.element(getByText('Your cart is empty')).toBeInTheDocument()

  // Add item
  await page.getByRole('button', { name: /add laptop/i }).click()

  // Verify state change
  await expect.element(getByText('1 item')).toBeInTheDocument()
  await expect.element(getByText('Laptop - $999')).toBeInTheDocument()

  // Test quantity updates
  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect.element(getByText('2 items')).toBeInTheDocument()
})
```

--------------------------------

### Isolate Component Dependencies with Vitest

Source: https://vitest.dev/guide/browser/component-testing

Demonstrates how to mock dependencies like API requests and child components to test a parent component in isolation. This strategy ensures focus on the parent component's logic and behavior, improving test speed and reliability. It utilizes `vi.mock` for dependency mocking and `render` from a testing utility for rendering the component.

```tsx
import { fetchUser } from '../api/userService'
import UserCard from '../components/UserCard'

// For API requests, we recommend MSW (Mock Service Worker)
// See: https://vitest.dev/guide/mocking/requests
//
// vi.mock(import('../api/userService'), () => ({
//   fetchUser: vi.fn().mockResolvedValue({ name: 'John' })
// }))

// Mock child components to focus on parent logic
vi.mock(import('../components/UserCard'), () => ({
  default: vi.fn(({ user }) => `<div>User: ${user.name}</div>`)
}))

test('UserProfile handles loading and data states', async () => {
  const { getByText } = render(<UserProfile userId="123" />)

  // Test loading state
  await expect.element(getByText('Loading...')).toBeInTheDocument()

  // Test for data to load (expect.element auto-retries)
  await expect.element(getByText('User: John')).toBeInTheDocument()
})
```

--------------------------------

### Configure includeSource in Vitest Config

Source: https://vitest.dev/guide/in-source

Enable in-source testing by setting the `includeSource` configuration option to specify which source files should be processed for test discovery. This pattern uses glob syntax to include all JavaScript and TypeScript files in the src directory.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
})
```

--------------------------------

### Configure Production Build with Rolldown

Source: https://vitest.dev/guide/in-source

Define `import.meta.vitest` as undefined in Rolldown configuration to enable dead code elimination during production builds. This prevents test code from being included in the final bundle.

```javascript
import { defineConfig } from 'rolldown/config'

export default defineConfig({
  transform: {
    define: {
      'import.meta.vitest': 'undefined',
    },
  },
})
```

--------------------------------

### Run tests for multiple projects using multiple --project flags

Source: https://vitest.dev/guide/projects

Filter test execution to multiple specific projects by using the --project flag multiple times. This enables running tests from selected projects while excluding others.

```bash
npm run test --project e2e --project unit
```

```bash
yarn test --project e2e --project unit
```

```bash
pnpm run test --project e2e --project unit
```

```bash
bun run test --project e2e --project unit
```

--------------------------------

### Mock API Calls with MSW and Test Async Components

Source: https://vitest.dev/guide/browser/component-testing

Sets up Mock Service Worker (MSW) to intercept HTTP requests and mock API responses. Tests UserProfile component handling loading, success, and error states. Demonstrates overriding handlers per-test for error scenario testing.

```tsx
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

// Set up MSW worker with API handlers
const worker = setupWorker(
  http.get('/api/users/:id', ({ params }) => {
    // Describe the happy path
    return HttpResponse.json({ id: params.id, name: 'John Doe', email: 'john@example.com' })
  })
)

// Start the worker before all tests
beforeAll(() => worker.start())
afterEach(() => worker.resetHandlers())
afterAll(() => worker.stop())

test('UserProfile handles loading, success, and error states', async () => {
  // Test success state
  const { getByText } = render(<UserProfile userId="123" />)
  // expect.element auto-retries until elements are found
  await expect.element(getByText('John Doe')).toBeInTheDocument()
  await expect.element(getByText('john@example.com')).toBeInTheDocument()

  // Test error state by overriding the handler for this test
  worker.use(
    http.get('/api/users/:id', () => {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 })
    })
  )

  const { getByText: getErrorText } = render(<UserProfile userId="999" />)
  await expect.element(getErrorText('Error: User not found')).toBeInTheDocument()
})
```

--------------------------------

### Run Vitest Shard

Source: https://vitest.dev/guide/cli

Splits the test suite into a specified number of parts and executes only the tests belonging to the current part. This is useful for parallel test execution. It cannot be used with the --watch option.

```shell
vitest run --shard=1/3
vitest run --shard=2/3
vitest run --shard=3/3
```

--------------------------------

### Define NPM Test Scripts for Separate Test Projects

Source: https://vitest.dev/guide/browser/visual-regression-testing

Configure package.json scripts to run unit tests locally and visual regression tests against the Playwright Service. Enables developers to execute specific test projects and update visual test snapshots independently.

```json
{
  "scripts": {
    "test:visual": "vitest --project visual",
    "test:unit": "vitest --project unit"
  }
}
```

--------------------------------

### Implement Reporter Interface in TypeScript

Source: https://vitest.dev/guide/advanced/reporters

Illustrates creating a custom reporter by directly implementing the `Reporter` interface from `vitest/node`. This is suitable when full control over reporter methods is required without inheriting from `BaseReporter`.

```typescript
import type { Reporter } from 'vitest/node'

export default class CustomReporter implements Reporter {
  onTestModuleCollected() {
    // print something
  }
}
```

--------------------------------

### Configure Production Build with Vite

Source: https://vitest.dev/guide/in-source

Set up Vite configuration to eliminate in-source test code from production builds by defining `import.meta.vitest` as undefined. This allows the bundler to perform dead code elimination and remove all test blocks from the final bundle.

```typescript
/// <reference types="vitest/config" />

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
})
```

--------------------------------

### Run Vitest in single run mode

Source: https://vitest.dev/guide/cli

Execute a single test run without entering watch mode. Useful for CI environments and non-interactive terminals.

```bash
vitest run
```

--------------------------------

### Specify jsdom Environment for a Test File

Source: https://vitest.dev/guide/environment

This code snippet demonstrates how to set the `jsdom` environment for a specific test file using a control comment. It imports `expect` and `test` from Vitest and includes a test that asserts the presence of the `window` object, which is available in the jsdom environment.

```typescript
// @vitest-environment jsdom

import { expect, test } from 'vitest'

test('test', () => {
  expect(typeof window).not.toBe('undefined')
})
```

--------------------------------

### Configure Vitest Projects for Unit and Visual Tests

Source: https://vitest.dev/guide/browser/visual-regression-testing

Set up multiple test projects in Vitest configuration to separate unit tests (running locally) from visual regression tests (using Playwright Service). Configures browser instances with specific viewport dimensions and connects to remote Playwright Service endpoint using environment variables for secure authentication.

```typescript
import { env } from 'node:process'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  // ...global Vite config
  tests: {
    // ...global Vitest config
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/**/*.test.ts'],
          // regular config, can use local browsers
        },
      },
      {
        extends: true,
        test: {
          name: 'visual',
          // or you could use a different suffix, e.g.,: `tests/**/*.visual.ts?(x)`
          include: ['visual-regression-tests/**/*.test.ts?(x)'],
          browser: {
            enabled: true,
            provider: playwright({
              connectOptions: {
                wsEndpoint: `${env.PLAYWRIGHT_SERVICE_URL}?${new URLSearchParams({
                  'api-version': '2025-09-01',
                  os: 'linux', // always use Linux for consistency
                  // helps identifying runs in the service's dashboard
                  runName: `Vitest ${env.CI ? 'CI' : 'local'} run @${new Date().toISOString()}`,
                })}`,
                exposeNetwork: '<loopback>',
                headers: {
                  Authorization: `Bearer ${env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN}`,
                },
                timeout: 30_000,
              }
            }),
            headless: true,
            instances: [
              {
                browser: 'chromium',
                viewport: { width: 2560, height: 1440 },
              },
            ],
          },
        },
      },
    ],
  },
})
```

--------------------------------

### Vitest Browser Mode Debugging CLI Command

Source: https://vitest.dev/guide/debugging

Command-line invocation to debug Vitest in browser mode using Node Inspector. The --inspect-brk flag pauses execution at startup, --browser enables browser mode, and --no-file-parallelism prevents parallel test execution. By default uses port 9229 for debugging.

```bash
vitest --inspect-brk --browser --no-file-parallelism
```

--------------------------------

### Mock Virtual Module Exports in Vitest

Source: https://vitest.dev/guide/mocking/modules

Define and mock exports for virtual modules using vi.mock with a factory function. This allows you to create mock implementations for modules that don't exist on the file system, such as external APIs or environment-specific packages.

```typescript
import { vi } from 'vitest'

vi.mock(import('vscode'), () => {
  return {
    window: {
      createOutputChannel: vi.fn(),
    }
  }
})
```

--------------------------------

### Configure Custom Traces Directory in vitest.config.js

Source: https://vitest.dev/guide/browser/trace-view

Set a custom output directory for trace files using the tracesDir option within the trace configuration object. This consolidates all traces into a single directory grouped by test file, with the path relative to the project root.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      trace: {
        mode: 'on',
        // the path is relative to the root of the project
        tracesDir: './playwright-traces',
      },
    },
  },
})
```

--------------------------------

### Node Inspector Single Worker Debug Command

Source: https://vitest.dev/guide/debugging

CLI command to launch Vitest for debugging with Node Inspector without IDE integration. Uses --inspect-brk to pause at startup and --no-file-parallelism to run tests in a single worker, allowing connection via Chrome DevTools at chrome://inspect.

```bash
vitest --inspect-brk --no-file-parallelism
```

--------------------------------

### Automatic Module Mocking

Source: https://vitest.dev/guide/mocking/modules

Automatically mocks a module by providing its path to `vi.mock`. Vitest will attempt to load it from `./__mocks__/` or fallback to replacing the original module's exports with default values.

```typescript
import { vi } from 'vitest'

vi.mock(import('./example.js'))
```

--------------------------------

### Debug Async Component Behavior with Auto-Retry

Source: https://vitest.dev/guide/browser/component-testing

This test case demonstrates debugging asynchronous behavior in a component. It renders an `AsyncUserProfile` component and uses `await expect.element(page.getByText('John Doe')).toBeInTheDocument()` which automatically retries the assertion and provides helpful error messages if the element is not found in the document, addressing timing issues.

```tsx
test('debug async component behavior', async () => {
  render(<AsyncUserProfile userId="123" />)

  await expect.element(page.getByText('John Doe')).toBeInTheDocument()
})
```

--------------------------------

### Mocking a Module with Original Implementation via Factory

Source: https://vitest.dev/guide/mocking/modules

Mocks a module using a factory function that leverages `importOriginal` to include the original module's implementation. This allows tracking calls to original functions using `vi.fn()`.

```typescript
import { expect, vi } from 'vitest'
import { answer } from './example.js'

vi.mock(import('./example.js'), async (importOriginal) => {
  const originalModule = await importOriginal()
  return {
    answer: vi.fn(originalModule.answer),
    variable: 'mock',
  }
})

expect(answer()).toBe(42)

expect(answer).toHaveBeenCalled()
expect(answer).toHaveReturned(42)
```

--------------------------------

### VS Code Compound Debug Configuration for Vitest Browser

Source: https://vitest.dev/guide/debugging

VSCode compound launch configuration that runs Vitest in browser mode and simultaneously attaches the Chrome debugger. Includes two configurations: one to launch Vitest with Node debugging and another to attach Chrome debugger to port 9229. The compound configuration orchestrates both.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run Vitest Browser",
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "console": "integratedTerminal",
      "args": ["--inspect-brk", "--browser", "--no-file-parallelism"]
    },
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Vitest Browser",
      "port": 9229
    }
  ],
  "compounds": [
    {
      "name": "Debug Vitest Browser",
      "configurations": ["Attach to Vitest Browser", "Run Vitest Browser"],
      "stopAll": true
    }
  ]
}
```

--------------------------------

### Run Visual Regression Tests in GitHub Actions

Source: https://vitest.dev/guide/browser/visual-regression-testing

Executes the visual regression tests defined in the npm scripts within a GitHub Actions workflow. This command triggers Vitest to run the visual tests in the isolated environment provided by the CI.

```yaml
# ...the rest of the workflow
# ...browser setup
- name: Visual Regression Testing
  run: npm run test:visual
```

--------------------------------

### Set Environment Variables for CI/CD Pipeline

Source: https://vitest.dev/guide/browser/visual-regression-testing

Configure GitHub Actions (or similar CI systems) to securely pass Playwright Service credentials as environment variables. Uses repository variables for the service URL and secrets for the access token to prevent accidental exposure.

```yaml
env:
  PLAYWRIGHT_SERVICE_URL: ${{ vars.PLAYWRIGHT_SERVICE_URL }}
  PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
```

--------------------------------

### Mocking a Module Completely with a Factory

Source: https://vitest.dev/guide/mocking/modules

Replaces the specified module with a dynamically generated one. The factory function returns an object representing the new module. Original module code is not executed. Use `vi.fn()` to make exports trackable.

```typescript
import { vi } from 'vitest'

// The ./example.js module will be replaced with
// the result of a factory function, and the
// original ./example.js module will never be called
vi.mock(import('./example.js'), () => {
  return {
    answer() {
      // ...
      return 42
    },
    variable: 'mock',
  }
})
```

```typescript
import { vi } from 'vitest'

vi.mock(import('./example.js'), () => {
  return {
    answer: vi.fn(),
    variable: 'mock',
  }
})
```

--------------------------------

### Extend Default Reporter in TypeScript

Source: https://vitest.dev/guide/advanced/reporters

Demonstrates extending the `DefaultReporter` from `vitest/reporters` in TypeScript. This allows for incremental customization of existing reporter behavior.

```typescript
import { DefaultReporter } from 'vitest/reporters'

export default class MyDefaultReporter extends DefaultReporter {
  // do something
}
```

--------------------------------

### Configure Trace File Generation in vitest.config.js

Source: https://vitest.dev/guide/browser/trace-view

Enable trace file generation in Vitest Browser Mode by setting the trace option to 'on' in the test.browser configuration. This requires using the Playwright provider and generates trace files for each test by default, saved in the __traces__ folder.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      trace: 'on',
    },
  },
})
```

--------------------------------

### Update Visual Regression Test References with Vitest CLI

Source: https://vitest.dev/guide/browser/visual-regression-testing

Command-line usage for updating reference screenshots when intentional UI changes are made. The --update flag regenerates baseline screenshots for visual regression tests, allowing developers to review and commit updated references after intentional design modifications.

```bash
$ vitest --update
```

--------------------------------

### Vitest Configuration: Enable Type Checking

Source: https://vitest.dev/guide/testing-types

Shows how to enable Vitest's type checking feature by adding the `--typecheck` flag to the `test` script in your `package.json` file. This configuration ensures that Vitest utilizes `tsc --noEmit` or `vue-tsc --noEmit` during test runs.

```json
{
  "scripts": {
    "test": "vitest --typecheck"
  }
}
```

--------------------------------

### Visual Regression Testing with toMatchScreenshot in TypeScript

Source: https://vitest.dev/guide/browser/visual-regression-testing

Demonstrates how to perform visual regression testing using Vitest's toMatchScreenshot assertion. This captures a screenshot of a specific UI element and compares it against a reference baseline. The test imports the page object from vitest/browser and uses the getByTestId selector to target the element for comparison.

```typescript
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

test('hero section looks correct', async () => {
  // ...the rest of the test

  // capture and compare screenshot
  await expect(page.getByTestId('hero')).toMatchScreenshot('hero-section')
})
```

--------------------------------

### Vitest Browser Mode: Automocked Module Transformation (TypeScript)

Source: https://vitest.dev/guide/mocking/modules

Demonstrates how Vitest transforms a module for automocking in Browser Mode. It shows the original module exporting a function and the transformed version where the exported function is replaced with a mocked version using `vi.fn()`.

```typescript
export function answer() {
  return 42
}
```

```typescript
function answer() {
  return 42
}

const __private_module__ = {
  [Symbol.toStringTag]: 'Module',
  answer: vi.fn(answer),
}

export const answer = __private_module__.answer
```

--------------------------------

### Override Visual Test Configuration Per-Test - Vitest TypeScript

Source: https://vitest.dev/guide/browser/visual-regression-testing

Override global visual testing settings for specific test cases. Allows customization of comparator options on a test-by-test basis, such as increasing the allowed mismatch ratio for text-heavy elements. Takes precedence over global configuration.

```typescript
await expect(element).toMatchScreenshot('button-hover', {
  comparatorName: 'pixelmatch',
  comparatorOptions: {
    // more lax comparison for text-heavy elements
    allowedMismatchedPixelRatio: 0.1,
  },
})
```

--------------------------------

### Test Error Boundaries with React Components

Source: https://vitest.dev/guide/browser/component-testing

Demonstrates how to test React components that might throw errors using an ErrorBoundary. It verifies that the error boundary catches thrown errors and displays a fallback UI. This is crucial for ensuring application stability.

```tsx
// Test how components handle and recover from errors
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Component error!')
  }
  return <div>Component working fine</div>
}

test('ErrorBoundary catches and displays errors gracefully', async () => {
  const { getByText, rerender } = render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThrowError shouldThrow={false} />
    </ErrorBoundary>
  )

  // Initially working
  await expect.element(getByText('Component working fine')).toBeInTheDocument()

  // Trigger error
  rerender(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )

  // Error boundary should catch it
  await expect.element(getByText('Something went wrong')).toBeInTheDocument()
})
```

--------------------------------

### Configure Visual Tests Globally - Vitest TypeScript

Source: https://vitest.dev/guide/browser/visual-regression-testing

Set up default visual regression testing configuration in Vitest config file. Specifies the comparator engine (pixelmatch) and comparison thresholds for color differences and allowed mismatched pixel ratios. These settings apply to all visual tests unless overridden per-test.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          comparatorOptions: {
            // 0-1, how different can colors be?
            threshold: 0.2,
            // 1% of pixels can differ
            allowedMismatchedPixelRatio: 0.01,
          },
        },
      },
    },
  },
})
```

--------------------------------

### Vitest Import for Browser Mode

Source: https://vitest.dev/guide/browser/component-testing

This code shows the difference in import statements when migrating from Jest to Vitest for browser mode testing. It highlights the change from '@testing-library/react' to 'vitest-browser-react' for rendering components.

```ts
// After (Vitest)
import { render } from 'vitest-browser-react'
```

--------------------------------

### Debug Accessible Names with getByRole

Source: https://vitest.dev/guide/browser/component-testing

If getByRole fails, this code snippet helps inspect available roles and accessible names for button elements. It iterates through all buttons, retrieves their DOM elements, and logs their 'aria-label' or textContent to help identify the correct accessible name.

```tsx
const buttons = page.getByRole('button').all()
for (const button of buttons) {
  const element = button.element()
  const accessibleName = element.getAttribute('aria-label') || element.textContent
  console.log(`Button: "${accessibleName}"`)
}
```

--------------------------------

### Reassign Return Value for Specific Instance Method

Source: https://vitest.dev/guide/mocking/classes

Use vi.mocked() type helper to reassign the return value of a mocked method on a specific instance. Useful for testing different behavior per instance.

```typescript
const dog = new Dog('Cooper')

// "vi.mocked" is a type helper, since
// TypeScript doesn't know that Dog is a mocked class,
// it wraps any function in a Mock<T> type
// without validating if the function is a mock
vi.mocked(dog.speak).mockReturnValue('woof woof')

dog.speak() // woof woof
```

--------------------------------

### Spying on a Specific Module Export

Source: https://vitest.dev/guide/mocking/modules

Uses `vi.spyOn` to track calls to a specific exported function ('answer' in this case) without replacing its original implementation. The module must be imported as a namespace object.

```typescript
import { expect, vi } from 'vitest'
import * as exampleObject from './example.js'

const spy = vi.spyOn(exampleObject, 'answer').mockReturnValue(0)

expect(exampleObject.answer()).toBe(0)
expect(exampleObject.answer).toHaveBeenCalled()
```

--------------------------------

### Custom Debug Port Configuration for Vitest Browser

Source: https://vitest.dev/guide/debugging

CLI command to configure a custom debugging port (e.g., 127.0.0.1:3000) instead of the default 9229. Useful when port 9229 is already in use or when debugging through specific network interfaces.

```bash
vitest --inspect-brk=127.0.0.1:3000 --browser --no-file-parallelism
```

--------------------------------

### Redirect Virtual Module Import with Vitest Alias

Source: https://vitest.dev/guide/mocking/modules

Configure import redirection for non-existing modules by mapping them to local files using the test.alias configuration. This approach is useful for mocking external packages like 'vscode' that don't exist on the file system during testing.

```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    alias: {
      vscode: resolve(import.meta.dirname, './mock/vscode.js'),
    },
  },
})
```

--------------------------------

### Run Concurrent Tests in Vitest

Source: https://vitest.dev/guide/parallelism

Demonstrates how to use the concurrent option to run tests together within the same test file. These synchronous tests will still execute sequentially despite the concurrent flag, as Vitest only improves performance when tests rely heavily on asynchronous operations. Use sequence.concurrent config option to run all tests concurrently across files.

```typescript
test.concurrent('the first test', () => {
  expect(1).toBe(1)
})

test.concurrent('the second test', () => {
  expect(2).toBe(2)
})
```

--------------------------------

### Test Specific Elements with Visual Regression - Vitest TypeScript

Source: https://vitest.dev/guide/browser/visual-regression-testing

Demonstrates best practice of capturing specific page components rather than entire pages for visual regression testing. Reduces false positives from unrelated page changes by targeting only the component under test using test IDs.

```typescript
// ❌ Captures entire page; prone to unrelated changes
await expect(page).toMatchScreenshot()

// ✅ Captures only the component under test
await expect(page.getByTestId('product-card')).toMatchScreenshot()
```

--------------------------------

### Spying on Module Exports in Browser Mode

Source: https://vitest.dev/guide/mocking/modules

Demonstrates how to use `vi.mock` with `{ spy: true }` to enable spying on module exports in Vitest's Browser Mode, which has limitations with module namespace objects.

```typescript
import { vi } from 'vitest'
import * as exampleObject from './example.js'

vi.mock('./example.js', { spy: true })

vi.mocked(exampleObject.answer).mockReturnValue(0)
```

--------------------------------

### Wait for Fonts to Load in Vitest

Source: https://vitest.dev/guide/browser/visual-regression-testing

Addresses false positives from font rendering variations by waiting for web fonts to load before proceeding with visual tests. This ensures consistent font display across different environments.

```typescript
// wait for fonts to load
await document.fonts.ready

// continue with your tests
```

--------------------------------

### Configure Viewport Size Globally - Vitest TypeScript

Source: https://vitest.dev/guide/browser/visual-regression-testing

Set consistent viewport dimensions for all browser instances in Vitest configuration using Playwright provider. Ensures all visual tests run with the same viewport size for consistency across the test suite.

```typescript
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        {
          browser: 'chromium',
          viewport: { width: 1280, height: 720 },
        },
      ],
    },
  },
})
```

--------------------------------

### Extend Matchers with expect.extend in TypeScript

Source: https://vitest.dev/guide/extending-matchers

Defines a custom matcher 'toBeFoo' using expect.extend. It demonstrates how to check a received value and return a pass/fail status along with a custom message. The 'this' context provides access to 'isNot' for negated assertions.

```typescript
expect.extend({
  toBeFoo(received, expected) {
    const { isNot } = this
    return {
      // do not alter your "pass" based on isNot. Vitest does it for you
      pass: received === 'foo',
      message: () => `${received} is${isNot ? ' not' : ''} foo`
    }
  }
})
```

--------------------------------

### Mock Re-exported Class in Module

Source: https://vitest.dev/guide/mocking/classes

Use vi.mock() with module factory to mock a class that is re-exported from another module. The mocked class is returned as part of the module exports.

```typescript
import { Dog } from './dog.js'

vi.mock(import('./dog.js'), () => {
  const Dog = vi.fn(class {
    feed = vi.fn()
    // ... other mocks
  })
  return { Dog }
})
```

--------------------------------

### Vitest Type Checking: assertType API

Source: https://vitest.dev/guide/testing-types

Introduces the `assertType` API in Vitest as a simpler alternative to `expectTypeOf` for basic type assertions. It shows how to assert a variable's type and how Vitest reports errors for incorrect type assignments.

```typescript
const answer = 42

assertType<number>(answer)
// @ts-expect-error answer is not a string
assertType<string>(answer)
```

--------------------------------

### Set Viewport Size Per-Test - Vitest TypeScript

Source: https://vitest.dev/guide/browser/visual-regression-testing

Configure a consistent viewport size for a specific test to ensure reproducible screenshots. Ensures browser window dimensions are fixed rather than using default browser size which may vary.

```typescript
await page.viewport(1280, 720)
```

--------------------------------

### Merge Vitest Reports

Source: https://vitest.dev/guide/cli

Merges all blob reports found in a specified folder, with a default of '.vitest-reports'. This option supports various reporters but excludes the 'blob' reporter. It's useful for consolidating test results from distributed runs.

```shell
vitest --merge-reports --reporter=junit
```

--------------------------------

### Debugging Failed Vitest Visual Tests

Source: https://vitest.dev/guide/browser/visual-regression-testing

When a visual test fails, Vitest provides reference, actual, and diff screenshots to aid debugging. The diff image highlights differences, with red pixels indicating discrepancies and yellow pixels showing anti-aliasing variations.

```text
expect(element).toMatchScreenshot()

Screenshot does not match the stored reference.
245 pixels (ratio 0.03) differ.

Reference screenshot:
  tests/__screenshots__/button.test.ts/button-chromium-darwin.png

Actual screenshot:
  tests/.vitest-attachments/button.test.ts/button-chromium-darwin-actual.png

Diff image:
  tests/.vitest-attachments/button.test.ts/button-chromium-darwin-diff.png
```

--------------------------------

### TypeScript Ambient Declaration for Custom Matchers (Vitest >= 3.2.0)

Source: https://vitest.dev/guide/extending-matchers

Extends the Vitest 'Matchers' interface to provide type safety for custom matchers like 'toBeFoo'. This allows for type-aware usage of custom matchers within 'expect.extend', 'expect().*', and 'expect.*' methods.

```typescript
import 'vitest'

interface CustomMatchers<R = unknown> {
  toBeFoo: () => R
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
```

--------------------------------

### Vitest Browser Mode Configuration in vitest.config.js

Source: https://vitest.dev/guide/debugging

TypeScript configuration file for Vitest to enable browser mode debugging with Playwright provider. Sets inspectBrk to true for breakpoint debugging, disables file parallelism, and configures Chromium as the browser instance.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    inspectBrk: true,
    fileParallelism: false,
    browser: {
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    },
  },
})
```

--------------------------------

### Test Parent-Child Component Communication

Source: https://vitest.dev/guide/browser/component-testing

Validates communication between parent and child components using mock callbacks. Tests user interactions in child components and verifies that parent components receive expected callbacks with correct data. Uses vi.fn() to track function calls.

```tsx
test('parent and child components communicate correctly', async () => {
  const mockOnSelectionChange = vi.fn()

  const { getByText } = render(
    <ProductCatalog onSelectionChange={mockOnSelectionChange}>
      <ProductFilter />
      <ProductGrid />
    </ProductCatalog>
  )

  // Interact with child component
  await page.getByRole('checkbox', { name: /electronics/i }).click()

  // Verify parent receives the communication
  expect(mockOnSelectionChange).toHaveBeenCalledWith({
    category: 'electronics',
    filters: ['electronics']
  })

  // Verify other child component updates (expect.element auto-retries)
  await expect.element(getByText('Showing Electronics products')).toBeInTheDocument()
})
```

--------------------------------

### Track Mocked Class Prototype State in Vitest

Source: https://vitest.dev/guide/mocking/modules

Monitor method invocations on class instances through prototype state sharing. This technique allows tracking all calls to instance methods across different instances without direct access to each instance, useful for testing private or encapsulated code.

```typescript
import { expect, test, vi } from 'vitest'
import { Answer } from './answer.js'

vi.mock(import('./answer.js'), { spy: true })

test('instance inherits the state', () => {
  const answer1 = new Answer(42)
  const answer2 = new Answer(0)

  expect(answer1.value()).toBe(42)
  expect(answer1.value).toHaveBeenCalled()
  expect(answer2.value).not.toHaveBeenCalled()

  expect(answer2.value()).toBe(0)

  expect(Answer.prototype.value).toHaveBeenCalledTimes(2)
  expect(Answer.prototype.value).toHaveReturned(42)
  expect(Answer.prototype.value).toHaveReturned(0)
})
```

--------------------------------

### Increase Screenshot Comparison Threshold in Vitest

Source: https://vitest.dev/guide/browser/visual-regression-testing

Configures Vitest to allow a certain percentage of pixel differences in screenshots, useful for text-heavy areas where minor rendering variations are acceptable. This helps reduce false positives caused by subtle rendering changes.

```typescript
await expect(page.getByTestId('article-summary')).toMatchScreenshot({
  comparatorName: 'pixelmatch',
  comparatorOptions: {
    // 10% of the pixels are allowed to change
    allowedMismatchedPixelRatio: 0.1,
  },
})
```

--------------------------------

### Pass Mocked Class Instance to Function

Source: https://vitest.dev/guide/mocking/classes

Create a mocked class instance and pass it to a function with type-safe interface matching. Useful for testing functions that accept specific class types.

```typescript
import { expect, test, vi } from 'vitest'
import { feed } from '../src/feed.js'

const Dog = vi.fn(class {
  feed = vi.fn()
})

test('can feed dogs', () => {
  const dogMax = new Dog('Max')

  feed(dogMax)

  expect(dogMax.feed).toHaveBeenCalled()
  expect(dogMax.isHungry()).toBe(false)
})
```

--------------------------------

### Vitest Type Checking: expectTypeOf with Concrete Types

Source: https://vitest.dev/guide/testing-types

Illustrates how to use `expectTypeOf` with concrete types, such as comparing against another inferred type using `typeof`. While functional, this method can sometimes result in less informative error messages during type checking within Vitest.

```typescript
const one = valueFromFunctionOne({ some: { complex: inputs } })
const two = valueFromFunctionTwo({ some: { other: inputs } })

expectTypeOf(one).toEqualTypeOf<typeof two>()
```

--------------------------------

### Access Reported Tasks in Custom Reporter

Source: https://vitest.dev/guide/advanced/reporters

Demonstrates using the `vitest.state.getReportedEntity` API within a custom reporter to access reported test run data, such as test module information and task details.

```typescript
import type { Reporter, TestModule } from 'vitest/node'

class MyReporter implements Reporter {
  onTestRunEnd(testModules: ReadonlyArray<TestModule>) {
    for (const testModule of testModules) {
      for (const task of testModule.children) {
        //                          ^?
        console.log('test run end', task.type, task.fullName)
      }
    }
  }
}
```

--------------------------------

### Matcher Return Type Interface

Source: https://vitest.dev/guide/extending-matchers

Defines the expected return structure for a custom matcher function. It includes a 'pass' boolean indicating success, a 'message' function for failure output, and optional 'actual' and 'expected' values for detailed diffing.

```typescript
interface ExpectationResult {
  pass: boolean
  message: () => string
  // If you pass these, they will automatically appear inside a diff when
  // the matcher does not pass, so you don't need to print the diff yourself
  actual?: unknown
  expected?: unknown
}
```

--------------------------------

### Test Accessibility of a Modal Component

Source: https://vitest.dev/guide/browser/component-testing

Tests the accessibility of a modal component, focusing on focus management, ARIA attributes, and keyboard navigation. It ensures the modal is usable with screen readers and keyboard controls, adhering to ARIA authoring practices.

```tsx
test('Modal component is accessible', async () => {
  const { getByRole, getByLabelText } = render(
    <Modal isOpen={true} title="Settings">
      <SettingsForm />
    </Modal>
  )

  // Test focus management - modal should receive focus when opened
  // This is crucial for screen reader users to know a modal opened
  const modal = getByRole('dialog')
  await expect.element(modal).toHaveFocus()

  // Test ARIA attributes - these provide semantic information to screen readers
  await expect.element(modal).toHaveAttribute('aria-labelledby') // Links to title element
  await expect.element(modal).toHaveAttribute('aria-modal', 'true') // Indicates modal behavior

  // Test keyboard navigation - Escape key should close modal
  // This is required by ARIA authoring practices
  await userEvent.keyboard('{Escape}')
  // expect.element auto-retries until modal is removed
  await expect.element(modal).not.toBeInTheDocument()

  // Test focus trap - tab navigation should cycle within modal
  // This prevents users from tabbing to content behind the modal
  const firstInput = getByLabelText(/username/i)
  const lastButton = getByRole('button', { name: /save/i })

  // Use click to focus on the first input, then test tab navigation
  await firstInput.click()
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}') // Shift+Tab goes backwards
  await expect.element(lastButton).toHaveFocus() // Should wrap to last element
})
```

--------------------------------

### Mock Module with Spy Tracking in Vitest

Source: https://vitest.dev/guide/mocking/modules

Enable spy tracking on mocked modules while preserving original implementation. This allows you to verify that methods were called without replacing their functionality. The spy option ensures all methods call the original implementation while maintaining invocation tracking.

```typescript
import { expect, vi } from 'vitest'
import { answer } from './example.js'

vi.mock(import('./example.js'), { spy: true })

// calls the original implementation
expect(answer()).toBe(42)
// vitest can still track the invocations
expect(answer).toHaveBeenCalled()
```

--------------------------------

### Debug Element Visibility and Print DOM

Source: https://vitest.dev/guide/browser/component-testing

This test snippet checks if an element, specifically an email input, is visible. It uses `page.getByLabelText` to find the element and `await expect.element(emailInput).toBeVisible()` which will automatically retry and display the DOM if the element is not visible, aiding in debugging.

```tsx
test('debug element queries', async () => {
  render(<LoginForm />)

  const emailInput = page.getByLabelText(/email/i)
  await expect.element(emailInput).toBeVisible()
})
```

--------------------------------

### Debug Form Validation with Console Logging

Source: https://vitest.dev/guide/browser/component-testing

Illustrates how to use console logging within a test to debug form validation issues. It logs the existence and count of an error element to help diagnose why validation messages might not be appearing as expected.

```tsx
test('debug form validation', async () => {
  render(<ContactForm />)

  const submitButton = page.getByRole('button', { name: /submit/i })
  await submitButton.click()

  // Debug: Check if element exists with different query
  const errorElement = page.getByText('Email is required')
  console.log('Error element found:', errorElement.length)

  await expect.element(errorElement).toBeInTheDocument()
})
```

--------------------------------

### Resolve Virtual Module with Vite Plugin in Vitest

Source: https://vitest.dev/guide/mocking/modules

Mark virtual modules as always resolved using a Vite plugin with the resolveId hook. This approach signals Vite to recognize the module ID without redirecting it to a file, allowing vi.mock to define exports dynamically.

```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    {
      name: 'virtual-vscode',
      resolveId(id) {
        if (id === 'vscode') {
          return 'vscode'
        }
      }
    }
  ]
})
```

--------------------------------

### Vitest Module Mocking Pitfall: Alternative Test Case (JavaScript)

Source: https://vitest.dev/guide/mocking/modules

An alternative test case that reinforces the module mocking pitfall. It shows that even when explicitly passing `mod.foo` to `foobar`, the check `injectedFoo === foo` evaluates to false, confirming that the internal `foo` call within `foobar` does not use the mocked version.

```javascript
import * as mod from './foobar.js'

vi.spyOn(mod, 'foo')

// exported foo references mocked method
mod.foobar(mod.foo)
```

--------------------------------

### Vitest Watch Mode Debugging with Isolated Workers

Source: https://vitest.dev/guide/debugging

CLI option to keep the debugger open during watch mode test re-runs by disabling worker isolation. Allows continuous debugging across multiple test executions without reconnecting the debugger.

```bash
vitest --inspect-brk --no-file-parallelism --isolate false
```

--------------------------------

### TypeScript Ambient Declaration for Custom Matchers (Vitest < 3.2.0)

Source: https://vitest.dev/guide/extending-matchers

Provides TypeScript type definitions for custom matchers in older versions of Vitest. It extends both 'Assertion' and 'AsymmetricMatchersContaining' interfaces to ensure type safety for custom matchers.

```typescript
import 'vitest'

interface CustomMatchers<R = unknown> {
  toBeFoo: () => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
```

--------------------------------

### Automatic Module Mocking with Spy Behavior

Source: https://vitest.dev/guide/mocking/modules

Disables the default automatic mocking behavior for a module by passing `spy: true`. This will spy on all exports instead of replacing them with default mock values.

```typescript
import { vi } from 'vitest'

vi.mock('./example.js', { spy: true })
```

--------------------------------

### Disable Vitest Watcher via Vite Config (TypeScript)

Source: https://vitest.dev/guide/advanced/tests

Configures Vitest to disable its watcher mechanism by modifying the Vite server configuration. This is achieved by setting `server.watch: null` or `server.watch: { ignored: ['*/*'] }` within the Vite config object passed to `createVitest`.

```typescript
await createVitest(
  'test',
  {},
  {
    plugins: [
      {
        name: 'stop-watcher',
        async configureServer(server) {
          await server.watcher.close()
        }
      }
    ],
    server: {
      watch: null,
    },
  }
)
```

--------------------------------

### Test Complex Forms with Validation

Source: https://vitest.dev/guide/browser/component-testing

Tests a ContactForm component with comprehensive validation scenarios including required fields, email format validation, and partial form validation. Verifies error messages appear/disappear appropriately and successful form submission with correct payload.

```tsx
test('ContactForm handles complex validation scenarios', async () => {
  const mockSubmit = vi.fn()
  const { getByLabelText, getByText } = render(
    <ContactForm onSubmit={mockSubmit} />
  )

  const nameInput = page.getByLabelText(/full name/i)
  const emailInput = page.getByLabelText(/email/i)
  const messageInput = page.getByLabelText(/message/i)
  const submitButton = page.getByRole('button', { name: /send message/i })

  // Test validation triggers
  await submitButton.click()

  await expect.element(getByText('Name is required')).toBeInTheDocument()
  await expect.element(getByText('Email is required')).toBeInTheDocument()
  await expect.element(getByText('Message is required')).toBeInTheDocument()

  // Test partial validation
  await nameInput.fill('John Doe')
  await submitButton.click()

  await expect.element(getByText('Name is required')).not.toBeInTheDocument()
  await expect.element(getByText('Email is required')).toBeInTheDocument()

  // Test email format validation
  await emailInput.fill('invalid-email')
  await submitButton.click()

  await expect.element(getByText('Please enter a valid email')).toBeInTheDocument()

  // Test successful submission
  await emailInput.fill('john@example.com')
  await messageInput.fill('Hello, this is a test message.')
  await submitButton.click()

  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a test message.'
  })
})
```

--------------------------------

### Mask Dynamic Content in Screenshots - Vitest TypeScript

Source: https://vitest.dev/guide/browser/visual-regression-testing

Handles dynamic content like timestamps or user data that would cause test failures by masking specific elements during screenshot capture. Uses Playwright's mask option to exclude elements from visual comparison.

```typescript
await expect(page.getByTestId('profile')).toMatchScreenshot({
  screenshotOptions: {
    mask: [page.getByTestId('last-seen')],
  },
})
```

--------------------------------

### Vitest Module Mocking Pitfall: Test Case (TypeScript)

Source: https://vitest.dev/guide/mocking/modules

A test case demonstrating the inability to mock an internal method call. It attempts to spy on and mock the `foo` function in `foobar.js`, but this mock only affects external calls to `foo`, not the call within `foobar` itself.

```typescript
import { vi } from 'vitest'
import * as mod from './foobar.js'

// this will only affect "foo" outside of the original module
vi.spyOn(mod, 'foo')
vi.mock(import('./foobar.js'), async (importOriginal) => {
  return {
    ...await importOriginal(),
    // this will only affect "foo" outside of the original module
    foo: () => 'mocked'
  }
})
```

--------------------------------

### Disable Animations During Testing - CSS

Source: https://vitest.dev/guide/browser/visual-regression-testing

CSS snippet that disables all animations and transitions during visual testing to prevent flaky tests. Applied globally to all elements and pseudo-elements using !important to override existing styles.

```css
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.