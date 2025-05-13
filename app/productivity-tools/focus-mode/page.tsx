"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, X, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Array of motivational quotes for display during focus sessions
const MOTIVATIONAL_QUOTES = [
    {
        quote: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        quote: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },
    {
        quote: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        quote: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar"
    },
    {
        quote: "The future depends on what you do today.",
        author: "Mahatma Gandhi"
    },
    {
        quote: "Your time is limited, don't waste it living someone else's life.",
        author: "Steve Jobs"
    },
    {
        quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        quote: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        quote: "The harder you work for something, the greater you'll feel when you achieve it.",
        author: "Anonymous"
    }
]

export default function FocusModePage() {
    // State for focus duration and timer
    const [duration, setDuration] = useState(25)
    const [timeRemaining, setTimeRemaining] = useState(duration * 60)
    const [isActive, setIsActive] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869.wav'

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio(NOTIFICATION_SOUND_URL)
    }, [])

    // Format time as mm:ss
    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = timeInSeconds % 60
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    // Handle duration changes
    const handleDurationChange = (value: number[]) => {
        const newDuration = value[0]
        setDuration(newDuration)
        setTimeRemaining(newDuration * 60)
    }

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().then(() => {
                setIsFullscreen(true)
            }).catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`)
            })
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false)
            }).catch(err => {
                console.error(`Error attempting to exit fullscreen: ${err.message}`)
            })
        }
    }, [])

    // Start focus session
    const startFocusSession = () => {
        setTimeRemaining(duration * 60)
        setIsActive(true)
        toggleFullscreen()
    }

    // End focus session
    const endFocusSession = () => {
        setIsActive(false)
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        if (isFullscreen && document.fullscreenElement) {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false)
            }).catch(err => {
                console.error(`Error exiting fullscreen: ${err.message}`)
            })
        }
    }

    // Timer logic
    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime <= 1) {
                        // Timer complete
                        clearInterval(timerRef.current as NodeJS.Timeout)

                        // Play sound if enabled
                        if (soundEnabled && audioRef.current) {
                            audioRef.current.play().catch(e => console.error("Error playing sound:", e))
                        }

                        // Exit fullscreen mode before ending session
                        if (document.fullscreenElement) {
                            document.exitFullscreen().catch(err => {
                                console.error(`Error exiting fullscreen: ${err.message}`)
                            })
                        }

                        // End session
                        endFocusSession()
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)
        } else if (timerRef.current) {
            clearInterval(timerRef.current)
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, duration, soundEnabled])

    // Change quote every 30 seconds
    useEffect(() => {
        const quoteInterval = setInterval(() => {
            if (isActive) {
                setCurrentQuoteIndex((prevIndex) =>
                    (prevIndex + 1) % MOTIVATIONAL_QUOTES.length
                )
            }
        }, 30000)

        return () => clearInterval(quoteInterval)
    }, [isActive])

    // Handle escape key press to exit fullscreen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isActive) {
                endFocusSession()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isActive])

    // Handle fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isActive) {
                endFocusSession()
            }
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [isActive])

    return (
        <div ref={containerRef} className="min-h-screen">
            <AnimatePresence>
                {!isActive ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="container max-w-5xl mx-auto py-12 px-4"
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold tracking-tight mb-4">Focus Mode</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Enter a distraction-free environment to maximize your concentration and productivity.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            {/* Settings Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configure Focus Session</CardTitle>
                                    <CardDescription>Customize your focus session duration</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Duration: {duration} minutes</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(duration * 60)}
                                            </span>
                                        </div>
                                        <Slider
                                            defaultValue={[25]}
                                            value={[duration]}
                                            min={5}
                                            max={120}
                                            step={5}
                                            onValueChange={handleDurationChange}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Sound Notification</span>
                                        <div className="flex items-center gap-2">
                                            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                            <button
                                                onClick={() => setSoundEnabled(!soundEnabled)}
                                                className="p-1 rounded-md hover:bg-accent focus:outline-none"
                                            >
                                                {soundEnabled ? "On" : "Off"}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full mt-4"
                                        onClick={startFocusSession}
                                    >
                                        <Clock className="mr-2" />
                                        Start Focus Session
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Info Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>About Focus Mode</CardTitle>
                                    <CardDescription>How it helps you concentrate</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground">
                                        Focus Mode creates a distraction-free environment to help you concentrate deeply on your tasks.
                                    </p>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                                <span className="text-primary text-xs font-bold">1</span>
                                            </div>
                                            <p className="text-sm">
                                                <span className="font-medium">Full-screen experience</span> - Eliminates visual distractions
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                                <span className="text-primary text-xs font-bold">2</span>
                                            </div>
                                            <p className="text-sm">
                                                <span className="font-medium">Clear visual timer</span> - Helps track your focused time
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                                <span className="text-primary text-xs font-bold">3</span>
                                            </div>
                                            <p className="text-sm">
                                                <span className="font-medium">Motivational quotes</span> - Keep you inspired during your session
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                                <span className="text-primary text-xs font-bold">4</span>
                                            </div>
                                            <p className="text-sm">
                                                <span className="font-medium">Sound notification</span> - Alerts you when your session ends
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 bg-background flex flex-col items-center justify-center ${isFullscreen ? 'z-50' : ''}`}
                    >
                        {/* Exit button */}
                        <button
                            onClick={endFocusSession}
                            className="absolute top-6 right-6 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors"
                            aria-label="End focus session"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Timer */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="mb-10"
                        >
                            <h1 className="text-8xl md:text-9xl font-light tracking-tighter">
                                {formatTime(timeRemaining)}
                            </h1>
                        </motion.div>

                        {/* Motivational quote */}
                        <motion.div
                            key={currentQuoteIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 1 }}
                            className="max-w-lg text-center px-6"
                        >
                            <p className="text-xl md:text-2xl italic mb-2 text-primary/90">
                                "{MOTIVATIONAL_QUOTES[currentQuoteIndex].quote}"
                            </p>
                            <p className="text-sm text-muted-foreground">
                                — {MOTIVATIONAL_QUOTES[currentQuoteIndex].author}
                            </p>
                        </motion.div>

                        {/* Progress indicator */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-primary"
                            initial={{ width: '0%' }}
                            animate={{
                                width: `${100 - (timeRemaining / (duration * 60) * 100)}%`
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
