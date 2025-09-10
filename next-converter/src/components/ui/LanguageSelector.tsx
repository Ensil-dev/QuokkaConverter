'use client';

import React from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { routing } from '@/i18n/routing';

const LANGUAGE_CONFIG = {
  ko: { name: '한국어', flag: '🇰🇷', short: '한국어' },
  en: { name: 'English', flag: '🇺🇸', short: 'English' }
} as const;

export interface LanguageSelectorProps {
  variant?: 'segment' | 'dropdown' | 'toggle';
  size?: 'sm' | 'md' | 'lg';
  showFlags?: boolean;
  showNames?: boolean;
  className?: string;
}

export default function LanguageSelector({
  variant = 'segment',
  size = 'md',
  showFlags = true,
  showNames = true,
  className = ''
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const currentLocale = (params.locale as string) || routing.defaultLocale;

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-sm px-2 py-1';
      case 'lg': return 'text-lg px-4 py-3';
      default: return 'text-base px-3 py-2';
    }
  };

  if (variant === 'segment') {
    return (
      <div className={`language-segment-control ${className}`}>
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
              className={`segment-option ${isActive ? 'active' : ''} ${getSizeClasses()}`}
              aria-label={`Switch to ${language.name}`}
            >
              {showFlags && <span className="segment-flag">{language.flag}</span>}
              {showNames && <span className="segment-text">{language.short}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'dropdown') {
    const currentLanguage = LANGUAGE_CONFIG[currentLocale as keyof typeof LANGUAGE_CONFIG];
    
    return (
      <div className={`relative inline-block ${className}`}>
        <select
          value={currentLocale}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className={`
            appearance-none bg-transparent border border-gray-300 rounded-md 
            ${getSizeClasses()} pr-8 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:border-gray-600 dark:text-white
          `}
          aria-label="Select language"
        >
          {routing.locales.map((locale) => {
            const language = LANGUAGE_CONFIG[locale as keyof typeof LANGUAGE_CONFIG];
            return (
              <option key={locale} value={locale}>
                {showFlags && `${language.flag} `}
                {showNames && language.name}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'toggle') {
    const currentLanguage = LANGUAGE_CONFIG[currentLocale as keyof typeof LANGUAGE_CONFIG];
    const otherLocale = currentLocale === 'ko' ? 'en' : 'ko';
    const otherLanguage = LANGUAGE_CONFIG[otherLocale];
    
    return (
      <button
        onClick={() => handleLanguageChange(otherLocale)}
        className={`
          flex items-center gap-2 ${getSizeClasses()} 
          border border-gray-300 rounded-md hover:bg-gray-50 
          transition-colors duration-200 ${className}
          dark:border-gray-600 dark:hover:bg-gray-800
        `}
        aria-label={`Switch to ${otherLanguage.name}`}
      >
        {showFlags && <span>{currentLanguage.flag}</span>}
        {showNames && <span>{currentLanguage.short}</span>}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m0-4l4-4" />
        </svg>
      </button>
    );
  }

  return null;
}