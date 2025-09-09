'use client';

import { useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { routing } from '@/i18n/routing';

const LANGUAGE_CONFIG = {
  ko: { name: '한국어', flag: '🇰🇷' },
  en: { name: 'English', flag: '🇺🇸' }
} as const;

export default function FloatingLanguageButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const currentLocale = (params.locale as string) || routing.defaultLocale;

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale });
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-2">
        {isExpanded && routing.locales.map((locale) => {
          if (locale === currentLocale) return null;
          
          const language = LANGUAGE_CONFIG[locale as keyof typeof LANGUAGE_CONFIG];
          
          return (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:scale-105"
              title={`Switch to ${language.name}`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
            </button>
          );
        })}
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105"
          aria-label="Language options"
        >
          {isExpanded ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}