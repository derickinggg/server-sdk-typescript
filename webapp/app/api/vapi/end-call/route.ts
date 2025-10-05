import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

const client = new VapiClient({
  token: process.env.VAPI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { callId } = body;

    if (!callId) {
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
      );
    }

    const call = await client.calls.delete(callId);

    return NextResponse.json({ call });
  } catch (error) {
    console.error('Error ending call:', error);
    return NextResponse.json(
      { error: 'Failed to end call' },
      { status: 500 }
    );
  }
}