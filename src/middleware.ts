import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicUrl = path === '/login' || path === '/singup' || path === '/verifyemail'
    const token = request.cookies.get('token')?.value || ''
    if (isPublicUrl && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }
    if (!isPublicUrl && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
    // Redirect users visiting the root path `/` to a specific page (e.g., /profile)
    if (path === '/') {
        return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/profile/:path*',
        '/login',
        '/singup',
        '/verifyemail'
    ],
}