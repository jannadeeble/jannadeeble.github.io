#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_PATH = __dirname;
const DEBOUNCE_MS = 2000; // Wait 2 seconds after last change before syncing

let syncTimer = null;
let isProcessing = false;

console.log('🔄 Auto-sync started for:', REPO_PATH);
console.log('📁 Watching for file changes...\n');

function runGitCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: REPO_PATH }, (error, stdout, stderr) => {
      if (error && !stderr.includes('nothing to commit')) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

async function syncToGitHub() {
  if (isProcessing) return;

  isProcessing = true;
  console.log('🔄 Syncing changes to GitHub...');

  try {
    // Check for changes
    const status = await runGitCommand('git status --porcelain');

    if (!status.trim()) {
      console.log('✓ No changes to sync\n');
      isProcessing = false;
      return;
    }

    // Add all changes
    await runGitCommand('git add .');

    // Commit with timestamp
    const timestamp = new Date().toLocaleString();
    await runGitCommand(`git commit -m "Auto-sync: ${timestamp}"`);

    // Push to GitHub
    await runGitCommand('git push');

    console.log('✓ Synced to GitHub successfully!');
    console.log(`  View at: https://jannadeeble.github.io\n`);
  } catch (error) {
    console.error('✗ Sync failed:', error.message);
  }

  isProcessing = false;
}

function scheduleSync() {
  if (syncTimer) clearTimeout(syncTimer);

  syncTimer = setTimeout(() => {
    syncToGitHub();
  }, DEBOUNCE_MS);
}

// Watch for file changes
fs.watch(REPO_PATH, { recursive: true }, (eventType, filename) => {
  // Ignore git files and the auto-sync script itself
  if (!filename ||
      filename.includes('.git/') ||
      filename === 'auto-sync.js' ||
      filename.startsWith('.')) {
    return;
  }

  console.log(`📝 Detected change: ${filename}`);
  scheduleSync();
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Auto-sync stopped');
  process.exit(0);
});

// Keep the process alive
console.log('Press Ctrl+C to stop auto-sync\n');
