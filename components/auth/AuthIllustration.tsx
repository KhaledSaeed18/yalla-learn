"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Database, Eye, EyeOff, Fingerprint, Key, Wifi } from "lucide-react"

function useThemeColors() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = resolvedTheme === "dark"

    return {
        bg: isDark ? "#171923" : "#F7FAFC",
        primary: isDark ? "#6366F1" : "#4F46E5",
        secondary: isDark ? "#A5B4FC" : "#818CF8",
        accent: isDark ? "#38BDF8" : "#0EA5E9",
        success: isDark ? "#10B981" : "#059669",
        warning: isDark ? "#F59E0B" : "#D97706",
        danger: isDark ? "#EF4444" : "#DC2626",
        text: isDark ? "#F1F5F9" : "#1E293B",
        lightShade: isDark ? "#2D3748" : "#EEF2FF",
        darkShade: isDark ? "#1A202C" : "#C7D2FE",
    }
}

export function LeftIllustration() {
    const colors = useThemeColors()
    const [authenticated, setAuthenticated] = useState(false)
    const [securityLevel, setSecurityLevel] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setAuthenticated((prev) => !prev)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setSecurityLevel((prev) => (prev + 1) % 3)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    if (!colors) return null

    return (
        <div className="w-full h-full">
            <svg viewBox="0 0 300 500" className="w-full h-full">
                {/* Background pulse */}
                <motion.circle
                    cx="150"
                    cy="200"
                    r="150"
                    fill={`${colors.primary}05`}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />

                {/* Shield with lock */}
                <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.g>
                        {/* Shield glow effect */}
                        <motion.path
                            d="M150 50L230 100V220C230 270 195 310 150 325C105 310 70 270 70 220V100L150 50Z"
                            fill={`${colors.primary}10`}
                            stroke={`${colors.primary}30`}
                            strokeWidth="6"
                            animate={{
                                filter: ["blur(0px)", "blur(8px)", "blur(0px)"],
                                opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        />

                        {/* Main shield with animated gradient */}
                        <motion.path
                            d="M150 50L230 100V220C230 270 195 310 150 325C105 310 70 270 70 220V100L150 50Z"
                            fill={`${colors.primary}20`}
                            stroke={colors.primary}
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{
                                pathLength: 1,
                                stroke: [colors.primary, colors.secondary, colors.primary],
                            }}
                            transition={{
                                pathLength: { duration: 1.5 },
                                stroke: { duration: 8, repeat: Number.POSITIVE_INFINITY },
                            }}
                        />

                        {/* Shield inner highlight */}
                        <motion.path
                            d="M150 60L220 105V215C220 260 190 295 150 310C110 295 80 260 80 215V105L150 60Z"
                            fill="none"
                            stroke={`${colors.secondary}40`}
                            strokeWidth="2"
                            strokeDasharray="4,4"
                            initial={{ pathLength: 0 }}
                            animate={{
                                pathLength: 1,
                                strokeDashoffset: [0, -50],
                            }}
                            transition={{
                                pathLength: { duration: 2, delay: 0.5 },
                                strokeDashoffset: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                            }}
                        />
                    </motion.g>

                    <motion.g>
                        {/* Background pulse for security level */}
                        <motion.path
                            d="M150 90L200 125V200C200 235 180 260 150 270C120 260 100 235 100 200V125L150 90Z"
                            fill={
                                securityLevel === 0
                                    ? `${colors.warning}10`
                                    : securityLevel === 1
                                        ? `${colors.secondary}10`
                                        : `${colors.success}10`
                            }
                            animate={{
                                filter: ["blur(0px)", "blur(5px)", "blur(0px)"],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        />

                        {/* Main security level indicator with dynamic border */}
                        <motion.path
                            d="M150 90L200 125V200C200 235 180 260 150 270C120 260 100 235 100 200V125L150 90Z"
                            fill={
                                securityLevel === 0
                                    ? `${colors.warning}30`
                                    : securityLevel === 1
                                        ? `${colors.secondary}30`
                                        : `${colors.success}30`
                            }
                            stroke={securityLevel === 0 ? colors.warning : securityLevel === 1 ? colors.secondary : colors.success}
                            strokeWidth="3"
                            animate={{
                                scale: [1, 1.03, 1],
                                strokeDashoffset: [0, 30],
                                strokeDasharray: securityLevel === 2 ? "0, 0" : "3, 3",
                            }}
                            transition={{
                                scale: { duration: 1, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY },
                                strokeDashoffset: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                            }}
                        />

                        {/* Security level icon */}
                        <motion.g
                            animate={{
                                scale: [1, 1.1, 1],
                                y: [0, -2, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            {securityLevel === 0 && (
                                <motion.path
                                    d="M140 180L160 180M140 190L160 190M140 200L160 200"
                                    stroke={colors.warning}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                            {securityLevel === 1 && (
                                <motion.path
                                    d="M140 180L160 200M160 180L140 200"
                                    stroke={colors.secondary}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                            {securityLevel === 2 && (
                                <motion.path
                                    d="M140 190L147 200L160 180"
                                    stroke={colors.success}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                        </motion.g>
                    </motion.g>
                </motion.g>

                <motion.g
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {/* Dynamic background glow with pulse */}
                    <motion.circle
                        cx="150"
                        cy="180"
                        r="35"
                        fill={`${colors.secondary}20`}
                        animate={{
                            scale: authenticated ? [1, 1.15, 1] : [1, 1.05, 1],
                            opacity: authenticated ? [0.3, 0.6, 0.3] : [0.2, 0.3, 0.2],
                            filter: authenticated ? ["blur(0px)", "blur(4px)", "blur(0px)"] : ["blur(0px)", "blur(2px)", "blur(0px)"],
                        }}
                        transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    />

                    <motion.circle
                        cx="150"
                        cy="180"
                        r="30"
                        fill={`${colors.secondary}30`}
                        animate={{
                            scale: authenticated ? [1, 1.1, 1] : 1,
                            filter: authenticated ? ["blur(0px)", "blur(2px)", "blur(0px)"] : "blur(0px)",
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeInOut",
                            repeat: authenticated ? Number.POSITIVE_INFINITY : 0,
                        }}
                    />

                    {authenticated && (
                        <>
                            <motion.ellipse
                                cx="145"
                                cy="175"
                                rx="20"
                                ry="15"
                                fill={`${colors.success}30`}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 0.7, 0],
                                    rx: [15, 20, 15],
                                    ry: [10, 15, 10],
                                    filter: ["blur(0px)", "blur(3px)", "blur(0px)"],
                                }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            />
                            <motion.path
                                d="M135 190L165 190"
                                stroke={`${colors.success}50`}
                                strokeWidth="10"
                                strokeLinecap="round"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 0.5, 0],
                                    pathLength: [0.5, 1, 0.5],
                                    strokeWidth: [8, 10, 8],
                                }}
                                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
                            />

                            {/* Success particles */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.circle
                                    key={`success-particle-${i}`}
                                    cx="150"
                                    cy="180"
                                    r={2 + (i % 3)}
                                    fill={colors.success}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 5)],
                                        y: [0, (i % 3 === 0 ? -1 : 1) * (5 + i * 3)],
                                        opacity: [0, 0.8, 0],
                                        scale: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 1 + (i % 3) * 0.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: i * 0.2,
                                        repeatDelay: i * 0.1,
                                    }}
                                />
                            ))}
                        </>
                    )}

                    {/* Lock shackle with spring animation */}
                    <motion.g
                        animate={{
                            y: authenticated ? -15 : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: authenticated ? 0 : 0.5,
                        }}
                    >
                        {/* Shackle shadow when lifted */}
                        {authenticated && (
                            <motion.path
                                d="M135 185C135 176.716 141.716 170 150 170C158.284 170 165 176.716 165 185V200H135V185Z"
                                fill="none"
                                stroke={`${colors.primary}40`}
                                strokeWidth="2"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 0.5, 0],
                                    y: [0, 5, 0],
                                    filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
                                }}
                                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
                            />
                        )}

                        <motion.path
                            d="M135 180C135 171.716 141.716 165 150 165C158.284 165 165 171.716 165 180V195H135V180Z"
                            fill={colors.secondary}
                            stroke={colors.primary}
                            strokeWidth="3"
                            animate={{
                                fill: authenticated ? [colors.secondary, colors.success, colors.secondary] : colors.secondary,
                                stroke: authenticated ? [colors.primary, colors.success, colors.primary] : colors.primary,
                                y: authenticated ? [0, -2, 0] : 0,
                            }}
                            transition={{
                                fill: { duration: 1, times: [0, 0.2, 1], repeat: authenticated ? Number.POSITIVE_INFINITY : 0 },
                                stroke: { duration: 1.5, repeat: authenticated ? Number.POSITIVE_INFINITY : 0 },
                                y: { duration: 1.2, repeat: authenticated ? Number.POSITIVE_INFINITY : 0 },
                            }}
                        />

                        {/* Shackle highlight */}
                        <motion.path
                            d="M138 175C138 173 143 168 150 168C157 168 162 173 162 175"
                            fill="none"
                            stroke={`${authenticated ? colors.success : colors.secondary}40`}
                            strokeWidth="1.5"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: authenticated ? [0, 0.8, 0] : [0, 0.4, 0],
                                pathLength: [0, 1, 0],
                            }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        />
                    </motion.g>

                    <motion.g>
                        {/* Lock body shadow for depth */}
                        <motion.rect
                            x="130"
                            y="195"
                            width="40"
                            height="35"
                            rx="8"
                            fill={`${colors.primary}30`}
                            animate={{
                                y: [195, 197, 195],
                                height: [35, 33, 35],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />

                        {/* Main lock body with animated gradient */}
                        <motion.rect
                            x="130"
                            y="195"
                            width="40"
                            height="35"
                            rx="6"
                            fill={colors.primary}
                            initial={{ height: 0 }}
                            animate={{
                                height: 35,
                                fill: authenticated
                                    ? [colors.primary, `${colors.success}90`, colors.primary]
                                    : [colors.primary, `${colors.primary}90`, colors.primary],
                                rx: authenticated ? [6, 8, 6] : 6,
                            }}
                            transition={{
                                height: { duration: 0.5, delay: 0.7 },
                                fill: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                                rx: { duration: 1.5, repeat: authenticated ? Number.POSITIVE_INFINITY : 0 },
                            }}
                        />

                        {/* Lock body highlight for 3D effect */}
                        <motion.path
                            d="M132 198C132 196.895 132.895 196 134 196H166C167.105 196 168 196.895 168 198V200H132V198Z"
                            fill={`${colors.primary}80`}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                y: authenticated ? [0, -1, 0] : 0,
                            }}
                            transition={{
                                opacity: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
                                y: { duration: 1, repeat: authenticated ? Number.POSITIVE_INFINITY : 0 },
                            }}
                        />
                    </motion.g>

                    <motion.g>
                        {/* Keyhole outer glow */}
                        <motion.circle
                            cx="150"
                            cy="212"
                            r="8"
                            fill={`${authenticated ? colors.success : colors.accent}20`}
                            animate={{
                                r: authenticated ? [8, 10, 8] : [8, 9, 8],
                                opacity: authenticated ? [0.2, 0.5, 0.2] : [0.2, 0.3, 0.2],
                                filter: authenticated
                                    ? ["blur(0px)", "blur(3px)", "blur(0px)"]
                                    : ["blur(0px)", "blur(1px)", "blur(0px)"],
                            }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        />

                        {/* Main keyhole */}
                        <motion.circle
                            cx="150"
                            cy="212"
                            r="6"
                            fill={authenticated ? colors.success : colors.accent}
                            initial={{ scale: 0 }}
                            animate={{
                                scale: 1,
                                fill: authenticated
                                    ? [colors.success, `${colors.success}80`, colors.success]
                                    : [colors.accent, `${colors.accent}80`, colors.accent],
                            }}
                            transition={{
                                scale: { duration: 0.5, delay: 0.9 },
                                fill: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
                            }}
                        />

                        {/* Keyhole inner highlight */}
                        {authenticated && (
                            <motion.circle
                                cx="150"
                                cy="212"
                                r="3"
                                fill={`${colors.bg}`}
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: [0, 1.5, 1],
                                    opacity: [0, 1, 0.8],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 1,
                                }}
                            />
                        )}

                        {/* Keyhole slot with rotation animation */}
                        <motion.path
                            d="M150 212L150 222"
                            stroke={authenticated ? colors.success : colors.accent}
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{
                                pathLength: authenticated ? 1 : 0,
                                rotate: authenticated ? [0, 90, 90] : 0,
                                y: authenticated ? [0, 2, 0] : 0,
                            }}
                            transition={{
                                pathLength: { duration: 0.3, delay: authenticated ? 0.2 : 0 },
                                rotate: {
                                    duration: 0.5,
                                    delay: authenticated ? 0.3 : 0,
                                    times: [0, 0.3, 1],
                                },
                                y: { duration: 1, repeat: authenticated ? Number.POSITIVE_INFINITY : 0 },
                            }}
                        />

                        {authenticated && (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.circle
                                        key={`ring-${i}`}
                                        cx="150"
                                        cy="212"
                                        r={6 + i * 5}
                                        fill="none"
                                        stroke={`${colors.success}${80 - i * 20}`}
                                        strokeWidth={i === 1 ? 2 : 1}
                                        strokeDasharray={i === 3 ? "2,2" : i === 4 ? "1,5" : "none"}
                                        initial={{ scale: 0.5, opacity: 0.8 }}
                                        animate={{
                                            scale: 1.5,
                                            opacity: 0,
                                            strokeDashoffset: i % 2 === 0 ? [0, 20] : [0, -20],
                                        }}
                                        transition={{
                                            duration: 1.5 - i * 0.1,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: 0.15 * i,
                                            repeatDelay: 0.3,
                                            strokeDashoffset: {
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                                ease: "linear",
                                            },
                                        }}
                                    />
                                ))}

                                {/* Dynamic success sparkles with varying angles and sizes */}
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <motion.path
                                        key={`sparkle-${i}`}
                                        d={`M${150 + Math.sin(i * 0.5 * Math.PI) * 20} ${212 + Math.cos(i * 0.5 * Math.PI) * 20} L${150 + Math.sin(i * 0.5 * Math.PI) * 25} ${212 + Math.cos(i * 0.5 * Math.PI) * 25}`}
                                        stroke={i % 2 === 0 ? colors.success : `${colors.success}80`}
                                        strokeWidth={i % 3 === 0 ? 3 : 2}
                                        strokeLinecap="round"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            opacity: [0, 1, 0],
                                            pathLength: [0, 1, 0.8],
                                            rotate: i % 2 === 0 ? [0, 15, 0] : [0, -15, 0],
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.2 + i * 0.1,
                                            repeat: Number.POSITIVE_INFINITY,
                                            repeatDelay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    </motion.g>
                </motion.g>

                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    {/* Background glow with pulse */}
                    <motion.circle
                        cx="150"
                        cy="350"
                        r="50"
                        fill={`${colors.accent}10`}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            opacity: [0.1, 0.3, 0.1],
                            filter: ["blur(0px)", "blur(5px)", "blur(0px)"],
                        }}
                        transition={{
                            scale: { duration: 0.8, delay: 1.1 },
                            opacity: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                            filter: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                        }}
                    />

                    {/* Secondary pulse ring */}
                    <motion.circle
                        cx="150"
                        cy="350"
                        r="45"
                        fill="none"
                        stroke={`${colors.accent}20`}
                        strokeWidth="1"
                        strokeDasharray="3,3"
                        initial={{ scale: 0.9 }}
                        animate={{
                            scale: [0.9, 1.1, 0.9],
                            opacity: [0.2, 0.4, 0.2],
                            strokeDashoffset: [0, 30],
                        }}
                        transition={{
                            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                            opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                            strokeDashoffset: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        }}
                    />

                    {/* Fingerprint with fade-in and subtle movement */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            y: [0, -2, 0],
                            scale: [1, 1.02, 1],
                        }}
                        transition={{
                            opacity: { delay: 1.3, duration: 0.8 },
                            y: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                        }}
                    >
                        <Fingerprint
                            className="text-black/50 dark:text-white"
                            x="125"
                            y="325"
                            width="50"
                            height="50"
                            strokeWidth={1.5}
                        />
                    </motion.g>

                    <motion.g>
                        {/* Main scan line */}
                        <motion.rect
                            x="100"
                            y="350"
                            width="100"
                            height="3"
                            fill={`${colors.accent}80`}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                y: [330, 330, 370, 370],
                                height: [2, 3, 3, 2],
                                filter: ["blur(0px)", "blur(1px)", "blur(1px)", "blur(0px)"],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 1,
                            }}
                        />

                        {/* Secondary scan lines */}
                        <motion.rect
                            x="105"
                            y="350"
                            width="90"
                            height="1"
                            fill={`${colors.accent}60`}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 0.7, 0.7, 0],
                                y: [335, 335, 365, 365],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 1,
                                delay: 0.1,
                            }}
                        />

                        <motion.rect
                            x="110"
                            y="350"
                            width="80"
                            height="1"
                            fill={`${colors.accent}40`}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 0.5, 0.5, 0],
                                y: [325, 325, 375, 375],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 1,
                                delay: 0.2,
                            }}
                        />

                        {/* Scan particles */}
                        {[1, 2, 3, 4].map((i) => (
                            <motion.circle
                                key={`scan-particle-${i}`}
                                cx={150 + (i % 2 === 0 ? -1 : 1) * (10 + i * 5)}
                                cy="350"
                                r={1 + (i % 2)}
                                fill={colors.accent}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 0.8, 0],
                                    y: [0, i % 2 === 0 ? 15 : -15],
                                    x: [0, i % 3 === 0 ? 5 : -5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 1,
                                    delay: 0.5 + i * 0.2,
                                }}
                            />
                        ))}
                    </motion.g>

                    {/* Scan completion effect */}
                    <motion.path
                        d="M120 370L140 390L180 350"
                        stroke={colors.success}
                        strokeWidth="0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{
                            pathLength: [0, 0, 1, 1],
                            opacity: [0, 0, 1, 0],
                            strokeWidth: [0, 0, 3, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: 0,
                            times: [0, 0.6, 0.8, 1],
                        }}
                    />
                </motion.g>

                <motion.g>
                    {/* Background data flow */}
                    <motion.rect
                        x="60"
                        y="430"
                        width="180"
                        height="40"
                        rx="5"
                        fill={`${colors.primary}05`}
                        animate={{
                            opacity: [0.05, 0.1, 0.05],
                            filter: ["blur(0px)", "blur(3px)", "blur(0px)"],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    />

                    {/* Data stream lines */}
                    {[1, 2, 3].map((i) => (
                        <motion.path
                            key={`data-stream-${i}`}
                            d={`M60 ${440 + i * 10} H240`}
                            stroke={`${i === 1 ? colors.primary : i === 2 ? colors.secondary : colors.accent}20`}
                            strokeWidth="1"
                            strokeDasharray={i === 1 ? "5,10" : i === 2 ? "10,5" : "2,4,8,4"}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0.2, 0.5, 0.2],
                                strokeDashoffset: i % 2 === 0 ? [0, 50] : [0, -50],
                            }}
                            transition={{
                                opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                                strokeDashoffset: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                            }}
                        />
                    ))}

                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.g
                            key={`binary-group-${i}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                x: [0, i % 2 === 0 ? 5 : -5, 0],
                            }}
                            transition={{
                                delay: 1.5 + i * 0.1,
                                x: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                            }}
                        >
                            <motion.text
                                x={60 + i * 35}
                                y={450}
                                fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent}
                                fontFamily="monospace"
                                fontSize="16"
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                    y: [450, 448, 450],
                                    filter: i % 2 === 0 ? ["blur(0px)", "blur(0.5px)", "blur(0px)"] : ["blur(0px)"],
                                }}
                                transition={{
                                    opacity: {
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "reverse",
                                        delay: i * 0.3,
                                    },
                                    y: {
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: i * 0.2,
                                    },
                                    filter: {
                                        duration: 1.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                    },
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.tspan
                                        key={`binary-text-${Date.now()}-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {Array.from({ length: 8 }, () => Math.round(Math.random())).join("")}
                                    </motion.tspan>
                                </AnimatePresence>
                            </motion.text>

                            {/* Highlight glow for binary text */}
                            {i % 2 === 0 && (
                                <motion.rect
                                    x={58 + i * 35}
                                    y={440}
                                    width="30"
                                    height="16"
                                    rx="3"
                                    fill={`${i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent}10`}
                                    animate={{
                                        opacity: [0, 0.3, 0],
                                        scale: [0.9, 1.1, 0.9],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: i * 0.5,
                                    }}
                                />
                            )}
                        </motion.g>
                    ))}

                    {[1, 2, 3].map((i) => (
                        <motion.g key={`pulse-group-${i}`}>
                            <motion.circle
                                cx={70 + i * 70}
                                cy={420}
                                r={3}
                                fill={i === 1 ? colors.accent : i === 2 ? colors.primary : colors.secondary}
                                animate={{
                                    r: [3, 15, 3],
                                    opacity: [0.7, 0, 0.7],
                                    filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 1.2,
                                    repeatDelay: 1,
                                }}
                            />

                            {/* Trailing particles */}
                            {[1, 2, 3].map((j) => (
                                <motion.circle
                                    key={`pulse-trail-${i}-${j}`}
                                    cx={70 + i * 70}
                                    cy={420}
                                    r={2}
                                    fill={i === 1 ? colors.accent : i === 2 ? colors.primary : colors.secondary}
                                    animate={{
                                        x: [0, j * (i % 2 === 0 ? 10 : -10)],
                                        y: [0, j * (i % 3 === 0 ? -5 : 5)],
                                        opacity: [0.7, 0],
                                        scale: [1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: i * 1.2 + j * 0.2,
                                        repeatDelay: 3,
                                    }}
                                />
                            ))}
                        </motion.g>
                    ))}
                </motion.g>

                {/* Data connection lines between elements */}
                <motion.g>
                    {/* Connection between shield and lock */}
                    <motion.path
                        d="M150 270C150 270 150 280 150 290"
                        stroke={`${colors.secondary}40`}
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        initial={{ pathLength: 0 }}
                        animate={{
                            pathLength: 1,
                            strokeDashoffset: [0, -20],
                        }}
                        transition={{
                            pathLength: { duration: 1, delay: 1.2 },
                            strokeDashoffset: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        }}
                    />

                    {/* Connection between lock and fingerprint */}
                    <motion.path
                        d="M150 230C150 230 150 250 150 270"
                        stroke={`${colors.accent}30`}
                        strokeWidth="1.5"
                        strokeDasharray="3,6"
                        initial={{ pathLength: 0 }}
                        animate={{
                            pathLength: 1,
                            strokeDashoffset: [0, 30],
                        }}
                        transition={{
                            pathLength: { duration: 1, delay: 1.5 },
                            strokeDashoffset: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        }}
                    />

                    {/* Connection between fingerprint and data */}
                    <motion.path
                        d="M150 400C150 400 150 410 150 420"
                        stroke={`${colors.primary}30`}
                        strokeWidth="1.5"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{
                            pathLength: 1,
                            strokeDashoffset: [0, -20],
                        }}
                        transition={{
                            pathLength: { duration: 1, delay: 1.8 },
                            strokeDashoffset: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        }}
                    />

                    {/* Data packets traveling along connections */}
                    {[1, 2, 3].map((i) => (
                        <motion.g key={`data-packet-${i}`}>
                            <motion.circle
                                cx="150"
                                cy="300"
                                r="3"
                                fill={i === 1 ? colors.secondary : i === 2 ? colors.accent : colors.primary}
                                animate={{
                                    y: [300, 400],
                                    opacity: [0, 1, 1, 0],
                                    scale: [0.5, 1, 1, 0.5],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 2,
                                    times: [0, 0.1, 0.9, 1],
                                }}
                            />

                            <motion.circle
                                cx="150"
                                cy="250"
                                r="2"
                                fill={i === 1 ? colors.accent : i === 2 ? colors.primary : colors.secondary}
                                animate={{
                                    y: [250, 300],
                                    opacity: [0, 1, 1, 0],
                                    scale: [0.5, 1, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 1.5 + 1,
                                    times: [0, 0.1, 0.9, 1],
                                }}
                            />
                        </motion.g>
                    ))}
                </motion.g>
            </svg>
        </div>
    )
}

