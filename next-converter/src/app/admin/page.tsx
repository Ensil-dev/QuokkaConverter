import requireAdmin from '@/lib/requireAdmin';
import { getAllowedEmails } from '@/lib/allowedEmails';
import AdminEmailForm from '@/components/AdminEmailForm';
import { ADMIN_EMAILS } from '@/lib/admin';
import { AppHeightSetter } from '@/components/shared/AppHeightSetter';
import BottomNav from '@/components/BottomNav';

export default async function AdminPage() {
  await requireAdmin();
  const emails = await getAllowedEmails();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeightSetter />
      <main className="min-h-[calc(100dvh-80px)] w-full flex-1 overflow-y-auto">
        <h1 className="mb-4 text-xl font-bold">Admin 대시보드</h1>
        <AdminEmailForm initialEmails={emails} adminEmails={ADMIN_EMAILS} />
      </main>
      <BottomNav />
    </div>
  );
}
