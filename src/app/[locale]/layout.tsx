import '@/app/globals.css';

import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ErrorBoundary } from '@/components/error-boundary';
import { routing } from '@/i18n/routing';
import { THEME_INIT_SRC } from '@/lib/theme';

const SITE_URL = 'https://dimasadimo.com';

// App Router owns <head>; declare head-level concerns through exports instead.
export const viewport: Viewport = {
  colorScheme: 'light dark',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: 'website',
      siteName: 'Dimas Adimo',
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dimas Adimo',
  jobTitle: 'Design Engineer & Fullstack Engineer',
  url: SITE_URL,
  description:
    'Portfolio of Dimas Adimo, a Design Engineer and Fullstack Engineer specializing in React, UX, and fullstack development.',
  knowsAbout: ['React', 'Web Design', 'Frontend Development', 'UX/UI Design', 'TypeScript'],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    // suppressHydrationWarning on <html>: the theme script sets data-theme before React.
    // On <body>: browser extensions (Grammarly, password managers) inject attributes
    // there before hydration. Both are one-level-deep only — real mismatches in the
    // tree below still surface.
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Static file, not inline JSX: React 19 warns about <script> children, and
            next/script's beforeInteractive defers into Next's queue (too late to stop
            a theme flash). A blocking <script src> in body runs before paint. */}
        <script src={THEME_INIT_SRC} />
        <ErrorBoundary>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ErrorBoundary>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
      </body>
    </html>
  );
}
