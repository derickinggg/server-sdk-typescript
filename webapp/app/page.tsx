import { CallInterface } from './components/CallInterface';
import Link from 'next/link';
import { Bot, Sparkles, Phone } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            VAPI Calling Agent
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience seamless voice conversations with AI
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              href="/agent-builder" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Bot className="w-5 h-5 mr-2" />
              Agent Builder
              <Sparkles className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              href="/demo" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Enhanced Demo
            </Link>
          </div>
        </div>
        
        <CallInterface />
        
        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Custom Agents</h3>
            <p className="text-gray-600">
              Build AI agents with custom prompts, voices, and behaviors using our intuitive builder
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice Calling</h3>
            <p className="text-gray-600">
              Make real-time voice calls with your AI agents directly from your browser
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Advanced Features</h3>
            <p className="text-gray-600">
              Enhanced SDK with call progress tracking, manual say, and microphone controls
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}