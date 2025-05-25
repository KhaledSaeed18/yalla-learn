"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterWrapper() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const isInfo = pathname?.startsWith("/info");


    if (isDashboard) {
        return null;
    }

    if (isInfo) {
        return null;
    }

    return <Footer />;
}