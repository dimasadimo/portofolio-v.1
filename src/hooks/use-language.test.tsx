import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useLanguage } from '@/hooks/use-language';
import { LanguageContext } from '@/lib/language-context';

describe('useLanguage', () => {
  it('returns the context value when rendered inside the provider', () => {
    const setLocale = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LanguageContext.Provider value={{ locale: 'id', setLocale }}>
        {children}
      </LanguageContext.Provider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.locale).toBe('id');
    expect(result.current.setLocale).toBe(setLocale);
  });

  it('throws a named error when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useLanguage())).toThrow(/must be used within Providers/);
  });
});