export function RightIllustration() {
    const colors = useThemeColors()
    const [showPassword, setShowPassword] = useState(false)
    const [securityCheck, setSecurityCheck] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setShowPassword((prev) => !prev)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setSecurityCheck((prev) => (prev + 1) % 4)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    if (!colors) return null

    return (
        <div className="w-full h-full">
            <svg viewBox="0 0 300 500" className="w-full h-full">
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke={`${colors.primary}10`}
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="300" height="500" fill="url(#grid)" />

                {/* Floating particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.circle
                        key={`particle-${i}`}
                        cx={50 + Math.random() * 200}
                        cy={50 + Math.random() * 400}
                        r={1 + Math.random() * 3}
                        fill={
                            i % 3 === 0
                                ? `${colors.primary}80`
                                : i % 3 === 1
                                    ? `${colors.secondary}80`
                                    : `${colors.accent}80`
                        }
                        animate={{
                            y: [0, -10, 0, 10, 0],
                            x: [0, 5, 0, -5, 0],
                            opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                            duration: 4 + i % 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                    />
                ))}

                {/* Key */}
                <motion.g
                    initial={{ opacity: 0, rotate: -45, x: -30 }}
                    animate={{ opacity: 1, rotate: 0, x: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: 0.3,
                    }}
                >
                    <motion.circle
                        cx="150"
                        cy="100"
                        r="40"
                        fill={`${colors.warning}20`}
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(0, 0, 0, 0)",
                                "0 0 15px rgba(0, 0, 0, 0.3)",
                                "0 0 0px rgba(0, 0, 0, 0)",
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    />

                    <motion.g
                        animate={{
                            rotate: securityCheck === 1 ? [0, 360] : 0,
                        }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                        }}
                    >
                        <Key className="text-warning" x="125" y="75" width="50" height="50" strokeWidth={1.5} />
                    </motion.g>

                    {/* Key sparkles */}
                    {[1, 2, 3].map((i) => (
                        <motion.path
                            key={`sparkle-${i}`}
                            d={`M${150 + (i - 2) * 15} ${80 - i * 5} L${150 + (i - 2) * 15} ${70 - i * 5}`}
                            stroke={`${colors.warning}`}
                            strokeWidth="2"
                            strokeLinecap="round"
                            animate={{
                                opacity: securityCheck === 1 ? [0, 1, 0] : 0,
                                scale: securityCheck === 1 ? [0.5, 1.2, 0.5] : 0.5,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.2,
                                repeat: securityCheck === 1 ? 2 : 0,
                            }}
                        />
                    ))}
                </motion.g>

                {/* Server/Database */}
                <motion.g
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <motion.circle
                        cx="150"
                        cy="220"
                        r="40"
                        fill={`${colors.primary}10`}
                        animate={{
                            scale: securityCheck === 2 ? [1, 1.05, 1] : 1,
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: securityCheck === 2 ? 3 : 0,
                            repeatDelay: 0.1,
                        }}
                    />

                    <motion.g
                        animate={{
                            y: [0, -5, 0],
                            rotateY: securityCheck === 2 ? [0, 180, 360] : 0,
                        }}
                        transition={{
                            y: {
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 3,
                                repeatType: "reverse",
                            },
                            rotateY: {
                                duration: 1.5,
                                ease: "easeInOut",
                            }
                        }}
                    >
                        <Database className="text-primary" x="125" y="195" width="50" height="50" strokeWidth={1.5} />
                    </motion.g>

                    <motion.path
                        d="M110 220C110 220 130 210 150 220C170 230 190 220 190 220"
                        stroke={colors.accent}
                        strokeWidth={securityCheck === 2 ? "3" : "2"}
                        strokeDasharray="5,3"
                        fill="none"
                        animate={{
                            pathLength: [0, 1, 1],
                            opacity: securityCheck === 2 ? [0.3, 1, 0.3] : [0, 1, 0],
                            strokeWidth: securityCheck === 2 ? [2, 3, 2] : 2,
                        }}
                        transition={{
                            duration: securityCheck === 2 ? 1 : 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: securityCheck === 2 ? 0 : 1,
                        }}
                    />

                    {/* Data packets */}
                    {securityCheck === 2 && Array.from({ length: 3 }).map((_, i) => (
                        <motion.rect
                            key={`packet-${i}`}
                            x="150"
                            y="220"
                            width="6"
                            height="6"
                            fill={colors.accent}
                            initial={{ x: 110 }}
                            animate={{ x: 190 }}
                            transition={{
                                duration: 1,
                                delay: i * 0.3,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        />
                    ))}
                </motion.g>

                {/* Password visibility toggle */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                    <motion.circle
                        cx="150"
                        cy="350"
                        r="40"
                        fill={`${colors.secondary}20`}
                        animate={{
                            scale: securityCheck === 3 ? [1, 1.1, 1] : 1,
                            filter: securityCheck === 3 ? ["blur(0px)", "blur(1px)", "blur(0px)"] : "blur(0px)",
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: securityCheck === 3 ? 2 : 0,
                        }}
                    />

                    <AnimatePresence mode="wait">
                        {showPassword ? (
                            <motion.g
                                key="eye-open"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Eye
                                    className="text-black/50 dark:text-white/50"
                                    x="125"
                                    y="325"
                                    width="50"
                                    height="50"
                                    strokeWidth={1.5}
                                />
                            </motion.g>
                        ) : (
                            <motion.g
                                key="eye-closed"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <EyeOff
                                    className="text-black/50 dark:text-white/50"
                                    x="125"
                                    y="325"
                                    width="50"
                                    height="50"
                                    strokeWidth={1.5}
                                />
                            </motion.g>
                        )}
                    </AnimatePresence>

                    {/* Password dots/text */}
                    <motion.g>
                        {Array.from({ length: 6 }).map((_, i) =>
                            showPassword ? (
                                <motion.text
                                    key={`pwd-char-${i}`}
                                    x={130 + i * 15}
                                    y={380}
                                    fontFamily="monospace"
                                    fontSize="16"
                                    fill={securityCheck === 3 ? colors.accent : colors.text}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                                </motion.text>
                            ) : (
                                <motion.circle
                                    key={`pwd-dot-${i}`}
                                    cx={130 + i * 15}
                                    cy={375}
                                    r={4}
                                    fill={securityCheck === 3 ? colors.accent : colors.text}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scale: securityCheck === 3 && showPassword ? [1, 1.5, 1] : 1,
                                    }}
                                    transition={{
                                        delay: 0.1 * i,
                                        scale: { duration: 0.3 }
                                    }}
                                />
                            ),
                        )}
                    </motion.g>

                    {/* Typing cursor */}
                    {securityCheck === 3 && (
                        <motion.rect
                            x={130 + 6 * 15 + 5}
                            y={368}
                            width="2"
                            height="16"
                            fill={colors.accent}
                            animate={{ opacity: [0, 1, 1, 0] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                times: [0, 0.2, 0.8, 1],
                            }}
                        />
                    )}
                </motion.g>

                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                    {/* Background glow effect */}
                    <motion.circle
                        cx="150"
                        cy="450"
                        r="35"
                        fill={`${colors.success}20`}
                        animate={{
                            r: [35, 40, 35],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <motion.circle cx="150" cy="450" r="30" fill={`${colors.success}30`} />

                    {/* Dynamic wifi waves */}
                    {[1, 2, 3].map((i) => (
                        <motion.path
                            key={`wifi-wave-${i}`}
                            d={`M${150 - i * 12} ${455 - i * 5} Q 150 ${440 - i * 7} ${150 + i * 12} ${455 - i * 5}`}
                            fill="none"
                            stroke={colors.success}
                            strokeWidth={securityCheck === 0 ? 3 : 2}
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: 1,
                                opacity: securityCheck === 0 ? [0.7, 1, 0.7] : 0.7,
                                y: securityCheck === 0 ? [0, -2, 0] : 0
                            }}
                            transition={{
                                pathLength: { delay: 1.2 + i * 0.2, duration: 0.8 },
                                opacity: { duration: 1.5, repeat: securityCheck === 0 ? Infinity : 0 },
                                y: { duration: 0.8, repeat: securityCheck === 0 ? Infinity : 0 }
                            }}
                        />
                    ))}

                    {/* Data packets traveling along wifi waves */}
                    {securityCheck === 0 && [1, 2].map((i) => (
                        <motion.circle
                            key={`data-packet-${i}`}
                            cx="150"
                            cy="450"
                            r="4"
                            fill={i % 2 === 0 ? colors.accent : colors.secondary}
                            filter="drop-shadow(0 0 2px rgba(255,255,255,0.5))"
                            initial={{ pathOffset: 0 }}
                            animate={{ pathOffset: 1 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 1,
                                ease: "easeInOut"
                            }}
                            style={{
                                offsetPath: `path('M${140} ${455} Q 150 ${435} ${160} ${455} Q 150 ${470} ${140} ${455}')`
                            }}
                        />
                    ))}

                    <motion.g
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }}
                    >
                        <Wifi
                            className="text-success"
                            x="130"
                            y="430"
                            width="40"
                            height="40"
                            strokeWidth={1.5}
                        />
                    </motion.g>

                    {/* Security shield indicator that appears when active */}
                    {securityCheck === 0 && (
                        <motion.path
                            d="M150 435L157 440V452C157 456 153 459 150 460C147 459 143 456 143 452V440L150 435Z"
                            fill="none"
                            stroke={colors.success}
                            strokeWidth="1"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    )}

                    {/* Connection status text indicator */}
                    <motion.text
                        x="150"
                        y="475"
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="monospace"
                        fill={colors.success}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: securityCheck === 0 ? [0.7, 1, 0.7] : 0.7
                        }}
                        transition={{
                            opacity: {
                                duration: 1.5,
                                repeat: securityCheck === 0 ? Infinity : 0
                            }
                        }}
                    >
                        SECURE
                    </motion.text>
                </motion.g>
            </svg>
        </div>
    )
}