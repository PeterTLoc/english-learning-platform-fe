import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/blog',
  '/blog/.*',
]

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

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}