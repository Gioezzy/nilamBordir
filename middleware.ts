/* eslint-disable @typescript-eslint/no-unused-vars */
import { updateSession } from './lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for handling authentication and authorization
 * @param request The NextRequest object representing the incoming request.
 * @returns A NextResponse object with the updated session information.
 */
export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/auth/callback')){
    return response;
  }

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  const isAdminRoute = pathname.startsWith('/admin');

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/orders') || 
    pathname.startsWith('/profile') ||
    pathname.startsWith('/upload-design');

  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/shop') ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/category/') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/checkout'); 

  // ======================================
  // 1. Handle Unauthenticated Users
  // ======================================
  if (!user) {
    if (isAdminRoute || isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (pathname.startsWith('/checkout')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', '/checkout');
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // ======================================
  // 2. Handle Authenticated Users
  // ======================================

  if (isAuthRoute) {
    const role = (request.cookies.get('user_role')?.value || '').toLowerCase();

    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin' : '/dashboard', request.url)
    );
  }

  // ======================================
  // 3. Handle Admin Routes
  // ======================================
  if (isAdminRoute) {
    let role = request.cookies.get('user_role')?.value;

    if (!role) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        role = profile?.role;

        if (role) {
          response.cookies.set('user_role', role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 10, 
            sameSite: 'lax',
            path: '/',
          });
        }
      } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/dashboard', request.url));
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder files
     * - api routes (they have their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api).*)',
  ],
};