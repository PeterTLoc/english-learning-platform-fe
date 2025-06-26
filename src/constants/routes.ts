import { UserRole } from "@/components/guards/RoleGuard";

// Define application routes and their access requirements
export const ROUTES = {
  // Public routes (no authentication required)
  PUBLIC: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/blogs',
    '/blogs/[id]',
    '/courses',
    '/courses/[courseId]',
    '/courses/[courseId]/enroll',
    '/membership',
    '/flashcards',
  ],
  
  // User routes (require authentication)
  USER: [
    '/profile',
    '/dashboard',
    '/lessons',
    '/exercises',
  ],
  
  // Admin routes (require admin role)
  ADMIN: [
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/courses',
    '/admin/settings',
  ],
};

// Helper function to check if a route is public
export function isPublicRoute(pathname: string): boolean {
  return ROUTES.PUBLIC.some(route => {
    // Handle dynamic routes
    if (route.includes('[') && route.includes(']')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });
}

// Helper function to check if a route requires authentication
export function isProtectedRoute(pathname: string): boolean {
  return [...ROUTES.USER, ...ROUTES.ADMIN].some(route => {
    // Handle dynamic routes
    if (route.includes('[') && route.includes(']')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });
}

// Helper function to check if a route requires admin role
export function isAdminRoute(pathname: string): boolean {
  return ROUTES.ADMIN.some(route => {
    // Handle dynamic routes
    if (route.includes('[') && route.includes(']')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });
}

// Get required role for a route
export function getRequiredRoleForRoute(pathname: string): UserRole | null {
  if (isAdminRoute(pathname)) {
    return UserRole.ADMIN;
  } else if (isProtectedRoute(pathname)) {
    return UserRole.USER;
  }
  return null;
} 