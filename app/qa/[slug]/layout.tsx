import type { Metadata } from "next"
import type React from "react"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // You could fetch the question data here to get the title
    // For now, we'll use a generic title that includes the slug
    return {
        title: `Question - ${decodeURIComponent(params.slug.replace(/-/g, ' '))}`,
        description: "View question details and answers from the community",
    }
}

export default function QaQuestionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    )
}