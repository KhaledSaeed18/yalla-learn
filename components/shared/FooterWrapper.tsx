"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterWrapper() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    if (isDashboard) {
        return null;
    }

    return <Footer />;
}