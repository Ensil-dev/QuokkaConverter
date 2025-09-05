import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  console.log('🚀 MIDDLEWARE EXECUTED:', request.nextUrl.pathname);
  
  if (request.nextUrl.pathname.startsWith('/convert')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      console.log('🔒 BLOCKING ACCESS - NOT LOGGED IN:', request.nextUrl.pathname);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log('✅ ALLOWING ACCESS - LOGGED IN USER:', token.email, request.nextUrl.pathname);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};