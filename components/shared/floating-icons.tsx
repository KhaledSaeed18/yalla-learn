"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
}

export function FloatingIcons({ icons, count = 10 }: FloatingIconsProps) {
    const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([])
    const { theme } = useTheme()
    const isDark = theme === "dark"

    useEffect(() => {
        const initialIcons: FloatingIcon[] = []
        for (let i = 0; i < count; i++) {
            initialIcons.push({
                id: i,
                icon: icons[i % icons.length],
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 1.5 + 0.5, // Size multiplier between 0.5 and 2
                rotation: Math.random() * 360,
                speed: Math.random() * 0.2 + 0.1, // Speed between 0.1 and 0.3
                direction: {
                    x: Math.random() * 2 - 1, // Between -1 and 1
                    y: Math.random() * 2 - 1, // Between -1 and 1
                },
            })
        }
        setFloatingIcons(initialIcons)

        // Animation loop
        const interval = setInterval(() => {
            setFloatingIcons((prevIcons) =>
                prevIcons.map((icon) => {
                    // Update position based on direction and speed
                    let newX = icon.x + icon.direction.x * icon.speed
                    let newY = icon.y + icon.direction.y * icon.speed

                    // Bounce off edges
                    let newDirectionX = icon.direction.x
                    let newDirectionY = icon.direction.y

                    if (newX <= 0 || newX >= 100) {
                        newDirectionX = -newDirectionX
                        newX = Math.max(0, Math.min(100, newX))
                    }
                    if (newY <= 0 || newY >= 100) {
                        newDirectionY = -newDirectionY
                        newY = Math.max(0, Math.min(100, newY))
                    }

                    return {
                        ...icon,
                        x: newX,
                        y: newY,
                        rotation: (icon.rotation + 0.2) % 360,
                        direction: {
                            x: newDirectionX,
                            y: newDirectionY,
                        },
                    }
                }),
            )
        }, 50)

        return () => clearInterval(interval)
    }, [icons, count])

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
                        color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                    }}
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 3 + floatingIcon.speed * 5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                >
                    {floatingIcon.icon}
                </motion.div>
            ))}
        </div>
    )
}
