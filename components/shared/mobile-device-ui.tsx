"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MobileDeviceUI() {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 py-16">
            <div className="flex-1 space-y-6 text-center lg:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Take Your Learning On The Go
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Download our mobile app and access all features from anywhere.
                        Browse the marketplace for study materials, find student services,
                        or offer your own skills to the community.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                    <div className="flex flex-col items-center sm:items-start">
                        <Button
                            variant="default"
                            size="lg"
                            className="gap-2 h-14 px-6 opacity-70 cursor-not-allowed"
                            disabled
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M16.4268 12.8153C16.4003 9.88472 18.8425 8.47631 18.9398 8.4172C17.5292 6.3281 15.4132 6.04353 14.6442 6.02612C12.8898 5.847 11.1947 7.0434 10.305 7.0434C9.39626 7.0434 8.01707 6.04353 6.53191 6.07833C4.63146 6.11313 2.86569 7.14969 1.91247 8.78059C-0.0750502 12.0985 1.45175 17.0688 3.3522 19.9298C4.3054 21.3382 5.42255 22.9256 6.88854 22.8648C8.31523 22.7988 8.8629 21.9514 10.5877 21.9514C12.2946 21.9514 12.8054 22.8648 14.296 22.8254C15.8304 22.7988 16.7925 21.3687 17.7106 19.9473C18.8098 18.3511 19.2441 16.7897 19.2618 16.7288C19.2264 16.7114 16.4575 15.6088 16.4268 12.8153Z" />
                                <path d="M13.6797 4.17767C14.4664 3.21936 15.0125 1.90576 14.8621 0.575439C13.777 0.627838 12.4571 1.35768 11.6349 2.29858C10.9013 3.12099 10.2428 4.48698 10.4108 5.76698C11.6349 5.85397 12.865 5.11884 13.6797 4.17767Z" />
                            </svg>
                            <div className="flex flex-col items-start">
                                <span className="text-xs">Download on the</span>
                                <span className="text-sm font-medium">App Store</span>
                            </div>
                        </Button>
                        <span className="text-xs text-muted-foreground mt-1">Coming Soon...</span>
                    </div>

                    <div className="flex flex-col items-center sm:items-start">
                        <Button
                            variant="outline"
                            size="lg"
                            className="gap-2 h-14 px-6 opacity-70 cursor-not-allowed"
                            disabled
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M3.60951 1.84854C3.37696 2.09308 3.25 2.45654 3.25 2.94276V21.0576C3.25 21.5438 3.37696 21.9073 3.60951 22.1518L3.69485 22.2301L14.5021 11.4229V11.0002V10.5775L3.69485 -0.22973L3.60951 -0.15142Z" />
                                <path d="M19.0319 14.9829L16.0027 11.9538V11.0001V10.0465L19.0319 7.01733L19.1389 7.08199L22.7133 9.12729C23.7693 9.70869 23.7693 10.6995 22.7133 11.2869L19.1389 13.3322L19.0319 14.9829Z" />
                                <path d="M19.139 13.3323L16.0028 10.0466L3.60962 22.4397C3.95042 22.8093 4.49598 22.8518 5.11408 22.4821L19.139 13.3323Z" />
                                <path d="M19.139 7.08189L5.11408 -2.0679C4.49598 -2.43759 3.95042 -2.39506 3.60962 -2.02544L16.0028 10.3685L19.139 7.08189Z" />
                            </svg>
                            <div className="flex flex-col items-start">
                                <span className="text-xs">GET IT ON</span>
                                <span className="text-sm font-medium">Google Play</span>
                            </div>
                        </Button>
                        <span className="text-xs text-muted-foreground mt-1">Coming Soon...</span>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="flex-1 flex justify-center lg:justify-end"
            >
                <div className="relative h-[500px] w-[250px] bg-zinc-900 rounded-[40px] border-[8px] border-zinc-700 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[32px] bg-zinc-900 z-10">
                        <div className="absolute top-4 left-1/2 w-20 h-[4px] -translate-x-1/2 bg-zinc-800 rounded-full"></div>
                    </div>
                    <div className="h-full w-full pt-[32px]">
                        <div className="w-full h-full overflow-hidden bg-gradient-to-b from-primary/20 to-background p-3">
                            <div className="w-full h-12 rounded-xl bg-background/90 backdrop-blur flex items-center justify-between px-4 mb-4">
                                <div className="w-24 h-5 bg-primary/20 rounded-full"></div>
                                <div className="w-5 h-5 rounded-full bg-primary/30"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="h-40 rounded-xl bg-background/80 backdrop-blur p-3 flex flex-col justify-between">
                                    <div className="w-8 h-8 rounded-lg bg-primary/30"></div>
                                    <div>
                                        <div className="w-full h-3 bg-zinc-200/30 rounded-full mb-2"></div>
                                        <div className="w-2/3 h-3 bg-zinc-200/30 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="h-40 rounded-xl bg-background/80 backdrop-blur p-3 flex flex-col justify-between">
                                    <div className="w-8 h-8 rounded-lg bg-primary/30"></div>
                                    <div>
                                        <div className="w-full h-3 bg-zinc-200/30 rounded-full mb-2"></div>
                                        <div className="w-2/3 h-3 bg-zinc-200/30 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full rounded-xl bg-background/80 backdrop-blur p-4 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/30"></div>
                                    <div className="flex-1">
                                        <div className="w-3/4 h-3 bg-zinc-200/30 rounded-full mb-2"></div>
                                        <div className="w-1/2 h-3 bg-zinc-200/30 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="w-full h-20 rounded-lg bg-zinc-800/50"></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="w-10 h-10 rounded-full bg-background/80"></div>
                                <div className="w-10 h-10 rounded-full bg-background/80"></div>
                                <div className="w-10 h-10 rounded-full bg-background/80"></div>
                                <div className="w-10 h-10 rounded-full bg-background/80"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
