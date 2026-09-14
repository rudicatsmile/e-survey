import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    // Cek kadaluarsa
    if (parsed.exp && parsed.exp * 1000 < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('surveikepuasan_session')?.value;
  const payload = sessionCookie ? decodeJwtPayload(sessionCookie) : null;

  // 1. Halaman Login: Jika sudah login, alihkan ke dashboard sesuai peran
  if (pathname === '/login') {
    if (payload) {
      if (payload.role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (payload.role === 'FIELD_OFFICER' && payload.hospitalCode) {
        return NextResponse.redirect(
          new URL(`/h/${payload.hospitalCode}/petugas/dashboard`, request.url)
        );
      } else if (payload.hospitalCode) {
        return NextResponse.redirect(
          new URL(`/h/${payload.hospitalCode}/dashboard`, request.url)
        );
      }
    }
    return NextResponse.next();
  }

  // 2. Proteksi Area Super Admin (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (payload.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 3. Proteksi Area Hospital Back-office (/h/*)
  if (pathname.startsWith('/h/')) {
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Ekstrak kode RS dari path /h/[hospitalCode]/...
    const segments = pathname.split('/');
    const targetHospitalCode = segments[2];

    // Isolasi Tenant: Admin RS / Petugas tidak boleh mengakses RS lain
    if (payload.role !== 'SUPER_ADMIN') {
      if (
        payload.hospitalCode &&
        targetHospitalCode &&
        payload.hospitalCode.toLowerCase() !== targetHospitalCode.toLowerCase()
      ) {
        // Alihkan ke rumah sakit milik user sendiri
        return NextResponse.redirect(
          new URL(`/h/${payload.hospitalCode}/dashboard`, request.url)
        );
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/h/:path*', '/login'],
};
