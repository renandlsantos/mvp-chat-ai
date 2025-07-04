'use client';

import { type ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SafeSearchBar from '@/components/SafeSearchBar';
import { useSessionStore } from '@/store/session';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { HotkeyEnum } from '@/types/hotkey';

const SessionSearchBar = memo<{ mobile?: boolean }>(({ mobile }) => {
  const { t } = useTranslation('chat');
  const [mounted, setMounted] = useState(false);
  const isLoaded = useUserStore((s) => s.isLoaded);
  
  // Memoizar o seletor para evitar re-criações
  const hotkeySelector = useMemo(() => settingsSelectors.getHotkeyById(HotkeyEnum.Search), []);
  const hotkey = useUserStore(hotkeySelector);

  const [keywords, useSearchSessions, updateSearchKeywords] = useSessionStore((s) => [
    s.sessionSearchKeywords,
    s.useSearchSessions,
    s.updateSearchKeywords,
  ]);

  const { isValidating } = useSearchSessions(keywords);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateSearchKeywords(e.target.value);
    },
    [updateSearchKeywords],
  );

  return (
    <SafeSearchBar
      allowClear
      enableShortKey={mounted && !mobile}
      loading={mounted && (!isLoaded || isValidating)}
      onChange={handleChange}
      placeholder={t('searchAgentPlaceholder')}
      shortKey={mounted ? hotkey : undefined}
      spotlight={mounted && !mobile}
      value={keywords}
      variant={'filled'}
    />
  );
});

SessionSearchBar.displayName = 'SessionSearchBar';

export default SessionSearchBar;