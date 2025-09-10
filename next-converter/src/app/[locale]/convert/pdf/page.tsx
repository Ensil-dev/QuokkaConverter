import PdfConverter from '@/components/PdfConverter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF 관리',
  description: 'PDF 파일을 관리하세요. 이미지를 PDF로 변환하고, 여러 PDF를 병합하거나 페이지별로 분할할 수 있습니다',
  keywords: [
    'PDF 관리', 'PDF 변환', 'PDF 병합', 'PDF 분할'
  ],
  openGraph: {
    title: 'PDF 관리 | QuokkaConverter',
    description: 'PDF 파일을 관리하세요. 이미지를 PDF로 변환하고, 여러 PDF를 병합하거나 분할할 수 있습니다',
    url: '/convert/pdf'
  }
};

export default async function PdfConvertPage() {
  return <PdfConverter />;
}