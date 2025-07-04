'use client';

import { Icon as LobehubIcon, IconProps } from '@lobehub/ui';
import { LucideIcon } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

interface SafeIconProps extends IconProps {
  icon: LucideIcon | any;
}

/**
 * Wrapper seguro para o componente Icon que evita erros de hidratação
 * com o atributo aria-hidden em SVGs
 */
const SafeIcon = memo<SafeIconProps>((props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante o SSR, renderizar um span vazio com as mesmas dimensões
  if (!mounted) {
    const size = typeof props.size === 'number' ? props.size : 24;
    return (
      <span 
        className={props.className}
        style={{
          display: 'inline-block',
          height: size,
          width: size,
          ...props.style
        }}
      />
    );
  }

  // Após montar no cliente, renderizar o ícone completo
  return <LobehubIcon {...props} />;
});

SafeIcon.displayName = 'SafeIcon';

export default SafeIcon;