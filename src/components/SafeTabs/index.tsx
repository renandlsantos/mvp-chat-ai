'use client';

import { TabsProps } from '@lobehub/ui';
import dynamic from 'next/dynamic';
import { memo } from 'react';

// Importação dinâmica do Tabs para evitar erros de hidratação
const DynamicTabs = dynamic(() => import('@lobehub/ui').then(mod => ({ default: mod.Tabs })), {
  ssr: false,
});

/**
 * Wrapper seguro para o componente Tabs que evita erros de hidratação
 * com ícones internos que possuem aria-hidden em SVGs
 */
const SafeTabs = memo<TabsProps>((props) => {
  return <DynamicTabs {...props} />;
});

SafeTabs.displayName = 'SafeTabs';

export default SafeTabs;