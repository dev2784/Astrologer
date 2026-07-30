import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Extract the token from the incoming request cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define the exact path to your login page
  const isLoginPage = pathname === '/admin';

  // 3. Scenario A: User is NOT logged in but trying to access secure routes
  if (!token && !isLoginPage) {
    const loginUrl = new URL('/admin', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Scenario B: User IS logged in but trying to view the login page again
  if (token && isLoginPage) {
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 5. Otherwise, let the request proceed normally
  return NextResponse.next();
}

// 6. Define exactly which routes this middleware should run on
export const config = {
  // This matcher catches /admin, /admin/dashboard, /admin/users, etc.
  matcher: ['/admin/:path*'],
};