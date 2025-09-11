import requireAdmin from '@/lib/requireAdmin';
import MaxUploadSizeSetting from '@/components/admin/MaxUploadSizeSetting';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';

export default async function AdminPage() {
  await requireAdmin();
  const t = await getTranslations('Admin');

  return (
    <div className="container rounded-[15px]">
      <Header subtitle={t('title')} />

      <div className="rounded-lg shadow-sm border-gray-200 dark:border-gray-700 p-6">
        <MaxUploadSizeSetting />
      </div>
    </div>
  );
}
