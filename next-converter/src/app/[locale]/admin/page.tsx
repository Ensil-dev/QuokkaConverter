import requireAdmin from '@/lib/requireAdmin';
import MaxUploadSizeSetting from '@/components/admin/MaxUploadSizeSetting';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage() {
  await requireAdmin();
  const t = await getTranslations('Admin');

  return (
    <>
      <h1 className="mb-4 text-xl font-bold pb-[10px]">{t('dashboard')}</h1>
      <MaxUploadSizeSetting />
    </>
  );
}
