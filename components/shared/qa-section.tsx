"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { HelpCircle, MessageCircle, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingIcons } from "./floating-icons"

export function QASection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: false, amount: 0.1 })

    const floatingIconsArray = [
        <HelpCircle key="helpcircle" className="h-8 w-8 text-primary" />,
        <MessageCircle key="messagecircle" className="h-8 w-8 text-primary" />,
        <Users key="users" className="h-8 w-8 text-primary" />,
    ]

    return (
        <section ref={sectionRef} className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
            {/* Floating Icons Background */}
            <FloatingIcons icons={floatingIconsArray} count={10} />

            <div className="container mx-auto relative">
                {/* QA Section Card */}
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
                                transition={{ duration: 0.5 }}
                                className="relative mb-8"
                            >
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                    <HelpCircle className="h-12 w-12 text-primary" />
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
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="max-w-2xl mx-auto"
                            >
                                <h3 className="text-3xl font-bold mb-4">Community Q&A</h3>
                                <p className="text-muted-foreground mb-8 text-lg">
                                    Connect with like-minded learners and industry experts through our interactive Q&A platform.
                                    Get answers to your questions, participate in discussions, and contribute your knowledge
                                    to help others in their learning journey.
                                </p>

                                <div className="flex flex-wrap justify-center gap-4 mb-8">
                                    <Badge className="px-4 py-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary">
                                        Expert Answers
                                    </Badge>
                                    <Badge className="px-4 py-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary">
                                        Community Support
                                    </Badge>
                                    <Badge className="px-4 py-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary">
                                        Knowledge Exchange
                                    </Badge>
                                </div>

                                <Button size="lg" className="group" asChild>
                                    <a href="/qa">
                                        Browse Q&A Forum
                                        <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </motion.div>
                                    </a>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}