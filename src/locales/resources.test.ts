import { describe, expect, it } from 'vitest';

import { normalizeLocale } from './resources';

describe('normalizeLocale', () => {
  it('should return "pt-BR" when locale is undefined', () => {
    expect(normalizeLocale()).toBe('pt-BR');
  });

  it('should return "pt-BR" when locale is "pt-BR"', () => {
    expect(normalizeLocale('pt-BR')).toBe('pt-BR');
  });

  it('should return "pt-BR" when locale is "pt"', () => {
    expect(normalizeLocale('pt')).toBe('pt-BR');
  });

  it('should return "en-US" when locale is "en"', () => {
    expect(normalizeLocale('en')).toBe('en-US');
  });

  it('should return "es-ES" when locale is "es"', () => {
    expect(normalizeLocale('es')).toBe('es-ES');
  });

  it('should return the input locale for other valid locales', () => {
    expect(normalizeLocale('en-US')).toBe('en-US');
    expect(normalizeLocale('es-ES')).toBe('es-ES');
  });

  it('should return the input locale for unknown locales', () => {
    expect(normalizeLocale('unknown')).toBe('pt-BR');
    expect(normalizeLocale('fr')).toBe('pt-BR');
  });
});
