import { Metadata } from "next"

export const dashboardMetadata: Metadata = {
    title: {
        template: '%s | Dashboard',
        default: 'Dashboard',
    },
    description: 'Manage your account and settings',
    keywords: ['dashboard', 'settings', 'account management'],
}
