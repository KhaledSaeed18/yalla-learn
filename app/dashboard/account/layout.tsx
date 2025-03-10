import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Account | Dashboard',
    description: 'Manage your account information and preferences',
}

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="space-y-6">
            {children}
        </div>
    )
}
