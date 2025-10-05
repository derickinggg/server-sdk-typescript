# Vercel Deployment Instructions

This project is ready to be deployed to Vercel. The webapp directory contains a Next.js application with a `vercel.json` configuration file.

## Prerequisites

- Vercel CLI is already installed globally (`npm install -g vercel`)
- You need a Vercel account

## Deployment Steps

### Option 1: Interactive Deployment (Recommended)

1. Navigate to the webapp directory:
   ```bash
   cd webapp
   ```

2. Run the Vercel CLI:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Login to your Vercel account if prompted
   - Select or create a new project
   - Use the default settings or customize as needed

### Option 2: Using a Vercel Token

1. Generate a token from your Vercel dashboard:
   - Go to https://vercel.com/account/tokens
   - Create a new token

2. Deploy using the token:
   ```bash
   cd webapp
   vercel --token YOUR_VERCEL_TOKEN
   ```

### Option 3: Deploy from GitHub

1. Push your code to a GitHub repository
2. Import the project on Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Set the root directory to `webapp`
   - Deploy

## Configuration

The project already includes:
- `vercel.json` with build configuration
- Environment variables for VAPI keys (in vercel.json)
- Next.js framework detection

## After Deployment

Once deployed, Vercel will provide you with:
- A production URL
- Preview URLs for each deployment
- Automatic deployments on git push (if connected to GitHub)

## Environment Variables

The following environment variables are already configured in `vercel.json`:
- `VAPI_API_KEY`: 4352ebaf-43e4-4b22-9dfa-fdb8a4eff554
- `NEXT_PUBLIC_VAPI_PUBLIC_KEY`: 899811a4-02a5-407d-a8f1-6fa8060db666

**Important**: For production, you should update these keys with your own VAPI credentials through the Vercel dashboard.