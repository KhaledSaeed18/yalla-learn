import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Metadata } from "next"
import { authMetadata } from "./metadata"

export const metadata: Metadata = authMetadata

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

