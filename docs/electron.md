### Running a TouchBar Example

Source: https://www.electronjs.org/docs/latest/api/touch-bar

Instructions on how to save, install dependencies, and run a JavaScript example file using Electron to display it on the touch bar.

```APIDOC
## Running a TouchBar Example

### Description

This guide explains the steps to execute a JavaScript file that utilizes the TouchBar API within an Electron application.

### Steps

1.  **Save the file**: Save the provided JavaScript code to a file named `touchbar.js` in your desired directory.
2.  **Install Electron**: Open your terminal in the directory where you saved `touchbar.js` and run `npm install electron`.
3.  **Run the example**: Execute the script using Electron with the command: `./node_modules/.bin/electron touchbar.js`

### Expected Outcome

Upon successful execution, a new Electron window will appear, and the application's touch bar interface (or its emulator) will be displayed.
```

--------------------------------

### Install snap package

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Installs a snap package file locally using the snap install command with the '--dangerous' flag, which is required for locally built or unsigned packages.

```bash
sudo snap install electron-packager-hello-world_0.1_amd64.snap --dangerous
```

--------------------------------

### Example package.json for Electron App

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

A sample package.json file for an Electron application after initialization and dependency installation. It includes essential fields like 'name', 'version', 'main', 'scripts', 'author', 'license', and devDependencies.

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Jane Doe",
  "license": "MIT",
  "devDependencies": {
    "electron": "23.1.3"
  }
}
```

--------------------------------

### Install WebdriverIO Starter Toolkit (npm)

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Installs the WebdriverIO starter toolkit to set up a new testing environment for your project. This command initiates a configuration wizard to customize your setup and install necessary packages.

```bash
npm init wdio@latest ./

```

--------------------------------

### Electron App Setup: Importing Modules

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Imports necessary modules from Electron and Node.js for application lifecycle management, creating browser windows, and handling file paths. These are fundamental for any Electron application.

```javascript
const { app, BrowserWindow, shell } = require('electron')

const path = require('node:path')
```

--------------------------------

### Install electron-installer-snap

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Installs the 'electron-installer-snap' npm package as a development dependency. This module is used for building snap packages for Electron applications.

```bash
npm install --save-dev electron-installer-snap
```

--------------------------------

### Electron Main Process: Tray Menu Setup (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/tray

This script sets up the main process for an Electron application, creating a window, initializing a system tray icon, and defining a context menu. It uses Electron's main and common modules for app, window, menu, tray, and native image functionalities. The menu allows users to open the app window, change the tray icon's image, set a title for the tray icon, and quit the application.

```javascript
const { app, BrowserWindow, Menu, Tray } = require('electron/main')  
const { nativeImage } = require('electron/common')  
  
// save a reference to the Tray object globally to avoid garbage collection  
let tray = null  
  
function createWindow () {  
  const mainWindow = new BrowserWindow()  
  mainWindow.loadFile('index.html')  
}  
  
// The Tray object can only be instantiated after the 'ready' event is fired  
app.whenReady().then(() => {  
  createWindow()  
  
  const red = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBpZKBCYAgEEV/TeAIjuIIbdQIuUGt0CS1gW1iZ2jIVaTnhw+Cvs8/OYDJA4Y8kR3ZR2/kmazxJbpUEfQ/Dm/UG7wVwHkjlQdMFfDdJMFaACebnjJGyDWgcnZu1/lrCrl6NCoEHJBrDwEr5NrT6ko/UV8xdLAC2N49mlc5CylpYh8wCwqrvbBGLoKGvz8Bfq0QPWEUo/EAAAAASUVORK5CYII=')  
  const green = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUCOSURBVHgBpZLRDYAgEEOrEzgCozCCGzkCbKArOIlugJvgoRAUNcLRpvGH19TkgFQWkqIohhK8UEaKwKcsOg/+WR1vX+AlA74u6q4FqgCOSzwsGHCwbKliAF89Cv89tWmOT4VaVMoVbOBrdQUz+FrD6XItzh4LzYB1HFJ9yrEkZ4l+wvcid9pTssh4UKbPd+4vED2Nd54iAAAAAElFTkSuQmCC')  
  
  tray = new Tray(red)  
  tray.setToolTip('Tray Icon Demo')  
  
  const contextMenu = Menu.buildFromTemplate([  
    {  
      label: 'Open App',  
      click: () => {  
        const wins = BrowserWindow.getAllWindows()  
        if (wins.length === 0) {  
          createWindow()  
        } else {  
          wins[0].focus()  
        }  
      }  
    },  
    {  
      label: 'Set Green Icon',  
      type: 'checkbox',  
      click: ({ checked }) => {  
        checked ? tray.setImage(green) : tray.setImage(red)  
      }  
    },  
    {  
      label: 'Set Title',  
      type: 'checkbox',  
      click: ({ checked }) => {  
        checked ? tray.setTitle('Title') : tray.setTitle('')  
      }  
    },  
    { role: 'quit' }  
  ])  
  
  tray.setContextMenu(contextMenu)  
})  
  
app.on('window-all-closed', function () {  
  // This will prevent the app from closing when windows close  
})  
  
app.on('activate', function () {  
  if (BrowserWindow.getAllWindows().length === 0) createWindow()  
})  
```

--------------------------------

### Run snap application

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Executes an installed snap application from the command line. The command name typically matches the application's name defined in the snapcraft.yaml file.

```bash
electron-packager-hello-world
```

--------------------------------

### Install WebdriverIO Starter Toolkit (Yarn)

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Installs the WebdriverIO starter toolkit using Yarn to set up a new testing environment. The command launches a configuration wizard for customization and package installation.

```bash
yarn create wdio@latest ./

```

--------------------------------

### Native Window Example

Source: https://www.electronjs.org/docs/latest/api/window-open

Provides a complete example demonstrating the interaction between the main process (using `setWindowOpenHandler`) and the renderer process (using `window.open`) for creating and customizing windows.

```APIDOC
## Native `Window` Example

### Description
This example illustrates a common pattern where the main process defines specific rules for opening windows from the renderer. In this case, only 'about:blank' URLs are allowed, and custom `BrowserWindow` options are applied.

### Method
Combination of `window.open()` in renderer and `webContents.setWindowOpenHandler()` in main process.

### Endpoint
Not applicable (client-side JavaScript and main process interaction).

### Parameters
See `window.open()` and `webContents.setWindowOpenHandler()` for parameter details.

### Request Example
```javascript
// main.js
const { BrowserWindow } = require('electron');
const mainWindow = new BrowserWindow();

mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  if (url === 'about:blank') {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        frame: false,
        fullscreenable: false,
        backgroundColor: 'black',
        webPreferences: {
          preload: 'my-child-window-preload-script.js'
        }
      }
    };
  }
  return { action: 'deny' };
});

// renderer process (mainWindow)
const childWindow = window.open('', 'modal');
childWindow.document.write('<h1>Hello</h1>');
```

### Response
#### Success Response (200)
The `childWindow` variable in the renderer process will hold a reference to the newly created window object, allowing interaction with its DOM and properties.

#### Response Example
```json
{
  "type": "Window"
}
```
```

--------------------------------

### Electron Main Process: Custom Protocol Handler Setup

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Sets up the Electron application to act as a default handler for the 'electron-fiddle' protocol. It manages single instance locking and handles incoming URLs via the 'open-url' event. It also includes logic for creating the main browser window and handling IPC messages for external shell operations.

```javascript
// Modules to control application life and create native browser window  
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron/main')  
const path = require('node:path')  
  
let mainWindow  
  
if (process.defaultApp) {  
  if (process.argv.length >= 2) {  
    app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])  
  }  
} else {  
  app.setAsDefaultProtocolClient('electron-fiddle')  
}  
  
const gotTheLock = app.requestSingleInstanceLock()  
  
if (!gotTheLock) {  
  app.quit()  
} else {  
  app.on('second-instance', (event, commandLine, workingDirectory) => {  
    // Someone tried to run a second instance, we should focus our window.  
    if (mainWindow) {  
      if (mainWindow.isMinimized()) mainWindow.restore()  
      mainWindow.focus()  
    }  
  
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)  
  })  
  
  // Create mainWindow, load the rest of the app, etc...  
  app.whenReady().then(() => {  
    createWindow()  
  })  
  
  app.on('open-url', (event, url) => {  
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)  
  })  
}  
  
function createWindow () {  
  // Create the browser window.  
  mainWindow = new BrowserWindow({  
    width: 800,  
    height: 600,  
    webPreferences: {  
      preload: path.join(__dirname, 'preload.js')  
    }  
  })  
  
  mainWindow.loadFile('index.html')  
}  
  
// Quit when all windows are closed, except on macOS. There, it's common  
// for applications and their menu bar to stay active until the user quits  
// explicitly with Cmd + Q.  
app.on('window-all-closed', function () {  
  if (process.platform !== 'darwin') app.quit()  
})  
  
// Handle window controls via IPC   ipcMain.on('shell:open', () => {  
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')  
  const pagePath = path.join('file://', pageDirectory, 'index.html')  
  shell.openExternal(pagePath)  
})  

```

--------------------------------

### HTML for WebHID API Example

Source: https://www.electronjs.org/docs/latest/tutorial/devices

This HTML file sets up the basic structure for the WebHID API example. It includes a button to trigger the HID device test and divs to display granted devices. It also links to the renderer.js script for frontend logic.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>WebHID API</title>
  </head>
  <body>
    <h1>WebHID API</h1>

    <button id="clickme">Test WebHID</button>

    <h3>HID devices automatically granted access via <i>setDevicePermissionHandler</i></h3>
    <div id="granted-devices"></div>

    <h3>HID devices automatically granted access via <i>select-hid-device</i></h3>
    <div id="granted-devices2"></div>

    <script src="./renderer.js"></script>
  </body>
</html>
```

--------------------------------

### Content Security Policy Examples

Source: https://www.electronjs.org/docs/latest/tutorial/security

Provides examples of Content Security Policy (CSP) configurations. The 'Bad' example uses a wildcard, which is insecure. The 'Good' example demonstrates a more restrictive policy, allowing scripts only from the same origin and a specific API domain, enhancing protection against injection attacks.

```http
// Bad
Content-Security-Policy: '*'

// Good
Content-Security-Policy: script-src 'self' https://apis.example.com
```

--------------------------------

### Run electron-installer-snap programmatically

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Demonstrates how to use the 'electron-installer-snap' module programmatically within a Node.js script. It takes options and returns a promise that resolves with the path to the created snap file.

```javascript
const snap = require('electron-installer-snap')

snap(options)
  .then(snapPath => console.log(`Created snap at ${snapPath}!`))
```

--------------------------------

### Linker Initialization Message (Shell Output)

Source: https://www.electronjs.org/docs/latest/tutorial/windows-arm

Example output from a correctly configured cross-compilation command prompt for VS 2017. It indicates that the environment has been initialized for 'x64_arm64' cross-compilation, confirming the setup.

```shell
**********************************************************************
** Visual Studio 2017 Developer Command Prompt v15.9.15
** Copyright (c) 2017 Microsoft Corporation
**********************************************************************
[vcvarsall.bat] Environment initialized for: 'x64_arm64'
```

--------------------------------

### Create Electron App with create-electron-app

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Uses npx to run the 'create-electron-app' package, generating a new Electron project with the specified name. This is a foundational step for creating a sample snapcraft project.

```bash
$ npx create-electron-app@latest my-app
```

--------------------------------

### Install GitHub Publisher (npm)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-publishing-updating

Installs the @electron-forge/publisher-github package as a development dependency using npm.

```bash
npm install --save-dev @electron-forge/publisher-github  
```

--------------------------------

### Install GitHub Publisher (Yarn)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-publishing-updating

Installs the @electron-forge/publisher-github package as a development dependency using Yarn.

```bash
yarn add --dev @electron-forge/publisher-github  
```

--------------------------------

### Electron Basic BrowserWindow Setup

Source: https://www.electronjs.org/docs/latest/tutorial/custom-title-bar

This snippet shows the fundamental setup for creating a BrowserWindow in an Electron application. It initializes the application, creates a browser window, and loads a URL upon the app's ready event. No specific title bar configurations are applied.

```javascript
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({})
  win.loadURL('https://example.com')
}

app.whenReady().then(() => {
  createWindow()
})
```

--------------------------------

### Example .desktop File for Launcher Actions

Source: https://www.electronjs.org/docs/latest/tutorial/linux-desktop-actions

This example demonstrates the structure of a .desktop file used to create custom entries in system launchers, specifically for the Unity desktop environment. It defines 'Actions' and their corresponding 'Name' and 'Exec' properties, specifying the commands to be executed when a shortcut is activated. The 'OnlyShowIn' property restricts the visibility of these actions to Unity.

```shell
Actions=PlayPause;Next;Previous  
  
[Desktop Action PlayPause]  
Name=Play-Pause  
Exec=audacious -t  
OnlyShowIn=Unity;  
  
[Desktop Action Next]  
Name=Next  
Exec=audacious -f  
OnlyShowIn=Unity;  
  
[Desktop Action Previous]  
Name=Previous  
Exec=audacious -r  
OnlyShowIn=Unity;  


```

--------------------------------

### Install Visual Studio 2017 ARM64 Components (Shell)

Source: https://www.electronjs.org/docs/latest/tutorial/windows-arm

Command to install necessary Visual Studio 2017 components for cross-compiling native modules for ARM64. This includes the native desktop workload and ARM64-specific C++ build tools. Ensure Visual Studio 2017 is installed before running.

```shell
vs_installer.exe \
--add Microsoft.VisualStudio.Workload.NativeDesktop \
--add Microsoft.VisualStudio.Component.VC.ATLMFC \
--add Microsoft.VisualStudio.Component.VC.Tools.ARM64 \
--add Microsoft.VisualStudio.Component.VC.MFC.ARM64 \
--includeRecommended
```

--------------------------------

### Snapcraft configuration for Electron App

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Defines the snapcraft.yaml configuration file for an Electron application. It specifies application metadata, base snap, confinement, entry command, extensions, plugs, environment variables, and build/stage packages.

```yaml
name: electron-packager-hello-world
version: '0.1'
summary: Hello World Electron app
description: |
  Simple Hello World Electron app as an example
base: core22
confinement: strict
grade: stable

apps:
  electron-packager-hello-world:
    command: my-app/my-app --no-sandbox
    extensions: [gnome]
    plugs:
    - browser-support
    - network
    - network-bind
    environment:
      # Correct the TMPDIR path for Chromium Framework/Electron to ensure
      # libappindicator has readable resources.
      TMPDIR: $XDG_RUNTIME_DIR

parts:
  my-app:
    plugin: nil
    source: .
    override-build: |
        npm install electron @electron/packager
        npx electron-packager . --overwrite --platform=linux --output=release-build --prune=true
        cp -rv ./my-app-linux-* $SNAPCRAFT_PART_INSTALL/my-app
    build-snaps:
    - node/14/stable
    build-packages:
    - unzip
    stage-packages:
    - libnss3
    - libnspr4
```

--------------------------------

### PrinterInfo Object Example

Source: https://www.electronjs.org/docs/latest/api/structures/printer-info

This example demonstrates the structure of the PrinterInfo object, including its properties and a detailed look at the 'options' object which contains platform-specific printer details.

```javascript
{
  name: 'Austin_4th_Floor_Printer___C02XK13BJHD4',
  displayName: 'Austin 4th Floor Printer @ C02XK13BJHD4',
  description: 'TOSHIBA ColorMFP',
  options: {
    copies: '1',
    'device-uri': 'dnssd://Austin%204th%20Floor%20Printer%20%40%20C02XK13BJHD4._ipps._tcp.local./?uuid=71687f1e-1147-3274-6674-22de61b110bd',
    finishings: '3',
    'job-cancel-after': '10800',
    'job-hold-until': 'no-hold',
    'job-priority': '50',
    'job-sheets': 'none,none',
    'marker-change-time': '0',
    'number-up': '1',
    'printer-commands': 'ReportLevels,PrintSelfTestPage,com.toshiba.ColourProfiles.update,com.toshiba.EFiling.update,com.toshiba.EFiling.checkPassword',
    'printer-info': 'Austin 4th Floor Printer @ C02XK13BJHD4',
    'printer-is-accepting-jobs': 'true',
    'printer-is-shared': 'false',
    'printer-is-temporary': 'false',
    'printer-location': '',
    'printer-make-and-model': 'TOSHIBA ColorMFP',
    'printer-state': '3',
    'printer-state-change-time': '1573472937',
    'printer-state-reasons': 'offline-report,com.toshiba.snmp.failed',
    'printer-type': '10531038',
    'printer-uri-supported': 'ipp://localhost/printers/Austin_4th_Floor_Printer___C02XK13BJHD4',
    system_driverinfo: 'T'
  }
}
```

--------------------------------

### HTML for Electron Protocol Handler Demo

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Provides the user interface for the Electron protocol handler demo. It includes explanatory text about custom protocols and links to relevant documentation. A button is provided to launch the browser, and a link demonstrates how to trigger the custom protocol to re-launch the app.

```html
<!DOCTYPE html>  
<html>  

<head>  
  <meta charset="UTF-8">  
  <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->  
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">  
  <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">  
  <title>app.setAsDefaultProtocol Demo</title>  
</head>  

<body>  
  <h1>App Default Protocol Demo</h1>  

  <p>The protocol API allows us to register a custom protocol and intercept existing protocol requests.</p>  
  <p>These methods allow you to set and unset the protocols your app should be the default app for. Similar to when a  
    browser asks to be your default for viewing web pages.</p>  

  <p>Open the <a href="https://www.electronjs.org/docs/latest/api/protocol">full protocol API documentation</a> in your  
    browser.</p>  

  -----
  
  <h3>Demo</h3>  
  <p>  
    First: Launch current page in browser  
    <button id="open-in-browser" class="js-container-target demo-toggle-button">  
        Click to Launch Browser  
      </button>  
  </p>  

  <p>  
    Then: Launch the app from a web link!  
    <a href="electron-fiddle://open">Click here to launch the app</a>  
  </p>  

  ----
  
  <p>You can set your app as the default app to open for a specific protocol. For instance, in this demo we set this app  
    as the default for <code>electron-fiddle://</code>. The demo button above will launch a page in your default  
    browser with a link. Click that link and it will re-launch this app.</p>  


  <h3>Packaging</h3>  
  <p>This feature will only work on macOS when your app is packaged. It will not work when you're launching it in  
    development from the command-line. When you package your app you'll need to make sure the macOS <code>plist</code>  
    for the app is updated to include the new protocol handler. If you're using <code>@electron/packager</code> then you  
    can add the flag <code>--extend-info</code> with a path to the <code>plist</code> you've created. The one for this  
    app is below:</p>  

  <p>  
  <h5>macOS plist</h5>  
  <pre><code>  
    &lt;?xml version="1.0" encoding="UTF-8"?&gt;  
    &lt;!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"&gt;
            &lt;plist version="1.0"&gt;  

```

--------------------------------

### Start and Stop Network Logging in Electron using NetLog

Source: https://www.electronjs.org/docs/latest/api/session

This JavaScript code snippet demonstrates how to use Electron's `session.netLog` object to start and stop network logging. It initializes NetLog for a specific session partition, starts logging to a file, and then stops logging, returning the path to the saved log file. Ensure the 'electron' module is installed and available.

```javascript
const { app, session } = require('electron')

app.whenReady().then(async () => {
  const netLog = session.fromPartition('some-partition').netLog
  netLog.startLogging('/path/to/net-log')
  // After some network events
  const path = await netLog.stopLogging()
  console.log('Net-logs written to', path)
})
```

--------------------------------

### Generate MSI Installer with electron-wix-msi

Source: https://www.electronjs.org/docs/latest/tutorial/code-signing

Create WiX MSI installers for your Electron app using `electron-wix-msi`. This package also utilizes `@electron/windows-sign` and supports the same `windowsSign` options for signing. The process involves instantiating `MSICreator`, creating a `.wxs` template, optionally signing support binaries, and then compiling the template into an `.msi` file.

```javascript
import { MSICreator } from 'electron-wix-msi'

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: '/path/to/built/app',
  description: 'My amazing Kitten simulator',
  exe: 'kittens',
  name: 'Kittens',
  manufacturer: 'Kitten Technologies',
  version: '1.1.2',
  outputDirectory: '/path/to/output/folder',
  windowsSign: {
    signWithParams: '--my=custom --parameters',
    // If signtool.exe does not work for you, customize!
    signToolPath: 'C:\\Path\\To\\my-custom-tool.exe'
  }
})

// Step 2: Create a .wxs template file
const supportBinaries = await msiCreator.create()

// 🆕 Step 2a: optionally sign support binaries if you
// sign you binaries as part of of your packaging script
for (const binary of supportBinaries) {
  // Binaries are the new stub executable and optionally
  // the Squirrel auto updater.
  await signFile(binary)
}

// Step 3: Compile the template to a .msi file
await msiCreator.compile()
```

--------------------------------

### ElectronJS powerSaveBlocker Example

Source: https://www.electronjs.org/docs/latest/api/power-save-blocker

This example demonstrates how to use the powerSaveBlocker module to start a power save blocker, check if it's running, and then stop it. It utilizes the 'prevent-display-sleep' type to keep the system and screen active. This requires the Electron core module.

```javascript
const { powerSaveBlocker } = require('electron')

const id = powerSaveBlocker.start('prevent-display-sleep')
console.log(powerSaveBlocker.isStarted(id))

powerSaveBlocker.stop(id)
```

--------------------------------

### Create Windows Installer with electron-winstaller

Source: https://www.electronjs.org/docs/latest/tutorial/code-signing

Generate Squirrel.Windows installers for your Electron app using `electron-winstaller`. This package uses `@electron/windows-sign` internally and supports the same `windowsSign` options for signing the installer. Ensure you are using this within an async function due to top-level await limitations in Node.js versions prior to 12.

```javascript
const electronInstaller = require('electron-winstaller')
// NB: Use this syntax within an async function, Node does not have support for
//     top-level await as of Node 12.
try {
  await electronInstaller.createWindowsInstaller({
    appDirectory: '/tmp/build/my-app-64',
    outputDirectory: '/tmp/build/installer64',
    authors: 'My App Inc.',
    exe: 'myapp.exe',
    windowsSign: {
      signWithParams: '--my=custom --parameters',
      // If signtool.exe does not work for you, customize!
      signToolPath: 'C:\\Path\\To\\my-custom-tool.exe'
    }
  })
  console.log('It worked!')
} catch (e) {
  console.log(`No dice: ${e.message}`)
}
```

--------------------------------

### Use Native Addon in Electron Main Process

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

Example of how to import and use a native addon within the main process of an Electron application. Assumes the addon is installed as a dependency.

```javascript
// In your main process
const myAddon = require('my-native-addon')

console.log(myAddon.helloWorld('Electron'))
```

--------------------------------

### Exposing Custom API via contextBridge in Electron Preload Script

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

This example shows how to securely expose custom APIs from an Electron preload script to the renderer's main world using the `contextBridge` module. This is essential for communication when context isolation is enabled.

```javascript
const { contextBridge } = require('electron')  
  
contextBridge.exposeInMainWorld('myAPI', {
  desktop: true
})

```

--------------------------------

### Create and Load BrowserWindow in Electron Main Process

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

Demonstrates creating a new application window using the BrowserWindow module and loading a URL into it. It also shows how to access the webContents object for interaction and logging. This is a fundamental step for displaying web content in an Electron app.

```javascript
const { BrowserWindow } = require('electron')  

const win = new BrowserWindow({ width: 800, height: 1500 })  
win.loadURL('https://github.com')  

const contents = win.webContents  
console.log(contents)  
```

--------------------------------

### Create Electron App Window

Source: https://www.electronjs.org/docs/latest/tutorial/examples

This JavaScript code snippet demonstrates how to create a main window for an Electron application. It utilizes the 'electron/main' module to manage the application lifecycle and create new browser windows. Dependencies include the 'electron/main' and 'node:path' modules. It sets up the main window, loads an 'index.html' file, and handles application lifecycle events like 'window-all-closed'.

```javascript
const { app, BrowserWindow } = require('electron/main')  
const path = require('node:path')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600,  
    webPreferences: {  
      preload: path.join(__dirname, 'preload.js')  
    }  
  })  
  
  win.loadFile('index.html')  
}  
  
app.whenReady().then(() => {  
  createWindow()  
  
  app.on('activate', () => {  
    if (BrowserWindow.getAllWindows().length === 0) {  
      createWindow()  
    }  
  })  
})  
  
app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') {  
    app.quit()  
  }  
})
```

--------------------------------

### Example RELEASES File Format

Source: https://www.electronjs.org/docs/latest/tutorial/updates

Shows the expected format for the RELEASES file returned by a Squirrel-compatible Windows update server. This file contains information about the latest build, including its hash, download URL, and size.

```text
B0892F3C7AC91D72A6271FF36905FEF8FE993520 https://your-static.storage/your-app-1.2.3-full.nupkg 103298365  
```

--------------------------------

### Create Window on External Display with Electron

Source: https://www.electronjs.org/docs/latest/api/screen

This example shows how to create a BrowserWindow on an external display if one is detected. It uses `screen.getAllDisplays()` to get all connected displays and then finds the one that is not the primary display (assuming it's external).

```javascript
const { app, BrowserWindow, screen } = require('electron')  
  
let win  
  
app.whenReady().then(() => {
  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })

  if (externalDisplay) {
    win = new BrowserWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50
    })
    win.loadURL('https://github.com')
  }
})

```

--------------------------------

### Electron Packager CLI: Configure Protocol Handlers

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Illustrates how to set up protocol handlers using the Electron Packager command-line interface. This method uses the '--protocol' and '--protocol-name' flags.

```bash
npx electron-packager . --protocol=electron-fiddle --protocol-name="Electron Fiddle"
```

--------------------------------

### Snapcraft YAML Configuration for Electron App

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

This is a standard snapcraft.yaml configuration for an Electron application. It defines the application's metadata, parts (like the Electron app itself and a launch script), and the application's entry point and environment variables.

```yaml
name: myApp
version: '2.0.0'
summary: A little description for the app.
description: |
 You know what? This app is amazing! It does all the things
 for you. Some say it keeps you young, maybe even happy.

grade: stable
confinement: classic

parts:
  slack:
    plugin: dump
    source: my-deb.deb
    source-type: deb
    after:
      - desktop-gtk3
    stage-packages:
      - libasound2
      - libnotify4
      - libnspr4
      - libnss3
      - libpcre3
      - libpulse0
      - libxss1
      - libxtst6
  electron-launch:
    plugin: dump
    source: files/
    prepare: |
      chmod +x bin/electron-launch

apps:
  myApp:
    command: bin/electron-launch $SNAP/usr/lib/myApp/myApp
    desktop: usr/share/applications/myApp.desktop
    # Correct the TMPDIR path for Chromium Framework/Electron to ensure
    # libappindicator has readable resources.
    environment:
      TMPDIR: $XDG_RUNTIME_DIR

```

--------------------------------

### Main Process - Electron App Setup (JavaScript)

Source: https://www.electronjs.org/docs/latest/index

Sets up the main process for an Electron application, creating a browser window and handling application lifecycle events. It requires the 'electron/main' and 'node:path' modules.

```javascript
const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

--------------------------------

### Electron App Package.json Configuration (JSON)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

This JSON configuration file defines an Electron application's metadata, including its name, version, main script, and start script. It specifies 'electron' as a dev dependency and uses 'electron .' to run the app, expecting 'main.js' as the entry point.

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Jane Doe",
  "license": "MIT",
  "devDependencies": {
    "electron": "23.1.3"
  }
}
```

--------------------------------

### Create a WebContentsView and Load a URL in Electron

Source: https://www.electronjs.org/docs/latest/api/web-contents-view

Shows the basic instantiation of a WebContentsView and how to use its webContents property to load a specified URL. This example requires the 'electron' package.

```javascript
const { WebContentsView } = require('electron')

const view = new WebContentsView()
view.webContents.loadURL('https://electronjs.org/')
```

--------------------------------

### Install Electron Dev Dependency with npm

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

Installs the Electron package as a development dependency using npm. This ensures Electron is available for development and packaging but not included in the production build.

```bash
npm install electron --save-dev
```

--------------------------------

### Electron Starter Code (main.js)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

This is a complete starter code for the main process of an Electron application. It includes initializing the app, creating a browser window, handling the `window-all-closed` event for quitting the app on Windows/Linux, and managing window creation on activation for macOS. It demonstrates the core structure for a basic Electron app.

```javascript
const { app, BrowserWindow } = require('electron/main')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

--------------------------------

### Get Current URL in Electron

Source: https://www.electronjs.org/docs/latest/api/web-contents

Retrieves the URL of the currently loaded web page in a BrowserWindow. This is useful for tracking navigation or performing actions based on the current page's location. The example demonstrates getting the URL after loading a remote page.

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow({ width: 800, height: 600 });
win.loadURL('https://github.com').then(() => {
  const currentURL = win.webContents.getURL();
  console.log(currentURL);
});
```

--------------------------------

### Snapcraft YAML with Strict Confinement and Desktop Launch

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

This snapcraft.yaml configuration uses the `desktop-launch` command for applications with strict confinement. It specifies the command to run, the desktop file, and sets environment variables to ensure proper execution within the snap environment.

```yaml
apps:
  myApp:
    # Correct the TMPDIR path for Chromium Framework/Electron to ensure
    # libappindicator has readable resources.
    command: env TMPDIR=$XDG_RUNTIME_DIR PATH=/usr/local/bin:${PATH} ${SNAP}/bin/desktop-launch $SNAP/myApp/desktop
    desktop: usr/share/applications/desktop.desktop

```

--------------------------------

### Preload Scripts: Receive Port and Setup Message Handler

Source: https://www.electronjs.org/docs/latest/tutorial/message-ports

Preload scripts in each renderer process receive the MessageChannel port via IPC and attach a message event listener. The port is made globally available on the window object for simplicity in this example.

```javascript
const { ipcRenderer } = require('electron')
 ipcRenderer.on('port', e => {
  // port received, make it globally available.
  window.electronMessagePort = e.ports[0]

  window.electronMessagePort.onmessage = messageEvent => {
    // handle message
  }
})

```

--------------------------------

### Install Dependencies for Node.js Native Addons

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

Installs essential packages for building native Node.js addons. `node-addon-api` provides a C++ wrapper for easier addon development, while `bindings` simplifies loading the compiled native module.

```bash
npm install node-addon-api bindings
```

--------------------------------

### Flash Window Frame

Source: https://www.electronjs.org/docs/latest/api/base-window

Start or stop flashing the window's frame to get the user's attention. `flashFrame` takes a boolean `flag`. On macOS, this will continuously flash the dock icon.

```javascript
win.flashFrame(true)
// To stop flashing:
// win.flashFrame(false)
```

--------------------------------

### App Path and Log Directory Methods

Source: https://www.electronjs.org/docs/latest/api/app

Methods for getting the application path and setting or getting the application log directory.

```APIDOC
## `app.setAppLogsPath([path])`

### Description
Sets or creates a directory for your app's logs, which can then be manipulated with `app.getPath()` or `app.setPath(pathName, newPath)`. Calling `app.setAppLogsPath()` without a `path` parameter will set the directory to `~/Library/Logs/YourAppName` on macOS, and inside the `userData` directory on Linux and Windows.

### Parameters
- `path` (string, optional) - A custom path for your logs. Must be absolute.

### Method
`app.setAppLogsPath([path])`
```

```APIDOC
## `app.getAppPath()`

### Description
Returns the current application directory.

### Returns
- `string` - The current application directory.

### Method
`app.getAppPath()`
```

--------------------------------

### Start and Stop Tracing with contentTracing in Electron

Source: https://www.electronjs.org/docs/latest/api/content-tracing

This snippet demonstrates how to use the `contentTracing` module to start and stop performance tracing in an Electron application. It waits for the app to be ready, then begins recording trace data for all categories for 5 seconds before stopping and logging the output file path. Ensure the 'electron' module is required.

```javascript
const { app, contentTracing } = require('electron')

app.whenReady().then(() => {
  (async () => {
    await contentTracing.startRecording({
      included_categories: ['*']
    })
    console.log('Tracing started')
    await new Promise(resolve => setTimeout(resolve, 5000))
    const path = await contentTracing.stopRecording()
    console.log('Tracing data recorded to ' + path)
  })()
})
```

--------------------------------

### Electron App Launch Script

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

A simple shell script used to launch the Electron application. It forwards all arguments to the application's binary and sets specific execution context, redirecting output to prevent clutter.

```shell
#!/bin/sh

exec "$@" --executed-from="$(pwd)" --pid=$$ > /dev/null 2>&1 &

```

--------------------------------

### Electron Renderer Process: Basic HTML Structure (HTML)

Source: https://www.electronjs.org/docs/latest/tutorial/tray

This is a basic HTML file for an Electron application's renderer process. It includes meta tags for character set and Content Security Policy (CSP), and a title. The body contains a heading and a paragraph explaining the functionality of the associated tray menu demo.

```html
<!DOCTYPE html>  
<html>  
  <head>  
    <meta charset="UTF-8">  
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->  
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">  
    <title>Tray Menu Demo</title>  
  </head>  
  <body>  
    <h1>Tray Menu Demo</h1>  
    <p>This app will stay running even after all windows are closed.</p>  
    <ul>  
      <li>Use the "Open App" menu item to focus the main window (or open one if it does not exist).</li>  
      <li>Change between red and green Tray icons with the "Set Green Icon" checkbox.</li>  
      <li>Give the Tray icon a title using the "Set Title" checkbox.</li>  
      <li>Quit the app using the "Quit" menu item.</li>  
    </ul>  
  </body>  
</html>  
```

--------------------------------

### Build snap package using snapcraft

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Command to build a snap package using the snapcraft CLI tool. This command processes the snapcraft.yaml file and its associated project files to create a .snap file.

```bash
$ snapcraft
```

--------------------------------

### Install electron-chromedriver (npm)

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Installs the electron-chromedriver binary as a development dependency using npm. This binary is required to run Selenium tests with Electron.

```bash
npm install --save-dev electron-chromedriver

```

--------------------------------

### Preload Scripts

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

Details how preload scripts execute before web content loads, granting Node.js API access securely to the renderer process.

```APIDOC
## Preload Scripts

### Description
Preload scripts contain code that executes in a renderer process before its web content begins loading. These scripts run within the renderer context but are granted more privileges by having access to Node.js APIs. They serve to enhance the renderer by exposing arbitrary APIs to the `window` global that web contents can consume.

### Configuration
Preload scripts are attached to the main process in the `BrowserWindow` constructor's `webPreferences` option.

### Example (Main Process)
```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({
  webPreferences: {
    preload: 'path/to/preload.js'
  }
})
```

### Context Isolation
Due to `contextIsolation` (enabled by default), variables from the preload script cannot be directly attached to `window`. Use the `contextBridge` module for secure exposure of APIs.

### Example (Preload Script with contextBridge)
```javascript
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true
})
```

### Example (Renderer Script Usage)
```javascript
console.log(window.myAPI)
// => { desktop: true }
```

### Use Cases
- **Inter-Process Communication (IPC)**: Exposing `ipcRenderer` helpers to trigger main process tasks.
- **Desktop-Specific Logic**: Adding custom properties to the `window` global for desktop-only features when wrapping web apps.
```

--------------------------------

### Renderer Process

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

Explains the renderer process responsible for rendering web content and its limitations regarding Node.js APIs.

```APIDOC
## Renderer Process

### Description
Each Electron app spawns a separate renderer process for each open `BrowserWindow` (and each web embed). This process is responsible for rendering web content and should behave according to web standards. User interfaces and app functionality within a single browser window should be written using standard web technologies (HTML, CSS, JavaScript).

### Key Concepts
- **HTML File**: Serves as the entry point for the renderer process.
- **CSS**: Used for styling the UI.
- **JavaScript**: Added via `<script>` elements for executable code.

### Limitations
Renderer processes do not have direct access to `require` or other Node.js APIs. To include NPM modules, bundler toolchains like `webpack` or `parcel` must be used. While it's possible to spawn renderers with a full Node.js environment for development, this is disabled by default for security reasons. Direct interaction with Node.js and Electron's native desktop functionality from the renderer is not possible without specific mechanisms.
```

--------------------------------

### Electron Main Process: Set Application Menu (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/recent-documents

This JavaScript code demonstrates how to set the application menu in Electron after the 'ready' event has fired. It builds a menu from a template and sets it as the application's main menu, ensuring menu items are enabled.

```javascript
const { app, Menu } = require('electron')

const template = [
  // Menu template here
]
const menu = Menu.buildFromTemplate(template)

app.whenReady().then(() => {
  Menu.setApplicationMenu(menu)
})
```

--------------------------------

### Install Playwright Test Runner with npm or Yarn

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Installs the Playwright test runner, a framework for end-to-end testing. Playwright offers experimental support for Electron.

```bash
npm install --save-dev @playwright/test
```

```bash
yarn add --dev @playwright/test
```

--------------------------------

### Install Electron Dev Dependency with Yarn

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

Installs the Electron package as a development dependency using Yarn. This ensures Electron is available for development and packaging but not included in the production build.

```bash
yarn add electron --dev
```

--------------------------------

### Build Electron Application Menu with Standard Roles (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/application-menu

This JavaScript snippet demonstrates a more concise way to build an Electron application menu by leveraging standard OS menu roles like 'appMenu', 'fileMenu', 'editMenu', and 'viewMenu'. It utilizes Menu.buildFromTemplate and includes platform-specific handling for macOS. The 'help' submenu is also configured to open an external URL.

```javascript
const { shell } = require('electron/common')
const { app, Menu } = require('electron/main')

const template = [
  ...(process.platform === 'darwin'
    ? [{ role: 'appMenu' }]
    : []),
  { role: 'fileMenu' },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

```

--------------------------------

### Install electron-chromedriver (Yarn)

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Installs the electron-chromedriver binary as a development dependency using Yarn. This binary is necessary for executing Selenium tests with Electron.

```bash
yarn add --dev electron-chromedriver

```

--------------------------------

### Install GTK3 Development Files on Fedora/RHEL/CentOS

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

Installs necessary packages for GTK3 development on Fedora/RHEL/CentOS systems, including C++ compiler, pkg-config, and GTK3 development files.

```bash
sudo dnf install gcc-c++ pkgconfig gtk3-devel  
```

--------------------------------

### Launch Electron App with Playwright

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Launches an Electron application for testing using Playwright's `_electron.launch` API. This is the initial step to start testing. The `args` parameter specifies the path to the main process entry point.

```javascript
import { test, _electron as electron } from '@playwright/test'

test('launch app', async () => {
  const electronApp = await electron.launch({ args: ['.'] })
  // close app
  await electronApp.close()
})
```

--------------------------------

### Environment Configuration for PipeWire in Snap

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Configures the necessary environment variables within the snapcraft.yaml to ensure PipeWire functions correctly for desktop capture. This includes setting paths for SPA plugins, configuration files, and module directories.

```yaml
    environment:
      SPA_PLUGIN_DIR: $SNAP/usr/lib/$CRAFT_ARCH_TRIPLET/spa-0.2
      PIPEWIRE_CONFIG_NAME: $SNAP/usr/share/pipewire/pipewire.conf
      PIPEWIRE_MODULE_DIR: $SNAP/usr/lib/$CRAFT_ARCH_TRIPLET/pipewire-0.3

```

--------------------------------

### Install GTK3 Development Files on Ubuntu/Debian

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

Installs necessary packages for GTK3 development on Ubuntu/Debian systems, including build tools, pkg-config, and GTK3 development files.

```bash
sudo apt-get install build-essential pkg-config libgtk-3-dev  
```

--------------------------------

### Main Process: Create Window and Handle IPC Ping

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

This JavaScript code snippet is for the Electron main process. It sets up the IPC handler for 'ping' using `ipcMain.handle` before creating the browser window. The `createWindow` function configures the BrowserWindow, specifying the preload script path, and loads the 'index.html' file.

```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')

const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
}
app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()
})

```

--------------------------------

### Node.js Integration for Remote Content (Main Process)

Source: https://www.electronjs.org/docs/latest/tutorial/security

Demonstrates how to configure Node.js integration for BrowserWindow. The 'Bad' example enables Node.js integration and disables context isolation, which is insecure for remote content. The 'Good' example disables Node.js integration and optionally uses a preload script for secure API exposure.

```javascript
// Bad
const mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: false,
    nodeIntegration: true,
    nodeIntegrationInWorker: true
  }
})

mainWindow.loadURL('https://example.com')
```

```javascript
// Good
const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: path.join(app.getAppPath(), 'preload.js')
  }
})

mainWindow.loadURL('https://example.com')
```

--------------------------------

### Rebuilding Native Modules with @electron/rebuild

Source: https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules

Installs the @electron/rebuild tool and demonstrates how to use it via the command line to recompile native Node.js modules for Electron. This is often necessary after running `npm install` to ensure compatibility. The command handles downloading headers and rebuilding for the target Electron version.

```bash
npm install --save-dev @electron/rebuild

# Every time you run "npm install", run this:
./node_modules/.bin/electron-rebuild

# If you have trouble on Windows, try:
.\node_modules\.bin\electron-rebuild.cmd
```

--------------------------------

### Utility Process

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

Explains the utility process, a child process spawned from the main process with full Node.js capabilities and communication channels with renderers.

```APIDOC
## Utility Process

### Description
Each Electron app can spawn multiple child processes from the main process using the UtilityProcess API. The utility process runs in a Node.js environment, meaning it has the ability to `require` modules and use all of Node.js APIs. It can be used to host untrusted services, CPU-intensive tasks, or crash-prone components.

### Key Features
- **Node.js Environment**: Full access to Node.js APIs.
- **Communication Channel**: Can establish communication with a renderer process using `MessagePort`s.

### Usage Recommendation
Electron apps can prefer the UtilityProcess API over Node.js `child_process.fork` API when there is a need to fork a child process from the main process, especially when communication with a renderer process is required.
```

--------------------------------

### Log to Console in Electron Main Process (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

This snippet demonstrates the simplest way to start an Electron app by logging a message to the console. It requires the 'electron' package as a dev dependency and uses a basic console.log statement within the main.js file.

```javascript
console.log('Hello from Electron 👋')
```

--------------------------------

### Snapcraft PipeWire Part for Desktop Capture

Source: https://www.electronjs.org/docs/latest/tutorial/snapcraft

Defines a 'pipewire' part in snapcraft.yaml to enable desktop capture functionality, typically required for Wayland configurations. It specifies build and stage packages, and files to be included in the snap.

```yaml
  pipewire:
    plugin: nil
    build-packages: [libpipewire-0.3-dev]
    stage-packages: [pipewire]
    prime:
      - usr/lib/*/pipewire-*
      - usr/lib/*/spa-*
      - usr/lib/*/libpipewire*.so*
      - usr/share/pipewire

```

--------------------------------

### Electron BrowserWindow with Preload Script Configuration

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

This snippet demonstrates how to configure a BrowserWindow in the Electron main process to use a preload script. The preload script's path is specified within the `webPreferences` object.

```javascript
const { BrowserWindow } = require('electron')  
// ...  
const win = new BrowserWindow({  
  webPreferences: {  
    preload: 'path/to/preload.js'  
  }  
})
// ...  

```

--------------------------------

### Electron Packager API: Configure Protocol Handlers

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Demonstrates configuring protocol handlers using the Electron Packager API. This involves passing a 'protocols' array within the packager options. It requires the '@electron/packager' module.

```javascript
const packager = require('@electron/packager')

packager({
  // ...other options...
  protocols: [
    {
      name: 'Electron Fiddle',
      schemes: ['electron-fiddle']
    }
  ]

}).then(paths => console.log(`SUCCESS: Created ${paths.join(', ')}`))
  .catch(err => console.error(`ERROR: ${err.message}`))
```

--------------------------------

### BrowserWindow Creation and Basic Usage

Source: https://www.electronjs.org/docs/latest/api/browser-window

Demonstrates how to create a new BrowserWindow instance and load content into it, either from a remote URL or a local HTML file. The `ready` event of the `app` module must be emitted before using this module.

```APIDOC
## BrowserWindow Creation

### Description
Creates a new browser window and loads content.

### Method
`new BrowserWindow(options)`

### Endpoint
N/A (Class constructor)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
- **width** (integer) - Optional - The desired width of the new window.
- **height** (integer) - Optional - The desired height of the new window.
- **show** (boolean) - Optional - Whether the window should be shown immediately. Defaults to `true`.
- **backgroundColor** (string) - Optional - The background color of the window. Accepts hex, HSL, RGB, or color names.

### Request Example
```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ width: 800, height: 600 })

// Load a remote URL
win.loadURL('https://github.com')

// Or load a local HTML file
win.loadFile('index.html')
```

### Response
#### Success Response (200)
N/A (This is a constructor, not an endpoint that returns data)

#### Response Example
N/A
```

--------------------------------

### Install update-electron-app (npm)

Source: https://www.electronjs.org/docs/latest/tutorial/updates

This command installs the `update-electron-app` Node.js module using npm, the default package manager for Node.js. This module simplifies the process of implementing auto-updates in Electron applications.

```bash
npm install update-electron-app  
```

--------------------------------

### Project Directory Structure Setup for Native Addons

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

This command sequence sets up the essential directories for a native addon project. It creates `src` for source files, `include` for header files, and `js` for JavaScript wrapper files, organizing the project structure for compilation.

```bash
mkdir src
mkdir include
mkdir js
```

--------------------------------

### Defining Instance Methods for C++ Addon (Node-API)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

Demonstrates how to define instance methods for a C++ addon class using Node-API's 'DefineClass'. This example shows the registration of 'helloWorld' and 'helloGui' methods, making them accessible as functions from the JavaScript side of the addon.

```c++
// ... in the class definition, add On to DefineClass  
static Napi::Object Init(Napi::Env env, Napi::Object exports) {  
    Napi::Function func = DefineClass(env, "CppWin32Addon", {  
        InstanceMethod("helloWorld", &CppAddon::HelloWorld),  
        InstanceMethod("helloGui", &CppAddon::HelloGui),  

```

--------------------------------

### Generating Debug Build and Running Ninja

Source: https://www.electronjs.org/docs/latest/development/debugging

Commands to generate a debug build configuration using GN and then compile the Electron project using Ninja. This prepares the build for breakpoint debugging with tools like LLDB.

```bash
gn gen out/Debug --args="import(\"//electron/.git/info/exclude/debug.gn\") $GN_EXTRA_ARGS"
ninja -C out/Debug electron
```

--------------------------------

### Initialize npm Project with npm

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

Creates a new directory for the Electron app and initializes an npm package within it. This command sets up the basic structure and package.json file for the project.

```bash
mkdir my-electron-app && cd my-electron-app
npm init
```

--------------------------------

### Install update-electron-app (Yarn)

Source: https://www.electronjs.org/docs/latest/tutorial/updates

This command installs the `update-electron-app` Node.js module using Yarn, an alternative package manager for Node.js. This module streamlines the integration of auto-update functionality into Electron applications.

```bash
yarn add update-electron-app  
```

--------------------------------

### Install Selenium WebDriver with npm or Yarn

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Installs the Selenium WebDriver library, a crucial dependency for automating browser interactions. This can be done using either npm or Yarn package managers.

```bash
npm install --save-dev selenium-webdriver
```

```bash
yarn add --dev selenium-webdriver
```

--------------------------------

### TraceConfig Example Object

Source: https://www.electronjs.org/docs/latest/api/structures/trace-config

An example of a TraceConfig object, demonstrating how to set recording mode and include/exclude tracing categories. This configuration is similar to what Chrome DevTools uses for recording traces.

```javascript
{
  recording_mode: 'record-until-full',
  included_categories: [
    'devtools.timeline',
    'disabled-by-default-devtools.timeline',
    'disabled-by-default-devtools.timeline.frame',
    'disabled-by-default-devtools.timeline.stack',
    'v8.execute',
    'blink.console',
    'blink.user_timing',
    'latencyInfo',
    'disabled-by-default-v8.cpu_profiler',
    'disabled-by-default-v8.cpu_profiler.hires'
  ],
  excluded_categories: ['*']
}
```

--------------------------------

### Main Process: Setup MessageChannel and Send Ports

Source: https://www.electronjs.org/docs/latest/tutorial/message-ports

The main process creates a MessageChannel and sends each port to a distinct renderer window. This establishes the communication link between renderers. It requires the 'electron' module.

```javascript
const { BrowserWindow, app, MessageChannelMain } = require('electron')

app.whenReady().then(async () => {
  // create the windows.
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: 'preloadMain.js'
    }
  })

  const secondaryWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: 'preloadSecondary.js'
    }
  })

  // set up the channel.
  const { port1, port2 } = new MessageChannelMain()

  // once the webContents are ready, send a port to each webContents with postMessage.
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })

  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.webContents.postMessage('port', null, [port2])
  })
})

```

--------------------------------

### Electron.js HTML Structure for Progress Bar Example (HTML)

Source: https://www.electronjs.org/docs/latest/tutorial/progress-bar

This HTML file serves as the basic structure for the Electron.js progress bar example. It includes a title and simple paragraph tags to inform the user about the progress bar's behavior on different operating systems. This file is loaded by the main Electron process and works in conjunction with the JavaScript code to display the progress bar.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
</head>
<body>
    <h1>Hello World!</h1>
    <p>Keep an eye on the dock (Mac) or taskbar (Windows, Unity) for this application!</p>
    <p>It should indicate a progress that advances from 0 to 100%.</p>
    <p>It should then show indeterminate (Windows) or pin at 100% (other operating systems)
      briefly and then loop.</p>
</body>
</html>
```

--------------------------------

### Install macOS Command Line Tools for Native Addons

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

This command installs the Xcode Command Line Tools on macOS, which are necessary for compiling native Node.js addons. It provides compilers like clang, clang++, and make, along with other essential build tools.

```bash
xcode-select --install
```

--------------------------------

### Window Size Constraints

Source: https://www.electronjs.org/docs/latest/api/browser-window

Methods for setting and getting the minimum and maximum size constraints for the window.

```APIDOC
## POST /window/minimum-size

### Description
Sets the minimum size constraints for the window.

### Method
POST

### Endpoint
/window/minimum-size

### Parameters
#### Request Body
- **width** (Integer) - The minimum width for the window.
- **height** (Integer) - The minimum height for the window.

### Request Example
```json
{
  "width": 600,
  "height": 400
}
```

### Response
#### Success Response (200)
- **status** (String) - Indicates the success of the operation (e.g., "success").

#### Response Example
```json
{
  "status": "success"
}
```

## GET /window/minimum-size

### Description
Retrieves the current minimum size constraints of the window.

### Method
GET

### Endpoint
/window/minimum-size

### Parameters
None

### Response
#### Success Response (200)
- **size** (Integer[]) - An array containing the minimum width and height of the window.

#### Response Example
```json
[
  600,
  400
]
```

## POST /window/maximum-size

### Description
Sets the maximum size constraints for the window.

### Method
POST

### Endpoint
/window/maximum-size

### Parameters
#### Request Body
- **width** (Integer) - The maximum width for the window.
- **height** (Integer) - The maximum height for the window.

### Request Example
```json
{
  "width": 1200,
  "height": 900
}
```

### Response
#### Success Response (200)
- **status** (String) - Indicates the success of the operation (e.g., "success").

#### Response Example
```json
{
  "status": "success"
}
```

## GET /window/maximum-size

### Description
Retrieves the current maximum size constraints of the window.

### Method
GET

### Endpoint
/window/maximum-size

### Parameters
None

### Response
#### Success Response (200)
- **size** (Integer[]) - An array containing the maximum width and height of the window.

#### Response Example
```json
[
  1200,
  900
]
```
```

--------------------------------

### Node.js Integration for Remote Content (Webview)

Source: https://www.electronjs.org/docs/latest/tutorial/security

Shows the secure configuration for Electron's webview tag. The 'Bad' example explicitly enables `nodeIntegration`, which is a security risk when loading remote content. The 'Good' example omits `nodeIntegration`, adhering to the default secure behavior.

```html
<!-- Bad -->
<webview nodeIntegration src="page.html"></webview>

<!-- Good -->
<webview src="page.html"></webview>
```

--------------------------------

### Start Service Worker for Scope in Electron

Source: https://www.electronjs.org/docs/latest/api/service-workers

Starts a service worker for a given scope in Electron's default session. This function is experimental and resolves with the ServiceWorkerMain object once started. It's useful for ensuring a service worker is running before sending it messages, such as notifying it about newly created browser windows. Dependencies include 'electron' and 'session.defaultSession.serviceWorkers'.

```javascript
const { app, session } = require('electron')
  
const { serviceWorkers } = session.defaultSession
  
// Collect service workers scopes
const workerScopes = Object.values(serviceWorkers.getAllRunning()).map((info) => info.scope)
  
app.on('browser-window-created', async (event, window) => {
  for (const scope of workerScopes) {
    try {
      // Ensure worker is started
      const serviceWorker = await serviceWorkers.startWorkerForScope(scope)
      serviceWorker.send('window-created', { windowId: window.id })
    } catch (error) {
      console.error(`Failed to start service worker for ${scope}`)
      console.error(error)
    }
  }
})
```

--------------------------------

### Securely Open External Links with Electron's shell.openExternal

Source: https://www.electronjs.org/docs/latest/tutorial/security

Demonstrates the correct and incorrect usage of the `shell.openExternal` API in Electron's main process. The 'Bad' example shows how untrusted user data can lead to arbitrary command execution, while the 'Good' example illustrates safe usage with a trusted URL.

```javascript
//  Bad  
const { shell } = require('electron')  
  
shell.openExternal(USER_CONTROLLED_DATA_HERE)  

```

```javascript
//  Good  
const { shell } = require('electron')  
  
shell.openExternal('https://example.com/index.html')  

```

--------------------------------

### HTML Structure for Web Bluetooth UI

Source: https://www.electronjs.org/docs/latest/tutorial/devices

A simple HTML file to create the user interface for the Web Bluetooth example. It includes buttons to trigger Bluetooth connection and cancellation, and a paragraph to display the selected device's name. It links to the `renderer.js` script.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Web Bluetooth API</title>
  </head>
  <body>
    <h1>Web Bluetooth API</h1>

    <button id="clickme">Test Bluetooth</button>
    <button id="cancel">Cancel Bluetooth Request</button>

    <p>Currently selected bluetooth device: <strong id="device-name"></strong></p>

    <script src="./renderer.js"></script>
  </body>
</html>
```

--------------------------------

### Create and Load HTML in Electron BrowserWindow (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

This JavaScript code snippet initializes an Electron app by creating a BrowserWindow and loading an 'index.html' file into it. It uses the 'app' and 'BrowserWindow' modules from Electron and sets up the window creation upon the app's ready event.

```javascript
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

--------------------------------

### ElectronJS powerSaveBlocker start() Method

Source: https://www.electronjs.org/docs/latest/api/power-save-blocker

Starts preventing the system from entering lower-power mode. This method takes a 'type' argument, either 'prevent-app-suspension' or 'prevent-display-sleep', and returns an integer ID for the blocker. 'prevent-display-sleep' has higher precedence.

```javascript
const { powerSaveBlocker } = require('electron')

// Example: Prevent display from sleeping
const displaySleepId = powerSaveBlocker.start('prevent-display-sleep')

// Example: Prevent app suspension (will be overridden if 'prevent-display-sleep' is active)
const appSuspensionId = powerSaveBlocker.start('prevent-app-suspension')
```

--------------------------------

### Manually Build Electron Application Menu (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/application-menu

This snippet shows how to manually construct a detailed application menu for Electron using the Menu.buildFromTemplate method. It includes platform-specific configurations for macOS and defines various submenus with roles like 'appMenu', 'fileMenu', 'editMenu', 'viewMenu', and 'windowMenu'. Dependencies include 'electron/main' and 'electron/common'.

```javascript
const { shell } = require('electron/common')
const { app, Menu } = require('electron/main')

const isMac = process.platform === 'darwin'
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
        : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

```

--------------------------------

### Window Bounds

Source: https://www.electronjs.org/docs/latest/api/browser-window

Methods for getting and setting the bounds and size of an Electron window.

```APIDOC
## GET /window/bounds

### Description
Retrieves the normal state bounds (position and size) of the window.

### Method
GET

### Endpoint
/window/bounds

### Parameters
None

### Response
#### Success Response (200)
- **bounds** (Rectangle) - An object containing the x, y, width, and height of the window in its normal state.

#### Response Example
```json
{
  "x": 100,
  "y": 100,
  "width": 800,
  "height": 600
}
```

## POST /window/size

### Description
Resizes the window to the specified width and height. If the dimensions are below the minimum size constraints, the window will snap to its minimum size. This operation may not work on Wayland (Linux) due to window manager restrictions.

### Method
POST

### Endpoint
/window/size

### Parameters
#### Request Body
- **width** (Integer) - The desired width of the window.
- **height** (Integer) - The desired height of the window.
- **animate** (Boolean, optional, macOS only) - Whether to animate the resize operation.

### Request Example
```json
{
  "width": 800,
  "height": 600,
  "animate": true
}
```

### Response
#### Success Response (200)
- **status** (String) - Indicates the success of the operation (e.g., "success").

#### Response Example
```json
{
  "status": "success"
}
```

## GET /window/size

### Description
Retrieves the current width and height of the window.

### Method
GET

### Endpoint
/window/size

### Parameters
None

### Response
#### Success Response (200)
- **size** (Integer[]) - An array containing the current width and height of the window.

#### Response Example
```json
[
  800,
  600
]
```

## POST /window/content-size

### Description
Resizes the client area (web page) of the window to the specified width and height. This operation may not work on Wayland (Linux) due to window manager restrictions.

### Method
POST

### Endpoint
/window/content-size

### Parameters
#### Request Body
- **width** (Integer) - The desired width of the client area.
- **height** (Integer) - The desired height of the client area.
- **animate** (Boolean, optional, macOS only) - Whether to animate the resize operation.

### Request Example
```json
{
  "width": 784,
  "height": 584,
  "animate": false
}
```

### Response
#### Success Response (200)
- **status** (String) - Indicates the success of the operation (e.g., "success").

#### Response Example
```json
{
  "status": "success"
}
```

## GET /window/content-size

### Description
Retrieves the current width and height of the window's client area.

### Method
GET

### Endpoint
/window/content-size

### Parameters
None

### Response
#### Success Response (200)
- **size** (Integer[]) - An array containing the current width and height of the client area.

#### Response Example
```json
[
  784,
  584
]
```
```

--------------------------------

### Run Electron Tests with Debug Flags

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

This command runs the Electron tests using npm. It includes `--enable-logging` and `-g 'BrowserWindow module'` as example flags that can be passed to the Electron binary for debugging purposes. These flags help in identifying and resolving issues during development.

```shell
$ npm run test -- \
  --enable-logging -g 'BrowserWindow module'
```

--------------------------------

### Handle Downloaded Update Notification

Source: https://www.electronjs.org/docs/latest/tutorial/updates

Listens for the 'update-downloaded' event from autoUpdater. When an update is ready, it displays a dialog to the user asking whether to restart the application to install the update. This requires user interaction to proceed with the installation.

```javascript
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

```

--------------------------------

### Create Electron Window and Handle Lifecycle

Source: https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts

This snippet demonstrates how to create a main browser window in Electron and manage its lifecycle events. It includes setting up the main window, loading an HTML file, and handling application readiness and window closing.

```javascript
const { app, BrowserWindow } = require('electron/main')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

--------------------------------

### Create Window on App Ready

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

This snippet shows how to create the application window once the Electron app is ready. It uses `app.whenReady().then()` to ensure that `createWindow()` is called only after the 'ready' event has fired, which is necessary for creating `BrowserWindow` instances. This is a common pattern for initializing the application's UI.

```javascript
app.whenReady().then(() => {
  createWindow()
})
```

--------------------------------

### Capture Desktop Media with Electron (Main Process)

Source: https://www.electronjs.org/docs/latest/api/desktop-capturer

This snippet demonstrates how to use the desktopCapturer module in the main process to get available screen sources and set up a media request handler. It requires the 'electron' module. The output is used to initiate media capture in the renderer process.

```javascript
const { app, BrowserWindow, desktopCapturer, session } = require('electron')

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow()

  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      // Grant access to the first screen found.
      callback({ video: sources[0], audio: 'loopback' })
    })
    // If true, use the system picker if available.
    // Note: this is currently experimental. If the system picker
    // is available, it will be used and the media request handler
    // will not be invoked.
  }, { useSystemPicker: true })

  mainWindow.loadFile('index.html')
})

```

--------------------------------

### Installing Native Modules with npm for Electron

Source: https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules

Configures environment variables to use `npm` for installing native Node.js modules directly for Electron. This method involves setting variables like `npm_config_target`, `npm_config_runtime`, and `npm_config_disturl` to specify the Electron version, architecture, and header download source. It also includes an option to build from source.

```bash
# Electron's version.
export npm_config_target=1.2.3
# The architecture of your machine
export npm_config_arch=x64
export npm_config_target_arch=x64
# Download headers for Electron.
export npm_config_disturl=https://electronjs.org/headers
# Tell node-pre-gyp that we are building for Electron.
export npm_config_runtime=electron
# Tell node-pre-gyp to build module from source code.
export npm_config_build_from_source=true
# Install all dependencies, and store cache to ~/.electron-gyp.
HOME=~/.electron-gyp npm install
```

--------------------------------

### Windows Code Signing Configuration for Electron Forge

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging

Configures Electron Forge to sign Windows installers using a certificate file and password. This snippet specifies the use of the '@electron-forge/maker-squirrel' maker and sets the `certificateFile` and `certificatePassword` using environment variables for security. Dependencies include the Electron Forge build process and a valid `.pfx` certificate file.

```javascript
module.exports = {
  // ...
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        certificateFile: './cert.pfx',
        certificatePassword: process.env.CERTIFICATE_PASSWORD
      }
    }
  ]
  // ...
}
```

--------------------------------

### Create and Embed BrowserView in Electron

Source: https://www.electronjs.org/docs/latest/api/browser-view

This example demonstrates how to create a BrowserWindow and a BrowserView in the Electron main process. It sets the bounds for the view and loads a URL into it. Requires the 'electron' module.

```javascript
// In the main process.  
const { app, BrowserView, BrowserWindow } = require('electron')  
  
app.whenReady().then(() => {  
  const win = new BrowserWindow({ width: 800, height: 600 })  
  
  const view = new BrowserView()  
  win.setBrowserView(view)  
  view.setBounds({ x: 0, y: 0, width: 300, height: 300 })  
  view.webContents.loadURL('https://electronjs.org')  
})  

```

--------------------------------

### NetLog API Overview

Source: https://www.electronjs.org/docs/latest/api/net-log

This section covers the core functionalities of the NetLog API, including starting and stopping logging, and checking the current logging status.

```APIDOC
## NetLog API

### Description
The NetLog API allows you to log network events for a session within your Electron application. This is primarily useful for debugging network-related issues.

### Methods

#### `netLog.startLogging(path[, options])`

##### Description
Starts recording network events to the specified file path.

##### Method
`netLog.startLogging`

##### Parameters

*   **`path`** (string) - Required - The file path where the network logs will be recorded.
*   **`options`** (Object) - Optional
    *   **`captureMode`** (string) - Optional - Specifies what kind of data to capture. Can be `default` (metadata only), `includeSensitive` (cookies and authentication data), or `everything` (all bytes transferred on sockets). Defaults to `default`.
    *   **`maxFileSize`** (number) - Optional - The maximum size in bytes for the log file. Logging stops automatically if the file exceeds this size. Defaults to unlimited.

##### Returns
`Promise<void>` - Resolves when the net log has begun recording.

##### Example
```javascript
const { app, netLog } = require('electron')

app.whenReady().then(async () => {
  await netLog.startLogging('/path/to/net-log', {
    captureMode: 'everything',
    maxFileSize: 1024 * 1024 * 10 // 10MB
  })
  console.log('Network logging started.')
})
```

#### `netLog.stopLogging()`

##### Description
Stops recording network events and flushes the logs to disk.

##### Method
`netLog.stopLogging`

##### Returns
`Promise<void>` - Resolves when the net log has been flushed to disk.

##### Example
```javascript
const { app, netLog } = require('electron')

app.whenReady().then(async () => {
  await netLog.startLogging('/path/to/net-log')
  // ... perform network operations ...
  const path = await netLog.stopLogging()
  console.log('Net-logs written to', path)
})
```

### Properties

#### `netLog.currentlyLogging`

##### Description
A boolean property that indicates whether network logs are currently being recorded.

##### Type
`boolean`

##### Example
```javascript
if (netLog.currentlyLogging) {
  console.log('Net logging is active.')
} else {
  console.log('Net logging is not active.')
}
```

### Notes
*   All `netLog` methods, unless otherwise specified, can only be used after the `ready` event of the `app` module has been emitted.
*   To log network events throughout the app's lifecycle, you can use the `--log-net-log` command-line flag.
```

--------------------------------

### Initialize Node.js Project for Native Addon

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

These commands create a new directory for your native addon, navigate into it, and initialize a new Node.js project with a default `package.json` file. This sets up the basic structure for your addon.

```bash
mkdir my-native-addon
cd my-native-addon
npm init -y
```

--------------------------------

### Electron Event Documentation Format

Source: https://www.electronjs.org/docs/latest/development/style-guide

This example shows the required format for documenting events in Electron, including the event name, return types, and argument details. The heading level depends on whether the event belongs to a module or a class.

```markdown
### Event: 'wake-up'  

Returns:  

* `time` string  

...  
```

--------------------------------

### Initialize npm Project with Yarn

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

Creates a new directory for the Electron app and initializes an npm package using Yarn. This command sets up the basic structure and package.json file for the project.

```bash
mkdir my-electron-app && cd my-electron-app
yarn init
```

--------------------------------

### Handle Basic Authentication in ElectronJS

Source: https://www.electronjs.org/docs/latest/api/app

This code example shows how to respond to the 'login' event, which is triggered for basic authentication requests. It demonstrates preventing the default cancellation and providing a username and password.

```javascript
const { app } = require('electron')
  
app.on('login', (event, webContents, details, authInfo, callback) => {
  event.preventDefault()
  callback('username', 'secret')
})
```

--------------------------------

### Using TestDriver with Ava Testing Framework (Node.js)

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

An example demonstrating how to integrate the custom `TestDriver` class with the `ava` testing framework. It shows setting up the driver, waiting for the app to be ready, and performing cleanup after tests.

```javascript
const electronPath = require('electron')
  
const test = require('ava')
  
const { TestDriver } = require('./testDriver')
  
const app = new TestDriver({
  path: electronPath,
  args: ['./app'],
  env: {
    NODE_ENV: 'test'
  }
})

test.before(async t => {
  await app.isReady
})

test.after.always('cleanup', async t => {
  await app.stop()
})

```

--------------------------------

### Create Interrupted Download - JavaScript

Source: https://www.electronjs.org/docs/latest/api/session

Allows resuming cancelled or interrupted downloads from a previous session. It requires the absolute path of the download, the URL chain, and optionally mime type, offset, length, last modified date, ETag, and start time. The download starts when the resume API is called on the DownloadItem.

```javascript
const { session } = require('electron')

const downloadOptions = {
  path: '/path/to/save/downloaded/file.zip',
  urlChain: ['https://example.com/file.zip'],
  mimeType: 'application/zip',
  offset: 1024,
  length: 1048576,
  lastModified: 'Wed, 21 Oct 2015 07:28:00 GMT',
  eTag: '"33a64df551425f05d981900700372445"
}

session.defaultSession.createInterruptedDownload(downloadOptions)
```

--------------------------------

### Handle Drag Start Event in Renderer (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop

This renderer script sets up an event listener for the `ondragstart` event on a specific HTML element. When the drag starts, it prevents the default behavior and calls the `window.electron.startDrag` method, passing the name of the file to be dragged. This initiates the drag-and-drop process by sending an IPC message.

```javascript
document.getElementById('drag').ondragstart = (event) => {
  event.preventDefault()
  window.electron.startDrag('drag-and-drop.md')
}
```

--------------------------------

### app.startAccessingSecurityScopedResource

Source: https://www.electronjs.org/docs/latest/api/app

Allows Electron applications packaged for the Mac App Store to access files chosen by the user outside their sandbox. It requires explicit start and stop calls to manage kernel resources.

```APIDOC
## `app.startAccessingSecurityScopedResource(bookmarkData)`

### Description
Starts accessing a security-scoped resource using provided bookmark data. This is crucial for Mac App Store applications to access user-selected files outside their sandbox.

### Method
`app.startAccessingSecurityScopedResource

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **bookmarkData** (string) - Required - The base64 encoded security-scoped bookmark data returned by `dialog.showOpenDialog` or `dialog.showSaveDialog`.

### Request Example
```javascript
const { app, dialog } = require('electron')
const fs = require('node:fs')

let filepath
let bookmark

dialog.showOpenDialog(null, { securityScopedBookmarks: true }).then(({ filePaths, bookmarks }) => {
  filepath = filePaths[0]
  bookmark = bookmarks[0]
  fs.readFileSync(filepath)
})

// ... after app is ready and resources are needed ...

const stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(bookmark)
fs.readFileSync(filepath) // Access the file
stopAccessingSecurityScopedResource() // Stop accessing the resource
```

### Response
#### Success Response
Returns `Function` - A function that **must** be called when finished accessing the security-scoped resource to release kernel resources.

#### Response Example
```javascript
() => { /* stops access */ }
```

### Error Handling
Failure to call the returned function can lead to kernel resource leaks and loss of sandbox access upon app restart.
```

--------------------------------

### Basic Electron HTML Structure

Source: https://www.electronjs.org/docs/latest/tutorial/examples

This HTML snippet defines the basic structure for an Electron application's user interface. It includes a title, headings, and paragraphs to display information. A meta tag sets the character encoding and content security policy, allowing self-scripts and inline scripts. It also includes placeholder spans for displaying version information.

```html
<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="UTF-8">  
    <title>Hello World!</title>  
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />  
</head>  
<body>  
    <h1>Hello World!</h1>  
    <p>  
        We are using Node.js <span id="node-version"></span>,  
        Chromium <span id="chrome-version"></span>,  
        and Electron <span id="electron-version"></span>.  
    </p>  
</body>  
</html>  
```

--------------------------------

### Window Shadow API

Source: https://www.electronjs.org/docs/latest/api/browser-window

Provides methods to get and set the shadow properties of a window.

```APIDOC
## GET /websites/electronjs/win/hasShadow

### Description
Checks if the window has a shadow.

### Method
GET

### Endpoint
/websites/electronjs/win/hasShadow

### Parameters
#### Query Parameters
None

#### Path Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **boolean** - Whether the window has a shadow.

#### Response Example
```json
{
  "hasShadow": true
}
```
```

--------------------------------

### Validate IPC Message Senders in Electron Main Process

Source: https://www.electronjs.org/docs/latest/tutorial/security

Illustrates how to secure Inter-Process Communication (IPC) in Electron's main process by validating the sender of messages. The 'Bad' example shows a vulnerable handler, while the 'Good' example implements sender validation using `event.senderFrame` and a `validateSender` function to prevent actions from untrusted renderers.

```javascript
// Bad  
ipcMain.handle('get-secrets', () => {  
  return getSecrets()  
})  

// Good  
ipcMain.handle('get-secrets', (e) => {  
  if (!validateSender(e.senderFrame)) return null  
  return getSecrets()  
})  

function validateSender (frame) {  
  // Value the host of the URL using an actual URL parser and an allowlist  
  if ((new URL(frame.url)).host === 'electronjs.org') return true  
  return false  
}  

```

--------------------------------

### Get System Appearance with Electron systemPreferences

Source: https://www.electronjs.org/docs/latest/api/system-preferences

Demonstrates how to retrieve the system's effective appearance using the `systemPreferences` module in Electron. This requires the Electron module to be imported. The output is the current appearance setting.

```javascript
const { systemPreferences } = require('electron')

console.log(systemPreferences.getEffectiveAppearance())
```

--------------------------------

### crashReporter.start(options)

Source: https://www.electronjs.org/docs/latest/api/crash-reporter

Starts the crash reporter and configures it to send crash reports to a specified URL. This method should be called as early as possible in your app's startup, preferably before app.on('ready').

```APIDOC
## POST /crashReporter/start

### Description
Starts the crash reporter to automatically submit crash reports to a remote server.

### Method
POST

### Endpoint
/crashReporter/start

### Parameters
#### Query Parameters
- **submitURL** (string) - Required - URL that crash reports will be sent to as POST. Required unless `uploadToServer` is `false`.
- **productName** (string) - Optional - Defaults to `app.name`.
- **uploadToServer** (boolean) - Optional - Whether crash reports should be sent to the server. If false, crash reports will be collected and stored in the crashes directory, but not uploaded. Default is `true`.
- **ignoreSystemCrashHandler** (boolean) - Optional - If true, crashes generated in the main process will not be forwarded to the system crash handler. Default is `false`.
- **rateLimit** (boolean) - Optional - macOS, Windows - If true, limit the number of crashes uploaded to 1/hour. Default is `false`.
- **compress** (boolean) - Optional - If true, crash reports will be compressed and uploaded with `Content-Encoding: gzip`. Default is `true`.
- **extra** (object) - Optional - Extra string key/value annotations that will be sent along with crash reports generated in the main process. Only string values are supported.
- **globalExtra** (object) - Optional - Extra string key/value annotations that will be sent with any crash reports generated in any process. These annotations cannot be changed once the crash reporter has been started.

### Request Example
```json
{
  "submitURL": "https://your-domain.com/url-to-submit",
  "productName": "My App",
  "uploadToServer": true,
  "extra": {
    "someKey": "someValue"
  }
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message that the crash reporter has started.

#### Response Example
```json
{
  "message": "Crash reporter started successfully."
}
```
```

--------------------------------

### Handle Deep Links: Windows/Linux Instance Logic

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Implements logic for handling deep links on Windows and Linux by requesting a single instance lock and responding to the 'second-instance' event. If a second instance is launched, it focuses the existing window and displays the deep link URL. This ensures only one instance of the app runs and can process incoming links.

```javascript
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    // the commandLine is array of strings in which last element is deep link url
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`)
  })

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    createWindow()
  })
}
```

--------------------------------

### Import Electron Main Process Modules (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

Demonstrates importing core Electron modules 'app' and 'BrowserWindow' using CommonJS syntax for the main process. It highlights the convention of PascalCase for class constructors and camelCase for other modules.

```javascript
const { app, BrowserWindow } = require('electron')
```

--------------------------------

### Electron Main Process: Manage Recent Documents (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/recent-documents

This script sets up the main Electron process to manage recent documents. It creates a window, adds a file to the recent documents list using `app.addRecentDocument`, and clears the list when all windows are closed. It requires the 'electron/main' and 'node:fs', 'node:path' modules.

```javascript
const { app, BrowserWindow } = require('electron/main')  
const fs = require('node:fs')  
const path = require('node:path')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600  
  })  
  
  win.loadFile('index.html')  
}

const fileName = 'recently-used.md'  
fs.writeFile(fileName, 'Lorem Ipsum', () => {  
  app.addRecentDocument(path.join(__dirname, fileName))  
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {  
  app.clearRecentDocuments()  
  if (process.platform !== 'darwin') {  
    app.quit()  
  }  
})

app.on('activate', () => {  
  if (BrowserWindow.getAllWindows().length === 0) {  
    createWindow()  
  }  
})
```

--------------------------------

### Window Position API

Source: https://www.electronjs.org/docs/latest/api/base-window

Methods to set and get the position of the application window.

```APIDOC
## Window Position API

### Description
Methods to set the window's position and retrieve its current position.

### Set Position
#### `win.setPosition(x, y[, animate])`

Moves the window to the specified `x` and `y` coordinates.

**Parameters**
#### Path Parameters
- **x** (Integer) - Required - The target x-coordinate.
- **y** (Integer) - Required - The target y-coordinate.
- **animate** (boolean) - Optional (macOS) - Whether to animate the move.

### Get Position
#### `win.getPosition()`

Returns the current position of the window.

**Returns**
- `Integer[]` - An array containing the current x and y coordinates [x, y].
```

--------------------------------

### Basic binding.gyp Configuration for Node-gyp

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

This JSON-like configuration file instructs `node-gyp` on how to build a native addon. It specifies the target name, source files, include directories, dependencies, preprocessor definitions, and platform-specific compiler settings for different build environments.

```json
{
  "targets": [
    {
      "target_name": "my_addon",
      "sources": [
        "src/my_addon.cc",
        "src/cpp_code.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "include"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [
        "NODE_ADDON_API_CPP_EXCEPTIONS"
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "10.14"
      },
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1
        }
      }
    }
  ]
}
```

--------------------------------

### Electron BrowserWindow Creation

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Defines a function to create the main browser window for the Electron application. It specifies window dimensions, web preferences (including preload script), and loads the application's 'index.html' file. This is the core UI component.

```javascript
let mainWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}
```

--------------------------------

### Window Title API

Source: https://www.electronjs.org/docs/latest/api/base-window

Methods to set and get the title of the native window.

```APIDOC
## Window Title API

### Description
Methods to set the native window's title and retrieve the current title.

### Set Title
#### `win.setTitle(title)`

Changes the title of the native window.

**Parameters**
#### Path Parameters
- **title** (string) - Required - The new title for the window.

### Get Title
#### `win.getTitle()`

Returns the current title of the native window.

**Returns**
- `string` - The title of the native window.

**Note**
The title of the web page can be different from the title of the native window.
```

--------------------------------

### BrowserWindow Options

Source: https://www.electronjs.org/docs/latest/api/browser-window

Configuration options for creating a BrowserWindow instance.

```APIDOC
## BrowserWindow Options

### Description
Configuration options for creating a BrowserWindow instance.

### Method
N/A (Constructor Options)

### Endpoint
N/A

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```javascript
const myWindow = new BrowserWindow({
  width: 800,
  height: 600,
  bypassHeatCheck: true,
  enablePreferredSizeMode: true,
  transparent: false,
  paintWhenInitiallyHidden: false
});
```

### Response
#### Success Response (200)
N/A

#### Response Example
N/A
```

--------------------------------

### systemPreferences.getEffectiveAppearance

Source: https://www.electronjs.org/docs/latest/api/system-preferences

Gets the current macOS appearance setting (dark, light, or unknown) applied to the application. This maps to the `NSApplication.effectiveAppearance` property.

```APIDOC
## systemPreferences.getEffectiveAppearance()

### Description
Gets the macOS appearance setting that is currently applied to your application.

### Method
`systemPreferences.getEffectiveAppearance()`

### Endpoint
N/A (this is a client-side API)

### Parameters
None

### Request Example
```javascript
// Example usage on macOS
const { systemPreferences } = require('electron')
const appearance = systemPreferences.getEffectiveAppearance()
console.log(appearance) // Output: 'dark', 'light', or 'unknown'
```

### Response
#### Success Response (200)
- **appearance** (string) - The effective appearance setting, which can be `dark`, `light`, or `unknown`.

#### Response Example
```json
{
  "appearance": "dark"
}
```
```

--------------------------------

### Get Effective Appearance

Source: https://www.electronjs.org/docs/latest/api/system-preferences

Returns the macOS appearance setting (dark, light, or unknown) that is currently applied to your application.

```APIDOC
## GET /systemPreferences/effectiveAppearance

### Description
Retrieves the current effective appearance setting of the macOS system.

### Method
GET

### Endpoint
/systemPreferences/effectiveAppearance

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **appearance** (string) - The current appearance setting, can be 'dark', 'light', or 'unknown'.

#### Response Example
```json
{
  "appearance": "dark"
}
```
```

--------------------------------

### Adjust Text Selection in Electron WebContents

Source: https://www.electronjs.org/docs/latest/api/web-contents

Modifies the start and end points of the current text selection in the focused frame. Accepts an options object with 'start' and 'end' properties to adjust the selection by a specified amount. Negative values move the selection backward, positive values move it forward. This method is useful for programmatically manipulating user selections.

```javascript
const win = new BrowserWindow()
  
// Adjusts the beginning of the selection 1 letter forward,
// and the end of the selection 5 letters forward.
win.webContents.adjustSelection({ start: 1, end: 5 })

// Adjusts the beginning of the selection 2 letters forward,
// and the end of the selection 3 letters backward.
win.webContents.adjustSelection({ start: 2, end: -3 })
```

--------------------------------

### Session: Create Interrupted Download

Source: https://www.electronjs.org/docs/latest/api/session

Allows resuming cancelled or interrupted downloads. Creates a DownloadItem that starts when the 'resume' API is called.

```APIDOC
## POST /createInterruptedDownload

### Description
Allows resuming `cancelled` or `interrupted` downloads from previous `Session`. The API will generate a `DownloadItem` that can be accessed with the `will-download` event. The `DownloadItem` will not have any `WebContents` associated with it and the initial state will be `interrupted`. The download will start only when the `resume` API is called on the `DownloadItem`.

### Method
POST

### Endpoint
ses.createInterruptedDownload(options)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **options** (Object) - Required - Options for creating the interrupted download.
  - **path** (string) - Required - Absolute path of the download.
  - **urlChain** (string[]) - Required - Complete URL chain for the download.
  - **mimeType** (string) - Optional - MIME type of the file.
  - **offset** (Integer) - Required - Start range for the download.
  - **length** (Integer) - Required - Total length of the download.
  - **lastModified** (string) - Optional - Last-Modified header value.
  - **eTag** (string) - Optional - ETag header value.
  - **startTime** (Double) - Optional - Time when download was started in number of seconds since UNIX epoch.

### Request Example
```javascript
const { session } = require('electron')

session.defaultSession.createInterruptedDownload({
  path: '/path/to/downloaded/file.zip',
  urlChain: ['https://example.com/file.zip'],
  mimeType: 'application/zip',
  offset: 1024,
  length: 20480,
  lastModified: 'Tue, 15 Nov 1994 12:45:26 GMT',
  eTag: '"33a64df551ddfc862817e7e100112a74a0c4f4e8"',
  startTime: Date.now() / 1000
})
```

### Response
#### Success Response (200)
void

#### Response Example
None
```

--------------------------------

### Electron Main Process: Setup and Menu for IPC

Source: https://www.electronjs.org/docs/latest/tutorial/ipc

Sets up the main Electron window, defines a custom application menu, and listens for IPC messages. The menu items trigger sending 'update-counter' messages to the renderer. It requires 'electron/main', 'node:path'.

```javascript
const { app, BrowserWindow, Menu, ipcMain } = require('electron/main')
const path = require('node:path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    }

  ])

  Menu.setApplicationMenu(menu)
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

--------------------------------

### Initialize GTK Application using GTK+

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

Initializes and runs the GTK application. It registers application actions, loads UI from an XML string, and starts the main GTK event loop. This function is the entry point for the GTK part of the application.

```c++
static gboolean init_gtk_app(gpointer user_data)
{
    auto *app = static_cast<GtkApplication *>(user_data);
    g_application_run(G_APPLICATION(app), 0, nullptr);
    g_object_unref(app);
    if (g_main_loop)
    {
      g_main_loop_quit(g_main_loop);
    }
    return G_SOURCE_REMOVE;
  }
```

```c++
static void activate_handler(GtkApplication *app, gpointer user_data)
{
    auto *builder = gtk_builder_new();

    const GActionEntry app_actions[] = {
        {"edit", edit_action, nullptr, nullptr, nullptr, {0, 0, 0}},
        {"delete", delete_action, nullptr, nullptr, nullptr, {0, 0, 0}}};
    g_action_map_add_action_entries(G_ACTION_MAP(app), app_actions,
                                    G_N_ELEMENTS(app_actions), builder);

    gtk_builder_add_from_string(builder,
                                "<?xml version="1.0" encoding="UTF-8"?>"
                                "<interface>"
                                "  <object class="GtkWindow" id="window">"
                                "    <property name="title">Todo List</property>"
                                "    <property name="default-width">400</property>"
                                "    <property name="default-height">500</property>"
                                "    <child>"
                                "      <object class="GtkBox">"

```

--------------------------------

### Runnable Dock Menu Demo (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/macos-dock

This comprehensive example showcases a runnable Electron Dock menu. It includes functions to create new windows, close all existing windows, and open external documentation links. The Dock menu is configured with 'New Window', 'Close All Windows', and 'Open Electron Docs' options, all triggered via `app.dock.setMenu` after the app is ready.

```javascript
const { app, BrowserWindow, Menu } = require('electron/main')
const { shell } = require('electron/common')

function createWindow () {
  const win = new BrowserWindow()
  win.loadFile('index.html')
}

function closeAllWindows () {
  const wins = BrowserWindow.getAllWindows()
  for (const win of wins) {
    win.close()
  }
}

app.whenReady().then(() => {
  createWindow()

  const dockMenu = Menu.buildFromTemplate([
    {
      label: 'New Window',
      click: () => { createWindow() }
    },
    {
      label: 'Close All Windows',
      click: () => { closeAllWindows() }
    },
    {
      label: 'Open Electron Docs',
      click: () => {
        shell.openExternal('https://electronjs.org/docs')
      }
    }
    // add more menu options to the array
  ])

  app.dock.setMenu(dockMenu)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

--------------------------------

### Configure Electron Build with GN

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

This command configures the Electron build using the GN (Generate Ninja) build system. It specifies the output directory and imports release-specific build arguments. This is typically the first step in building Electron from source.

```powershell
$ gn gen out/Release --args="import(\"//electron/build/args/release.gn\")"
```

--------------------------------

### Handling Custom Protocols with net.fetch

Source: https://www.electronjs.org/docs/latest/api/net

Provides an example of how to handle custom protocols using `net.fetch`. It demonstrates registering a handler for a protocol, checking the request URL, and either returning a custom response or forwarding the request using `net.fetch` with the `bypassCustomProtocolHandlers` option.

```javascript
protocol.handle('https', (req) => {
  if (req.url === 'https://my-app.com') {
    return new Response('<body>my app</body>')
  } else {
    return net.fetch(req, { bypassCustomProtocolHandlers: true })
  }
})
```

--------------------------------

### ServiceWorkers.startWorkerForScope

Source: https://www.electronjs.org/docs/latest/api/service-workers

Starts a service worker for a given scope if it is not already running. This is an experimental API.

```APIDOC
## POST /websites/electronjs/serviceWorkers.startWorkerForScope

### Description
Starts the service worker for a given scope or does nothing if it's already running. This is an experimental API.

### Method
POST

### Endpoint
`/websites/electronjs/serviceWorkers.startWorkerForScope`

### Parameters
#### Path Parameters
* **scope** (string) - Required - The scope of the service worker to start.

### Request Example
```javascript
const { session } = require('electron')
const { serviceWorkers } = session.defaultSession

async function startMyWorker(scope) {
  try {
    const serviceWorker = await serviceWorkers.startWorkerForScope(scope)
    console.log(`Service worker for scope ${scope} started successfully.`) 
    return serviceWorker
  } catch (error) {
    console.error(`Failed to start service worker for ${scope}:`, error)
    throw error
  }
}

// Example usage:
// startMyWorker('/my-service-worker-scope/')
```

### Response
#### Success Response (200)
- **ServiceWorkerMain** (object) - Resolves with the service worker when it's started.

#### Response Example
```json
{
  "status": "started",
  "scope": "/my-service-worker-scope/"
}
```
```

--------------------------------

### Run Electron Application in LLDB

Source: https://www.electronjs.org/docs/latest/development/debugging-on-macos

Starts the Electron application within the LLDB debugger. The application will pause at the first breakpoint encountered.

```lldb
(lldb) run
```

--------------------------------

### Session: Get User Agent

Source: https://www.electronjs.org/docs/latest/api/session

Retrieves the user agent string for the current session.

```APIDOC
## GET /getUserAgent

### Description
Returns the user agent for this session.

### Method
GET

### Endpoint
ses.getUserAgent()

### Parameters
None

### Request Example
```javascript
const { session } = require('electron')

const userAgent = session.defaultSession.getUserAgent()
console.log(userAgent)
```

### Response
#### Success Response (200)
- **string** - The user agent for this session.

#### Response Example
```json
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
```
```

--------------------------------

### Build Electron using Ninja

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

These commands use the Ninja build system to compile the Electron application. The `-C` flag specifies the build directory. The `electron` target builds the main application, while `electron:electron_dist_zip` packages it into a distributable zip file.

```shell
$ ninja -C out/Testing electron
$ ninja -C out/Release electron
$ ninja -C out/Release electron:electron_dist_zip
```

--------------------------------

### protocol.uninterceptProtocol

Source: https://www.electronjs.org/docs/latest/api/protocol

Removes the protocol interceptor installed for a given scheme, restoring its original handler. This method is deprecated.

```APIDOC
## protocol.uninterceptProtocol(scheme)

### Description
Removes the protocol interceptor that was previously installed for the specified `scheme`, restoring its original handler. This method is deprecated.

### Method
`protocol.uninterceptProtocol`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
* **scheme** (string) - The protocol scheme to unintercept.

### Request Example
```javascript
protocol.uninterceptProtocol('http');
```

### Response
#### Success Response (boolean)
* **Returns** (boolean) - `true` if the protocol was successfully unintercepted, `false` otherwise.

#### Response Example
```json
true
```

### Deprecation Notes
This method has been replaced with `protocol.unhandle`. Use `protocol.unhandle` for new implementations.
```

--------------------------------

### Electron Renderer Process: Display Recent Documents Info (HTML)

Source: https://www.electronjs.org/docs/latest/tutorial/recent-documents

This HTML file is the renderer process for the Electron application. It displays a heading and a paragraph informing the user about the recent documents feature and how to access it via the application's icon.

```html
<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="UTF-8">  
    <title>Recent Documents</title>  
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />  
</head>  
<body>  
    <h1>Recent Documents</h1>  
    <p>  
        Right click on the app icon to see recent documents.  
        You should see `recently-used.md` added to the list of recent files  
    </p>  
</body>  
</html>
```

--------------------------------

### Create a new BrowserWindow Instance

Source: https://www.electronjs.org/docs/latest/api/browser-window

Demonstrates how to create a new BrowserWindow instance with specified dimensions and load a URL. This is a fundamental step for creating any window in an Electron application.

```javascript
const { BrowserWindow } = require('electron')

// In this example `win` is our instance
const win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')
```

--------------------------------

### Open and Write to a New Window from Renderer

Source: https://www.electronjs.org/docs/latest/api/window-open

This example shows how to open a new window from the renderer process using `window.open()` and then manipulate its content by writing HTML directly to its document. This is useful for creating simple pop-ups or sub-windows with dynamic content.

```javascript
// renderer process (mainWindow)
const childWindow = window.open('', 'modal')
childWindow.document.write('<h1>Hello</h1>')
```

--------------------------------

### Entitlements for Binaries/Helpers (XML)

Source: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide

This XML configuration must be added to the binaries and helpers within an Electron app's bundle to enable App Sandbox. It includes keys for enabling the sandbox and inheriting entitlements.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.inherit</key>
    <true/>
  </dict>
</plist>
```

--------------------------------

### Get All ElectronJS BaseWindows

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves an array containing all currently opened BaseWindow instances within the Electron application. This is useful for managing multiple windows.

```javascript
const allWindows = BaseWindow.getAllWindows()
console.log(allWindows)
```

--------------------------------

### Create and Use MessageChannelMain in Electron

Source: https://www.electronjs.org/docs/latest/api/message-channel-main

Demonstrates how to create a MessageChannelMain in the Electron main process and send one of the connected ports to a renderer process. The renderer process then receives the port and sets up a message listener. This example shows basic inter-process communication using MessageChannelMain and MessagePortMain.

```javascript
// Main process  
const { BrowserWindow, MessageChannelMain } = require('electron')  
  
const w = new BrowserWindow()
const { port1, port2 } = new MessageChannelMain()  
w.webContents.postMessage('port', null, [port2])  
port1.postMessage({ some: 'message' })  
  
// Renderer process  
const { ipcRenderer } = require('electron')  
   ipcRenderer.on('port', (e) => {  
  // e.ports is a list of ports sent along with this message  
  e.ports[0].onmessage = (messageEvent) => {  
    console.log(messageEvent.data)  
  }  
})

```

--------------------------------

### Run ChromeDriver Server

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Starts the ChromeDriver standalone server, which implements the WebDriver protocol for Chromium-based browsers, including Electron. It listens on port 9515 for incoming connections.

```bash
./node_modules/.bin/chromedriver
Starting ChromeDriver (v2.10.291558) on port 9515
Only local connections are allowed.

```

--------------------------------

### ElectronJS: Get Web Contents Zoom Level

Source: https://www.electronjs.org/docs/latest/api/web-contents

Retrieves the current zoom level set for the web contents.

```javascript
const currentZoomLevel = mainWindow.webContents.getZoomLevel();

```

--------------------------------

### Session: Get Preloads (Deprecated)

Source: https://www.electronjs.org/docs/latest/api/session

Retrieves an array of paths to preload scripts registered for the session. Deprecated, use `getPreloadScripts`.

```APIDOC
## GET /getPreloads

### Description
Returns an array of paths to preload scripts that have been registered. Deprecated: Use the new `ses.getPreloadScripts` API. This will only return preload script paths for `frame` context types.

### Method
GET

### Endpoint
ses.getPreloads()

### Parameters
None

### Request Example
```javascript
const { session } = require('electron')

const preloads = session.defaultSession.getPreloads()
console.log(preloads)
```

### Response
#### Success Response (200)
- **string[]** - An array of paths to preload scripts.

#### Response Example
```json
["/path/to/preload1.js", "/path/to/preload2.js"]
```
```

--------------------------------

### Electron Main Process Bluetooth Handling (Node.js)

Source: https://www.electronjs.org/docs/latest/tutorial/devices

The main process script sets up the Electron window, handles Bluetooth device selection events, and manages the Bluetooth pairing process by communicating with the renderer via IPC. It utilizes Electron's core modules like `app`, `BrowserWindow`, and `ipcMain`, along with Node.js's `path` module.

```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

let bluetoothPinCallback
let selectBluetoothCallback

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault()
    selectBluetoothCallback = callback
    const result = deviceList.find((device) => {
      return device.deviceName === 'test'
    })
    if (result) {
      callback(result.deviceId)
    } else {
      // The device wasn't found so we need to either wait longer (eg until the
      // device is turned on) or until the user cancels the request
    }
  })

  ipcMain.on('cancel-bluetooth-request', (event) => {
    selectBluetoothCallback('')
  })

  // Listen for a message from the renderer to get the response for the Bluetooth pairing.
  ipcMain.on('bluetooth-pairing-response', (event, response) => {
    bluetoothPinCallback(response)
  })

  mainWindow.webContents.session.setBluetoothPairingHandler((details, callback) => {
    bluetoothPinCallback = callback
    // Send a message to the renderer to prompt the user to confirm the pairing.
    mainWindow.webContents.send('bluetooth-pairing-request', details)
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

--------------------------------

### Webview Selection Manipulation

Source: https://www.electronjs.org/docs/latest/api/webview-tag

APIs for adjusting the text selection within a webview, including centering the selection and programmatically adjusting its start and end points.

```APIDOC
## Webview Selection Manipulation

### `<webview>.centerSelection()`
Centers the current text selection within the webview page.

### `<webview>.adjustSelection(options)`
Adjusts the current text selection starting and ending points in the focused frame by the given amounts.

#### Parameters
- **options** (Object) - Optional parameters for adjusting selection.
  - **start** (Number) - Optional. Amount to shift the start index of the current selection. Negative values move towards the beginning, positive towards the end.
  - **end** (Number) - Optional. Amount to shift the end index of the current selection. Negative values move towards the beginning, positive towards the end.

See `webContents.adjustSelection` for examples.
```

--------------------------------

### ElectronJS: Get Web Contents Zoom Factor

Source: https://www.electronjs.org/docs/latest/api/web-contents

Retrieves the current zoom factor applied to the web contents.

```javascript
const currentZoomFactor = mainWindow.webContents.getZoomFactor();

```

--------------------------------

### Run Publish Command (npm)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-publishing-updating

Executes the 'publish' script defined in package.json using npm to build and publish the Electron application to GitHub releases.

```bash
npm run publish  
```

--------------------------------

### Electron Forge Configuration for Protocol Handling

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Configures Electron Forge to support custom protocol handling for packaged applications. It specifies the protocol name and scheme for macOS packaging via `packagerConfig` and sets the `mimeType` for Linux `.deb` packages. This ensures the deep linking functionality works after the app is built and distributed.

```json
{
  "config": {
    "forge": {
      "packagerConfig": {
        "protocols": [
          {
            "name": "Electron Fiddle",
            "schemes": ["electron-fiddle"]
          }
        ]
      },
      "makers": [
        {
          "name": "@electron-forge/maker-deb",
          "config": {
            "mimeType": ["x-scheme-handler/electron-fiddle"]
          }
        }
      ]
    }
  }
}
```

--------------------------------

### ElectronJS: Get Web Contents Audio Mute Status

Source: https://www.electronjs.org/docs/latest/api/web-contents

Checks if the audio for the current web contents is muted.

```javascript
const isMuted = mainWindow.webContents.isAudioMuted();

```

--------------------------------

### Get Application Badge Count (Electron)

Source: https://www.electronjs.org/docs/latest/api/app

Retrieves the current value displayed in the application's counter badge on macOS and Linux.

```javascript
const {app} = require('electron');

const currentBadgeCount = app.getBadgeCount();
console.log('Current badge count:', currentBadgeCount);
```

--------------------------------

### Handle App Commands in Electron

Source: https://www.electronjs.org/docs/latest/api/browser-window

Listens for specific application commands, such as media keys or browser navigation buttons, emitted by the BrowserWindow. This example demonstrates how to react to the 'browser-backward' command to navigate the web contents back.

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow()
win.on('app-command', (e, cmd) => {
  // Navigate the window back when the user hits their mouse back button
  if (cmd === 'browser-backward' && win.webContents.canGoBack()) {
    win.webContents.goBack()
  }
})
```

--------------------------------

### Display Electron, Node, and Chrome Versions in Web Page

Source: https://www.electronjs.org/docs/latest/tutorial/examples

This JavaScript code snippet runs in the browser context of an Electron application to display the versions of Electron, Node.js, and Chromium. It uses 'window.addEventListener' to ensure the DOM is loaded before execution. The 'process.versions' object provides the version information. This script updates specific HTML elements by their IDs.

```javascript
window.addEventListener('DOMContentLoaded', () => {  
  const replaceText = (selector, text) => {  
    const element = document.getElementById(selector)  
    if (element) element.innerText = text  
  }  
  
  for (const type of ['chrome', 'node', 'electron']) {  
    replaceText(`${type}-version`, process.versions[type])  
  }  
})
```

--------------------------------

### Configuring Breakpoint Debugging with GN

Source: https://www.electronjs.org/docs/latest/development/debugging

Sets up GN build arguments for enabling breakpoint debugging in Electron. This involves creating a debug.gn file with specific settings like `is_debug = true` and `symbol_level = 2`. Note: This significantly increases build size.

```gn
import("//electron/build/args/testing.gn")
is_debug = true
symbol_level = 2
forbid_non_component_debug_builds = false
```

--------------------------------

### Configure BrowserWindow with Preload Script (Node.js/JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

This main process script configures a BrowserWindow to use a preload script. The `webPreferences.preload` option specifies the path to the `preload.js` file, ensuring it's loaded before the renderer's content. It utilizes Node.js's `path.join` for cross-platform path compatibility.

```javascript
const { app, BrowserWindow } = require('electron')

const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

--------------------------------

### Get Focused ElectronJS BaseWindow

Source: https://www.electronjs.org/docs/latest/api/base-window

Returns the currently focused BaseWindow instance in the application. If no window is focused, it returns null. This is crucial for context-aware operations.

```javascript
const focusedWindow = BaseWindow.getFocusedWindow()
console.log(focusedWindow)
```

--------------------------------

### Attach LLDB to Electron Executable

Source: https://www.electronjs.org/docs/latest/development/debugging-on-macos

This code demonstrates how to initiate a debugging session with LLDB by attaching it to a non-release build of the Electron application. It shows the initial command to start LLDB and target the Electron executable, followed by the confirmation message from LLDB indicating the current executable has been set.

```lldb
$ lldb ./out/Testing/Electron.app
(lldb) target create "./out/Testing/Electron.app"
Current executable set to './out/Testing/Electron.app' (x86_64).
```

--------------------------------

### Get ElectronJS BaseWindow by ID

Source: https://www.electronjs.org/docs/latest/api/base-window

Finds and returns a specific BaseWindow instance using its unique integer ID. If no window matches the ID, it returns null.

```javascript
const windowId = 123
const windowById = BaseWindow.fromId(windowId)
console.log(windowById)
```

--------------------------------

### Electron Main Process for WebHID

Source: https://www.electronjs.org/docs/latest/tutorial/devices

The main process code sets up the Electron window and configures session handlers for the WebHID API. It listens for the 'select-hid-device' event to automatically select a HID device and sets up permission handlers to grant default access and check permissions for specific origins.

```javascript
const { app, BrowserWindow } = require('electron/main')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
    // Add events to handle devices being added or removed before the callback on
    // `select-hid-device` is called.
    mainWindow.webContents.session.on('hid-device-added', (event, device) => {
      console.log('hid-device-added FIRED WITH', device)
      // Optionally update details.deviceList
    })

    mainWindow.webContents.session.on('hid-device-removed', (event, device) => {
      console.log('hid-device-removed FIRED WITH', device)
      // Optionally update details.deviceList
    })

    event.preventDefault()
    if (details.deviceList && details.deviceList.length > 0) {
      callback(details.deviceList[0].deviceId)
    }
  })

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'hid' && details.securityOrigin === 'file:///') {
      return true
    }
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'hid' && details.origin === 'file://') {
      return true
    }
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

--------------------------------

### Windows Release Metadata (RELEASES file)

Source: https://www.electronjs.org/docs/latest/tutorial/updates

This is an example of the RELEASES file format used by Squirrel.Windows to manage application updates. It contains information about the delta package, including its SHA1 hash, filename, and size, enabling Squirrel to determine the correct update.

```text
B0892F3C7AC91D72A6271FF36905FEF8FE993520 electron-fiddle-0.36.3-full.nupkg 103298365  
```

--------------------------------

### WebdriverIO Test for Keyboard Input

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Example test using WebdriverIO to simulate keyboard input and assert the resulting text. It utilizes the browser.keys() command to send input and expect().toHaveText() for assertion.

```javascript
import { browser, $, expect } from '@wdio/globals'

describe('keyboard input', () => {
  it('should detect keyboard input', async () => {
    await browser.keys(['y', 'o'])
    await expect($('keypress-count')).toHaveText('YO')
  })
})

```

--------------------------------

### Webview Find in Page

Source: https://www.electronjs.org/docs/latest/api/webview-tag

Provides functionality to search for text within a webview, including starting searches, continuing searches, and stopping them with specific actions.

```APIDOC
## Webview Find in Page

### `<webview>.findInPage(text[, options])`
Starts a request to find all matches for the specified `text` in the web page. The result of the request can be obtained by subscribing to the `found-in-page` event.

#### Parameters
- **text** (string) - Content to be searched. Must not be empty.
- **options** (Object) - Optional parameters for the find request.
  - **forward** (boolean) - Optional. Whether to search forward or backward. Defaults to `true`.
  - **findNext** (boolean) - Optional. Whether to begin a new text finding session. Should be `true` for initial requests and `false` for follow-up requests. Defaults to `false`.
  - **matchCase** (boolean) - Optional. Whether the search should be case-sensitive. Defaults to `false`.

#### Returns
- `Integer` - The request ID used for the request.

### `<webview>.stopFindInPage(action)`
Stops any `findInPage` request for the webview with the provided `action`.

#### Parameters
- **action** (string) - Specifies the action to take when ending the `findInPage` request.
  - `clearSelection` - Clears the selection.
  - `keepSelection` - Translates the selection into a normal selection.
  - `activateSelection` - Focuses and clicks the selection node.
```

--------------------------------

### Electron API History Block Structure

Source: https://www.electronjs.org/docs/latest/development/style-guide

This example demonstrates the correct Markdown and YAML structure for an API History block in Electron documentation. It shows how to denote additions, changes, and deprecations with PR links and descriptions, enclosed within HTML comments.

```markdown
#### `win.setTrafficLightPosition(position)` _macOS_  

<!--  
```YAML history  
added:  
  - pr-url: https://github.com/electron/electron/pull/22533  
changes:  
  - pr-url: https://github.com/electron/electron/pull/26789  
    description: "Made `trafficLightPosition` option work for `customButtonOnHover` window."  
deprecated:  
  - pr-url: https://github.com/electron/electron/pull/37094  
    breaking-changes-header: deprecated-browserwindowsettrafficlightpositionposition  
```  
-->  

* `position` [Point](structures/point.md)  

Set a custom position for the traffic light buttons. Can only be used with `titleBarStyle` set to `hidden`.  
```

--------------------------------

### Configure Host Resolver with Secure DNS in Electron

Source: https://www.electronjs.org/docs/latest/api/app

Configures the host resolver, including DNS-over-HTTPS (DoH) settings. This example sets the secure DNS mode to 'secure' and provides a list of DoH servers. It must be called after the 'ready' event.

```javascript
const { app } = require('electron')

app.whenReady().then(() => {
  app.configureHostResolver({
    secureDnsMode: 'secure',
    secureDnsServers: [
      'https://cloudflare-dns.com/dns-query'
    ]
  })
})
```

--------------------------------

### Initialize GTK Application and UI

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

Initializes the GTK application, loads UI elements from an XML builder, sets up the main window, connects signals to event handlers, and displays the widget. It expects a GTK builder object and application context as input.

```c++
void init_gtk_app(GtkApplication* app, gpointer user_data) {
    GtkBuilder* builder = GTK_BUILDER(user_data);

    auto *window = GTK_WINDOW(gtk_builder_get_object(builder, "window"));
    auto *button = GTK_BUTTON(gtk_builder_get_object(builder, "add_button"));
    auto *list = GTK_LIST_BOX(gtk_builder_get_object(builder, "todo_list"));

    gtk_window_set_application(window, app);

    g_signal_connect(button, "clicked", G_CALLBACK(on_add_clicked), builder);
    g_signal_connect(list, "row-activated", G_CALLBACK(on_row_activated), nullptr);

    gtk_widget_show_all(GTK_WIDGET(window));
  }
```

--------------------------------

### Screen Menu Bar Height - Deprecated

Source: https://www.electronjs.org/docs/latest/breaking-changes

Gets the height of the menu bar. This API is deprecated and should be replaced with accessing the work area of the primary display.

```javascript
// Deprecated  
screen.getMenuBarHeight()
// Replace with  
screen.getPrimaryDisplay().workArea
```

--------------------------------

### Quit App When Last Window Closed (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/app

This example demonstrates how to quit the Electron application when all its windows are closed. It utilizes the 'window-all-closed' event from the 'app' module.

```javascript
const { app } = require('electron')

app.on('window-all-closed', () => {
  app.quit()
})
```

--------------------------------

### Do not use allowpopups for WebViews

Source: https://www.electronjs.org/docs/latest/tutorial/security

This example contrasts the use and non-use of the `allowpopups` attribute for Electron `<webview>` tags. Omitting `allowpopups` prevents webviews from opening new `BrowserWindows` using `window.open()`, adhering to the principle of least privilege.

```html
<!-- Good -->
<webview src="page.html"></webview>

<!-- Bad (AVOID THIS) -->
<!-- <webview allowpopups src="page.html"></webview> -->
```

--------------------------------

### Session: Get Blob Data

Source: https://www.electronjs.org/docs/latest/api/session

Retrieves blob data associated with a given identifier. Returns a Promise that resolves with the blob data as a Buffer.

```APIDOC
## GET /getBlobData

### Description
Returns blob data identified by a UUID. This method resolves with the blob data.

### Method
GET

### Endpoint
ses.getBlobData(identifier)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **identifier** (string) - Required - Valid UUID.

### Request Example
```javascript
const { session } = require('electron')

async function getBlob(id) {
  try {
    const blobData = await session.defaultSession.getBlobData(id)
    console.log(blobData)
  } catch (error) {
    console.error(error)
  }
}
```

### Response
#### Success Response (200)
- **Buffer** - Blob data.

#### Response Example
```json
<Buffer ...>
```
```

--------------------------------

### Get DevTools Window Title (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/web-contents

Retrieves the current title of the DevTools window. This title is only visible when the DevTools are opened in 'undocked' or 'detach' mode.

```javascript
// Example usage (assuming 'webContents' is an instance of WebContents)
// const title = webContents.getDevToolsTitle();
// console.log('DevTools title:', title);
```

--------------------------------

### Begin Frame Subscription for Presentation Events

Source: https://www.electronjs.org/docs/latest/api/web-contents

Starts capturing frames or presentation events from the web contents. The provided callback function is invoked with the captured image and a dirty rectangle indicating the repainted area.

```javascript
webContents.beginFrameSubscription([onlyDirty ,]callback)
```

--------------------------------

### HTML Structure for Dark Mode Example (index.html)

Source: https://www.electronjs.org/docs/latest/tutorial/dark-mode

The main HTML file for the Electron application. It includes basic structure, a theme display, buttons for toggling dark mode and resetting to system theme, and links to the CSS and renderer JavaScript files.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
    <link rel="stylesheet" type="text/css" href="./styles.css">
</head>
<body>
    <h1>Hello World!</h1>
    <p>Current theme source: <strong id="theme-source">System</strong></p>

    <button id="toggle-dark-mode">Toggle Dark Mode</button>
    <button id="reset-to-system">Reset to System Theme</button>

    <script src="renderer.js"></script>
</body>
</html>

```

--------------------------------

### C++: Initialize and Create Main Window with Windows API

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

This snippet demonstrates the initialization of common Windows controls and the creation of a main application window using the Windows API. It registers a window class, sets up window properties including DPI scaling, and establishes a message loop to handle window events. This is a foundational step for any GUI application built with native Windows code.

```cpp
icex.dwICC = ICC_STANDARD_CLASSES | ICC_WIN95_CLASSES;
    InitCommonControlsEx(&icex);
  
    // Register window class
    WNDCLASSEXW wc = {};
    wc.cbSize = sizeof(WNDCLASSEXW);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = GetModuleHandle(nullptr);
    wc.lpszClassName = L"TodoApp";
    RegisterClassExW(&wc);
  
    // Get the DPI for the monitor
    UINT dpi = GetDpiForSystem();
  
    // Create window
    HWND hwnd = CreateWindowExW(
      0, L"TodoApp", L"Todo List",
      WS_OVERLAPPEDWINDOW,
      CW_USEDEFAULT, CW_USEDEFAULT,
      Scale(500, dpi), Scale(500, dpi),
      nullptr, nullptr,
      GetModuleHandle(nullptr), nullptr
    );
  
    if (hwnd == nullptr) {
      return;
    }
  
    ShowWindow(hwnd, SW_SHOW);
  
    // Message loop
    MSG msg = {};
    while (GetMessage(&msg, nullptr, 0, 0)) {
      TranslateMessage(&msg);
      DispatchMessage(&msg);
    }
  
    // Clean up
    DeleteObject(hFont);
  
```

--------------------------------

### Electron Process-Specific Module Aliases (TypeScript)

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

Demonstrates using process-specific module aliases for main and common modules in Electron with TypeScript. These aliases help with type checking and autocompletion by providing type definitions tailored to the execution environment.

```typescript
const { shell } = require('electron/common')  
const { app } = require('electron/main')  
```

--------------------------------

### Get Window Size in Electron

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves the current width and height of an Electron window. The `getSize` method returns an array containing two integers: the width and the height.

```javascript
const { BaseWindow } = require('electron')

const win = new BaseWindow()

// Set the window size
win.setSize(1024, 768)

// Get the window size
const size = win.getSize()
console.log(size) // Output: [1024, 768]
```

--------------------------------

### Set Custom DevTools in BrowserWindow (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/web-contents

An example demonstrating how to set a separate `BrowserWindow` to act as the DevTools for another `BrowserWindow`. This allows for more control over the DevTools window's appearance and behavior.

```javascript
const { app, BrowserWindow } = require('electron')

let win = null
let devtools = null

app.whenReady().then(() => {
  win = new BrowserWindow()
  devtools = new BrowserWindow()
  win.loadURL('https://github.com')
  win.webContents.setDevToolsWebContents(devtools.webContents)
  win.webContents.openDevTools({ mode: 'detach' })
})
```

--------------------------------

### Create Full Screen Window with Electron

Source: https://www.electronjs.org/docs/latest/api/screen

This snippet demonstrates how to create a BrowserWindow that fills the primary display's available work area. It uses `screen.getPrimaryDisplay()` to get display information and `workAreaSize` to determine the window dimensions. Requires the `electron/main` module.

```javascript
// Retrieve information about screen size, displays, cursor position, etc.  
//  
// For more info, see:  
// https://www.electronjs.org/docs/latest/api/screen  
  
const { app, BrowserWindow, screen } = require('electron/main')  
  
let mainWindow = null  
  
app.whenReady().then(() => {
  // Create a window that fills the screen's available work area.  
  const primaryDisplay = screen.getPrimaryDisplay()  
  const { width, height } = primaryDisplay.workAreaSize  
  
  mainWindow = new BrowserWindow({ width, height })
  mainWindow.loadURL('https://electronjs.org')
})

```

--------------------------------

### HTML Structure for Desktop Media Capture

Source: https://www.electronjs.org/docs/latest/api/desktop-capturer

This HTML file sets up the basic structure for the desktop media capture application. It includes buttons to start and stop the capture, a video element to display the stream, and links to the renderer.js script. It also includes a content security policy.

```html
<html>
<meta http-equiv="content-security-policy" content="script-src 'self' 'unsafe-inline'" />
  <body>
    <button id="startButton" class="button">Start</button>
    <button id="stopButton" class="button">Stop</button>
    <video width="320" height="240" autoplay></video>
    <script src="renderer.js"></script>
  </body>
</html>

```

--------------------------------

### Configure Cross-Compilation with GN

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

This command configures the build for cross-compilation by setting specific GN arguments for target CPU and OS. For example, `target_cpu = "x86"` is used to compile an x86 target from an x64 host. Ensure compatibility as not all combinations are supported.

```shell
$ gn gen out/Testing-x86 --args='... target_cpu = "x86"'
```

--------------------------------

### Register Default Preferences in macOS Electron Apps

Source: https://www.electronjs.org/docs/latest/api/system-preferences

Provides an example of using `systemPreferences.registerDefaults` to add default key-value pairs to an application's `NSUserDefaults` on macOS. This is useful for setting initial application settings.

```javascript
systemPreferences.registerDefaults({
  'com.example.app.setting1': 'defaultValue',
  'com.example.app.enableFeatureX': true,
  'com.example.app.maxUsers': 5
})
```

--------------------------------

### Get Animation Settings

Source: https://www.electronjs.org/docs/latest/api/system-preferences

Retrieves the current system animation settings, including whether rich animations should be rendered, if scroll animations are enabled by the system, and if the user prefers reduced motion.

```APIDOC
## GET /systemPreferences/animationSettings

### Description
Retrieves system animation settings.

### Method
GET

### Endpoint
/systemPreferences/animationSettings

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **shouldRenderRichAnimation** (boolean) - Returns true if rich animations should be rendered.
- **scrollAnimationsEnabledBySystem** (boolean) - Determines whether scroll animations should be enabled.
- **prefersReducedMotion** (boolean) - Determines whether the user desires reduced motion.

#### Response Example
```json
{
  "shouldRenderRichAnimation": true,
  "scrollAnimationsEnabledBySystem": true,
  "prefersReducedMotion": false
}
```
```

--------------------------------

### HTML for Electron IPC Example

Source: https://www.electronjs.org/docs/latest/tutorial/ipc

A simple HTML structure for an Electron application demonstrating Inter-Process Communication. It includes an input field for a title, a button to trigger the IPC message, and links to the renderer script. This HTML is intended to be loaded by the main process and interacts with the `electronAPI` exposed by the preload script.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Hello World!</title>
  </head>
  <body>
    Title: <input id="title"/>
    <button id="btn" type="button">Set</button>
    <script src="./renderer.js"></script>
  </body>
</html>
```

--------------------------------

### Create and Access ElectronJS BaseWindow Instance

Source: https://www.electronjs.org/docs/latest/api/base-window

Demonstrates how to import and create a new BaseWindow instance in ElectronJS. This is the fundamental step for interacting with window functionalities.

```javascript
const { BaseWindow } = require('electron')
// In this example `win` is our instance
const win = new BaseWindow({ width: 800, height: 600 })
```

--------------------------------

### BrowserView Constructor Options

Source: https://www.electronjs.org/docs/latest/api/browser-view

Options available when creating a new BrowserView instance.

```APIDOC
## BrowserView Constructor Options

### Description
Options to configure a new BrowserView.

### Parameters
#### Request Body
- **options** (Object) - Optional configuration object for the BrowserView.
  - **codeCache** (string) - Optional. Configures code caching behavior. Accepts one of the following values:
    - `none`: Disables code caching.
    - `code`: Enables heuristic based code caching.
    - `bypassHeatCheck`: Bypasses code caching heuristics but with lazy compilation.
    - `bypassHeatCheckAndEagerCompile`: Similar to `bypassHeatCheck` but with eager compilation.
    *Default: `code`*
  - **enablePreferredSizeMode** (boolean) - Optional. Whether to enable preferred size mode. If true, the `preferred-size-changed` event will be emitted on `webContents` when the preferred size changes. The preferred size is the minimum size needed to contain the document layout without scrolling.
    *Default: `false`*
  - **transparent** (boolean) - Optional. Whether to enable background transparency for the guest page. If true, the background will be transparent, but text color will still adjust based on the color scheme.
    *Default: `true`*
  - **enableDeprecatedPaste** (boolean) - Deprecated. Whether to enable the `paste` execCommand.
    *Default: `false`*
```

--------------------------------

### Get V8 Heap Statistics - Electron Process

Source: https://www.electronjs.org/docs/latest/api/process

Retrieves detailed statistics about the V8 JavaScript engine's heap memory usage for the current process. All returned statistics are in Kilobytes. This method is synchronous.

```javascript
const { totalHeapSize, usedHeapSize } = process.getHeapStatistics();
console.log(`Total Heap Size: ${totalHeapSize} KB`);
console.log(`Used Heap Size: ${usedHeapSize} KB`);
```

--------------------------------

### Fetch Electron Source Code using gclient

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

Retrieves the Electron source code and its dependencies using the gclient tool. This involves creating a directory, configuring the gclient repository, and synchronizing the code. The process can take a significant amount of time.

```bash
mkdir electron && cd electron  
gclient config --name "src/electron" --unmanaged https://github.com/electron/electron  
gclient sync --with_branch_heads --with_tags  
```

--------------------------------

### Electron 6.0: Deprecation of app.enableMixedSandbox()

Source: https://www.electronjs.org/docs/latest/breaking-changes

The `app.enableMixedSandbox()` method is now deprecated and no longer needed, as mixed-sandbox mode is enabled by default in Electron 6.0. This simplifies application setup for sandboxing.

```javascript
// Deprecated
// app.enableMixedSandbox();

// No replacement needed, mixed-sandbox is now the default.
```

--------------------------------

### Manage WebContentsView Resource Closure (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/base-window

Provides an example of how to manually close the webContents of a WebContentsView when its parent BaseWindow is closed. This is crucial for preventing memory leaks, as webContents are not destroyed automatically.

```javascript
const { BaseWindow, WebContentsView } = require('electron')

const win = new BaseWindow({ width: 800, height: 600 })

const view = new WebContentsView()
win.contentView.addChildView(view)

win.on('closed', () => {
  view.webContents.close()
})

```

--------------------------------

### Replace crashReporter.getCrashesDirectory() with app.getPath('crashDumps')

Source: https://www.electronjs.org/docs/latest/breaking-changes

The `crashReporter.getCrashesDirectory()` method has been removed and deprecated. Use `app.getPath('crashDumps')` to get the path to crash dumps instead. This applies to both Electron 10 and 12.

```javascript
// Removed/Deprecated in Electron 12/10
crashReporter.getCrashesDirectory()
// Replace with
app.getPath('crashDumps')
```

--------------------------------

### Get All Shared Workers Information (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/web-contents

Retrieves an array containing information about all currently active shared workers. Each element in the array is an object with details about a shared worker.

```javascript
// Example usage (assuming 'webContents' is an instance of WebContents)
// const workersInfo = webContents.getAllSharedWorkers();
// console.log('Shared Workers:', workersInfo);
```

--------------------------------

### Menu Constructor and Static Methods

Source: https://www.electronjs.org/docs/latest/api/menu

This section details how to create a new menu instance and utilize static methods for managing application-wide menus.

```APIDOC
## `new Menu()`

### Description
Creates a new menu.

### Method
`constructor`

### Endpoint
N/A

### Parameters
None

### Request Example
```javascript
const { Menu } = require('electron')
const menu = new Menu()
```

### Response
#### Success Response (200)
- `menu` (Menu) - A new Menu instance.

#### Response Example
```json
{
  "type": "Menu"
}
```

## `Menu.setApplicationMenu(menu)`

### Description
Sets the application menu for macOS, or the menu for each window on Windows and Linux. Handles accelerator key generation with '&'.

### Method
`static`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- `menu` (Menu | null) - The menu to set or `null` to suppress the default menu.

### Request Example
```javascript
const { Menu } = require('electron')

const template = [
  {
    label: 'File',
    submenu: [
      { role: 'close' }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
```

### Response
#### Success Response (200)
None. This method modifies the application's menu.

## `Menu.getApplicationMenu()`

### Description
Retrieves the currently set application menu.

### Method
`static`

### Endpoint
N/A

### Parameters
None

### Request Example
```javascript
const { Menu } = require('electron')

const appMenu = Menu.getApplicationMenu()
console.log(appMenu)
```

### Response
#### Success Response (200)
- `menu` (Menu | null) - The current application menu, or `null` if none is set.

#### Response Example
```json
{
  "type": "Menu"
}
```

## `Menu.sendActionToFirstResponder(action)`

### Description
Sends an action to the first responder on macOS, useful for emulating default macOS menu behaviors.

### Method
`static`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- `action` (string) - The action string to send.

### Request Example
```javascript
Menu.sendActionToFirstResponder('selectAll:')
```

### Response
#### Success Response (200)
None. This method performs an action on the application.

## `Menu.buildFromTemplate(template)`

### Description
Builds a new `Menu` object from a template array of menu item options.

### Method
`static`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- `template` (MenuItemConstructorOptions | MenuItem)[] - An array of options for menu items.

### Request Example
```javascript
const { Menu } = require('electron')

const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
```

### Response
#### Success Response (200)
- `menu` (Menu) - The constructed `Menu` object.

#### Response Example
```json
{
  "type": "Menu"
}
```
```

--------------------------------

### C++ GTK Application Initialization and Signal Connection

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

This C++ code initializes a GTK application, retrieves UI elements from a GTK Builder object, sets up the main window, and connects signals for user interactions like button clicks and row activation. It demonstrates basic GTK application setup and event handling.

```C++
auto *window = GTK_WINDOW(gtk_builder_get_object(builder, "window"));
    auto *button = GTK_BUTTON(gtk_builder_get_object(builder, "add_button"));
    auto *list = GTK_LIST_BOX(gtk_builder_get_object(builder, "todo_list"));

    gtk_window_set_application(window, app);

    g_signal_connect(button, "clicked", G_CALLBACK(on_add_clicked), builder);
    g_signal_connect(list, "row-activated", G_CALLBACK(on_row_activated), nullptr);

    gtk_widget_show_all(GTK_WIDGET(window));
```

--------------------------------

### Integrate Spellchecker with Context Menu

Source: https://www.electronjs.org/docs/latest/tutorial/spellchecker

Provides an example of how to create a custom context menu in Electron that includes spelling suggestions and an option to add misspelled words to the dictionary. This utilizes the `context-menu` event.

```javascript
const { Menu, MenuItem } = require('electron')

myWindow.webContents.on('context-menu', (event, params) => {
  const menu = new Menu()

  // Add each spelling suggestion
  for (const suggestion of params.dictionarySuggestions) {
    menu.append(new MenuItem({
      label: suggestion,
      click: () => myWindow.webContents.replaceMisspelling(suggestion)
    }))
  }

  // Allow users to add the misspelled word to the dictionary
  if (params.misspelledWord) {
    menu.append(
      new MenuItem({
        label: 'Add to dictionary',
        click: () => myWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
      })
    )
  }

  menu.popup()
})

```

--------------------------------

### Open New Window on Activate (macOS)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

This snippet handles the macOS-specific behavior where the app should launch a new window if none are open when the app is activated. It's placed within the `app.whenReady()` callback to ensure it only runs after the app is initialized. It listens for the `activate` event and calls `createWindow()` if `BrowserWindow.getAllWindows().length` is 0.

```javascript
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
```

--------------------------------

### Handling Downloads with Electron's 'will-download' Event

Source: https://www.electronjs.org/docs/latest/api/session

Illustrates how to intercept and manage file downloads using the 'will-download' event on the default session. This example prevents the default download behavior and instead fetches the file content using 'got' and saves it locally.

```javascript
const { session } = require('electron')

session.defaultSession.on('will-download', (event, item, webContents) => {
  event.preventDefault()
  require('got')(item.getURL()).then((response) => {
    require('node:fs').writeFileSync('/somewhere', response.body)
  })
})
```

--------------------------------

### Create Tray Icon and Context Menu in Electron

Source: https://www.electronjs.org/docs/latest/tutorial/tray

This snippet shows how to create a system tray icon with a 'Quit' option in its context menu using Electron's Tray and Menu modules. It requires 'electron/main' and 'electron/common' for app, Tray, Menu, and NativeImage. The icon is created from a data URL, and the menu is built and attached to the tray instance after the app is ready.

```javascript
const { nativeImage } = require('electron/common')
const { app, Tray, Menu } = require('electron/main')

// save a reference to the Tray object globally to avoid garbage collection
let tray

// 16x16 red circle data URL
const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBpZKBCYAgEEV/TeAIjuIIbdQIuUGt0CS1gW1iZ2jIVaTnhw+Cvs8/OYDJA4Y8kR3ZR2/kmazxJbpUEfQ/Dm/UG7wVwHkjlQdMFfDdJMFaACebnjJGyDWgcnZu1/lrCrl6NCoEHJBrDwEr5NrT6ko/UV8xdLAC2N49mlc5CylpYh8wCwqrvbBGLoKGvz8Bfq0QPWEUo/EAAAAASUVORK5CYII=')

// The Tray can only be instantiated after the 'ready' event is fired
app.whenReady().then(() => {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)
})
```

--------------------------------

### Update BrowserWindow traffic light positioning API

Source: https://www.electronjs.org/docs/latest/breaking-changes

Explains the removal of `BrowserWindow.setTrafficLightPosition()` and `BrowserWindow.getTrafficLightPosition()`. It guides users to adopt `BrowserWindow.setWindowButtonPosition()` and `BrowserWindow.getWindowButtonPosition()` for managing traffic light button positions.

```javascript
// Removed in Electron 28
win.setTrafficLightPosition({ x: 10, y: 10 })
win.setTrafficLightPosition({ x: 0, y: 0 })

// Replace with
win.setWindowButtonPosition({ x: 10, y: 10 })
win.setWindowButtonPosition(null)
```

```javascript
// Removed in Electron 28
const pos = win.getTrafficLightPosition()
if (pos.x === 0 && pos.y === 0) {
  // No custom position.
}

// Replace with
const ret = win.getWindowButtonPosition()
if (ret === null) {
  // No custom position.
}
```

--------------------------------

### Control Window Resizability

Source: https://www.electronjs.org/docs/latest/api/base-window

Set or get the resizable state of a window. This allows or disallows the user to manually resize the window. The `setResizable` method takes a boolean argument, and `isResizable` returns a boolean.

```javascript
win.setResizable(true)
const resizable = win.isResizable()
```

--------------------------------

### IPC Communication for webview DevTools Access (Electron 9.0)

Source: https://www.electronjs.org/docs/latest/breaking-changes

This example shows an IPC-based approach for opening a webview's DevTools, avoiding the deprecated `remote` module. It involves main and renderer process code.

```javascript
// main
const { ipcMain, webContents } = require('electron')

const getGuestForWebContents = (webContentsId, contents) => {
  const guest = webContents.fromId(webContentsId)
  if (!guest) {
    throw new Error(`Invalid webContentsId: ${webContentsId}`)
  }
  if (guest.hostWebContents !== contents) {
    throw new Error('Access denied to webContents')
  }
  return guest
}
ipcMain.handle('openDevTools', (event, webContentsId) => {
  const guest = getGuestForWebContents(webContentsId, event.sender)
  guest.openDevTools()
})

// renderer
const { ipcRenderer } = require('electron')
ipcRenderer.invoke('openDevTools', webview.getWebContentsId())
```

--------------------------------

### Create and Open Electron App in VSCode

Source: https://www.electronjs.org/docs/latest/tutorial/debugging-vscode

Commands to create a new Electron application using npx and then open it in VSCode. This is the initial step for setting up debugging.

```bash
npx create-electron-app@latest my-app
code my-app
```

--------------------------------

### package.json Configuration for Swift Electron Addon

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

Specifies the package configuration for a Swift native addon targeting Electron. Includes name, version, main entry point, scripts for cleaning, building with electron-rebuild, and general build process using node-gyp. Also lists dependencies like bindings and node-addon-api, and devDependencies like node-gyp.

```json
{
  "name": "swift-macos",
  "version": "1.0.0",
  "description": "A demo module that exposes Swift code to Electron",
  "main": "js/index.js",
  "scripts": {
    "clean": "rm -rf build",
    "build-electron": "electron-rebuild",
    "build": "node-gyp configure && node-gyp build"
  },
  "license": "MIT",
  "dependencies": {
    "bindings": "^1.5.0",
    "node-addon-api": "^8.3.0"
  },
  "devDependencies": {
    "node-gyp": "^11.1.0"
  }
}

```

--------------------------------

### Accessing Exposed API in Electron Renderer Script

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

This snippet illustrates how a renderer process script can access APIs exposed from the preload script via the `window` global object. This is the intended way to interact with custom APIs after context isolation.

```javascript
console.log(window.myAPI)
// => { desktop: true }

```

--------------------------------

### Capture Screenshot of Electron BrowserWindow with Playwright

Source: https://www.electronjs.org/docs/latest/tutorial/automated-testing

Captures a screenshot of the first browser window of an Electron application using Playwright. It utilizes `electronApp.firstWindow()` to get the `Page` object and then calls the `screenshot` method.

```javascript
import { test, _electron as electron } from '@playwright/test'

test('save screenshot', async () => {
  const electronApp = await electron.launch({ args: ['.'] })
  const window = await electronApp.firstWindow()
  await window.screenshot({ path: 'intro.png' })
  // close app
  await electronApp.close()
})
```

--------------------------------

### Get Desktop Capturer Sources (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/desktop-capturer

This JavaScript function, desktopCapturer.getSources(options), retrieves a list of available media sources for capturing. It accepts an options object specifying the types of sources (e.g., 'screen', 'window') and optionally thumbnail size and window icon fetching. It returns a Promise that resolves with an array of DesktopCapturerSource objects.

```javascript
desktopCapturer.getSources(options).then((sources) => {
  console.log(sources);
});

```

--------------------------------

### Capture Desktop Media with Electron (Renderer Process)

Source: https://www.electronjs.org/docs/latest/api/desktop-capturer

This snippet shows how to capture desktop media in the renderer process using the navigator.mediaDevices.getDisplayMedia API. It requires DOM elements for buttons and a video player. The code handles starting and stopping the media stream, displaying it in a video element.

```javascript
const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')
const video = document.querySelector('video')

startButton.addEventListener('click', () => {
  navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: {
      width: 320,
      height: 240,
      frameRate: 30
    }
  }).then(stream => {
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }).catch(e => console.log(e))
})

stopButton.addEventListener('click', () => {
  video.pause()
})

```

--------------------------------

### Listen for `counter-value` IPC Event in Main Process (Electron)

Source: https://www.electronjs.org/docs/latest/tutorial/ipc

This is a simplified example of the main process listening for a `counter-value` IPC event sent from the renderer. It logs the received value to the Node console. Dependencies: `ipcMain.on`.

```javascript
const { ipcMain } = require('electron')

// ...
ipcMain.on('counter-value', (_event, value) => {
  console.log(value) // will print value to Node console
})
// ...
```

--------------------------------

### Control File Downloads with DownloadItem in Electron

Source: https://www.electronjs.org/docs/latest/api/download-item

Example demonstrating how to use the DownloadItem class within Electron's main process to intercept and manage file downloads. It shows how to set the save path, handle download progress and interruptions, and react to completion or failure.

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow()
win.webContents.session.on('will-download', (event, item, webContents) => {
  // Set the save path, making Electron not to prompt a save dialog.
  item.setSavePath('/tmp/save.pdf')

  item.on('updated', (event, state) => {
    if (state === 'interrupted') {
      console.log('Download is interrupted but can be resumed')
    } else if (state === 'progressing') {
      if (item.isPaused()) {
        console.log('Download is paused')
      } else {
        console.log(`Received bytes: ${item.getReceivedBytes()}`)
      }
    }
  })
  item.once('done', (event, state) => {
    if (state === 'completed') {
      console.log('Download successfully')
    } else {
      console.log(`Download failed: ${state}`)
    }
  })
})
```

--------------------------------

### Start and Stop Network Logging in Electron

Source: https://www.electronjs.org/docs/latest/api/net-log

This snippet demonstrates how to initiate network logging using `netLog.startLogging` and then stop it using `netLog.stopLogging` within an Electron application. It utilizes the `app` module's `whenReady` event to ensure the logging methods are called only after the application is ready. The captured logs are saved to a specified file path.

```javascript
const { app, netLog } = require('electron')

app.whenReady().then(async () => {
  await netLog.startLogging('/path/to/net-log')
  // After some network events
  const path = await netLog.stopLogging()
  console.log('Net-logs written to', path)
})
```

--------------------------------

### Menu Instance Methods

Source: https://www.electronjs.org/docs/latest/api/menu

Details the methods available on a `Menu` instance, such as popping up context menus, closing them, and manipulating menu items.

```APIDOC
## `menu.popup([options])`

### Description
Pops up the menu as a context menu in the specified window.

### Method
`instance`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- `options` (Object, optional)
  - `window` (BaseWindow, optional) - The window in which to pop up the menu. Defaults to the focused window.
  - `frame` (WebFrameMain, optional) - The relevant frame for OS-level features.
  - `x` (number, optional) - The x-coordinate for the menu position. Must be declared if `y` is declared.
  - `y` (number, optional) - The y-coordinate for the menu position. Must be declared if `x` is declared.
  - `positioningItem` (number, optional) _macOS_ - The index of the menu item to position under the cursor.
  - `sourceType` (string, optional) _Windows_ _Linux_ - The source type of the menu event.
  - `callback` (Function, optional) - Called when the menu is closed.

### Request Example
```javascript
menu.popup({ window: mainWindow, x: 100, y: 100 })
```

### Response
#### Success Response (200)
None. This method displays a context menu.

## `menu.closePopup([window])`

### Description
Closes the context menu that is currently open in the specified window.

### Method
`instance`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- `window` (BaseWindow, optional) - The window from which to close the menu. Defaults to the focused window.

### Request Example
```javascript
menu.closePopup(mainWindow)
```

### Response
#### Success Response (200)
None. This method closes a context menu.

## `menu.append(menuItem)`

### Description
Appends a `MenuItem` to the end of the menu.

### Method
`instance`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- `menuItem` (MenuItem) - The menu item to append.

### Request Example
```javascript
const { MenuItem } = require('electron')
const newItem = new MenuItem({ label: 'New Item' })
menu.append(newItem)
```

### Response
#### Success Response (200)
None. This method modifies the menu by adding an item.

## `menu.getMenuItemById(id)`

### Description
Retrieves a `MenuItem` from the menu using its unique ID.

### Method
`instance`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- `id` (string) - The ID of the menu item to retrieve.

### Request Example
```javascript
const item = menu.getMenuItemById('save-item')
if (item) {
  console.log(item.label)
}
```

### Response
#### Success Response (200)
- `menuItem` (MenuItem | null) - The found menu item, or `null` if not found.

#### Response Example
```json
{
  "type": "MenuItem",
  "label": "Save"
}
```

## `menu.insert(pos, menuItem)`

### Description
Inserts a `MenuItem` at a specific position in the menu.

### Method
`instance`

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- `pos` (Integer) - The zero-based index at which to insert the menu item.
- `menuItem` (MenuItem) - The menu item to insert.

### Request Example
```javascript
const { MenuItem } = require('electron')
const newItem = new MenuItem({ label: 'Inserted Item' })
menu.insert(1, newItem) // Inserts at the second position
```

### Response
#### Success Response (200)
None. This method modifies the menu by inserting an item.

```

--------------------------------

### Expose Complex API to Main World (Preload Script)

Source: https://www.electronjs.org/docs/latest/api/context-bridge

This example illustrates exposing a more complex API to the renderer's main world using contextBridge.exposeInMainWorld. It includes functions, promises, async functions, arrays, and nested objects, showcasing how different data types are handled (copied vs. proxied). This allows for richer communication between contexts.

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'electron',
  {
    doThing: () => ipcRenderer.send('do-a-thing'),
    myPromises: [Promise.resolve(), Promise.reject(new Error('whoops'))],
    anAsyncFunction: async () => 123,
    data: {
      myFlags: ['a', 'b', 'c'],
      bootTime: 1234
    },
    nestedAPI: {
      evenDeeper: {
        youCanDoThisAsMuchAsYouWant: {
          fn: () => ({
            returnData: 123
          })
        }
      }
    }
  }
)

```

--------------------------------

### Basic HTML Structure for Electron BrowserWindow Example (HTML)

Source: https://www.electronjs.org/docs/latest/tutorial/represented-file

This HTML code provides a basic structure for an Electron application's main window. It includes a heading and a paragraph explaining how to interact with the represented file feature by clicking the title bar with modifier keys. It also sets a content security policy.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
    <link rel="stylesheet" type="text/css" href="./styles.css">
</head>
<body>
    <h1>Hello World!</h1>
    <p>
      Click on the title with the <pre>Command</pre> or <pre>Control</pre> key pressed.
      You should see a popup with the represented file at the top.
    </p>
  </body>
</body>
</html>
```

--------------------------------

### Set Zoom Factor - Electron webFrame

Source: https://www.electronjs.org/docs/latest/api/web-frame

This example demonstrates how to set the zoom factor of the current web page to 200% using the `setZoomFactor` method from the `webFrame` module. Ensure the `electron` module is required.

```javascript
const { webFrame } = require('electron')

webFrame.setZoomFactor(2)
```

--------------------------------

### App Initialization Status

Source: https://www.electronjs.org/docs/latest/api/app

Methods to check if the Electron app is ready and to wait for readiness.

```APIDOC
## `app.isReady()`

### Description
Returns `true` if Electron has finished initializing, `false` otherwise.

### Returns
- `boolean` - `true` if the app is ready, `false` otherwise.

### Method
`app.isReady()`
```

```APIDOC
## `app.whenReady()`

### Description
Returns a Promise that is fulfilled when Electron is initialized. This can be used as a convenient alternative to checking `app.isReady()` and subscribing to the `ready` event if the app is not ready yet.

### Returns
- `Promise<void>` - A promise that resolves when Electron is initialized.

### Method
`app.whenReady()`
```

--------------------------------

### Radio Menu Items Example

Source: https://www.electronjs.org/docs/latest/tutorial/menus

Demonstrates the behavior of 'radio' type menu items, where only one item in a group can be checked at a time. Adjacent radio items function as a group, while non-adjacent ones are unaffected.

```javascript
[
  { type: 'radio', label: 'Adjacent 1' },
  { type: 'radio', label: 'Adjacent 2' },
  { type: 'separator' },
  { type: 'radio', label: 'Non-adjacent' } 
]
```

--------------------------------

### Get WebContents from Webview using ID

Source: https://www.electronjs.org/docs/latest/breaking-changes

The removed webview.getWebContents() API should be replaced by obtaining the WebContents ID and then using remote.webContents.fromId() to retrieve the WebContents object. This method is necessary after the direct getter was removed.

```javascript
// Removed in Electron 9.0
webview.getWebContents()
// Replace with
const { remote } = require('electron')
remote.webContents.fromId(webview.getWebContentsId())
```

--------------------------------

### Generate Electron Testing Build Config (Linux/macOS)

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

Generates the build configuration for a testing build of Electron on Linux and macOS using GN. It specifies the output directory as 'out/Testing' and imports the testing build arguments from the specified GN file.

```bash
gn gen out/Testing --args="import(\"//electron/build/args/testing.gn\")"  
```

--------------------------------

### Start Electron Crash Reporter

Source: https://www.electronjs.org/docs/latest/api/crash-reporter

Initializes the crash reporter to automatically submit crash reports to a specified URL. This function should be called as early as possible in the main process startup. It requires the `submitURL` option to be set.

```javascript
const { crashReporter } = require('electron')

crashReporter.start({ submitURL: 'https://your-domain.com/url-to-submit' })

```

--------------------------------

### Get Blink Memory Info - Electron Process

Source: https://www.electronjs.org/docs/latest/api/process

Obtains memory usage statistics specific to the Blink rendering engine. This is useful for diagnosing rendering or DOM-related memory issues. All reported values are in Kilobytes and the method is synchronous.

```javascript
const { allocated, total } = process.getBlinkMemoryInfo();
console.log(`Blink Allocated Memory: ${allocated} KB`);
console.log(`Blink Total Memory: ${total} KB`);
```

--------------------------------

### Electron.js: Get Session Cache Size

Source: https://www.electronjs.org/docs/latest/api/session

This snippet shows how to retrieve the current cache size in bytes for an Electron.js session. It returns a Promise that resolves with an integer representing the cache size.

```javascript
const cacheSize = await ses.getCacheSize();
```

--------------------------------

### Bundle Your Code

Source: https://www.electronjs.org/docs/latest/tutorial/performance

Bundling your application's code into a single file is recommended to minimize the overhead associated with multiple `require()` calls, thus improving application load times. Choose a bundler that supports both Node.js and browser environments.

```APIDOC
## Bundle Your Code

### Description
Bundling your application's code into a single file minimizes the overhead of `require()` calls, leading to faster application startup. It's crucial to use a bundler that can handle Electron's dual environment (Node.js and browser).

### Method
N/A (This is a development practice, not an API endpoint)

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
N/A

### Recommendations
- Use bundlers like Webpack, Parcel, or rollup.js.
- Ensure the bundler supports both Node.js and browser environments.
```

--------------------------------

### Run Publish Command (Yarn)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-publishing-updating

Executes the 'publish' script defined in package.json using Yarn to build and publish the Electron application to GitHub releases.

```bash
yarn run publish  
```

--------------------------------

### Get Window Maximum Size in Electron

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves the maximum width and height constraints of an Electron window. The `getMaximumSize` method returns an array containing two integers: the maximum width and the maximum height.

```javascript
const { BaseWindow } = require('electron')

const win = new BaseWindow()

// Set the maximum size
win.setMaximumSize(1920, 1080)

// Get the maximum size
const maxSize = win.getMaximumSize()
console.log(maxSize) // Output: [1920, 1080]
```

--------------------------------

### Electron BrowserWindow Instantiation Function (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

Defines a reusable JavaScript function 'createWindow' that creates a new Electron BrowserWindow instance with specified dimensions (width and height) and loads the 'index.html' file into it.

```javascript
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}
```

--------------------------------

### Electron Main Process In-App Purchase Handling

Source: https://www.electronjs.org/docs/latest/tutorial/in-app-purchases

This JavaScript code demonstrates how to handle in-app purchases within the Electron main process. It includes setting up listeners for transaction updates, checking payment status (purchasing, purchased, failed, restored, deferred), retrieving receipt URLs, and finishing transactions. It also shows how to verify if payments can be made, fetch product details, and initiate a product purchase. Remember to replace placeholder product IDs with your actual identifiers from iTunes Connect.

```javascript
// Main process
const { inAppPurchase } = require('electron')

const PRODUCT_IDS = ['id1', 'id2']

// Listen for transactions as soon as possible. 
inAppPurchase.on('transactions-updated', (event, transactions) => {
  if (!Array.isArray(transactions)) {
    return
  }

  // Check each transaction. 
  for (const transaction of transactions) {
    const payment = transaction.payment

    switch (transaction.transactionState) {
      case 'purchasing':
        console.log(`Purchasing ${payment.productIdentifier}...`)
        break

      case 'purchased': {
        console.log(`${payment.productIdentifier} purchased.`)  

        // Get the receipt url.  
        const receiptURL = inAppPurchase.getReceiptURL()

        console.log(`Receipt URL: ${receiptURL}`)

        // Submit the receipt file to the server and check if it is valid.  
        // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html  
        // ...  
        // If the receipt is valid, the product is purchased  
        // ...  

        // Finish the transaction.  
        inAppPurchase.finishTransactionByDate(transaction.transactionDate)

        break
      }

      case 'failed':

        console.log(`Failed to purchase ${payment.productIdentifier}.`)

        // Finish the transaction.  
        inAppPurchase.finishTransactionByDate(transaction.transactionDate)

        break
      case 'restored':

        console.log(`The purchase of ${payment.productIdentifier} has been restored.`)

        break
      case 'deferred':

        console.log(`The purchase of ${payment.productIdentifier} has been deferred.`)

        break
      default:
        break
    }
  }
})

// Check if the user is allowed to make in-app purchase.  
if (!inAppPurchase.canMakePayments()) {
  console.log('The user is not allowed to make in-app purchase.')
}

// Retrieve and display the product descriptions.  
inAppPurchase.getProducts(PRODUCT_IDS).then(products => {
  // Check the parameters.  
  if (!Array.isArray(products) || products.length <= 0) {
    console.log('Unable to retrieve the product information.')
    return
  }
  
  // Display the name and price of each product.  
  for (const product of products) {
    console.log(`The price of ${product.localizedTitle} is ${product.formattedPrice}.`)
  }
  
  // Ask the user which product they want to purchase.  
  const selectedProduct = products[0]
  const selectedQuantity = 1
  
  // Purchase the selected product.  
  inAppPurchase.purchaseProduct(selectedProduct.productIdentifier, selectedQuantity).then(isProductValid => {
    if (!isProductValid) {
      console.log('The product is not valid.')
      return
    }

    console.log('The payment has been added to the payment queue.')
  })
})
```

--------------------------------

### Implement Custom Protocol Similar to file://

Source: https://www.electronjs.org/docs/latest/api/protocol

This example demonstrates how to implement a custom protocol handler 'atom://' that mimics the functionality of the 'file://' protocol. It requires the 'electron' and 'node:path', 'node:url' modules. The handler intercepts requests, extracts the file path, and fetches the resource using the net module.

```javascript
const { app, protocol, net } = require('electron')
  
const path = require('node:path')
const url = require('node:url')
  
app.whenReady().then(() => {
  protocol.handle('atom', (request) => {
    const filePath = request.url.slice('atom://'.length)
    return net.fetch(url.pathToFileURL(path.join(__dirname, filePath)).toString())
  })
})
```

--------------------------------

### Execute JavaScript in a Frame on Navigation

Source: https://www.electronjs.org/docs/latest/api/web-frame-main

This snippet demonstrates how to use `webFrameMain.fromId` to get a frame reference after a 'did-frame-navigate' event and then execute JavaScript within that frame. It requires the `BrowserWindow` and `webFrameMain` modules from Electron.

```javascript
const { BrowserWindow, webFrameMain } = require('electron')

const win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('https://twitter.com')

win.webContents.on(
  'did-frame-navigate',
  (event, url, httpResponseCode, httpStatusText, isMainFrame, frameProcessId, frameRoutingId) => {
    const frame = webFrameMain.fromId(frameProcessId, frameRoutingId)
    if (frame) {
      const code = 'document.body.innerHTML = document.body.innerHTML.replaceAll("heck", "h*ck")'
      frame.executeJavaScript(code)
    }
  }
)

```

--------------------------------

### Build Electron Application Menu using Template

Source: https://www.electronjs.org/docs/latest/tutorial/menus

Creates an application menu efficiently using the `Menu.buildFromTemplate` static helper. This approach allows defining the menu structure as a JavaScript array of objects, reducing boilerplate code.

```javascript
const menu = Menu.buildFromTemplate([
  {
    label: 'Menu',
    submenu: [
      { label: 'Hello' },
      { type: 'separator' },
      { label: 'Electron', type: 'checkbox', checked: true }
    ]
  }
])
Menu.setApplicationMenu(menu)
```

--------------------------------

### Get Window Minimum Size in Electron

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves the minimum width and height constraints of an Electron window. The `getMinimumSize` method returns an array containing two integers representing the minimum width and minimum height.

```javascript
const { BaseWindow } = require('electron')

const win = new BaseWindow()

// Set the minimum size
win.setMinimumSize(500, 350)

// Get the minimum size
const minSize = win.getMinimumSize()
console.log(minSize) // Output: [500, 350]
```

--------------------------------

### Get BrowserWindow Button Position (JavaScript)

Source: https://www.electronjs.org/docs/latest/breaking-changes

Replaces the deprecated `BrowserWindow.getTrafficLightPosition()` with `BrowserWindow.getWindowButtonPosition()`. The new method returns `null` when no custom position is set, differing from the deprecated method which returned `{ x: 0, y: 0 }`.

```javascript
// Deprecated in Electron 25
const pos = win.getTrafficLightPosition()
if (pos.x === 0 && pos.y === 0) {
  // No custom position.
}

// Replace with
const ret = win.getWindowButtonPosition()
if (ret === null) {
  // No custom position.
}
```

--------------------------------

### Get System Accent Color - macOS

Source: https://www.electronjs.org/docs/latest/api/system-preferences

Retrieves the user's current system-wide accent color preference on macOS (10.14 Mojave or newer). The color is returned as an RGBA hexadecimal string.

```javascript
import { systemPreferences } from 'electron';

const color = systemPreferences.getAccentColor(); // e.g., "aabbccdd"

if (color) {
  const red = color.substr(0, 2);
  const green = color.substr(2, 2);
  const blue = color.substr(4, 2);
  const alpha = color.substr(6, 2);

  console.log(`Accent Color (RGBA): #${red}${green}${blue}${alpha}`);
} else {
  console.log('Could not retrieve accent color or API not supported.');
}
```

--------------------------------

### Handle Second Instance with Relaunch and Exit

Source: https://www.electronjs.org/docs/latest/api/app

This snippet demonstrates how to handle a second instance of the application by relaunching the current instance with additional arguments and then exiting. It utilizes `process.argv` to capture existing arguments and append a new one. This approach is useful for ensuring consistent behavior when the app is relaunched.

```javascript
const { app } = require('electron')

app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
app.exit(0)
```

--------------------------------

### Get Window Background Color - Electron

Source: https://www.electronjs.org/docs/latest/api/browser-window

Retrieves the current background color of the window. The color is returned as a Hex string in the format '#RRGGBB'. Note that the alpha channel value is not included in the returned string.

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow();

// Assuming background color was set previously
// win.setBackgroundColor('#336699');

const backgroundColor = win.getBackgroundColor();
console.log(backgroundColor); // e.g., '#336699'
```

--------------------------------

### Create Modal BrowserWindow in Electron

Source: https://www.electronjs.org/docs/latest/api/browser-window

This example demonstrates the creation of a modal window, which disables interaction with its parent window. This is achieved by setting both the 'parent' and 'modal' options to true in the BrowserWindow constructor. The window is shown after the 'ready-to-show' event. Requires the 'electron' module.

```javascript
const { BrowserWindow } = require('electron')

const top = new BrowserWindow()
const child = new BrowserWindow({ parent: top, modal: true, show: false })
child.loadURL('https://github.com')
child.once('ready-to-show', () => {
  child.show()
})
```

--------------------------------

### Renderer Process: Get DOM Elements for Navigation

Source: https://www.electronjs.org/docs/latest/tutorial/navigation-history

Selects DOM elements from the HTML to be used for controlling navigation and displaying history. This script is intended to be the entry point for renderer-side logic, interacting with the `electronAPI` exposed by the preload script.

```javascript
const backBtn = document.getElementById('backBtn')
const forwardBtn = document.getElementById('forwardBtn')
const backHistoryBtn = document.getElementById('backHistoryBtn')
const forwardHistoryBtn = document.getElementById('forwardHistoryBtn')
const urlInput = document.getElementById('urlInput')
```

--------------------------------

### Sign and Notarize macOS Apps with Electron Packager

Source: https://www.electronjs.org/docs/latest/tutorial/code-signing

This snippet demonstrates how to configure Electron Packager to sign and notarize macOS applications. It requires specifying the application directory and providing Apple ID credentials for notarization. Ensure you have valid signing certificates installed.

```javascript
const packager = require('@electron/packager')

packager({
  dir: '/path/to/my/app',
  osxSign: {},
  osxNotarize: {
    appleId: 'felix@felix.fun',
    appleIdPassword: 'my-apple-id-password'
  }
})
```

--------------------------------

### Access Frames and Filter by URL

Source: https://www.electronjs.org/docs/latest/api/web-frame-main

This example shows how to access all frames within a WebContents' main frame using `win.webContents.mainFrame.frames`. It then filters these frames to find YouTube embeds by checking their URLs. It requires the `BrowserWindow` module.

```javascript
const { BrowserWindow } = require('electron')

async function main () {
  const win = new BrowserWindow({ width: 800, height: 600 })
  await win.loadURL('https://reddit.com')

  const youtubeEmbeds = win.webContents.mainFrame.frames.filter((frame) => {
    try {
      const url = new URL(frame.url)
      return url.host === 'www.youtube.com'
    } catch {
      return false
    }
  })

  console.log(youtubeEmbeds)
}

main()

```

--------------------------------

### Register Custom Protocol Handler

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Registers the Electron application to handle a specific custom URL protocol (e.g., 'electron-fiddle://'). This involves checking for default app execution and setting the protocol client appropriately. This is crucial for deep linking.

```javascript
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('electron-fiddle')
}
```

--------------------------------

### HTML Structure for Renderer with Version Display (HTML)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

This HTML file sets up the basic structure for the Electron renderer. It includes a paragraph element with the ID 'info' where the application's version information will be displayed by the `renderer.js` script. Content security policy is also configured.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <meta
      http-equiv="X-Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <title>Hello from Electron renderer!</title>
  </head>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
    <p id="info"></p>
  </body>
  <script src="./renderer.js"></script>
</html>
```

--------------------------------

### Get GPU Information (Electron)

Source: https://www.electronjs.org/docs/latest/api/app

Retrieves basic or complete GPU information from the system. The 'complete' option provides all details similar to chrome://gpu, while 'basic' offers a subset of essential attributes like vendorId and deviceId. Prefer 'basic' for minimal data needs.

```javascript
const {app} = require('electron');

// Get basic GPU info
app.getGPUInfo('basic').then(info => {
  console.log(info);
});

// Get complete GPU info
app.getGPUInfo('complete').then(info => {
  console.log(info);
});
```

--------------------------------

### Main Process: Handle Navigation Events and Controls

Source: https://www.electronjs.org/docs/latest/tutorial/navigation-history

Sets up a BrowserWindow with a BrowserView and handles IPC (Inter-Process Communication) for navigation. It exposes functions to control navigation (back, forward), check navigation status, load URLs, get the current URL, and retrieve history entries. It also sends updates to the renderer when navigation occurs.

```javascript
const { app, BrowserWindow, BrowserView, ipcMain } = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.loadFile('index.html')

  const view = new BrowserView()
  mainWindow.setBrowserView(view)
  view.setBounds({ x: 0, y: 100, width: 1000, height: 800 })
  view.setAutoResize({ width: true, height: true })

  const navigationHistory = view.webContents.navigationHistory
  ipcMain.handle('nav:back', () =>
    navigationHistory.goBack()
  )

  ipcMain.handle('nav:forward', () => {
    navigationHistory.goForward()
  })

  ipcMain.handle('nav:canGoBack', () => navigationHistory.canGoBack())
  ipcMain.handle('nav:canGoForward', () => navigationHistory.canGoForward())
  ipcMain.handle('nav:loadURL', (_, url) =>
    view.webContents.loadURL(url)
  )
  ipcMain.handle('nav:getCurrentURL', () => view.webContents.getURL())
  ipcMain.handle('nav:getHistory', () => {
    return navigationHistory.getAllEntries()
  })

  view.webContents.on('did-navigate', () => {
    mainWindow.webContents.send('nav:updated')
  })

  view.webContents.on('did-navigate-in-page', () => {
    mainWindow.webContents.send('nav:updated')
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
```

--------------------------------

### Remove Switch from Electron CommandLine

Source: https://www.electronjs.org/docs/latest/api/command-line

Provides an example of removing a specified switch from Chromium's command line in an Electron application. This operation does not impact process.argv and is intended for controlling Chromium's behavior.

```javascript
const { app } = require('electron')

app.commandLine.appendSwitch('remote-debugging-port', '8315')
console.log(app.commandLine.hasSwitch('remote-debugging-port')) // true

app.commandLine.removeSwitch('remote-debugging-port')
console.log(app.commandLine.hasSwitch('remote-debugging-port')) // false
```

--------------------------------

### Handle Application Window Close Event in Electron Main Process

Source: https://www.electronjs.org/docs/latest/tutorial/process-model

Illustrates how to manage the application's lifecycle by quitting the app when all windows are closed on non-macOS platforms. This uses the 'window-all-closed' event from the app module to ensure proper application termination.

```javascript
// quitting the app when no windows are open on non-macOS platforms  
app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') app.quit()  
})  
```

--------------------------------

### Get Window Bounds in Electron

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves the current dimensions and position of an Electron window. The `getBounds` method returns an object containing `x`, `y`, `width`, and `height`. On macOS, the returned `y` coordinate will be at least the tray height.

```javascript
const { BaseWindow } = require('electron')

const win = new BaseWindow()

// Example: Set bounds and then get them
win.setBounds({ x: 10, y: 20, width: 500, height: 400 })
const bounds = win.getBounds()
console.log(bounds) // Output: { x: 10, y: 20, width: 500, height: 400 } (or adjusted y on macOS)
```

--------------------------------

### Print to PDF using webContents.printToPDF() (Electron)

Source: https://www.electronjs.org/docs/latest/breaking-changes

Shows how to use the `webContents.printToPDF()` method in the Electron main process to generate a PDF file. This example includes various options for customization such as page size, margins, scale, header/footer templates, and page ranges. It handles the promise returned by `printToPDF` to write the data to a file.

```javascript
// Main process  
const { webContents } = require('electron')  
  
webContents.printToPDF({
  landscape: true,
  displayHeaderFooter: true,
  printBackground: true,
  scale: 2,
  pageSize: 'Ledger',
  margins: {
    top: 2,
    bottom: 2,
    left: 2,
    right: 2
  },
  pageRanges: '1-5, 8, 11-13',
  headerTemplate: '<h1>Title</h1>',
  footerTemplate: '<div><span class="pageNumber"></span></div>',
  preferCSSPageSize: true
}).then(data => {
  fs.writeFile(pdfPath, data, (error) => {
    if (error) throw error
    console.log(`Wrote PDF successfully to ${pdfPath}`)
  })
}).catch(error => {
  console.log(`Failed to write PDF to ${pdfPath}: `, error)
})
```

--------------------------------

### Generate Electron Release Build Config (Linux/macOS)

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

Generates the build configuration for a release build of Electron on Linux and macOS using GN. It targets the 'out/Release' directory and imports release-specific build arguments.

```bash
gn gen out/Release --args="import(\"//electron/build/args/release.gn\")"  
```

--------------------------------

### Main Process IPC Listener (Electron)

Source: https://www.electronjs.org/docs/latest/tutorial/ipc

Sets up an IPC channel listener in the Electron main process to receive messages and update the BrowserWindow title. It utilizes `ipcMain.on` to listen for the 'set-title' event and `BrowserWindow.fromWebContents` to get the target window. Requires Electron's main and BrowserWindow modules.

```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')  
const path = require('node:path')  
  
function handleSetTitle (event, title) {  
  const webContents = event.sender  
  const win = BrowserWindow.fromWebContents(webContents)  
  win.setTitle(title)  
}  
  
function createWindow () {  
  const mainWindow = new BrowserWindow({  
    webPreferences: {  
      preload: path.join(__dirname, 'preload.js')  
    }  
  })  
  
  mainWindow.loadFile('index.html')  
}

app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

--------------------------------

### HTML Structure for Web Serial API

Source: https://www.electronjs.org/docs/latest/tutorial/devices

This HTML file sets up the basic structure for a web page that interacts with the Web Serial API. It includes a title, meta tags for character set and content security policy, a heading, a button to trigger the serial port test, and a paragraph to display device information. It also links to the `renderer.js` script for client-side functionality.

```html
<!DOCTYPE html>  
<html>  
  <head>  
    <meta charset="UTF-8">  
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">  
    <title>Web Serial API</title>  
  <body>  
    <h1>Web Serial API</h1>  
  
    <button id="clickme">Test Web Serial API</button>  
  
    <p>Matching Arduino Uno device: <strong id="device-name""></strong></p>  
  
    <script src="./renderer.js"></script>  
  </body>  
</html>  
```

--------------------------------

### Electron Renderer Process: Exposing IPC to Main World

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Exposes IPC functionality from the 'electron/renderer' module to the main world of the web page. This allows the renderer process to send messages to the main process, specifically for triggering the 'shell:open' IPC event.

```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')  
  
contextBridge.exposeInMainWorld('shell', {  
  open: () => ipcRenderer.send('shell:open')  
})  

```

--------------------------------

### Access Security-Scoped Resources in Electron (macOS)

Source: https://www.electronjs.org/docs/latest/api/app

Demonstrates how to start and stop accessing security-scoped resources using `app.startAccessingSecurityScopedResource` and a returned function. This is crucial for Mac App Store apps needing to access user-selected files outside their sandbox. It involves obtaining bookmark data from dialogs, using it to access files, and then releasing the resource to prevent kernel leaks.

```javascript
const { app, dialog } = require('electron')

const fs = require('node:fs')

let filepath
let bookmark

dialog.showOpenDialog(null, { securityScopedBookmarks: true }).then(({ filePaths, bookmarks }) => {
  filepath = filePaths[0]
  bookmark = bookmarks[0]
  fs.readFileSync(filepath)
})

// ... restart app ...

const stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(bookmark)
fs.readFileSync(filepath)
stopAccessingSecurityScopedResource()
```

--------------------------------

### Create a BaseWindow with Multiple WebViews (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/base-window

Demonstrates creating a BaseWindow and adding multiple WebContentsView instances to it. Each view can load a separate URL and has its bounds explicitly set. This is useful for creating complex window layouts.

```javascript
const { BaseWindow, WebContentsView } = require('electron')

const win = new BaseWindow({ width: 800, height: 600 })

const leftView = new WebContentsView()
leftView.webContents.loadURL('https://electronjs.org')
win.contentView.addChildView(leftView)

const rightView = new WebContentsView()
rightView.webContents.loadURL('https://github.com/electron/electron')
win.contentView.addChildView(rightView)

leftView.setBounds({ x: 0, y: 0, width: 400, height: 600 })
rightView.setBounds({ x: 400, y: 0, width: 400, height: 600 })

```

--------------------------------

### Create HTTP Request with ClientRequest in Electron

Source: https://www.electronjs.org/docs/latest/api/client-request

Example demonstrating how to create an HTTP request using the net.request method, which returns a ClientRequest instance. This is useful for making outbound network requests within an Electron application. The options object specifies the request method, protocol, hostname, port, and path.

```javascript
const request = net.request({
  method: 'GET',
  protocol: 'https:',
  hostname: 'github.com',
  port: 443,
  path: '/'
})
```

--------------------------------

### Set Interval for Checking Updates

Source: https://www.electronjs.org/docs/latest/tutorial/updates

Schedules regular checks for application updates using setInterval. This example checks for updates every minute (60000 milliseconds). Adjust the interval based on your application's update frequency needs.

```javascript
setInterval(() => {
  autoUpdater.checkForUpdates()
}, 60000)  
```

--------------------------------

### Node-API Swift Addon Instance Methods (Objective-C++)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

Implements instance methods for a Node-API Swift addon using Objective-C++. It defines 'helloWorld', 'helloGui', and 'on' methods to interact with Swift code and manage callbacks. This includes handling JavaScript arguments, calling Swift functions, and setting up event listeners.

```objective-c++
#import <Foundation/Foundation>
#import "SwiftBridge.h"
#include <napi.h>

class SwiftAddon : public Napi::ObjectWrap<SwiftAddon> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        Napi::Function func = DefineClass(env, "SwiftAddon", {
            InstanceMethod("helloWorld", &SwiftAddon::HelloWorld),
            InstanceMethod("helloGui", &SwiftAddon::HelloGui),
            InstanceMethod("on", &SwiftAddon::On)
        });

        Napi::FunctionReference* constructor = new Napi::FunctionReference();
        *constructor = Napi::Persistent(func);
        env.SetInstanceData(constructor);

        exports.Set("SwiftAddon", func);
        return exports;
    }

    struct CallbackData {
        std::string eventType;
        std::string payload;
        SwiftAddon* addon;
    };

    SwiftAddon(const Napi::CallbackInfo& info)
        : Napi::ObjectWrap<SwiftAddon>(info)
        , env_(info.Env())
        , emitter(Napi::Persistent(Napi::Object::New(info.Env())))
        , callbacks(Napi::Persistent(Napi::Object::New(info.Env())))
        , tsfn_(nullptr) {

        napi_status status = napi_create_threadsafe_function(
            env_,
            nullptr,
            nullptr,
            Napi::String::New(env_, "SwiftCallback"),
            0,
            1,
            nullptr,
            nullptr,
            this,
            [](napi_env env, napi_value js_callback, void* context, void* data) {
                auto* callbackData = static_cast<CallbackData*>(data);
                if (!callbackData) return;

                Napi::Env napi_env(env);
                Napi::HandleScope scope(napi_env);

                auto addon = static_cast<SwiftAddon*>(context);
                if (!addon) {
                    delete callbackData;
                    return;
                }

                try {
                    auto callback = addon->callbacks.Value().Get(callbackData->eventType).As<Napi::Function>();
                    if (callback.IsFunction()) {
                        callback.Call(addon->emitter.Value(), {Napi::String::New(napi_env, callbackData->payload)});
                    }
                } catch (...) {}

                delete callbackData;
            },
            &tsfn_
        );

        if (status != napi_ok) {

```

```objective-c++
// Previous code...

private:  
    Napi::Env env_;  
    Napi::ObjectReference emitter;  
    Napi::ObjectReference callbacks;  
    napi_threadsafe_function tsfn_;  

    Napi::Value HelloWorld(const Napi::CallbackInfo& info) {  
        Napi::Env env = info.Env();  

        if (info.Length() < 1 || !info[0].IsString()) {  
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();  
            return env.Null();  
        }  

        std::string input = info[0].As<Napi::String>();  
        NSString* nsInput = [NSString stringWithUTF8String:input.c_str()];  
        NSString* result = [SwiftBridge helloWorld:nsInput];  

        return Napi::String::New(env, [result UTF8String]);  
    }  

    void HelloGui(const Napi::CallbackInfo& info) {  
        [SwiftBridge helloGui];  
    }  

    Napi::Value On(const Napi::CallbackInfo& info) {  
        Napi::Env env = info.Env();  

        if (info.Length() < 2 || !info[0].IsString() || !info[1].IsFunction()) {  
            Napi::TypeError::New(env, "Expected (string, function) arguments").ThrowAsJavaScriptException();  
            return env.Undefined();  
        }

        callbacks.Value().Set(info[0].As<Napi::String>(), info[1].As<Napi::Function>());  
        return env.Undefined();  
    }
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    return SwiftAddon::Init(env, exports);
}

NODE_API_MODULE(swift_addon, Init)

```

--------------------------------

### Access Spell Checker Dictionary Words

Source: https://www.electronjs.org/docs/latest/api/session

Get all words currently stored in the application's custom spell checker dictionary. This operation is asynchronous and resolves with an array of strings once the dictionary is loaded from disk.

```javascript
const { session } = require('electron')

async function listCustomDictionaryWords() {
  try {
    const words = await session.defaultSession.listWordsInSpellCheckerDictionary()
    console.log('Words in dictionary:', words)
  } catch (error) {
    console.error('Failed to list words:', error)
  }
}

listCustomDictionaryWords()
```

--------------------------------

### Secure Content Loading (HTTPS vs HTTP)

Source: https://www.electronjs.org/docs/latest/tutorial/security

Ensures that all remote resources are loaded using secure protocols like HTTPS instead of insecure protocols like HTTP. This protects data integrity and encrypts traffic. Both main process (browserWindow.loadURL) and renderer process (script/link tags) examples are provided.

```javascript
// Bad
browserWindow.loadURL('http://example.com')

// Good
browserWindow.loadURL('https://example.com')
```

```html
<!-- Bad -->
<script crossorigin src="http://example.com/react.js"></script>
<link rel="stylesheet" href="http://example.com/style.css">

<!-- Good -->
<script crossorigin src="https://example.com/react.js"></script>
<link rel="stylesheet" href="https://example.com/style.css">
```

--------------------------------

### Use C++ Addon in Electron Application (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

This example demonstrates how to import and utilize the previously built C++ addon within an Electron application's main or renderer process. It shows how to call methods like `helloWorld` and `helloGui`, and how to subscribe to events such as `todoAdded`, `todoUpdated`, and `todoDeleted` emitted from the native code. The event handlers also show the transformed data, including the JavaScript `Date` objects.

```javascript
// In your Electron main process or renderer process  
import cppLinux from 'cpp-linux'  

// Test the basic functionality  
console.log(cppLinux.helloWorld('Hi!'))  
// Output: "Hello from C++! You said: Hi!"  

// Set up event listeners for GTK GUI interactions  
cppLinux.on('todoAdded', (todo) => {  
  console.log('New todo added:', todo)
  // todo: { id: "uuid-string", text: "Todo text", date: Date object }
})

cppLinux.on('todoUpdated', (todo) => {  
  console.log('Todo updated:', todo)
})

cppLinux.on('todoDeleted', (todo) => {  
  console.log('Todo deleted:', todo)
})

// Launch the native GTK GUI  cppLinux.helloGui()
```

--------------------------------

### Node.js Addon Skeleton Initialization

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

This C++ code sets up the basic structure for a Node.js addon using the node-addon-api. It includes the necessary headers and defines the Init function, which is called when the addon is loaded. This serves as the entry point for registering addon functionality with Node.js.

```cpp
#include <napi.h>
#include <string>
#include "cpp_code.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // We'll add code here later
    return exports;
}

NODE_API_MODULE(cpp_addon, Init)

```

--------------------------------

### Electron Extensions API - Get Specific Extension

Source: https://www.electronjs.org/docs/latest/api/extensions-api

Retrieves a specific loaded extension by its unique ID. If an extension with the provided ID is found, it is returned; otherwise, `null` is returned. This method requires the `app` module to be ready before it can be called.

```javascript
const extensionId = 'some-extension-id'
const extension = session.defaultSession.extensions.getExtension(extensionId)

if (extension) {
  console.log(`Found extension: ${extension.name}`)
} else {
  console.log('Extension not found.')
}
```

--------------------------------

### Run Packaged Electron Executable

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

After building, this command executes the compiled Electron application. The path to the executable varies slightly depending on the operating system (macOS, Windows, Linux).

```shell
# or, on Windows
$ ./out/Testing/electron.exe
# or, on Linux
$ ./out/Testing/electron
```

--------------------------------

### Printing Stack Traces in C++

Source: https://www.electronjs.org/docs/latest/development/debugging

A helper function from Chromium's base library to print stack traces to the console without halting program execution. This is useful for observing call chains and identifying potential problem areas in the code.

```cpp
#include "base/debug/stack_trace.h"
...
base::debug::StackTrace().Print();
```

--------------------------------

### BrowserView Instance Methods

Source: https://www.electronjs.org/docs/latest/api/browser-view

Methods available on BrowserView instances.

```APIDOC
## BrowserView Instance Methods

### Description
Methods for interacting with `BrowserView` instances.

### `setAutoResize(options)`
#### Description
Standardizes auto-resizing behavior across all platforms. This method is experimental and deprecated.

#### Parameters
- **options** (Object)
  - **width** (boolean) - Optional. If `true`, the view's width will grow and shrink with the window. *Default: `false`*
  - **height** (boolean) - Optional. If `true`, the view's height will grow and shrink with the window. *Default: `false`*
  - **horizontal** (boolean) - Optional. If `true`, the view's x position and width will grow and shrink proportionally with the window. *Default: `false`*
  - **vertical** (boolean) - Optional. If `true`, the view's y position and height will grow and shrink proportionally with the window. *Default: `false`*

### `setBounds(bounds)`
#### Description
Resizes and moves the view to the supplied bounds relative to the window. This method is experimental and deprecated.

#### Parameters
- **bounds** (Rectangle)
  - An object representing the desired bounds of the view.

### `getBounds()`
#### Description
Returns the current bounds of the BrowserView instance. This method is experimental and deprecated.

#### Returns
- **Rectangle**: An object representing the bounds of the view.

### `setBackgroundColor(color)`
#### Description
Sets the background color of the BrowserView. This method is experimental and deprecated.

#### Parameters
- **color** (string) - The color to set. Can be in Hex, RGB, ARGB, HSL, HSLA, or named CSS color format. The alpha channel is optional for hex.

Examples of valid `color` values:
  - Hex: `#fff`, `#ffff` (ARGB), `#ffffff`, `#ffffffff` (AARRGGBB)
  - RGB: `rgb(255, 255, 255)`
  - RGBA: `rgba(255, 255, 255, 1.0)`
  - HSL: `hsl(200, 20%, 50%)`
  - HSLA: `hsla(200, 20%, 50%, 0.5)`
  - Color name: e.g., `blueviolet` or `red`

**Note**: Hex format with alpha uses `AARRGGBB` or `ARGB`, not `RRGGBBAA` or `RGB`.
```

--------------------------------

### Simplify WebContents Page Capture in Electron

Source: https://www.electronjs.org/docs/latest/breaking-changes

This code shows the removal of `webContents.incrementCapturerCount()` and `webContents.decrementCapturerCount()`. The page capture process is now automatically managed by `webContents.capturePage()`, simplifying the workflow. This change affects Electron versions starting from 23.

```javascript
const w = new BrowserWindow({ show: false })

// Removed in Electron 23
w.webContents.incrementCapturerCount()
w.capturePage().then(image => {
  console.log(image.toDataURL())
  w.webContents.decrementCapturerCount()
})

// Replace with
w.capturePage().then(image => {
  console.log(image.toDataURL())
})
```

--------------------------------

### Configure Electron Project Build with GN (`filenames.gni`)

Source: https://www.electronjs.org/docs/latest/development/creating-api

This snippet shows how to add C++ source and header files for a new Electron API module to the build configuration using GN (Generate Ninja). It includes platform-specific file lists for Windows, macOS, and Linux, which are optional.

```gn
lib_sources = [
    "path/to/api/api_name.cc",
    "path/to/api/api_name.h",
]

lib_sources_mac = [
    "path/to/api/api_name_mac.h",
    "path/to/api/api_name_mac.mm",
]

lib_sources_win = [
    "path/to/api/api_name_win.cc",
    "path/to/api/api_name_win.h",
]

lib_sources_linux = [
    "path/to/api/api_name_linux.cc",
    "path/to/api/api_name_linux.h",
]
```

--------------------------------

### Override Window Menu with Custom Menu in ElectronJS (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/application-menu

This code snippet demonstrates how to override the default application menu for a specific BrowserWindow instance on Linux or Windows. It requires the 'electron/main' module and utilizes `Menu.buildFromTemplate` to define the custom menu structure. The `win.setMenu` method applies this custom menu to the window. Dependencies include Electron's main module.

```javascript
const { BrowserWindow, Menu } = require('electron/main')  
  
const win = new BrowserWindow()
const menu = Menu.buildFromTemplate([
  {
    label: 'my custom menu',
    submenu: [
      { role: 'copy' },
      { role: 'paste' }
    ]
  }
])
win.setMenu(menu)
```

--------------------------------

### Set and Get Window Title

Source: https://www.electronjs.org/docs/latest/api/base-window

Change or retrieve the title of the native window. `setTitle` accepts a string, and `getTitle` returns the current title. Note that the native window title may differ from the web page title.

```javascript
win.setTitle('My Electron App')
const title = win.getTitle()
```

--------------------------------

### Get Content Bounds in Electron

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves the current bounds of an Electron window's client area (e.g., the web page). The `getContentBounds` method returns a `Rectangle` object detailing the `x`, `y`, `width`, and `height` of the client area.

```javascript
const { BaseWindow } = require('electron')

const win = new BaseWindow()

// Set content bounds first for demonstration
win.setContentBounds({ x: 100, y: 100, width: 700, height: 500 })

// Get the client area bounds
const contentBounds = win.getContentBounds()
console.log(contentBounds) // Output: { x: 100, y: 100, width: 700, height: 500 }
```

--------------------------------

### Electron Extensions API - Get All Extensions

Source: https://www.electronjs.org/docs/latest/api/extensions-api

Retrieves a list of all currently loaded extensions within the Electron application's default session. This method can only be called after the `app` module's `ready` event has been emitted. It returns an array of `Extension` objects.

```javascript
const extensions = session.defaultSession.extensions.getAllExtensions()
console.log(extensions)
```

--------------------------------

### Create Tray and BrowserWindow Icons using NativeImage (Main Process)

Source: https://www.electronjs.org/docs/latest/api/native-image

Shows how to create NativeImage instances from file paths using `nativeImage.createFromPath` and then use these instances when creating Tray or BrowserWindow objects. This allows for more control over image manipulation before assignment.

```javascript
const { BrowserWindow, nativeImage, Tray } = require('electron')  
  
const trayIcon = nativeImage.createFromPath('/Users/somebody/images/icon.png')  
const appIcon = nativeImage.createFromPath('/Users/somebody/images/window.png')  
const tray = new Tray(trayIcon)  
const win = new BrowserWindow({ icon: appIcon })  

```

--------------------------------

### BrowserWindow Configuration Options

Source: https://www.electronjs.org/docs/latest/api/structures/browser-window-options

This section lists and describes the various configuration options that can be passed when creating a new BrowserWindow instance in Electron.js.

```APIDOC
## BrowserWindow Configuration Options

### Description
Configuration options for the BrowserWindow constructor.

### Method
`new BrowserWindow(options)`

### Parameters
#### General Options
- **`defaultMonospaceFontSize`** (Integer, optional) - Defaults to `13`.
- **`minimumFontSize`** (Integer, optional) - Defaults to `0`.
- **`defaultEncoding`** (string, optional) - Defaults to `ISO-8859-1`.
- **`backgroundThrottling`** (boolean, optional) - Whether to throttle animations and timers when the page becomes background. Defaults to `true`.
- **`contextIsolation`** (boolean, optional) - Whether to run Electron APIs and the specified `preload` script in a separate JavaScript context. Defaults to `true`.
- **`webviewTag`** (boolean, optional) - Whether to enable the `<webview>` tag. Defaults to `false`.
- **`additionalArguments`** (string[], optional) - A list of strings that will be appended to `process.argv` in the renderer process.
- **`safeDialogs`** (boolean, optional) - Whether to enable browser style consecutive dialog protection. Default is `false`.
- **`safeDialogsMessage`** (string, optional) - The message to display when consecutive dialog protection is triggered.
- **`disableDialogs`** (boolean, optional) - Whether to disable dialogs completely. Overrides `safeDialogs`. Default is `false`.
- **`navigateOnDragDrop`** (boolean, optional) - Whether dragging and dropping a file or link onto the page causes a navigation. Default is `false`.
- **`autoplayPolicy`** (string, optional) - Autoplay policy to apply to content in the window. Defaults to `no-user-gesture-required`.
- **`disableHtmlFullscreenWindowResize`** (boolean, optional) - Whether to prevent the window from resizing when entering HTML Fullscreen. Default is `false`.
- **`accessibleTitle`** (string, optional) - An alternative title string provided only to accessibility tools.
- **`spellcheck`** (boolean, optional) - Whether to enable the builtin spellchecker. Default is `true`.
- **`enableWebSQL`** (boolean, optional) - Whether to enable the WebSQL api. Default is `true`.

#### Offscreen Rendering Options
- **`offscreen`** (Object | boolean, optional) - Whether to enable offscreen rendering. Defaults to `false`.
  - **`useSharedTexture`** (boolean, optional) _Experimental_ - Whether to use GPU shared texture for accelerated paint event. Defaults to `false`.
  - **`sharedTexturePixelFormat`** (string, optional) _Experimental_ - The requested output format of the shared texture. Defaults to `argb`.
    - `argb` - 8-bit unorm RGBA, SRGB SDR color space.
    - `rgbaf16` - 16-bit float RGBA, scRGB HDR color space.

#### V8 Cache Options
- **`v8CacheOptions`** (string, optional) - Enforces the v8 code caching policy.
  - `none` - Disables code caching.
  - `code` - Heuristic based code caching.
  - `bypassHeatCheck` - Bypass code caching heuristics but with lazy compilation.

### Request Example
```javascript
const { BrowserWindow } = require('electron')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      defaultEncoding: 'utf-8',
      contextIsolation: true,
      offscreen: true,
      v8CacheOptions: 'code'
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
```

### Response
No direct response for constructor. Window object is returned.

#### Success Response (Window Object)
- **`BrowserWindow`** (Object) - The created BrowserWindow instance.

#### Response Example
```javascript
// win is an instance of BrowserWindow
console.log(win)
```
```

--------------------------------

### Workaround for Libraries with Node.js Symbols in Electron (HTML/JavaScript)

Source: https://www.electronjs.org/docs/latest/faq

This example shows a method to use libraries that conflict with Electron's Node.js integration by renaming global symbols before including the library. It involves aliasing 'require' and deleting 'exports' and 'module' before loading external scripts.

```html
<head>
<script>
window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;
</script>
<script type="text/javascript" src="jquery.js"></script>
</head>
```

--------------------------------

### Get Content Size in Electron

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves the current width and height of the client area (e.g., the web page) of an Electron window. The `getContentSize` method returns an array containing two integers: the width and the height of the content area.

```javascript
const { BaseWindow } = require('electron')

const win = new BaseWindow()

// Set the content size
win.setContentSize(1024, 768)

// Get the content size
const contentSize = win.getContentSize()
console.log(contentSize) // Output: [1024, 768]
```

--------------------------------

### Implement Electron API Class in C++ Source (`api_name.cc`)

Source: https://www.electronjs.org/docs/latest/development/creating-api

This C++ source file implements the `ApiName` class, providing the necessary definitions for `kWrapperInfo`, `GetObjectTemplateBuilder`, `GetTypeName`, and the static `Create` method. It also includes an `Initialize` function to expose the API to Node.js/V8.

```cpp
#include "shell/browser/api/electron_api_safe_storage.h"

#include "shell/browser/browser.h"
#include "shell/common/gin_converters/base_converter.h"
#include "shell/common/gin_converters/callback_converter.h"
#include "shell/common/gin_helper/dictionary.h"
#include "shell/common/gin_helper/object_template_builder.h"
#include "shell/common/node_includes.h"
#include "shell/common/platform_util.h"

native namesspace electron {

native namesspace api {

gin::DeprecatedWrapperInfo ApiName::kWrapperInfo = {gin::kEmbedderNativeGin};

gin::ObjectTemplateBuilder ApiName::GetObjectTemplateBuilder(
    v8::Isolate* isolate) {
  return gin::ObjectTemplateBuilder(isolate)
      .SetMethod("methodName", &ApiName::methodName);
}

const char* ApiName::GetTypeName() {
  return "ApiName";
}

// static
gin::Handle<ApiName> ApiName::Create(v8::Isolate* isolate) {
  return gin::CreateHandle(isolate, new ApiName());
}

} // namespace api

} // namespace electron

native namesspace {

void Initialize(v8::Local<v8::Object> exports,
                v8::Local<v8::Value> unused,
                v8::Local<v8::Context> context,
                void* priv) {
  v8::Isolate* const isolate = v8::Isolate::GetCurrent();
  gin_helper::Dictionary dict(isolate, exports);
  dict.Set("apiName", electron::api::ApiName::Create(isolate));
}

} // namespace

```

--------------------------------

### Custom Window Controls with Overlay (Electron)

Source: https://www.electronjs.org/docs/latest/tutorial/custom-title-bar

This example shows how to enable and customize the Window Controls Overlay API in Electron. By setting the `titleBarOverlay` option in the BrowserWindow constructor, you can allow web apps to customize their title bar. This snippet configures the color, symbol color, and height of the overlay.

```javascript
const { BrowserWindow } = require('electron')  

const win = new BrowserWindow({
  titleBarStyle: 'hidden',
  titleBarOverlay: {
    color: '#2f3241',
    symbolColor: '#74b1be',
    height: 60
  }
})
```

--------------------------------

### Control New Window Creation in Electron

Source: https://www.electronjs.org/docs/latest/tutorial/security

This example demonstrates how to limit the creation of new windows or renderer processes in an Electron application using the `setWindowOpenHandler` method. It allows for custom logic to determine whether a new window should be opened, optionally directing the URL to the default external browser if deemed safe. This prevents attackers from exploiting new window creation to gain privileges or open unauthorized content.

```javascript
const { app, shell } = require('electron')

app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // In this example, we'll ask the operating system
    // to open this event's url in the default browser.
    //
    // See the following item for considerations regarding what
    // URLs should be allowed through to shell.openExternal.
    if (isSafeForExternalOpen(url)) {
      setImmediate(() => {
        shell.openExternal(url)
      })
    }

    return { action: 'deny' }
  })
})
```

--------------------------------

### C++ Addon Initialization and Method Exposure (Node-API)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

This C++ code initializes a Node-API addon named 'CppWin32Addon'. It defines and exposes instance methods like 'helloWorld', 'helloGui', and 'on' to be callable from JavaScript. It also sets up a mechanism for asynchronous callbacks from C++ to JavaScript using thread-safe functions.

```cpp
#include <napi.>
#include <string>
#include "cpp_code.h"

class CppAddon : public Napi::ObjectWrap<CppAddon> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        Napi::Function func = DefineClass(env, "CppWin32Addon", {
            InstanceMethod("helloWorld", &CppAddon::HelloWorld),
            InstanceMethod("helloGui", &CppAddon::HelloGui),
            InstanceMethod("on", &CppAddon::On)
        });

        Napi::FunctionReference* constructor = new Napi::FunctionReference();
        *constructor = Napi::Persistent(func);
        env.SetInstanceData(constructor);

        exports.Set("CppWin32Addon", func);
        return exports;
    }

    struct CallbackData {
        std::string eventType;
        std::string payload;
        CppAddon* addon;
    };

    CppAddon(const Napi::CallbackInfo& info)
        : Napi::ObjectWrap<CppAddon>(info)
        , env_(info.Env())
        , emitter(Napi::Persistent(Napi::Object::New(info.Env())))
        , callbacks(Napi::Persistent(Napi::Object::New(info.Env())))
        , tsfn_(nullptr) {

        napi_status status = napi_create_threadsafe_function(
            env_,
            nullptr,
            nullptr,
            Napi::String::New(env_, "CppCallback"),
            0,
            1,
            nullptr,
            nullptr,
            this,
            [](napi_env env, napi_value js_callback, void* context, void* data) {
                auto* callbackData = static_cast<CallbackData*>(data);
                if (!callbackData) return;

                Napi::Env napi_env(env);
                Napi::HandleScope scope(napi_env);

                auto addon = static_cast<CppAddon*>(context);
                if (!addon) {
                    delete callbackData;
                    return;
                }

                try {
                    auto callback = addon->callbacks.Value().Get(callbackData->eventType).As<Napi::Function>();
                    if (callback.IsFunction()) {
                        callback.Call(addon->emitter.Value(), {Napi::String::New(napi_env, callbackData->payload)});
                    }
                } catch (...) {}

                delete callbackData;
            },
            &tsfn_
        );

        if (status != napi_ok) {
            Napi::Error::New(env_, "Failed to create threadsafe function").ThrowAsJavaScriptException();
            return;
        }

        auto makeCallback = [this](const std::string& eventType) {
            return [this, eventType](const std::string& payload) {
                if (tsfn_ != nullptr) {
                    auto* data = new CallbackData{
                        eventType,
                        payload,
                        this
                    };
                    napi_call_threadsafe_function(tsfn_, data, napi_tsfn_blocking);
                }
            };
        };

        cpp_code::setTodoAddedCallback(makeCallback("todoAdded"));
    }

    ~CppAddon() {
        if (tsfn_ != nullptr) {
            napi_release_threadsafe_function(tsfn_, napi_tsfn_release);
            tsfn_ = nullptr;
        }
    }

private:
    Napi::Env env_;
    Napi::ObjectReference emitter;
    Napi::ObjectReference callbacks;
    napi_threadsafe_function tsfn_;

    Napi::Value HelloWorld(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
            return env.Null();
        }

        std::string input = info[0].As<Napi::String>();
        std::string result = cpp_code::hello_world(input);

        return Napi::String::New(env, result);
    }

    void HelloGui(const Napi::CallbackInfo& info) {
        cpp_code::hello_gui();
    }

    Napi::Value On(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        if (info.Length() < 2 || !info[0].IsString() || !info[1].IsFunction()) {
            Napi::TypeError::New(env, "Expected (string, function) arguments").ThrowAsJavaScriptException();
            return env.Undefined();
        }

        callbacks.Value().Set(info[0].As<Napi::String>(), info[1].As<Napi::Function>());
        return env.Undefined();
    }
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    return CppAddon::Init(env, exports);
}

NODE_API_MODULE(cpp_addon, Init)

```

--------------------------------

### Handling <webview> Load Events with JavaScript

Source: https://www.electronjs.org/docs/latest/api/webview-tag

This JavaScript code illustrates how to interact with the <webview> tag by adding event listeners for loading states. It shows how to detect when a web page starts and stops loading within the webview, providing visual feedback to the user. This requires the webview to be present in the DOM.

```javascript
onload = () => {
  const webview = document.querySelector('webview')
  const indicator = document.querySelector('.indicator')

  const loadstart = () => {
    indicator.innerText = 'loading...'
  }

  const loadstop = () => {
    indicator.innerText = ''
  }

  webview.addEventListener('did-start-loading', loadstart)
  webview.addEventListener('did-stop-loading', loadstop)
}
```

--------------------------------

### Menu Class

Source: https://www.electronjs.org/docs/latest/api/menu

Information about the Menu class, its constructor, static methods, instance methods, events, and properties.

```APIDOC
## Menu Class

### Description
Represents an application menu or a context menu.

### Methods

#### Constructor
* `new Menu()` - Creates a new Menu.

#### Static Methods
* `Menu.setApplicationMenu(menu)` - Sets the application menu.
* `Menu.getApplicationMenu()` - Returns the application menu.
* `Menu.sendActionToFirstResponder(action)` - Sends an action to the first responder.
* `Menu.buildFromTemplate(template)` - Builds a menu from a template array.

#### Instance Methods
* `menu.popup(options)` - Shows the menu as a popup.
* `menu.closePopup()` - Closes the popup menu.
* `menu.append(item)` - Appends a `MenuItem` to the menu.
* `menu.getMenuItemById(id)` - Gets a `MenuItem` by its ID.
* `menu.insert(position, item)` - Inserts a `MenuItem` at a specific position.

#### Instance Events
* `'menu-will-show'` - Emitted when the menu is about to be shown.
* `'menu-will-close'` - Emitted when the menu is about to be closed.

#### Instance Properties
* `items` (`MenuItem[]`) - An array containing the menu's items.
```

--------------------------------

### Get System Version - Electron Process

Source: https://www.electronjs.org/docs/latest/api/process

Returns a string representing the version of the host operating system. Unlike `os.release()`, this method provides the actual OS version on macOS. The format varies depending on the operating system (e.g., '10.13.6' on macOS, '10.0.17763' on Windows, '4.15.0-45-generic' on Linux). This method is synchronous.

```javascript
const version = process.getSystemVersion();
console.log(`Operating System Version: ${version}`);
```

--------------------------------

### Get Window Background Color in Electron

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves the current background color of an Electron window. The `getBackgroundColor` method returns the color as a Hex string (e.g., '#RRGGBB'). Note that the alpha value is not included in the returned string.

```javascript
const { BaseWindow } = require('electron')

const win = new BaseWindow()

// Set the background color first
win.setBackgroundColor('#123456')

// Get the background color
const bgColor = win.getBackgroundColor()
console.log(bgColor) // Output: '#123456'
```

--------------------------------

### Basic HTML Structure for Electron Renderer (HTML)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

A minimal HTML file used to be loaded into an Electron BrowserWindow. It includes basic meta tags for character set and Content Security Policy, along with a simple heading and paragraph.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <meta
      http-equiv="X-Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <title>Hello from Electron renderer!</title>
  </head>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
  </body>
</html>
```

--------------------------------

### Set Context Menu for Tray Icon in Electron

Source: https://www.electronjs.org/docs/latest/api/tray

Demonstrates how to create and set a context menu for a tray icon using Electron's Menu and Tray modules. This example specifically highlights the need to re-set the context menu on Linux after modifying menu items.

```javascript
const { app, Menu, Tray } = require('electron')

let appIcon = null
app.whenReady().then(() => {
  appIcon = new Tray('/path/to/my/icon')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' }
  ])

  // Make a change to the context menu
  contextMenu.items[1].checked = false

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
})
```

--------------------------------

### Get System Memory Info - Electron Process

Source: https://www.electronjs.org/docs/latest/api/process

Retrieves memory usage statistics for the entire host system. This includes total and free physical memory, and platform-specific details like swap memory on Windows/Linux and purgeable/file-backed memory on macOS. All statistics are reported in Kilobytes and the method is synchronous.

```javascript
const systemMemory = process.getSystemMemoryInfo();
console.log('System Memory Info:', systemMemory);
```

--------------------------------

### Expose Node.js crypto Module with contextBridge

Source: https://www.electronjs.org/docs/latest/api/context-bridge

This example shows how to expose a specific Node.js module, `crypto`, to the renderer process using `contextBridge`. It creates a safe wrapper for the `sha256sum` function, allowing the renderer to compute SHA-256 hashes without direct access to the entire Node.js environment.

```javascript
const { contextBridge } = require('electron');
const crypto = require('node:crypto');

contextBridge.exposeInMainWorld('nodeCrypto', {
  sha256sum (data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
});
```

--------------------------------

### Dock Menu Demo HTML Structure

Source: https://www.electronjs.org/docs/latest/tutorial/macos-dock

This HTML file provides the basic structure for the Electron Dock Menu demo. It includes a title, content security policy meta tag, and a placeholder for JavaScript execution. The page content describes the functionality accessible through the Dock menu options.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Dock Menu Demo</title>
  </head>
  <body>
    <h1>Dock Menu Demo</h1>
    <ul>
      <li>Create new BrowserWindow instances via the "New Window" option</li>
      <li>Close all BrowserWindow instances via the "Close All Windows" option</li>
      <li>Read the docs via the "Show Electron Docs" option</li>
    </ul>
    <script src="./renderer.js"></script>
  </body>
</html>
```

--------------------------------

### Flip Electron Fuses with @electron/fuses Utility

Source: https://www.electronjs.org/docs/latest/tutorial/fuses

This snippet demonstrates how to use the @electron/fuses JavaScript utility to flip specific fuses in an Electron application. It requires the '@electron/fuses' package and takes the path to Electron and an object of fuses to flip as arguments. The example shows disabling the `RunAsNode` fuse.

```javascript
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses')

flipFuses(
  // Path to electron
  require('electron'),
  // Fuses to flip
  {
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false
  }
)
```

--------------------------------

### Create Tray and BrowserWindow Icons from File Paths (Main Process)

Source: https://www.electronjs.org/docs/latest/api/native-image

Demonstrates how to create a Tray icon and set a BrowserWindow's icon by directly passing file paths to the respective constructors. This is a straightforward method for assigning images.

```javascript
const { BrowserWindow, Tray } = require('electron')  
  
const tray = new Tray('/Users/somebody/images/icon.png')  
const win = new BrowserWindow({ icon: '/Users/somebody/images/window.png' })  

```

--------------------------------

### Electron Menu Template: Recent Documents Submenu (JSON)

Source: https://www.electronjs.org/docs/latest/tutorial/recent-documents

This JSON snippet defines a submenu for the application's menu template in Electron. It includes an 'Open Recent' item with a 'Clear Recent' option, utilizing built-in roles for managing recent documents.

```json
{
  "submenu":[
    {
      "label":"Open Recent",
      "role":"recentdocuments",
      "submenu":[
        {
          "label":"Clear Recent",
          "role":"clearrecentdocuments"
        }
      ]
    }
  ]
}
```

--------------------------------

### Handle Client Certificate Requests in ElectronJS

Source: https://www.electronjs.org/docs/latest/api/web-contents

This example demonstrates handling the 'select-client-certificate' event, which is triggered when a server requests a client certificate for authentication. The event provides a list of available certificates, and you must use the callback function to select and return the appropriate certificate to the server. This is essential for applications requiring mutual TLS authentication.

```javascript
win.webContents.on('select-client-certificate', (event, url, certificateList, callback) => {
  // Choose a certificate from the certificateList and call callback with it.
  // For example, to select the first certificate in the list:
  // if (certificateList.length > 0) {
  //   callback(certificateList[0])
  // }
  console.log(`Client certificate requested for ${url}`)
})
```

--------------------------------

### Get All Uploaded Reports - Electron

Source: https://www.electronjs.org/docs/latest/api/crash-reporter

Fetches an array of all uploaded crash reports. Each element in the array represents a report with its date and unique upload ID. If no reports have been uploaded, an empty array is returned. This method is exclusive to the main process.

```javascript
const allReports = crashReporter.getUploadedReports()
console.log('All uploaded reports:', allReports)

```

--------------------------------

### Show Native Dialog to Select Multiple Files (ElectronJS)

Source: https://www.electronjs.org/docs/latest/api/dialog

This snippet demonstrates how to use the `dialog.showOpenDialog` method from ElectronJS to display a native system dialog, allowing the user to select multiple files. It requires the 'electron' module and returns an array of selected file paths or undefined if canceled.

```javascript
const { dialog } = require('electron')  
  
console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))  

```

--------------------------------

### Register Stream Protocol (Deprecated)

Source: https://www.electronjs.org/docs/latest/api/protocol

Registers a custom protocol scheme that responds with a stream. This method is deprecated and has been replaced by `protocol.handle`. The handler function can return a `ReadableStream` or an object with a `data` property. Examples show how to create and return a stream, or use `fs.createReadStream`.

```javascript
const { protocol } = require('electron')
const { PassThrough } = require('node:stream')

function createStream (text) {
  const rv = new PassThrough() // PassThrough is also a Readable stream
  rv.push(text)
  rv.push(null)
  return rv
}

protocol.registerStreamProtocol('atom', (request, callback) => {
  callback({
    statusCode: 200,
    headers: {
      'content-type': 'text/html'
    },
    data: createStream('<h5>Response</h5>')
  })
})
```

```javascript
protocol.registerStreamProtocol('atom', (request, callback) => {
  callback(fs.createReadStream('index.html'))
})
```

--------------------------------

### BrowserWindow Constructor Options

Source: https://www.electronjs.org/docs/latest/api/base-window

Configuration options that can be passed to the BrowserWindow constructor to customize window behavior and appearance.

```APIDOC
## BrowserWindow Constructor Options

### Description
These options configure the behavior and appearance of a new BrowserWindow instance.

### Parameters
#### Optional Constructor Options
- **zoomToPageWidth** (boolean) - macOS only. Controls whether the window zooms to the page's preferred width or the screen width when the zoom action is triggered. Defaults to `false`.
- **tabbingIdentifier** (string) - macOS only. Assigns a tab group name to the window, allowing it to be opened as a native tab alongside other windows with the same identifier. Also enables native tab UI elements and related events.
- **minWidth**, **maxWidth**, **minHeight**, **maxHeight** (number) - These set constraints on the window's size, but do not prevent the `setBounds` or `setSize` methods from being called with sizes outside these constraints.

### Platform-Specific `type` Option

#### Linux
- **desktop**: Places the window at the desktop background level. This window will not receive focus or input events.
- **dock**: Creates a dock-like window behavior.
- **toolbar**: Creates a window with a toolbar appearance.
- **splash**: A special type for splash screens that is not draggable.
- **notification**: Creates a window that mimics a system notification.

#### macOS
- **desktop**: Places the window at the desktop background level. This window will not receive focus or input events.
- **textured** (deprecated): Adds a metal gradient appearance.
- **panel**: Enables the window to float above full-screen applications and appear on all spaces.

#### Windows
- **toolbar**: Creates a window with a toolbar appearance.

### Example Usage (Conceptual)
```javascript
const { BrowserWindow } = require('electron')

let win = new BrowserWindow({
  width: 800,
  height: 600,
  zoomToPageWidth: true, // Example option
  tabbingIdentifier: 'my-app-tabs' // Example option
})

win.loadURL('https://example.com')
```
```

--------------------------------

### Get Last Crash Report - Electron

Source: https://www.electronjs.org/docs/latest/api/crash-reporter

Retrieves information about the last successfully uploaded crash report. It returns an object containing the date and ID of the report, or null if no reports have been uploaded yet. This method is only available in the main process.

```javascript
const lastReport = crashReporter.getLastCrashReport()
if (lastReport) {
  console.log('Last crash report:', lastReport)
}

```

--------------------------------

### Configure Main Process for Drag and Drop (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop

The main process script sets up the Electron application, including creating a BrowserWindow and handling IPC messages. It listens for the 'ondragstart' event, prepares the file to be dragged (creating it if it doesn't exist and downloading an icon), and then calls `event.sender.startDrag()` with the file path and icon path. This API handles the actual native drag operation.

```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')  
const path = require('node:path')  
const fs = require('node:fs')  
const https = require('node:https')  
  
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

const iconName = path.join(__dirname, 'iconForDragAndDrop.png')
const icon = fs.createWriteStream(iconName)

// Create a new file to copy - you can also copy existing files.  
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '# Second file to test drag and drop')

https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
  response.pipe(icon)
})

app.whenReady().then(createWindow)
ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: path.join(__dirname, filePath),
    icon: iconName
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

--------------------------------

### Manage GTK Application Lifecycle in Separate Thread

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

Manages the GTK application's main loop and thread. `hello_gui` initializes GTK, creates a main context and loop, and starts the GTK application in a detached thread. `cleanup_gui` handles the graceful shutdown of the GTK main loop and releases resources. This prevents the GTK loop from blocking Node.js.

```c++
void hello_gui()  
{
    if (g_gtk_thread != nullptr)  
    {
      g_print("GTK application is already running.\n");  
      return;  
    }

    if (!gtk_init_check(0, nullptr))  
    {
      g_print("Failed to initialize GTK.\n");  
      return;  
    }

    g_gtk_main_context = g_main_context_new();  
    g_main_loop = g_main_loop_new(g_gtk_main_context, FALSE);  

    g_gtk_thread = new std::thread([]()  
                                   {
        GtkApplication* app = gtk_application_new("com.example.todo", G_APPLICATION_NON_UNIQUE);
        g_signal_connect(app, "activate", G_CALLBACK(activate_handler), nullptr);

        g_idle_add_full(G_PRIORITY_DEFAULT, init_gtk_app, app, nullptr);

        if (g_main_loop) {
            g_main_loop_run(g_main_loop);
        }
    });

    g_gtk_thread->detach();
}

void cleanup_gui()
{
    if (g_main_loop && g_main_loop_is_running(g_main_loop))
    {
      g_main_loop_quit(g_main_loop);
    }

    if (g_main_loop)
    {
      g_main_loop_unref(g_main_loop);
      g_main_loop = nullptr;
    }

    if (g_gtk_main_context)
    {
      g_main_context_unref(g_gtk_main_context);
      g_gtk_main_context = nullptr;
    }

    g_gtk_thread = nullptr;
}
```

--------------------------------

### Build Electron Application Menu using Constructor

Source: https://www.electronjs.org/docs/latest/tutorial/menus

Constructs an application menu by directly appending MenuItem objects to a Menu instance. This method involves creating individual MenuItem instances and then adding them to the menu.

```javascript
const submenu = new Menu()
submenu.append(new MenuItem({ label: 'Hello' }))
submenu.append(new MenuItem({ type: 'separator' }))
submenu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))
const menu = new Menu()
menu.append(new MenuItem({ label: 'Menu', submenu }))
Menu.setApplicationMenu(menu)
```

--------------------------------

### Configure Electron App URL Schemes (plist)

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

This snippet defines custom URL schemes for an Electron application within its `Info.plist` file. It allows the application to be registered to handle specific URL protocols, enabling deep linking and inter-app communication. The `CFBundleURLName` provides a human-readable name for the URL type.

```xml
<dict>
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>electron-api-demos</string>
            </array>
            <key>CFBundleURLName</key>
            <string>Electron API Demos Protocol</string>
        </dict>
    </array>
    <key>ElectronTeamID</key>
    <string>VEKTX9H2N7</string>
</dict>
```

--------------------------------

### Set Node.js Inspector Port (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/command-line-switches

Specifies the host and port for the V8 inspector to listen on. This is particularly useful when activating the inspector remotely, for example, by sending a SIGUSR1 signal. The default host is 127.0.0.1. Aliased to --debug-port.

```javascript
# Example usage in terminal:
# electron --inspect-port=127.0.0.1:9229 your_app.js
```

--------------------------------

### Register Privileged Scheme to Bypass CSP

Source: https://www.electronjs.org/docs/latest/api/protocol

This example demonstrates how to register a custom scheme ('foo') as privileged, specifically enabling it to bypass the Content Security Policy (CSP). This method must be called before the 'app' module's 'ready' event and can only be invoked once. It uses the 'electron' module's protocol API.

```javascript
const { protocol } = require('electron')
  
protocol.registerSchemesAsPrivileged([
  { scheme: 'foo', privileges: { bypassCSP: true } }
])
```

--------------------------------

### Handle Deep Links: macOS 'open-url' Event

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Handles deep links on macOS by listening for the 'open-url' event. When a URL with the registered protocol is clicked, this code displays an error box with the received URL. This is the platform-specific event for handling incoming deep links on macOS.

```javascript
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
})

// Handle the protocol. In this case, we choose to show an Error Box.
app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
})
```

--------------------------------

### Window Shadow and Opacity

Source: https://www.electronjs.org/docs/latest/api/base-window

Manage window shadows and opacity.

```APIDOC
## `win.invalidateShadow()` _macOS_

### Description
Invalidates the window shadow, forcing it to be recomputed based on the current window shape. Useful for clearing visual artifacts after animations.

### Method
`invalidateShadow`

### Parameters
None

### Response
#### Success Response (200)
No specific response body, operation is implicit.

## `win.setHasShadow(hasShadow)`

### Description
Sets whether the window should have a shadow.

### Method
`setHasShadow`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **hasShadow** (boolean) - Required - Whether to enable or disable the shadow.

### Request Example
```json
{
  "hasShadow": true
}
```

### Response
#### Success Response (200)
No specific response body, operation is implicit.

## `win.hasShadow()`

### Description
Checks whether the window currently has a shadow.

### Method
`hasShadow`

### Parameters
None

### Response
#### Success Response (200)
- **hasShadow** (boolean) - Whether the window has a shadow.

### Response Example
```json
{
  "hasShadow": true
}
```

## `win.setOpacity(opacity)` _Windows_ _macOS_

### Description
Sets the opacity of the window. Values outside the [0, 1] range are clamped.

### Method
`setOpacity`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **opacity** (number) - Required - The desired opacity level, between 0.0 (fully transparent) and 1.0 (fully opaque).

### Request Example
```json
{
  "opacity": 0.8
}
```

### Response
#### Success Response (200)
No specific response body, operation is implicit.

## `win.getOpacity()`

### Description
Retrieves the current opacity of the window.

### Method
`getOpacity`

### Parameters
None

### Response
#### Success Response (200)
- **opacity** (number) - The current opacity level, between 0.0 and 1.0. Returns 1 on Linux.

### Response Example
```json
{
  "opacity": 0.8
}
```
```

--------------------------------

### Get Normal Window Bounds in Electron

Source: https://www.electronjs.org/docs/latest/api/base-window

Retrieves the bounds (position and size) of an Electron window in its normal, non-maximized, non-minimized state. The `getNormalBounds` method is useful for understanding the window's default dimensions, even when it's currently in a different state.

```javascript
const { BaseWindow } = require('electron')

const win = new BaseWindow()

// Example: Maximize the window
// win.maximize()

// Get the bounds it had in its normal state
const normalBounds = win.getNormalBounds()
console.log(normalBounds) // Returns the bounds when not maximized/minimized/fullscreen
```

--------------------------------

### Create and Display a Basic View in Electron

Source: https://www.electronjs.org/docs/latest/api/view

This snippet demonstrates the basic usage of the View module to create a new window, instantiate a View, set its background color and bounds, and add it as a child view to the window's content view. It requires the 'BaseWindow' and 'View' classes from the 'electron' module.

```javascript
const { BaseWindow, View } = require('electron')

const win = new BaseWindow()
const view = new View()

view.setBackgroundColor('red')
view.setBounds({ x: 0, y: 0, width: 100, height: 100 })
win.contentView.addChildView(view)
```

--------------------------------

### C++ Logging Macros for Debugging

Source: https://www.electronjs.org/docs/latest/development/debugging

Utilizes Chromium's logging macros to print information to the console in C++ and Objective-C++. This aids in debugging by outputting variable values, function names, and line numbers. Supports different severity levels: INFO, WARN, and ERROR.

```cpp
LOG(INFO) << "bitmap.width(): " << bitmap.width();

LOG(INFO, bitmap.width() > 10) << "bitmap.width() is greater than 10!";
```

--------------------------------

### Default BrowserWindow Configuration (Good Practice)

Source: https://www.electronjs.org/docs/latest/tutorial/security

Shows the recommended way to create a BrowserWindow without explicitly disabling `webSecurity`. This ensures that crucial security features remain enabled by default, adhering to Electron's security guidelines.

```javascript
// Good
const mainWindow = new BrowserWindow()
```

--------------------------------

### Set Partition for Webview Session

Source: https://www.electronjs.org/docs/latest/api/webview-tag

The `partition` attribute specifies the session to be used by the webview. Persistent sessions start with `persist:`, while sessions without this prefix are in-memory. Multiple webviews can share a session by using the same partition string. This can only be set before the first navigation.

```html
<webview src="https://github.com" partition="persist:github"></webview>
<webview src="https://electronjs.org" partition="electron"></webview>
```

--------------------------------

### Get Switch Value from Electron CommandLine

Source: https://www.electronjs.org/docs/latest/api/command-line

Demonstrates how to retrieve the value of a specific command-line switch from Chromium's command line in Electron. This method is for Chromium switches, not application-specific arguments. Returns an empty string if the switch is not present or has no value.

```javascript
const { app } = require('electron')

app.commandLine.appendSwitch('remote-debugging-port', '8315')
const portValue = app.commandLine.getSwitchValue('remote-debugging-port')
console.log(portValue) // '8315'
```

--------------------------------

### Create and Manage Multiple WebContents Views in Electron

Source: https://www.electronjs.org/docs/latest/api/web-contents-view

Demonstrates how to create multiple WebContentsView instances, add them as child views to a base window's content view, load different URLs into each view, and set their bounds. This requires the 'electron' package and should be executed after the 'app' module's 'ready' event.

```javascript
const { BaseWindow, WebContentsView } = require('electron')

const win = new BaseWindow({ width: 800, height: 400 })

const view1 = new WebContentsView()
win.contentView.addChildView(view1)
view1.webContents.loadURL('https://electronjs.org')
view1.setBounds({ x: 0, y: 0, width: 400, height: 400 })

const view2 = new WebContentsView()
win.contentView.addChildView(view2)
view2.webContents.loadURL('https://github.com/electron/electron')
view2.setBounds({ x: 400, y: 0, width: 400, height: 400 })
```

--------------------------------

### Enable Node.js Inspector with Break on Start (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/command-line-switches

Activates the V8 inspector on a specified host and port, and pauses execution at the beginning of the user script. This is useful for debugging the initial state of an Electron application. The default host and port are 127.0.0.1:9229. Aliased to --debug-brk.

```javascript
# Example usage in terminal:
# electron --inspect-brk=127.0.0.1:9229 your_app.js
# or
# electron --inspect-brk your_app.js
```

--------------------------------

### Expose App Versions to Renderer using Preload Script (Node.js/JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

This preload script uses Electron's contextBridge API to expose the application's Chrome, Node.js, and Electron versions to the renderer process. It runs before the web page loads, providing a secure way to share specific information. The `contextBridge.exposeInMainWorld` function makes these versions available as global variables in the renderer.

```javascript
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})
```

--------------------------------

### Swift Hello World Function

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

A simple static function in Swift that takes a string input and returns a greeting string, demonstrating basic function definition and string manipulation within a native macOS environment.

```swift
@objc
public static func helloWorld(_ input: String) -> String {
    return "Hello from Swift! You said: (input)"
}
```

--------------------------------

### Electron Window Flash and Taskbar Control

Source: https://www.electronjs.org/docs/latest/api/browser-window

Methods to flash the window frame to attract user attention and to control the window's visibility in the taskbar. `flashFrame` starts or stops flashing, while `setSkipTaskbar` makes the window not appear in the taskbar (supported on macOS and Windows).

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow();

// Start flashing the window frame
win.flashFrame(true);

// Stop flashing after some time
// setTimeout(() => {
//   win.flashFrame(false);
// }, 5000);

// Skip taskbar (macOS, Windows)
// win.setSkipTaskbar(true);
```

--------------------------------

### Get Process Memory Info - Electron Process

Source: https://www.electronjs.org/docs/latest/api/process

Asynchronously retrieves memory usage statistics for the current Electron process. It returns a Promise that resolves with a ProcessMemoryInfo object, with all statistics reported in Kilobytes. This API should be called after the 'app' is ready. Note that 'residentSet' is not available on macOS due to in-memory compression.

```javascript
async function logProcessMemory() {
  try {
    const memoryInfo = await process.getProcessMemoryInfo();
    console.log('Process Memory Info:', memoryInfo);
  } catch (error) {
    console.error('Failed to get process memory info:', error);
  }
}

// Ensure this is called after app is ready
app.whenReady().then(() => {
  logProcessMemory();
});
```

--------------------------------

### Electron Application Lifecycle: Window Close Handling

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

Manages the application's behavior when all windows are closed. On most platforms (Windows, Linux), it quits the application. On macOS, it keeps the app running in the background as is conventional, allowing the menu bar to remain active until explicitly quit.

```javascript
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

--------------------------------

### Renderer Script to Open URL in Browser (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app

This JavaScript code runs in the Electron renderer process and is responsible for handling user interactions. It attaches an event listener to a button with the ID 'open-in-browser'. When clicked, it invokes the `window.shell.open()` API, which is presumed to be exposed via Electron's context bridge, to open a URL in the system's default browser.

```javascript
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All APIs exposed by the context bridge are available here.

// Binds the buttons to the context bridge API.
document.getElementById('open-in-browser').addEventListener('click', () => {
  window.shell.open()
})
```

--------------------------------

### Handle Window Open in Electron using setWindowOpenHandler

Source: https://www.electronjs.org/docs/latest/breaking-changes

This example illustrates the removal of the WebContents `new-window` event and its replacement with `webContents.setWindowOpenHandler()`. The new handler provides more control over how new windows are opened, allowing developers to explicitly deny or allow them. This change was implemented in Electron 22.

```javascript
// Removed in Electron 22
webContents.on('new-window', (event) => {
  event.preventDefault()
})

// Replace with
webContents.setWindowOpenHandler((details) => {
  return { action: 'deny' }
})
```

--------------------------------

### Set BrowserWindow Background Color

Source: https://www.electronjs.org/docs/latest/api/browser-window

This example shows how to set the background color of a BrowserWindow, either during creation using the backgroundColor property or after creation using the setBackgroundColor method. Supported color formats include hex, RGB, HSL, and named colors. This requires the 'electron' module.

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ backgroundColor: '#2e2c29' })
win.loadURL('https://github.com')
```

```javascript
const win = new BrowserWindow()
win.setBackgroundColor('hsl(230, 100%, 50%)')
win.setBackgroundColor('rgb(255, 145, 145)')
win.setBackgroundColor('#ff00a3')
win.setBackgroundColor('blueviolet')
```

--------------------------------

### Handle Display Media Requests with Electron.js DesktopCapturer

Source: https://www.electronjs.org/docs/latest/api/session

This snippet demonstrates how to set up a display media request handler using Electron.js's `session` and `desktopCapturer` APIs. It grants access to the first detected screen source. The handler can optionally be configured to use the system's native picker for a more integrated user experience, though this feature is experimental and platform-specific.

```javascript
const { session, desktopCapturer } = require('electron')

session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
  desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
    // Grant access to the first screen found.
    callback({ video: sources[0] })
  })
  // Use the system picker if available.
  // Note: this is currently experimental. If the system picker
  // is available, it will be used and the media request handler
  // will not be invoked.
}, { useSystemPicker: true })
```

--------------------------------

### Get User Default Value - macOS

Source: https://www.electronjs.org/docs/latest/api/system-preferences

Retrieves a user default value from NSUserDefaults on macOS. It requires a key and the expected type of the value. Supported types include string, boolean, integer, float, double, url, array, and dictionary.

```javascript
import { systemPreferences } from 'electron';

// Example: Get the Apple interface style
const interfaceStyle = systemPreferences.getUserDefault('AppleInterfaceStyle', 'string');
console.log(interfaceStyle);

// Example: Check if scroll bars are shown
const showScrollBars = systemPreferences.getUserDefault('AppleShowScrollBars', 'string');
console.log(showScrollBars);
```

--------------------------------

### Basic Node.js Addon Skeleton (C++)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

This is the minimal structure for a Node.js addon using node-addon-api. The `Init` function serves as the entry point when the addon is loaded, and `NODE_API_MODULE` registers this initializer. This skeleton provides the foundation for integrating native code.

```cpp
#include <napi.h>
#include <string>
#include "cpp_code.h"

// Class to wrap our C++ code will go here

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  // We'll add code here later
  return exports;
}

NODE_API_MODULE(cpp_addon, Init)

```

--------------------------------

### Disable Sandbox via Node.js Integration (Electron)

Source: https://www.electronjs.org/docs/latest/tutorial/sandbox

This example shows how enabling Node.js integration (`nodeIntegration: true`) in the `BrowserWindow` constructor automatically disables the sandbox for the renderer process. This approach is often used when native Node.js modules are needed in the renderer, but it compromises security.

```javascript
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadURL('https://google.com')
})
```

--------------------------------

### Fetch File from ASAR Archive using $.get (Web API)

Source: https://www.electronjs.org/docs/latest/tutorial/asar-archives

Provides an example of how to fetch content from a file within an ASAR archive using jQuery's `$.get` method in a web page context. It utilizes the `file:` protocol to access archive contents.

```javascript
<script>
let $ = require('./jquery.min.js')
$.get('file:///path/to/example.asar/file.txt', (data) => {
  console.log(data)
})
</script>
```

--------------------------------

### Unregister from APNS Notifications in Electron.js

Source: https://www.electronjs.org/docs/latest/api/push-notifications

This code example shows how to unregister an Electron.js application from receiving notifications from the Apple Push Notification service (APNS). This action revokes the device token and stops notifications from being delivered. Apps can re-register at any time.

```javascript
const { pushNotifications } = require('electron')

pushNotifications.unregisterForAPNSNotifications()
```

--------------------------------

### Configure File Filters for Dialogs (ElectronJS)

Source: https://www.electronjs.org/docs/latest/api/dialog

This example shows how to define file filters for ElectronJS dialogs. It allows you to specify which file types are displayed or selectable by the user, using an array of filter objects, each with a name and an array of file extensions. Supported extensions should not include wildcards or dots.

```javascript
{
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    { name: 'Custom File Type', extensions: ['as'] },
    { name: 'All Files', extensions: ['*'] }
  ]
}

```

--------------------------------

### Inter-Process Communication (IPC) Between Embedder and Guest Pages in Electron.js

Source: https://www.electronjs.org/docs/latest/api/webview-tag

This example illustrates two-way communication between an embedder page and a guest page using Electron.js WebViews. The embedder page listens for 'ipc-message' events and sends messages using `webview.send()`, while the guest page uses `ipcRenderer.sendToHost()` to send messages back.

```javascript
// In embedder page.
const webview = document.querySelector('webview')
webview.addEventListener('ipc-message', (event) => {
  console.log(event.channel)
  // Prints "pong"
})
webview.send('ping')
```

```javascript
// In guest page.
const { ipcRenderer } = require('electron')
 ipcRenderer.on('ping', () => {
  ipcRenderer.sendToHost('pong')
})
```

--------------------------------

### Handle Offscreen Rendering Paint Event in Electronjs

Source: https://www.electronjs.org/docs/latest/api/web-contents

Listens for the 'paint' event in an offscreen BrowserWindow to capture newly generated frames. The event provides a dirty rectangle and the image data. This example shows basic image capture and the commented-out call to update a bitmap.

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ webPreferences: { offscreen: true } })
win.webContents.on('paint', (event, dirty, image) => {
  // updateBitmap(dirty, image.toBitmap())
})
win.loadURL('https://github.com')

```

--------------------------------

### Electron Window Title Management

Source: https://www.electronjs.org/docs/latest/api/browser-window

Functions to get and set the title of an Electron window. The `setTitle` method changes the native window title, while `getTitle` retrieves it. Note that the web page's title might differ from the native window's title.

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow();

// Set the window title
win.setTitle('My Electron App');

// Get the window title
const title = win.getTitle();
console.log(`Window title: ${title}`);
```

--------------------------------

### BrowserWindow Configuration Options

Source: https://www.electronjs.org/docs/latest/api/browser-view

This section outlines the various optional parameters that can be passed to the BrowserWindow constructor to customize its behavior and appearance.

```APIDOC
## BrowserWindow Configuration Options

This section outlines the various optional parameters that can be passed to the `BrowserWindow` constructor to customize its behavior and appearance.

### Parameters

#### Request Body (BrowserWindow Constructor Options)

- **`fantasy`** (string) - Optional - Defaults to `Impact`. Specifies a fantasy font.
- **`math`** (string) - Optional - Defaults to `Latin Modern Math`. Specifies a math font.
- **`defaultFontSize`** (Integer) - Optional - Defaults to `16`. Sets the default font size.
- **`defaultMonospaceFontSize`** (Integer) - Optional - Defaults to `13`. Sets the default monospace font size.
- **`minimumFontSize`** (Integer) - Optional - Defaults to `0`. Sets the minimum font size.
- **`defaultEncoding`** (string) - Optional - Defaults to `ISO-8859-1`. Sets the default character encoding.
- **`backgroundThrottling`** (boolean) - Optional - Whether to throttle animations and timers when the page becomes background. Defaults to `true`.
- **`offscreen`** (Object | boolean) - Optional - Whether to enable offscreen rendering. Defaults to `false`.
  - **`useSharedTexture`** (boolean) - Optional _Experimental_ - Whether to use GPU shared texture for accelerated paint event. Defaults to `false`.
  - **`sharedTexturePixelFormat`** (string) - Optional _Experimental_ - The requested output format of the shared texture. Defaults to `argb`. Accepted values: `argb`, `rgbaf16`.
- **`contextIsolation`** (boolean) - Optional - Whether to run Electron APIs and preload script in a separate JavaScript context. Defaults to `true`.
- **`webviewTag`** (boolean) - Optional - Whether to enable the `<webview>` tag. Defaults to `false`.
- **`additionalArguments`** (string[]) - Optional - A list of strings appended to `process.argv` in the renderer process.
- **`safeDialogs`** (boolean) - Optional - Whether to enable browser-style consecutive dialog protection. Default is `false`.
- **`safeDialogsMessage`** (string) - Optional - The message to display when consecutive dialog protection is triggered.
- **`disableDialogs`** (boolean) - Optional - Whether to disable dialogs completely. Overrides `safeDialogs`. Default is `false`.
- **`navigateOnDragDrop`** (boolean) - Optional - Whether dragging and dropping a file or link onto the page causes a navigation. Default is `false`.
- **`autoplayPolicy`** (string) - Optional - Autoplay policy. Defaults to `no-user-gesture-required`. Accepted values: `no-user-gesture-required`, `user-gesture-required`, `document-user-activation-required`.
- **`disableHtmlFullscreenWindowResize`** (boolean) - Optional - Whether to prevent the window from resizing when entering HTML Fullscreen. Default is `false`.
- **`accessibleTitle`** (string) - Optional - An alternative title string for accessibility tools.
- **`spellcheck`** (boolean) - Optional - Whether to enable the builtin spellchecker. Default is `true`.
- **`enableWebSQL`** (boolean) - Optional - Whether to enable the WebSQL API. Default is `true`.
- **`v8CacheOptions`** (string) - Optional - Enforces the v8 code caching policy used by blink.

### Request Example

```json
{
  "defaultFontSize": 14,
  "offscreen": {
    "useSharedTexture": true,
    "sharedTexturePixelFormat": "rgbaf16"
  },
  "contextIsolation": false,
  "autoplayPolicy": "user-gesture-required"
}
```

### Response

#### Success Response (200)

- **N/A** - This endpoint does not return a response body. Configuration is applied directly to the `BrowserWindow` instance.

#### Response Example

N/A
```

--------------------------------

### Get Available Tracing Categories in Electron

Source: https://www.electronjs.org/docs/latest/api/content-tracing

Retrieves a list of all available tracing category groups that can be used with the `contentTracing` module. This includes built-in Chromium categories and the 'electron' specific category. The categories can change dynamically as new code paths are executed.

```javascript
const { contentTracing } = require('electron')

async function getCategories() {
  const categories = await contentTracing.getCategories()
  console.log('Available tracing categories:', categories)
  return categories
}

getCategories()
```

--------------------------------

### Setting the Source URL for <webview>

Source: https://www.electronjs.org/docs/latest/api/webview-tag

This example shows how to set the `src` attribute for the <webview> tag. The `src` attribute specifies the URL of the web content to be displayed. Assigning a new value to `src` initiates navigation, and assigning its current value reloads the page. It also supports data URLs.

```html
<webview src="https://www.github.com/"></webview>
```

--------------------------------

### Static Methods - BaseWindow

Source: https://www.electronjs.org/docs/latest/api/base-window

Provides static methods for interacting with all browser windows within the Electron application.

```APIDOC
## Static Methods - BaseWindow

The `BaseWindow` class has the following static methods:

### `BaseWindow.getAllWindows()`

Returns `BaseWindow[]` - An array of all opened browser windows.

### `BaseWindow.getFocusedWindow()`

Returns `BaseWindow | null` - The window that is focused in this application, otherwise returns `null`.

### `BaseWindow.fromId(id)`

* `id` (Integer) - The ID of the window to retrieve.

Returns `BaseWindow | null` - The window with the given `id`.
```

--------------------------------

### C++ Implementation of Hello World Function

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

Provides the implementation for the 'hello_world' function declared in the header file. It concatenates a prefix to the input string and returns the result.

```cpp
#include <string>
#include "../include/cpp_code.h"

namespace cpp_code {
    std::string hello_world(const std::string& input) {
        // Simply concatenate strings and return
        return "Hello from C++! You said: " + input;
    }
} // namespace cpp_code

```

--------------------------------

### Create and Control Browser Windows in Electron

Source: https://www.electronjs.org/docs/latest/api/browser-window

This snippet demonstrates the basic creation of a BrowserWindow in Electron, including loading remote URLs or local HTML files. It requires the 'electron' module and is intended for the main process.

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ width: 800, height: 600 })

// Load a remote URL
win.loadURL('https://github.com')

// Or load a local HTML file
win.loadFile('index.html')
```

--------------------------------

### C++ Addon Initialization and Methods for ElectronJS

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

This C++ code defines a class 'CppAddon' that inherits from Napi::ObjectWrap, enabling it to be used as an addon in ElectronJS. It initializes the addon, defines methods like 'helloWorld', 'helloGui', and 'on', and sets up a thread-safe function for callbacks. The 'Init' function registers the addon with Node-API.

```cpp
#include <napi.h>
#include <string>
#include "cpp_code.h"

class CppAddon : public Napi::ObjectWrap<CppAddon>
{
public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports)
  {
    Napi::Function func = DefineClass(env, "CppLinuxAddon", {
      InstanceMethod("helloWorld", &CppAddon::HelloWorld),
      InstanceMethod("helloGui", &CppAddon::HelloGui),
      InstanceMethod("on", &CppAddon::On)
    });

    Napi::FunctionReference *constructor = new Napi::FunctionReference();
    *constructor = Napi::Persistent(func);
    env.SetInstanceData(constructor);

    exports.Set("CppLinuxAddon", func);
    return exports;
  }

  struct CallbackData
  {
    std::string eventType;
    std::string payload;
    CppAddon *addon;
  };

  CppAddon(const Napi::CallbackInfo &info)
      : Napi::ObjectWrap<CppAddon>(info),
        env_(info.Env()),
        emitter(Napi::Persistent(Napi::Object::New(info.Env()))),
        callbacks(Napi::Persistent(Napi::Object::New(info.Env()))),
        tsfn_(nullptr)
  {
    napi_status status = napi_create_threadsafe_function(
        env_,
        nullptr,
        nullptr,
        Napi::String::New(env_, "CppCallback"),
        0,
        1,
        nullptr,
        nullptr,
        this,
        [](napi_env env, napi_value js_callback, void *context, void *data)
        {
          auto *callbackData = static_cast<CallbackData *>(data);
          if (!callbackData)
            return;

          Napi::Env napi_env(env);
          Napi::HandleScope scope(napi_env);

          auto addon = static_cast<CppAddon *>(context);
          if (!addon)
          {
            delete callbackData;
            return;
          }

          try
          {
            auto callback = addon->callbacks.Value().Get(callbackData->eventType).As<Napi::Function>();
            if (callback.IsFunction())
            {
              callback.Call(addon->emitter.Value(), {Napi::String::New(napi_env, callbackData->payload)});
            }
          }
          catch (...)
          {
          }

          delete callbackData;
        },
        &tsfn_);

    if (status != napi_ok)
    {
      Napi::Error::New(env_, "Failed to create threadsafe function").ThrowAsJavaScriptException();
      return;
    }

    // Set up the callbacks here
    auto makeCallback = [this](const std::string &eventType)
    {
      return [this, eventType](const std::string &payload)
      {
        if (tsfn_ != nullptr)
        {
          auto *data = new CallbackData{
              eventType,
              payload,
              this};
          napi_call_threadsafe_function(tsfn_, data, napi_tsfn_blocking);
        }
      };
    };

    cpp_code::setTodoAddedCallback(makeCallback("todoAdded"));
    cpp_code::setTodoUpdatedCallback(makeCallback("todoUpdated"));
    cpp_code::setTodoDeletedCallback(makeCallback("todoDeleted"));
  }

  ~CppAddon()
  {
    if (tsfn_ != nullptr)
    {
      napi_release_threadsafe_function(tsfn_, napi_tsfn_release);
      tsfn_ = nullptr;
    }
  }

private:
  Napi::Env env_;
  Napi::ObjectReference emitter;
  Napi::ObjectReference callbacks;
  napi_threadsafe_function tsfn_;

  Napi::Value HelloWorld(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString())
    {
      Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
      return env.Null();
    }

    std::string input = info[0].As<Napi::String>();
    std::string result = cpp_code::hello_world(input);

    return Napi::String::New(env, result);
  }

  void HelloGui(const Napi::CallbackInfo &info)
  {
    cpp_code::hello_gui();
  }

  Napi::Value On(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsFunction())
    {
      Napi::TypeError::New(env, "Expected (string, function) arguments").ThrowAsJavaScriptException();
      return env.Undefined();
    }

    callbacks.Value().Set(info[0].As<Napi::String>(), info[1].As<Napi::Function>());
    return env.Undefined();
  }
};

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  return CppAddon::Init(env, exports);
}

NODE_API_MODULE(cpp_addon, Init)

```

--------------------------------

### Set Node.js Inspector Port with Break on Start (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/command-line-switches

Activates the V8 inspector on the specified host and port, and halts execution at the very beginning of the first internal JavaScript script. This provides an opportunity to debug the core startup sequence of the application. The default host and port are 127.0.0.1:9229.

```javascript
# Example usage in terminal:
# electron --inspect-brk-node=127.0.0.1:9229 your_app.js
```

--------------------------------

### Create Basic Tray Menu in Electron

Source: https://www.electronjs.org/docs/latest/api/tray

This snippet demonstrates how to create a basic tray icon with a context menu using Electron's Tray and Menu modules. It initializes the tray icon with an image and sets a context menu with radio button items. The tooltip is also set for the tray icon. This code is intended for the main process.

```javascript
const { app, Menu, Tray } = require('electron')
  
let tray = null
app.whenReady().then(() => {
  tray = new Tray('/path/to/my/icon')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})

```

--------------------------------

### Set and Manage Request Headers in Electron.js

Source: https://www.electronjs.org/docs/latest/api/client-request

This JavaScript code illustrates how to set, get, and remove custom HTTP headers for a request in Electron.js. It highlights that these operations must be performed before the first data chunk is written. The snippet also lists restricted headers.

```javascript
request.setHeader('name', 'value')
const headerValue = request.getHeader('name')
request.removeHeader('name')
```

--------------------------------

### Electron Main Process USB Permissions

Source: https://www.electronjs.org/docs/latest/tutorial/devices

Handles USB device selection and permission granting in the Electron main process. It sets up handlers for USB device additions/removals and manages permissions using `setPermissionCheckHandler`, `setDevicePermissionHandler`, and `setUSBProtectedClassesHandler`. Dependencies include Electron's `app` and `BrowserWindow` modules. It loads the `index.html` file for the UI.

```javascript
const { app, BrowserWindow } = require('electron/main')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  let grantedDeviceThroughPermHandler

  mainWindow.webContents.session.on('select-usb-device', (event, details, callback) => {
    // Add events to handle devices being added or removed before the callback on
    // `select-usb-device` is called.
    mainWindow.webContents.session.on('usb-device-added', (event, device) => {
      console.log('usb-device-added FIRED WITH', device)
      // Optionally update details.deviceList
    })

    mainWindow.webContents.session.on('usb-device-removed', (event, device) => {
      console.log('usb-device-removed FIRED WITH', device)
      // Optionally update details.deviceList
    })

    event.preventDefault()
    if (details.deviceList && details.deviceList.length > 0) {
      const deviceToReturn = details.deviceList.find((device) => {
        return !grantedDeviceThroughPermHandler || (device.deviceId !== grantedDeviceThroughPermHandler.deviceId)
      })
      if (deviceToReturn) {
        callback(deviceToReturn.deviceId)
      } else {
        callback()
      }
    }
  })

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'usb' && details.securityOrigin === 'file:///') {
      return true
    }
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'usb' && details.origin === 'file://') {
      if (!grantedDeviceThroughPermHandler) {
        grantedDeviceThroughPermHandler = details.device
        return true
      } else {
        return false
      }
    }
  })

  mainWindow.webContents.session.setUSBProtectedClassesHandler((details) => {
    return details.protectedClasses.filter((usbClass) => {
      // Exclude classes except for audio classes
      return usbClass.indexOf('audio') === -1
    })
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

--------------------------------

### Implement HelloWorld and HelloGui in C++ using Node-API

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

This C++ code defines 'HelloWorld' and 'HelloGui' functions for a Node.js native addon. 'HelloWorld' validates string input from JavaScript, calls a C++ function, and returns the result. 'HelloGui' directly calls a C++ function to launch a UI. Both use Napi::CallbackInfo to interact with the JavaScript environment.

```cpp
Napi::Value HelloWorld(const Napi::CallbackInfo &info)  
{  
  Napi::Env env = info.Env();  
  
  if (info.Length() < 1 || !info[0].IsString())  
  {  
    Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();  
    return env.Null();  
  }  
  
  std::string input = info[0].As<Napi::String>();  
  std::string result = cpp_code::hello_world(input);  
  
  return Napi::String::New(env, result);  
}  
  
void HelloGui(const Napi::CallbackInfo &info)  
{  
  cpp_code::hello_gui();  
}
```

--------------------------------

### Set and Get Content Bounds - Electron

Source: https://www.electronjs.org/docs/latest/api/browser-window

Resizes and moves the window's client area (web page) to the specified bounds. Similar to `setBounds`, but affects only the content area. On Wayland, it shares limitations with `setContentSize` and `setPosition`. `getContentBounds()` returns the current bounds of the client area.

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow();

// Set the content bounds
win.setContentBounds({ x: 10, y: 10, width: 500, height: 300 });

// Get the content bounds
console.log(win.getContentBounds());
// Example output: { x: 10, y: 10, width: 500, height: 300 }
```

--------------------------------

### Modify User-Agent Header for Specific URLs (Electron JavaScript)

Source: https://www.electronjs.org/docs/latest/api/web-request

This example demonstrates how to modify the 'User-Agent' header for all requests targeting specific URLs using Electron's `session.defaultSession.webRequest.onBeforeSendHeaders` method. It requires the 'electron' module and defines a filter to match desired URLs.

```javascript
const { session } = require('electron')

// Modify the user agent for all requests to the following urls.
const filter = {
  urls: ['https://*.github.com/*', '*://electron.github.io/*']
}

session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  details.requestHeaders['User-Agent'] = 'MyAgent'
  callback({ requestHeaders: details.requestHeaders })
})
```

--------------------------------

### Default Webview Configuration (Good Practice)

Source: https://www.electronjs.org/docs/latest/tutorial/security

Presents the correct and secure way to use the `<webview>` tag by omitting the `disablewebsecurity` attribute. This ensures that security policies are enforced.

```html
<!-- Good -->
<webview src="page.html"></webview>
```

--------------------------------

### Get File Path using webUtils.getPathForFile (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/web-utils

Demonstrates how to obtain the file system path for a File object using the webUtils.getPathForFile method. This is crucial for renderer processes when context isolation is enabled, requiring exposure via contextBridge in preload scripts. It handles cases where the input is not a File or not backed by a disk file.

```javascript
// Before (renderer)
const oldPath = document.querySelector('input[type=file]').files[0].path

```

```javascript
// After

// Renderer:

const file = document.querySelector('input[type=file]').files[0]
electronApi.doSomethingWithFile(file)

// Preload script:

const { contextBridge, webUtils } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  doSomethingWithFile (file) {
    const path = webUtils.getPathForFile(file)
    // Do something with the path, e.g., send it over IPC to the main process.
    // It's best not to expose the full file path to the web content if possible.
  }
})

```

--------------------------------

### Making HTTP Requests with Electron net

Source: https://www.electronjs.org/docs/latest/api/net

Demonstrates how to use the `net.request` method to create and send an HTTP request. It shows how to handle the response, including status codes, headers, and response data. This method should be called after the application's 'ready' event.

```javascript
const { app } = require('electron')

app.whenReady().then(() => {
  const { net } = require('electron')
  const request = net.request('https://github.com')
  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  request.end()
})
```

--------------------------------

### Get Trace Buffer Usage in Electron

Source: https://www.electronjs.org/docs/latest/api/content-tracing

This function retrieves the current usage of the trace buffer across all processes. It returns an object containing the numerical value and percentage of the maximum buffer capacity being utilized. This can help in understanding if the buffer is nearing its limit during tracing.

```javascript
const { contentTracing } = require('electron')

async function getBufferUsage() {
  const usage = await contentTracing.getTraceBufferUsage()
  console.log('Trace buffer usage:', usage)
  return usage
}

getBufferUsage()
```

--------------------------------

### Get and Set Accessibility Support Features in Electron

Source: https://www.electronjs.org/docs/latest/api/app

Retrieves the currently enabled accessibility support features and allows setting specific features to be enabled. Supports macOS and Windows. Dependencies include the 'electron' module. Returns an array of strings for enabled features and accepts an array of strings to set features.

```javascript
const { app } = require('electron')

app.whenReady().then(() => {
  // Get enabled features
  const enabledFeatures = app.getAccessibilitySupportFeatures();
  console.log('Enabled accessibility features:', enabledFeatures);

  if (enabledFeatures.includes('screenReader')) {
    console.log('Screen reader support is enabled.');
    // Change some app UI to better work with Screen Readers.
  }

  // Enable a subset of features:
  app.setAccessibilitySupportFeatures([
    'screenReader',
    'pdfPrinting',
    'webContents'
  ]);
  console.log('Set accessibility features to:', app.getAccessibilitySupportFeatures());

  // Some time later, disable all features:
  app.setAccessibilitySupportFeatures([])
  console.log('Disabled all accessibility features:', app.getAccessibilitySupportFeatures());
});
```

--------------------------------

### window.open() Usage

Source: https://www.electronjs.org/docs/latest/api/window-open

Demonstrates how to open a new window from the renderer process using `window.open()`. This includes specifying the URL, frame name, and features.

```APIDOC
## window.open()

### Description
Opens a new window from the renderer process. The `url`, `frameName`, and `features` arguments control the behavior and properties of the new window.

### Method
`window.open(url[, frameName][, features])`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```javascript
window.open('https://github.com', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no')
```

### Response
#### Success Response (200)
Returns the `Window` object for the newly opened window, or `null` if the window could not be opened.

#### Response Example
```json
{
  "type": "Window | null"
}
```
```

--------------------------------

### win.loadFile

Source: https://www.electronjs.org/docs/latest/api/browser-window

Loads an HTML file from the local file system into the window. Supports options for query parameters, search, and hash.

```APIDOC
## POST /websites/electronjs/win.loadFile

### Description
Loads an HTML file into the window. The `filePath` should be a path to an HTML file relative to the root of your application. Supports options for `query`, `search`, and `hash`.

### Method
POST

### Endpoint
/websites/electronjs/win.loadFile

### Parameters
#### Path Parameters
None

#### Query Parameters
* **filePath** (string) - The path to the HTML file.
* **options.query** (Record<string, string>) - Optional - Passed to `url.format()`.
* **options.search** (string) - Optional - Passed to `url.format()`.
* **options.hash** (string) - Optional - Passed to `url.format()`.

#### Request Body
None

### Request Example
```javascript
win.loadFile('index.html', {
  query: { userId: '123' },
  hash: 'section1'
});
```

### Response
#### Success Response (200)
- **void** - Resolves when the page has finished loading (see `did-finish-load`).
#### Error Response
- Rejects if the page fails to load (see `did-fail-load`).
```

--------------------------------

### Register Global Shortcut in Electron

Source: https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts

This code shows how to register a global keyboard shortcut in an Electron application using the `globalShortcut.register` function. This allows the shortcut to function even when the application window is not in focus. The example registers 'CommandOrControl+Alt+R' to trigger a message box dialog. It requires the 'electron/main' module for both 'dialog' and 'globalShortcut'.

```javascript
const {dialog, globalShortcut} = require('electron/main')

globalShortcut.register('CommandOrControl+Alt+R', () => {
  dialog.showMessageBox({ message: 'Hello World!' })
})

```

--------------------------------

### Customize Window Creation with `setWindowOpenHandler`

Source: https://www.electronjs.org/docs/latest/api/window-open

This snippet demonstrates how to use `webContents.setWindowOpenHandler` in the main process to control the creation of new windows. It allows specifying actions like 'allow' or 'deny' and overriding `BrowserWindow` constructor options, including security preferences like `webPreferences`. This provides a secure and flexible way to manage child windows.

```javascript
// main.js
const mainWindow = new BrowserWindow()

// In this example, only windows with the `about:blank` url will be created.
// All other urls will be blocked.
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  if (url === 'about:blank') {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        frame: false,
        fullscreenable: false,
        backgroundColor: 'black',
        webPreferences: {
          preload: 'my-child-window-preload-script.js'
        }
      }
    }
  }
  return { action: 'deny' }
})
```

--------------------------------

### Enabling Node.js Integration in <webview> Sub-frames

Source: https://www.electronjs.org/docs/latest/api/webview-tag

This example shows how to enable the experimental option `nodeintegrationinsubframes` for the <webview> tag. This allows Node.js support in sub-frames (like iframes within the webview). Preloads will be executed for every iframe, and `process.isMainFrame` can differentiate between the main frame and sub-frames. It is disabled by default.

```html
<webview src="https://www.google.com/" nodeintegrationinsubframes></webview>
```

--------------------------------

### Update Tray Context Menu on Linux

Source: https://www.electronjs.org/docs/latest/api/tray

This example shows how to update a tray icon's context menu, specifically for Linux. It involves creating a tray icon, building a context menu, modifying its items, and then re-applying the context menu to the tray icon using `setContextMenu`. This is necessary on Linux for changes to individual `MenuItem`s to take effect.

```javascript
const { app, Menu, Tray } = require('electron')
  
let appIcon = null
app.whenReady().then(() => {
  appIcon = new Tray('/path/to/my/icon')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' }
  ])
  
  // Make a change to the context menu
  contextMenu.items[1].checked = false
  
  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
})

```

--------------------------------

### Implement GUI and Event Handling in Swift

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

Implements the `helloGui` method to create and display a native macOS window using SwiftUI. It integrates a SwiftUI view (`ContentView`) within an `NSHostingView` and sets up callbacks to communicate UI events back to the JavaScript environment.

```swift
// Other code...

@objc
public class SwiftCode: NSObject {
    // Other code...

        @objc
    public static func helloGui() -> Void {
        let contentView = NSHostingView(rootView: ContentView(
            onTodoAdded: { todo in
                if let jsonString = encodeToJson(todo) {
                    todoAddedCallback?(jsonString)
                }
            },
            onTodoUpdated: { todo in
                if let jsonString = encodeToJson(todo) {
                    todoUpdatedCallback?(jsonString)
                }
            },
            onTodoDeleted: { todoId in
                todoDeletedCallback?(todoId.uuidString)
            }
        ))
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 500, height: 500),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )

        window.title = "Todo List"
        window.contentView = contentView
        window.center()

        windowController = NSWindowController(window: window)
        windowController?.showWindow(nil)

        NSApp.activate(ignoringOtherApps: true)
    }
}

```

--------------------------------

### Unregister Global Shortcut in Electron

Source: https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts

This example demonstrates how to unregister a previously registered global keyboard shortcut in an Electron application using the `globalShortcut.unregister` function. This is useful for disabling shortcuts when they are no longer needed. It requires the 'electron/main' module and specifically the 'globalShortcut' API.

```javascript
const {globalShortcut} = require('electron/main')

globalShortcut.unregister('CommandOrControl+Alt+R')

```

--------------------------------

### safeStorage API Documentation

Source: https://www.electronjs.org/docs/latest/api/safe-storage

Documentation for the safeStorage module, including its methods for encryption, decryption, and checking encryption availability.

```APIDOC
## safeStorage Module

### Description
This module provides functionalities to securely encrypt and decrypt strings for storage on the local machine by utilizing the operating system's built-in cryptography systems. It offers different security semantics based on the OS (macOS, Windows, Linux).

### Methods

#### `safeStorage.isEncryptionAvailable()`

##### Description
Checks if encryption is available on the current platform.

##### Method
GET

##### Endpoint
`safeStorage.isEncryptionAvailable()`

##### Parameters
None

##### Response
* **Returns**: `boolean` - True if encryption is available, false otherwise.

##### Response Example
```json
true
```

#### `safeStorage.encryptString(plainText)`

##### Description
Encrypts a given string using the secure storage mechanism.

##### Method
POST

##### Endpoint
`safeStorage.encryptString(plainText)`

##### Parameters
* **plainText** (string) - Required - The string to be encrypted.

##### Request Example
```json
{
  "plainText": "mySecretData"
}
```

##### Response
* **Returns**: `Buffer` - A Buffer containing the encrypted bytes of the string.

##### Response Example
```json
<Buffer 01 02 03 ...>
```

#### `safeStorage.decryptString(encrypted)`

##### Description
Decrypts a previously encrypted buffer back into its original string format.

##### Method
POST

##### Endpoint
`safeStorage.decryptString(encrypted)`

##### Parameters
* **encrypted** (Buffer) - Required - The buffer containing the encrypted data.

##### Request Example
```json
{
  "encrypted": "<Buffer 01 02 03 ...>"
}
```

##### Response
* **Returns**: `string` - The original decrypted string.

##### Response Example
```json
"mySecretData"
```

#### `safeStorage.setUsePlainTextEncryption(usePlainText)`

##### Description
Forces the module to use in-memory password-based encryption on Linux when a valid OS password manager cannot be determined. This is a no-op on macOS and Windows.

##### Method
PUT

##### Endpoint
`safeStorage.setUsePlainTextEncryption(usePlainText)`

##### Parameters
* **usePlainText** (boolean) - Required - Set to true to enable plain text encryption (on Linux), false otherwise.

##### Request Example
```json
{
  "usePlainText": true
}
```

##### Response
None

#### `safeStorage.getSelectedStorageBackend()` _Linux Only_

##### Description
Retrieves the user-friendly name of the password manager selected on Linux.

##### Method
GET

##### Endpoint
`safeStorage.getSelectedStorageBackend()`

##### Parameters
None

##### Response
* **Returns**: `string` - The name of the selected storage backend (e.g., `basic_text`, `gnome_libsecret`, `kwallet`, `kwallet5`, `kwallet6`, `unknown`).

##### Response Example
```json
"gnome_libsecret"
```
```

--------------------------------

### Electron Cookies: Get, Set, and Log Cookies

Source: https://www.electronjs.org/docs/latest/api/cookies

This snippet demonstrates how to use the Electron Cookies API to retrieve all cookies, retrieve cookies for a specific URL, and set a new cookie. It utilizes the 'session' object and handles asynchronous operations with Promises. Errors during these operations are logged to the console.

```javascript
const { session } = require('electron')

// Query all cookies.
session.defaultSession.cookies.get({})
  .then((cookies) => {
    console.log(cookies)
  }).catch((error) => {
    console.log(error)
  })

// Query all cookies associated with a specific url.
session.defaultSession.cookies.get({ url: 'https://www.github.com' })
  .then((cookies) => {
    console.log(cookies)
  }).catch((error) => {
    console.log(error)
  })

// Set a cookie with the given cookie data;
// may overwrite equivalent cookies if they exist.
const cookie = { url: 'https://www.github.com', name: 'dummy_name', value: 'dummy' }
session.defaultSession.cookies.set(cookie)
  .then(() => {
    // success
  }, (error) => {
    console.error(error)
  })
```

--------------------------------

### ClientRequest Class

Source: https://www.electronjs.org/docs/latest/api/client-request

Information about the ClientRequest class, including its constructor, instance events, properties, and methods.

```APIDOC
## ClientRequest Class

### `new ClientRequest(options)`

Constructor for the ClientRequest class.

### Instance Events

* **`'response'`**: Emitted when a response is received.
* **`'login'`**: Emitted when a login is required.
* **`'finish'`**: Emitted just after the `end` operation completes.
* **`'abort'`**: Emitted when the request is aborted.
* **`'error'`**: Emitted when an error occurs during the request.
* **`'close'`**: Emitted when the connection is closed.
* **`'redirect'`**: Emitted when the server redirects the request.

### Instance Properties

* **`chunkedEncoding`** (boolean): Indicates if chunked encoding is used.

### Instance Methods

* `setHeader(name, value)`: Sets a request header.
* `getHeader(name)`: Gets a request header.
* `removeHeader(name)`: Removes a request header.
* `write(chunk[, encoding][, callback])`: Writes a chunk of data to the request.
* `end([chunk][, encoding][, callback])`: Sends the last chunk of data and ends the request.
* `abort()`: Cancels the request.
* `followRedirect()`: Continues a pending redirection.
* `getUploadProgress()`: Returns upload progress information.
```

--------------------------------

### Swift Addon Constructor and Threadsafe Function Setup (C++/Objective-C)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

This C++ code snippet, used within a Swift addon for Node.js, sets up the constructor for the SwiftAddon class. It defines a `CallbackData` struct for inter-thread data transfer, initializes Node-API persistent objects for event emission and callbacks, and crucially creates a threadsafe function (`tsfn_`) using `napi_create_threadsafe_function`. This function is designed to handle callbacks from a different thread (Swift) to the Node.js event loop, ensuring safe data passing and execution context.

```cpp
// Previous code...  
  
    struct CallbackData {
        std::string eventType;
        std::string payload;
        SwiftAddon* addon;
    };

    SwiftAddon(const Napi::CallbackInfo& info)
        : Napi::ObjectWrap<SwiftAddon>(info)
        , env_(info.Env())
        , emitter(Napi::Persistent(Napi::Object::New(info.Env())))
        , callbacks(Napi::Persistent(Napi::Object::New(info.Env())))
        , tsfn_(nullptr) {

        napi_status status = napi_create_threadsafe_function(
            env_,
            nullptr,
            nullptr,
            Napi::String::New(env_, "SwiftCallback"),
            0,
            1,
            nullptr,
            nullptr,
            this,
            [](napi_env env, napi_value js_callback, void* context, void* data) {
                auto* callbackData = static_cast<CallbackData*>(data);
                if (!callbackData) return;

                Napi::Env napi_env(env);
                Napi::HandleScope scope(napi_env);

                auto addon = static_cast<SwiftAddon*>(context);
                if (!addon) {
                    delete callbackData;
                    return;
                }

                try {
                    auto callback = addon->callbacks.Value().Get(callbackData->eventType).As<Napi::Function>();
                    if (callback.IsFunction()) {
                        callback.Call(addon->emitter.Value(), {Napi::String::New(napi_env, callbackData->payload)});
                    }
                } catch (...) {}

                delete callbackData;
            },
            &tsfn_
        );

        if (status != napi_ok) {
            Napi::Error::New(env_, "Failed to create threadsafe function").ThrowAsJavaScriptException();
            return;
        }

```

--------------------------------

### Node.js package.json for C++ Win32 Addon

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

This package.json file configures a Node.js project for building a C++ Win32 addon for Electron. It includes dependencies like 'bindings' and 'node-addon-api', and defines scripts for cleaning, building for Electron, and general building using node-gyp.

```json
{
  "name": "cpp-win32",
  "version": "1.0.0",
  "description": "A demo module that exposes C++ code to Electron",
  "main": "js/index.js",
  "author": "Your Name",
  "scripts": {
    "clean": "rm -rf build_swift && rm -rf build",
    "build-electron": "electron-rebuild",
    "build": "node-gyp configure && node-gyp build"
  },
  "license": "MIT",
  "dependencies": {
    "bindings": "^1.5.0",
    "node-addon-api": "^8.3.0"
  }
}
```

--------------------------------

### Unsafe API Exposure via Context Bridge (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/context-isolation

A cautionary example showing an unsafe way to expose IPC functionality directly through the `contextBridge`. This bypasses necessary argument filtering and allows arbitrary IPC messages, posing a significant security risk. Avoid this pattern in production applications.

```javascript
// ❌ Bad code  
contextBridge.exposeInMainWorld('myAPI', {  
  send: ipcRenderer.send  
})  
```

--------------------------------

### Minimize to Tray with Window All Closed Event

Source: https://www.electronjs.org/docs/latest/tutorial/tray

This code snippet demonstrates how to prevent an Electron application from quitting when all windows are closed, by listening to the 'window-all-closed' event on the app module. This is essential for keeping the system tray icon alive. It has no external dependencies beyond the core Electron 'app' module.

```javascript
app.on('window-all-closed', () => {
  // having this listener active will prevent the app from quitting.
})
```

--------------------------------

### Write Request Data Chunks in Electron.js

Source: https://www.electronjs.org/docs/latest/api/client-request

This code example demonstrates how to write data chunks to the request body using the `write` method in Electron.js. It shows the usage of the `chunk`, optional `encoding`, and `callback` parameters. The description notes that the callback is called asynchronously and does not guarantee data is flushed to the wire.

```javascript
request.write(chunk[, encoding][, callback])
```

--------------------------------

### Progress Bar and Overlay Icon

Source: https://www.electronjs.org/docs/latest/api/base-window

Manage the window's progress bar and taskbar overlay icon.

```APIDOC
## `win.setProgressBar(progress[, options])`

### Description
Sets the progress value for the window's progress bar. The valid range is [0, 1.0]. Progress < 0 removes the bar, and progress > 1 makes it indeterminate.

### Method
`setProgressBar`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **progress** (Double) - Required - The progress value [0, 1.0].
- **options** (Object, optional) - Additional options for the progress bar.
  - **mode** (string, optional, _Windows_) - Mode for the progress bar. Can be `none`, `normal`, `indeterminate`, `error`, or `paused`.

### Request Example
```json
{
  "progress": 0.75,
  "options": {
    "mode": "normal"
  }
}
```

### Response
#### Success Response (200)
No specific response body, operation is implicit.

## `win.setOverlayIcon(overlay, description)` _Windows_

### Description
Sets an overlay icon on the taskbar icon to convey application status.

### Method
`setOverlayIcon`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **overlay** (NativeImage | null) - Required - The 16x16 overlay icon, or `null` to clear.
- **description** (string) - Required - Accessibility description for the overlay.

### Request Example
```json
{
  "overlay": "<NativeImage data>",
  "description": "Download complete"
}
```

### Response
#### Success Response (200)
No specific response body, operation is implicit.
```

--------------------------------

### Electron.js Progress Bar Implementation with Timers (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/progress-bar

This code snippet demonstrates how to implement a progress bar in an Electron.js application using Node.js timers. It utilizes the `BrowserWindow.setProgressBar()` method to update the progress bar on the taskbar or dock. Values between 0 and 1 show progress, while values greater than 1 indicate an indeterminate state or 100%. Negative values remove the progress bar. This example uses `setInterval` to increment the progress and handles cleanup via `before-quit` and `window-all-closed` events.

```javascript
const { app, BrowserWindow } = require('electron/main')
  
let progressInterval  
  
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })
  
  win.loadFile('index.html')
  
  const INCREMENT = 0.03
  const INTERVAL_DELAY = 100 // ms

  let c = 0
  progressInterval = setInterval(() => {
    // update progress bar to next value
    // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
    win.setProgressBar(c)

    // increment or reset progress bar
    if (c < 2) {
      c += INCREMENT
    } else {
      c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
    }
  }, INTERVAL_DELAY)
}
  
app.whenReady().then(createWindow)
  
// before the app is terminated, clear both timers
app.on('before-quit', () => {
  clearInterval(progressInterval)
})
  
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
  
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

--------------------------------

### Capture Frame's Media with Electron.js Display Media Request Handler

Source: https://www.electronjs.org/docs/latest/api/session

This code example shows how to configure Electron.js's display media request handler to allow a web frame to capture its own video stream. By passing the `request.frame` object as the video source to the callback, the web content can record or stream its own visual output. This is useful for scenarios like screen sharing within a specific tab or application window.

```javascript
const { session } = require('electron')

session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
  // Allow the tab to capture itself.
  callback({ video: request.frame })
})
```

--------------------------------

### Set and Get Window Bounds - Electron

Source: https://www.electronjs.org/docs/latest/api/browser-window

Resizes and moves the window to the specified bounds (x, y, width, height). Properties not provided retain their current values. On Wayland, this has limitations similar to `setSize` and `setPosition`. The `getBounds()` method returns the current dimensions and position. On macOS, the y-coordinate is clamped to the tray height.

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow();

// Set all bounds properties
win.setBounds({ x: 440, y: 225, width: 800, height: 600 });

// Set a single bounds property
win.setBounds({ width: 100 });

// Get the current bounds
console.log(win.getBounds());
// Example output: { x: 440, y: 225, width: 100, height: 600 }
```

--------------------------------

### Swift GUI Display for Electron

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

Initializes and displays a native macOS window containing the SwiftUI `ContentView` for the todo list. This function is called from the Electron application to launch the GUI. It sets up the window, its content view, and makes it the active application window.

```swift
@objc
public static func helloGui() -> Void {
    let contentView = NSHostingView(rootView: ContentView(
        onTodoAdded: { todo in
            if let jsonString = encodeToJson(todo) {
                todoAddedCallback?(jsonString)
            }
        },
        onTodoUpdated: { todo in
            if let jsonString = encodeToJson(todo) {
                todoUpdatedCallback?(jsonString)
            }
        },
        onTodoDeleted: { todoId in
            todoDeletedCallback?(todoId.uuidString)
        }
    ))
    let window = NSWindow(
        contentRect: NSRect(x: 0, y: 0, width: 500, height: 500),
        styleMask: [.titled, .closable, .miniaturizable, .resizable],
        backing: .buffered,
        defer: false
    )

    window.title = "Todo List"
    window.contentView = contentView
    window.center()

    windowController = NSWindowController(window: window)
    windowController?.showWindow(nil)

    NSApp.activate(ignoringOtherApps: true)
}
```

--------------------------------

### Enable Dragging on Custom Title Bar in Electron

Source: https://www.electronjs.org/docs/latest/tutorial/custom-title-bar

Enables dragging of the custom title bar in Electron by adding the 'app-region: drag' CSS style. This allows users to reposition the application window. Uses the same BrowserWindow configuration as the basic custom title bar example.

```javascript
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    // remove the default titlebar
    titleBarStyle: 'hidden',
    // expose window controls in Windows/Linux
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
    <link href="./styles.css" rel="stylesheet">
    <title>Custom Titlebar App</title>
  </head>
  <body>
	  <!-- mount your title bar at the top of you application's body tag -->
    <div class="titlebar">Cool titlebar</div>
  </body>
</html>
```

```css
body {
  margin: 0;
}
.titlebar {
  height: 30px;
  background: blue;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  app-region: drag;
}
```

--------------------------------

### Execute JavaScript in Web Page - Electron webFrame

Source: https://www.electronjs.org/docs/latest/api/web-frame

This example shows how to execute arbitrary JavaScript code within the current web page using `webFrame.executeJavaScript`. It can optionally take a `userGesture` flag to bypass certain browser restrictions and a `callback` function to handle the result or errors. The method returns a Promise that resolves with the result or rejects on error.

```javascript
webFrame.executeJavaScript('document.querySelector("body").style.backgroundColor = "blue";', true).then((result) => {
  console.log('JavaScript executed successfully:', result)
}).catch((error) => {
  console.error('Failed to execute JavaScript:', error)
})
```

--------------------------------

### Manage User Activity for Handoff (macOS - ElectronJS)

Source: https://www.electronjs.org/docs/latest/api/app

Allows your Electron application on macOS to manage user activities for Handoff. You can set, get, invalidate, resign, and update the current user activity, enabling seamless continuation of tasks across Apple devices. This involves specifying activity types and user information.

```javascript
const { app } = require('electron')

// Set user activity for Handoff
const activityType = 'com.example.myapp.view-document'
const userInfo = { documentId: '123', pageNumber: 5 }
const webpageURL = 'https://example.com/document/123'
app.setUserActivity(activityType, userInfo, webpageURL)

// Get the current activity type
const currentActivityType = app.getCurrentActivityType()
console.log('Current Activity Type:', currentActivityType)

// Invalidate current activity
// app.invalidateCurrentActivity()

// Resign current activity (mark as inactive)
// app.resignCurrentActivity()

// Update current activity
// const updatedUserInfo = { pageNumber: 6 }
// app.updateCurrentActivity(activityType, updatedUserInfo)
```

--------------------------------

### Open Window with `target=_blank` and Custom Features

Source: https://www.electronjs.org/docs/latest/api/window-open

This JavaScript snippet illustrates opening a new browser window using `window.open()`. It specifies the URL, a target frame name (`_blank` for a new window), and a `features` string that includes options for positioning and disabling Node.js integration. This is a common way to launch external links or new application views.

```javascript
window.open('https://github.com', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no')
```

--------------------------------

### Preview File in Electron (macOS)

Source: https://www.electronjs.org/docs/latest/api/base-window

Uses macOS's Quick Look to preview a specified file. The `previewFile` method takes the absolute path to the file and an optional display name for the preview window. Quick Look determines the file type based on the file name and extension.

```javascript
// This method is specific to macOS
// const { BaseWindow } = require('electron')

// const win = new BaseWindow()

// // Preview a PDF file, displaying its original name
// win.previewFile('/path/to/your/document.pdf')

// // Preview an image file with a custom display name
// win.previewFile('/path/to/your/photo.jpg', 'Vacation Photo')
```

--------------------------------

### Basic Navigation (Back/Forward) with Electron NavigationHistory

Source: https://www.electronjs.org/docs/latest/tutorial/navigation-history

Shows how to implement simple back and forward navigation within an Electron application using the NavigationHistory class. It includes checks for whether navigation is possible before executing the actions.

```javascript
// Go back
if (navigationHistory.canGoBack()) {
  navigationHistory.goBack()
}

// Go forward
if (navigationHistory.canGoForward()) {
  navigationHistory.goForward()
```

--------------------------------

### Handling Detached WebFrameMain Instances in ElectronJS IPC

Source: https://www.electronjs.org/docs/latest/breaking-changes

Demonstrates best practices for accessing `WebFrameMain` properties within Electron's `ipcMain`. The examples highlight the importance of immediate access to `event.senderFrame` to avoid issues with detached frames, especially after cross-origin navigations, where late access may return `null`.

```javascript
ipcMain.on('unload-event', (event) => {  
  event.senderFrame // ✅ accessed immediately  
})  
  ipcMain.on('unload-event', async (event) => {  
  await crossOriginNavigationPromise  
  event.senderFrame // ❌ returns `null` due to late access  
})  
```

--------------------------------

### Get System Locale and Country Code (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/app

Retrieves the user's operating system country code and the current system locale. The country code is a two-letter ISO 3166 code. The system locale is fetched using OS-specific APIs or Chromium's i18n library. These functions should be called after the 'ready' event.

```javascript
const { app } = require('electron')

// Get the user operating system's locale two-letter ISO 3166 country code
const countryCode = app.getLocaleCountryCode()
console.log(countryCode)

// Get the current system locale
const systemLocale = app.getSystemLocale()
console.log(systemLocale)
```

--------------------------------

### Get Resource Usage Statistics

Source: https://www.electronjs.org/docs/latest/api/web-frame

Retrieves an object detailing the memory usage of various resource caches within the Blink rendering engine. This includes counts and sizes for images, scripts, CSS stylesheets, XSL stylesheets, fonts, and other cached resources. This data can be helpful for monitoring and optimizing memory consumption.

```javascript
const { webFrame } = require('electron')

const usage = webFrame.getResourceUsage()
console.log('Resource Usage:', usage)

// Example of accessing specific data:
console.log('Image count:', usage.images.count)
console.log('Script size:', usage.scripts.size)
```

--------------------------------

### Gracefully Show BrowserWindow with ready-to-show Event

Source: https://www.electronjs.org/docs/latest/api/browser-window

This code demonstrates how to prevent visual flashing when a BrowserWindow loads by using the 'ready-to-show' event. The window is initially hidden and shown only after the renderer has rendered the page. It depends on the 'electron' module.

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ show: false })
win.once('ready-to-show', () => {
  win.show()
})
```

--------------------------------

### Get Preferred System Languages (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/app

Fetches an array of the user's preferred system languages, ordered from most to least preferred. This API uses different native methods depending on the operating system (Windows, macOS, Linux). It's useful for determining the application's display language. The return values can differ significantly between OSs.

```javascript
const { app } = require('electron')

// Get preferred system languages
const preferredLanguages = app.getPreferredSystemLanguages()
console.log(preferredLanguages)
```

--------------------------------

### Generate Electron Testing Build Config (Windows PowerShell)

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

Generates the build configuration for a testing build of Electron on Windows using PowerShell. It uses the gn gen command with the appropriate arguments for testing builds.

```powershell
gn gen out/Testing --args="import(\"`"//electron/build/args/testing.gn`"")"  
```

--------------------------------

### Set Visual Zoom Level Limits - Electron webFrame

Source: https://www.electronjs.org/docs/latest/api/web-frame

This example shows how to set the minimum and maximum levels for visual zoom (pinch-to-zoom) using `setVisualZoomLevelLimits`. Visual zoom is disabled by default in Electron, and this method re-enables it with specified limits. Note that pinch-to-zoom is controlled separately from keyboard zoom shortcuts.

```javascript
webFrame.setVisualZoomLevelLimits(1, 3)
```

--------------------------------

### Renderer Process Logic for WebHID

Source: https://www.electronjs.org/docs/latest/tutorial/devices

The renderer process script handles user interaction for testing the WebHID API. It formats and displays lists of HID devices obtained using `navigator.hid.getDevices()` and `navigator.hid.requestDevice()`, triggered by a button click.

```javascript
function formatDevices (devices) {
  return devices.map(device => device.productName).join('<hr>')
}

async function testIt () {
  document.getElementById('granted-devices').innerHTML = formatDevices(await navigator.hid.getDevices())
  document.getElementById('granted-devices2').innerHTML = formatDevices(await navigator.hid.requestDevice({ filters: [] }))
}

document.getElementById('clickme').addEventListener('click', testIt)
```

--------------------------------

### Set Represented File and Edited State in Electron Main Process (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/represented-file

This JavaScript code snippet demonstrates how to set a represented filename and edited state for an Electron BrowserWindow. It uses `os.homedir()` to get the user's home directory as the represented file and sets the document edited state to true. This is typically run in the main process of an Electron application.

```javascript
const { app, BrowserWindow } = require('electron/main')
const os = require('node:os')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.setRepresentedFilename(os.homedir())
  win.setDocumentEdited(true)

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

--------------------------------

### Define Electron API Class in C++ Header (`api_name.h`)

Source: https://www.electronjs.org/docs/latest/development/creating-api

This C++ header file defines a new Electron API class `ApiName` that inherits from `gin::DeprecatedWrappable`. It includes methods for creating an instance and retrieving its object template builder and type name, essential for integrating with V8.

```cpp
#ifndef ELECTRON_SHELL_BROWSER_API_ELECTRON_API_{API_NAME}_H_
#define ELECTRON_SHELL_BROWSER_API_ELECTRON_API_{API_NAME}_H_

#include "gin/handle.h"
#include "gin/wrappable.h"

native namesspace electron {

native namesspace api {

class ApiName : public gin::DeprecatedWrappable<ApiName> {
 public:
  static gin::Handle<ApiName> Create(v8::Isolate* isolate);

  // gin::Wrappable
  static gin::DeprecatedWrapperInfo kWrapperInfo;
  gin::ObjectTemplateBuilder GetObjectTemplateBuilder(
      v8::Isolate* isolate) override;
  const char* GetTypeName() override;
}; // namespace api
} // namespace electron

```

--------------------------------

### Navigating to Specific History Entries with Electron

Source: https://www.electronjs.org/docs/latest/tutorial/navigation-history

Illustrates how to navigate to a specific point in the browsing history using `goToIndex` or `goToOffset` methods. It also shows how to check if navigating to a specific offset is possible before attempting the action.

```javascript
// Navigate to the 5th entry in the history, if the index is valid
navigationHistory.goToIndex(4)

// Navigate to the 2nd entry forward from the current position
if (navigationHistory.canGoToOffset(2)) {
  navigationHistory.goToOffset(2)
}
```

--------------------------------

### Load URL with Node.js path formatting

Source: https://www.electronjs.org/docs/latest/api/browser-window

Demonstrates how to load a local HTML file into a BrowserWindow using Node.js's path and URL formatting utilities. This ensures proper URL construction for file paths.

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow()

const url = require('node:url').format({
  protocol: 'file',
  slashes: true,
  pathname: require('node:path').join(__dirname, 'index.html')
})

win.loadURL(url)
```

--------------------------------

### Set Up Draggable HTML Element (HTML)

Source: https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop

This HTML snippet demonstrates how to create a draggable element by setting the `draggable="true"` attribute on a `div`. It also includes a reference to the renderer script that will handle the drag event. Ensure the `script` tag points to the correct renderer file.

```html
<div style="border:2px solid black;border-radius:3px;padding:5px;display:inline-block" draggable="true" id="drag">Drag me</div>  
<script src="renderer.js"></script>
```

--------------------------------

### Eagerly Load Dependencies in Node.js

Source: https://www.electronjs.org/docs/latest/tutorial/performance

Demonstrates a traditional Node.js approach where dependencies like 'fs' and 'foo-parser' are loaded immediately when the module is imported. This can lead to unnecessary work being done at application startup.

```javascript
const fs = require('node:fs')  
  
const fooParser = require('foo-parser')  
  
class Parser {
  constructor () {
    this.files = fs.readdirSync('.')  
  }
  
  getParsedFiles () {
    return fooParser.parse(this.files)
  }
}

const parser = new Parser()

module.exports = { parser }
```

--------------------------------

### Entitlements for App Sandbox (XML)

Source: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide

This XML defines the necessary entitlements for an Electron app to run under Apple's App Sandbox. It includes keys for enabling the sandbox and specifying application groups. Ensure TEAM_ID and your.bundle.id are replaced with your specific values.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.application-groups</key>
    <array>
      <string>TEAM_ID.your.bundle.id</string>
    </array>
  </dict>
</plist>
```

--------------------------------

### Build Native Addon using npm

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

Command to build the native addon using npm scripts. This typically involves running `node-gyp configure` and `node-gyp build` to compile C++ code into a Node.js compatible `.node` file.

```bash
npm run build
```

--------------------------------

### Import Electron Main Process Modules with TypeScript Alias (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

Shows how to import main process modules from 'electron/main' for improved type checking in TypeScript projects. This is an alternative to the standard 'require('electron')' for better static analysis.

```javascript
const { app, BrowserWindow } = require('electron/main')
```

--------------------------------

### Set Custom Spell Check Provider - Electron webFrame

Source: https://www.electronjs.org/docs/latest/api/web-frame

This example demonstrates setting up a custom spell check provider for a specific language ('en-US'). It requires disabling the default spellchecker in BrowserWindow options (`spellcheck: false`) and providing an object with a `spellCheck` method. The `spellCheck` method takes an array of words and a callback, returning any misspelled words asynchronously.

```javascript
const { webFrame } = require('electron')

const spellChecker = require('spellchecker')

webFrame.setSpellCheckProvider('en-US', {
  spellCheck (words, callback) {
    setTimeout(() => {
      const misspelled = words.filter(x => spellchecker.isMisspelled(x))
      callback(misspelled)
    }, 0)
  }
})
```

--------------------------------

### ClientRequest Constructor

Source: https://www.electronjs.org/docs/latest/api/client-request

Initializes a new ClientRequest instance to make HTTP/HTTPS requests. The constructor accepts either a URL string or an options object to configure the request.

```APIDOC
## new ClientRequest(options)

### Description
Creates a new `ClientRequest` object to make HTTP/HTTPS requests. The `options` parameter can be a string representing the URL or an object containing detailed request configurations.

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

#### Options Object
- **method** (string, optional) - The HTTP request method. Defaults to 'GET'.
- **url** (string, optional) - The absolute request URL (http or https). Must be provided if not using individual URL components.
- **headers** (Record<string, string | string[]>, optional) - Headers to send with the request.
- **session** (Session, optional) - The `Session` instance associated with the request.
- **partition** (string, optional) - The name of the `partition` for the request. Defaults to ''. Ignored if `session` is specified.
- **bypassCustomProtocolHandlers** (boolean, optional) - If true, custom protocol handlers for the URL's scheme will be bypassed. Defaults to `false`.
- **credentials** (string, optional) - Controls credential sending. Can be 'include', 'omit', or 'same-origin'.
- **useSessionCookies** (boolean, optional) - If true, cookies from the session will be sent. Ignored if `credentials` is specified. Defaults to `false`.
- **protocol** (string, optional) - The protocol scheme ('http:' or 'https:'). Defaults to 'http:'.
- **host** (string, optional) - The server host, including port ('hostname:port').
- **hostname** (string, optional) - The server host name.
- **port** (Integer, optional) - The server's listening port number.
- **path** (string, optional) - The path part of the request URL.
- **redirect** (string, optional) - Redirect mode: 'follow', 'error', or 'manual'. Defaults to 'follow'.
- **origin** (string, optional) - The origin URL of the request.
- **referrerPolicy** (string, optional) - Referrer policy for the request. Defaults to 'strict-origin-when-cross-origin'.
- **cache** (string, optional) - Cache mode: 'default', 'no-store', 'reload', 'no-cache', 'force-cache', or 'only-if-cached'.
- **priority** (string, optional) - Request priority: 'throttled', 'idle', 'lowest', 'low', 'medium', or 'highest'. Defaults to 'idle'.
- **priorityIncremental** (boolean, optional) - Controls incremental loading for HTTP extensible priorities. Defaults to `true`.

### Request Example
```javascript
const request = net.request({
  method: 'GET',
  protocol: 'https:',
  hostname: 'github.com',
  port: 443,
  path: '/'
})
```

### Response
#### Success Response (200)
No specific success response structure is defined for the constructor itself, as it returns a `ClientRequest` object.

#### Response Example
```json
{
  "requestObject": "ClientRequest instance"
}
```
```

--------------------------------

### Manually Rebuilding Native Modules with node-gyp for Electron

Source: https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules

Demonstrates the manual process of rebuilding a native Node.js module for a specific Electron version using `node-gyp`. This is useful for developers testing their native modules against Electron. It requires navigating to the module directory and executing `node-gyp rebuild` with target version, architecture, and distribution URL specified.

```bash
cd /path-to-module/
HOME=~/.electron-gyp node-gyp rebuild --target=1.2.3 --arch=x64 --dist-url=https://electronjs.org/headers
```

--------------------------------

### Initialize Swift Code Structure and Callbacks

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

Sets up the basic Swift class structure, including a method for basic string manipulation and setters for callbacks to handle todo item events (add, update, delete). It also includes a utility for encoding data to JSON, essential for inter-process communication with JavaScript.

```swift
import Foundation
import SwiftUI

@objc
public class SwiftCode: NSObject {
    private static var windowController: NSWindowController?
    private static var todoAddedCallback: ((String) -> Void)?
    private static var todoUpdatedCallback: ((String) -> Void)?
    private static var todoDeletedCallback: ((String) -> Void)?

    @objc
    public static func helloWorld(_ input: String) -> String {
        return "Hello from Swift! You said: (input)"
    }

    @objc
    public static func setTodoAddedCallback(_ callback: @escaping (String) -> Void) {
        todoAddedCallback = callback
    }

    @objc
    public static func setTodoUpdatedCallback(_ callback: @escaping (String) -> Void) {
        todoUpdatedCallback = callback
    }

    @objc
    public static func setTodoDeletedCallback(_ callback: @escaping (String) -> Void) {
        todoDeletedCallback = callback
    }

    private static func encodeToJson<T: Encodable>(_ item: T) -> String? {
        let encoder = JSONEncoder()

        // Encode date as milliseconds since 1970, which is what the JS side expects
        encoder.dateEncodingStrategy = .custom { date, encoder in
            let milliseconds = Int64(date.timeIntervalSince1970 * 1000)
            var container = encoder.singleValueContainer()
            try container.encode(milliseconds)
        }

        guard let jsonData = try? encoder.encode(item),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            return nil
        }
        return jsonString
    }

    // More code to follow...
}

```

--------------------------------

### Renderer Process WebUSB Device Interaction

Source: https://www.electronjs.org/docs/latest/tutorial/devices

Handles the interaction with the WebUSB API in the browser process. It defines a function `getDeviceDetails` to format device information and an asynchronous function `testIt` to retrieve and display granted USB devices using `navigator.usb.getDevices()` and `navigator.usb.requestDevice()`. An event listener is attached to the 'Test WebUSB' button to invoke `testIt`.

```javascript
function getDeviceDetails (device) {
  return device.productName || `Unknown device ${device.deviceId}`
}

async function testIt () {
  const noDevicesFoundMsg = 'No devices found'
  const grantedDevices = await navigator.usb.getDevices()
  let grantedDeviceList = ''
  if (grantedDevices.length > 0) {
    for (const device of grantedDevices) {
      grantedDeviceList += `<hr>${getDeviceDetails(device)}</hr>`
    }
  } else {
    grantedDeviceList = noDevicesFoundMsg
  }
  document.getElementById('granted-devices').innerHTML = grantedDeviceList

  grantedDeviceList = ''
  try {
    const grantedDevice = await navigator.usb.requestDevice({
      filters: []
    })
    grantedDeviceList += `<hr>${getDeviceDetails(grantedDevice)}</hr>`
  } catch (ex) {
    if (ex.name === 'NotFoundError') {
      grantedDeviceList = noDevicesFoundMsg
    }
  }
  document.getElementById('granted-devices2').innerHTML = grantedDeviceList
}

document.getElementById('clickme').addEventListener('click', testIt)
```

--------------------------------

### N-API C++ Addon for Node.js

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

Implements a Node.js addon using N-API, exposing a C++ class 'MyAddon' with a 'helloWorld' method. This method calls the C++ 'hello_world' function and handles type conversions between JavaScript and C++ strings.

```cpp
#include <napi.h>
#include <string>
#include "../include/cpp_code.h"

// Create a class that will be exposed to JavaScript
class MyAddon : public Napi::ObjectWrap<MyAddon> {
public:
    // This static method defines the class for JavaScript
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        // Define the JavaScript class with method(s)
        Napi::Function func = DefineClass(env, "MyAddon", {
            InstanceMethod("helloWorld", &MyAddon::HelloWorld)
        });

        // Create a persistent reference to the constructor
        Napi::FunctionReference* constructor = new Napi::FunctionReference();
        *constructor = Napi::Persistent(func);
        env.SetInstanceData(constructor);

        // Set the constructor on the exports object
        exports.Set("MyAddon", func);
        return exports;
    }

    // Constructor
    MyAddon(const Napi::CallbackInfo& info)
        : Napi::ObjectWrap<MyAddon>(info) {}

private:
    // Method that will be exposed to JavaScript
    Napi::Value HelloWorld(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        // Validate arguments (expecting one string)
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
            return env.Null();
        }

        // Convert JavaScript string to C++ string
        std::string input = info[0].As<Napi::String>();

        // Call our C++ function
        std::string result = cpp_code::hello_world(input);

        // Convert C++ string back to JavaScript string and return
        return Napi::String::New(env, result);
    }
};

// Initialize the addon
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    return MyAddon::Init(env, exports);
}

// Register the initialization function
NODE_API_MODULE(my_addon, Init)

```

--------------------------------

### Main: Receive and Handle MessagePort in Electron

Source: https://www.electronjs.org/docs/latest/tutorial/message-ports

Shows how to receive a MessagePort in the main process using ipcMain.on. It demonstrates listening for messages on the received port using the Node.js-style events API and calling .start() to begin message processing. Received data format is { answer: 42 }.

```javascript
// In the main process, we receive the port.  ipcMain.on('port', (event) => {
  // When we receive a MessagePort in the main process, it becomes a  
  // MessagePortMain.  
  const port = event.ports[0]
  
  // MessagePortMain uses the Node.js-style events API, rather than the  
  // web-style events API. So .on('message', ...) instead of .onmessage = ...  
  port.on('message', (event) => {
    // data is { answer: 42 }
    const data = event.data
  })
  
  // MessagePortMain queues messages until the .start() method has been called.  
  port.start()
})

```

--------------------------------

### Configure binding.gyp for Windows Addons

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

This configuration sets up a Windows-specific addon, including sources, include directories, libraries, and MSVS settings. It ensures the addon is compiled only on Windows and targets specific Windows libraries like `comctl32.lib` and `shcore.lib`.

```gyp
{
  "targets": [
    {
      "target_name": "cpp_addon",
      "conditions": [
        ['OS=="win"', {
          "sources": [
            "src/cpp_addon.cc",
            "src/cpp_code.cc"
          ],
          "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")",
            "include"
          ],
          "libraries": [
            "comctl32.lib",
            "shcore.lib"
          ],
          "dependencies": [
            "<!(node -p \"require('node-addon-api').gyp\")"
          ],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1,
              "DebugInformationFormat": "OldStyle",
              "AdditionalOptions": [
                "/FS"
              ]
            },
            "VCLinkerTool": {
              "GenerateDebugInformation": "true"
            }
          },
          "defines": [
            "NODE_ADDON_API_CPP_EXCEPTIONS",
            "WINVER=0x0A00",
            "_WIN32_WINNT=0x0A00"
          ]
        }]
      ]
    }
  ]
}

```

--------------------------------

### Accessing and Monitoring Service Workers with Electron JS

Source: https://www.electronjs.org/docs/latest/api/service-workers

This snippet demonstrates how to access the `ServiceWorkers` class via a session's default session and its `serviceWorkers` property. It shows how to retrieve all running service workers and how to listen for console messages emitted by service workers, including handling and logging message details. This is a core example of interacting with Electron's service worker management.

```javascript
const { session } = require('electron')

// Get all service workers.
console.log(session.defaultSession.serviceWorkers.getAllRunning())

// Handle logs and get service worker info
session.defaultSession.serviceWorkers.on('console-message', (event, messageDetails) => {
  console.log(
    'Got service worker message',
    messageDetails,
    'from',
    session.defaultSession.serviceWorkers.getFromVersionID(messageDetails.versionId)
  )
})
```

--------------------------------

### Define Node.js Addon Class with N-API (Objective-C++)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

This Objective-C++ code defines a C++ class 'SwiftAddon' that inherits from 'Napi::ObjectWrap' to create a Node.js addon. The 'Init' method registers this class and its instance methods ('helloWorld', 'helloGui', 'on') with Node.js, making them accessible from JavaScript. It also sets up a persistent constructor for the addon.

```cpp
#import <Foundation/Foundation.h>
#import "SwiftBridge.h"
#include <napi.h>

class SwiftAddon : public Napi::ObjectWrap<SwiftAddon> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        Napi::Function func = DefineClass(env, "SwiftAddon", {
            InstanceMethod("helloWorld", &SwiftAddon::HelloWorld),
            InstanceMethod("helloGui", &SwiftAddon::HelloGui),
            InstanceMethod("on", &SwiftAddon::On)
        });

        Napi::FunctionReference* constructor = new Napi::FunctionReference();
        *constructor = Napi::Persistent(func);
        env.SetInstanceData(constructor);

        exports.Set("SwiftAddon", func);
        return exports;
    }

    // More code to follow...

```

--------------------------------

### Window Focus and Visibility Methods (macOS)

Source: https://www.electronjs.org/docs/latest/api/app

Methods for controlling application focus, hiding, and showing windows, primarily for macOS.

```APIDOC
## `app.focus([options])`

### Description
On macOS, makes the application the active app. On Windows, focuses on the application's first window. On Linux, either focuses on the first visible window (X11) or requests focus but may instead show a notification or flash the app icon (Wayland). You should use the `steal` option as sparingly as possible.

### Parameters
- `options` (Object, optional)
  - `steal` (boolean, _macOS_) - Make the receiver the active app even if another app is currently active.

### Method
`app.focus([options])`
```

```APIDOC
## `app.hide()` _macOS_

### Description
Hides all application windows without minimizing them.

### Method
`app.hide() (_macOS_)
```

```APIDOC
## `app.isHidden()` _macOS_

### Description
Returns `true` if the application—including all of its windows—is hidden (e.g. with `Command-H`), `false` otherwise.

### Returns
- `boolean` - `true` if the app is hidden, `false` otherwise.

### Method
`app.isHidden() (_macOS_)
```

```APIDOC
## `app.show()` _macOS_

### Description
Shows application windows after they were hidden. Does not automatically focus them.

### Method
`app.show() (_macOS_)
```

--------------------------------

### Run Native Addon Test

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

Command to execute the Node.js test script for the native addon. This verifies that the addon is correctly built and callable from a JavaScript environment.

```bash
node test.js
```

--------------------------------

### Set Environment Variable for Windows on Arm Build

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

This command sets the `ELECTRON_BUILDING_WOA` environment variable to `1`, which is required for cross-compiling Electron for Windows on Arm (WOA). This is typically done before running `gclient sync` to fetch the necessary dependencies and tools.

```powershell
$env:ELECTRON_BUILDING_WOA=1
gclient sync -f --with_branch_heads --with_tags
```

--------------------------------

### Electron Main Process: Set up MessageChannelMain

Source: https://www.electronjs.org/docs/latest/tutorial/message-ports

Sets up a BrowserWindow with context isolation enabled and creates a MessageChannelMain. One end of the channel (port1) is sent to the renderer's preload script, while the other end (port2) is used for communication within the main process. Messages sent to port2 are logged, and replies are prepared.

```javascript
const { BrowserWindow, app, MessageChannelMain } = require('electron')
const path = require('node:path')

app.whenReady().then(async () => {
  const bw = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  bw.loadURL('index.html')

  const { port1, port2 } = new MessageChannelMain()

  port2.postMessage({ test: 21 })

  port2.on('message', (event) => {
    console.log('from renderer main world:', event.data)
  })
  port2.start()

  bw.webContents.postMessage('main-world-port', null, [port1])
})
```

--------------------------------

### NavigationHistory Class Methods

Source: https://www.electronjs.org/docs/latest/api/navigation-history

This section details the instance methods available for the NavigationHistory class, enabling control over browsing history.

```APIDOC
## NavigationHistory Class

> Manage a list of navigation entries, representing the user's browsing history within the application.

This class is not exported from the `'electron'` module directly. It is available as a return value from other Electron API methods.

### Instance Methods

#### `canGoBack()`

**Description:** Checks if the browser can navigate to the previous web page.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Returns:** `boolean` - `true` if the browser can go back, `false` otherwise.

#### `canGoForward()`

**Description:** Checks if the browser can navigate to the next web page.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Returns:** `boolean` - `true` if the browser can go forward, `false` otherwise.

#### `canGoToOffset(offset)`

**Description:** Determines if the browser can navigate to a specified relative offset from the current history entry.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Parameters:**
  #### Path Parameters
  N/A
  #### Query Parameters
  N/A
  #### Request Body
  N/A
  #### Path Parameters
  * **offset** (Integer) - Required - The relative position from the current entry to check.

**Returns:** `boolean` - `true` if the navigation is possible, `false` otherwise.

#### `clear()`

**Description:** Clears all entries from the navigation history.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

#### `getActiveIndex()`

**Description:** Retrieves the index of the current active navigation entry.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Returns:** `Integer` - The index of the current page.

#### `getEntryAtIndex(index)`

**Description:** Retrieves the navigation entry at a specific index in the history.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Parameters:**
  #### Path Parameters
  * **index** (Integer) - Required - The index of the navigation entry to retrieve.

**Returns:** `NavigationEntry` | `null` - The `NavigationEntry` object if the index is valid, otherwise `null`.

#### `goBack()`

**Description:** Navigates the browser to the previous web page in the history.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

#### `goForward()`

**Description:** Navigates the browser to the next web page in the history.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

#### `goToIndex(index)`

**Description:** Navigates the browser to a specific absolute index in the navigation history.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Parameters:**
  #### Path Parameters
  * **index** (Integer) - Required - The absolute index to navigate to.

#### `goToOffset(offset)`

**Description:** Navigates the browser to a relative offset from the current navigation entry.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Parameters:**
  #### Path Parameters
  * **offset** (Integer) - Required - The relative offset from the current entry.

#### `length()`

**Description:** Returns the total number of entries in the navigation history.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Returns:** `Integer` - The length of the history.

#### `removeEntryAtIndex(index)`

**Description:** Removes a navigation entry at a specific index from the history. Cannot remove the current active entry.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Parameters:**
  #### Path Parameters
  * **index** (Integer) - Required - The index of the entry to remove.

**Returns:** `boolean` - `true` if the entry was successfully removed, `false` otherwise.

#### `getAllEntries()`

**Description:** Retrieves all navigation entries currently in the history.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Returns:** `NavigationEntry[]` - An array of all `NavigationEntry` objects in the history.

#### `restore(options)`

**Description:** Restores the navigation history and loads a specified entry. It attempts to restore the state of individual pages, such as form values and scroll positions.

**Method:** N/A (Instance Method)

**Endpoint:** N/A

**Parameters:**
  #### Path Parameters
  N/A
  #### Query Parameters
  N/A
  #### Request Body
  * **options** (Object) - Required
    * **entries** (NavigationEntry[]) - Required - The array of navigation entries to restore, typically obtained from `getAllEntries()`.
    * **index** (Integer) - Optional - The index of the entry to load initially. If undefined, the last entry is loaded.

**Returns:** `Promise<void>` - Resolves when the page finishes loading the selected entry, or rejects if loading fails.

```

--------------------------------

### WebContents Configuration Options

Source: https://www.electronjs.org/docs/latest/api/structures/browser-window-options

This section outlines the available configuration options for WebContents, detailing their purpose, types, default values, and any specific notes or deprecations.

```APIDOC
## WebContents Configuration Options

### Description
This documentation details various boolean configuration options for WebContents in Electron.js, affecting features such as compilation, preferred sizing, background transparency, deprecated paste commands, and initial rendering behavior.

### Method
N/A (Configuration Options)

### Endpoint
N/A (Configuration Options)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body

- **bypassHeatCheckAndEagerCompile** (boolean) - Optional - Same as `bypassHeatCheck` except compilation is eager. Default policy is `code`.
- **enablePreferredSizeMode** (boolean) - Optional - Whether to enable preferred size mode. The preferred size is the minimum size needed to contain the layout of the document—without requiring scrolling. Enabling this will cause the `preferred-size-changed` event to be emitted on the `WebContents` when the preferred size changes. Default is `false`.
- **transparent** (boolean) - Optional - Whether to enable background transparency for the guest page. Default is `true`. **Note:** The guest page's text and background colors are derived from the color scheme of its root element. When transparency is enabled, the text color will still change accordingly but the background will remain transparent.
- **enableDeprecatedPaste** (boolean) - Optional, Deprecated - Whether to enable the `paste` execCommand. Default is `false`.
- **paintWhenInitiallyHidden** (boolean) - Optional - Whether the renderer should be active when `show` is `false` and it has just been created. In order for `document.visibilityState` to work correctly on first load with `show: false` you should set this to `false`. Setting this to `false` will cause the `ready-to-show` event to not fire. Default is `true`.

### Request Example
```json
{
  "bypassHeatCheckAndEagerCompile": true,
  "enablePreferredSizeMode": true,
  "transparent": false,
  "enableDeprecatedPaste": true,
  "paintWhenInitiallyHidden": false
}
```

### Response
#### Success Response (200)
N/A (These are configuration options, not API endpoints with direct responses)

#### Response Example
N/A
```

--------------------------------

### Swift Native Addon Structure for Electron

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

Defines the basic folder structure for a Swift native addon in Electron. Includes build configuration (binding.gyp), Objective-C bridge headers and implementation, Swift implementation, JavaScript interface, and package configuration.

```text
swift-native-addon/  
├── binding.gyp            # Build configuration  
├── include/  
│   └── SwiftBridge.h      # Objective-C header for the bridge  
├── js/  
│   └── index.js           # JavaScript interface  
├── package.json           # Package configuration  
└── src/  
    ├── SwiftCode.swift    # Swift implementation  
    ├── SwiftBridge.m      # Objective-C bridge implementation  
    └── swift_addon.mm     # Node.js addon implementation  

```

--------------------------------

### webContents.setWindowOpenHandler() Configuration

Source: https://www.electronjs.org/docs/latest/api/window-open

Shows how to set an override handler in the main process to customize or cancel the creation of windows opened from the renderer.

```APIDOC
## webContents.setWindowOpenHandler()

### Description
Sets an override handler in the main process to intercept and control the creation of windows opened from the renderer process. This allows for customization of `BrowserWindow` options or denial of window creation.

### Method
`webContents.setWindowOpenHandler(handler)`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **handler** (Function) - A function that receives an object with `url`, `frameName`, and `disposition` and returns an object specifying the action to take.
  - **action**: "allow", "deny", or "preprocess".
  - **overrideBrowserWindowOptions**: (optional) `BrowserWindowConstructorOptions` to use for creating the new window.
  - **outlivesOpener**: (optional) `boolean` - If true, the new window will not close when the opener window closes.

### Request Example
```javascript
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  if (url === 'about:blank') {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        frame: false,
        fullscreenable: false,
        backgroundColor: 'black',
        webPreferences: {
          preload: 'my-child-window-preload-script.js'
        }
      }
    }
  }
  return { action: 'deny' }
})
```

### Response
#### Success Response (200)
Indicates the handler has been set successfully. No specific return value is documented for the `setWindowOpenHandler` call itself, but the handler function's return value dictates the outcome.

#### Response Example
```json
{
  "action": "allow | deny | preprocess",
  "overrideBrowserWindowOptions": { ... },
  "outlivesOpener": true | false
}
```
```

--------------------------------

### Open Developer Tools for Webview (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/webview-tag

This JavaScript snippet demonstrates how to open the developer tools for a webview element. It listens for the `dom-ready` event before calling the `openDevTools` method.

```javascript
const webview = document.querySelector('webview')
webview.addEventListener('dom-ready', () => {
  webview.openDevTools()
})
```

--------------------------------

### Configure GitHub Publisher in Forge

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-publishing-updating

Sets up the GitHub Publisher plugin within the Electron Forge configuration file (forge.config.js). It requires the repository owner and name, and allows configuration of draft and prerelease options.

```javascript
module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'github-user-name',
          name: 'github-repo-name'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
}

```

--------------------------------

### desktopCapturer.getSources

Source: https://www.electronjs.org/docs/latest/api/desktop-capturer

Retrieves a list of available desktop media sources (screens or windows) that can be captured. This method is asynchronous and returns a Promise.

```APIDOC
## desktopCapturer.getSources(options)

### Description
Retrieves a list of available desktop media sources (screens or windows) that can be captured. This method is asynchronous and returns a Promise.

### Method
`desktopCapturer.getSources(options)`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
*   **options** (Object) - Configuration options for fetching sources.
    *   **types** (string[]) - Required - An array of strings specifying the types of sources to capture. Available types are `screen` and `window`.
    *   **thumbnailSize** (Size) - Optional - The desired size for the media source thumbnails. Defaults to 150x150. Setting width or height to 0 skips thumbnail generation.
    *   **fetchWindowIcons** (boolean) - Optional - If true, fetches window icons. Defaults to false. If false, `appIcon` property will be null.

### Request Example
```javascript
// Example of calling getSources
desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 100, height: 100 } }).then(async (sources) => {
  console.log(sources);
});
```

### Response
#### Success Response (Promise<DesktopCapturerSource[]>)
*   **DesktopCapturerSource[]** - An array of `DesktopCapturerSource` objects.
    *   **id** (string) - The ID of the source.
    *   **name** (string) - The name of the source (e.g., 'Entire screen' or window title).
    *   **thumbnail** (NativeImage) - A thumbnail image of the source.
    *   **appIcon** (NativeImage) - The icon of the window source (if `fetchWindowIcons` is true).
    *   **type** (string) - The type of the source (`screen` or `window`).

#### Response Example
```json
[
  {
    "id": "12345678-abcd-efgh-9012-ijklmnopqrs",
    "name": "Entire screen",
    "thumbnail": "<NativeImage object>",
    "appIcon": null,
    "type": "screen"
  },
  {
    "id": "98765432-dcba-hgfe-2109-ponmlkjihgf",
    "name": "My Electron App - Window",
    "thumbnail": "<NativeImage object>",
    "appIcon": "<NativeImage object>",
    "type": "window"
  }
]
```

### Caveats
*   On Linux with PipeWire, `getSources` may only return a single source for both screen and window captures.
*   Audio capture via `navigator.mediaDevices.getUserMedia` might have limitations on macOS without specific workarounds (e.g., Soundflower).
```

--------------------------------

### Configure App Login Item Settings (Windows)

Source: https://www.electronjs.org/docs/latest/api/app

Sets the application to open at login on Windows. It configures the path to a stub launcher executable and optional arguments. This is crucial for applications using autoUpdater with Squirrel on Windows.

```javascript
const { app } = require('electron')
const path = require('node:path')
const appFolder = path.dirname(process.execPath)
const ourExeName = path.basename(process.execPath)
const stubLauncher = path.resolve(appFolder, '..', ourExeName)

app.setLoginItemSettings({
  openAtLogin: true,
  path: stubLauncher,
  args: [
    // You might want to pass a parameter here indicating that this
    // app was launched via login, but you don't have to
  ]
})
```

--------------------------------

### View Constructor

Source: https://www.electronjs.org/docs/latest/api/view

Creates a new View instance.

```APIDOC
## `new View()`

Creates a new `View`.

### Example
```javascript
const { BaseWindow, View } = require('electron')

const win = new BaseWindow()
const view = new View()

win.contentView.addChildView(view)
```
```

--------------------------------

### Main Electron Process with Theme Management (main.js)

Source: https://www.electronjs.org/docs/latest/tutorial/dark-mode

The main process script that sets up the BrowserWindow and handles IPC messages for dark mode. It defines IPC handlers for toggling the theme and setting it to the system default, interacting with Electron's `nativeTheme` API.

```javascript
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

```

--------------------------------

### WebContents Configuration

Source: https://www.electronjs.org/docs/latest/api/structures/web-preferences

This section details the configuration options available for WebContents, including enabling preferred size mode, background transparency, and deprecated paste commands.

```APIDOC
## WebContents Configuration Options

### Description
Provides details on how to configure WebContents properties such as preferred size mode, background transparency, and deprecated paste command handling.

### Method
N/A (Configuration options)

### Endpoint
N/A (Configuration options)

### Parameters
#### Query Parameters
- **enablePreferredSizeMode** (boolean) - Optional - Whether to enable preferred size mode. The preferred size is the minimum size needed to contain the layout of the document—without requiring scrolling. Enabling this will cause the `preferred-size-changed` event to be emitted on the `WebContents` when the preferred size changes. Default is `false`.
- **transparent** (boolean) - Optional - Whether to enable background transparency for the guest page. Default is `true`. **Note:** The guest page's text and background colors are derived from the color scheme of its root element. When transparency is enabled, the text color will still change accordingly but the background will remain transparent.
- **enableDeprecatedPaste** (boolean) - Optional _Deprecated_ - Whether to enable the `paste` execCommand. Default is `false`.

### Request Example
(No specific request example as these are configuration options)

### Response
#### Success Response (200)
(No specific response as these are configuration options)

#### Response Example
(No specific response example as these are configuration options)
```

--------------------------------

### TouchBar Class

Source: https://www.electronjs.org/docs/latest/api/touch-bar

Details on the TouchBar class constructor and its available components for building touch bar interfaces.

```APIDOC
## TouchBar Class

### Description

Provides an API for creating and managing the native application touch bar.

### Constructor

- `new TouchBar(options)`: Initializes a new TouchBar instance.

### Static Properties

These are classes available for use within the TouchBar.

- `TouchBarButton`: Represents a button.
- `TouchBarColorPicker`: Represents a color picker.
- `TouchBarGroup`: Represents a group of items.
- `TouchBarLabel`: Represents a text label.
- `TouchBarPopover`: Represents a popover.
- `TouchBarScrubber`: Represents a scrubber control.
- `TouchBarSegmentedControl`: Represents a segmented control.
- `TouchBarSlider`: Represents a slider.
- `TouchBarSpacer`: Represents a spacer.
- `TouchBarOtherItemsProxy`: Represents a proxy for other items.

### Instance Properties

- `escapeItem`: Represents the escape item in the touch bar.
```

--------------------------------

### Configure binding.gyp for Swift Native Addon on macOS

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

This binding.gyp configuration sets up the build process for a Node.js native addon that integrates Swift code on macOS. It specifies source files, include directories, dependencies, libraries, and crucial Xcode settings for Swift compilation, Objective-C bridging, ARC, and runtime library paths. This configuration is essential for building the addon and linking the compiled Swift static library.

```gyp
{
  "targets": [{
    "target_name": "swift_addon",
    "conditions": [
      ['OS=="mac"', {
        "sources": [
          "src/swift_addon.mm",
          "src/SwiftBridge.m",
          "src/SwiftCode.swift"
        ],
        "include_dirs": [
          "<!@(node -p \"require('node-addon-api').include\")",
          "include",
          "build_swift"
        ],
        "dependencies": [
          "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        "libraries": [
          "<(PRODUCT_DIR)/libSwiftCode.a"
        ],
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "xcode_settings": {
          "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
          "CLANG_ENABLE_OBJC_ARC": "YES",
          "SWIFT_OBJC_BRIDGING_HEADER": "include/SwiftBridge.h",
          "SWIFT_VERSION": "5.0",
          "SWIFT_OBJC_INTERFACE_HEADER_NAME": "swift_addon-Swift.h",
          "MACOSX_DEPLOYMENT_TARGET": "11.0",
          "OTHER_CFLAGS": [
            "-ObjC++",
            "-fobjc-arc"
          ],
          "OTHER_LDFLAGS": [
            "-Wl,-rpath,@loader_path",
            "-Wl,-install_name,@rpath/libSwiftCode.a"
          ],
          "HEADER_SEARCH_PATHS": [
            "$(SRCROOT)/include",
            "$(CONFIGURATION_BUILD_DIR)",
            "$(SRCROOT)/build/Release",
            "$(SRCROOT)/build_swift"
          ]
        },
        "actions": []
      }]
    ]
  }]
}

```

--------------------------------

### Graceful Window Showing with `ready-to-show` Event

Source: https://www.electronjs.org/docs/latest/api/browser-window

Explains how to prevent visual flashes when loading pages by using the `ready-to-show` event. This event fires when the renderer has rendered the page for the first time, allowing the window to be shown without a flash.

```APIDOC
## Using the `ready-to-show` event

### Description
Shows the window gracefully after the renderer process has rendered the page for the first time.

### Method
`win.once('ready-to-show', callback)`

### Endpoint
N/A (Event listener on a BrowserWindow instance)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ show: false })
win.once('ready-to-show', () => {
  win.show()
})

win.loadURL('https://example.com')
```

### Response
#### Success Response (200)
N/A

#### Response Example
N/A
```

--------------------------------

### WebFrameMain Instance Methods

Source: https://www.electronjs.org/docs/latest/api/web-frame-main

Provides methods for interacting with a specific WebFrameMain instance, such as executing JavaScript, reloading, and sending messages.

```APIDOC
## Class: WebFrameMain

### Instance Methods

#### `frame.executeJavaScript(code[, userGesture])`

##### Description
Evaluates the given JavaScript `code` within the frame. You can optionally set `userGesture` to `true` to bypass restrictions on certain browser APIs that require user interaction.

##### Method
`frame.executeJavaScript(code[, userGesture])`

##### Parameters
- **code** (string) - Required - The JavaScript code to execute.
- **userGesture** (boolean) - Optional - Defaults to `false`. Set to `true` to simulate a user gesture.

##### Returns
- `Promise<unknown>` - A promise that resolves with the result of the executed code or rejects if execution fails.

#### `frame.reload()`

##### Description
Reloads the frame. This action will only fail if the frame has no navigation history.

##### Method
`frame.reload()`

##### Returns
- `boolean` - `true` if the reload was initiated successfully, `false` otherwise.

#### `frame.isDestroyed()`

##### Description
Checks if the frame has been destroyed.

##### Method
`frame.isDestroyed()`

##### Returns
- `boolean` - `true` if the frame is destroyed, `false` otherwise.

#### `frame.send(channel, ...args)`

##### Description
Sends an asynchronous message to the renderer process associated with this frame via the specified `channel`. Arguments are serialized using the Structured Clone Algorithm.

##### Method
`frame.send(channel, ...args)`

##### Parameters
- **channel** (string) - Required - The name of the channel to send the message on.
- **args** (any[]) - Optional - Any arguments to send with the message.

#### `frame.postMessage(channel, message, [transfer])`

##### Description
Sends a message to the renderer process. This method can also transfer ownership of `MessagePortMain` objects.

##### Method
`frame.postMessage(channel, message, [transfer])`

##### Parameters
- **channel** (string) - Required - The name of the channel to send the message on.
- **message** (any) - Required - The message payload to send.
- **transfer** (MessagePortMain[]) - Optional - An array of `MessagePortMain` objects to transfer ownership of.
```

--------------------------------

### Electron: Manage HID Device Permissions and Selection

Source: https://www.electronjs.org/docs/latest/api/session

This JavaScript code demonstrates how to set up permission handlers for HID devices in Electron. It includes logic to check permissions for specific devices and to handle the 'select-hid-device' event, allowing the application to choose a device when navigator.hid.requestDevice is called. Dependencies include Electron's app, BrowserWindow, and session modules.

```javascript
const { app, BrowserWindow } = require('electron')

let win = null

app.whenReady().then(() => {
  win = new BrowserWindow()

  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'hid') {
      // Add logic here to determine if permission should be given to allow HID selection
      return true
    }
    return false
  })

  // Optionally, retrieve previously persisted devices from a persistent store
  const grantedDevices = fetchGrantedDevices() // Assuming fetchGrantedDevices() is defined elsewhere

  win.webContents.session.setDevicePermissionHandler((details) => {
    if (new URL(details.origin).hostname === 'some-host' && details.deviceType === 'hid') {
      if (details.device.vendorId === 123 && details.device.productId === 345) {
        // Always allow this type of device (this allows skipping the call to `navigator.hid.requestDevice` first)
        return true
      }

      // Search through the list of devices that have previously been granted permission
      return grantedDevices.some((grantedDevice) => {
        return grantedDevice.vendorId === details.device.vendorId &&
              grantedDevice.productId === details.device.productId &&
              grantedDevice.serialNumber && grantedDevice.serialNumber === details.device.serialNumber
      })
    }
    return false
  })

  win.webContents.session.on('select-hid-device', (event, details, callback) => {
    event.preventDefault()
    const selectedDevice = details.deviceList.find((device) => {
      return device.vendorId === 9025 && device.productId === 67
    })
    callback(selectedDevice?.deviceId)
  })
})
```

--------------------------------

### HTML Structure for WebUSB API Test

Source: https://www.electronjs.org/docs/latest/tutorial/devices

Defines the basic HTML structure for the WebUSB API test page. It includes a button to trigger the WebUSB test and divs to display information about granted USB devices. It also includes a content security policy to restrict script sources and links to the `renderer.js` script.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>WebUSB API</title>
  </head>
  <body>
    <h1>WebUSB API</h1>

    <button id="clickme">Test WebUSB</button>

    <h3>USB devices automatically granted access via <i>setDevicePermissionHandler</i></h3>
    <div id="granted-devices"></div>

    <h3>USB devices automatically granted access via <i>select-usb-device</i></h3>
    <div id="granted-devices2"></div>

    <script src="./renderer.js"></script>
  </body>
</html>
```

--------------------------------

### Parent and Child Windows

Source: https://www.electronjs.org/docs/latest/api/browser-window

Describes how to create child windows using the `parent` option. Child windows are displayed on top of their parent window.

```APIDOC
## Parent and child windows

### Description
Creates a child window associated with a parent window.

### Method
`new BrowserWindow({ parent: parentWindow, ...options })`

### Endpoint
N/A

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
- **parent** (BrowserWindow) - Required - The parent BrowserWindow instance.

### Request Example
```javascript
const { BrowserWindow } = require('electron')

const top = new BrowserWindow()
const child = new BrowserWindow({ parent: top })
child.show()
top.show()
```

### Response
#### Success Response (200)
N/A

#### Response Example
N/A
```

--------------------------------

### Configure Git Cache for Electron Source

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

Sets up a shared git cache to accelerate subsequent checkouts of Electron source code, especially when working with multiple branches or parallel directories. This involves setting the GIT_CACHE_PATH environment variable and creating the cache directory.

```bash
export GIT_CACHE_PATH="${HOME}/.git_cache"
# This will use about 16G.
mkdir -p "${GIT_CACHE_PATH}"  
```

--------------------------------

### Creating Persistent and In-Memory Sessions in Electron

Source: https://www.electronjs.org/docs/latest/api/session

Shows how to create session objects using `session.fromPartition`. It explains the difference between persistent sessions (prefixed with 'persist:') and in-memory sessions, and how to retrieve the default session. The user agent is logged for demonstration.

```javascript
const { session } = require('electron')

const ses = session.fromPartition('persist:name')
console.log(ses.getUserAgent())
```

--------------------------------

### Create Parent and Child BaseWindows (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/base-window

Illustrates how to create a child BaseWindow that is associated with a parent BaseWindow. The child window will always appear on top of its parent.

```javascript
const { BaseWindow } = require('electron')

const parent = new BaseWindow()
const child = new BaseWindow({ parent })

```

--------------------------------

### Dock Download and Badge API

Source: https://www.electronjs.org/docs/latest/api/dock

Manage download indicators and badge text on the macOS dock icon.

```APIDOC
## Dock Download and Badge API

### Description
Methods for indicating download completion and setting custom badge text on the macOS dock icon.

### Methods

#### `dock.downloadFinished(filePath)` _macOS_

##### Description
Triggers a bounce animation for the Downloads stack if the provided file path is within the Downloads folder.

##### Parameters
- **filePath** (string) - The path to the finished download file.

#### `dock.setBadge(text)` _macOS_

##### Description
Sets the text displayed in the dock's badging area.

##### Parameters
- **text** (string) - The string to display as the badge.

##### Info
Requires notification permissions for the application to function.

#### `dock.getBadge()` _macOS_

##### Description
Retrieves the current badge string displayed on the dock icon.

##### Returns
`string` - The current badge string.


```

--------------------------------

### Node.js Package Configuration (package.json)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

Defines the metadata, scripts, and dependencies for a Node.js project that builds a native C++ addon for Electron. Includes build scripts for configuring and compiling the addon.

```json
{
  "name": "cpp-linux",
  "version": "1.0.0",
  "description": "A demo module that exposes C++ code to Electron",
  "main": "js/index.js",
  "scripts": {
    "clean": "rm -rf build",
    "build-electron": "electron-rebuild",
    "build": "node-gyp configure && node-gyp build"
  },
  "license": "MIT",
  "dependencies": {
    "node-addon-api": "^8.3.0",
    "bindings": "^1.5.0"
  }
}

```

--------------------------------

### Show Open Dialog for Files and Directories (ElectronJS)

Source: https://www.electronjs.org/docs/latest/api/dialog

This code demonstrates using `dialog.showOpenDialogSync` in ElectronJS to open a dialog that allows selection of both files and directories. Note that on Windows and Linux, if both 'openFile' and 'openDirectory' properties are set, only a directory selector will be shown.

```javascript
dialog.showOpenDialogSync(mainWindow, {
  properties: ['openFile', 'openDirectory']
})

```

--------------------------------

### app.moveToApplicationsFolder

Source: https://www.electronjs.org/docs/latest/api/app

Moves the application to the system's Applications folder on macOS, with an optional conflict handler.

```APIDOC
## `app.moveToApplicationsFolder([options])`

### Description
Attempts to move the current application to the system's Applications folder on macOS. It can handle conflicts with existing applications and may cause the app to quit and relaunch.

### Method
`app.moveToApplicationsFolder

### Endpoint
N/A (this is a method call on the app object)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **options** (Object) - Optional - Configuration options for the move operation.
  - **conflictHandler** (Function<boolean>) - Optional - A handler function that is called when a move conflict is detected. It receives the `conflictType` (`'exists'` or `'existsAndRunning'`) and should return `true` to proceed with default behavior or `false` to abort the move.

### Request Example
```javascript
const { app, dialog } = require('electron')

try {
  const success = app.moveToApplicationsFolder({
    conflictHandler: (conflictType) => {
      if (conflictType === 'exists') {
        return dialog.showMessageBoxSync({
          type: 'question',
          buttons: ['Halt Move', 'Continue Move'],
          defaultId: 0,
          message: 'An app of this name already exists. Continue move?'
        }) === 1
      }
      return true; // Default behavior for other conflict types
    }
  })
  if (success) {
    console.log('App moved successfully.')
  } else {
    console.log('App move was halted or cancelled.')
  }
} catch (error) {
  console.error('Failed to move app:', error)
}
```

### Response
#### Success Response
Returns `boolean` - `true` if the move was successful, `false` if the move was halted or cancelled by the user or handler. The application will quit and relaunch if the move is successful.

#### Response Example
```json
true
```

### Error Handling
This method throws errors if the move fails due to reasons other than user cancellation (e.g., insufficient permissions). If the user cancels an authorization dialog, the method returns `false`.
```

--------------------------------

### Configure Swift Build Actions in binding.gyp

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-swift-macos

Defines actions within binding.gyp to compile Swift code into a static library and copy it to the output directory. It uses 'swiftc' for compilation and 'install_name_tool' for fixing library paths, ensuring dynamic linker accessibility. The outputs include the compiled library and an Objective-C header.

```json
{
  "actions": [
    {
      "action_name": "build_swift",
      "inputs": [
        "src/SwiftCode.swift"
      ],
      "outputs": [
        "build_swift/libSwiftCode.a",
        "build_swift/swift_addon-Swift.h"
      ],
      "action": [
        "swiftc",
        "src/SwiftCode.swift",
        "-emit-objc-header-path", "./build_swift/swift_addon-Swift.h",
        "-emit-library", "-o", "./build_swift/libSwiftCode.a",
        "-emit-module", "-module-name", "swift_addon",
        "-module-link-name", "SwiftCode"
      ]
    },
    {
      "action_name": "copy_swift_lib",
      "inputs": [
        "<(module_root_dir)/build_swift/libSwiftCode.a"
      ],
      "outputs": [
        "<(PRODUCT_DIR)/libSwiftCode.a"
      ],
      "action": [
        "sh",
        "-c",
        "cp -f <(module_root_dir)/build_swift/libSwiftCode.a <(PRODUCT_DIR)/libSwiftCode.a && install_name_tool -id @rpath/libSwiftCode.a <(PRODUCT_DIR)/libSwiftCode.a"
      ]
    }
  ]
}
```

--------------------------------

### Preload Script: Expose Navigation API to Renderer

Source: https://www.electronjs.org/docs/latest/tutorial/navigation-history

Exposes a bridge (`electronAPI`) to the renderer process using `contextBridge` and `ipcRenderer`. This allows the renderer to invoke main process functions for navigation control, history retrieval, and listening for navigation updates.

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  goBack: () => ipcRenderer.invoke('nav:back'),
  goForward: () => ipcRenderer.invoke('nav:forward'),
  canGoBack: () => ipcRenderer.invoke('nav:canGoBack'),
  canGoForward: () => ipcRenderer.invoke('nav:canGoForward'),
  loadURL: (url) => ipcRenderer.invoke('nav:loadURL', url),
  getCurrentURL: () => ipcRenderer.invoke('nav:getCurrentURL'),
  getHistory: () => ipcRenderer.invoke('nav:getHistory'),
  onNavigationUpdate: (callback) => ipcRenderer.on('nav:updated', callback)
})
```

--------------------------------

### Window Resizability and Movability

Source: https://www.electronjs.org/docs/latest/api/browser-window

Methods for controlling whether the user can manually resize or move the window.

```APIDOC
## POST /window/resizable

### Description
Sets whether the window can be manually resized by the user.

### Method
POST

### Endpoint
/window/resizable

### Parameters
#### Request Body
- **resizable** (Boolean) - `true` to allow manual resizing, `false` otherwise.

### Request Example
```json
{
  "resizable": false
}
```

### Response
#### Success Response (200)
- **status** (String) - Indicates the success of the operation (e.g., "success").

#### Response Example
```json
{
  "status": "success"
}
```

## GET /window/resizable

### Description
Determines whether the window can be manually resized by the user.

### Method
GET

### Endpoint
/window/resizable

### Parameters
None

### Response
#### Success Response (200)
- **resizable** (Boolean) - `true` if the window is resizable, `false` otherwise.

#### Response Example
```json
{
  "resizable": false
}
```

## POST /window/movable

### Description
Sets whether the window can be moved by the user. This setting is not applicable on Linux.

### Method
POST

### Endpoint
/window/movable

### Parameters
#### Request Body
- **movable** (Boolean) - `true` to allow moving, `false` otherwise.

### Request Example
```json
{
  "movable": false
}
```

### Response
#### Success Response (200)
- **status** (String) - Indicates the success of the operation (e.g., "success").

#### Response Example
```json
{
  "status": "success"
}
```

## GET /window/movable

### Description
Determines whether the window can be moved by the user. On Linux, this always returns `true`.

### Method
GET

### Endpoint
/window/movable

### Parameters
None

### Response
#### Success Response (200)
- **movable** (Boolean) - `true` if the window is movable, `false` otherwise.

#### Response Example
```json
{
  "movable": true
}
```
```

--------------------------------

### Instance Properties - BaseWindow

Source: https://www.electronjs.org/docs/latest/api/base-window

Details the properties available on BaseWindow instances for managing window attributes like ID, visibility, and behavior.

```APIDOC
## Instance Properties - BaseWindow

Objects created with `new BaseWindow` have the following properties:

### `win.id` _Readonly_

* Type: `Integer`
* Description: A unique ID of the window. Each ID is unique among all `BaseWindow` instances of the entire Electron application.

### `win.contentView`

* Type: `View`
* Description: The content view of the window.

### `win.tabbingIdentifier` _macOS_ _Readonly_

* Type: `string` (optional)
* Description: Equal to the `tabbingIdentifier` passed to the `BrowserWindow` constructor or `undefined` if none was set.

### `win.autoHideMenuBar` _Linux_ _Windows_

* Type: `boolean`
* Description: Determines whether the window menu bar should hide itself automatically. Once set, the menu bar will only show when users press the single `Alt` key. If the menu bar is already visible, setting this property to `true` won't hide it immediately.

### `win.simpleFullScreen`

* Type: `boolean`
* Description: Determines whether the window is in simple (pre-Lion) fullscreen mode.

### `win.fullScreen`

* Type: `boolean`
* Description: Determines whether the window is in fullscreen mode.

### `win.focusable` _Windows_ _macOS_

* Type: `boolean`
* Description: Determines whether the window is focusable.

### `win.visibleOnAllWorkspaces` _macOS_ _Linux_

* Type: `boolean`
* Description: Determines whether the window is visible on all workspaces. Always returns `false` on Windows.

### `win.shadow`

* Type: `boolean`
* Description: Determines whether the window has a shadow.

### `win.menuBarVisible` _Windows_ _Linux_

* Type: `boolean`
* Description: Determines whether the menu bar should be visible. If the menu bar is auto-hide, users can still bring up the menu bar by pressing the single `Alt` key.

### `win.kiosk`

* Type: `boolean`
* Description: Determines whether the window is in kiosk mode.

### `win.documentEdited` _macOS_

* Type: `boolean`
* Description: Specifies whether the window’s document has been edited. The icon in the title bar will become gray when set to `true`.

### `win.representedFilename` _macOS_

* Type: `string`
* Description: Determines the pathname of the file the window represents, and the icon of the file will show in the window's title bar.

### `win.title`

* Type: `string`
* Description: Determines the title of the native window. The title of the web page can be different from the title of the native window.

### `win.minimizable` _macOS_ _Windows_

* Type: `boolean`
* Description: Determines whether the window can be manually minimized by user. On Linux the setter is a no-op, although the getter returns `true`.

### `win.maximizable` _macOS_ _Windows_

* Type: `boolean`
* Description: Determines whether the window can be manually maximized by user. On Linux the setter is a no-op, although the getter returns `true`.

### `win.fullScreenable`

* Type: `boolean`
* Description: Determines whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

### `win.resizable`

* Type: `boolean`
* Description: Determines whether the window can be manually resized by user.

### `win.closable` _macOS_ _Windows_

* Type: `boolean`
* Description: Determines whether the window can be manually closed by user. On Linux the setter is a no-op, although the getter returns `true`.

### `win.movable` _macOS_ _Windows_

* Type: `boolean`
* Description: Determines whether the window can be moved by user. On Linux the setter is a no-op, although the getter returns `true`.
```

--------------------------------

### Electron Offscreen Rendering with PNG Output (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering

This snippet demonstrates how to set up an Electron application for offscreen rendering. It disables hardware acceleration, creates a BrowserWindow with offscreen rendering enabled, loads a URL, and captures the rendered content as a PNG image on the 'paint' event. The frame rate is also set.

```javascript
const { app, BrowserWindow } = require('electron/main')  
const fs = require('node:fs')  
const path = require('node:path')  
  
app.disableHardwareAcceleration()  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600,  
    webPreferences: {  
      offscreen: true  
    }  
  })  
  
  win.loadURL('https://github.com')  
  win.webContents.on('paint', (event, dirty, image) => {  
    fs.writeFileSync('ex.png', image.toPNG())  
  })  
  win.webContents.setFrameRate(60)  
  console.log(`The screenshot has been successfully saved to ${path.join(process.cwd(), 'ex.png')}`)
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

--------------------------------

### Launch DPI-Aware GUI Thread (C++)

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

Launches a new GUI thread with Per-Monitor DPI awareness. It initializes common controls, registers a window class, creates a main window, and sets up various standard Windows controls with DPI-scaled dimensions and fonts. Includes a message loop for event handling.

```cpp
void hello_gui() {
  // Launch GUI in a separate thread
  std::thread guiThread([]() {
    // Enable Per-Monitor DPI awareness
    SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);

    // Initialize Common Controls
    INITCOMMONCONTROLSEX icex;
    icex.dwSize = sizeof(INITCOMMONCONTROLSEX);
    icex.dwICC = ICC_STANDARD_CLASSES | ICC_WIN95_CLASSES;
    InitCommonControlsEx(&icex);

    // Register window class
    WNDCLASSEXW wc = {};
    wc.cbSize = sizeof(WNDCLASSEXW);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = GetModuleHandle(nullptr);
    wc.lpszClassName = L"TodoApp";
    RegisterClassExW(&wc);

    // Get the DPI for the monitor
    UINT dpi = GetDpiForSystem();

    // Create window
    HWND hwnd = CreateWindowExW(
      0, L"TodoApp", L"Todo List",
      WS_OVERLAPPEDWINDOW,
      CW_USEDEFAULT, CW_USEDEFAULT,
      Scale(500, dpi), Scale(500, dpi),
      nullptr, nullptr,
      GetModuleHandle(nullptr), nullptr
    );

    if (hwnd == nullptr) {
      return;
    }

    // Create the modern font with DPI-aware size
    HFONT hFont = CreateFontW(
      -Scale(14, dpi),              // Height (scaled)
      0,                            // Width
      0,                            // Escapement
      0,                            // Orientation
      FW_NORMAL,                    // Weight
      FALSE,                        // Italic
      FALSE,                        // Underline
      FALSE,                        // StrikeOut
      DEFAULT_CHARSET,              // CharSet
      OUT_DEFAULT_PRECIS,           // OutPrecision
      CLIP_DEFAULT_PRECIS,          // ClipPrecision
      CLEARTYPE_QUALITY,            // Quality
      DEFAULT_PITCH | FF_DONTCARE,  // Pitch and Family
      L"Segoe UI"                   // Font face name
    );

    // Create input controls with scaled positions and sizes
    HWND hEdit = CreateWindowExW(0, WC_EDITW, L"",
      WS_CHILD | WS_VISIBLE | WS_BORDER | ES_AUTOHSCROLL,
      Scale(10, dpi), Scale(10, dpi),
      Scale(250, dpi), Scale(25, dpi),
      hwnd, (HMENU)1, GetModuleHandle(nullptr), nullptr);
    SendMessageW(hEdit, WM_SETFONT, (WPARAM)hFont, TRUE);

    // Create date picker
    HWND hDatePicker = CreateWindowExW(0, DATETIMEPICK_CLASSW, L"",
      WS_CHILD | WS_VISIBLE | DTS_SHORTDATECENTURYFORMAT,
      Scale(270, dpi), Scale(10, dpi),
      Scale(100, dpi), Scale(25, dpi),
      hwnd, (HMENU)4, GetModuleHandle(nullptr), nullptr);
    SendMessageW(hDatePicker, WM_SETFONT, (WPARAM)hFont, TRUE);

    HWND hButton = CreateWindowExW(0, WC_BUTTONW, L"Add",
      WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
      Scale(380, dpi), Scale(10, dpi),
      Scale(50, dpi), Scale(25, dpi),
      hwnd, (HMENU)2, GetModuleHandle(nullptr), nullptr);
    SendMessageW(hButton, WM_SETFONT, (WPARAM)hFont, TRUE);

    HWND hListBox = CreateWindowExW(0, WC_LISTBOXW, L"",
      WS_CHILD | WS_VISIBLE | WS_BORDER | WS_VSCROLL | LBS_NOTIFY,
      Scale(10, dpi), Scale(45, dpi),
      Scale(460, dpi), Scale(400, dpi),
      hwnd, (HMENU)3, GetModuleHandle(nullptr), nullptr);
    SendMessageW(hListBox, WM_SETFONT, (WPARAM)hFont, TRUE);

    ShowWindow(hwnd, SW_SHOW);

    // Message loop
    MSG msg = {};
    while (GetMessage(&msg, nullptr, 0, 0)) {
      TranslateMessage(&msg);
      DispatchMessage(&msg);
    }

    // Clean up
    DeleteObject(hFont);
  });

  // Detach the thread so it runs independently
  guiThread.detach();
}
```

--------------------------------

### Open DevTools with Options (JavaScript)

Source: https://www.electronjs.org/docs/latest/api/web-contents

Shows how to open the developer tools for a WebContents with specific options. The `options` object can control the dock state (`mode`), whether to activate the window (`activate`), and set a custom title when undocked or detached.

```javascript
// Example usage (assuming 'webContents' is an instance of WebContents)
// Open with default options
// webContents.openDevTools();

// Open detached
// webContents.openDevTools({ mode: 'detach' });

// Open with a custom title in undocked mode
// webContents.openDevTools({ mode: 'undocked', title: 'My Custom DevTools' });
```

--------------------------------

### IncomingMessage Class Overview

Source: https://www.electronjs.org/docs/latest/api/incoming-message

Overview of the IncomingMessage class, its events, and properties.

```APIDOC
## Class: IncomingMessage

### Description
Handles responses to HTTP/HTTPS requests. This class implements the Readable Stream interface and is therefore an EventEmitter.

### Instance Events

- **'data'**: Emitted when a chunk of response body data is received.
  - `chunk` Buffer - A chunk of response body's data.
- **'end'**: Emitted when the response body has ended.
- **'aborted'**: Emitted when a request has been canceled during an ongoing HTTP transaction.
- **'error'**: Emitted when an error was encountered while streaming response data.
  - `error` Error - An error object detailing the failure.

### Instance Properties

- **`statusCode`** (Integer): An integer indicating the HTTP response status code.
- **`statusMessage`** (string): A string representing the HTTP status message.
- **`headers`** (Record<string, string | string[]>): An object representing the HTTP response headers. Header names are lowercased, and duplicate headers are handled according to specific rules.
- **`httpVersion`** (string): A string indicating the HTTP protocol version number (e.g., '1.0', '1.1').
- **`httpVersionMajor`** (Integer): An integer indicating the HTTP protocol major version number.
- **`httpVersionMinor`** (Integer): An integer indicating the HTTP protocol minor version number.
- **`rawHeaders`** (string[]): An array containing the raw HTTP response headers exactly as they were received. Key-value pairs are in the same list.

### Request Example (Illustrative for property access)
```javascript
// Assuming 'response' is an IncomingMessage object
console.log(response.statusCode);
console.log(response.headers);
console.log(response.rawHeaders);
```

### Response Example (Illustrative for data event)
```javascript
response.on('data', (chunk) => {
  console.log(`Received data chunk: ${chunk}`);
});

response.on('end', () => {
  console.log('Response finished.');
});
```
```

--------------------------------

### Profile Module Loading with Node.js

Source: https://www.electronjs.org/docs/latest/tutorial/performance

This command generates CPU and heap profiles for a Node.js module, allowing analysis of its loading performance. It's useful for identifying slow-loading dependencies in Electron applications.

```bash
node --cpu-prof --heap-prof -e "require('request')"

```

--------------------------------

### Synchronize Electron Dependencies after Pull

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

Ensures that all dependencies required to build Electron, as defined in the DEPS file, are synchronized after pulling changes from the repository. This is crucial for maintaining build consistency.

```bash
cd src/electron  
git pull  
gclient sync -f  
```

--------------------------------

### App Control Methods

Source: https://www.electronjs.org/docs/latest/api/app

Methods for controlling the application's lifecycle, including quitting, exiting, and relaunching.

```APIDOC
## `app.quit()`

### Description
Try to close all windows. The `before-quit` event will be emitted first. If all windows are successfully closed, the `will-quit` event will be emitted and by default the application will terminate. This method guarantees that all `beforeunload` and `unload` event handlers are correctly executed. It is possible that a window cancels the quitting by returning `false` in the `beforeunload` event handler.

### Method
`app.quit()
```

```APIDOC
## `app.exit([exitCode])`

### Description
Exits immediately with `exitCode`. `exitCode` defaults to 0. All windows will be closed immediately without asking the user, and the `before-quit` and `will-quit` events will not be emitted.

### Parameters
- `exitCode` (Integer, optional) - The exit code for the application.

### Method
`app.exit([exitCode])`
```

```APIDOC
## `app.relaunch([options])`

### Description
Relaunches the app when the current instance exits. By default, the new instance will use the same working directory and command line arguments as the current instance. When `args` is specified, the `args` will be passed as the command line arguments instead. When `execPath` is specified, the `execPath` will be executed for the relaunch instead of the current app. Note that this method does not quit the app when executed; you have to call `app.quit` or `app.exit` after calling `app.relaunch` to make the app restart. When `app.relaunch` is called multiple times, multiple instances will be started after the current instance exits.

### Parameters
- `options` (Object, optional)
  - `args` (string[], optional) - Command line arguments for the new instance.
  - `execPath` (string, optional) - The executable path for the new instance.

### Method
`app.relaunch([options])`

### Request Example
```javascript
const { app } = require('electron')

app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
app.exit(0)
```
```

--------------------------------

### TouchBarPopover Constructor

Source: https://www.electronjs.org/docs/latest/api/touch-bar-popover

Creates a new TouchBarPopover instance for the macOS touch bar.

```APIDOC
## `new TouchBarPopover(options)`

### Description
Creates a popover in the touch bar for native macOS applications. This class is not directly exported from the 'electron' module but is available as a return value from other Electron API methods.

### Method
Constructor

### Endpoint
N/A (Class Constructor)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
* **options** (Object) - Required - Configuration options for the popover.
  * **label** (string) - Optional - The text displayed on the popover button.
  * **icon** (NativeImage) - Optional - The icon displayed on the popover button.
  * **items** (TouchBar) - Required - The content to display within the popover.
  * **showCloseButton** (boolean) - Optional - Determines if a close button is shown on the left of the popover. Defaults to `true`.

### Request Example
```json
{
  "label": "My Popover",
  "icon": "path/to/icon.png",
  "items": "<TouchBar Object>",
  "showCloseButton": false
}
```

### Response
#### Success Response (200)
N/A (Constructor returns an instance)

#### Response Example
N/A
```

--------------------------------

### VS Code Debugger Configuration for Electron.js

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app

This JSON configuration allows VS Code to attach to both the main Node.js process and the renderer Chrome process of an Electron application. It defines individual configurations for 'Main' and 'Renderer' and a compound configuration 'Main + renderer' to run them concurrently. The 'Main' configuration launches the Electron executable and exposes a remote debugging port, while the 'Renderer' configuration attaches to that port using a Chrome debugger.

```json
{
  "version": "0.2.0",
  "compounds": [
    {
      "name": "Main + renderer",
      "configurations": ["Main", "Renderer"],
      "stopAll": true
    }
  ],
  "configurations": [
    {
      "name": "Renderer",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}"
    },
    {
      "name": "Main",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": [".", "--remote-debugging-port=9222"],
      "outputCapture": "std",
      "console": "integratedTerminal"
    }
  ]
}
```

--------------------------------

### JavaScript Fallback for Native Addon

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

Provides a JavaScript-based fallback for the 'helloWorld' function when the native addon is not supported on the current platform. It logs a warning and exports a JS implementation of the function.

```javascript
else {
  // Provide a fallback for unsupported platforms
  console.warn('Native addon not supported on this platform')

  module.exports = {
    helloWorld: (input) => `Hello from JS! You said: ${input}`
  }
}
```

--------------------------------

### Test Native Addon with Node.js Script

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

A JavaScript test script to verify the functionality of the native addon. It loads the addon using `require` and calls the 'helloWorld' function, printing the result to the console.

```javascript
// Load our addon
const myAddon = require('./js')

// Try the helloWorld function
const result = myAddon.helloWorld('This is a test')

// Should print: "Hello from C++! You said: This is a test"
console.log(result)
```

--------------------------------

### Safely Expose API with Context Isolation Enabled (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/context-isolation

Illustrates the recommended method for exposing APIs from a preload script to the renderer process when context isolation is enabled, using Electron's `contextBridge`. This ensures a secure, isolated communication channel. The API remains accessible on `window.myAPI` in the renderer.

```javascript
// preload with contextIsolation enabled  
const { contextBridge } = require('electron')  
  
contextBridge.exposeInMainWorld('myAPI', {  
  doAThing: () => {}  
})  
```

```javascript
// use the exposed API in the renderer  
window.myAPI.doAThing()  
```

--------------------------------

### TouchBarButton Constructor

Source: https://www.electronjs.org/docs/latest/api/touch-bar-button

Creates a new TouchBarButton instance with specified options for display and behavior in the macOS touch bar.

```APIDOC
## new TouchBarButton(options)

### Description
Creates a button that can be displayed in the native macOS touch bar. This class is not directly exported from the 'electron' module but is available as a return value from other Electron API methods.

### Method
`new`

### Endpoint
N/A (Constructor)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **options** (Object) - Required - Configuration options for the button.
  * **label** (string) - Optional - The text to display on the button.
  * **accessibilityLabel** (string) - Optional - A short description for screen readers (e.g., VoiceOver).
  * **backgroundColor** (string) - Optional - The background color of the button in hex format (e.g., "#ABCDEF").
  * **icon** (NativeImage | string) - Optional - The icon to display on the button.
  * **iconPosition** (string) - Optional - Specifies the icon's position relative to the label. Can be 'left', 'right', or 'overlay'. Defaults to 'overlay'.
  * **click** (Function) - Optional - A callback function executed when the button is clicked.
  * **enabled** (boolean) - Optional - Determines if the button is interactive. Defaults to `true`.

### Request Example
```json
{
  "label": "My Button",
  "backgroundColor": "#007AFF",
  "icon": "path/to/icon.png",
  "click": "() => console.log('Button clicked!')"
}
```

### Response
#### Success Response (200)
An instance of `TouchBarButton`.

#### Response Example
```json
{
  "type": "TouchBarButton",
  "label": "My Button",
  "backgroundColor": "#007AFF",
  "iconPosition": "overlay",
  "enabled": true
}
```
```

--------------------------------

### Renderer Script: Invoke IPC Ping Function

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

This JavaScript code snippet runs in the Electron renderer process. It defines an asynchronous function `func` that calls the `ping` function exposed via the `window.versions` object (from the preload script). This triggers an IPC message to the main process, and logs the response ('pong') to the console.

```javascript
const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

func()

```

--------------------------------

### Download URL in Webview

Source: https://www.electronjs.org/docs/latest/api/webview-tag

Initiates a download for the resource at the specified URL without navigating the webview.

```APIDOC
## `<webview>.downloadURL(url[, options])`

### Description
Initiates a download of the resource at `url` without navigating the webview.

### Method
`<webview>.downloadURL(url, options)`

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **url** (string) - The URL of the resource to download.
- **options** (object, optional) - Configuration options for the download:
  - **headers** (Record<string, string>, optional) - HTTP request headers for the download request.
```

--------------------------------

### Preview File with QuickLook - Electron (macOS)

Source: https://www.electronjs.org/docs/latest/api/browser-window

Uses macOS's Quick Look feature to preview a specified file. The `path` must be absolute and determines the file type shown. An optional `displayName` can be provided for visual purposes, otherwise the `path` is used. To close the preview, use `win.closeFilePreview()`.

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow();

// Preview a file, using its path as the display name
win.previewFile('/path/to/your/document.pdf');

// Preview a file with a custom display name
win.previewFile('/path/to/your/image.png', 'My Awesome Image');

// Close the Quick Look panel
// win.closeFilePreview();
```

--------------------------------

### Electron Main Process for Web Serial

Source: https://www.electronjs.org/docs/latest/tutorial/devices

This Node.js code configures the main process of an Electron application to handle serial port permissions and selections. It uses `setPermissionCheckHandler` and `setDevicePermissionHandler` to grant access to serial devices from the main process and listens for `select-serial-port`, `serial-port-added`, and `serial-port-removed` events to manage available ports. It loads the `index.html` file and opens the developer tools.

```javascript
const { app, BrowserWindow } = require('electron/main')  
  
function createWindow () {  
  const mainWindow = new BrowserWindow({  
    width: 800,  
    height: 600  
  })  
  
  mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {  
    // Add listeners to handle ports being added or removed before the callback for `select-serial-port`  
    // is called.  
    mainWindow.webContents.session.on('serial-port-added', (event, port) => {  
      console.log('serial-port-added FIRED WITH', port)  
      // Optionally update portList to add the new port  
    })  
  
    mainWindow.webContents.session.on('serial-port-removed', (event, port) => {  
      console.log('serial-port-removed FIRED WITH', port)  
      // Optionally update portList to remove the port  
    })  
  
    event.preventDefault()  
    if (portList && portList.length > 0) {  
      callback(portList[0].portId)  
    } else {  
      // eslint-disable-next-line n/no-callback-literal  
      callback('') // Could not find any matching devices  
    }  
  })  
  
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {  
    if (permission === 'serial' && details.securityOrigin === 'file:///') {  
      return true  
    }  
  
    return false  
  })  
  
  mainWindow.webContents.session.setDevicePermissionHandler((details) => {  
    if (details.deviceType === 'serial' && details.origin === 'file://') {  
      return true  
    }  
  
    return false  
  })  
  
  mainWindow.loadFile('index.html')  
  
  mainWindow.webContents.openDevTools()  
}  
  
app.whenReady().then(() => {  
  createWindow()  
  
  app.on('activate', function () {  
    if (BrowserWindow.getAllWindows().length === 0) createWindow()  
  })  
})  
  
app.on('window-all-closed', function () {  
  if (process.platform !== 'darwin') app.quit()  
})
```

--------------------------------

### Initialize GTK Application in C++

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

This C++ code initializes and runs a GTK application within its own thread. It sets up the GTK application, connects action entries, loads a UI from an XML string, and manages the main loop. This is crucial for integrating native GTK UIs with Electron.

```cpp
static gboolean init_gtk_app(gpointer user_data)  
  {
    auto *app = static_cast<GtkApplication *>(user_data);  
    g_application_run(G_APPLICATION(app), 0, nullptr);  
    g_object_unref(app);  
    if (g_main_loop)
    {
      g_main_loop_quit(g_main_loop);
    }
    return G_SOURCE_REMOVE;
  }
  
  static void activate_handler(GtkApplication *app, gpointer user_data)
  {
    auto *builder = gtk_builder_new();

    const GActionEntry app_actions[] = {
        {"edit", edit_action, nullptr, nullptr, nullptr, {0, 0, 0}},
        {"delete", delete_action, nullptr, nullptr, nullptr, {0, 0, 0}}};
    g_action_map_add_action_entries(G_ACTION_MAP(app), app_actions,
                                    G_N_ELEMENTS(app_actions), builder);

    gtk_builder_add_from_string(builder,
                                "<?xml version="1.0" encoding="UTF-8"?>"
                                "<interface>"
                                "  <object class="GtkWindow" id="window">"
                                "    <property name="title">Todo List</property>"
                                "    <property name="default-width">400</property>"
                                "    <property name="default-height">500</property>"
                                "    <child>"
                                "      <object class="GtkBox">"
                                "        <property name="visible">true</property>"
                                "        <property name="orientation">vertical</property>"
                                "        <property name="spacing">6</property>"
                                "        <property name="margin">12</property>"
                                "        <child>"
                                "          <object class="GtkBox">"
                                "            <property name="visible">true</property>"
                                "            <property name="spacing">6</property>"
                                "            <child>"
                                "              <object class="GtkEntry" id="todo_entry">"
                                "                <property name="visible">true</property>"
                                "                <property name="hexpand">true</property>"
                                "                <property name="placeholder-text">Enter todo item...</property>"
                                "              </object>"
                                "            </child>"
                                "            <child>"
                                "              <object class="GtkCalendar" id="todo_calendar">"
                                "                <property name="visible">true</property>"
                                "              </object>"
                                "            </child>"
                                "            <child>"
                                "              <object class="GtkButton" id="add_button">"
                                "                <property name="visible">true</property>"
                                "                <property name="label">Add</property>"
                                "              </object>"
                                "            </child>"
                                "          </object>"
                                "        </child>"
                                "        <child>"
                                "          <object class="GtkScrolledWindow">"
                                "            <property name="visible">true</property>"
                                "            <property name="vexpand">true</property>"
                                "            <child>"
                                "              <object class="GtkListBox" id="todo_list">"
                                "                <property name="visible">true</property>"
                                "                <property name="selection-mode">single</property>"
                                "              </object>"
                                "            </child>"
                                "          </object>"
                                "        </child>"
                                "      </object>"
                                "    </child>"
                                "  </object>"
                                "</interface>",
                                nullptr); 
  }
```

--------------------------------

### Preload Script: Expose Electron Versions and IPC Ping

Source: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

This JavaScript code snippet is for an Electron preload script. It uses `contextBridge` to securely expose Node.js environment versions (Chrome, Node, Electron) and an IPC 'ping' function to the main world of the renderer process. The 'ping' function utilizes `ipcRenderer.invoke` to communicate with the main process.

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
})

```

--------------------------------

### Preload Script for Webview

Source: https://www.electronjs.org/docs/latest/api/webview-tag

The `preload` attribute specifies a JavaScript file to be loaded before any other scripts in the guest page. The script's URL must use the `file:` protocol. This script has access to Node.js APIs even if node integration is disabled in the guest page.

```html
<!-- from a file -->
<webview src="https://www.github.com/" preload="./test.js"></webview>
<!-- or if you want to load from an asar archive -->
<webview src="https://www.github.com/" preload="./app.asar/test.js"></webview>
```

--------------------------------

### BrowserView Instance Properties

Source: https://www.electronjs.org/docs/latest/api/browser-view

Properties available on BrowserView instances.

```APIDOC
## BrowserView Instance Properties

### Description
Properties accessible on `BrowserView` objects.

### Instance Properties
#### `webContents`
- **Type**: `WebContents`
- **Description**: A `WebContents` object owned by this view. This property is experimental and deprecated.
```

--------------------------------

### Signing Electron App for Development (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide

This JavaScript code snippet demonstrates how to sign an Electron app for development using the `@electron/osx-sign` module. It requires specifying the app path, the 'Apple Development' identity, and the provisioning profile.

```javascript
const { signAsync } = require('@electron/osx-sign')

signAsync({
  app: '/path/to/your.app',
  identity: 'Apple Development',
  provisioningProfile: '/path/to/your.provisionprofile'
})
```

--------------------------------

### JavaScript Wrapper for C++ Addon

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

Creates a JavaScript wrapper class 'MyNativeAddon' that extends EventEmitter and instantiates the native C++ addon. It provides a convenient 'helloWorld' method that validates input and calls the underlying C++ function.

```javascript
const EventEmitter = require('node:events')

// Load the native addon using the 'bindings' module
// This will look for the compiled .node file in various places
const bindings = require('bindings')
const native = bindings('my_addon')

// Create a nice JavaScript wrapper
class MyNativeAddon extends EventEmitter {
  constructor () {
    super()

    // Create an instance of our C++ class
    this.addon = new native.MyAddon()
  }

  // Wrap the C++ method with a nicer JavaScript API
  helloWorld (input = '') {
    if (typeof input !== 'string') {
      throw new TypeError('Input must be a string')
    }
    return this.addon.helloWorld(input)
  }
}

// Export a singleton instance
if (process.platform === 'win32' || process.platform === 'darwin' || process.platform === 'linux') {
  module.exports = new MyNativeAddon()
}

```

--------------------------------

### C++ Electron Addon Core Functionality

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-linux

This C++ code implements core functionalities for an Electron.js addon, including a basic 'hello_world' function, a 'TodoItem' data structure with JSON serialization and date formatting, and mechanisms for managing GTK widgets and asynchronous callbacks. It sets up a separate GTK main loop thread to handle UI events and communicate back to the JavaScript environment. Dependencies include GTK, uuid, chrono, and thread.

```cpp
#include <gtk/gtk.h>
#include <string>
#include <functional>
#include <chrono>
#include <vector>
#include <uuid/uuid.h>
#include <ctime>
#include <thread>
#include <memory>

using TodoCallback = std::function<void(const std::string &)>;

namespace cpp_code
{

  // Basic functions
  std::string hello_world(const std::string &input)
  {
    return "Hello from C++! You said: " + input;
  }

  // Data structures
  struct TodoItem
  {
    uuid_t id;
    std::string text;
    int64_t date;

    std::string toJson() const
    {
      char uuid_str[37];
      uuid_unparse(id, uuid_str);
      return "{"
             ""id":"" + 
             std::string(uuid_str) + "","
                                     "text":"" + 
             text + "","
                    "date":"" + 
             std::to_string(date) + 
             "}";
    }

    static std::string formatDate(int64_t timestamp)
    {
      char date_str[64];
      time_t unix_time = timestamp / 1000;
      strftime(date_str, sizeof(date_str), "%Y-%m-%d", localtime(&unix_time));
      return date_str;
    }
  };

  // Forward declarations
  static void update_todo_row_label(GtkListBoxRow *row, const TodoItem &todo);
  static GtkWidget *create_todo_dialog(GtkWindow *parent, const TodoItem *existing_todo);

  // Global state
  namespace
  {
    TodoCallback g_todoAddedCallback;
    TodoCallback g_todoUpdatedCallback;
    TodoCallback g_todoDeletedCallback;
    GMainContext *g_gtk_main_context = nullptr;
    GMainLoop *g_main_loop = nullptr;
    std::thread *g_gtk_thread = nullptr;
    std::vector<TodoItem> g_todos;
  }

  // Helper functions
  static void notify_callback(const TodoCallback &callback, const std::string &json)
  {
    if (callback && g_gtk_main_context)
    {
      g_main_context_invoke(g_gtk_main_context, [](gpointer data) -> gboolean
                            {
            auto* cb_data = static_cast<std::pair<TodoCallback, std::string>*>(data);
            cb_data->first(cb_data->second);
            delete cb_data;
            return G_SOURCE_REMOVE; }, new std::pair<TodoCallback, std::string>(callback, json));
    }
  }

  static void update_todo_row_label(GtkListBoxRow *row, const TodoItem &todo)
  {
    auto *label = gtk_label_new((todo.text + " - " + TodoItem::formatDate(todo.date)).c_str());
    auto *old_label = GTK_WIDGET(gtk_container_get_children(GTK_CONTAINER(row))->data);
    gtk_container_remove(GTK_CONTAINER(row), old_label);
    gtk_container_add(GTK_CONTAINER(row), label);
    gtk_widget_show_all(GTK_WIDGET(row));
  }

  static GtkWidget *create_todo_dialog(GtkWindow *parent, const TodoItem *existing_todo = nullptr)
  {
    auto *dialog = gtk_dialog_new_with_buttons(
        existing_todo ? "Edit Todo" : "Add Todo",
        parent,
        GTK_DIALOG_MODAL,
        "_Cancel", GTK_RESPONSE_CANCEL,
        "_Save", GTK_RESPONSE_ACCEPT,
        nullptr);

    auto *content_area = gtk_dialog_get_content_area(GTK_DIALOG(dialog));
    gtk_container_set_border_width(GTK_CONTAINER(content_area), 10);

    auto *entry = gtk_entry_new();
    if (existing_todo)
    {
      gtk_entry_set_text(GTK_ENTRY(entry), existing_todo->text.c_str());
    }
    gtk_container_add(GTK_CONTAINER(content_area), entry);

    auto *calendar = gtk_calendar_new();
    if (existing_todo)
    {
      time_t unix_time = existing_todo->date / 1000;
      struct tm *timeinfo = localtime(&unix_time);
      gtk_calendar_select_month(GTK_CALENDAR(calendar), timeinfo->tm_mon, timeinfo->tm_year + 1900);
      gtk_calendar_select_day(GTK_CALENDAR(calendar), timeinfo->tm_mday);
    }
    gtk_container_add(GTK_CONTAINER(content_area), calendar);

    gtk_widget_show_all(dialog);
    return dialog;
  }

  static void edit_action(GSimpleAction *action, GVariant *parameter, gpointer user_data)
  {
    auto *builder = static_cast<GtkBuilder *>(user_data);
    auto *list = GTK_LIST_BOX(gtk_builder_get_object(builder, "todo_list"));
    auto *row = gtk_list_box_get_selected_row(list);
    if (!row)
      return;

    gint index = gtk_list_box_row_get_index(row);
    auto size = static_cast<gint>(g_todos.size());
    if (index < 0 || index >= size)
      return;

    auto *dialog = create_todo_dialog(
        GTK_WINDOW(gtk_builder_get_object(builder, "window")),
        &g_todos[index]);


```

--------------------------------

### WebFrameMain Instance Properties

Source: https://www.electronjs.org/docs/latest/api/web-frame-main

Provides details on the various read-only properties available on a WebFrameMain instance, such as its URL, origin, parent, child frames, and process information.

```APIDOC
## WebFrameMain Instance Properties

### Description
These properties provide information about the frame's identity, content, and relationship within the frame hierarchy.

### Properties

#### `frame.ipc` _Readonly_
- **Type**: `IpcMain`
- **Description**: An `IpcMain` instance scoped to the frame for handling IPC messages.

#### `frame.url` _Readonly_
- **Type**: `string`
- **Description**: The current URL of the frame.

#### `frame.origin` _Readonly_
- **Type**: `string`
- **Description**: The current origin of the frame, serialized according to RFC 6454.

#### `frame.top` _Readonly_
- **Type**: `WebFrameMain | null`
- **Description**: The top frame in the frame hierarchy to which this frame belongs.

#### `frame.parent` _Readonly_
- **Type**: `WebFrameMain | null`
- **Description**: The parent frame of this frame. Returns `null` if this frame is the top frame.

#### `frame.frames` _Readonly_
- **Type**: `WebFrameMain[]`
- **Description**: A collection of direct child frames of this frame.

#### `frame.framesInSubtree` _Readonly_
- **Type**: `WebFrameMain[]`
- **Description**: A collection of all frames within the subtree of this frame, including itself.

#### `frame.frameTreeNodeId` _Readonly_
- **Type**: `Integer`
- **Description**: The browser-global ID of the frame's internal FrameTreeNode instance.

#### `frame.name` _Readonly_
- **Type**: `string`
- **Description**: The name of the frame.

#### `frame.frameToken` _Readonly_
- **Type**: `string`
- **Description**: A unique identifier for the frame within its associated renderer process.

#### `frame.osProcessId` _Readonly_
- **Type**: `Integer`
- **Description**: The operating system process ID (PID) of the process owning this frame.

#### `frame.processId` _Readonly_
- **Type**: `Integer`
- **Description**: The Chromium internal process ID (PID) of the process owning this frame.

#### `frame.routingId` _Readonly_
- **Type**: `Integer`
- **Description**: The unique frame ID within the current renderer process.

#### `frame.visibilityState` _Readonly_
- **Type**: `string`
- **Description**: The visibility state of the frame.
```

--------------------------------

### Build Node Headers for Tests

Source: https://www.electronjs.org/docs/latest/development/build-instructions-gn

This command generates build headers for Node.js modules, which are necessary for compiling test modules against the version of Node.js used in the Electron build process. This is a prerequisite for running Electron's tests.

```shell
$ ninja -C out/Testing electron:node_headers
```

--------------------------------

### Fetching Data with Electron net.fetch

Source: https://www.electronjs.org/docs/latest/api/net

Illustrates using the `net.fetch` method, which mirrors the browser's `fetch` API but uses Chrome's network stack. It shows how to make a request, check if the response is okay, and parse the response body as JSON. This method does not support `data:` or `blob:` schemes.

```javascript
async function example () {
  const response = await net.fetch('https://my.app')
  if (response.ok) {
    const body = await response.json()
    // ... use the result.
  }
}
```

--------------------------------

### TouchBarLabel Constructor

Source: https://www.electronjs.org/docs/latest/api/touch-bar-label

Creates a new TouchBarLabel instance to display text in the macOS touch bar.

```APIDOC
## new TouchBarLabel(options)

### Description
Creates a label for the touch bar.

### Method
Constructor

### Endpoint
N/A (This is a class constructor, not an API endpoint)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **options** (Object) - Required - Configuration options for the label.
  * **label** (string) - Optional - Text to display on the label.
  * **accessibilityLabel** (string) - Optional - A short description for screen readers.
  * **textColor** (string) - Optional - Hex color code for the text (e.g., "#ABCDEF").

### Request Example
```json
{
  "label": "My Label",
  "accessibilityLabel": "A custom label",
  "textColor": "#FF0000"
}
```

### Response
#### Success Response (200)
This constructor does not return a value directly. It creates an instance of `TouchBarLabel`.

#### Response Example
N/A
```

--------------------------------

### Configure VCLinkerTool for MSVS Build

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

Configures the Visual Studio linker settings for the addon. This specifically enables the generation of debug information, which is crucial for source-level debugging and obtaining readable stack traces in case of crashes.

```gyp
"VCLinkerTool": {
  "GenerateDebugInformation": "true"
}

```

--------------------------------

### Session: Download URL

Source: https://www.electronjs.org/docs/latest/api/session

Initiates a download of a resource at the specified URL. Generates a DownloadItem accessible via the 'will-download' event.

```APIDOC
## POST /downloadURL

### Description
Initiates a download of the resource at `url`. The API will generate a `DownloadItem` that can be accessed with the `will-download` event.

### Method
POST

### Endpoint
ses.downloadURL(url[, options])

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL of the resource to download.
- **options** (Object) - Optional - Additional options for the download.
  - **headers** (Record<string, string>) - Optional - HTTP request headers.

### Request Example
```javascript
const { session } = require('electron')

session.defaultSession.downloadURL('https://example.com/file.zip')
session.defaultSession.downloadURL('https://example.com/file.zip', {
  headers: {
    'User-Agent': 'MyApp'
  }
})
```

### Response
#### Success Response (200)
void

#### Response Example
None
```

--------------------------------

### Define C++ Interface Header in ElectronJS

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron-cpp-win32

This C++ header file defines the interface for interacting with ElectronJS. It includes a basic 'hello_world' function, a 'hello_gui' function for creating a Win32 GUI, and sets up a callback mechanism using `std::function` for asynchronous event handling, specifically for a 'TodoAdded' event.

```cpp
#pragma once
#include <string>
#include <functional>

namespace cpp_code {

std::string hello_world(const std::string& input);
void hello_gui();

// Callback function types
using TodoCallback = std::function<void(const std::string&)>;

// Callback setters
void setTodoAddedCallback(TodoCallback callback);

} // namespace cpp_code
```

--------------------------------

### Create Context Menu (Main Process) - Electron JS

Source: https://www.electronjs.org/docs/latest/tutorial/context-menu

This snippet demonstrates how to create a context menu in the main process of an Electron application. It listens for the `context-menu` event on a `WebContents` instance and conditionally shows a predefined menu (copy, cut, paste, select all) if the right-clicked element is editable. It requires the `electron/main` module.

```javascript
const { app, BrowserWindow, Menu } = require('electron/main')

function createWindow () {
  const win = new BrowserWindow()
  const menu = Menu.buildFromTemplate([
    { role: 'copy' },
    { role: 'cut' },
    { role: 'paste' },
    { role: 'selectall' }
  ])
  win.webContents.on('context-menu', (_event, params) => {
    // only show the context menu if the element is editable
    if (params.isEditable) {
      menu.popup()
    }
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Context Menu Demo</title>
  </head>
  <body>
    <h1>Context Menu Demo</h1>
    <textarea></textarea>
  </body>
</html>
```

--------------------------------

### Electron JS Menu Template with Relative Ordering

Source: https://www.electronjs.org/docs/latest/tutorial/menus

Illustrates how to define menu item order using 'before' and 'after' properties, allowing for relative positioning of menu items within the structure. The output shows the flattened menu.

```json
[
  { id: '1', label: 'one', after: ['3'] },
  { id: '2', label: 'two', before: ['1'] },
  { id: '3', label: 'three' }
]
```

```string
- ---
- three
- two
- one
```

--------------------------------

### Instance Events

Source: https://www.electronjs.org/docs/latest/api/browser-window

Events emitted by BrowserWindow instances.

```APIDOC
## BrowserWindow Instance Events

### Description
Objects created with `new BrowserWindow` emit the following events. Some events are only available on specific operating systems and are labeled as such.

### Method
N/A (Event Listeners)

### Endpoint
N/A

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```javascript
mainWindow.on('page-title-updated', (event, title, explicitSet) => {
  console.log('Page title updated:', title, 'Explicitly set:', explicitSet);
});

mainWindow.on('close', (event) => {
  console.log('Window is closing...');
  // event.preventDefault(); // Uncomment to cancel close
});

mainWindow.on('closed', () => {
  console.log('Window has been closed.');
  // Perform cleanup here
});

// Windows specific event example
if (process.platform === 'win32') {
  mainWindow.on('query-session-end', (event) => {
    console.log('Session is ending. Preventing shutdown...');
    // event.preventDefault(); // Uncomment to delay shutdown
  });

  mainWindow.on('session-end', () => {
    console.log('Session has ended.');
  });
}

mainWindow.on('unresponsive', () => {
  console.log('Web page is unresponsive.');
});

mainWindow.on('responsive', () => {
  console.log('Web page is responsive again.');
});

mainWindow.on('blur', () => {
  console.log('Window lost focus.');
});

mainWindow.on('focus', () => {
  console.log('Window gained focus.');
});

mainWindow.on('show', () => {
  console.log('Window is shown.');
});

mainWindow.on('hide', () => {
  console.log('Window is hidden.');
});

mainWindow.on('ready-to-show', () => {
  console.log('Window is ready to show.');
});

mainWindow.on('maximize', () => {
  console.log('Window maximized.');
});

mainWindow.on('unmaximize', () => {
  console.log('Window unmaximized.');
});

mainWindow.on('minimize', () => {
  console.log('Window minimized.');
});

mainWindow.on('restore', () => {
  console.log('Window restored.');
});
```

### Response
#### Success Response (200)
N/A

#### Response Example
N/A
```

--------------------------------

### Calling Exposed API in Renderer

Source: https://www.electronjs.org/docs/latest/api/context-bridge

This snippet shows how a renderer process (in the main world) can call the API exposed by the preload script using contextBridge.exposeInMainWorld. It directly invokes the 'doThing' function on the 'window.electron' object, which was made available by the preload script.

```javascript
// Renderer (Main World)

window.electron.doThing()

```

--------------------------------

### Taskbar Thumbnail and Details API (Windows)

Source: https://www.electronjs.org/docs/latest/api/browser-window

Provides methods to customize the thumbnail preview and buttons shown for the window in the Windows taskbar, as well as setting application-specific details.

```APIDOC
## POST /websites/electronjs/win/setThumbarButtons

### Description
Adds a thumbnail toolbar with specified buttons to the window's taskbar preview. The number of buttons is limited to 7. Once set, buttons cannot be removed but can be updated or cleared by calling with an empty array.

### Method
POST

### Endpoint
/websites/electronjs/win/setThumbarButtons

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **buttons** (Array<Object>) - Required - An array of button objects to display in the thumbnail toolbar.
  - **icon** (Object) - Required - Represents the icon for the button (e.g., a NativeImage object).
    - **path** (string) - Path to the image file for the icon.
  - **click** (Function) - Required - A callback function to execute when the button is clicked.
  - **tooltip** (string) - Optional - The text displayed when hovering over the button.
  - **flags** (Array<string>) - Optional - Controls button behavior (e.g., 'enabled', 'disabled', 'dismissonclick', 'nobackground', 'hidden', 'noninteractive'). Defaults to ['enabled'].

### Request Example
```json
{
  "buttons": [
    {
      "icon": {"path": "/path/to/icon.png"},
      "click": "function() { console.log('Button clicked!'); }",
      "tooltip": "Click Me",
      "flags": ["enabled"]
    }
  ]
}
```

### Response
#### Success Response (200)
- **boolean** - Whether the buttons were added successfully.

#### Response Example
```json
{
  "success": true
}
```
```

```APIDOC
## POST /websites/electronjs/win/setThumbnailClip

### Description
Sets the specific region of the window to be displayed as the thumbnail in the taskbar. A region with zero width and height resets the thumbnail to the entire window.

### Method
POST

### Endpoint
/websites/electronjs/win/setThumbnailClip

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **region** (Object) - Required - An object defining the thumbnail region.
  - **x** (number) - The x-coordinate of the region's top-left corner.
  - **y** (number) - The y-coordinate of the region's top-left corner.
  - **width** (number) - The width of the region.
  - **height** (number) - The height of the region.

### Request Example
```json
{
  "region": {"x": 10, "y": 10, "width": 50, "height": 50}
}
```

### Response
#### Success Response (200)
- **void** - Operation successful.

#### Response Example
```json
{
  "message": "Thumbnail clip set successfully."
}
```
```

```APIDOC
## POST /websites/electronjs/win/setThumbnailToolTip

### Description
Sets the tooltip text that appears when hovering over the window's thumbnail in the taskbar.

### Method
POST

### Endpoint
/websites/electronjs/win/setThumbnailToolTip

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **toolTip** (string) - Required - The tooltip text to display.

### Request Example
```json
{
  "toolTip": "My Application Preview"
}
```

### Response
#### Success Response (200)
- **void** - Operation successful.

#### Response Example
```json
{
  "message": "Thumbnail tooltip set successfully."
}
```
```

```APIDOC
## POST /websites/electronjs/win/setAppDetails

### Description
Configures the properties for the window's taskbar button, including App User Model ID, relaunch icon, and command. `appId` must be set for other options to take effect. `relaunchCommand` and `relaunchDisplayName` must be set together.

### Method
POST

### Endpoint
/websites/electronjs/win/setAppDetails

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **options** (Object) - Required - An object containing application details.
  - **appId** (string) - Optional - The Window's App User Model ID.
  - **appIconPath** (string) - Optional - Path to the window's Relaunch Icon.
  - **appIconIndex** (Integer) - Optional - Index of the icon within `appIconPath`. Defaults to 0.
  - **relaunchCommand** (string) - Optional - The command to execute when relaunching the application.
  - **relaunchDisplayName** (string) - Optional - The display name shown for the relaunch command.

### Request Example
```json
{
  "options": {
    "appId": "com.example.myapp",
    "appIconPath": "/path/to/icon.ico",
    "relaunchCommand": "myapp.exe",
    "relaunchDisplayName": "My App"
  }
}
```

### Response
#### Success Response (200)
- **void** - Operation successful.

#### Response Example
```json
{
  "message": "Application details set successfully."
}
```
```

--------------------------------

### WebContents Opener

Source: https://www.electronjs.org/docs/latest/api/web-contents

Details the `opener` property, which returns the `WebFrameMain` object that opened the current WebContents, or `null` if it was not opened programmatically or by a link with a target attribute.

```APIDOC
## WebContents.opener

### Description
A `WebFrameMain | null` property that represents the frame that opened this WebContents, either with `open()`, or by navigating a link with a `target` attribute.

### Method
Readonly

### Endpoint
N/A (Property of WebContents object)

### Parameters
None

### Request Example
```javascript
const openerFrame = webContents.opener;
if (openerFrame) {
  console.log('This WebContents was opened by:', openerFrame.url);
} else {
  console.log('This WebContents was not opened by another frame.');
}
```

### Response
#### Success Response (200)
*   **opener** (WebFrameMain | null) - The frame that opened this WebContents, or `null`.
```

--------------------------------

### Event: 'second-instance'

Source: https://www.electronjs.org/docs/latest/api/app

Emitted in the primary Electron instance when a second instance is executed and calls app.requestSingleInstanceLock(). Provides command line arguments and working directory of the second instance.

```APIDOC
## Event: 'second-instance'

### Description
This event will be emitted inside the primary instance of your application when a second instance has been executed and calls `app.requestSingleInstanceLock()`.

- `event`: The event object.
- `argv`: string[] - An array of the second instance's command line arguments. Note: This array might not be identical to the arguments passed to the second instance; use `additionalData` for exact matches. It will be empty if the second instance is started by a different user.
- `workingDirectory`: string - The second instance's working directory.
- `additionalData`: unknown - A JSON object of additional data passed from the second instance.

### Emitted After
This event is guaranteed to be emitted after the `ready` event of `app` gets emitted.

### Notes
- Extra command line arguments might be added by Chromium, such as `--original-process-start-time`.
- If you need to maintain the exact same arguments passed to the second instance, it's advised to use `additionalData` instead of `argv`.
```

--------------------------------

### Create Transparent Electron Window

Source: https://www.electronjs.org/docs/latest/tutorial/custom-window-styles

Shows how to create a fully transparent Electron window by setting both `frame` and `transparent` options to `true` in the `BrowserWindow` constructor. It also sets `resizable` to `false` as per limitations. The window loads an HTML file for content styling. Requires 'electron'.

```javascript
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 100,
    height: 100,
    resizable: false,
    frame: false,
    transparent: true
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

--------------------------------

### Conditional Architecture Logic (JavaScript)

Source: https://www.electronjs.org/docs/latest/tutorial/windows-arm

Illustrates how to check the current process architecture in Node.js. This is crucial for handling architecture-specific code paths. Ensure to check `process.arch` for x64 or x86, and consider `npm_config_arch` for build scripts targeting ARM.

```javascript
if (process.arch === 'x64') {
  // Do 64-bit thing...
} else {
  // Do 32-bit thing...
}
```

--------------------------------

### Configure `package.json` for Native Addon Build

Source: https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron

This JSON configuration defines the `package.json` for a native addon project. It includes scripts for cleaning the build directory (`clean`) and compiling the addon using `node-gyp` (`build`), along with specifying core dependencies and devDependencies.

```json
{
  "name": "my-native-addon",
  "version": "1.0.0",
  "description": "A native addon for Electron",
  "main": "js/index.js",
  "scripts": {
    "clean": "node -e \"require('fs').rmSync('build', { recursive: true, force: true })\"",
    "build": "node-gyp configure && node-gyp build"
  },
  "dependencies": {
    "bindings": "^1.5.0",
    "node-addon-api": "^8.3.0"
  },
  "devDependencies": {
    "node-gyp": "^11.1.0"
  }
}
```

--------------------------------

### Expose API to Main World (Preload Script)

Source: https://www.electronjs.org/docs/latest/api/context-bridge

This snippet demonstrates how to use contextBridge.exposeInMainWorld to make a function available to the renderer's main world. It exposes an 'electron' object on the window, which contains a 'doThing' function that sends an IPC message. This is crucial for enabling communication from the renderer back to the main process via preload scripts.

```javascript
// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'electron',
  {
    doThing: () => ipcRenderer.send('do-a-thing')
  }
)

```

--------------------------------

### Disable Default Application Menu

Source: https://www.electronjs.org/docs/latest/tutorial/performance

To improve startup performance, especially when creating custom menus or using frameless windows, call `Menu.setApplicationMenu(null)` before the `app.on("ready")` event to prevent Electron from setting up a default menu.

```APIDOC
## Call `Menu.setApplicationMenu(null)` when you do not need a default menu

### Description
Electron initializes a default application menu on startup. If your application does not require this default menu (e.g., you implement a custom menu or use a frameless window), disabling it via `Menu.setApplicationMenu(null)` can improve startup performance. This should be done before the `app.on("ready")` event.

### Method
N/A (This is a code snippet, not an API endpoint)

### Endpoint
N/A

### Parameters
N/A

### Request Example
```javascript
const { app, Menu } = require('electron')

// Call this before app.on('ready') if you don't need the default menu
Menu.setApplicationMenu(null)

app.on('ready', () => {
  // Your application setup code here
})
```

### Response
N/A

### Related Discussion
See: https://github.com/electron/electron/issues/35512
```

--------------------------------

### ElectronJS: Handle New Window Creation with setWindowOpenHandler

Source: https://www.electronjs.org/docs/latest/api/web-contents

Allows customization of how new windows are created when requested by the renderer process, such as via window.open() or links with target='_blank'. It returns an object that can deny, allow, or define a custom creation process for the new window.

```javascript
const { BrowserView, BrowserWindow } = require('electron')

const mainWindow = new BrowserWindow()

mainWindow.webContents.setWindowOpenHandler((details) => {
  return {
    action: 'allow',
    createWindow: (options) => {
      const browserView = new BrowserView(options)
      mainWindow.addBrowserView(browserView)
      browserView.setBounds({ x: 0, y: 0, width: 640, height: 480 })
      return browserView.webContents
    }
  }
})

```

--------------------------------

### Electron Main Process Window Creation

Source: https://www.electronjs.org/docs/latest/tutorial/online-offline-events

This JavaScript code sets up the main process for an Electron application. It creates a browser window and loads the 'index.html' file. It also handles application lifecycle events like 'ready', 'activate', and 'window-all-closed'.

```javascript
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const onlineStatusWindow = new BrowserWindow()

  onlineStatusWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

--------------------------------

### Configure Cross-Compilation Command Prompt (Shell)

Source: https://www.electronjs.org/docs/latest/tutorial/windows-arm

Instructions for modifying a Visual Studio command prompt shortcut to enable cross-compilation for ARM64. This involves changing the target script from `vcvarsamd64_x86.bat` to `vcvarsamd64_arm64.bat` in the shortcut's properties. This ensures the correct linker is used.

```shell
:: Example modification in shortcut properties:
:: Target: "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\Tools\VsDevCmd.bat" -architectures=amd64_arm64
```

--------------------------------

### Enable Sandbox Globally (Electron)

Source: https://www.electronjs.org/docs/latest/tutorial/sandbox

This code snippet shows how to enforce sandboxing for all renderer processes in an Electron application by calling `app.enableSandbox()` before the `ready` event. This API overrides any `sandbox: false` settings in individual `BrowserWindow` configurations, ensuring maximum security.

```javascript
app.enableSandbox()
app.whenReady().then(() => {
  // any sandbox:false calls are overridden since `app.enableSandbox()` was called.
  const win = new BrowserWindow()
  win.loadURL('https://google.com')
})
```

--------------------------------

### Write and Read Text to Clipboard - JavaScript

Source: https://www.electronjs.org/docs/latest/api/clipboard

Demonstrates how to write plain text to the system clipboard and then read it back using the `clipboard.writeText` and `clipboard.readText` methods. This functionality is available in both main and renderer processes (with caveats for sandboxed renderers).

```javascript
const { clipboard } = require('electron')
  
clipboard.writeText('Example string', 'selection')
console.log(clipboard.readText('selection'))
```

```javascript
const { clipboard } = require('electron')
  
clipboard.writeText('hello i am a bit of text!')

const text = clipboard.readText()
console.log(text)
// hello i am a bit of text!
```

```javascript
const { clipboard } = require('electron')
  
const text = 'hello i am a bit of text!'
clipboard.writeText(text)
```

--------------------------------

### Info.plist Configuration for ElectronTeamID (XML)

Source: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide

This snippet shows how to add the 'ElectronTeamID' key to your app's Info.plist file. The value should be your Apple Developer account's Team ID. This is automatically handled by `@electron/osx-sign` in most cases.

```xml
<plist version="1.0">
<dict>
  ...
  <key>ElectronTeamID</key>
  <string>TEAM_ID</string>
</dict>
</plist>
```

--------------------------------

### Web Serial API - Event Handling

Source: https://www.electronjs.org/docs/latest/tutorial/devices

This section explains how to handle serial port selection and related events within Electron's Web Serial API implementation.

```APIDOC
## Web Serial API - Event Handling

### Description
Electron requires developers to handle the `select-serial-port` event on the Session associated with a serial port request to use the Web Serial API. Additional events like `serial-port-added` and `serial-port-removed` help manage device connections during the `select-serial-port` event handling.

### Events

- **`select-serial-port`**: Fired when a serial port selection is needed.
- **`serial-port-added`**: Fired when a serial device is connected. This event is only active until the `select-serial-port` callback is invoked.
- **`serial-port-removed`**: Fired when a serial device is disconnected. This event is only active until the `select-serial-port` callback is invoked.

### Permission Handling

- **`ses.setDevicePermissionHandler(handler)`**: Allows setting a default permission handler for devices, bypassing the need to explicitly call `navigator.serial.requestPort`. Device permissions can be stored for longer-term persistence.
```

--------------------------------

### Main Process ESM Import with Top-Level Await in Electron

Source: https://www.electronjs.org/docs/latest/tutorial/esm

Demonstrates how to use top-level await for asynchronous module loading in Electron's main process to ensure operations complete before the app's 'ready' event. This is crucial for APIs like app.setPath that need to be called early. Ensure the file has a .mjs extension or the nearest package.json has '"type": "module"'.

```javascript
// index.mjs (Main Process)
// add an await call here to guarantee that path setup will finish before `ready`  
import('./set-up-paths.mjs')  
  
app.whenReady().then(() => {
  console.log('This code may execute before the above import')
})
```

--------------------------------

### Window Stacking Order API

Source: https://www.electronjs.org/docs/latest/api/base-window

Methods to control the stacking order (z-order) of windows.

```APIDOC
## Window Stacking Order API

### Description
Methods to manipulate the stacking order of the application window relative to other windows or to bring it to the top.

### Move Above
#### `win.moveAbove(mediaSourceId)`

Moves the window above the specified source window in the z-order.

**Parameters**
#### Path Parameters
- **mediaSourceId** (string) - Required - The ID of the target window, in the format `"window:1869:0"`.

### Move to Top
#### `win.moveTop()`

Moves the window to the top of the z-order, regardless of focus.

### Center Window
#### `win.center()`

Moves the window to the center of the screen.
```

--------------------------------

### win.loadURL

Source: https://www.electronjs.org/docs/latest/api/browser-window

Loads the `url` into the window, supporting various options such as HTTP referrer, user agent, extra headers, and POST data. It can load remote URLs or local files using the `file://` protocol.

```APIDOC
## POST /websites/electronjs/win.loadURL

### Description
Loads the `url` into the window. The `url` can be a remote address or a path to a local HTML file using the `file://` protocol. Supports options for `httpReferrer`, `userAgent`, `extraHeaders`, `postData`, and `baseURLForDataURL`.

### Method
POST

### Endpoint
/websites/electronjs/win.loadURL

### Parameters
#### Path Parameters
None

#### Query Parameters
* **url** (string) - The URL to load.
* **options.httpReferrer** (string | Referrer) - Optional - An HTTP Referrer URL.
* **options.userAgent** (string) - Optional - A user agent originating the request.
* **options.extraHeaders** (string) - Optional - Extra headers separated by '\n'.
* **options.postData** (UploadRawData | UploadFile)[] - Optional - Data to be sent with a POST request.
* **options.baseURLForDataURL** (string) - Optional - Base URL for files to be loaded by the data URL.

#### Request Body
None

### Request Example
```javascript
const { BrowserWindow } = require('electron');
const win = new BrowserWindow();

// Loading a remote URL
win.loadURL('https://example.com');

// Loading a local file
const path = require('node:path');
const url = require('node:url').format({
  protocol: 'file',
  slashes: true,
  pathname: path.join(__dirname, 'index.html')
});
win.loadURL(url);

// Loading with POST data
win.loadURL('http://localhost:8000/post', {
  postData: [{
    type: 'rawData',
    bytes: Buffer.from('hello=world')
  }],
  extraHeaders: 'Content-Type: application/x-www-form-urlencoded'
});
```

### Response
#### Success Response (200)
- **void** - Resolves when the page has finished loading (see `did-finish-load`).
#### Error Response
- Rejects if the page fails to load (see `did-fail-load`).
```

--------------------------------

### Move Electron App to Applications Folder with Conflict Handling (macOS)

Source: https://www.electronjs.org/docs/latest/api/app

Illustrates how to move the current Electron application to the system's Applications folder using `app.moveToApplicationsFolder`. It includes an optional `conflictHandler` to manage scenarios where an application with the same name already exists or is running, allowing user interaction via `dialog.showMessageBoxSync` to decide whether to proceed with the move.

```javascript
const { app, dialog } = require('electron')

app.moveToApplicationsFolder({
  conflictHandler: (conflictType) => {
    if (conflictType === 'exists') {
      return dialog.showMessageBoxSync({
        type: 'question',
        buttons: ['Halt Move', 'Continue Move'],
        defaultId: 0,
        message: 'An app of this name already exists'
      }) === 1
    }
  }
})
```

--------------------------------

### Create and Display Image Splash Screen with Electron ImageView

Source: https://www.electronjs.org/docs/latest/api/image-view

Demonstrates how to create an ImageView to display a splash screen while a WebContentsView loads. It requires 'electron' and 'node:path'. The ImageView is set as the content view initially and swapped with WebContentsView upon completion of loading.

```javascript
const { BaseWindow, ImageView, nativeImage, WebContentsView } = require('electron')

const path = require('node:path')

const win = new BaseWindow({ width: 800, height: 600 })

// Create a "splash screen" image to display while the WebContentsView loads
const splashView = new ImageView()
const splashImage = nativeImage.createFromPath(path.join(__dirname, 'loading.png'))
splashView.setImage(splashImage)
win.setContentView(splashView)

const webContentsView = new WebContentsView()
webContentsView.webContents.once('did-finish-load', () => {
  // Now that the WebContentsView has loaded, swap out the "splash screen" ImageView
  win.setContentView(webContentsView)
})
webContentsView.webContents.loadURL('https://electronjs.org')

```

--------------------------------

### win.showDefinitionForSelection

Source: https://www.electronjs.org/docs/latest/api/browser-window

Displays the definition for the currently selected text on macOS. This functionality is identical to `webContents.showDefinitionForSelection()`.

```APIDOC
## win.showDefinitionForSelection()

### Description
Displays the definition for the currently selected text on macOS. This is the same as `webContents.showDefinitionForSelection()`.

### Method
`win.showDefinitionForSelection()`

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
None

#### Response Example
None
```

--------------------------------

### Show Main Process Notifications with Electron

Source: https://www.electronjs.org/docs/latest/tutorial/notifications

Demonstrates how to display notifications from the Electron main process using the `Notification` module. This requires calling the `show()` method on a created `Notification` object. The code imports the `Notification` class from 'electron'.

```javascript
const { Notification } = require('electron')

const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'Notification from the Main process'

new Notification({
  title: NOTIFICATION_TITLE,
  body: NOTIFICATION_BODY
}).show()
```

```javascript
const { app, BrowserWindow, Notification } = require('electron/main')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'Notification from the Main process'

function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

app.whenReady().then(createWindow).then(showNotification)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
</head>
<body>
    <h1>Hello World!</h1>
    <p>After launching this application, you should see the system notification.</p>
</body>
</html>
```

--------------------------------

### ElectronJS: Show File/Directory Open Dialog

Source: https://www.electronjs.org/docs/latest/api/dialog

Opens a dialog for the user to select files or directories. It supports various options to customize the dialog's appearance and behavior, including filters, properties like `openFile` or `openDirectory`, and handling of the result via a Promise.

```javascript
dialog.showOpenDialog(mainWindow, {
  properties: ['openFile', 'openDirectory']
}).then(result => {
  console.log(result.canceled)
  console.log(result.filePaths)
}).catch(err => {
  console.log(err)
})
```

--------------------------------

### Window Opacity API

Source: https://www.electronjs.org/docs/latest/api/browser-window

Allows for setting and retrieving the opacity level of a window. Note that setting opacity on Linux is not supported.

```APIDOC
## POST /websites/electronjs/win/setOpacity

### Description
Sets the opacity of the window. Values outside the [0, 1] range are clamped.

### Method
POST

### Endpoint
/websites/electronjs/win/setOpacity

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **opacity** (number) - Required - between 0.0 (fully transparent) and 1.0 (fully opaque)

### Request Example
```json
{
  "opacity": 0.8
}
```

### Response
#### Success Response (200)
- **void** - Operation successful.

#### Response Example
```json
{
  "message": "Opacity set successfully."
}
```
```

```APIDOC
## GET /websites/electronjs/win/getOpacity

### Description
Gets the current opacity of the window. On Linux, this will always return 1.

### Method
GET

### Endpoint
/websites/electronjs/win/getOpacity

### Parameters
#### Query Parameters
None

#### Path Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **number** - between 0.0 (fully transparent) and 1.0 (fully opaque).

#### Response Example
```json
{
  "opacity": 0.9
}
```
```

--------------------------------

### HTML for file dialog interaction in Electron Renderer

Source: https://www.electronjs.org/docs/latest/tutorial/ipc

An HTML file for the renderer process that includes a button to trigger file opening and a strong tag to display the selected file path. It loads a 'renderer.js' script for interactivity.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Dialog</title>
  </head>
  <body>
    <button type="button" id="btn">Open a File</button>
    File path: <strong id="filePath"></strong>
    <script src='./renderer.js'></script>
  </body>
</html>
```

--------------------------------

### Enable Incoming Network Connections Entitlement

Source: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide

This XML snippet specifies the entitlement needed to permit an Electron app to open network listening sockets, enabling incoming network connections. This is crucial for server-like functionalities within the app.

```xml
<key>com.apple.security.network.server</key>
<true/>
```