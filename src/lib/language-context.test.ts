import { describe, expect, it } from 'vitest';

import { isLocale, LOCALES } from '@/lib/language-context';

describe('isLocale', () => {
  it.each(LOCALES)('accepts the supported locale %s', (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it('rejects an unsupported locale', () => {
    expect(isLocale('fr')).toBe(false);
  });

  it('rejects null, which is what an empty localStorage read returns', () => {
    expect(isLocale(null)).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isLocale('')).toBe(false);
  });
});
