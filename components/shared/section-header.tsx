"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SectionHeaderProps {
    title: string
    description?: string
    icon?: React.ReactNode
    className?: string
}

export function SectionHeader({
    title,
    description,
    icon,
    className
}: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn("flex flex-col items-center text-center mb-10", className)}
        >
            {icon && (
                <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4">
                    {icon}
                </div>
            )}
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                {title}
            </h2>
            {description && (
                <p className="text-muted-foreground max-w-2xl">
                    {description}
                </p>
            )}
            <div className="h-1 w-20 bg-primary/60 rounded-full mt-4" />
        </motion.div>
    )
}
