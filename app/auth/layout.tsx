"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        {children}
      </div>
    </div>
  )
}