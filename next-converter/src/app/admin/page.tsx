import requireAdmin from '@/lib/requireAdmin';
import MaxUploadSizeSetting from '@/components/admin/MaxUploadSizeSetting';

export default async function AdminPage() {
  await requireAdmin();

  return (
    <>
      <h1 className="mb-4 text-xl font-bold pb-[10px]">관리자 대시보드</h1>
      <MaxUploadSizeSetting />
    </>
  );
}
