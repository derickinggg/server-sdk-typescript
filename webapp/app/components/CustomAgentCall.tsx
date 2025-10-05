'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Bot, Clock } from 'lucide-react';
import Vapi from '../lib/vapi-enhanced/vapi';
import { AgentConfig } from '../types/agent';

interface CustomAgentCallProps {
  agent: AgentConfig;
  onEnd?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function CustomAgentCall({ agent, onEnd }: CustomAgentCallProps) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callStartTime = useRef<Date | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize Vapi
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (publicKey) {
      const vapiInstance = new Vapi(publicKey);
      setVapi(vapiInstance);

      // Set up event listeners
      vapiInstance.on('call-start', () => {
        setIsCallActive(true);
        setIsLoading(false);
        callStartTime.current = new Date();
        startDurationTimer();
        addMessage('system', 'Call connected successfully');
      });

      vapiInstance.on('call-end', () => {
        setIsCallActive(false);
        setAssistantIsSpeaking(false);
        setVolumeLevel(0);
        stopDurationTimer();
        addMessage('system', 'Call ended');
        onEnd?.();
      });

      vapiInstance.on('speech-start', () => {
        setAssistantIsSpeaking(true);
      });

      vapiInstance.on('speech-end', () => {
        setAssistantIsSpeaking(false);
      });

      vapiInstance.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on('message', (message: any) => {
        console.log('Received message:', message);
        
        if (message.type === 'transcript') {
          if (message.transcriptType === 'final') {
            if (message.role === 'user') {
              addMessage('user', message.transcript);
            } else if (message.role === 'assistant') {
              addMessage('assistant', message.transcript);
            }
          }
        } else if (message.type === 'function-call') {
          addMessage('system', `Executing: ${message.functionCall.name}`);
        }
      });

      vapiInstance.on('error', (error: any) => {
        console.error('Vapi error:', error);
        setIsLoading(false);
        addMessage('system', `Error: ${error.message || error}`);
      });

      return () => {
        stopDurationTimer();
        vapiInstance.stop();
      };
    }
  }, [onEnd]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startDurationTimer = () => {
    durationInterval.current = setInterval(() => {
      if (callStartTime.current) {
        const duration = Math.floor((Date.now() - callStartTime.current.getTime()) / 1000);
        setCallDuration(duration);
      }
    }, 1000);
  };

  const stopDurationTimer = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  };

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date()
    }]);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!vapi) return;
    
    setIsLoading(true);
    
    try {
      // Build the assistant configuration from the agent
      const assistantConfig: any = {
        firstMessage: agent.firstMessage,
        firstMessageMode: agent.firstMessageMode,
        model: {
          provider: agent.model.provider,
          model: agent.model.model,
          temperature: agent.model.temperature,
          messages: [
            {
              role: 'system',
              content: agent.systemPrompt
            }
          ],
          ...(agent.model.emotionRecognitionEnabled && {
            emotionRecognitionEnabled: true
          })
        },
        voice: {
          provider: agent.voice.provider,
          voiceId: agent.voice.voiceId,
          ...(agent.voice.speed && { speed: agent.voice.speed })
        },
        ...(agent.endCallMessage && { endCallMessage: agent.endCallMessage }),
        ...(agent.endCallPhrases && { endCallPhrases: agent.endCallPhrases }),
        ...(agent.maxDurationSeconds && { maxDurationSeconds: agent.maxDurationSeconds }),
        ...(agent.backgroundSound && { backgroundSound: agent.backgroundSound }),
        ...(agent.interruptionsEnabled !== undefined && { 
          interruptionsEnabled: agent.interruptionsEnabled 
        }),
        ...(agent.responseDelaySeconds && { 
          responseDelaySeconds: agent.responseDelaySeconds 
        }),
        ...(agent.llmRequestDelaySeconds && { 
          llmRequestDelaySeconds: agent.llmRequestDelaySeconds 
        }),
        ...(agent.numWordsToInterruptAssistant && { 
          numWordsToInterruptAssistant: agent.numWordsToInterruptAssistant 
        })
      };

      await vapi.start(assistantConfig);
    } catch (error) {
      console.error('Error starting call:', error);
      setIsLoading(false);
      addMessage('system', `Failed to start call: ${error}`);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  const toggleMute = () => {
    if (vapi) {
      const newMutedState = !isMuted;
      vapi.setMuted(newMutedState);
      setIsMuted(newMutedState);
      addMessage('system', newMutedState ? 'Microphone muted' : 'Microphone unmuted');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Agent Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{agent.name}</h2>
              {agent.description && (
                <p className="text-purple-100 mt-1">{agent.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">
                {agent.model.provider} / {agent.model.model}
              </div>
              <div className="text-sm text-purple-100">
                {agent.voice.provider} / {agent.voice.voiceId}
              </div>
            </div>
          </div>
        </div>

        {/* Call Status */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isCallActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isCallActive ? 'Connected' : 'Disconnected'}
              </span>
              {isCallActive && (
                <>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{formatDuration(callDuration)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {assistantIsSpeaking ? '🗣️ Speaking' : '👂 Listening'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-gray-500" />
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${volumeLevel * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">💬</div>
              <p>Start a call to begin the conversation</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : message.role === 'assistant'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {message.role === 'user' ? <User className="w-4 h-4" /> : 
                       message.role === 'assistant' ? <Bot className="w-4 h-4" /> : 
                       '⚙️'}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : message.role === 'assistant'
                        ? 'bg-white border'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t">
          <div className="flex items-center justify-center space-x-4">
            {!isCallActive ? (
              <button
                onClick={startCall}
                disabled={isLoading}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    <span>Start Call</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={toggleMute}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                    isMuted 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>
                <button
                  onClick={endCall}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>End Call</span>
                </button>
              </>
            )}
          </div>
          
          {/* Max duration warning */}
          {isCallActive && agent.maxDurationSeconds && callDuration > agent.maxDurationSeconds - 60 && (
            <div className="mt-4 text-center text-sm text-orange-600">
              ⚠️ Call will end in {agent.maxDurationSeconds - callDuration} seconds
            </div>
          )}
        </div>
      </div>
    </div>
  );
}