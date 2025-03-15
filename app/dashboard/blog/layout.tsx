import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Blog Management | Dashboard',
    description: 'Manage your blog posts',
}

export default function BlogLayout({
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