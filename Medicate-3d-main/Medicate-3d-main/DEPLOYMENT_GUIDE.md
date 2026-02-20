# 🚀 Deploy MediVerse to Vercel

This guide will walk you through deploying your MediVerse project to Vercel.

## Prerequisites

1. **GitHub Account** - You'll need a GitHub account to connect with Vercel
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **Git Repository** - Your project should be pushed to GitHub

## Step 1: Prepare Your Project

✅ **Already Done!** I've prepared your project with:
- `vercel.json` - Vercel configuration file
- `.gitignore` - To exclude node_modules and build files
- `tsconfig.json` & `tsconfig.node.json` - TypeScript configurations
- Updated `package.json` with necessary TypeScript types

## Step 2: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Ready for Vercel deployment"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Website (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository:**
   - Select your MediVerse repository
   - Click "Import"

4. **Configure Project Settings:**
   - **Project Name:** mediverse (or your preferred name)
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. **Click "Deploy"**

   Vercel will now:
   - Install dependencies
   - Build your project
   - Deploy it to a live URL

6. **Wait for deployment** (usually takes 2-3 minutes)

7. **Your site is live!** 🎉
   - You'll get a URL like: `https://mediverse-xxxxx.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: mediverse
# - Directory: ./
# - Override settings? No

# For production deployment
vercel --prod
```

## Step 4: Post-Deployment

### Custom Domain (Optional)
1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables (If needed)
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add any API keys or secrets

## Automatic Deployments

✨ **Good news!** Vercel automatically:
- Deploys your `main` branch to production
- Creates preview deployments for pull requests
- Rebuilds your site when you push changes

## Troubleshooting

### Build Fails?

**Check the build logs** on Vercel dashboard for errors.

Common fixes:
```bash
# Test build locally first
npm install
npm run build

# If successful, the build folder should be created
```

### Page Not Found on Refresh?

✅ **Already Fixed!** The `vercel.json` file includes rewrites to handle client-side routing.

### Missing Dependencies?

Make sure all dependencies are in `package.json` (not just devDependencies):
```bash
# Reinstall and save properly
npm install <package-name> --save
```

## Project Structure

```
mediverse/
├── build/              # Production build (auto-generated)
├── node_modules/       # Dependencies (not committed)
├── src/               # Source code
│   ├── components/    # React components
│   ├── App.tsx       # Main app component
│   └── main.tsx      # Entry point
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
├── vite.config.ts     # Vite configuration
├── vercel.json        # Vercel configuration
└── tsconfig.json      # TypeScript configuration
```

## Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (test before deploying)
npm run build

# Preview production build locally
npm run preview
```

## Next Steps

1. ✅ Push your code to GitHub
2. ✅ Deploy to Vercel
3. 🔗 Share your live URL!
4. 🎨 (Optional) Add custom domain
5. 🔄 Push updates to automatically redeploy

## Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs:** [vitejs.dev](https://vitejs.dev)

---

**Your project is now ready to deploy!** 🚀

Simply push to GitHub and connect with Vercel to go live.
