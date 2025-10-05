import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, firstMessage, model, voice } = body;

    // Mock response for deployment
    // In production, you would use the actual VAPI SDK
    const assistant = {
      id: 'mock-assistant-' + Date.now(),
      name: name || 'VAPI Calling Assistant',
      firstMessage: firstMessage || 'Hello! I am your AI assistant. How can I help you today?',
      model: {
        provider: 'openai',
        model: model || 'gpt-3.5-turbo',
      },
      voice: {
        provider: 'elevenlabs',
        voiceId: voice || 'rachel',
      },
    };

    return NextResponse.json({ assistant });
  } catch (error) {
    console.error('Error creating assistant:', error);
    return NextResponse.json(
      { error: 'Failed to create assistant' },
      { status: 500 }
    );
  }
}