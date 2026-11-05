import { describe, expect, it } from 'vitest';

import { LOCALES, routing } from '@/i18n/routing';

describe('routing', () => {
  it('serves English by default', () => {
    expect(routing.defaultLocale).toBe('en');
  });

  it('exposes exactly the locales that have message files', () => {
    expect([...routing.locales]).toEqual([...LOCALES]);
  });

  it('includes the default locale in the locale list', () => {
    expect(routing.locales).toContain(routing.defaultLocale);
  });
});
