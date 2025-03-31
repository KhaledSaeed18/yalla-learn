import { Home, FileText, PenLine, SquareStack, ChartNoAxesCombined, FileStack, Newspaper, Layout, FileUser } from "lucide-react";
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
];