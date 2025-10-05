import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

const client = new VapiClient({
  token: process.env.VAPI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assistantId, phoneNumber, customerPhoneNumber } = body;

    if (!assistantId) {
      return NextResponse.json(
        { error: 'Assistant ID is required' },
        { status: 400 }
      );
    }

    // Create web call (browser-based)
    const call = await client.calls.create({
      assistantId,
      ...(phoneNumber && { phoneNumberId: phoneNumber }),
      ...(customerPhoneNumber && { customer: { number: customerPhoneNumber } }),
    });

    return NextResponse.json({ call });
  } catch (error) {
    console.error('Error creating call:', error);
    return NextResponse.json(
      { error: 'Failed to create call' },
      { status: 500 }
    );
  }
}