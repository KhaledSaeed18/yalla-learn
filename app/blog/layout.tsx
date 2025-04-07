import React from "react"
import Link from "next/link"
import { Newspaper } from "lucide-react"

interface BlogLayoutProps {
    children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
            <div className="mb-8 space-y-6">
                <div className="flex justify-center">
                    <Link href="/blog" className="flex items-center space-x-2 text-3xl font-bold text-primary hover:opacity-90 transition-opacity">
                        <Newspaper className="h-8 w-8" />
                        <span>Our Blog</span>
                    </Link>
                </div>
                <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                    Discover the latest insights, tutorials, and updates from our team of experts.
                    Explore in-depth articles on a variety of topics to enhance your knowledge.
                </p>
            </div>

            {children}
        </div>
    )
}
