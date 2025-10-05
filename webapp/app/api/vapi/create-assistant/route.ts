import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

const client = new VapiClient({
  token: process.env.VAPI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      name, 
      firstMessage, 
      model, 
      voice, 
      systemPrompt,
      silenceTimeoutSeconds,
      responseDelaySeconds,
      interruptionThreshold,
      endCallPhrases,
      maxDurationSeconds
    } = body;

    const assistant = await client.assistants.create({
      name: name || 'VAPI Calling Assistant',
      firstMessage: firstMessage || 'Hello! I am your AI assistant. How can I help you today?',
      model: {
        provider: model?.provider || 'openai',
        model: model?.model || 'gpt-3.5-turbo',
        temperature: model?.temperature || 0.7,
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'You are a helpful and friendly AI assistant. Be conversational and engaging while helping users with their queries. Keep your responses concise and natural.',
          },
        ],
      },
      voice: {
        provider: voice?.provider || '11labs',
        voiceId: voice?.voiceId || 'rachel',
      },
      silenceTimeoutSeconds: silenceTimeoutSeconds || 30,
      responseDelaySeconds: responseDelaySeconds || 0.4,
      interruptionThreshold: interruptionThreshold || 0.5,
      endCallPhrases: endCallPhrases || ['goodbye', 'bye', 'see you later'],
      maxDurationSeconds: maxDurationSeconds || 600,
    });

    return NextResponse.json({ assistant });
  } catch (error: any) {
    console.error('Error creating assistant:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create assistant' },
      { status: 500 }
    );
  }
}