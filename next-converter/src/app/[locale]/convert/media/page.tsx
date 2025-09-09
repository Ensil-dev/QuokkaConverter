import Converter from '@/components/Converter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '파일 확장자 변환',
  description: '비디오, 오디오, 이미지 파일을 다양한 확장자로 무료 변환하세요. MP4, WebM, MP3, WAV, JPG, PNG, WebP 등 다양한 형식 지원',
  keywords: [
    '파일 확장자 변환', '비디오 변환', '오디오 변환', '이미지 변환',
    'MP4 변환', 'WebM 변환', 'MP3 변환', 'WAV 변환',
    'JPG 변환', 'PNG 변환', 'WebP 변환', '미디어 변환기'
  ],
  openGraph: {
    title: '파일 확장자 변환 | QuokkaConverter',
    description: '비디오, 오디오, 이미지 파일을 다양한 확장자로 무료 변환하세요',
    url: '/convert/media'
  }
};

export default async function MediaConvertPage() {
  return <Converter showModeSelector={false} />;
}
