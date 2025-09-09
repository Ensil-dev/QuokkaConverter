import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 다음 경로를 제외한 모든 경로에 미들웨어 적용:
  // - /api, /_next, /_vercel로 시작하는 경로
  // - 점이 포함된 파일 (favicon.ico, images 등)
  matcher: [
    // 모든 경로에 적용하되 다음은 제외
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};