import type { Metadata } from 'next';
import '../globals.css';
import { AuthProvider } from '@/lib/auth';
import InAppRedirectGuard from '@/components/InAppRedirectGuard';
import ToastProvider from '@/components/ToastProvider';
import { Analytics } from '@vercel/analytics/next';
import BackExitHandler from '@/components/BackExitHandler';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'QuokkaConverter',
  description: '비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요 - QuokkaConverter',
  metadataBase: new URL('https://quokkaconverter.vercel.app'),
  openGraph: {
    title: 'QuokkaConverter',
    description: '비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요 - QuokkaConverter',
    url: 'https://quokkaconverter.vercel.app',
    siteName: 'QuokkaConverter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QuokkaConverter - 범용 파일 변환 SaaS',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuokkaConverter',
    description: '비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요 - QuokkaConverter',
    images: ['/og-image.png'],
    site: '@your_twitter',
  },
  icons: {
    icon: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  themeColor: '#F5D6B4',
  width: 'device-width',
  initialScale: 1,
};

const ffmpegBase = process.env.NEXT_PUBLIC_FFMPEG_BASE_URL;
const ffmpegOrigin = ffmpegBase ? new URL(ffmpegBase).origin : undefined;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // 유효한 로케일인지 확인
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // 정적 렌더링 활성화
  setRequestLocale(locale);

  // 메시지 로드
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {ffmpegOrigin && (
          <link rel="preconnect" href={ffmpegOrigin} crossOrigin="anonymous" />
        )}
      </head>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BackExitHandler />
          <InAppRedirectGuard />
          <ToastProvider />
          <AuthProvider>{children}</AuthProvider>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// 정적 파라미터 생성
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}