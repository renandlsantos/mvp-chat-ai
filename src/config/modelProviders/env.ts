import { ModelProviderCard } from '@/types/llm';
import { LIMITED_MODEL_PROVIDER_LIST } from './limited';

/**
 * Get enabled providers - returns a limited list of common providers
 */
export const getEnabledProviders = (): ModelProviderCard[] => {
  return LIMITED_MODEL_PROVIDER_LIST;
};