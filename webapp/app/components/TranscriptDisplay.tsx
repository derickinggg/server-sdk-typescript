'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/app/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TranscriptDisplayProps {
  messages: Message[];
}

export function TranscriptDisplay({ messages }: TranscriptDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Conversation Transcript</h3>
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet...</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700'
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}