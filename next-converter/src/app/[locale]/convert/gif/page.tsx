import GifMaker from '@/components/GifMaker';
import type { Metadata } from 'next';

const BASE_URL = 'https://quokkaconverter.vercel.app';

export const metadata: Metadata = {
  title: 'GIF 생성',
  description: '이미지들을 합쳐서 움직이는 GIF 애니메이션을 만드세요. 무료 온라인 GIF 메이커로 품질과 속도를 조절할 수 있습니다',
  keywords: [
    'GIF 생성', 'GIF 메이커', '애니메이션 제작', '이미지 합치기',
    'GIF maker', 'create GIF', 'image to GIF', 'animation maker',
  ],
  alternates: {
    canonical: `${BASE_URL}/convert/gif`,
    languages: {
      'ko': `${BASE_URL}/ko/convert/gif`,
      'en': `${BASE_URL}/en/convert/gif`,
    },
  },
  openGraph: {
    title: 'GIF 생성 | QuokkaConverter',
    description: '이미지들을 합쳐서 움직이는 GIF 애니메이션을 만드세요',
    url: `${BASE_URL}/convert/gif`,
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

export default function GifPage() {
  return <GifMaker />;
}
