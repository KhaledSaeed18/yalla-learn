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
                    {/* Main shield */}
                    <motion.path
                        d="M150 50L230 100V220C230 270 195 310 150 325C105 310 70 270 70 220V100L150 50Z"
                        fill={`${colors.primary}20`}
                        stroke={colors.primary}
                        strokeWidth="4"
                        animate={{
                            stroke: [colors.primary, colors.secondary, colors.primary],
                        }}
                        transition={{
                            stroke: { duration: 8, repeat: Number.POSITIVE_INFINITY },
                        }}
                    />

                    {/* Security level indicator */}
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
                    />

                    {/* Security level icon */}
                    <motion.g>
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

                {/* Lock and Authentication */}
                <motion.g
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {/* Lock shackle with spring animation */}
                    <motion.g
                        animate={{
                            y: authenticated ? -15 : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                    >
                        <motion.path
                            d="M135 180C135 171.716 141.716 165 150 165C158.284 165 165 171.716 165 180V195H135V180Z"
                            fill={colors.secondary}
                            stroke={colors.primary}
                            strokeWidth="3"
                            animate={{
                                fill: authenticated ? colors.success : colors.secondary,
                            }}
                            transition={{
                                fill: { duration: 0.5 },
                            }}
                        />
                    </motion.g>

                    {/* Lock body */}
                    <motion.rect
                        x="130"
                        y="195"
                        width="40"
                        height="35"
                        rx="6"
                        fill={colors.primary}
                        animate={{
                            fill: authenticated ? colors.success : colors.primary,
                        }}
                        transition={{
                            fill: { duration: 0.5 },
                        }}
                    />

                    {/* Keyhole */}
                    <motion.circle
                        cx="150"
                        cy="212"
                        r="6"
                        fill={authenticated ? colors.success : colors.accent}
                    />

                    {/* Keyhole slot */}
                    <motion.path
                        d="M150 212L150 222"
                        stroke={authenticated ? colors.success : colors.accent}
                        strokeWidth="3"
                        strokeLinecap="round"
                        animate={{
                            rotate: authenticated ? 90 : 0,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                    />

                    {/* Success indicator */}
                    {authenticated && (
                        <motion.circle
                            cx="150"
                            cy="212"
                            r="12"
                            fill="none"
                            stroke={colors.success}
                            strokeWidth="2"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        />
                    )}
                </motion.g>

                {/* Connection between shield and lock */}
                <motion.path
                    d="M150 270C150 270 150 280 150 290"
                    stroke={`${colors.secondary}40`}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    animate={{
                        strokeDashoffset: [0, -20],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                />
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
            <svg viewBox="0 0 300 500" className="w-full h-full" style={{ willChange: 'transform' }}>
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