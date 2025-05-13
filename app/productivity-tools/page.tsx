"use client"

import React from "react"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductivityToolsPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Productivity Tools</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Our collection of productivity tools designed to help you work smarter and achieve more.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {/* Pomodoro Timer Card */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                        <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        Focus & Time Management
                    </h3>
                    <p className="text-muted-foreground flex-grow mb-6">
                        Enhance your focus with the Pomodoro technique - 25/5 minute timer cycles with customizable options and sound notifications.
                    </p>
                    <Button asChild className="w-full group-hover:bg-primary transition-colors">
                        <Link href="/productivity-tools/pomodoro">
                            Try it now
                        </Link>
                    </Button>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>

                {/* Placeholder for future productivity tools */}
                <div className="relative overflow-hidden rounded-lg border border-dashed bg-background/50 p-6 flex flex-col items-center justify-center min-h-[300px]">
                    <p className="text-xl text-muted-foreground text-center">
                        More productivity tools coming soon...
                    </p>
                </div>
            </div>
        </div>
    )
}
