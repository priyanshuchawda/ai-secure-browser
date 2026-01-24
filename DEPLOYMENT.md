# Deployment Guide

## Option 1: Quick Release with GitHub CLI (Recommended)

### Prerequisites
1. Install GitHub CLI: https://cli.github.com/
2. Login: `gh auth login`

### Build & Release
```bash
# PowerShell (Windows)
.\scripts\release.ps1 v1.0.0

# Or using Node.js (cross-platform)
npm run release v1.0.0
```

This will:
- ✅ Build all executables (.exe, .dmg, .AppImage)
- ✅ Create a git tag
- ✅ Create GitHub release
- ✅ Upload all installers automatically

---

## Option 2: Manual Build & Upload

### Step 1: Build executables
```bash
# Build for all platforms
npm run dist

# Or build for specific platforms
npm run dist:win    # Windows (.exe)
npm run dist:mac    # macOS (.dmg)
npm run dist:linux  # Linux (.AppImage, .deb)
```

### Step 2: Find your executables
Files will be in `./release/` directory:
- Windows: `AI-Secure-Browser-Setup-1.0.0.exe`
- macOS: `AI-Secure-Browser-1.0.0.dmg`
- Linux: `AI-Secure-Browser-1.0.0.AppImage`

### Step 3: Create GitHub Release
```bash
# Create release
gh release create v1.0.0 --title "AI Secure Browser v1.0.0"

# Upload files
gh release upload v1.0.0 ./release/*.exe
gh release upload v1.0.0 ./release/*.dmg
gh release upload v1.0.0 ./release/*.AppImage
```

---

## Option 3: Automated CI/CD (GitHub Actions)

Already configured! Just push a git tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically:
- Build for Windows, macOS, and Linux
- Create a release
- Upload all installers

---

## Distribution Options

### 1. GitHub Releases (Free)
- Users download from: `https://github.com/[username]/ai-secure-browser/releases`
- Perfect for open-source distribution

### 2. Your Website
- Host installers on your website
- Link to download: `https://yoursite.com/downloads/`
- Add download buttons for each platform

### 3. App Stores (Optional)
- Microsoft Store (Windows)
- Mac App Store (macOS)
- Snap Store (Linux)

---

## Testing Locally

Before releasing, test the built executable:

```bash
# Build
npm run dist:win

# Run the executable
.\release\AI-Secure-Browser-Setup-1.0.0.exe
```

---

## Custom App Icons

Add your custom icons to `./build/` directory:
- `icon.ico` (Windows, 256x256)
- `icon.icns` (macOS, 512x512)
- `icon.png` (Linux, 512x512)

Then rebuild: `npm run dist`

---

## Environment Variables for Users

Users need to create `.env` file after installation:
```
GEMINI_API_KEY=your_api_key_here
```

Consider creating an installer that prompts for API key!
