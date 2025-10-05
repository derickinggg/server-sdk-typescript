# Deploy to Vercel - Quick Instructions

Your VAPI Agent Builder is ready for deployment! Follow these steps:

## Option 1: One-Click Deploy (Recommended)

1. **Install Vercel CLI** on your local machine:
   ```bash
   npm i -g vercel
   ```

2. **Navigate to the webapp directory**:
   ```bash
   cd /workspace/webapp
   ```

3. **Deploy with one command**:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Login to Vercel (if not already)
   - Confirm project settings
   - Wait for deployment to complete

## Option 2: Deploy from GitHub

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "VAPI Agent Builder with bilingual support"
   git push origin main
   ```

2. **Import on Vercel**:
   - Go to https://vercel.com/new
   - Import your repository
   - Select `/workspace/webapp` as root directory
   - Deploy!

## Important: Environment Variables

⚠️ **Security Warning**: The current `vercel.json` contains hardcoded API keys. For production:

1. **Use the secure version**:
   ```bash
   mv vercel.production.json vercel.json
   ```

2. **Set environment variables in Vercel Dashboard**:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add:
     - `VAPI_API_KEY` = Your VAPI API key
     - `NEXT_PUBLIC_VAPI_PUBLIC_KEY` = Your VAPI public key

## What's Deployed

✅ **Home Page** - Agent creation wizard  
✅ **My Agents** - Agent management dashboard  
✅ **Test Calls** - Voice calling interface  
✅ **Documentation** - Demo and guides  
✅ **Language Support** - English and Chinese  

## After Deployment

Your app will be available at:
- `https://your-project-name.vercel.app`

Test the deployment:
1. Create a new agent using the wizard
2. Switch between English and Chinese
3. Test voice calling functionality
4. Manage agents in the dashboard

## Need Help?

- Check `DEPLOYMENT-GUIDE.md` for detailed instructions
- Review build logs in Vercel dashboard
- Ensure VAPI API keys are valid

Happy deploying! 🚀