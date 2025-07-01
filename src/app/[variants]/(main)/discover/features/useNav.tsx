import { Bot, Brain, BrainCircuit, House, Puzzle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import urlJoin from 'url-join';

import type { MenuProps } from '@/components/Menu';
import SafeIcon from '@/components/SafeIcon';
import { useDiscoverTab } from '@/hooks/useDiscoverTab';
import { DiscoverTab } from '@/types/discover';

const ICON_SIZE = 16;

export const useNav = () => {
  const pathname = usePathname();
  const type = useDiscoverTab();
  const { t } = useTranslation('discover');

  const activeKey = useMemo(() => {
    for (const value of Object.values(DiscoverTab)) {
      if (pathname === '/discover/search') {
        return type;
      } else if (pathname.includes(urlJoin('/discover', value))) {
        return value;
      }
    }
    return DiscoverTab.Home;
  }, [pathname]);

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        icon: <SafeIcon icon={House} size={ICON_SIZE} />,
        key: DiscoverTab.Home,
        label: t('tab.home'),
      },
      {
        icon: <SafeIcon icon={Bot} size={ICON_SIZE} />,
        key: DiscoverTab.Assistants,
        label: t('tab.assistants'),
      },
      {
        icon: <SafeIcon icon={Puzzle} size={ICON_SIZE} />,
        key: DiscoverTab.Plugins,
        label: t('tab.plugins'),
      },
      {
        icon: <SafeIcon icon={Brain} size={ICON_SIZE} />,
        key: DiscoverTab.Models,
        label: t('tab.models'),
      },
      {
        icon: <SafeIcon icon={BrainCircuit} size={ICON_SIZE} />,
        key: DiscoverTab.Providers,
        label: t('tab.providers'),
      },
    ],
    [t],
  );

  const activeItem = items.find((item: any) => item.key === activeKey) as {
    icon: ReactNode;
    key: string;
    label: string;
  };

  return {
    activeItem,
    activeKey,
    items,
  };
};
