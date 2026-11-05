import { useContext } from 'react';

import { LanguageContext, type LanguageContextValue } from '@/lib/language-context';

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within Providers');
  return context;
}
