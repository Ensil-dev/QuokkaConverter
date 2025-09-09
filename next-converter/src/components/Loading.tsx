'use client';
import { FaSpinner } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('Common');
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <FaSpinner className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-600 pt-[10px]">{t('loading')}</p>
      </div>
    </div>
  );
}
