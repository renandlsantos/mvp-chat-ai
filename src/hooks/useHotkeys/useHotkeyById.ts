import { uniq } from 'lodash-es';
import { DependencyList, useMemo } from 'react';
import { type HotkeyCallback, type Options, useHotkeys } from 'react-hotkeys-hook';

import { HOTKEYS_REGISTRATION } from '@/const/hotkeys';
import { useServerConfigStore } from '@/store/serverConfig';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { HotkeyId } from '@/types/hotkey';
import { isDev } from '@/utils/env';

type OptionsOrDependencyArray = Options | DependencyList;

export const useHotkeyById = (
  hotkeyId: HotkeyId,
  callback: HotkeyCallback,
  options?: OptionsOrDependencyArray,
  dependencies?: OptionsOrDependencyArray,
) => {
  // Memoizar o seletor para evitar re-criações
  const hotkeySelector = useMemo(() => settingsSelectors.getHotkeyById(hotkeyId), [hotkeyId]);
  const hotkey = useUserStore(hotkeySelector);
  const mobile = useServerConfigStore((s) => s.isMobile);

  const _options: Options | undefined = !Array.isArray(options)
    ? (options as Options)
    : !Array.isArray(dependencies)
      ? (dependencies as Options)
      : undefined;

  const _deps: DependencyList | undefined = Array.isArray(options)
    ? options
    : Array.isArray(dependencies)
      ? dependencies
      : undefined;

  const item = useMemo(() => HOTKEYS_REGISTRATION.find((item) => item.id === hotkeyId), [hotkeyId]);

  const hotkeyOptions = useMemo(() => {
    // Evitar recriação desnecessária do objeto de opções
    const enabled = !mobile && _options?.enabled !== false;
    const itemScopes = item?.scopes || [];
    const optionScopes = _options?.scopes || [];
    const scopes = uniq([hotkeyId, ...itemScopes, ...optionScopes]);
    
    return {
      enableOnFormTags: true,
      preventDefault: true,
      ..._options,
      enabled,
      scopes,
    };
  }, [mobile, hotkeyId, item, _options]);

  // Memoizar o callback para evitar re-renderizações
  const memoizedCallback = useMemo(() => {
    return (...props: Parameters<HotkeyCallback>) => {
      if (isDev) console.log('[Hotkey]', hotkeyId);
      return callback(...props);
    };
  }, [callback, hotkeyId]);

  const ref = useHotkeys(
    hotkey || '',
    memoizedCallback,
    hotkeyOptions,
    _deps as any[],
  );

  return {
    id: hotkeyId,
    ref,
  };
};