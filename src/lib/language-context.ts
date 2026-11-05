import { createContext } from 'react';

export const LOCALES = ['en', 'id'] as const;
export type Locale = (typeof LOCALES)[number];

export type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}
