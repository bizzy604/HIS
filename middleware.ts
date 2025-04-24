import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

// Following Clerk's official documentation for Next.js middleware
export default clerkMiddleware(async (auth, req) => {
  // For non-public routes like /dashboard, require authentication
  if (isDashboardRoute(req)) {
    // This will automatically redirect to sign-in for unauthenticated users
    await auth.protect();
  }
  
  // Check if user is authenticated by accessing the auth object directly
  // Use a try-catch because auth.protect() will throw an error if user is not authenticated
  let isAuthenticated = false;
  try {
    await auth.protect();
    isAuthenticated = true;
  } catch (error) {
    isAuthenticated = false;
  }
  
  // If authenticated and on a public route (sign-in, sign-up), redirect to dashboard
  if (isAuthenticated && isPublicRoute(req)) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // For all other cases, allow the request to proceed
  return NextResponse.next();
}, {
  // Enable debug mode during development
  debug: process.env.NODE_ENV === 'development',
});

// Match all routes except static files and resources
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
