import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Security Settings | Dashboard',
    description: 'Manage your security preferences and authentication settings',
}

export default function SecuritySettingsLayout({
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
