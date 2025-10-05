# Vercel Deployment Guide

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- VAPI API credentials from https://dashboard.vapi.ai/account

## Deployment Steps

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the project**:
   ```bash
   cd webapp
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N` (for first deployment)
   - Project name: `vapi-agent-builder` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings: `N`

### Option 2: Deploy via Git Integration

1. **Push code to GitHub/GitLab/Bitbucket**:
   ```bash
   git add .
   git commit -m "VAPI Agent Builder"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import your repository
   - Select the `webapp` directory as the root directory

3. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Option 3: Deploy Directly

Since this is already configured with `vercel.json`, you can deploy directly:

```bash
cd /workspace/webapp
npx vercel --prod
```

## Environment Variables

The following environment variables are required for the application to work:

| Variable | Description | Required |
|----------|-------------|----------|
| `VAPI_API_KEY` | Your VAPI API key for server-side operations | Yes |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | Your VAPI public key for client-side operations | Yes |

### Setting Environment Variables in Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `VAPI_API_KEY`: Your private API key
   - `NEXT_PUBLIC_VAPI_PUBLIC_KEY`: Your public key

**Note**: The environment variables are already configured in `vercel.json` for this deployment. However, for security, it's recommended to:
1. Remove the hardcoded values from `vercel.json`
2. Set them in Vercel's dashboard instead

## Post-Deployment

After successful deployment:

1. **Test the Application**:
   - Visit your deployment URL
   - Test the agent builder workflow
   - Verify language switching works
   - Test creating and calling agents

2. **Custom Domain** (Optional):
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Monitor Performance**:
   - Check Analytics tab for usage
   - Monitor Functions tab for API usage
   - Review Speed Insights for performance

## Troubleshooting

### Build Failures
- Ensure all dependencies are listed in `package.json`
- Check for TypeScript errors: `npm run build`
- Verify environment variables are set

### Runtime Errors
- Check Vercel Functions logs
- Ensure VAPI API keys are valid
- Verify CORS settings if calling from different domains

### Performance Issues
- Enable caching for static assets
- Optimize images and fonts
- Consider using Vercel Edge Functions for better performance

## Security Recommendations

1. **Remove hardcoded API keys** from `vercel.json`
2. **Use environment variables** from Vercel dashboard
3. **Enable HTTPS** (automatic with Vercel)
4. **Set up rate limiting** for API routes
5. **Monitor API usage** in VAPI dashboard

## Updating the Deployment

To update your deployment:

```bash
# Make your changes
git add .
git commit -m "Update description"
git push origin main

# Or use Vercel CLI
vercel --prod
```

## Support

- Vercel Documentation: https://vercel.com/docs
- VAPI Documentation: https://docs.vapi.ai
- Next.js Documentation: https://nextjs.org/docs