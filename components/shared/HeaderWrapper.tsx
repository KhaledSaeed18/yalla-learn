"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function HeaderWrapper() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const isInfo = pathname?.startsWith("/info");

    if (isDashboard) {
        return null;
    }

    if (isInfo) {
        return null;
    }

    return <Header />;
}