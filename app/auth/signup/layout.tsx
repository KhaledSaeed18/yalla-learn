import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Create a new account to access our platform',
}

export default function SignUpLayout({
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
