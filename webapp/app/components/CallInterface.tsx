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

  // Initialize VAPI client
  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on('call-start', () => {
      setCallStatus('connected');
      setIsCallActive(true);
    });

    vapiInstance.on('call-end', () => {
      setCallStatus('ended');
      setIsCallActive(false);
      setTimeout(() => setCallStatus('idle'), 3000);
    });

    vapiInstance.on('speech-start', () => {
      console.log('User started speaking');
    });

    vapiInstance.on('speech-end', () => {
      console.log('User stopped speaking');
    });

    vapiInstance.on('message', (message: any) => {
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
      console.error('VAPI Error:', error);
      setCallStatus('ended');
      setIsCallActive(false);
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  // Create assistant on component mount
  useEffect(() => {
    const createAssistant = async () => {
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
        if (data.assistant) {
          setAssistantId(data.assistant.id);
        }
      } catch (error) {
        console.error('Error creating assistant:', error);
      }
    };
    createAssistant();
  }, []);

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
    if (!vapi || !assistantId) return;

    // Validate phone number if phone call type is selected
    if (callType === 'phone' && !validatePhoneNumber(phoneNumber)) {
      return;
    }

    setIsLoading(true);
    try {
      if (isCallActive) {
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
        setCallStatus('connecting');
        setMessages([]);
        setDuration('00:00');
        
        if (callType === 'web') {
          // Web-based call (browser to browser)
          await vapi.start(assistantId);
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
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Phone Number
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
                    disabled={isCallActive}
                  />
                </div>
                {phoneError && (
                  <p className="mt-2 text-sm text-red-600">{phoneError}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Enter the phone number with country code (e.g., +1 for US) or just the 10-digit number for US calls.
                </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}