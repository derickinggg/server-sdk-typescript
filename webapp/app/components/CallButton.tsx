'use client';

import React from 'react';
import { Phone, PhoneOff, Loader2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface CallButtonProps {
  isCallActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export function CallButton({ isCallActive, isLoading, onClick }: CallButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105',
        isCallActive
          ? 'bg-red-500 hover:bg-red-600 animate-pulse-ring'
          : 'bg-primary-500 hover:bg-primary-600',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isLoading ? (
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      ) : isCallActive ? (
        <PhoneOff className="w-10 h-10 text-white" />
      ) : (
        <Phone className="w-10 h-10 text-white" />
      )}
    </button>
  );
}