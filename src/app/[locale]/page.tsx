import { setRequestLocale } from 'next-intl/server';

import { PortfolioScreen } from '@/components/portfolio-screen';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortfolioScreen />;
}
