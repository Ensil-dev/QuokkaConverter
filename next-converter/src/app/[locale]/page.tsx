import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginCardClient from './LoginCardClient';
import type { Metadata } from 'next';

const BASE_URL = 'https://quokkaconverter.vercel.app';

export const metadata: Metadata = {
  title: 'QuokkaConverter - 무료 온라인 파일 변환기',
  description: '무료 온라인 파일 변환기 QuokkaConverter로 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요. 확장자 변환, GIF 생성, PDF 관리 기능을 제공합니다.',
  alternates: {
    canonical: BASE_URL,
    languages: {
      'ko': `${BASE_URL}/ko`,
      'en': `${BASE_URL}/en`,
    },
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
};

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/convert');
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'QuokkaConverter',
    'alternateName': '퀘카컨버터',
    'description': '무료 온라인 파일 변환기로 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요',
    'url': BASE_URL,
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'Any',
    'logo': `${BASE_URL}/apple-touch-icon.png`,
    'image': `${BASE_URL}/og-image.png`,
    'featureList': [
      '비디오 파일 변환 (MP4, WebM, AVI 등)',
      '오디오 파일 변환 (MP3, WAV, AAC 등)',
      '이미지 파일 변환 (JPG, PNG, WebP 등)',
      'GIF 생성 및 편집',
      'PDF 파일 관리 (병합, 분할, 변환)',
    ],
    'potentialAction': [
      { '@type': 'UseAction', 'target': `${BASE_URL}/ko/convert/media`, 'name': '파일 확장자 변환' },
      { '@type': 'UseAction', 'target': `${BASE_URL}/ko/convert/gif`, 'name': 'GIF 생성' },
      { '@type': 'UseAction', 'target': `${BASE_URL}/ko/convert/pdf`, 'name': 'PDF 관리' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <LoginCardClient />
    </>
  );
}
