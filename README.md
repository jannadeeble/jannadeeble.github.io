# My Web Apps

This repository hosts my personal web apps on GitHub Pages.

## 🌐 Live Site
https://jannadeeble.github.io

## 🚀 Auto-Sync

This repo has automatic syncing set up. Any file you add, modify, or delete will automatically be pushed to GitHub and go live.

### Start Auto-Sync

```bash
cd ~/jannadeeble.github.io
node auto-sync.js
```

Or run in the background:
```bash
cd ~/jannadeeble.github.io
node auto-sync.js &
```

### Stop Auto-Sync
Press `Ctrl+C` or:
```bash
pkill -f auto-sync.js
```

## 📝 Adding Apps

1. Make sure auto-sync is running
2. Create or copy any HTML file into this folder
3. It will automatically sync to GitHub
4. Access at: `https://jannadeeble.github.io/your-file.html`

## 📁 Folder Structure

```
jannadeeble.github.io/
├── index.html          # Homepage
├── app1.html          # Your apps
├── app2.html
└── subfolder/         # You can use folders too
    └── another-app.html
```

Apps in subfolders are accessible at: `https://jannadeeble.github.io/subfolder/another-app.html`
