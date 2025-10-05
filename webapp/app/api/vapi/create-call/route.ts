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

    // If customerPhoneNumber is provided, this is an outbound phone call
    if (customerPhoneNumber) {
      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(customerPhoneNumber)) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }

      // Create outbound phone call
      const call = await client.calls.create({
        assistantId,
        customer: {
          number: customerPhoneNumber,
        },
        // You can optionally specify a phone number to call from
        // phoneNumberId: 'your-vapi-phone-number-id',
      });

      return NextResponse.json({ 
        call,
        message: `Initiating call to ${customerPhoneNumber}`,
        type: 'outbound_phone'
      });
    } else {
      // Create web call (browser-based)
      const call = await client.calls.create({
        assistantId,
        ...(phoneNumber && { phoneNumberId: phoneNumber }),
      });

      return NextResponse.json({ 
        call,
        type: 'web'
      });
    }
  } catch (error: any) {
    console.error('Error creating call:', error);
    
    // Provide more specific error messages
    if (error.response?.status === 402) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please add credits to your VAPI account.' },
        { status: 402 }
      );
    }
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Assistant not found. Please create an assistant first.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create call' },
      { status: 500 }
    );
  }
}