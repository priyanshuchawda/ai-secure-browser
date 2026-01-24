# Build Icons

Place your application icons in this directory:

- **icon.ico** - Windows icon (256x256 or 512x512)
- **icon.icns** - macOS icon (512x512)
- **icon.png** - Linux icon (512x512)

You can create icons from a single PNG using online tools like:
- https://cloudconvert.com/png-to-ico
- https://cloudconvert.com/png-to-icns

Or use `electron-icon-builder`:
```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon.png --output=./build
```

For now, electron-builder will use default icons if these are missing.
