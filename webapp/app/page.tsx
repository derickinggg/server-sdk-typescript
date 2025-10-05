'use client';

import { useState } from 'react';
import { useLanguage } from './lib/i18n/LanguageContext';
import { Header } from './components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PhoneIcon,
  CheckIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SpeakerWaveIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface AgentConfig {
  name: string;
  role: string;
  firstMessage: string;
  voiceProvider: string;
  voiceModel: string;
  aiProvider: string;
  aiModel: string;
  temperature: number;
  systemPrompt: string;
  interruptionThreshold: number;
  endCallPhrases: string;
  maxDuration: number;
}

const VOICE_PROVIDERS = [
  { id: 'elevenlabs', name: 'ElevenLabs', models: ['rachel', 'drew', 'clyde', 'paul', 'domi'] },
  { id: 'openai', name: 'OpenAI', models: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] },
  { id: 'azure', name: 'Azure', models: ['jenny', 'guy', 'aria', 'davis'] },
];

const AI_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet'] },
];

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    role: '',
    firstMessage: '',
    voiceProvider: 'elevenlabs',
    voiceModel: 'rachel',
    aiProvider: 'openai',
    aiModel: 'gpt-4',
    temperature: 0.7,
    systemPrompt: '',
    interruptionThreshold: 50,
    endCallPhrases: 'goodbye, bye, see you later',
    maxDuration: 600,
  });

  const steps = [
    { id: 1, title: t('builder.step1Title'), subtitle: t('builder.step1Subtitle'), icon: DocumentTextIcon },
    { id: 2, title: t('builder.step2Title'), subtitle: t('builder.step2Subtitle'), icon: SpeakerWaveIcon },
    { id: 3, title: t('builder.step3Title'), subtitle: t('builder.step3Subtitle'), icon: ChatBubbleLeftRightIcon },
    { id: 4, title: t('builder.step4Title'), subtitle: t('builder.step4Subtitle'), icon: EyeIcon },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAgent = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/vapi/create-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: agentConfig.name,
          firstMessage: agentConfig.firstMessage,
          systemPrompt: agentConfig.systemPrompt,
          model: {
            provider: agentConfig.aiProvider,
            model: agentConfig.aiModel,
            temperature: agentConfig.temperature,
          },
          voice: {
            provider: agentConfig.voiceProvider,
            voiceId: agentConfig.voiceModel,
          },
          silenceTimeoutSeconds: 30,
          responseDelaySeconds: 0.4,
          interruptionThreshold: agentConfig.interruptionThreshold / 100,
          endCallPhrases: agentConfig.endCallPhrases.split(',').map(p => p.trim()),
          maxDurationSeconds: agentConfig.maxDuration,
        }),
      });
      
      if (response.ok) {
        alert(t('builder.createSuccess'));
        router.push('/agents');
      } else {
        alert(t('builder.createError'));
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert(t('builder.createError'));
    } finally {
      setIsCreating(false);
    }
  };

  const selectedVoiceProvider = VOICE_PROVIDERS.find(p => p.id === agentConfig.voiceProvider);
  const selectedAIProvider = AI_PROVIDERS.find(p => p.id === agentConfig.aiProvider);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('builder.title')}</h2>
          <p className="text-gray-600">{t('builder.subtitle')}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckIcon className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <p className="text-xs font-medium text-gray-900">{step.title}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-12">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('builder.step1Title')}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('builder.agentName')}
                </label>
                <input
                  type="text"
                  value={agentConfig.name}
                  onChange={(e) => setAgentConfig({ ...agentConfig, name: e.target.value })}
                  placeholder={t('builder.agentNamePlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('builder.agentRole')}
                </label>
                <input
                  type="text"
                  value={agentConfig.role}
                  onChange={(e) => setAgentConfig({ ...agentConfig, role: e.target.value })}
                  placeholder={t('builder.agentRolePlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('builder.firstMessage')}
                </label>
                <textarea
                  value={agentConfig.firstMessage}
                  onChange={(e) => setAgentConfig({ ...agentConfig, firstMessage: e.target.value })}
                  placeholder={t('builder.firstMessagePlaceholder')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('builder.step2Title')}</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('builder.voiceProvider')}
                  </label>
                  <select
                    value={agentConfig.voiceProvider}
                    onChange={(e) => {
                      const provider = VOICE_PROVIDERS.find(p => p.id === e.target.value);
                      setAgentConfig({ 
                        ...agentConfig, 
                        voiceProvider: e.target.value,
                        voiceModel: provider?.models[0] || ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {VOICE_PROVIDERS.map(provider => (
                      <option key={provider.id} value={provider.id}>{provider.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('builder.voiceModel')}
                  </label>
                  <select
                    value={agentConfig.voiceModel}
                    onChange={(e) => setAgentConfig({ ...agentConfig, voiceModel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {selectedVoiceProvider?.models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('builder.aiProvider')}
                  </label>
                  <select
                    value={agentConfig.aiProvider}
                    onChange={(e) => {
                      const provider = AI_PROVIDERS.find(p => p.id === e.target.value);
                      setAgentConfig({ 
                        ...agentConfig, 
                        aiProvider: e.target.value,
                        aiModel: provider?.models[0] || ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {AI_PROVIDERS.map(provider => (
                      <option key={provider.id} value={provider.id}>{provider.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('builder.aiModel')}
                  </label>
                  <select
                    value={agentConfig.aiModel}
                    onChange={(e) => setAgentConfig({ ...agentConfig, aiModel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {selectedAIProvider?.models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('builder.temperature')} ({agentConfig.temperature})
                </label>
                <p className="text-xs text-gray-500 mb-2">{t('builder.temperatureDesc')}</p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={agentConfig.temperature}
                  onChange={(e) => setAgentConfig({ ...agentConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('builder.step3Title')}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('builder.systemPrompt')}
                </label>
                <textarea
                  value={agentConfig.systemPrompt}
                  onChange={(e) => setAgentConfig({ ...agentConfig, systemPrompt: e.target.value })}
                  placeholder={t('builder.systemPromptPlaceholder')}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('builder.interruptionThreshold')} ({agentConfig.interruptionThreshold}%)
                </label>
                <p className="text-xs text-gray-500 mb-2">{t('builder.interruptionDesc')}</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={agentConfig.interruptionThreshold}
                  onChange={(e) => setAgentConfig({ ...agentConfig, interruptionThreshold: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('builder.endCallPhrases')}
                </label>
                <input
                  type="text"
                  value={agentConfig.endCallPhrases}
                  onChange={(e) => setAgentConfig({ ...agentConfig, endCallPhrases: e.target.value })}
                  placeholder={t('builder.endCallPhrasesPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('builder.maxDuration')}
                </label>
                <input
                  type="number"
                  value={agentConfig.maxDuration}
                  onChange={(e) => setAgentConfig({ ...agentConfig, maxDuration: parseInt(e.target.value) })}
                  min="60"
                  max="3600"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('builder.step4Title')}</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h4 className="font-medium text-gray-900">Agent Configuration Summary</h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">{agentConfig.name || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Role:</span>
                    <p className="font-medium">{agentConfig.role || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Voice:</span>
                    <p className="font-medium">{agentConfig.voiceProvider} - {agentConfig.voiceModel}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">AI Model:</span>
                    <p className="font-medium">{agentConfig.aiProvider} - {agentConfig.aiModel}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">First Message:</span>
                    <p className="font-medium">{agentConfig.firstMessage || 'Not set'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">System Prompt:</span>
                    <p className="font-medium">{agentConfig.systemPrompt || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCreateAgent}
                  disabled={isCreating}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center"
                >
                  {isCreating ? 'Creating...' : t('common.save')}
                </button>
                <Link
                  href="/call"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  {t('common.testCall')}
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              {t('common.back')}
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                {t('common.next')}
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <Link
                href="/agents"
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                {t('common.viewAgents')}
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}