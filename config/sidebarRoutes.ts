import { Home, FileText, PenLine, SquareStack, ChartNoAxesCombined, FileStack, Newspaper, Layout, FileUser, Settings, User, Users, Wallet, BarChart, CreditCard, PiggyBank, Calendar, Target, Clock, Headset } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidebarRoute = {
    id: string;
    label: string;
    href?: string;
    icon: LucideIcon;
    requiresAuth: boolean;
    roles: string[];
    activeWhen: (pathname: string) => boolean;
    children?: SidebarRoute[];
};

export const sidebarRoutes: SidebarRoute[] = [
    {
        id: "dashboard",
        label: "Home",
        href: "/dashboard",
        icon: Home,
        requiresAuth: true,
        roles: ["USER", "ADMIN"],
        activeWhen: (pathname) => pathname === "/dashboard",
    },
    {
        id: "settings",
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        requiresAuth: true,
        roles: ["USER", "ADMIN"],
        activeWhen: (pathname) => pathname === "/dashboard/settings",
    },
    {
        id: "kanban",
        label: "Kanban Board",
        href: "/dashboard/kanban-board",
        icon: Layout,
        requiresAuth: true,
        roles: ["USER", "ADMIN"],
        activeWhen: (pathname) => pathname.startsWith("/dashboard/kanban-board"),
    },
    {
        id: "resume-builder",
        label: "Resume Builder",
        href: "/dashboard/resume-builder",
        icon: FileUser,
        requiresAuth: true,
        roles: ["USER", "ADMIN"],
        activeWhen: (pathname) => pathname.startsWith("/dashboard/resume-builder"),
    },
    {
        id: "expense-tracker",
        label: "Expense Tracker",
        icon: Wallet,
        requiresAuth: true,
        roles: ["USER", "ADMIN"],
        activeWhen: (pathname) => pathname.startsWith("/dashboard/expense-tracker"),
        children: [
            {
                id: "dashboard",
                label: "Dashboard",
                href: "/dashboard/expense-tracker",
                icon: BarChart,
                requiresAuth: true,
                roles: ["USER", "ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/expense-tracker",
            },
            {
                id: "semesters",
                label: "Semesters",
                href: "/dashboard/expense-tracker/semesters",
                icon: Calendar,
                requiresAuth: true,
                roles: ["USER", "ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/expense-tracker/semesters",
            },
            {
                id: "expenses",
                label: "Expenses",
                href: "/dashboard/expense-tracker/expenses",
                icon: CreditCard,
                requiresAuth: true,
                roles: ["USER", "ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/expense-tracker/expenses",
            },
            {
                id: "income",
                label: "Income",
                href: "/dashboard/expense-tracker/income",
                icon: PiggyBank,
                requiresAuth: true,
                roles: ["USER", "ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/expense-tracker/income",
            },
            {
                id: "payment-schedules",
                label: "Payment Schedules",
                href: "/dashboard/expense-tracker/payment-schedules",
                icon: Clock,
                requiresAuth: true,
                roles: ["USER", "ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/expense-tracker/payment-schedules",
            },
        ],
    },
    {
        id: "blog",
        label: "Blog Management",
        icon: FileText,
        requiresAuth: true,
        roles: ["USER", "ADMIN"],
        activeWhen: (pathname) => pathname.startsWith("/dashboard/blog"),
        children: [
            {
                id: "statistics",
                label: "Statistics",
                href: "/dashboard/blog/statistics",
                icon: ChartNoAxesCombined,
                requiresAuth: true,
                roles: ["ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/blog/statistics",
            },
            {
                id: "categories",
                label: "Categories",
                href: "/dashboard/blog/categories",
                icon: SquareStack,
                requiresAuth: true,
                roles: ["ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/blog/categories",
            },
            {
                id: "all-posts",
                label: "All Posts",
                href: "/dashboard/blog/all",
                icon: FileStack,
                requiresAuth: true,
                roles: ["ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/blog/all",
            },
            {
                id: "create-post",
                label: "Create New",
                href: "/dashboard/blog/editor",
                icon: PenLine,
                requiresAuth: true,
                roles: ["USER", "ADMIN"],
                activeWhen: (pathname) => pathname.startsWith("/dashboard/blog/editor"),
            },
            {
                id: "my-posts",
                label: "My Posts",
                href: "/dashboard/blog",
                icon: Newspaper,
                requiresAuth: true,
                roles: ["USER", "ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/blog",
            },
        ],
    },
    {
        id: "users",
        label: "Users Management",
        icon: Users,
        requiresAuth: true,
        roles: ["ADMIN"],
        activeWhen: (pathname) => pathname.startsWith("/dashboard/users"),
        children: [
            {
                id: "statistics",
                label: "Statistics",
                href: "/dashboard/users",
                icon: ChartNoAxesCombined,
                requiresAuth: true,
                roles: ["ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/users",
            },
            {
                id: "users",
                label: "Users",
                href: "/dashboard/users/manage",
                icon: User,
                requiresAuth: true,
                roles: ["ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/users/manage",
            },
        ],
    },
    {
        id: "support",
        label: "Support",
        href: "/dashboard/support",
        icon: Headset,
        requiresAuth: true,
        roles: ["ADMIN"],
        activeWhen: (pathname) => pathname.startsWith("/dashboard/support"),
    }
];