import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

const client = new VapiClient({
  token: process.env.VAPI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, firstMessage, model, voice } = body;

    const assistant = await client.assistants.create({
      name: name || 'VAPI Calling Assistant',
      firstMessage: firstMessage || 'Hello! I am your AI assistant. How can I help you today?',
      model: {
        provider: 'openai',
        model: model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful and friendly AI assistant. Be conversational and engaging while helping users with their queries.',
          },
        ],
      },
      voice: {
        provider: '11labs',
        voiceId: voice || 'rachel',
      },
    });

    return NextResponse.json({ assistant });
  } catch (error) {
    console.error('Error creating assistant:', error);
    return NextResponse.json(
      { error: 'Failed to create assistant' },
      { status: 500 }
    );
  }
}