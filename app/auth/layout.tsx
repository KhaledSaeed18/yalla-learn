"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { LeftIllustration, RightIllustration } from "@/components/auth/AuthIllustration"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, router])

  if (isChecking) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* Left illustration - hidden on mobile */}
        <div className="hidden lg:block lg:col-span-1">
          <LeftIllustration />
        </div>

        {/* Center content - maintains original max-w-md via mx-auto */}
        <div className="col-span-1 lg:col-span-3">
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>

        {/* Right illustration - hidden on mobile */}
        <div className="hidden lg:block lg:col-span-1">
          <RightIllustration />
        </div>
      </div>
    </div>
  )
}

