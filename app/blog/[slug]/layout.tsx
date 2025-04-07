import React from "react"
import { Metadata } from "next"

interface BlogPostLayoutProps {
    children: React.ReactNode
}

export const metadata: Metadata = {
    title: "Blog Post | Blog",
    description: "Read our latest blog post",
    openGraph: {
        type: "article",
        title: "Blog Post",
        description: "Read our latest blog post"
    }
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
