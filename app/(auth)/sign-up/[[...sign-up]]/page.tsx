'use client'

import { SignUp } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"

export default function SignUpPage() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isLoaded && userId) {
      router.replace("/dashboard")
    }
  }, [isLoaded, userId, router])

  // Don't show anything while loading or if user is authenticated
  if (!isLoaded || userId) {
    return null
  }

  // Only render the SignUp component if user is not authenticated
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-background to-muted">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
        <SignUp
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
