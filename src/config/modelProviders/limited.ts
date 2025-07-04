import { ModelProviderCard } from '@/types/llm';
import OpenAIProvider from './openai';
import AnthropicProvider from './anthropic';
import GoogleProvider from './google';
import OllamaProvider from './ollama';

/**
 * Limited list of model providers - only the most common ones
 * Users can configure API keys in the UI
 */
export const LIMITED_MODEL_PROVIDER_LIST: ModelProviderCard[] = [
  OpenAIProvider,
  AnthropicProvider,
  GoogleProvider,
  OllamaProvider,
];