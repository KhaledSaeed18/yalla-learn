import type React from "react"

export default function QaLayout({
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
