import { Metadata } from "next"

export const dashboardMetadata: Metadata = {
    title: {
        template: 'Dashboard | %s',
        default: 'Dashboard',
    },
    description: 'Manage your account and settings',
    keywords: ['dashboard', 'settings', 'account management'],
}
