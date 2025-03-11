import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
    title: 'Verify Email',
    description: 'Verify your email address to complete your registration',
}

export default function VerifyEmailLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}
