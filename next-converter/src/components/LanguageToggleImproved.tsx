'use client';

import { useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { routing } from '@/i18n/routing';

const LANGUAGE_CONFIG = {
  ko: { name: '한국어', flag: '🇰🇷', short: 'KO', nativeName: '한국어' },
  en: { name: 'English', flag: '🇺🇸', short: 'EN', nativeName: 'English' }
} as const;

export default function LanguageToggleImproved() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const currentLocale = (params.locale as string) || routing.defaultLocale;
  const currentLanguage = LANGUAGE_CONFIG[currentLocale as keyof typeof LANGUAGE_CONFIG];
  const otherLocale = currentLocale === 'ko' ? 'en' : 'ko';
  const otherLanguage = LANGUAGE_CONFIG[otherLocale as keyof typeof LANGUAGE_CONFIG];

  const handleLanguageChange = () => {
    router.replace(pathname, { locale: otherLocale });
  };

  return (
    <div className="language-toggle-container">
      <button
        onClick={handleLanguageChange}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="language-toggle-btn"
        aria-label={`Switch to ${otherLanguage.name}`}
      >
        <div className="language-display">
          <span className="language-flag">{currentLanguage.flag}</span>
          <span className="language-text">{currentLanguage.short}</span>
        </div>
        
        {/* 호버 시 전환될 언어 표시 */}
        <div className={`language-preview ${isHovered ? 'visible' : ''}`}>
          <svg className="arrow-icon" viewBox="0 0 16 16">
            <path d="M8 2l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          <span className="preview-flag">{otherLanguage.flag}</span>
          <span className="preview-text">{otherLanguage.short}</span>
        </div>
      </button>
    </div>
  );
}