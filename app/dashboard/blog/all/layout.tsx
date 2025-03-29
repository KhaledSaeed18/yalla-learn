import type React from "react"

export default function AllBlogPostsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="space-y-6 overflow-x-hidden">
            {children}
        </div>
    )
}