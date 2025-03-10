import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'General Settings | Dashboard',
    description: 'Manage your general account settings',
}

export default function GeneralSettingsLayout({
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
