import requireAdmin from '@/lib/requireAdmin';
import { AppHeightSetter } from '@/components/shared/AppHeightSetter';
import BottomNav from '@/components/BottomNav';
import MaxUploadSizeSetting from '@/components/admin/MaxUploadSizeSetting';

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeightSetter />
      <main className="min-h-[calc(100dvh-80px)] w-full flex-1 overflow-y-auto">
        <h1 className="mb-4 text-xl font-bold">관리자 대시보드</h1>
        <MaxUploadSizeSetting />
      </main>
      <BottomNav />
    </div>
  );
}
