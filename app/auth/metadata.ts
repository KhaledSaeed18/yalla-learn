import { Metadata } from "next"

export const authMetadata: Metadata = {
    title: {
        template: 'Authentication | %s',
        default: 'Authentication',
    },
    description: 'Sign in, register, or manage your authentication',
    keywords: ['login', 'sign up', 'authentication', 'account', 'password reset'],
}