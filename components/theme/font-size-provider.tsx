"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

type FontSize = "small" | "medium" | "large"

interface FontSizeProviderProps {
    children: React.ReactNode
    defaultSize?: FontSize
}

interface FontSizeContextType {
    fontSize: FontSize
    setFontSize: (size: FontSize) => void
    fontSizes: FontSize[]
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

export function FontSizeProvider({
    children,
    defaultSize = "medium",
}: FontSizeProviderProps) {
    const [fontSize, setFontSize] = useState<FontSize>(defaultSize)
    const [mounted, setMounted] = useState(false)

    const fontSizes: FontSize[] = ["small", "medium", "large"]

    useEffect(() => {
        const savedSize = localStorage.getItem("font-size") as FontSize | null
        if (savedSize && fontSizes.includes(savedSize)) {
            setFontSize(savedSize)
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return;

        document.documentElement.classList.remove(...fontSizes.map(size => `font-size-${size}`))
        document.documentElement.classList.add(`font-size-${fontSize}`)
        localStorage.setItem("font-size", fontSize)
    }, [fontSize, mounted, fontSizes])

    const setFontSizeCallback = useCallback((newSize: FontSize) => {
        setFontSize(newSize)
    }, []);

    const value = {
        fontSize,
        setFontSize: setFontSizeCallback,
        fontSizes,
    }

    return (
        <FontSizeContext.Provider value={value}>
            {children}
        </FontSizeContext.Provider>
    )
}

export const useFontSize = (): FontSizeContextType => {
    const context = useContext(FontSizeContext)

    if (context === undefined) {
        throw new Error("useFontSize must be used within a FontSizeProvider")
    }

    return context
}