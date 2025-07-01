'use client';

import { SearchBar, SearchBarProps } from '@lobehub/ui';
import { memo, useEffect, useState } from 'react';

/**
 * Wrapper seguro para SearchBar que evita erros de hidratação
 */
const SafeSearchBar = memo<SearchBarProps>((props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante o SSR, renderizar sem ícone de loading para evitar problemas
  if (!mounted) {
    return (
      <SearchBar 
        {...props} 
        loading={false}
        enableShortKey={false}
        spotlight={false}
      />
    );
  }

  // Após montar no cliente, renderizar com todas as props
  return <SearchBar {...props} />;
});

SafeSearchBar.displayName = 'SafeSearchBar';

export default SafeSearchBar;