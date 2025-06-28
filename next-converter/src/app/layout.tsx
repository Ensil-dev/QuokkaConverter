import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import InAppRedirectGuard from '@/components/InAppRedirectGuard';
import { Analytics } from '@vercel/analytics/next';

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
  // themeColor 제거됨 ✅
};

export const viewport = {
  themeColor: '#F5D6B4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning={true}>
        <InAppRedirectGuard />
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
