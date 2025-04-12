"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ColorTheme = "blue" | "red"

interface ColorThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: ColorTheme
}

interface ColorThemeContextType {
    theme: ColorTheme
    setTheme: (theme: ColorTheme) => void
    themes: ColorTheme[]
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined)

export function ColorThemeProvider({
    children,
    defaultTheme = "blue",
}: ColorThemeProviderProps) {
    const [theme, setTheme] = useState<ColorTheme>(defaultTheme)
    const [mounted, setMounted] = useState(false)

    // Available themes
    const themes: ColorTheme[] = ["blue", "red"]

    // Handle initial client-side setup
    useEffect(() => {
        const savedTheme = localStorage.getItem("color-theme") as ColorTheme | null
        if (savedTheme && themes.includes(savedTheme)) {
            setTheme(savedTheme)
        }
        setMounted(true)
    }, []) // No dependencies here to run only once

    // Handle theme changes separately to avoid infinite loops
    useEffect(() => {
        if (!mounted) return;

        // Update the DOM and localStorage when theme changes
        document.documentElement.classList.remove(...themes)
        document.documentElement.classList.add(theme)
        localStorage.setItem("color-theme", theme)
    }, [theme, mounted]) // Only depends on theme and mounted state

    const value = {
        theme,
        setTheme,
        themes,
    }

    return (
        <ColorThemeContext.Provider value={value}>
            {children}
        </ColorThemeContext.Provider>
    )
}

export const useColorTheme = (): ColorThemeContextType => {
    const context = useContext(ColorThemeContext)

    if (context === undefined) {
        throw new Error("useColorTheme must be used within a ColorThemeProvider")
    }

    return context
}