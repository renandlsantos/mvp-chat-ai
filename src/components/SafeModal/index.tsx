'use client';

import { ModalProps } from 'antd';
import { ModalProps as LobeModalProps } from '@lobehub/ui';
import dynamic from 'next/dynamic';
import { memo, useEffect, useRef, useState } from 'react';

// Importação dinâmica para evitar erros de CSS-in-JS
const DynamicLobeModal = dynamic(() => import('@lobehub/ui').then(mod => ({ default: mod.Modal })), {
  ssr: false,
});

const DynamicAntModal = dynamic(() => import('antd').then(mod => ({ default: mod.Modal })), {
  ssr: false,
});

interface SafeModalProps extends LobeModalProps {
  variant?: 'lobe' | 'ant';
}

/**
 * Wrapper seguro para Modal que evita erros de CSS-in-JS
 * durante desmontagem de componentes
 */
const SafeModal = memo<SafeModalProps>(({ variant = 'lobe', children, onCancel, onOk, ...props }) => {
  const [mounted, setMounted] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      // Executar limpeza de forma segura
      if (cleanupRef.current) {
        try {
          cleanupRef.current();
        } catch {
          // Silenciosamente ignorar erros de limpeza
        }
      }
    };
  }, []);

  // Wrappers seguros para callbacks
  const safeOnCancel = (e: any) => {
    try {
      onCancel?.(e);
    } catch (error) {
      console.warn('SafeModal: Error in onCancel callback', error);
    }
  };

  const safeOnOk = (e: any) => {
    try {
      onOk?.(e);
    } catch (error) {
      console.warn('SafeModal: Error in onOk callback', error);
    }
  };

  if (!mounted) {
    return null;
  }

  const safeProps = {
    ...props,
    onCancel: onCancel ? safeOnCancel : undefined,
    onOk: onOk ? safeOnOk : undefined,
  };

  if (variant === 'ant') {
    return <DynamicAntModal {...(safeProps as ModalProps)}>{children}</DynamicAntModal>;
  }

  return <DynamicLobeModal {...safeProps}>{children}</DynamicLobeModal>;
});

SafeModal.displayName = 'SafeModal';

export default SafeModal;