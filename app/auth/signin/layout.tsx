import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account to access your dashboard',
}

export default function SignInLayout({
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