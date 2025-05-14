"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CreditCard, PieChart, Wallet, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingIcons } from "./floating-icons"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export function ExpenseTrackerSection() {
    const router = useRouter()
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: false, amount: 0.1 })

    const floatingIconsArray = [
        <CreditCard key="creditcard" className="h-8 w-8 text-primary" />,
        <PieChart key="piechart" className="h-8 w-8 text-primary" />,
        <Wallet key="wallet" className="h-8 w-8 text-primary" />,
    ]

    const handleClick = () => {
        if (isAuthenticated) {
            router.push('/dashboard/expense-tracker')
        } else {
            router.push('/auth/signin')
        }
    }

    return (
        <section ref={sectionRef} className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
            {/* Floating Icons Background */}
            <FloatingIcons icons={floatingIconsArray} count={10} />

            <div className="container mx-auto relative">
                {/* Expense Tracker Section Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card/80 to-card shadow-xl backdrop-blur-sm p-10">
                        <div className="flex flex-col items-center text-center">
                            {/* Icon Animation */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Wallet className="w-10 h-10 text-primary" />
                                </div>
                            </motion.div>

                            <h3 className="text-2xl font-bold mb-3">Master Your Finances</h3>
                            <p className="text-muted-foreground mb-8 max-w-2xl">
                                Our expense tracker helps you monitor spending, set budgets, and achieve your financial goals.
                                Track expenses by category, visualize spending patterns, and make smarter financial decisions with insightful analytics.
                            </p>

                            <div className="flex flex-wrap gap-3 justify-center mb-8">
                                <Badge variant="secondary" className="px-3 py-1 text-sm">Budget Planning</Badge>
                                <Badge variant="secondary" className="px-3 py-1 text-sm">Expense Categories</Badge>
                                <Badge variant="secondary" className="px-3 py-1 text-sm">Visual Analytics</Badge>
                                <Badge variant="secondary" className="px-3 py-1 text-sm">Financial Reports</Badge>
                            </div>

                            <Button
                                onClick={handleClick}
                                size="lg"
                                className="group"
                            >
                                {isAuthenticated ? 'Track Your Expenses' : 'Sign In to Get Started'}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
