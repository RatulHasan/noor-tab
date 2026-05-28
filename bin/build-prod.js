#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const pkgPath = path.resolve(__dirname, '../package.json');
const pkgOriginalContent = fs.readFileSync(pkgPath, 'utf-8');
const pkg = JSON.parse(pkgOriginalContent);

// Configuration
const BLOCKLIST_KEYWORDS = ['localhost', '127.0.0.1', '.test'];

function restorePackageJson() {
    console.log('♻️  Restoring package.json...');
    fs.writeFileSync(pkgPath, pkgOriginalContent, 'utf-8');
}

function stripDevDomains() {
    if (!pkg.manifest || !pkg.manifest.externally_connectable || !pkg.manifest.externally_connectable.matches) {
        return;
    }

    const originalMatches = pkg.manifest.externally_connectable.matches;
    const productionMatches = originalMatches.filter(domain => {
        return !BLOCKLIST_KEYWORDS.some(keyword => domain.includes(keyword));
    });

    console.log('✂️  Stripping dev domains for production build:');
    originalMatches.forEach(domain => {
        if (!productionMatches.includes(domain)) {
            console.log(`   - ${domain}`);
        }
    });

    pkg.manifest.externally_connectable.matches = productionMatches;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

// Handle interrupts to ensure cleanup
process.on('SIGINT', () => {
    restorePackageJson();
    process.exit(1);
});

process.on('SIGTERM', () => {
    restorePackageJson();
    process.exit(1);
});

process.on('exit', () => {
    // This runs on normal exit, but we handle explicit restore in try/finally too.
});

// Main execution
try {
    const target = process.argv[2] || 'chrome-mv3';
    
    stripDevDomains();
    // Edge strictly requires the manifest author field to be an email address
    if (target === 'edge-mv3') {
        console.log('🔧 Applying Edge MV3 manifest fix (using email for author)...');
        pkg.author = 'ratuljh@gmail.com';
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
    }

    console.log('\n🚀 Starting Production Build (Plasmo + Zip)...\n');

    // Run the actual build command
    const buildCmd = target === 'chrome-mv3' ? 'plasmo build' : `plasmo build --target=${target}`;

    console.log(`🔨 Building for target: ${target}`);
    const buildResult = spawnSync(buildCmd, { stdio: 'inherit', shell: true });

    if (buildResult.status !== 0) {
        throw new Error(`Plasmo build failed with code ${buildResult.status}`);
    }

    const zipName = `${target}-prod`;
    const zipResult = spawnSync('npm', ['run', 'zip', zipName], { stdio: 'inherit', shell: true });

    if (zipResult.status !== 0) {
        throw new Error(`Zip command failed with code ${zipResult.status}`);
    }

    console.log('\n✅ Build completed successfully!');

} catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exitCode = 1;
} finally {
    restorePackageJson();
}
