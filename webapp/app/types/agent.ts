// Agent configuration types
export interface AgentConfig {
  id?: string;
  name: string;
  description?: string;
  firstMessage?: string;
  firstMessageMode?: 'assistant-speaks-first' | 'assistant-waits-for-user' | 'assistant-speaks-first-with-model-generated-message';
  systemPrompt: string;
  model: ModelConfig;
  voice: VoiceConfig;
  transcriber?: TranscriberConfig;
  endCallMessage?: string;
  endCallPhrases?: string[];
  maxDurationSeconds?: number;
  backgroundSound?: 'off' | 'office' | string;
  temperature?: number;
  interruptionsEnabled?: boolean;
  responseDelaySeconds?: number;
  llmRequestDelaySeconds?: number;
  numWordsToInterruptAssistant?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'groq' | 'deepinfra' | 'together-ai' | 'anyscale' | 'perplexity-ai';
  model: string;
  temperature?: number;
  maxTokens?: number;
  emotionRecognitionEnabled?: boolean;
  fallbackModels?: string[];
}

export interface VoiceConfig {
  provider: 'vapi' | '11labs' | 'openai' | 'deepgram' | 'cartesia' | 'azure' | 'playht' | 'rime-ai' | 'lmnt';
  voiceId: string;
  speed?: number;
  pitch?: number;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface TranscriberConfig {
  provider: 'deepgram' | 'assembly-ai' | 'azure' | 'google' | 'openai';
  model?: string;
  language?: string;
  smartFormat?: boolean;
  languageDetectionEnabled?: boolean;
  keywords?: string[];
  endpointing?: number;
}

// Preset agent templates
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  config: Partial<AgentConfig>;
  category: 'customer-service' | 'sales' | 'healthcare' | 'education' | 'personal' | 'business';
}

// Voice options by provider
export const VOICE_OPTIONS = {
  vapi: [
    { id: 'Elliot', name: 'Elliot', gender: 'male', accent: 'American' },
    { id: 'Kylie', name: 'Kylie', gender: 'female', accent: 'American' },
    { id: 'Rohan', name: 'Rohan', gender: 'male', accent: 'British' },
    { id: 'Lily', name: 'Lily', gender: 'female', accent: 'British' },
    { id: 'Savannah', name: 'Savannah', gender: 'female', accent: 'American' },
    { id: 'Hana', name: 'Hana', gender: 'female', accent: 'Asian' },
    { id: 'Neha', name: 'Neha', gender: 'female', accent: 'Indian' },
    { id: 'Cole', name: 'Cole', gender: 'male', accent: 'American' },
    { id: 'Harry', name: 'Harry', gender: 'male', accent: 'British' },
    { id: 'Paige', name: 'Paige', gender: 'female', accent: 'American' }
  ],
  '11labs': [
    { id: 'rachel', name: 'Rachel', gender: 'female', accent: 'American' },
    { id: 'domi', name: 'Domi', gender: 'female', accent: 'American' },
    { id: 'bella', name: 'Bella', gender: 'female', accent: 'American' },
    { id: 'antoni', name: 'Antoni', gender: 'male', accent: 'American' },
    { id: 'elli', name: 'Elli', gender: 'female', accent: 'American' },
    { id: 'josh', name: 'Josh', gender: 'male', accent: 'American' },
    { id: 'arnold', name: 'Arnold', gender: 'male', accent: 'American' },
    { id: 'adam', name: 'Adam', gender: 'male', accent: 'American' },
    { id: 'sam', name: 'Sam', gender: 'male', accent: 'American' }
  ],
  openai: [
    { id: 'alloy', name: 'Alloy', gender: 'neutral', accent: 'American' },
    { id: 'echo', name: 'Echo', gender: 'male', accent: 'American' },
    { id: 'fable', name: 'Fable', gender: 'male', accent: 'British' },
    { id: 'onyx', name: 'Onyx', gender: 'male', accent: 'American' },
    { id: 'nova', name: 'Nova', gender: 'female', accent: 'American' },
    { id: 'shimmer', name: 'Shimmer', gender: 'female', accent: 'American' }
  ]
};

// Model options by provider
export const MODEL_OPTIONS = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4 Optimized', description: 'Most capable model, best for complex tasks' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Fast and capable' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' }
  ],
  anthropic: [
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most capable Claude model' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast and efficient' }
  ],
  google: [
    { id: 'gemini-pro', name: 'Gemini Pro', description: 'Google\'s advanced model' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'Multimodal capabilities' }
  ],
  groq: [
    { id: 'llama2-70b-4096', name: 'Llama 2 70B', description: 'Open source, powerful' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Fast inference' }
  ]
};