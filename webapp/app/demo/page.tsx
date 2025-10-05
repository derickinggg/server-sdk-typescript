'use client';

import { useState } from 'react';
import { CallInterface } from '../components/CallInterface';
import EnhancedCallInterface from '../components/EnhancedCallInterface';

export default function DemoPage() {
  const [showEnhanced, setShowEnhanced] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            VAPI Voice Assistant Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Experience the power of AI-powered voice conversations
          </p>
          
          {/* Toggle between interfaces */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setShowEnhanced(false)}
              className={`px-6 py-2 rounded-md transition-colors ${
                !showEnhanced 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Standard Interface
            </button>
            <button
              onClick={() => setShowEnhanced(true)}
              className={`px-6 py-2 rounded-md transition-colors ${
                showEnhanced 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Enhanced Interface ✨
            </button>
          </div>
        </div>

        {/* Interface components */}
        <div className="transition-all duration-300">
          {showEnhanced ? (
            <div>
              <div className="text-center mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Enhanced Features: Manual Say, Call Progress Tracking, Mic Gain Control
                </span>
              </div>
              <EnhancedCallInterface />
            </div>
          ) : (
            <CallInterface />
          )}
        </div>

        {/* Feature comparison */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Feature Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Standard Interface
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Basic voice calls</li>
                <li>✓ Real-time transcription</li>
                <li>✓ Mute/unmute functionality</li>
                <li>✓ Call duration tracking</li>
                <li>✓ Simple conversation display</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Enhanced Interface ✨
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Everything in Standard</li>
                <li>✓ <strong>Manual Say</strong> - Make assistant say custom text</li>
                <li>✓ <strong>Call Progress Tracking</strong> - Detailed initialization stages</li>
                <li>✓ <strong>Interruption Controls</strong> - Fine-tune conversation flow</li>
                <li>✓ <strong>Microphone Gain</strong> - Adjust input volume</li>
                <li>✓ <strong>Preset Messages</strong> - Quick response templates</li>
                <li>✓ <strong>Advanced Error Handling</strong> - Better debugging</li>
                <li>✓ <strong>Screen Sharing Ready</strong> - Built-in support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}