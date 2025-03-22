"use client"

import { useTheme } from "next-themes"
import { Toaster } from "sonner"

export function ThemeAwareToaster() {
    const { theme, resolvedTheme } = useTheme()

    const toasterTheme = resolvedTheme || theme || "system"

    return <Toaster
        theme={toasterTheme as "light" | "dark" | "system"}
        closeButton={true}
        position="bottom-right"
        duration={3000}
    />
}
