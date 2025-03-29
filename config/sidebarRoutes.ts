import { Home, FileText, PenLine, SquareStack, StickyNote } from "lucide-react";
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
        id: "blog",
        label: "Blog Management",
        icon: FileText,
        requiresAuth: true,
        roles: ["USER", "ADMIN"],
        activeWhen: (pathname) => pathname.startsWith("/dashboard/blog"),
        children: [
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
                icon: FileText,
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
                icon: StickyNote,
                requiresAuth: true,
                roles: ["USER", "ADMIN"],
                activeWhen: (pathname) => pathname === "/dashboard/blog",
            },
        ],
    },
];