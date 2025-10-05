#!/bin/bash

echo "🚀 Setting up VAPI Calling Agent Web App..."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check for .env.local file
if [ ! -f .env.local ]; then
    echo "⚠️  No .env.local file found. Creating one..."
    cp .env.local.example .env.local 2>/dev/null || cat > .env.local << EOF
# Server-side VAPI API key
VAPI_API_KEY=

# Vercel API key for deployment
VERCEL_API_KEY=

# Client-side VAPI public key (required for browser calls)
# Get this from your VAPI dashboard: Settings > API Keys > Public Key
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
EOF
    echo "📝 Created .env.local file. Please add your API keys."
else
    echo "✅ .env.local file exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your API keys to .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🚀"