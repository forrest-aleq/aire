import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require auth
const PROTECTED = [
  '/today',
  '/situations',
  '/outreach',
  '/calling',
  '/front-desk',
  '/pipeline',
  '/market',
  '/leads',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!needsAuth) return NextResponse.next();

  const session = req.cookies.get('aire-session');
  if (!session?.value) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/today/:path*',
    '/situations/:path*',
    '/outreach/:path*',
    '/calling/:path*',
    '/front-desk/:path*',
    '/pipeline/:path*',
    '/market/:path*',
    '/leads/:path*',
  ],
};
