'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { CallButton } from './CallButton';
import { CallStatus } from './CallStatus';
import { CallControls } from './CallControls';
import { TranscriptDisplay } from './TranscriptDisplay';
import { PhoneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function CallInterface() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [duration, setDuration] = useState('00:00');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callType, setCallType] = useState<'web' | 'phone'>('web');
  const [phoneError, setPhoneError] = useState('');
  const [vapiPhoneNumbers, setVapiPhoneNumbers] = useState<any[]>([]);
  const [selectedVapiNumber, setSelectedVapiNumber] = useState<string>('');
  const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState(false);

  // Initialize VAPI client
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    console.log('Initializing VAPI with public key:', publicKey ? `${publicKey.substring(0, 8)}...` : 'NOT FOUND');
    
    if (!publicKey) {
      console.error('NEXT_PUBLIC_VAPI_PUBLIC_KEY is not set!');
      setPhoneError('VAPI public key is not configured. Please contact administrator.');
      return;
    }
    
    const vapiInstance = new Vapi(publicKey);
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on('call-start', () => {
      console.log('VAPI Event: call-start');
      setCallStatus('connected');
      setIsCallActive(true);
    });

    vapiInstance.on('call-end', () => {
      console.log('VAPI Event: call-end');
      setCallStatus('ended');
      setIsCallActive(false);
      setTimeout(() => setCallStatus('idle'), 3000);
    });

    vapiInstance.on('speech-start', () => {
      console.log('VAPI Event: speech-start');
    });

    vapiInstance.on('speech-end', () => {
      console.log('VAPI Event: speech-end');
    });

    vapiInstance.on('message', (message: any) => {
      console.log('VAPI Event: message', message);
      if (message.type === 'transcript' && message.transcript) {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: message.role === 'user' ? 'user' : 'assistant',
          content: message.transcript,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    vapiInstance.on('error', (error: any) => {
      console.error('VAPI Event: error', error);
      setCallStatus('ended');
      setIsCallActive(false);
      setPhoneError(error.message || 'An error occurred during the call');
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  // Create assistant on component mount
  useEffect(() => {
    const createAssistant = async () => {
      console.log('Creating VAPI assistant...');
      try {
        const response = await fetch('/api/vapi/create-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'VAPI Calling Assistant',
            firstMessage: 'Hello! I am your AI assistant. How can I help you today?',
          }),
        });
        
        const data = await response.json();
        console.log('Create assistant response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create assistant');
        }
        
        if (data.assistant) {
          setAssistantId(data.assistant.id);
          console.log('Assistant created successfully with ID:', data.assistant.id);
        } else {
          throw new Error('No assistant returned from API');
        }
      } catch (error: any) {
        console.error('Error creating assistant:', error);
        setPhoneError(`Failed to create assistant: ${error.message}`);
      }
    };
    createAssistant();
  }, []);

  // Fetch VAPI phone numbers when phone call type is selected
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      if (callType === 'phone' && vapiPhoneNumbers.length === 0) {
        setLoadingPhoneNumbers(true);
        try {
          const response = await fetch('/api/vapi/phone-numbers');
          const data = await response.json();
          
          if (data.error) {
            // Handle specific error cases
            if (response.status === 401) {
              setPhoneError('VAPI API key is invalid or missing. Please contact your administrator to set up the correct API key.');
            } else if (response.status === 500 && data.error.includes('not configured')) {
              setPhoneError('VAPI API key is not configured. Please set up the API key in Vercel environment variables.');
            } else {
              setPhoneError(data.error || 'Failed to fetch phone numbers.');
            }
          } else if (data.phoneNumbers && data.phoneNumbers.length > 0) {
            setVapiPhoneNumbers(data.phoneNumbers);
            // Auto-select the first phone number
            setSelectedVapiNumber(data.phoneNumbers[0].id);
          } else {
            setPhoneError('No VAPI phone numbers found. Please purchase a phone number from your VAPI dashboard at https://dashboard.vapi.ai');
          }
        } catch (error) {
          console.error('Error fetching phone numbers:', error);
          setPhoneError('Failed to fetch phone numbers. Please check your VAPI configuration.');
        } finally {
          setLoadingPhoneNumbers(false);
        }
      }
    };
    
    fetchPhoneNumbers();
  }, [callType, vapiPhoneNumbers.length]);

  // Update call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        setDuration(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Validate phone number
  const validatePhoneNumber = (number: string): boolean => {
    // Remove all non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    
    // Check if it's a valid phone number (10-15 digits)
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      setPhoneError('Please enter a valid phone number (10-15 digits)');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  // Format phone number for display
  const formatPhoneNumber = (number: string): string => {
    const cleanNumber = number.replace(/\D/g, '');
    
    // Format as US number if 10 digits
    if (cleanNumber.length === 10) {
      return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    }
    
    // Format as international number
    if (cleanNumber.length > 10) {
      return `+${cleanNumber}`;
    }
    
    return cleanNumber;
  };

  const handleCallToggle = async () => {
    console.log('handleCallToggle called', { vapi: !!vapi, assistantId, callType });
    
    if (!vapi) {
      setPhoneError('VAPI client not initialized. Please refresh the page.');
      return;
    }
    
    if (!assistantId) {
      setPhoneError('Assistant not created. Please wait or refresh the page.');
      return;
    }

    // Validate phone number if phone call type is selected
    if (callType === 'phone') {
      if (!validatePhoneNumber(phoneNumber)) {
        return;
      }
      
      // Check if a VAPI phone number is selected
      if (!selectedVapiNumber) {
        setPhoneError('Please select a VAPI phone number to make calls from. If you don\'t have one, purchase it from your VAPI dashboard.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isCallActive) {
        console.log('Ending call...');
        if (callType === 'web') {
          await vapi.stop();
        } else {
          // For phone calls, we just update the UI since the call is happening externally
          setCallStatus('ended');
          setIsCallActive(false);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Call ended.',
            timestamp: new Date(),
          }]);
        }
      } else {
        console.log('Starting call...', { callType, assistantId });
        setCallStatus('connecting');
        setMessages([]);
        setDuration('00:00');
        
        if (callType === 'web') {
          // Web-based call (browser to browser)
          console.log('Starting web call with assistant:', assistantId);
          try {
            // VAPI Web SDK expects the start method to be called with the assistant ID
            const result = await vapi.start(assistantId);
            console.log('Web call started successfully', result);
          } catch (startError: any) {
            console.error('Failed to start web call:', startError);
            throw new Error(`Failed to start call: ${startError.message || 'Unknown error'}`);
          }
        } else {
          // Phone call to actual phone number
          const cleanNumber = phoneNumber.replace(/\D/g, '');
          const formattedNumber = cleanNumber.length === 10 ? `+1${cleanNumber}` : `+${cleanNumber}`;
          
          // Create a phone call using the API
          const response = await fetch('/api/vapi/create-call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assistantId,
              phoneNumberId: selectedVapiNumber,
              customerPhoneNumber: formattedNumber,
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to create phone call');
          }
          
          const data = await response.json();
          console.log('Phone call created:', data);
          
          // Handle error from API
          if (data.error) {
            throw new Error(data.error);
          }
          
          // For phone calls, we'll show a different status
          setCallStatus('connected');
          setIsCallActive(true);
          
          // Add initial message
          setMessages([{
            id: Date.now().toString(),
            role: 'assistant',
            content: `Calling ${formatPhoneNumber(phoneNumber)}...`,
            timestamp: new Date(),
          }, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'The call has been initiated. The AI assistant will speak with the person who answers.',
            timestamp: new Date(),
          }]);
        }
      }
    } catch (error: any) {
      console.error('Error toggling call:', error);
      setCallStatus('ended');
      setIsCallActive(false);
      
      // Provide specific error messages based on the error
      if (error.message.includes('Insufficient credits')) {
        setPhoneError('Insufficient credits in your VAPI account. Please add credits to make phone calls.');
      } else if (error.message.includes('Assistant not found')) {
        setPhoneError('Assistant configuration error. Please try creating a new agent.');
      } else if (error.message.includes('Invalid phone number')) {
        setPhoneError('Invalid phone number format. Please check and try again.');
      } else if (error.message.includes('microphone')) {
        setPhoneError('Microphone access denied. Please allow microphone access and try again.');
      } else {
        setPhoneError(error.message || 'Failed to make the call. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMuteToggle = () => {
    if (vapi && isCallActive) {
      if (isMuted) {
        vapi.setMuted(false);
      } else {
        vapi.setMuted(true);
      }
      setIsMuted(!isMuted);
    }
  };

  const handleSpeakerToggle = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // Note: VAPI Web SDK doesn't have speaker control, this is for UI only
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            VAPI Calling Agent
          </h1>

          <div className="space-y-8">
            {/* Call Type Selection */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setCallType('web')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  callType === 'web'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Web Call
              </button>
              <button
                onClick={() => setCallType('phone')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  callType === 'phone'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Phone Call
              </button>
            </div>

            {/* Phone Number Input */}
            {callType === 'phone' && (
              <div className="max-w-md mx-auto space-y-4">
                {/* VAPI Phone Number Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Your VAPI Phone Number (Caller ID)
                    </label>
                    <button
                      onClick={async () => {
                        setVapiPhoneNumbers([]); // Clear to trigger refetch
                        setPhoneError('');
                      }}
                      className="text-sm text-purple-600 hover:text-purple-700"
                      disabled={loadingPhoneNumbers}
                    >
                      Refresh
                    </button>
                  </div>
                  {loadingPhoneNumbers ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading phone numbers...</p>
                    </div>
                  ) : vapiPhoneNumbers.length > 0 ? (
                    <select
                      value={selectedVapiNumber}
                      onChange={(e) => setSelectedVapiNumber(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={isCallActive}
                    >
                      {vapiPhoneNumbers.map((number) => (
                        <option key={number.id} value={number.id}>
                          {number.number} ({number.provider})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        No VAPI phone numbers found. To make outbound calls:
                      </p>
                      <ol className="mt-2 text-sm text-yellow-700 list-decimal list-inside space-y-1">
                        <li>Go to your <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer" className="underline font-medium">VAPI Dashboard</a></li>
                        <li>Navigate to Phone Numbers section</li>
                        <li>Purchase a phone number</li>
                        <li>Refresh this page to see your numbers</li>
                      </ol>
                    </div>
                  )}
                </div>

                {/* Target Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Phone Number (Who to Call)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setPhoneError(''); // Clear error on input change
                      }}
                      placeholder="Enter phone number (e.g., +1234567890)"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={isCallActive || vapiPhoneNumbers.length === 0}
                    />
                  </div>
                  {phoneError && (
                    <p className="mt-2 text-sm text-red-600">{phoneError}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Enter the phone number with country code (e.g., +1 for US) or just the 10-digit number for US calls.
                  </p>
                </div>
              </div>
            )}

            {/* Call Status */}
            <CallStatus status={callStatus} duration={callStatus === 'connected' ? duration : undefined} />

            {/* Call Button */}
            <div className="flex justify-center">
              <CallButton
                isCallActive={isCallActive}
                isLoading={isLoading}
                onClick={handleCallToggle}
              />
            </div>

            {/* Call Controls */}
            {isCallActive && callType === 'web' && (
              <CallControls
                isMuted={isMuted}
                isSpeakerOn={isSpeakerOn}
                onMuteToggle={handleMuteToggle}
                onSpeakerToggle={handleSpeakerToggle}
              />
            )}

            {/* Transcript */}
            <TranscriptDisplay messages={messages} />

            {/* Instructions */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              {callType === 'web' ? (
                <>
                  <p>Click the phone button to start a web call with the AI assistant.</p>
                  <p>Make sure to allow microphone access when prompted.</p>
                </>
              ) : (
                <>
                  <p>Enter a phone number and click the phone button to call.</p>
                  <p>The AI assistant will call the specified number.</p>
                </>
              )}
            </div>

            {/* Debug Section */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Information</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>VAPI Client: {vapi ? '✅ Initialized' : '❌ Not initialized'}</p>
                <p>Assistant ID: {assistantId || 'Not created'}</p>
                <p>Public Key: {process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ? '✅ Present' : '❌ Missing'}</p>
              </div>
              <button
                onClick={async () => {
                  console.log('Testing VAPI connection...');
                  try {
                    const response = await fetch('/api/vapi/test');
                    const data = await response.json();
                    console.log('VAPI test results:', data);
                    alert(`VAPI Test Results:\n${JSON.stringify(data, null, 2)}`);
                  } catch (error) {
                    console.error('Test failed:', error);
                    alert('Failed to test VAPI connection');
                  }
                }}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Test VAPI Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}