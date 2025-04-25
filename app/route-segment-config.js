/**
 * Central route segment configuration
 * 
 * This forces ALL routes in the application to be rendered dynamically
 * which prevents static optimization issues with Clerk authentication
 * and other server-side features that require request headers.
 */

// Force dynamic rendering for all routes
export const dynamic = 'force-dynamic'

// Prevent any caching of data fetches
export const fetchCache = 'force-no-store'

// Disable automatic revalidation
export const revalidate = 0

// Ensure server-side rendering
export const runtime = 'nodejs'

// Allow dynamic route parameters
export const dynamicParams = true

// No region preference
export const preferredRegion = 'auto'
