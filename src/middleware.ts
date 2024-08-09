import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicUrl = path === '/login' || path === '/signup';
  const token = request.cookies.get('token')?.value || '';

  // Verify and decode the token if it exists
  if (path === '/feedbacklist' && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role;
      // Redirect user based on their role if they try to access /feedbacklist
      if (userRole !== 1) {
        return NextResponse.redirect(new URL('/userfeedback', request.nextUrl));
      }
    } catch (error) {
      console.error('Invalid token:', error);
      // If the token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
  }

  if (isPublicUrl && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  if (!isPublicUrl && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  // Redirect users visiting the root path `/` to a specific page (e.g., /userfeedback)
  if (path === '/') {
    return NextResponse.redirect(new URL('/userfeedback', request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/userfeedback',
    '/feedbacklist',
    '/settings',
  ],
};
