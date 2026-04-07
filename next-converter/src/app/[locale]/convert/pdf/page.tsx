import PdfConverter from '@/components/PdfConverter';
import type { Metadata } from 'next';

const BASE_URL = 'https://quokkaconverter.vercel.app';

export const metadata: Metadata = {
  title: 'PDF 관리',
  description: 'PDF 파일을 관리하세요. 이미지를 PDF로 변환하고, 여러 PDF를 병합하거나 페이지별로 분할할 수 있습니다',
  keywords: [
    'PDF 관리', 'PDF 변환', 'PDF 병합', 'PDF 분할',
    'PDF converter', 'merge PDF', 'split PDF', 'image to PDF',
  ],
  alternates: {
    canonical: `${BASE_URL}/convert/pdf`,
    languages: {
      'ko': `${BASE_URL}/ko/convert/pdf`,
      'en': `${BASE_URL}/en/convert/pdf`,
    },
  },
  openGraph: {
    title: 'PDF 관리 | QuokkaConverter',
    description: 'PDF 파일을 관리하세요. 이미지를 PDF로 변환하고, 여러 PDF를 병합하거나 분할할 수 있습니다',
    url: `${BASE_URL}/convert/pdf`,
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

export default async function PdfConvertPage() {
  return <PdfConverter />;
}
