'use client';

import { DraggablePanel, DraggablePanelProps } from '@lobehub/ui';
import { memo, useEffect, useState } from 'react';

/**
 * Wrapper para DraggablePanel que evita erros de hidratação
 */
const DraggablePanelContainer = memo<DraggablePanelProps>((props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante o SSR, renderizar com props mínimas para evitar incompatibilidades
  if (!mounted) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: props.size?.height || 'auto',
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,
      }}>
        {props.children}
      </div>
    );
  }

  // Após montar no cliente, renderizar o componente completo
  return <DraggablePanel {...props} />;
});

DraggablePanelContainer.displayName = 'DraggablePanelContainer';

export default DraggablePanelContainer;