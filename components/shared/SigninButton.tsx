"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SignInButton() {
    const [isHovering, setIsHovering] = useState(false)

    return (
        <Link href="/auth/signin" className="relative">
            <Button
                variant="outline"
                className={cn(
                    "group relative overflow-hidden rounded-full px-6 py-2 transition-all duration-300",
                    "hover:bg-primary hover:text-primary-foreground",
                    "dark:border-primary dark:hover:bg-primary dark:hover:text-primary-foreground",
                    isHovering ? "pl-10" : "pl-6",
                )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <motion.span
                    className="absolute left-3 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                        opacity: isHovering ? 1 : 0,
                        x: isHovering ? 0 : -20,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <LogIn size={18} className="text-current" />
                </motion.span>
                <span className="relative z-10">Sign In</span>
                <motion.div
                    className="absolute bottom-0 left-0 h-full bg-primary/10 dark:bg-primary/20"
                    initial={{ width: "0%" }}
                    animate={{ width: isHovering ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                />
            </Button>
        </Link>
    )
}