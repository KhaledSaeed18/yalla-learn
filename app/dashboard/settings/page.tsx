"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useColorTheme } from "@/components/theme/color-theme-provider"
import { useFontSize } from "@/components/theme/font-size-provider"
import { Moon, Sun, Laptop, Check, Type } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export default function SettingsPage() {
    return (
        <main>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="grid gap-8">
                <AppearanceSettings />
            </div>
        </main>
    )
}

function AppearanceSettings() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const tabMap = {
        "mode": "mode",
        "color": "color",
        "font-size": "fontsize"
    }

    const currentTab = searchParams.get("tab") || "mode"
    const activeTab = tabMap[currentTab as keyof typeof tabMap] || "mode"

    const handleTabChange = (value: string) => {
        const urlValue = Object.entries(tabMap).find(([key, val]) => val === value)?.[0] || "mode"
        const params = new URLSearchParams(searchParams)
        params.set("tab", urlValue)
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                    Customize how the application looks and feels
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="mode">Mode</TabsTrigger>
                        <TabsTrigger value="color">Color</TabsTrigger>
                        <TabsTrigger value="fontsize">Font Size</TabsTrigger>
                    </TabsList>
                    <TabsContent value="mode">
                        <ThemeModeSelector />
                    </TabsContent>
                    <TabsContent value="color">
                        <ThemeColorSelector />
                    </TabsContent>
                    <TabsContent value="fontsize">
                        <FontSizeSelector />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

function ThemeModeSelector() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const modes = [
        { id: "light", label: "Light", icon: Sun },
        { id: "dark", label: "Dark", icon: Moon },
        { id: "system", label: "System", icon: Laptop }
    ]

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose theme mode</h3>
            <div className="grid gap-4 sm:grid-cols-3">
                {modes.map((mode) => {
                    const Icon = mode.icon
                    const isActive = theme === mode.id

                    return (
                        <button
                            key={mode.id}
                            className={`
                                relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all
                                ${isActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/30 hover:bg-primary/5'}
                            `}
                            onClick={() => setTheme(mode.id)}
                        >
                            <div className={`rounded-full p-3 ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                                <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                            </div>
                            <span className="text-sm font-medium">{mode.label}</span>
                            {isActive && (
                                <div className="absolute right-2 top-2 text-primary">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function ThemeColorSelector() {
    const { theme, setTheme, themes } = useColorTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    function getColorForTheme(colorTheme: string): string {
        switch (colorTheme) {
            case "blue":
                return "bg-[oklch(0.623_0.214_259.815)]"
            case "red":
                return "bg-[oklch(0.637_0.237_25.331)]"
            case "orange":
                return "bg-[oklch(0.705_0.213_47.604)]"
            case "rose":
                return "bg-[oklch(0.645_0.246_16.439)]"
            case "green":
                return "bg-[oklch(0.723_0.219_149.579)]"
            case "yellow":
                return "bg-[oklch(0.795_0.184_86.047)]"
            default:
                return "bg-[oklch(0.623_0.214_259.815)]"
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose accent color</h3>
            <div className="grid gap-4 sm:grid-cols-3">
                {themes.map((colorTheme) => {
                    const isActive = theme === colorTheme
                    const colorClass = getColorForTheme(colorTheme)

                    return (
                        <button
                            key={colorTheme}
                            className={`
                                relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all
                                ${isActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/30 hover:bg-primary/5'}
                            `}
                            onClick={() => setTheme(colorTheme)}
                        >
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted">
                                <motion.div
                                    className={`h-8 w-8 rounded-full ${colorClass} shadow-md`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                />
                            </div>
                            <span className="text-sm font-medium capitalize">{colorTheme}</span>
                            {isActive && (
                                <div className="absolute right-2 top-2 text-primary">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function FontSizeSelector() {
    const { fontSize, setFontSize, fontSizes } = useFontSize()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const sizes = [
        { id: "small", label: "Small", textClass: "text-xs" },
        { id: "medium", label: "Medium", textClass: "text-sm" },
        { id: "large", label: "Large", textClass: "text-base" }
    ]

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose font size</h3>
            <div className="grid gap-4 sm:grid-cols-3">
                {sizes.map((size) => {
                    const isActive = fontSize === size.id

                    return (
                        <button
                            key={size.id}
                            className={`
                                relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all
                                ${isActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/30 hover:bg-primary/5'}
                            `}
                            onClick={() => setFontSize(size.id as any)}
                        >
                            <div className={`flex items-center justify-center h-12 w-12 rounded-full ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                                <Type className={`h-6 w-6 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`${size.textClass} font-medium`}>A</span>
                                <span className="text-sm font-medium mt-1">{size.label}</span>
                            </div>
                            {isActive && (
                                <div className="absolute right-2 top-2 text-primary">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm mb-2">Preview:</p>
                <h4 className="text-xl font-medium mb-2">This is a heading</h4>
                <p>This is how text will appear throughout the application with your selected font size.</p>
            </div>
        </div>
    )
}