"use client";

import React from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
    Users,
    BarChart,
    FileStack,
    Tag,
    Headset,
    ChartNoAxesCombined
} from 'lucide-react';

interface AdminQuickLinkCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
}

const AdminQuickLinkCard = ({ title, description, icon, href }: AdminQuickLinkCardProps) => {
    const router = useRouter();

    return (
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push(href)}>
                    Manage
                </Button>
            </CardFooter>
        </Card>
    );
};

const AdminDashboard = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    // Admin quick links data
    const adminQuickLinks = [
        {
            title: "User Management",
            description: "Manage registered users and permissions",
            icon: <Users className="h-5 w-5" />,
            href: "/dashboard/users/manage"
        },
        {
            title: "Blog Administration",
            description: "Manage blog posts and categories",
            icon: <FileStack className="h-5 w-5" />,
            href: "/dashboard/blog/all"
        },
        {
            title: "Q&A System",
            description: "Moderate questions and manage tags",
            icon: <Tag className="h-5 w-5" />,
            href: "/dashboard/qa/all"
        },
        {
            title: "Support Tickets",
            description: "Respond to user support requests",
            icon: <Headset className="h-5 w-5" />,
            href: "/dashboard/support"
        },
        {
            title: "Analytics",
            description: "View platform statistics and metrics",
            icon: <BarChart className="h-5 w-5" />,
            href: "/dashboard/users"
        },
        {
            title: "Blog Statistics",
            description: "View blog engagement and analytics",
            icon: <ChartNoAxesCombined className="h-5 w-5" />,
            href: "/dashboard/blog/statistics"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back, {user?.firstName || 'Admin'}!
                </h2>
                <p className="text-muted-foreground mt-2">
                    Here's an overview of your administrative tools.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Admin Quick Access</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {adminQuickLinks.map((link, index) => (
                        <AdminQuickLinkCard
                            key={index}
                            title={link.title}
                            description={link.description}
                            icon={link.icon}
                            href={link.href}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;