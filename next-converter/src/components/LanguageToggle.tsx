'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { routing } from '@/i18n/routing';

const LANGUAGE_CONFIG = {
  ko: { name: '한국어', flag: '🇰🇷', short: 'KO' },
  en: { name: 'English', flag: '🇺🇸', short: 'EN' }
} as const;

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const currentLocale = (params.locale as string) || routing.defaultLocale;
  const otherLocale = currentLocale === 'ko' ? 'en' : 'ko';

  const handleLanguageChange = () => {
    router.replace(pathname, { locale: otherLocale });
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${LANGUAGE_CONFIG[otherLocale as keyof typeof LANGUAGE_CONFIG].name}`}
    >
      <span className="text-sm font-medium">
        {LANGUAGE_CONFIG[currentLocale as keyof typeof LANGUAGE_CONFIG].flag}
      </span>
      <span className="text-sm font-medium hidden sm:inline">
        {LANGUAGE_CONFIG[currentLocale as keyof typeof LANGUAGE_CONFIG].short}
      </span>
    </button>
  );
}