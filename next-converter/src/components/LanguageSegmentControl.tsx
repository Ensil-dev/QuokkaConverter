'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { routing } from '@/i18n/routing';

const LANGUAGE_CONFIG = {
  ko: { name: '한국어', flag: '🇰🇷', short: '한국어' },
  en: { name: 'English', flag: '🇺🇸', short: 'English' }
} as const;

export default function LanguageSegmentControl() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const currentLocale = (params.locale as string) || routing.defaultLocale;

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="language-segment-control">
      <div className="segment-background">
        <div 
          className={`segment-slider ${currentLocale === 'ko' ? 'left' : 'right'}`}
        />
      </div>
      
      {routing.locales.map((locale) => {
        const language = LANGUAGE_CONFIG[locale as keyof typeof LANGUAGE_CONFIG];
        const isActive = locale === currentLocale;
        
        return (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`segment-option ${isActive ? 'active' : ''}`}
            aria-label={`Switch to ${language.name}`}
          >
            <span className="segment-flag">{language.flag}</span>
            <span className="segment-text">{language.short}</span>
          </button>
        );
      })}
    </div>
  );
}