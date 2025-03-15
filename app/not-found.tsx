"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export default function NotFound() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <LoadingSpinner fullScreen />

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted dark:from-background dark:to-muted/80 p-4 text-center">
            <div className="max-w-md">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="relative mx-auto mb-8 h-40 w-40">
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                            <span className="text-7xl font-bold text-primary">404</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Page not found</h1>
                    <p className="mb-8 text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button asChild variant="default" size="lg" className="gap-2">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Back to home
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="gap-2 border-border hover:bg-accent">
                            <button onClick={() => window.history.back()}>
                                <ArrowLeft className="h-4 w-4" />
                                Go back
                            </button>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

