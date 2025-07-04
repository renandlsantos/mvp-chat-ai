import isEqual from 'fast-deep-equal';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useSwitchSession } from '@/hooks/useSwitchSession';
import { useGlobalStore } from '@/store/global';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { HotkeyEnum, HotkeyScopeEnum, KeyEnum } from '@/types/hotkey';

import { useHotkeyById } from './useHotkeyById';

export const useSwitchAgentHotkey = () => {
  const { showPinList } = useServerConfigStore(featureFlagsSelectors);
  const list = useSessionStore(sessionSelectors.pinnedSessions, isEqual);
  
  // Memoizar o seletor para evitar re-criações
  const hotkeySelector = useMemo(() => settingsSelectors.getHotkeyById(HotkeyEnum.SwitchAgent), []);
  const hotkey = useUserStore(hotkeySelector);
  
  const switchSession = useSwitchSession();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPinned] = useQueryState('pinned', parseAsBoolean);

  const switchAgent = useCallback((id: string) => {
    switchSession(id);
    setPinned(true);
  }, [switchSession, setPinned]);

  // Memoizar a lista de hotkeys para evitar re-renderizações
  const hotkeyList = useMemo(() => {
    if (!hotkey || !list) return [];
    return list.slice(0, 9).map((e, i) => hotkey.replaceAll(KeyEnum.Number, String(i + 1)));
  }, [list, hotkey]);

  const hotkeyCallback = useCallback((_: KeyboardEvent, hotkeysEvent: any) => {
    if (!hotkeysEvent.keys?.[0]) return;
    const index = parseInt(hotkeysEvent.keys?.[0]) - 1;
    const item = list[index];
    if (!item) return;
    switchAgent(item.id);
  }, [list, switchAgent]);

  // Memoizar as opções para evitar re-renderizações
  const hotkeyOptions = useMemo(() => ({
    enableOnFormTags: true,
    enabled: showPinList && hotkeyList.length > 0,
    preventDefault: true,
    scopes: [HotkeyScopeEnum.Global, HotkeyEnum.SwitchAgent],
  }), [showPinList, hotkeyList.length]);

  const ref = useHotkeys(
    hotkeyList,
    hotkeyCallback,
    hotkeyOptions,
    [list, switchAgent] // Dependências explícitas
  );

  return {
    id: HotkeyEnum.SwitchAgent,
    ref,
  };
};

export const useOpenHotkeyHelperHotkey = () => {
  const [open, updateSystemStatus] = useGlobalStore((s) => [
    s.status.showHotkeyHelper,
    s.updateSystemStatus,
  ]);

  // Memoizar o callback para evitar re-renderizações
  const toggleHotkeyHelper = useCallback(() => {
    updateSystemStatus({ showHotkeyHelper: !open });
  }, [open, updateSystemStatus]);

  return useHotkeyById(HotkeyEnum.OpenHotkeyHelper, toggleHotkeyHelper);
};

// 注册聚合

export const useRegisterGlobalHotkeys = () => {
  // 全局自动注册不需要 enableScope
  useSwitchAgentHotkey();
  useOpenHotkeyHelperHotkey();
};