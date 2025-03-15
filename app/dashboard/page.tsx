import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'View all your important information in one place',
    keywords: ['dashboard', 'analytics', 'stats', 'overview'],
}

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold">
                Dashboard Home Page
            </h1>
        </div>
    )
}