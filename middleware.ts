import { updateSession } from './lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Updates the Supabase session for the given request.
 * @param request The NextRequest object representing the incoming request.
 * @returns A NextResponse object with the updated session information.
 */

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);

  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password');

  const isAdminRoute = pathname.startsWith('/admin');

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/pesanan') ||
    pathname.startsWith('/profile');

  // if user is not logged in and trying to accrss protected route
  if (!user) {
    if (isAdminRoute || isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // if user is logged in and trying to access auth route
  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // if user is logged in and trying to access admin route
  if (isAdminRoute) {
    let role = request.cookies.get('user_role')?.value;

    if (!role) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      role = profile?.role;

      // set role in cookies
      if (role) {
        response.cookies.set('user_role', role, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 10,
          sameSite: 'lax',
          path: '/',
        });
      }
    }

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
