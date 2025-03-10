import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Settings | Dashboard',
  description: 'Manage your account settings',
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}

