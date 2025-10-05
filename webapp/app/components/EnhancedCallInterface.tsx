'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, MessageSquare, Volume2, Send, Settings } from 'lucide-react';
import Vapi from '../lib/vapi-enhanced/vapi';

interface Message {
  time: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
}

interface CallStartProgress {
  stage: string;
  status: 'started' | 'completed' | 'failed';
  duration?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export default function EnhancedCallInterface() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [customSayText, setCustomSayText] = useState('');
  const [callProgress, setCallProgress] = useState<CallStartProgress[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced settings
  const [interruptionsEnabled, setInterruptionsEnabled] = useState(true);
  const [interruptAssistantEnabled, setInterruptAssistantEnabled] = useState(true);
  const [endCallAfterSay, setEndCallAfterSay] = useState(false);
  const [micGain, setMicGain] = useState(1);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Vapi with the public key
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (publicKey) {
      const vapiInstance = new Vapi(publicKey);
      setVapi(vapiInstance);

      // Set up event listeners
      vapiInstance.on('call-start', () => {
        console.log('Call started');
        setIsCallActive(true);
        setIsLoading(false);
        addMessage('system', 'Call connected successfully');
      });

      vapiInstance.on('call-end', () => {
        console.log('Call ended');
        setIsCallActive(false);
        setAssistantIsSpeaking(false);
        setVolumeLevel(0);
        addMessage('system', 'Call ended');
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
          addMessage('system', `Function called: ${message.functionCall.name}`);
        } else if (message.type === 'hang') {
          addMessage('system', 'Call ended by assistant');
        }
      });

      vapiInstance.on('error', (error: any) => {
        console.error('Vapi error:', error);
        setIsLoading(false);
        addMessage('system', `Error: ${error.message || error}`);
      });

      // Enhanced event listeners
      vapiInstance.on('call-start-progress', (progress: CallStartProgress) => {
        console.log('Call start progress:', progress);
        setCallProgress(prev => [...prev, progress]);
      });

      vapiInstance.on('call-start-success', (event: any) => {
        console.log('Call started successfully:', event);
        addMessage('system', `Call started in ${event.totalDuration}ms`);
      });

      vapiInstance.on('call-start-failed', (event: any) => {
        console.error('Call start failed:', event);
        setIsLoading(false);
        addMessage('system', `Call failed at stage: ${event.stage} - ${event.error}`);
      });

      return () => {
        vapiInstance.stop();
      };
    }
  }, []);

  useEffect(() => {
    // Auto-scroll messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string) => {
    setMessages(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      type,
      content
    }]);
  };

  const startCall = async () => {
    if (!vapi) return;
    
    setIsLoading(true);
    setCallProgress([]);
    
    try {
      // Use the same assistant configuration as before
      await vapi.start({
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful and friendly AI assistant. Be conversational and engaging while helping users with their queries."
            }
          ]
        },
        voice: {
          provider: "11labs",
          voiceId: "rachel"
        },
        firstMessage: "Hello! I am your AI assistant. How can I help you today?",
        endCallMessage: "Thank you for the conversation. Goodbye!",
        endCallPhrases: ["goodbye", "bye", "end call", "hang up"],
        maxDurationSeconds: 600
      });
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

  const handleManualSay = () => {
    if (!vapi || !isCallActive || !customSayText.trim()) return;
    
    vapi.say(customSayText, endCallAfterSay, interruptionsEnabled, interruptAssistantEnabled);
    
    const statusParts = [
      `Manual say: "${customSayText}"`,
      endCallAfterSay ? 'end call after' : null,
      `interrupt user: ${interruptionsEnabled ? 'enabled' : 'disabled'}`,
      `interrupt assistant: ${interruptAssistantEnabled ? 'enabled' : 'disabled'}`
    ].filter(Boolean);
    
    addMessage('system', statusParts.join(' | '));
    setCustomSayText('');
  };

  const adjustMicLevel = async () => {
    if (!vapi || !isCallActive) return;
    
    try {
      await vapi.increaseMicLevel(micGain);
      addMessage('system', `Microphone gain adjusted to ${micGain}x`);
    } catch (error) {
      addMessage('system', `Failed to adjust mic level: ${error}`);
    }
  };

  const presetMessages = [
    "Hello, how are you doing today?",
    "Let me think about that for a moment.",
    "That's a great question!",
    "Thank you for your patience.",
    "Is there anything else I can help you with?",
    "Goodbye, have a great day!"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Enhanced Voice Assistant</h2>
          <p className="text-gray-600 mt-1">Powered by advanced Vapi SDK features</p>
        </div>

        {/* Status Bar */}
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
                  <span className="text-sm text-gray-600">
                    Assistant: {assistantIsSpeaking ? '🗣️ Speaking' : '👂 Listening'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-gray-500" />
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${volumeLevel * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="p-4 bg-blue-50 border-b">
            <h3 className="font-semibold text-gray-800 mb-3">Advanced Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={interruptionsEnabled}
                  onChange={(e) => setInterruptionsEnabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">User can interrupt</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={interruptAssistantEnabled}
                  onChange={(e) => setInterruptAssistantEnabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Can interrupt assistant</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={endCallAfterSay}
                  onChange={(e) => setEndCallAfterSay(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">End call after manual say</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Mic gain:</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={micGain}
                  onChange={(e) => setMicGain(parseFloat(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm">{micGain}x</span>
                <button
                  onClick={adjustMicLevel}
                  disabled={!isCallActive}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Say Controls */}
        {isCallActive && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex space-x-2">
              <input
                type="text"
                value={customSayText}
                onChange={(e) => setCustomSayText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSay()}
                placeholder="Type something for the assistant to say..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleManualSay}
                disabled={!customSayText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {presetMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCustomSayText(message);
                    vapi?.say(message, message.includes('Goodbye'), interruptionsEnabled, interruptAssistantEnabled);
                    addMessage('system', `Preset message: "${message}"`);
                  }}
                  className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-100"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              Start a call to begin the conversation
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.type === 'assistant'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <div className="text-xs opacity-75 mb-1">
                    {message.type === 'user' ? 'You' : message.type === 'assistant' ? 'Assistant' : 'System'} • {message.time}
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Call Progress (shown during call start) */}
        {isLoading && callProgress.length > 0 && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-600">
              <div className="font-semibold mb-2">Call initialization progress:</div>
              {callProgress.map((progress, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    progress.status === 'completed' ? 'bg-green-500' :
                    progress.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <span>{progress.stage}: {progress.status}</span>
                  {progress.duration && <span className="text-gray-400">({progress.duration}ms)</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-center space-x-4">
            {!isCallActive ? (
              <button
                onClick={startCall}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </div>
    </div>
  );
}