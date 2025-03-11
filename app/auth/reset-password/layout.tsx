import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Reset your password to regain access to your account',
}

export default function ResetPasswordLayout({
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
