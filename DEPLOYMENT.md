# Deploying Mini Apps with SSO

This guide will help you deploy your Mini Apps dashboard with SSO authentication using Cloudflare Pages + Cloudflare Access.

## Why Cloudflare?

- **Free hosting** for static sites
- **Cloudflare Access**: Free SSO for up to 50 users
- Authenticate with GitHub, Google, or email
- Protects your entire site or specific paths
- Much simpler than self-hosting Authelia/Keycloak

## Setup Steps

### 1. Install Cloudflare Wrangler

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate.

### 3. Deploy Your Site

```bash
cd ~/mini-apps
wrangler pages deploy . --project-name=mini-apps
```

Your site will be live at: `https://mini-apps.pages.dev`

### 4. Set Up SSO (Cloudflare Access)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Zero Trust** in the sidebar
3. Go to **Access** > **Applications**
4. Click **Add an application**
5. Select **Self-hosted**
6. Configure:
   - **Application name**: Mini Apps
   - **Subdomain**: `mini-apps` (or your custom domain)
   - **Domain**: `pages.dev` (or your domain)

7. **Add a policy**:
   - Policy name: "Allow my email"
   - Action: Allow
   - Configure rules:
     - **Emails**: `your-email@example.com`
     - OR **GitHub organization**: your org
     - OR **Google Workspace domain**: your domain

8. Save and deploy

### 5. Protected Routes (Optional)

You can protect specific paths:
- Protect everything: `https://mini-apps.pages.dev/*`
- Protect only dashboard: `https://mini-apps.pages.dev/` (just index)
- Allow public apps: Create bypass rules for specific HTML files

## Alternative: Netlify with Netlify Identity

If you prefer Netlify:

1. **Connect GitHub repo to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect `jannadeeble/jannadeeble.github.io`

2. **Enable Netlify Identity**
   - Go to Site Settings > Identity
   - Click "Enable Identity"
   - Under "Registration" > Select "Invite only"

3. **Protect Routes**
   Create `_redirects` file:
   ```
   /*  200!  Role=user
   ```

4. **Add authentication widget** to index.html:
   ```html
   <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
   ```

## Updating Auto-Sync for Cloudflare/Netlify

The current auto-sync pushes to GitHub Pages. You can:
1. Keep GitHub as source, deploy from there to Cloudflare/Netlify
2. Or modify auto-sync to deploy directly to Cloudflare/Netlify

## Recommended: Hybrid Approach

- Keep GitHub repo as source
- Set up Cloudflare Pages to auto-deploy from GitHub
- Enable Cloudflare Access for SSO
- Your auto-sync continues to work as-is

This way:
1. Files sync to GitHub (current setup)
2. Cloudflare auto-deploys from GitHub
3. SSO protects the Cloudflare site
4. GitHub Pages remains as backup

## Cost

- **GitHub Pages**: Free
- **Cloudflare Pages**: Free
- **Cloudflare Access**: Free (up to 50 users)
- **Total**: $0/month

## Need Help?

Run the automated setup:
```bash
cd ~/mini-apps
node setup-cloudflare.js
```

This will guide you through the process interactively.
