# VAPI Agent Builder

A comprehensive web application for building, managing, and testing custom AI voice agents using the VAPI SDK. Features a step-by-step agent creation wizard with bilingual support (English/Chinese).

## Features

- 🤖 **Step-by-step Agent Builder**: Create custom AI agents with a 4-step wizard
- 🌐 **Bilingual Support**: Full English and Chinese language support
- 📊 **Agent Management Dashboard**: View, search, and manage all your agents
- 🎙️ **Real-time Voice Calling**: Test agents with live voice conversations
- 💬 **Live Transcription**: See conversations in real-time
- 🎛️ **Advanced Configuration**: Customize voice, AI model, behavior, and more
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🚀 **Built with Next.js 14**: Fast, SEO-friendly, and production-ready

## Prerequisites

- Node.js 18+ installed
- VAPI account and API credentials
- Vercel account (for deployment)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd webapp
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env.local` file with your API keys:
   ```env
   VAPI_API_KEY=your-vapi-api-key
   VERCEL_API_KEY=your-vercel-api-key
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
   ```

   To get your VAPI public key:
   - Log in to your VAPI dashboard
   - Navigate to Settings > API Keys
   - Copy your public key (used for browser-based calls)

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

1. **Start a Call**: Click the blue phone button to initiate a call with the AI assistant
2. **Allow Microphone Access**: Grant microphone permissions when prompted by your browser
3. **Have a Conversation**: Speak naturally with the AI assistant
4. **Use Controls**: 
   - Mute/unmute your microphone
   - Toggle speaker (UI only)
5. **End Call**: Click the red phone button to end the conversation

## Project Structure

```
webapp/
├── app/
│   ├── api/vapi/          # API routes for VAPI SDK integration
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/               # Static assets
├── .env.local           # Environment variables (not in git)
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## Key Components

- **CallInterface**: Main component managing the calling experience
- **CallButton**: Interactive button for starting/ending calls
- **CallStatus**: Displays current call status and duration
- **CallControls**: Mute and speaker controls
- **TranscriptDisplay**: Real-time conversation transcript

## API Routes

- `/api/vapi/create-assistant`: Creates a new VAPI assistant
- `/api/vapi/create-call`: Initiates a new call
- `/api/vapi/end-call`: Ends an active call

## Deployment

### Quick Deploy with Vercel CLI

```bash
cd webapp
npx vercel --prod
```

### Deploy via Git Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "VAPI Agent Builder"
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `webapp` directory as the root directory

3. **Environment Variables**
   Add these in your Vercel project settings:
   - `VAPI_API_KEY`: Your VAPI API key
   - `NEXT_PUBLIC_VAPI_PUBLIC_KEY`: Your VAPI public key

For detailed deployment instructions, see [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

## Customization

### Modify Assistant Behavior

Edit the assistant configuration in `/app/api/vapi/create-assistant/route.ts`:

```typescript
const assistant = await client.assistants.create({
  name: 'Your Assistant Name',
  firstMessage: 'Your custom greeting',
  model: {
    provider: 'openai',
    model: 'gpt-4', // or 'gpt-3.5-turbo'
    messages: [
      {
        role: 'system',
        content: 'Your custom system prompt',
      },
    ],
  },
  voice: {
    provider: 'elevenlabs',
    voiceId: 'voice-id', // Change voice
  },
});
```

### Styling

The app uses Tailwind CSS for styling. Modify the color scheme in `tailwind.config.js` or update component styles directly.

## Troubleshooting

### Microphone Not Working
- Ensure your browser has microphone permissions
- Check if another application is using the microphone
- Try using HTTPS (required for microphone access)

### API Errors
- Verify your VAPI API key is correct
- Check VAPI dashboard for usage limits
- Ensure all environment variables are set

### Build Errors
- Clear `.next` directory and rebuild
- Ensure Node.js version is 18+
- Check for TypeScript errors with `npm run build`

## Security Considerations

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Implement rate limiting for production use
- Add authentication if needed

## License

This project is licensed under the MIT License.