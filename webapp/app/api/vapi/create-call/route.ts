import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

export async function POST(req: NextRequest) {
  // Check if API key is configured
  if (!process.env.VAPI_API_KEY) {
    return NextResponse.json(
      { error: 'VAPI API key not configured. Please set VAPI_API_KEY environment variable in Vercel.' },
      { status: 500 }
    );
  }

  const client = new VapiClient({
    token: process.env.VAPI_API_KEY,
  });
  try {
    const body = await req.json();
    const { assistantId, phoneNumberId, customerPhoneNumber } = body;

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

      // For outbound calls, we need a VAPI phone number
      if (!phoneNumberId) {
        return NextResponse.json(
          { error: 'A VAPI phone number is required to make outbound calls. Please purchase a phone number from your VAPI dashboard.' },
          { status: 400 }
        );
      }

      // Create outbound phone call
      const call = await client.calls.create({
        assistantId,
        phoneNumberId, // The VAPI phone number to call from
        customer: {
          number: customerPhoneNumber,
        },
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
        ...(phoneNumberId && { phoneNumberId }),
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