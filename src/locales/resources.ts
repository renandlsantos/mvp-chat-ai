import { DEFAULT_LANG } from '@/const/locale';

import resources from './default';

export const locales = [
  'pt-BR',
  'en-US',
  'es-ES',
] as const;

export type DefaultResources = typeof resources;
export type NS = keyof DefaultResources;
export type Locales = (typeof locales)[number];

export const normalizeLocale = (locale?: string): string => {
  if (!locale) return DEFAULT_LANG;

  for (const l of locales) {
    if (l.startsWith(locale)) {
      return l;
    }
  }

  return DEFAULT_LANG;
};

type LocaleOptions = {
  label: string;
  value: Locales;
}[];

export const localeOptions: LocaleOptions = [
  {
    label: 'Português (Brasil)',
    value: 'pt-BR',
  },
  {
    label: 'English',
    value: 'en-US',
  },
  {
    label: 'Español',
    value: 'es-ES',
  },
] as LocaleOptions;

export const supportLocales: string[] = [...locales, 'en', 'es', 'pt'];
