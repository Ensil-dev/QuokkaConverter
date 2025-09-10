import type { Metadata } from 'next';
import ComponentsDemo from './ComponentsDemo';

export const metadata: Metadata = {
  title: '컴포넌트 데모',
  description: 'QuokkaConverter 디자인 시스템 컴포넌트 데모페이지입니다. Linear.app에서 영감을 받은 다크 테마 UI 컴포넌트들을 확인할 수 있습니다.',
  keywords: ['컴포넌트', '디자인 시스템', 'UI', '데모'],
};

export default function ComponentsPage() {
  return <ComponentsDemo />;
}