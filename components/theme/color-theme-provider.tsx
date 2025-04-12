"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

type ColorTheme = "blue" | "red" | "orange" | "rose" | "green" | "yellow"

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

    const themes: ColorTheme[] = ["blue", "red", "orange", "rose", "green", "yellow"]

    useEffect(() => {
        const savedTheme = localStorage.getItem("color-theme") as ColorTheme | null
        if (savedTheme && themes.includes(savedTheme)) {
            setTheme(savedTheme)
        }
        setMounted(true)
    }, []) 

    useEffect(() => {
        if (!mounted) return;

        document.documentElement.classList.remove(...themes)
        document.documentElement.classList.add(theme)
        localStorage.setItem("color-theme", theme)
    }, [theme, mounted]) 

    const setThemeCallback = useCallback((newTheme: ColorTheme) => {
        setTheme(newTheme)
    }, []);

    const value = {
        theme,
        setTheme: setThemeCallback,
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