'use client';

import { useState } from 'react';
import AgentManager from '../components/AgentManager';
import AgentBuilder from '../components/AgentBuilder';
import CustomAgentCall from '../components/CustomAgentCall';
import { AgentConfig } from '../types/agent';
import { ArrowLeft, Bot, Phone, Settings } from 'lucide-react';

type View = 'manager' | 'builder' | 'call';

export default function AgentBuilderPage() {
  const [currentView, setCurrentView] = useState<View>('manager');
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [editingAgent, setEditingAgent] = useState<AgentConfig | null>(null);

  const handleCreateNew = () => {
    setEditingAgent(null);
    setCurrentView('builder');
  };

  const handleEditAgent = (agent: AgentConfig) => {
    setEditingAgent(agent);
    setCurrentView('builder');
  };

  const handleSelectAgent = (agent: AgentConfig) => {
    setSelectedAgent(agent);
    setCurrentView('call');
  };

  const handleSaveAgent = (agent: AgentConfig) => {
    // Save to localStorage
    const savedAgents = localStorage.getItem('vapi-agents');
    let agents: AgentConfig[] = savedAgents ? JSON.parse(savedAgents) : [];
    
    if (agent.id) {
      // Update existing agent
      agents = agents.map(a => a.id === agent.id ? agent : a);
    } else {
      // Create new agent
      agent.id = `agent-${Date.now()}-${Math.random()}`;
      agent.createdAt = new Date();
      agents.push(agent);
    }
    
    localStorage.setItem('vapi-agents', JSON.stringify(agents));
    setCurrentView('manager');
  };

  const handleEndCall = () => {
    setCurrentView('manager');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentView !== 'manager' && (
                <button
                  onClick={() => setCurrentView('manager')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">VAPI Agent Builder</h1>
                  <p className="text-sm text-gray-600">
                    {currentView === 'manager' && 'Manage your AI voice agents'}
                    {currentView === 'builder' && (editingAgent ? 'Edit Agent' : 'Create New Agent')}
                    {currentView === 'call' && 'Voice Call'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {currentView === 'manager' && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Bot className="w-4 h-4" />
                  <span>Build custom AI agents</span>
                  <span className="text-gray-400">•</span>
                  <Phone className="w-4 h-4" />
                  <span>Make voice calls</span>
                  <span className="text-gray-400">•</span>
                  <Settings className="w-4 h-4" />
                  <span>Full customization</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'manager' && (
          <AgentManager
            onSelectAgent={handleSelectAgent}
            onEditAgent={handleEditAgent}
            onCreateNew={handleCreateNew}
          />
        )}
        
        {currentView === 'builder' && (
          <AgentBuilder
            initialAgent={editingAgent || undefined}
            onSave={handleSaveAgent}
            onTest={handleSelectAgent}
          />
        )}
        
        {currentView === 'call' && selectedAgent && (
          <CustomAgentCall
            agent={selectedAgent}
            onEnd={handleEndCall}
          />
        )}
      </main>

      {/* Features Footer */}
      {currentView === 'manager' && (
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Custom AI Agents</h3>
                <p className="text-sm text-gray-600">
                  Create agents with custom prompts, personalities, and behaviors tailored to your needs
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Full Control</h3>
                <p className="text-sm text-gray-600">
                  Configure voice, model, interruption settings, and more with an intuitive interface
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Instant Deployment</h3>
                <p className="text-sm text-gray-600">
                  Test and deploy your agents instantly with one-click voice calling
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}