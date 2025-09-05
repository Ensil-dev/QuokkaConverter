import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host');
  
  console.log('🚀 MIDDLEWARE EXECUTED:', {
    pathname,
    host,
    userAgent: request.headers.get('user-agent')?.slice(0, 50)
  });
  
  if (pathname.startsWith('/convert')) {
    try {
      console.log('🔍 Checking JWT token for convert page...');
      
      // NextAuth v5(Auth.js)에서는 기본 쿠키명이 authjs.session-token으로 변경됨
      // cookieName을 명시하지 않고 getToken 기본 동작에 맡겨 환경에 맞게 자동 판단되도록 함
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      
      console.log('📋 Token check result:', {
        hasToken: !!token,
        tokenEmail: token?.email || 'no-email',
        tokenSub: token?.sub || 'no-sub',
        environment: process.env.NODE_ENV
      });
      
      if (!token) {
        console.log('🔒 BLOCKING ACCESS - NO VALID TOKEN:', pathname);
        const redirectUrl = new URL('/', request.url);
        console.log('↩️ Redirecting to:', redirectUrl.toString());
        return NextResponse.redirect(redirectUrl);
      }
      
      console.log('✅ ALLOWING ACCESS - VALID TOKEN:', token.email, pathname);
    } catch (error) {
      console.log('❌ TOKEN ERROR:', {
        message: error.message,
        stack: error.stack?.slice(0, 200)
      });
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
