import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define your route configurations
// With this approach, we'll keep routes organized but skip middleware-based authentication
// All authentication will be handled client-side with the AuthGuard component
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/blog',
  '/blog/.*',
]

// This list is for documentation purposes only - actual protection happens client-side
const PROTECTED_ROUTES = [
  '/courses/.*',
  '/membership',
  '/profile',
  '/dashboard',
  '/account',
  '/flashcards',
  '/lessons',
  '/exercises',
  '/admin/.*',
]

// Since we're using pure React state for authentication with no cookies,
// we can't implement server-side protection in middleware.
// This middleware now only handles rewrites/redirects but not authentication.
export function middleware(request: NextRequest) {
  // All routes are accessible - authentication happens client-side
  return NextResponse.next()
}

// Define which routes this middleware will run on
export const config = {
  matcher: [],  // Empty matcher since we're not using middleware for auth
}