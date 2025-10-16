#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPO_PATH = __dirname;
const EXCLUDE_FILES = ['index.html', 'auto-sync.js', 'generate-manifest.js'];
const EXCLUDE_PATTERNS = ['.git', 'node_modules', 'README.md', '.log', 'apps-manifest.json'];

// Default icon sets for different types of apps
const DEFAULT_ICONS = ['📱', '⚡️', '🎯', '🚀', '✨', '🎨', '🔧', '📊', '🎮', '💡', '🔥', '⚙️', '📝', '🎵', '📷'];

function shouldExclude(filename) {
    if (EXCLUDE_FILES.includes(filename)) return true;

    return EXCLUDE_PATTERNS.some(pattern => filename.includes(pattern));
}

function extractMetadataFromHTML(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract title
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        let title = titleMatch ? titleMatch[1] : null;

        // Extract description from meta tag
        const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        let description = descMatch ? descMatch[1] : null;

        // Extract icon from meta tag (custom attribute)
        const iconMatch = content.match(/<meta\s+name=["']app-icon["']\s+content=["'](.*?)["']/i);
        let icon = iconMatch ? iconMatch[1] : null;

        return { title, description, icon };
    } catch (error) {
        return { title: null, description: null, icon: null };
    }
}

function generateAppName(filename) {
    return filename
        .replace('.html', '')
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!shouldExclude(file)) {
                findHTMLFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html') && !shouldExclude(file)) {
            const relativePath = path.relative(REPO_PATH, filePath);
            fileList.push(relativePath);
        }
    });

    return fileList;
}

function generateManifest() {
    console.log('🔍 Scanning for HTML files...');

    const htmlFiles = findHTMLFiles(REPO_PATH);
    console.log(`📄 Found ${htmlFiles.length} app(s)`);

    const apps = htmlFiles.map((file, index) => {
        const fullPath = path.join(REPO_PATH, file);
        const metadata = extractMetadataFromHTML(fullPath);

        const appName = metadata.title || generateAppName(path.basename(file));
        const description = metadata.description || 'A mini app';
        const icon = metadata.icon || DEFAULT_ICONS[index % DEFAULT_ICONS.length];

        console.log(`  ✓ ${appName} (${file})`);

        return {
            name: appName,
            file: file,
            description: description,
            icon: icon
        };
    });

    const manifest = {
        generated: new Date().toISOString(),
        apps: apps
    };

    const manifestPath = path.join(REPO_PATH, 'apps-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`\n✅ Generated manifest with ${apps.length} app(s)`);
    console.log(`📝 Saved to: apps-manifest.json`);
}

// Run the generator
generateManifest();
