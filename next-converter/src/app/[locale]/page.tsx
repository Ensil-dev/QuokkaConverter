import type { Metadata } from 'next';
import Landing from '@/components/Landing';

export const metadata: Metadata = {
  title: 'QuokkaConverter - 안전하고 빠른 파일 변환 서비스',
  description: 'QuokkaConverter는 클라이언트 사이드에서 직접 처리되는 서버리스 파일 변환 서비스입니다.',
  keywords: ['파일변환', '서버리스', '보안', 'PDF', 'QuokkaConverter'],
};

export default function HomePage() {
  return <Landing />;
}
