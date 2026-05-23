#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const pkg = require('../package.json');
const DEST_ZIP_DIR = path.join(__dirname, '../build');
const SOURCE_ZIP_NAME = `${pkg.name}-v${pkg.version}-source.zip`;

if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR, { recursive: true });
}

console.log(`📦 Packaging source code for Mozilla Review...`);

const output = fs.createWriteStream(path.join(DEST_ZIP_DIR, SOURCE_ZIP_NAME));
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
    console.log(`✅ Source code packaged: ${path.join(DEST_ZIP_DIR, SOURCE_ZIP_NAME)}`);
    console.log(`📊 Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

// Files and directories to include (everything except build artifacts and sensitive info)
const rootDir = path.join(__dirname, '..');
const items = fs.readdirSync(rootDir);

items.forEach(item => {
    const itemPath = path.join(rootDir, item);
    const stats = fs.statSync(itemPath);

    // Exclusion list
    const excluded = [
        'node_modules',
        'build',
        '.idea',
        '.git',
        '.plasmo',
        '.env.local',
        '.DS_Store',
        'raw-assets',
        'CHROME_STORE_SUBMISSION.md',
        'HANDOFF_TO_SAAS_UPDATE.md',
        'README.md',
        'ROADMAP.md',
        'Strategic Feature Roadmap.md',
        SOURCE_ZIP_NAME
    ];

    if (excluded.includes(item)) {
        return;
    }

    if (stats.isDirectory()) {
        archive.directory(itemPath, item);
    } else {
        archive.file(itemPath, { name: item });
    }
});

archive.finalize();
