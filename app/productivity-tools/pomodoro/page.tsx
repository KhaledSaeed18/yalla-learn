"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"

export default function PomodoroPage() {
    // Timer states
    const [mode, setMode] = useState<"focus" | "break">("focus")
    const [isActive, setIsActive] = useState(false)
    const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
    const [focusDuration, setFocusDuration] = useState(25)
    const [breakDuration, setBreakDuration] = useState(5)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [completedPomodoros, setCompletedPomodoros] = useState(0)

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869.wav';

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    }, []);

    // Timer logic
    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        // Timer complete
                        clearInterval(timerRef.current as NodeJS.Timeout)

                        // Play sound if enabled
                        if (soundEnabled && audioRef.current) {
                            audioRef.current.play().catch(e => console.error("Error playing sound:", e))
                        }

                        // Switch modes and reset timer
                        if (mode === "focus") {
                            setMode("break")
                            setTime(breakDuration * 60)
                            setCompletedPomodoros(prev => prev + 1)
                        } else {
                            setMode("focus")
                            setTime(focusDuration * 60)
                        }

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
    }, [isActive, mode, focusDuration, breakDuration, soundEnabled])

    // Format time as mm:ss
    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = timeInSeconds % 60
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    // Calculate progress percentage
    const calculateProgress = () => {
        const totalTime = mode === "focus" ? focusDuration * 60 : breakDuration * 60
        return ((totalTime - time) / totalTime) * 100
    }

    // Handle start/pause
    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    // Handle reset
    const resetTimer = () => {
        setIsActive(false)
        setTime(mode === "focus" ? focusDuration * 60 : breakDuration * 60)
    }

    // Handle duration changes
    const handleFocusChange = (value: number[]) => {
        const newDuration = value[0]
        setFocusDuration(newDuration)
        if (mode === "focus" && !isActive) {
            setTime(newDuration * 60)
        }
    }

    const handleBreakChange = (value: number[]) => {
        const newDuration = value[0]
        setBreakDuration(newDuration)
        if (mode === "break" && !isActive) {
            setTime(newDuration * 60)
        }
    }

    return (
        <div className="container px-4 max-w-5xl mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Pomodoro Timer</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Enhance your productivity with the Pomodoro Technique - alternate focused work periods with short breaks.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timer Card */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">
                            {mode === "focus" ? "Focus Time" : "Break Time"}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {mode === "focus"
                                ? "Stay focused on your task"
                                : "Take a short break to recharge"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center justify-center">
                        {/* Timer Circle */}
                        <div className="relative w-64 h-64 mb-8">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    className="text-muted stroke-current"
                                    strokeWidth="4"
                                    fill="transparent"
                                    r="45"
                                    cx="50"
                                    cy="50"
                                />

                                {/* Progress circle */}
                                <circle
                                    className={`${mode === "focus" ? "text-primary" : "text-green-500"} stroke-current`}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="45"
                                    cx="50"
                                    cy="50"
                                    strokeDasharray="282.7"
                                    strokeDashoffset={282.7 - (282.7 * calculateProgress()) / 100}
                                    transform="rotate(-90 50 50)"
                                />

                                {/* Time text */}
                                <text
                                    x="50"
                                    y="50"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="font-mono text-2xl fill-current"
                                >
                                    {formatTime(time)}
                                </text>
                            </svg>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                onClick={toggleTimer}
                                className={`${isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary"} w-32`}
                            >
                                {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                                {isActive ? "Pause" : "Start"}
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={resetTimer}
                                disabled={time === (mode === "focus" ? focusDuration * 60 : breakDuration * 60)}
                                className="w-32"
                            >
                                <RotateCcw className="mr-2" />
                                Reset
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Completed Pomodoros: <span className="font-semibold">{completedPomodoros}</span>
                        </p>
                    </CardFooter>
                </Card>

                {/* Settings Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Customize your Pomodoro experience</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Focus Duration: {focusDuration} minutes</Label>
                            <Slider
                                defaultValue={[25]}
                                min={5}
                                max={60}
                                step={5}
                                onValueChange={handleFocusChange}
                                disabled={isActive && mode === "focus"}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Break Duration: {breakDuration} minutes</Label>
                            <Slider
                                defaultValue={[5]}
                                min={1}
                                max={15}
                                step={1}
                                onValueChange={handleBreakChange}
                                disabled={isActive && mode === "break"}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label>Sound Notifications</Label>
                            <div className="flex items-center gap-2">
                                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                <Switch
                                    checked={soundEnabled}
                                    onCheckedChange={setSoundEnabled}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pomodoro Info */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>About the Pomodoro Technique</CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-muted-foreground">
                        The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
                        It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
                        Each interval is known as a "pomodoro", from the Italian word for tomato, after the tomato-shaped kitchen timer
                        Cirillo used as a university student.
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4">
                            <h3 className="font-medium mb-2">How it works:</h3>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Decide on the task to be done</li>
                                <li>Set the timer for 25 minutes (one pomodoro)</li>
                                <li>Work on the task until the timer rings</li>
                                <li>Take a short 5-minute break</li>
                                <li>Every four pomodoros, take a longer break (15-30 minutes)</li>
                            </ol>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h3 className="font-medium mb-2">Benefits:</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Increases focus and concentration</li>
                                <li>Reduces mental fatigue</li>
                                <li>Increases awareness of how time is spent</li>
                                <li>Provides a structured approach to work</li>
                                <li>Helps combat procrastination</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
