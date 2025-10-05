'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Grid, List, Edit2, Trash2, Copy, Phone, Clock, Calendar } from 'lucide-react';
import { AgentConfig } from '../types/agent';
import { agentTemplates } from '../data/agentTemplates';

interface AgentManagerProps {
  onSelectAgent: (agent: AgentConfig) => void;
  onEditAgent: (agent: AgentConfig) => void;
  onCreateNew: () => void;
}

export default function AgentManager({ onSelectAgent, onEditAgent, onCreateNew }: AgentManagerProps) {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Load agents from localStorage
    const savedAgents = localStorage.getItem('vapi-agents');
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    } else {
      // Initialize with some default agents from templates
      const defaultAgents = agentTemplates.slice(0, 3).map(template => ({
        ...template.config,
        id: `agent-${Date.now()}-${Math.random()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      setAgents(defaultAgents as AgentConfig[]);
      localStorage.setItem('vapi-agents', JSON.stringify(defaultAgents));
    }
  }, []);

  const saveAgents = (updatedAgents: AgentConfig[]) => {
    setAgents(updatedAgents);
    localStorage.setItem('vapi-agents', JSON.stringify(updatedAgents));
  };

  const deleteAgent = (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      const updatedAgents = agents.filter(a => a.id !== agentId);
      saveAgents(updatedAgents);
    }
  };

  const duplicateAgent = (agent: AgentConfig) => {
    const newAgent = {
      ...agent,
      id: `agent-${Date.now()}-${Math.random()}`,
      name: `${agent.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    saveAgents([...agents, newAgent]);
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      openai: '🤖',
      anthropic: '🧠',
      google: '🔍',
      groq: '⚡',
      vapi: '🎙️',
      '11labs': '🎵'
    };
    return icons[provider] || '🤖';
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Agents</h1>
        <p className="text-gray-600">Manage and deploy your custom AI voice agents</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
            />
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Agent</span>
        </button>
      </div>

      {/* Agents Display */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No agents found</h3>
          <p className="text-gray-500 mb-6">Create your first agent to get started</p>
          <button
            onClick={onCreateNew}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your First Agent
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                      {getProviderIcon(agent.model.provider)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.model.provider} • {agent.voice.provider}</p>
                    </div>
                  </div>
                </div>
                
                {agent.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{agent.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(agent.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {agent.maxDurationSeconds ? `${Math.floor(agent.maxDurationSeconds / 60)}m` : '10m'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelectAgent(agent)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => onEditAgent(agent)}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateAgent(agent)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAgent(agent.id!)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAgents.map(agent => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                        {getProviderIcon(agent.model.provider)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{agent.name}</div>
                        {agent.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">{agent.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {agent.model.provider} / {agent.model.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {agent.voice.provider} / {agent.voice.voiceId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(agent.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onSelectAgent(agent)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                      >
                        Call
                      </button>
                      <button
                        onClick={() => onEditAgent(agent)}
                        className="p-1 text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateAgent(agent)}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAgent(agent.id!)}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}