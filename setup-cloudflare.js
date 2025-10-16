#!/usr/bin/env node

const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function checkWrangler() {
  try {
    await runCommand('wrangler --version');
    console.log('✓ Wrangler is installed\n');
    return true;
  } catch (error) {
    console.log('✗ Wrangler not found\n');
    return false;
  }
}

async function main() {
  console.log('🚀 Cloudflare Pages + SSO Setup\n');
  console.log('This will help you deploy your Mini Apps with SSO authentication.\n');

  // Check if wrangler is installed
  const hasWrangler = await checkWrangler();

  if (!hasWrangler) {
    console.log('Installing Wrangler CLI...');
    const install = await question('Install Wrangler globally? (y/n): ');

    if (install.toLowerCase() === 'y') {
      console.log('\nInstalling...');
      try {
        await runCommand('npm install -g wrangler');
        console.log('✓ Wrangler installed successfully\n');
      } catch (error) {
        console.error('✗ Installation failed:', error.message);
        console.log('\nPlease install manually: npm install -g wrangler\n');
        process.exit(1);
      }
    } else {
      console.log('\nPlease install Wrangler first: npm install -g wrangler');
      process.exit(0);
    }
  }

  // Login to Cloudflare
  console.log('Next, you need to login to Cloudflare...\n');
  const login = await question('Login to Cloudflare now? (y/n): ');

  if (login.toLowerCase() === 'y') {
    console.log('\nOpening browser for authentication...');
    try {
      await runCommand('wrangler login');
      console.log('✓ Logged in successfully\n');
    } catch (error) {
      console.error('✗ Login failed:', error.message);
      process.exit(1);
    }
  }

  // Get project name
  const projectName = await question('Project name (default: mini-apps): ') || 'mini-apps';

  // Deploy
  console.log('\nReady to deploy!\n');
  const deploy = await question('Deploy now? (y/n): ');

  if (deploy.toLowerCase() === 'y') {
    console.log('\nDeploying to Cloudflare Pages...');
    try {
      const result = await runCommand(`wrangler pages deploy . --project-name=${projectName}`);
      console.log(result);
      console.log('\n✅ Deployment successful!\n');
      console.log(`Your site is live at: https://${projectName}.pages.dev\n`);
    } catch (error) {
      console.error('✗ Deployment failed:', error.message);
      process.exit(1);
    }
  }

  console.log('\n📚 Next Steps:\n');
  console.log('1. Go to https://dash.cloudflare.com/');
  console.log('2. Click "Zero Trust" in the sidebar');
  console.log('3. Go to "Access" > "Applications"');
  console.log('4. Add your Mini Apps as a protected application');
  console.log('5. Configure who can access (email, GitHub, Google, etc.)\n');
  console.log('See DEPLOYMENT.md for detailed instructions.\n');

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
