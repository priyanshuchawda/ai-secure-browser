# Quick Build & Release Script
# For Windows PowerShell
# Usage: .\scripts\release.ps1 v1.0.0

param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

Write-Host "`n🚀 AI Secure Browser - GitHub Release`n" -ForegroundColor Cyan

# Ensure version starts with 'v'
if (-not $Version.StartsWith("v")) {
    $Version = "v$Version"
}

Write-Host "📦 Version: $Version" -ForegroundColor Green

# Check if gh is installed
try {
    gh --version | Out-Null
} catch {
    Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "Install from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Step 1: Build the app
Write-Host "`n📦 Building application..." -ForegroundColor Cyan
npm run dist
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Step 2: Check release files
$releaseDir = "release"
if (-not (Test-Path $releaseDir)) {
    Write-Host "❌ Release directory not found" -ForegroundColor Red
    exit 1
}

$files = Get-ChildItem -Path $releaseDir -Include *.exe,*.dmg,*.AppImage,*.deb,*.zip -Recurse
if ($files.Count -eq 0) {
    Write-Host "❌ No release files found" -ForegroundColor Red
    exit 1
}

Write-Host "`n📁 Found release files:" -ForegroundColor Cyan
$files | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Gray }

# Step 3: Create git tag
Write-Host "`n🏷️  Creating git tag $Version..." -ForegroundColor Cyan
git tag -a $Version -m "Release $Version"
git push origin $Version

# Step 4: Create GitHub release
Write-Host "`n🌐 Creating GitHub release $Version..." -ForegroundColor Cyan

$releaseNotes = @"
## AI Secure Browser $Version

### Download

Choose the installer for your platform:

- **Windows**: ``.exe`` (installer) or ``-portable.exe`` (no install needed)
- **macOS**: ``.dmg`` (drag & drop installer)
- **Linux**: ``.AppImage`` (portable) or ``.deb`` (Debian/Ubuntu)

### Installation

1. Download the appropriate file for your OS
2. Set up your ``.env`` file with ``GEMINI_API_KEY``
3. Run the application

### Features

✅ Real-time URL threat detection
✅ Download protection with AI analysis
✅ Intelligent caching
✅ Browser navigation (back, forward, refresh)

See README.md for full documentation.
"@

$releaseNotes | Out-File -FilePath ".release-notes.tmp" -Encoding UTF8
gh release create $Version --title "AI Secure Browser $Version" --notes-file .release-notes.tmp
Remove-Item ".release-notes.tmp"

# Step 5: Upload release files
Write-Host "`n📤 Uploading release files..." -ForegroundColor Cyan
$files | ForEach-Object {
    Write-Host "   Uploading $($_.Name)..." -ForegroundColor Gray
    gh release upload $Version $_.FullName
}

Write-Host "`n✅ Release published successfully!" -ForegroundColor Green
$repo = gh repo view --json nameWithOwner -q .nameWithOwner
Write-Host "🔗 View at: https://github.com/$repo/releases/tag/$Version" -ForegroundColor Cyan
