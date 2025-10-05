'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, Mic, Brain, MessageSquare, Clock, Volume2, 
  Save, Play, Copy, Trash2, ChevronDown, ChevronUp,
  Sparkles, Info, Code, TestTube
} from 'lucide-react';
import { AgentConfig, VOICE_OPTIONS, MODEL_OPTIONS } from '../types/agent';
import { agentTemplates } from '../data/agentTemplates';

interface AgentBuilderProps {
  onSave?: (agent: AgentConfig) => void;
  onTest?: (agent: AgentConfig) => void;
  initialAgent?: AgentConfig;
}

export default function AgentBuilder({ onSave, onTest, initialAgent }: AgentBuilderProps) {
  const [agent, setAgent] = useState<AgentConfig>(initialAgent || {
    name: 'New Agent',
    description: '',
    firstMessage: 'Hello! How can I help you today?',
    firstMessageMode: 'assistant-speaks-first',
    systemPrompt: '',
    model: {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      temperature: 0.7
    },
    voice: {
      provider: 'vapi',
      voiceId: 'Savannah',
      speed: 1.0
    },
    endCallPhrases: ['goodbye', 'bye', 'end call'],
    maxDurationSeconds: 600,
    backgroundSound: 'off',
    temperature: 0.7,
    interruptionsEnabled: true,
    responseDelaySeconds: 0.4,
    llmRequestDelaySeconds: 0.1,
    numWordsToInterruptAssistant: 2
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    model: true,
    voice: true,
    behavior: false,
    advanced: false
  });

  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPromptHelper, setShowPromptHelper] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyTemplate = (templateId: string) => {
    const template = agentTemplates.find(t => t.id === templateId);
    if (template) {
      setAgent(prev => ({
        ...prev,
        ...template.config
      }));
      setShowTemplates(false);
    }
  };

  const handleSave = () => {
    const agentWithTimestamp = {
      ...agent,
      updatedAt: new Date(),
      createdAt: agent.createdAt || new Date()
    };
    onSave?.(agentWithTimestamp);
  };

  const handleTest = () => {
    onTest?.(agent);
  };

  const getModelOptions = () => {
    return MODEL_OPTIONS[agent.model.provider as keyof typeof MODEL_OPTIONS] || [];
  };

  const getVoiceOptions = () => {
    return VOICE_OPTIONS[agent.voice.provider as keyof typeof VOICE_OPTIONS] || [];
  };

  const categories = ['all', 'customer-service', 'sales', 'healthcare', 'education', 'personal', 'business'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Agent Builder</h2>
              <p className="text-gray-600 mt-1">Create and customize your AI voice agent</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Templates</span>
              </button>
              <button
                onClick={handleTest}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
              >
                <TestTube className="w-4 h-4" />
                <span>Test</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Templates Modal */}
        {showTemplates && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Choose a Template</h3>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-4 flex space-x-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategory === cat 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4">
                  {agentTemplates
                    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                    .map(template => (
                      <button
                        key={template.id}
                        onClick={() => applyTemplate(template.id)}
                        className="p-4 border rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{template.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Sections */}
        <div className="divide-y">
          {/* Basic Information */}
          <div className="p-6">
            <button
              onClick={() => toggleSection('basic')}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              </div>
              {expandedSections.basic ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.basic && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                  <input
                    type="text"
                    value={agent.name}
                    onChange={(e) => setAgent(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Customer Support Agent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={agent.description || ''}
                    onChange={(e) => setAgent(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Brief description of your agent's purpose"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Message</label>
                  <textarea
                    value={agent.firstMessage || ''}
                    onChange={(e) => setAgent(prev => ({ ...prev, firstMessage: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="What should the agent say first?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Message Mode</label>
                  <select
                    value={agent.firstMessageMode}
                    onChange={(e) => setAgent(prev => ({ ...prev, firstMessageMode: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="assistant-speaks-first">Assistant speaks first</option>
                    <option value="assistant-waits-for-user">Assistant waits for user</option>
                    <option value="assistant-speaks-first-with-model-generated-message">Assistant speaks first (AI generated)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">System Prompt</label>
                    <button
                      onClick={() => setShowPromptHelper(!showPromptHelper)}
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
                    >
                      <Info className="w-4 h-4" />
                      <span>Tips</span>
                    </button>
                  </div>
                  <textarea
                    value={agent.systemPrompt}
                    onChange={(e) => setAgent(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    rows={6}
                    placeholder="Define your agent's personality, knowledge, and behavior..."
                  />
                  {showPromptHelper && (
                    <div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm">
                      <p className="font-semibold mb-2">Prompt Writing Tips:</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Be specific about the agent's role and expertise</li>
                        <li>• Define the tone and communication style</li>
                        <li>• Set clear boundaries and limitations</li>
                        <li>• Include key behaviors and responses</li>
                        <li>• Specify any rules or compliance requirements</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Model Configuration */}
          <div className="p-6">
            <button
              onClick={() => toggleSection('model')}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">AI Model</h3>
              </div>
              {expandedSections.model ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.model && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <select
                      value={agent.model.provider}
                      onChange={(e) => setAgent(prev => ({
                        ...prev,
                        model: { 
                          ...prev.model, 
                          provider: e.target.value as any,
                          model: MODEL_OPTIONS[e.target.value as keyof typeof MODEL_OPTIONS]?.[0]?.id || ''
                        }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google</option>
                      <option value="groq">Groq</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <select
                      value={agent.model.model}
                      onChange={(e) => setAgent(prev => ({
                        ...prev,
                        model: { ...prev.model, model: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {getModelOptions().map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature: {agent.model.temperature || 0.7}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={agent.model.temperature || 0.7}
                    onChange={(e) => setAgent(prev => ({
                      ...prev,
                      model: { ...prev.model, temperature: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Precise</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={agent.model.emotionRecognitionEnabled || false}
                      onChange={(e) => setAgent(prev => ({
                        ...prev,
                        model: { ...prev.model, emotionRecognitionEnabled: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Emotion Recognition</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Voice Configuration */}
          <div className="p-6">
            <button
              onClick={() => toggleSection('voice')}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <Mic className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Voice Settings</h3>
              </div>
              {expandedSections.voice ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.voice && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voice Provider</label>
                    <select
                      value={agent.voice.provider}
                      onChange={(e) => setAgent(prev => ({
                        ...prev,
                        voice: { 
                          ...prev.voice, 
                          provider: e.target.value as any,
                          voiceId: VOICE_OPTIONS[e.target.value as keyof typeof VOICE_OPTIONS]?.[0]?.id || ''
                        }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="vapi">Vapi</option>
                      <option value="11labs">ElevenLabs</option>
                      <option value="openai">OpenAI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
                    <select
                      value={agent.voice.voiceId}
                      onChange={(e) => setAgent(prev => ({
                        ...prev,
                        voice: { ...prev.voice, voiceId: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {getVoiceOptions().map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name} ({option.gender}, {option.accent})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speed: {agent.voice.speed || 1.0}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={agent.voice.speed || 1.0}
                    onChange={(e) => setAgent(prev => ({
                      ...prev,
                      voice: { ...prev.voice, speed: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Behavior Settings */}
          <div className="p-6">
            <button
              onClick={() => toggleSection('behavior')}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Conversation Behavior</h3>
              </div>
              {expandedSections.behavior ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.behavior && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Call Phrases</label>
                  <input
                    type="text"
                    value={agent.endCallPhrases?.join(', ') || ''}
                    onChange={(e) => setAgent(prev => ({
                      ...prev,
                      endCallPhrases: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                    }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="goodbye, bye, end call"
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated phrases that will end the call</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Call Message</label>
                  <input
                    type="text"
                    value={agent.endCallMessage || ''}
                    onChange={(e) => setAgent(prev => ({ ...prev, endCallMessage: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Thank you for calling. Goodbye!"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={agent.interruptionsEnabled !== false}
                      onChange={(e) => setAgent(prev => ({ ...prev, interruptionsEnabled: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Allow interruptions</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Response Delay: {agent.responseDelaySeconds || 0.4}s
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={agent.responseDelaySeconds || 0.4}
                    onChange={(e) => setAgent(prev => ({ ...prev, responseDelaySeconds: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Advanced Settings */}
          <div className="p-6">
            <button
              onClick={() => toggleSection('advanced')}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <Code className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Advanced Settings</h3>
              </div>
              {expandedSections.advanced ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.advanced && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Call Duration: {agent.maxDurationSeconds} seconds
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="3600"
                    step="60"
                    value={agent.maxDurationSeconds}
                    onChange={(e) => setAgent(prev => ({ ...prev, maxDurationSeconds: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">{Math.floor((agent.maxDurationSeconds || 600) / 60)} minutes</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Sound</label>
                  <select
                    value={agent.backgroundSound}
                    onChange={(e) => setAgent(prev => ({ ...prev, backgroundSound: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="off">Off</option>
                    <option value="office">Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LLM Request Delay: {agent.llmRequestDelaySeconds || 0.1}s
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={agent.llmRequestDelaySeconds || 0.1}
                    onChange={(e) => setAgent(prev => ({ ...prev, llmRequestDelaySeconds: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Words to Interrupt: {agent.numWordsToInterruptAssistant || 2}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={agent.numWordsToInterruptAssistant || 2}
                    onChange={(e) => setAgent(prev => ({ ...prev, numWordsToInterruptAssistant: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}