import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from './auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 다국어 미들웨어 생성
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 먼저 다국어 미들웨어 실행
  const intlResponse = intlMiddleware(request);
  
  // convert 경로에 대해서는 인증 체크
  if (request.nextUrl.pathname.includes('/convert/')) {
    const session = await auth();
    if (!session) {
      // 현재 로케일을 유지하면서 루트로 리다이렉트
      const locale = request.nextUrl.pathname.startsWith('/ko') ? 'ko' : 
                    request.nextUrl.pathname.startsWith('/en') ? 'en' : 'ko';
      const url = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return intlResponse;
}

export const config = {
  // 다음 경로를 제외한 모든 경로에 미들웨어 적용:
  // - /api, /_next, /_vercel로 시작하는 경로
  // - 점이 포함된 파일 (favicon.ico, images 등)
  matcher: [
    // 모든 경로에 적용하되 다음은 제외
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};