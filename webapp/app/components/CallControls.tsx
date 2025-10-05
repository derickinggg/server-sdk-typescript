'use client';

import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface CallControlsProps {
  isMuted: boolean;
  isSpeakerOn: boolean;
  onMuteToggle: () => void;
  onSpeakerToggle: () => void;
  disabled?: boolean;
}

export function CallControls({
  isMuted,
  isSpeakerOn,
  onMuteToggle,
  onSpeakerToggle,
  disabled = false,
}: CallControlsProps) {
  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={onMuteToggle}
        disabled={disabled}
        className={cn(
          'p-4 rounded-full transition-all duration-200',
          isMuted
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isMuted ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={onSpeakerToggle}
        disabled={disabled}
        className={cn(
          'p-4 rounded-full transition-all duration-200',
          !isSpeakerOn
            ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSpeakerOn ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}