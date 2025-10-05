'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

interface CallStatusProps {
  status: 'idle' | 'connecting' | 'connected' | 'ended';
  duration?: string;
}

export function CallStatus({ status, duration }: CallStatusProps) {
  const statusText = {
    idle: 'Ready to call',
    connecting: 'Connecting...',
    connected: 'Connected',
    ended: 'Call ended',
  };

  const statusColor = {
    idle: 'text-gray-600',
    connecting: 'text-yellow-600',
    connected: 'text-green-600',
    ended: 'text-red-600',
  };

  return (
    <div className="text-center space-y-2">
      <p className={cn('text-lg font-medium', statusColor[status])}>
        {statusText[status]}
      </p>
      {duration && status === 'connected' && (
        <p className="text-2xl font-mono text-gray-700">{duration}</p>
      )}
    </div>
  );
}