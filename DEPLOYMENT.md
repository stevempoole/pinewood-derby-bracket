# 🚀 Deployment Guide

## Creating the GitHub Repository

### Method 1: GitHub Web Interface (Recommended)

1. **Create Repository**
   - Go to [GitHub](https://github.com) and sign in
   - Click the "+" button and select "New repository"
   - Repository name: `pinewood-derby-bracket`
   - Description: `Interactive tournament bracket web application for pinewood derby races`
   - Set to **Public** (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push Your Code**
   ```bash
   cd pinewood-derby-bracket
   git remote add origin https://github.com/YOUR_USERNAME/pinewood-derby-bracket.git
   git branch -M main
   git push -u origin main
   ```

### Method 2: GitHub CLI (if available)

1. **Install GitHub CLI** (if not already installed)
   - macOS: `brew install gh`
   - Windows: Download from [cli.github.com](https://cli.github.com)

2. **Create and Push Repository**
   ```bash
   cd pinewood-derby-bracket
   gh repo create pinewood-derby-bracket --public --description "Interactive tournament bracket web application for pinewood derby races"
   git remote add origin https://github.com/YOUR_USERNAME/pinewood-derby-bracket.git
   git push -u origin main
   ```

## Setting Up GitHub Pages

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click the "Settings" tab

2. **Configure GitHub Pages**
   - Scroll down to "Pages" in the left sidebar
   - Source: "Deploy from a branch"
   - Branch: "main" / "/ (root)"
   - Click "Save"

3. **Access Your Live Site**
   - Wait 2-5 minutes for deployment
   - Your site will be available at: `https://YOUR_USERNAME.github.io/pinewood-derby-bracket`
   - GitHub will show you the URL in the Pages settings

## Verifying Deployment

1. **Check Build Status**
   - Go to the "Actions" tab in your repository
   - You should see a "pages build and deployment" workflow
   - Wait for it to show a green checkmark

2. **Test Your Application**
   - Visit your GitHub Pages URL
   - Try adding a few racers
   - Start a tournament and verify the bracket works
   - Test on mobile device

## Custom Domain (Optional)

If you have your own domain:

1. **Add CNAME File**
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS**
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`

## Troubleshooting

### Common Issues

**Site not loading after 10 minutes**
- Check Actions tab for build errors
- Ensure repository is public
- Verify Pages is set to deploy from main branch

**JavaScript not working**
- Check browser console for errors
- Ensure all files are committed and pushed
- Verify file paths are correct in HTML

**Mobile layout issues**
- Test in Chrome DevTools mobile view
- Check for console errors
- Verify CSS media queries are working

### Getting Help

1. Check the main README.md for usage instructions
2. Look at GitHub Actions for build errors
3. Test locally first: `python -m http.server 8000`
4. Open browser dev tools to check for errors

## Updates and Maintenance

### Making Changes

1. **Edit Files Locally**
   ```bash
   # Make your changes to HTML, CSS, or JS files
   git add .
   git commit -m "Description of your changes"
   git push
   ```

2. **Changes Deploy Automatically**
   - GitHub Pages automatically rebuilds when you push
   - Changes typically live within 2-5 minutes

### Backup Your Tournament Data

The application auto-saves to browser localStorage, but for important tournaments:

1. **Export Settings**: Copy the localStorage data from browser dev tools
2. **Screenshots**: Take photos of the final bracket
3. **Manual Backup**: Write down the tournament results

---

Your pinewood derby tournament bracket is now ready for families everywhere! 🏁