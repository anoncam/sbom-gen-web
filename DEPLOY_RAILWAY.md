# 🚂 Deploying to Railway

This guide walks you through deploying the SBOM Generator web application to Railway.

## Prerequisites

- A [Railway account](https://railway.app)
- Git repository with the code
- Railway CLI (optional): `npm install -g @railway/cli`

## Deployment Methods

### Method 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Railway deployment configuration"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect the Dockerfile

3. **Configure Environment (Optional)**
   - Railway automatically sets `PORT`
   - Add any custom variables in Railway dashboard:
     - `NODE_ENV=production` (auto-set)
     - `RATE_LIMIT_MAX_REQUESTS=10` (optional)

4. **Deploy**
   - Railway will automatically build and deploy
   - Monitor logs in the Railway dashboard
   - Your app will be available at `https://your-app.railway.app`

### Method 2: Deploy with Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Open Your App**
   ```bash
   railway open
   ```

### Method 3: Deploy with Docker (Custom)

1. **Use the optimized Railway Dockerfile**
   ```bash
   # Rename the Railway-optimized Dockerfile
   mv Dockerfile.railway Dockerfile
   ```

2. **Deploy via Railway Dashboard**
   - Create new project
   - Select "Deploy a Docker Image"
   - Connect your GitHub repo
   - Railway will use the Dockerfile

## Configuration Files Explained

### `railway.json`
- Defines build and deploy configuration
- Specifies Docker as the builder
- Sets health checks and restart policies

### `railway.toml`
- Alternative configuration format
- Defines service name and domains
- Sets environment variables

### `Dockerfile.railway`
- Optimized for Railway's infrastructure
- Multi-stage build for smaller image size
- Parallel tool installation for faster builds
- Includes health checks

## Post-Deployment

### Monitor Your App
```bash
# View logs
railway logs

# Check deployment status
railway status

# Open Railway dashboard
railway open
```

### Custom Domain (Optional)
1. Go to your project in Railway dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

## Environment Variables

Railway automatically provides:
- `PORT` - The port your app should listen on
- `RAILWAY_STATIC_URL` - Your app's Railway URL
- `RAILWAY_ENVIRONMENT` - Current environment name

## Troubleshooting

### Build Fails
- Check Dockerfile syntax
- Ensure all dependencies are listed in package.json
- Review build logs in Railway dashboard

### App Crashes
- Check if app binds to `0.0.0.0:$PORT`
- Review application logs: `railway logs`
- Verify scanning tools installed correctly

### Scanning Tools Not Working
- Ensure Dockerfile includes tool installation
- Check temp directory permissions
- Verify network access for downloading tools

## Resource Limits

Railway's free tier includes:
- $5/month credits
- 512MB RAM
- 1GB disk
- Unlimited inbound bandwidth

For SBOM generation of large images, consider upgrading to:
- Developer plan: $20/month
- More RAM and CPU for faster processing
- Priority support

## Optimization Tips

1. **Use Docker layer caching**
   - Order Dockerfile commands from least to most frequently changing
   
2. **Minimize image size**
   - Use multi-stage builds
   - Clean up package caches
   
3. **Configure health checks**
   - Ensures Railway knows when your app is ready
   
4. **Use environment variables**
   - Store configuration in Railway dashboard
   - Never commit secrets to git

## Support

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/your-repo/issues)

## Quick Deploy Button

Add this to your README for one-click deploys:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR_TEMPLATE_URL)
```

---

Happy deploying! 🚀