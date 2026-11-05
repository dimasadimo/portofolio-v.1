import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React, { useEffect, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { flattenMessages, type MessageTree } from '@/lib/flatten-messages';
import { isLocale, LanguageContext, type Locale } from '@/lib/language-context';
import enMessages from '@/messages/en.json';
import idMessages from '@/messages/id.json';

const messages: Record<Locale, MessageTree> = {
  en: enMessages,
  id: idMessages,
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  // Derived, not mirrored in state — recomputing is cheaper than keeping the two in sync.
  const flattenedMessages = useMemo(() => flattenMessages(messages[locale]), [locale]);

  // Storage is a trust boundary: validate rather than cast.
  useEffect(() => {
    const saved = localStorage.getItem('locale');
    if (isLocale(saved)) setLocale(saved);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (next: Locale) => {
        setLocale(next);
        localStorage.setItem('locale', next);
      },
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider
        locale={locale}
        // react-intl types `messages` as Record<string, string>; this app also stores
        // string[] groups (e.g. hero.roles) read back via intl.messages.
        messages={flattenedMessages as Record<string, string>}
        defaultLocale="en"
      >
        <NextThemeProvider attribute="data-theme" defaultTheme="dark">
          {children}
        </NextThemeProvider>
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
