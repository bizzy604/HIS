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
      <div className="mb-8 flex items-center gap-2">
        <div className="rounded-lg bg-card p-2 shadow-md">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="HIS Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Health Information System</h1>
      </div>
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-none p-0",
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
