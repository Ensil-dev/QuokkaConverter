import requireAdmin from '@/lib/requireAdmin';
import { AppHeightSetter } from '@/components/shared/AppHeightSetter';
import BottomNav from '@/components/BottomNav';

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeightSetter />
      <main className="min-h-[calc(100dvh-80px)] w-full flex-1 overflow-y-auto">
        <h1 className="mb-4 text-xl font-bold">Admin 대시보드</h1>
        {/* 관리자 이메일 관리 기능은 제거되었습니다. */}
      </main>
      <BottomNav />
    </div>
  );
}
