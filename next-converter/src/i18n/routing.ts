import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 지원하는 모든 로케일 목록
  locales: ['ko', 'en'],
  
  // 기본 로케일 (매칭되지 않을 때 사용)
  defaultLocale: 'ko',
  
  // 로케일 접두사 설정 - 기본 로케일은 접두사 없음, 다른 로케일은 접두사 있음
  localePrefix: 'as-needed',
  
  // 로컬라이즈된 경로명 (선택사항)
  pathnames: {
    '/': '/',
    '/convert': {
      ko: '/convert',
      en: '/convert'
    },
    '/convert/pdf': {
      ko: '/convert/pdf',
      en: '/convert/pdf'
    },
    '/convert/gif': {
      ko: '/convert/gif',
      en: '/convert/gif'
    },
    '/convert/media': {
      ko: '/convert/media',
      en: '/convert/media'
    },
    '/admin': {
      ko: '/admin',
      en: '/admin'
    },
    '/auth/error': {
      ko: '/auth/error',
      en: '/auth/error'
    }
  }
});

// 로케일 타입 추론을 위한 타입 정의
export type Locale = (typeof routing.locales)[number];