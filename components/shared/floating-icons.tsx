"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface FloatingIcon {
    id: number
    icon: React.ReactNode
    x: number
    y: number
    size: number
    rotation: number
    speed: number
    direction: { x: number; y: number }
}

interface FloatingIconsProps {
    icons: React.ReactNode[]
    count?: number
    frameRate?: number
}

export function FloatingIcons({
    icons,
    count = 6,
    frameRate = 24
}: FloatingIconsProps) {
    const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([])
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const animationRef = useRef<number | undefined>(undefined)
    const lastUpdateRef = useRef<number>(0)
    const iconsRef = useRef<FloatingIcon[]>([])

    const frameInterval = useMemo(() => 1000 / frameRate, [frameRate])

    useEffect(() => {
        const safeCount = Math.min(count, 8)

        const initialIcons: FloatingIcon[] = Array.from({ length: safeCount }, (_, i) => ({
            id: i,
            icon: icons[i % icons.length],
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1.5 + 0.5,
            rotation: Math.random() * 360,
            speed: Math.random() * 0.15 + 0.05,
            direction: {
                x: Math.random() * 2 - 1,
                y: Math.random() * 2 - 1,
            },
        }))

        iconsRef.current = initialIcons
        setFloatingIcons(initialIcons)
    }, [icons, count])

    const updateIcons = useCallback((timestamp: number) => {
        if (timestamp - lastUpdateRef.current >= frameInterval) {
            lastUpdateRef.current = timestamp

            for (let i = 0; i < iconsRef.current.length; i++) {
                const icon = iconsRef.current[i];
                let newX = icon.x + icon.direction.x * icon.speed;
                let newY = icon.y + icon.direction.y * icon.speed;

                if (newX <= 0 || newX >= 100) {
                    icon.direction.x = -icon.direction.x;
                    newX = Math.max(0, Math.min(100, newX));
                }
                if (newY <= 0 || newY >= 100) {
                    icon.direction.y = -icon.direction.y;
                    newY = Math.max(0, Math.min(100, newY));
                }

                icon.x = newX;
                icon.y = newY;
                icon.rotation = (icon.rotation + 0.2) % 360;
            }

            setFloatingIcons([...iconsRef.current])
        }

        animationRef.current = requestAnimationFrame(updateIcons)
    }, [frameInterval])

    useEffect(() => {
        animationRef.current = requestAnimationFrame(updateIcons)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [updateIcons])

    const iconColor = useMemo(() =>
        isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
        [isDark])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingIcons.map((floatingIcon) => (
                <motion.div
                    key={floatingIcon.id}
                    className="absolute"
                    style={{
                        left: `${floatingIcon.x}%`,
                        top: `${floatingIcon.y}%`,
                        transform: `scale(${floatingIcon.size}) rotate(${floatingIcon.rotation}deg)`,
                        opacity: 0.15,
                        color: iconColor,
                        willChange: "transform",
                    }}
                >
                    {floatingIcon.icon}
                </motion.div>
            ))}
        </div>
    )
}
