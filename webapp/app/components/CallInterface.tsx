'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { CallButton } from './CallButton';
import { CallStatus } from './CallStatus';
import { CallControls } from './CallControls';
import { TranscriptDisplay } from './TranscriptDisplay';

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

  const handleCallToggle = async () => {
    if (!vapi || !assistantId) return;

    setIsLoading(true);
    try {
      if (isCallActive) {
        await vapi.stop();
      } else {
        setCallStatus('connecting');
        setMessages([]);
        setDuration('00:00');
        await vapi.start(assistantId);
      }
    } catch (error) {
      console.error('Error toggling call:', error);
      setCallStatus('ended');
      setIsCallActive(false);
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
            {isCallActive && (
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
              <p>Click the phone button to start a call with the AI assistant.</p>
              <p>Make sure to allow microphone access when prompted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}