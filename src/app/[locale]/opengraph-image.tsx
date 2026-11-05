import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Dimas Adimo — Design Engineer & Fullstack Engineer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Generated at build time, so there is no PNG to keep in sync by hand. */
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: 'linear-gradient(135deg, #0C1B3F 0%, #13244d 60%, #2a1c3f 100%)',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', fontSize: 30, letterSpacing: 6, color: '#FE5402' }}>
        DIMASADIMO.COM
      </div>
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, marginTop: 24 }}>
        Dimas Adimo
      </div>
      <div style={{ display: 'flex', fontSize: 40, marginTop: 12, color: '#c9d2e8' }}>
        Design Engineer &amp; Fullstack Engineer
      </div>
      <div
        style={{ display: 'flex', fontSize: 26, marginTop: 36, color: '#8e9ab8', maxWidth: 900 }}
      >
        {t('description').slice(0, 120)}
      </div>
      <div
        style={{ display: 'flex', marginTop: 48, height: 8, width: 180, background: '#FE5402' }}
      />
    </div>,
    size,
  );
}
