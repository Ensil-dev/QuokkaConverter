import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// 로케일을 인식하는 네비게이션 API 래퍼들을 생성
// 이 함수들은 자동으로 활성 로케일을 고려하여 경로를 처리합니다
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

// 타입 안전성을 위한 래퍼 (선택사항)
export type NavigationLink = typeof Link;
export type NavigationRouter = ReturnType<typeof useRouter>;