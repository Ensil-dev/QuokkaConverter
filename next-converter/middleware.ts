import { auth } from './src/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // FFmpeg 관련 처리
  if (pathname.startsWith('/ffmpeg/')) {
    const accept = request.headers.get('accept-encoding') || '';
    if (accept.includes('br')) {
      const url = request.nextUrl.clone();
      url.pathname = `${pathname}.br`;
      const response = NextResponse.rewrite(url);
      response.headers.set('Content-Encoding', 'br');
      response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
      response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      return response;
    }
    const response = NextResponse.next();
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    return response;
  }

  // 인증이 필요한 경로들
  if (pathname.startsWith('/convert/') || pathname.startsWith('/admin/')) {
    try {
      const session = await auth();
      
      if (!session || !session.user) {
        console.log('No session found, redirecting to login');
        // 현재 요청의 origin을 사용하여 로컬 환경 유지
        const loginUrl = new URL('/', request.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
      }

      // 관리자 페이지 접근 시 추가 검증
      if (pathname.startsWith('/admin/')) {
        const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map(email => email.trim()) || [];
        if (!allowedEmails.includes(session.user.email || '')) {
          console.log('Admin access denied for:', session.user.email);
          const unauthorizedUrl = new URL('/', request.nextUrl.origin);
          return NextResponse.redirect(unauthorizedUrl);
        }
      }
    } catch (error) {
      console.error('Middleware auth error:', error);
      const loginUrl = new URL('/', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/ffmpeg/:path*', 
    '/convert/:path*',
    '/convert',
    '/admin/:path*',
    '/admin'
  ],
};
