'use client';

import { useState } from 'react';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { Header } from '../components/Header';
import Link from 'next/link';
import { 
  PhoneIcon, 
  PencilIcon, 
  DocumentDuplicateIcon, 
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ClockIcon,
  CubeIcon,
  CogIcon,
  PhoneArrowUpRightIcon
} from '@heroicons/react/24/outline';

interface Agent {
  id: string;
  name: string;
  provider: string;
  model: string;
  createdAt: string;
  duration: string;
  avatar: string;
}

export default function HomePage() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const agents: Agent[] = [
    {
      id: '1',
      name: t('agents.customerSupportAgent'),
      provider: 'openai',
      model: 'vapi',
      createdAt: 'Oct 5, 2025',
      duration: t('agents.duration'),
      avatar: '👤',
    },
    {
      id: '2',
      name: t('agents.technicalSupportSpecialist'),
      provider: 'openai',
      model: 'vapi',
      createdAt: 'Oct 5, 2025',
      duration: t('agents.duration'),
      avatar: '👤',
    },
    {
      id: '3',
      name: t('agents.salesRepresentative'),
      provider: 'openai',
      model: '11labs',
      createdAt: 'Oct 5, 2025',
      duration: t('agents.duration'),
      avatar: '👤',
    },
  ];

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Actions */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('agents.myAgents')}</h2>
          <p className="text-gray-600">{t('agents.manageAgents')}</p>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <Squares2X2Icon className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <ListBulletIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          <button className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('common.createAgent')}
          </button>
        </div>

        {/* Agents Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    {agent.avatar}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.provider} • {agent.model}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{agent.createdAt}</span>
                <span className="mx-2">•</span>
                <span>{agent.duration}</span>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/call" className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  {t('common.call')}
                </Link>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CubeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('agents.customAgentsTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('agents.customAgentsDesc')}</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CogIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('agents.fullControlTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('agents.fullControlDesc')}</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <PhoneArrowUpRightIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('agents.instantDeploymentTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('agents.instantDeploymentDesc')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}