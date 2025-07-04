'use client';

import { ActionIcon } from '@lobehub/ui';
import { Share2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ClientOnly from '@/components/ClientOnly';
import { DESKTOP_HEADER_ICON_SIZE, MOBILE_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useWorkspaceModal } from '@/hooks/useWorkspaceModal';
import { useChatStore } from '@/store/chat';

const ShareModal = dynamic(() => import('@/features/ShareModal'));

interface ShareButtonProps {
  mobile?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const ShareButton = memo<ShareButtonProps>(({ mobile, setOpen, open }) => {
  const [isModalOpen, setIsModalOpen] = useWorkspaceModal(open, setOpen);
  const { t } = useTranslation('common');
  const [shareLoading] = useChatStore((s) => [s.shareLoading]);

  return (
    <ClientOnly
      fallback={
        <div 
          style={{ 
            width: 36, 
            height: 36 
          }} 
        />
      }
    >
      <ActionIcon
        icon={Share2}
        loading={shareLoading}
        onClick={() => setIsModalOpen(true)}
        size={mobile ? MOBILE_HEADER_ICON_SIZE : DESKTOP_HEADER_ICON_SIZE}
        title={t('share')}
      />
      <ShareModal onCancel={() => setIsModalOpen(false)} open={isModalOpen} />
    </ClientOnly>
  );
});

export default ShareButton;
