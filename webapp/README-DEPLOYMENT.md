# Deployment Guide for VAPI Calling Agent

## Prerequisites

Before deploying this application, you need to have:

1. A VAPI account with API access
2. A Vercel account for deployment
3. (Optional) A purchased phone number from VAPI for making outbound calls

## Environment Variables

This application requires the following environment variables to be set in your Vercel deployment:

### Required Variables

- `VAPI_API_KEY`: Your VAPI API key for server-side operations
- `NEXT_PUBLIC_VAPI_PUBLIC_KEY`: Your VAPI public key for client-side operations

### How to Get Your VAPI Keys

1. Log in to your VAPI dashboard at https://dashboard.vapi.ai
2. Navigate to the Account section
3. Copy your API key and Public key

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   ```
   VAPI_API_KEY=<your-vapi-api-key>
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=<your-vapi-public-key>
   ```
4. Make sure to add these for all environments (Production, Preview, Development)

## Making Phone Calls

To make outbound phone calls to real phone numbers:

1. Purchase a phone number from VAPI:
   - Go to https://dashboard.vapi.ai
   - Navigate to Phone Numbers section
   - Purchase a phone number
   
2. The phone number will automatically appear in the dropdown when you select "Phone Call" mode

3. Enter the target phone number and click the call button

## Troubleshooting

### "Invalid VAPI API key" Error
- Verify that your API key is correct in Vercel environment variables
- Make sure the API key has not expired
- Check that you're using the correct API key (not the public key)

### "No phone numbers found" Message
- Ensure you have purchased at least one phone number from VAPI
- Click the "Refresh" button to reload phone numbers
- Check that your API key has permission to access phone numbers

### Deployment Fails
- Check the Vercel build logs for specific errors
- Ensure all environment variables are set correctly
- Verify that the Next.js version is compatible

## Local Development

For local development, create a `.env.local` file in the webapp directory:

```env
VAPI_API_KEY=your-vapi-api-key
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
```

Never commit this file to version control!

## Support

For VAPI-related issues: https://docs.vapi.ai
For deployment issues: Check Vercel documentation or this repository's issues