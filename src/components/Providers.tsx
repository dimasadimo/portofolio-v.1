import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { IntlProvider } from 'react-intl';
import enMessages from '../messages/en.json';
import idMessages from '../messages/id.json';

const messages: Record<string, any> = {
  en: enMessages,
  id: idMessages,
};

function flattenMessages(nestedMessages: any, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages: any, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    } else {
      messages[prefixedKey] = value;
    }

    return messages;
  }, {});
}

type Locale = 'en' | 'id';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [flattenedMessages, setFlattenedMessages] = useState(() => flattenMessages(messages['en']));

  useEffect(() => {
    setFlattenedMessages(flattenMessages(messages[locale]));
  }, [locale]);

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'id')) {
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <IntlProvider locale={locale} messages={flattenedMessages} defaultLocale="en">
        <NextThemeProvider attribute="data-theme" defaultTheme="dark">
          {children}
        </NextThemeProvider>
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
