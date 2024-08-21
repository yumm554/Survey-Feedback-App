import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicUrl = path === '/login' || path === '/signup';
  const token = request.cookies.get('token')?.value || '';

  // If the path is public, allow access regardless of token
  if (isPublicUrl) {
    if (token) {
      try {
        // Validate the token to potentially redirect authenticated users away from public pages
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
        const { payload } = await jwtVerify(token, secret);

        // Redirect authenticated users away from public pages
        return NextResponse.redirect(new URL('/', request.nextUrl));
      } catch (error) {
        // Token may be invalid or expired, proceed to public page
        return NextResponse.next();
      }
    } else {
      // Allow access if no token is present
      return NextResponse.next();
    }
  }

  // For protected routes, validate the token
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      const userRole = verifiedPayload.role;

      // Handle role-based redirection
      if (path === '/feedbacklist' && userRole !== 1) {
        return NextResponse.redirect(new URL('/userfeedback', request.nextUrl));
      }

      // Redirect authenticated users visiting the root path to /userfeedback
      if (path === '/') {
        return NextResponse.redirect(new URL('/userfeedback', request.nextUrl));
      }

      // If the user has a valid token and is visiting a protected page, continue
      return NextResponse.next();
    } catch (error) {
      console.error('Invalid or expired token:', error);
      // Token validation failed, redirect to login
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
  }

  // If no token is found and the route is protected, redirect to login
  return NextResponse.redirect(new URL('/login', request.nextUrl));
}

// Define the paths to which this middleware applies
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
