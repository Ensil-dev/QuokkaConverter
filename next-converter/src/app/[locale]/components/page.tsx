import type { Metadata } from 'next';
import requireAdmin from '@/lib/requireAdmin';
import ComponentsDemo from './ComponentsDemo';

export const metadata: Metadata = {
  title: '컴포넌트 데모 - Admin Only',
  description: 'QuokkaConverter 디자인 시스템 컴포넌트 데모페이지입니다. 관리자만 접근 가능합니다.',
  keywords: ['컴포넌트', '디자인 시스템', 'UI', '데모', 'admin'],
};

export default async function ComponentsPage() {
  await requireAdmin();
  return <ComponentsDemo />;
}
