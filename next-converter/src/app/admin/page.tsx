import requireAdmin from '@/lib/requireAdmin';
import { getAllowedEmails } from '@/lib/allowedEmails';
import AdminEmailForm from '@/components/AdminEmailForm';
import { ADMIN_EMAIL } from '@/lib/admin';

export default async function AdminPage() {
  await requireAdmin();
  const emails = await getAllowedEmails();

  return (
    <div className="container rounded-[15px] p-4">
      <h1 className="mb-4 text-xl font-bold">Admin 대시보드</h1>
      <AdminEmailForm initialEmails={emails} adminEmail={ADMIN_EMAIL} />
    </div>
  );
}
