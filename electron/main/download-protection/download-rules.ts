/**
 * Download Protection Rules
 * Defines dangerous file extensions and risk categories
 */

// Risk levels for extensions
export type ExtensionRisk = 'critical' | 'high' | 'medium' | 'low' | 'safe';

// Extension risk categories
export const EXTENSION_RISKS: Record<string, ExtensionRisk> = {
    // Critical - Executable files that can run directly
    '.exe': 'critical',
    '.scr': 'critical',
    '.pif': 'critical',
    '.com': 'critical',
    '.bat': 'critical',
    '.cmd': 'critical',
    '.ps1': 'critical',
    '.vbs': 'critical',
    '.vbe': 'critical',
    '.js': 'high',      // Can be run with Windows Script Host
    '.jse': 'critical',
    '.wsf': 'critical',
    '.wsh': 'critical',
    '.msc': 'critical',
    '.cpl': 'critical',

    // High Risk - System/installer files
    '.msi': 'high',
    '.msp': 'high',
    '.dll': 'high',
    '.sys': 'high',
    '.drv': 'high',
    '.ocx': 'high',
    '.reg': 'high',
    '.inf': 'high',
    '.lnk': 'high',
    '.hta': 'critical',
    '.application': 'high',
    '.gadget': 'high',

    // Medium Risk - Cross-platform executables
    '.jar': 'medium',
    '.py': 'medium',
    '.pyc': 'medium',
    '.pyw': 'medium',
    '.rb': 'medium',
    '.sh': 'medium',
    '.bash': 'medium',
    '.app': 'medium',
    '.dmg': 'medium',
    '.pkg': 'medium',
    '.deb': 'medium',
    '.rpm': 'medium',
    '.appimage': 'medium',

    // Medium Risk - Archives (can contain hidden executables - treat with caution)
    '.zip': 'medium',
    '.rar': 'medium',
    '.7z': 'medium',
    '.tar': 'medium',
    '.gz': 'medium',
    '.bz2': 'medium',
    '.xz': 'medium',
    '.iso': 'medium',
    '.img': 'medium',

    // Safe - Common document/media types
    '.pdf': 'safe',
    '.doc': 'safe',
    '.docx': 'safe',
    '.xls': 'safe',
    '.xlsx': 'safe',
    '.ppt': 'safe',
    '.pptx': 'safe',
    '.txt': 'safe',
    '.rtf': 'safe',
    '.csv': 'safe',
    '.jpg': 'safe',
    '.jpeg': 'safe',
    '.png': 'safe',
    '.gif': 'safe',
    '.webp': 'safe',
    '.svg': 'safe',
    '.mp3': 'safe',
    '.mp4': 'safe',
    '.wav': 'safe',
    '.avi': 'safe',
    '.mkv': 'safe',
    '.webm': 'safe',
    '.json': 'safe',
    '.xml': 'safe',
    '.html': 'safe',
    '.css': 'safe',
    '.md': 'safe',
};

// Trusted domains that typically distribute safe software
export const TRUSTED_DOWNLOAD_DOMAINS: string[] = [
    // Major tech companies
    'microsoft.com',
    'google.com',
    'apple.com',
    'mozilla.org',
    'adobe.com',
    'nvidia.com',
    'amd.com',
    'intel.com',

    // Software distribution
    'github.com',
    'githubusercontent.com',
    'gitlab.com',
    'sourceforge.net',
    'npmjs.com',
    'pypi.org',

    // Cloud storage
    'drive.google.com',
    'dropbox.com',
    'onedrive.live.com',
    'box.com',

    // App stores
    'steampowered.com',
    'epicgames.com',
    'origin.com',

    // Other trusted
    'nodejs.org',
    'python.org',
    'java.com',
    'oracle.com',
    'zoom.us',
    'slack.com',
    'discord.com',
];

/**
 * Get risk level for a file extension
 */
export function getExtensionRisk(extension: string): ExtensionRisk {
    const normalizedExt = extension.toLowerCase();
    return EXTENSION_RISKS[normalizedExt] || 'safe';
}

/**
 * Check if domain is trusted for downloads
 */
export function isTrustedDomain(domain: string): boolean {
    const normalizedDomain = domain.toLowerCase();
    return TRUSTED_DOWNLOAD_DOMAINS.some(trusted =>
        normalizedDomain === trusted || normalizedDomain.endsWith('.' + trusted)
    );
}

/**
 * Detect double extensions (common malware trick)
 * e.g., "document.pdf.exe" should return true
 */
export function hasDoubleExtension(filename: string): boolean {
    const parts = filename.split('.');
    if (parts.length < 3) return false;

    // Check if second-to-last extension looks like a document type
    // and last extension is executable
    const secondToLast = '.' + parts[parts.length - 2].toLowerCase();
    const last = '.' + parts[parts.length - 1].toLowerCase();

    const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.png', '.txt'];
    const executableExtensions = ['.exe', '.scr', '.bat', '.cmd', '.pif', '.com', '.js', '.vbs'];

    return documentExtensions.includes(secondToLast) && executableExtensions.includes(last);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) return '';
    return filename.substring(lastDot).toLowerCase();
}

/**
 * Analyze filename for suspicious patterns
 */
export function analyzeFilename(filename: string): {
    hasDoubleExtension: boolean;
    hasUnicodeCharacters: boolean;
    hasExcessiveSpaces: boolean;
    isSuspicious: boolean;
} {
    const hasDouble = hasDoubleExtension(filename);
    const hasUnicode = /[^\x00-\x7F]/.test(filename);
    const hasExcessiveSpaces = /\s{3,}/.test(filename) || filename.includes('   ');

    return {
        hasDoubleExtension: hasDouble,
        hasUnicodeCharacters: hasUnicode,
        hasExcessiveSpaces: hasExcessiveSpaces,
        isSuspicious: hasDouble || hasExcessiveSpaces
    };
}

console.log('[DownloadRules] Rules loaded');
