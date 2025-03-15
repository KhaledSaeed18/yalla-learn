import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Blog editor | Dashboard',
    description: 'Create blog posts',
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
