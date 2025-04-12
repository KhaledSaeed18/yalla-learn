"use client"

import * as React from "react"
import { useColorTheme } from "./color-theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { Palette } from "lucide-react"

export function ColorThemeToggle() {
    const { theme, setTheme, themes } = useColorTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative overflow-hidden">
                    {mounted && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={theme}
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 30, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Palette className="h-[1.2rem] w-[1.2rem]" />
                            </motion.div>
                        </AnimatePresence>
                    )}
                    <span className="sr-only">Toggle color theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((colorTheme) => (
                    <DropdownMenuItem
                        key={colorTheme}
                        onClick={() => setTheme(colorTheme)}
                        className="cursor-pointer gap-2"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 w-full"
                        >
                            <div
                                className={`h-4 w-4 rounded-full ${getColorForTheme(colorTheme)}`}
                            />
                            <span className="capitalize">{colorTheme}</span>
                            {theme === colorTheme && (
                                <motion.div
                                    layoutId="activeColorIndicator"
                                    className="ml-auto h-2 w-2 rounded-full bg-primary"
                                />
                            )}
                        </motion.div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Helper function to get preview color based on theme
function getColorForTheme(theme: string): string {
    switch (theme) {
        case "blue":
            return "bg-[oklch(0.623_0.214_259.815)]"
        case "red":
            return "bg-[oklch(0.637_0.237_25.331)]"
        default:
            return "bg-[oklch(0.623_0.214_259.815)]"
    }
}