import React from "react"

interface ExpenseTrackerLayoutProps {
    children: React.ReactNode
}

export default function ExpenseTrackerLayout({ children }: ExpenseTrackerLayoutProps) {
    return (
        <div className="space-y-6">
            {children}
        </div>
    )
}
