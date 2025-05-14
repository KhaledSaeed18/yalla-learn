"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionProps {
    id: string
    label: string
    icon?: React.ReactNode
}

interface SectionNavigationProps {
    sections: SectionProps[]
}

export function SectionNavigation({ sections }: SectionNavigationProps) {
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "")

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { threshold: 0.5 }
        )

        sections.forEach((section) => {
            const element = document.getElementById(section.id)
            if (element) observer.observe(element)
        })

        return () => {
            sections.forEach((section) => {
                const element = document.getElementById(section.id)
                if (element) observer.unobserve(element)
            })
        }
    }, [sections])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-md border"
            >
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                            "p-2 rounded-full transition-all duration-300 flex items-center justify-center",
                            activeSection === section.id
                                ? "bg-primary text-primary-foreground scale-110 shadow-sm"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                        aria-label={section.label}
                        title={section.label}
                    >
                        {section.icon}
                    </button>
                ))}
            </motion.div>
        </div>
    )
}

export function SectionDivider({
    className,
    label
}: {
    className?: string
    label?: string
}) {
    return (
        <div className={cn("relative flex items-center py-10", className)}>
            <div className="flex-grow border-t border-muted"></div>

            {label && (
                <span className="flex-shrink mx-4 text-muted-foreground">
                    {label}
                </span>
            )}

            <div className="flex-grow border-t border-muted"></div>
        </div>
    )
}

export function SectionDots() {
    return (
        <div className="flex justify-center items-center py-10">
            <div className="flex space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/70"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
            </div>
        </div>
    )
}
