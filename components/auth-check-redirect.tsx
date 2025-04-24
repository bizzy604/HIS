'use client'

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthCheckRedirectProps {
  redirectTo: string
}

/**
 * Client component that checks authentication status and redirects if needed
 * Used on auth pages to redirect authenticated users away
 */
export function AuthCheckRedirect({ redirectTo }: AuthCheckRedirectProps) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect after Clerk has loaded auth state
    if (isLoaded && userId) {
      router.push(redirectTo)
    }
  }, [isLoaded, userId, redirectTo, router])

  // This component doesn't render anything visible
  return null
}
