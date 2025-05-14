"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
    Clock,
    ScanEye,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingIcons } from "./floating-icons"

const productivityTools = [
    {
        title: "Pomodoro Timer",
        href: "/productivity-tools/pomodoro",
        description: "Enhance your focus with the Pomodoro technique - 25/5 minute timer cycles with customizable options.",
        longDescription:
            "Boost your productivity with the time-tested Pomodoro Technique. This tool features customizable work and break intervals, task tracking, sound notifications, and detailed statistics to help you maintain focus and manage your time effectively.",
        icon: <Clock className="size-8" />,
        tags: ["Time Management", "Focus", "Productivity"],
    },
    {
        title: "Focus Mode",
        href: "/productivity-tools/focus-mode",
        description: "Enter a distraction-free environment with fullscreen mode, motivational quotes, and a countdown timer.",
        longDescription:
            "Create an optimal environment for deep work with our Focus Mode tool. It eliminates distractions with fullscreen capabilities, displays motivational quotes to keep you inspired, and includes a customizable countdown timer to help you stay on track with your work sessions.",
        icon: <ScanEye className="size-8" />,
        tags: ["Distraction-Free", "Deep Work", "Concentration"],
    }
]

export function ProductivityToolsSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: false, amount: 0.1 })

    const floatingIconsArray = [
        <Clock key="clock" className="h-8 w-8 text-primary" />,
        <ScanEye key="scaneye" className="h-8 w-8 text-primary" />,
    ]

    return (
        <section ref={sectionRef} className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
            {/* Floating Icons Background */}
            <FloatingIcons icons={floatingIconsArray} count={15} />

            <div className="container mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Boost Your Productivity
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Discover our collection of productivity tools designed to help you work smarter and achieve more
                    </p>
                </motion.div>

                {/* Productivity Tool Cards with Alternating Layout */}
                <div className="space-y-16">
                    {productivityTools.map((tool, index) => {
                        const isEven = index % 2 === 0

                        return (
                            <motion.div
                                key={tool.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="mb-12"
                            >
                                <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card/80 to-card shadow-xl backdrop-blur-sm">
                                    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}>
                                        {/* Icon Column */}
                                        <div className="w-full lg:w-1/3 p-10 flex items-center justify-center">
                                            <div className="relative w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {tool.icon}
                                                </div>
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border border-primary/30"
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        opacity: [0.5, 1, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Content Column */}
                                        <div className="w-full lg:w-2/3 p-8">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {tool.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs font-medium">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3">{tool.title}</h3>
                                            <p className="text-muted-foreground">{tool.description}</p>

                                            <div className="mt-6">
                                                <Button asChild variant="link" className="px-0 text-primary font-medium group">
                                                    <a href={tool.href}>
                                                        Try it now{" "}
                                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
