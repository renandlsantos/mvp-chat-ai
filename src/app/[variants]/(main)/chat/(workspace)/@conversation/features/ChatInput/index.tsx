'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';

const DesktopChatInput = dynamic(() => import('./Desktop'), {
  ssr: false,
});

const MobileChatInput = dynamic(() => import('./Mobile'), {
  ssr: false,
});

const ChatInput = memo(({ mobile }: { mobile: boolean }) => {
  const Input = mobile ? MobileChatInput : DesktopChatInput;

  return <Input />;
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
