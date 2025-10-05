import { NextRequest, NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

export async function GET(req: NextRequest) {
  const results = {
    apiKeyPresent: !!process.env.VAPI_API_KEY,
    publicKeyPresent: !!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
    apiKeyLength: process.env.VAPI_API_KEY?.length || 0,
    publicKeyLength: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY?.length || 0,
    testResults: {} as any
  };

  if (!process.env.VAPI_API_KEY) {
    return NextResponse.json({
      ...results,
      error: 'VAPI_API_KEY not configured'
    }, { status: 500 });
  }

  const client = new VapiClient({
    token: process.env.VAPI_API_KEY,
  });

  // Test 1: Try to list assistants
  try {
    const assistants = await client.assistants.list({ limit: 1 });
    results.testResults.assistantsList = {
      success: true,
      count: assistants.length || 0
    };
  } catch (error: any) {
    results.testResults.assistantsList = {
      success: false,
      error: error.message || 'Failed to list assistants',
      statusCode: error.statusCode || error.response?.status
    };
  }

  // Test 2: Try to list phone numbers
  try {
    const phoneNumbers = await client.phoneNumbers.list();
    results.testResults.phoneNumbersList = {
      success: true,
      count: phoneNumbers.length || 0,
      numbers: phoneNumbers.map((n: any) => ({
        id: n.id,
        number: n.number,
        status: n.status
      }))
    };
  } catch (error: any) {
    results.testResults.phoneNumbersList = {
      success: false,
      error: error.message || 'Failed to list phone numbers',
      statusCode: error.statusCode || error.response?.status
    };
  }

  // Overall status
  const allTestsPassed = Object.values(results.testResults).every((test: any) => test.success);
  
  return NextResponse.json({
    ...results,
    overallStatus: allTestsPassed ? 'All tests passed' : 'Some tests failed',
    timestamp: new Date().toISOString()
  });
}