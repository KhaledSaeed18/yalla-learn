import React from "react"

interface BlogPostLayoutProps {
    children: React.ReactNode
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
    return (
        <div className="bg-background">
            <div className="container px-4 md:px-6 max-w-4xl mx-auto py-8 md:py-12">
                {children}
            </div>
        </div>
    )
}
