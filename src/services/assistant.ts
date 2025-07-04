import { cloneDeep, merge } from 'lodash-es';

import { DEFAULT_DISCOVER_ASSISTANT_ITEM } from '@/const/discover';
import { edgeClient } from '@/libs/trpc/client';
import { globalHelpers } from '@/store/global/helpers';
import { DiscoverAssistantItem } from '@/types/discover';

class AssistantService {
  getAssistantList = async (): Promise<DiscoverAssistantItem[]> => {
    const locale = globalHelpers.getCurrentLanguage();

    // For now, use regular marketplace until admin system is properly configured
    const data = await edgeClient.market.getAgentIndex.query({ 
      adminOnly: false,
      locale, // Temporarily disabled admin-only filtering
    });

    return data.agents as unknown as DiscoverAssistantItem[];
  };

  getAssistantById = async (identifier: string): Promise<DiscoverAssistantItem> => {
    const locale = globalHelpers.getCurrentLanguage();

    const assistant = await edgeClient.market.getAgent.query({ id: identifier, locale });

    return merge(cloneDeep(DEFAULT_DISCOVER_ASSISTANT_ITEM), assistant);
  };
}
export const assistantService = new AssistantService();
