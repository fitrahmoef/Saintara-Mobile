// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Public paths
  const publicPaths = ['/', '/login', '/register', '/tentang', '/produk'];
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Protected paths
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access
  if (path.startsWith('/super-admin') && payload.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/customer/dashboard', request.url));
  }

  if (path.startsWith('/admin-instansi') && 
      !['ADMIN_INSTANSI', 'SUPER_ADMIN'].includes(payload.role)) {
    return NextResponse.redirect(new URL('/customer/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};