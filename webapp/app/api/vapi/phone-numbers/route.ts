import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

const client = new VapiClient({
  token: process.env.VAPI_API_KEY || '',
});

export async function GET(req: NextRequest) {
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
      { error: error.message || 'Failed to fetch phone numbers' },
      { status: 500 }
    );
  }
}