import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

export async function GET(req: NextRequest) {
  // Check if API key is configured
  if (!process.env.VAPI_API_KEY) {
    return NextResponse.json(
      { 
        error: 'VAPI API key not configured. Please set VAPI_API_KEY environment variable.',
        phoneNumbers: [],
        hasPhoneNumbers: false,
        count: 0
      },
      { status: 500 }
    );
  }

  const client = new VapiClient({
    token: process.env.VAPI_API_KEY,
  });

  try {
    // Fetch all phone numbers associated with the account
    const phoneNumbers = await client.phoneNumbers.list();
    
    // Filter only active phone numbers
    const activeNumbers = phoneNumbers.filter((number: any) => 
      number.status === 'active' || number.status === 'released'
    );
    
    return NextResponse.json({ 
      phoneNumbers: activeNumbers,
      hasPhoneNumbers: activeNumbers.length > 0,
      count: activeNumbers.length
    });
  } catch (error: any) {
    console.error('Error fetching phone numbers:', error);
    
    // Handle authentication errors
    if (error.statusCode === 401 || error.response?.status === 401) {
      return NextResponse.json(
        { 
          error: 'Invalid VAPI API key. Please check your API key in the Vercel environment variables.',
          phoneNumbers: [],
          hasPhoneNumbers: false,
          count: 0,
          helpUrl: 'https://dashboard.vapi.ai/account'
        },
        { status: 401 }
      );
    }
    
    // If no phone numbers found, return empty array
    if (error.response?.status === 404) {
      return NextResponse.json({ 
        phoneNumbers: [],
        hasPhoneNumbers: false,
        count: 0,
        message: 'No phone numbers found. Please purchase a phone number from VAPI dashboard.'
      });
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch phone numbers',
        phoneNumbers: [],
        hasPhoneNumbers: false,
        count: 0
      },
      { status: 500 }
    );
  }
}