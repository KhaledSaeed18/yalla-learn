"use client";

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
    FileText,
    MessageSquare,
    Kanban,
    DollarSign,
} from 'lucide-react';


interface QuickLinkCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
}

const QuickLinkCard = ({ title, description, icon, href }: QuickLinkCardProps) => {
    const router = useRouter();

    return (
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => router.push(href)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => router.push(href)}>
                    Access
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function UserDashboard() {
    const { user } = useSelector((state: RootState) => state.auth);

    // Quick links data
    const quickLinks = [
        {
            title: "Resume Builder",
            description: "Create and manage your professional resume",
            icon: <FileText className="h-5 w-5" />,
            href: "/dashboard/resume-builder"
        },
        {
            title: "Q&A Forum",
            description: "Ask questions and help others",
            icon: <MessageSquare className="h-5 w-5" />,
            href: "/dashboard/qa/ask"
        },
        {
            title: "Kanban Board",
            description: "Organize your tasks and projects",
            icon: <Kanban className="h-5 w-5" />,
            href: "/dashboard/kanban-board"
        },
        {
            title: "Expense Tracker",
            description: "Manage your academic expenses",
            icon: <DollarSign className="h-5 w-5" />,
            href: "/dashboard/expense-tracker"
        }
    ];
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back, {user?.firstName || 'Student'}!
                </h2>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Quick Access</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quickLinks.map((link, index) => (
                        <QuickLinkCard
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
}
