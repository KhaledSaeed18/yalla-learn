"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
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
                                {theme === "dark" ? (
                                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                                ) : theme === "light" ? (
                                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                                ) : (
                                    <Laptop className="h-[1.2rem] w-[1.2rem]" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {["light", "dark", "system"].map((mode) => (
                    <DropdownMenuItem
                        key={mode}
                        onClick={() => setTheme(mode)}
                        className="cursor-pointer gap-2"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 w-full"
                        >
                            {mode === "light" && <Sun className="h-4 w-4" />}
                            {mode === "dark" && <Moon className="h-4 w-4" />}
                            {mode === "system" && <Laptop className="h-4 w-4" />}
                            <span className="capitalize">{mode}</span>
                            {theme === mode && (
                                <motion.div
                                    layoutId="activeIndicator"
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