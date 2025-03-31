import type React from "react"
import type { Metadata } from "next"
import { ResumeProvider } from "@/lib/resume/resume-context"


export const metadata: Metadata = {
    title: "ATS-Optimized Resume Builder",
    description: "Create professional, ATS-friendly resumes with ease",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ResumeProvider>
            {children}
        </ResumeProvider>
    )
}

