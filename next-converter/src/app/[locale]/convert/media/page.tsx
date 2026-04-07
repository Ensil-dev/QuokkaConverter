import Converter from '@/components/Converter';
import type { Metadata } from 'next';

const BASE_URL = 'https://quokkaconverter.vercel.app';

export const metadata: Metadata = {
  title: '파일 확장자 변환',
  description: '비디오, 오디오, 이미지 파일을 다양한 확장자로 무료 변환하세요. MP4, WebM, MP3, WAV, JPG, PNG, WebP 등 다양한 형식 지원',
  keywords: [
    '파일 확장자 변환', '비디오 변환', '오디오 변환', '이미지 변환', '미디어 변환기',
    'file converter', 'video converter', 'audio converter', 'image converter',
  ],
  alternates: {
    canonical: `${BASE_URL}/convert/media`,
    languages: {
      'ko': `${BASE_URL}/ko/convert/media`,
      'en': `${BASE_URL}/en/convert/media`,
    },
  },
  openGraph: {
    title: '파일 확장자 변환 | QuokkaConverter',
    description: '비디오, 오디오, 이미지 파일을 다양한 확장자로 무료 변환하세요',
    url: `${BASE_URL}/convert/media`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function MediaConvertPage() {
  return <Converter showModeSelector={false} />;
}
