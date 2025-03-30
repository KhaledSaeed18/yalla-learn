"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Fingerprint, Key, Wifi, Database, Eye, EyeOff } from "lucide-react"

// Common hook for theme colors
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

// Left side illustration component
export function LeftIllustration() {
    const colors = useThemeColors()
    const [authenticated, setAuthenticated] = useState(false)
    const [securityLevel, setSecurityLevel] = useState(0)

    // Handle authentication cycle
    useEffect(() => {
        const interval = setInterval(() => {
            setAuthenticated((prev) => !prev)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    // Security level animation
    useEffect(() => {
        const interval = setInterval(() => {
            setSecurityLevel(prev => (prev + 1) % 3)
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
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Shield with lock */}
                <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Increase the number of elements and make them more visible */}
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => {
                        const radius = 70 + (i * 18); // Wider spread of elements
                        const offsetAngle = i * 51.43; // More distributed angles (360/7)
                        const duration = 8 + (i % 4) * 5; // Faster movement
                        const size = 3 + (i % 4) * 3; // Larger elements
                        const delay = i * 0.3;

                        return (
                            <motion.g key={`orbiting-element-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay }}>
                                {/* Show more orbit paths for visual interest */}
                                {(i === 1 || i === 4) && (
                                    <motion.circle
                                        cx="150"
                                        cy="150"
                                        r={radius}
                                        fill="none"
                                        stroke={`${i === 1 ? colors.primary : colors.secondary}20`} // More visible orbit paths
                                        strokeDasharray={i === 1 ? "2,8" : "5,5"}
                                        animate={{ rotate: [0, i === 1 ? 360 : -360] }}
                                        transition={{ duration: i === 1 ? 60 : 80, repeat: Infinity, ease: "linear" }}
                                    />
                                )}

                                <motion.g
                                    animate={{
                                        x: [
                                            Math.cos((offsetAngle * Math.PI) / 180) * radius,
                                            Math.cos(((offsetAngle + 90) * Math.PI) / 180) * radius,
                                            Math.cos(((offsetAngle + 180) * Math.PI) / 180) * radius,
                                            Math.cos(((offsetAngle + 270) * Math.PI) / 180) * radius,
                                            Math.cos(((offsetAngle + 360) * Math.PI) / 180) * radius,
                                        ],
                                        y: [
                                            Math.sin((offsetAngle * Math.PI) / 180) * radius,
                                            Math.sin(((offsetAngle + 90) * Math.PI) / 180) * radius,
                                            Math.sin(((offsetAngle + 180) * Math.PI) / 180) * radius,
                                            Math.sin(((offsetAngle + 270) * Math.PI) / 180) * radius,
                                            Math.sin(((offsetAngle + 360) * Math.PI) / 180) * radius,
                                        ],
                                    }}
                                    transition={{ duration, repeat: Infinity, ease: "linear" }}
                                    style={{ x: 150, y: 150 }}
                                >
                                    {/* More varied and visually striking shapes */}
                                    {i % 4 === 0 ? (
                                        // Shield mini with glow
                                        <motion.g>
                                            <motion.circle
                                                r={size + 2}
                                                fill={`${colors.secondary}30`}
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            <motion.path
                                                d={`M0 -${size} L${size} ${size} L-${size} ${size}Z`}
                                                fill={`${colors.secondary}90`}
                                                animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                                                transition={{
                                                    rotate: { duration: 4, repeat: Infinity },
                                                    scale: { duration: 1.5, repeat: Infinity }
                                                }}
                                            />
                                        </motion.g>
                                    ) : i % 4 === 1 ? (
                                        // Lock mini with pulse
                                        <motion.g
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <motion.circle
                                                r={size * 1.2}
                                                fill={`${colors.accent}40`}
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                            <motion.circle r={size} fill={`${colors.accent}90`} />
                                            <motion.rect
                                                x={-size / 2}
                                                y={-size / 3}
                                                width={size}
                                                height={size}
                                                fill={`${colors.accent}90`}
                                                rx={size / 3}
                                            />
                                        </motion.g>
                                    ) : i % 4 === 2 ? (
                                        // Starburst pattern
                                        <motion.g animate={{ rotate: [0, 180, 360] }} transition={{ duration: 5, repeat: Infinity }}>
                                            {[0, 45, 90, 135].map((angle) => (
                                                <motion.line
                                                    key={`star-${i}-${angle}`}
                                                    x1={0}
                                                    y1={0}
                                                    x2={0}
                                                    y2={-size * 1.5}
                                                    stroke={colors.primary}
                                                    strokeWidth={1.5}
                                                    transform={`rotate(${angle})`}
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                            ))}
                                            <motion.circle
                                                r={size / 2}
                                                fill={colors.primary}
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </motion.g>
                                    ) : (
                                        // Data packet with glow
                                        <motion.g>
                                            <motion.circle
                                                r={size * 1.3}
                                                fill={`${colors.success}20`}
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                            <motion.rect
                                                x={-size / 2}
                                                y={-size / 2}
                                                width={size}
                                                height={size}
                                                rx={size / 4}
                                                fill={`${colors.success}90`}
                                                animate={{
                                                    rotate: [0, 90, 180, 270, 360],
                                                    scale: [1, 1.2, 1]
                                                }}
                                                transition={{
                                                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                                    scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                                                }}
                                            />
                                        </motion.g>
                                    )}

                                    {/* Trailing effect */}
                                    {[1, 2, 3].map((trail) => (
                                        <motion.circle
                                            key={`trail-${i}-${trail}`}
                                            r={size / 2}
                                            fill={`${i % 4 === 0 ? colors.secondary : i % 4 === 1 ? colors.accent : i % 4 === 2 ? colors.primary : colors.success}${50 - trail * 15}`}
                                            animate={{
                                                x: [0, trail * -12],
                                                y: [0, trail * 3],
                                                opacity: [0.8, 0],
                                                scale: [1, 0.4]
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                repeatDelay: 0.2,
                                                delay: trail * 0.15
                                            }}
                                        />
                                    ))}
                                </motion.g>
                            </motion.g>
                        );
                    })}

                    <motion.path
                        d="M150 50L230 100V220C230 270 195 310 150 325C105 310 70 270 70 220V100L150 50Z"
                        fill={`${colors.primary}20`}
                        stroke={colors.primary}
                        strokeWidth="4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5 }}
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
                        stroke={
                            securityLevel === 0
                                ? colors.warning
                                : securityLevel === 1
                                    ? colors.secondary
                                    : colors.success
                        }
                        strokeWidth="3"
                        animate={{
                            scale: [1, 1.03, 1],
                        }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    />
                </motion.g>

                {/* Enhanced Lock with animated shackle */}
                <motion.g
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {/* Background glow */}
                    <motion.circle
                        cx="150"
                        cy="180"
                        r="35"
                        fill={`${colors.secondary}20`}
                        animate={{
                            scale: authenticated ? [1, 1.15, 1] : 1,
                            opacity: authenticated ? [0.3, 0.6, 0.3] : 0.3,
                            filter: authenticated ? ["blur(0px)", "blur(4px)", "blur(0px)"] : "blur(0px)"
                        }}
                        transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            repeat: authenticated ? 1 : 0,
                        }}
                    />

                    <motion.circle
                        cx="150"
                        cy="180"
                        r="30"
                        fill={`${colors.secondary}30`}
                        animate={{
                            scale: authenticated ? [1, 1.1, 1] : 1,
                            filter: authenticated ? ["blur(0px)", "blur(2px)", "blur(0px)"] : "blur(0px)"
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Dynamic lighting effect only when authenticated */}
                    {authenticated && (
                        <>
                            <motion.ellipse
                                cx="145"
                                cy="175"
                                rx="20"
                                ry="15"
                                fill={`${colors.success}30`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.7, 0] }}
                                transition={{ duration: 1.5, delay: 0.2 }}
                            />
                            <motion.path
                                d="M135 190L165 190"
                                stroke={`${colors.success}50`}
                                strokeWidth="10"
                                strokeLinecap="round"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            />
                        </>
                    )}

                    {/* Lock shackle with improved animation */}
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
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 0.8 }}
                            />
                        )}

                        <motion.path
                            d="M135 180C135 171.716 141.716 165 150 165C158.284 165 165 171.716 165 180V195H135V180Z"
                            fill={colors.secondary}
                            stroke={colors.primary}
                            strokeWidth="3"
                            animate={{
                                fill: authenticated ? [colors.secondary, colors.success, colors.secondary] : colors.secondary
                            }}
                            transition={{
                                fill: { duration: 1, times: [0, 0.2, 1] }
                            }}
                        />
                    </motion.g>

                    {/* Enhanced lock body with 3D effect */}
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
                            fill: authenticated ? [colors.primary, `${colors.success}90`, colors.primary] : colors.primary
                        }}
                        transition={{
                            height: { duration: 0.5, delay: 0.7 },
                            fill: { duration: 0.8, delay: authenticated ? 0.2 : 0 }
                        }}
                    />

                    {/* Lock body shadow for 3D effect */}
                    <motion.rect
                        x="130"
                        y="195"
                        width="40"
                        height="5"
                        rx="2"
                        fill={`${colors.primary}80`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    />

                    {/* Enhanced keyhole with glow effect */}
                    <motion.circle
                        cx="150"
                        cy="212"
                        r="6"
                        fill={colors.accent}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            fill: authenticated ? colors.success : colors.accent
                        }}
                        transition={{ delay: 0.9 }}
                    />

                    {authenticated && (
                        <motion.circle
                            cx="150"
                            cy="212"
                            r="3"
                            fill={`${colors.bg}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.5, 1] }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                        />
                    )}

                    <motion.path
                        d="M150 212L150 222"
                        stroke={authenticated ? colors.success : colors.accent}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{
                            pathLength: authenticated ? 1 : 0,
                            rotate: authenticated ? 90 : 0,
                        }}
                        transition={{
                            duration: 0.3,
                            delay: authenticated ? 0.2 : 0,
                        }}
                    />

                    {/* Enhanced success indicator rings */}
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
                                    strokeDasharray={i === 3 ? "2,2" : "none"}
                                    initial={{ scale: 0.5, opacity: 0.8 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: 0.15 * i,
                                        repeatDelay: 0.3,
                                    }}
                                />
                            ))}

                            {/* Success sparkles */}
                            {[1, 2, 3, 4].map((i) => (
                                <motion.path
                                    key={`sparkle-${i}`}
                                    d={`M${150 + Math.sin(i * 0.5 * Math.PI) * 20} ${212 + Math.cos(i * 0.5 * Math.PI) * 20} L${150 + Math.sin(i * 0.5 * Math.PI) * 25} ${212 + Math.cos(i * 0.5 * Math.PI) * 25}`}
                                    stroke={colors.success}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                        pathLength: [0, 1, 0.8]
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.2 + i * 0.1,
                                    }}
                                />
                            ))}
                        </>
                    )}
                </motion.g>

                {/* Fingerprint */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <motion.circle
                        cx="150"
                        cy="350"
                        r="50"
                        fill={`${colors.accent}10`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    />

                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                        <Fingerprint className="text-black/50 dark:text-white" x="125" y="325" width="50" height="50" strokeWidth={1.5} />
                    </motion.g>

                    {/* Scanning effect */}
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
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                        }}
                    />
                </motion.g>

                {/* Binary data streams */}
                <motion.g>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.text
                            key={`binary-${i}`}
                            x={60 + i * 35}
                            y={450}
                            fill={
                                i % 3 === 0
                                    ? colors.primary
                                    : i % 3 === 1
                                        ? colors.secondary
                                        : colors.accent
                            }
                            fontFamily="monospace"
                            fontSize="16"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{
                                opacity: [0.5, 1, 0.5],
                                y: 0,
                            }}
                            transition={{
                                delay: 1.5 + i * 0.1,
                                opacity: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: i * 0.3
                                }
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
                    ))}
                </motion.g>

                {[1, 2, 3].map((i) => (
                    <motion.circle
                        key={`pulse-${i}`}
                        cx={70 + i * 70}
                        cy={420}
                        r={3}
                        fill={i === 1 ? colors.accent : i === 2 ? colors.primary : colors.secondary}
                        animate={{
                            r: [3, 15, 3],
                            opacity: [0.7, 0, 0.7],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 1.2,
                            repeatDelay: 1,
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}

// Right side illustration component
export function RightIllustration() {
    const colors = useThemeColors()
    const [showPassword, setShowPassword] = useState(false)
    const [securityCheck, setSecurityCheck] = useState(0)

    // Handle password visibility cycle
    useEffect(() => {
        const interval = setInterval(() => {
            setShowPassword((prev) => !prev)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    // Security check cycle
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

                    {/* Enhanced data transfer */}
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

                {/* Enhanced Network Connection Visualization */}
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
                            // Use SVG path as motion path
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

