import { auth } from './src/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  if (pathname.startsWith('/convert/')) {
    const session = await auth();
    if (!session) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/ffmpeg/:path*', '/convert/:path*'],
};
