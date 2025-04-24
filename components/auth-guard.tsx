'use client'

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Client component that ensures users are authenticated
 * Redirects to sign-in if not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        setIsAuthenticated(true)
      } else {
        router.replace('/sign-in')
      }
    }
  }, [isLoaded, userId, router])

  // Show nothing until we've checked authentication
  if (!isLoaded || !isAuthenticated) {
    return null
  }

  // If authenticated, render children
  return <>{children}</>
}
