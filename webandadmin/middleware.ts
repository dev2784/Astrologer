import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/admin';
  let isAdmin = false;
  if (token) {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080';
      const response = await fetch(base + '/users/me', {
        headers: { Authorization: 'Bearer ' + token },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) isAdmin = (await response.json()).user?.role === 'ADMIN';
    } catch {
      // Backend unavailable: fail closed and leave the login page accessible.
    }
  }
  if (isAdmin && isLoginPage) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  if (!isAdmin) {
    const response = isLoginPage ? NextResponse.next() : NextResponse.redirect(new URL('/admin', request.url));
    if (token) response.cookies.delete('token');
    return response;
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*'] };
