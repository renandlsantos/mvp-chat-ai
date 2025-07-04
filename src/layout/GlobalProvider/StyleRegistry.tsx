'use client';

import { StyleProvider, extractStaticStyle } from 'antd-style';
import { useServerInsertedHTML } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef } from 'react';

const StyleRegistry = ({ children }: PropsWithChildren) => {
  const isInsert = useRef(false);

  useServerInsertedHTML(() => {
    // avoid duplicate css insert
    // refs: https://github.com/vercel/next.js/discussions/49354#discussioncomment-6279917
    if (isInsert.current) return;

    isInsert.current = true;

    // @ts-ignore
    return extractStaticStyle().map((item) => item.style);
  });

  useEffect(() => {
    // Interceptar apenas warnings específicos de CSS-in-JS cleanup
    const originalError = console.error;
    
    console.error = (...args: any[]) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        message.includes('[Ant Design CSS-in-JS]') &&
        message.includes('cleanup function after unmount')
      ) {
        // Silenciosamente ignorar este warning específico
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <StyleProvider cache={extractStaticStyle.cache}>{children}</StyleProvider>;
};

export default StyleRegistry;
