import { NextRequest, NextResponse } from 'next/server';

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

    // Mock response for deployment
    // In production, you would use the actual VAPI SDK
    const call = {
      id: 'mock-call-' + Date.now(),
      assistantId,
      status: 'created',
      ...(phoneNumber && { phoneNumberId: phoneNumber }),
      ...(customerPhoneNumber && { customer: { number: customerPhoneNumber } }),
    };

    return NextResponse.json({ call });
  } catch (error) {
    console.error('Error creating call:', error);
    return NextResponse.json(
      { error: 'Failed to create call' },
      { status: 500 }
    );
  }
}