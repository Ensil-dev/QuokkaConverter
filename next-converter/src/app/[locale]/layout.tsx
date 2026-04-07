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
import OrganizationSchema from './organization-schema';
import FAQSchema from './faq-schema';
import BreadcrumbSchema from './breadcrumb-schema';

export const metadata: Metadata = {
  title: {
    default: 'QuokkaConverter - 무료 온라인 파일 변환기',
    template: '%s | QuokkaConverter'
  },
  description: '무료 온라인 파일 변환기 QuokkaConverter로 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요. 확장자 변환, GIF 생성, PDF 관리 기능을 제공합니다.',
  keywords: [
    '파일 변환기', '온라인 변환', '무료 변환기', 'QuokkaConverter',
    '비디오 변환', '오디오 변환', '이미지 변환', 'PDF 변환'
  ],
  authors: [{ name: 'QuokkaConverter Team' }],
  creator: 'QuokkaConverter',
  publisher: 'QuokkaConverter',
  metadataBase: new URL('https://quokkaconverter.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'ko': '/ko',
      'en': '/en'
    }
  },
  openGraph: {
    title: 'QuokkaConverter - 무료 온라인 파일 변환기',
    description: '무료 온라인 파일 변환기로 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요. 확장자 변환, GIF 생성, PDF 관리 기능 제공',
    url: 'https://quokkaconverter.vercel.app',
    siteName: 'QuokkaConverter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QuokkaConverter - 무료 온라인 파일 변환기',
      },
      {
        url: '/apple-touch-icon.png',
        width: 512,
        height: 512,
        alt: 'QuokkaConverter Logo',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuokkaConverter - 무료 온라인 파일 변환기',
    description: '무료 온라인 파일 변환기로 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#F5D6B4',
    'msapplication-TileImage': '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#F5D6B4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
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
        {/* Google 검색 결과용 파비콘 설정 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png" />
        
        {ffmpegOrigin && (
          <link rel="preconnect" href={ffmpegOrigin} crossOrigin="anonymous" />
        )}
        {/* EdgePlus SDK - dogfooding (로컬 개발용) */}
        {process.env.NODE_ENV === 'development' && (
          <script
            src="http://localhost:4000/sdk/v1.js"
            data-site-key="ep_site_quokka"
            data-endpoint="http://localhost:4000/api/collect"
            defer
          />
        )}
      </head>
      <body suppressHydrationWarning={true}>
        <OrganizationSchema />
        <FAQSchema />
        <BreadcrumbSchema />
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