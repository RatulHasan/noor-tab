#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function removeIfExists(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, {recursive: true, force: true});
}

function ensureCleanTargetArtifacts() {
  const buildDir = path.resolve(__dirname, '../build');
  if (!fs.existsSync(buildDir)) return;

  console.log(`🧹 Cleaning previous artifacts in ${buildDir} (preserving *-dev folders)`);

  const items = fs.readdirSync(buildDir);
  items.forEach(item => {
    if (item.endsWith('-dev')) {
      return;
    }
    const fullPath = path.join(buildDir, item);
    removeIfExists(fullPath);
  });
}
ensureCleanTargetArtifacts();
