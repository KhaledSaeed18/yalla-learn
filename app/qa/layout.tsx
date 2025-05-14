import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Community Q&A",
    description: "Browse questions and answers from the community or ask your own questions",
}

export default function QaLayout({
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