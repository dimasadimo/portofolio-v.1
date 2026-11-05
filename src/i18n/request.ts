import { getRequestConfig } from 'next-intl/server';

import { type Locale, routing } from '@/i18n/routing';

type Messages = Record<string, unknown>;

async function loadMessages(locale: Locale): Promise<Messages> {
  const mod = (await import(`@/messages/${locale}.json`)) as { default: Messages };
  return mod.default;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = hasLocale(requested) ? requested : routing.defaultLocale;

  return { locale, messages: await loadMessages(locale) };
});

function hasLocale(value: string | undefined): value is Locale {
  return value !== undefined && (routing.locales as readonly string[]).includes(value);
}
