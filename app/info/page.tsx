"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { ColorThemeToggle } from '@/components/theme/color-theme-toggle'
import {
    Globe,
    ExternalLink,
    Laptop,
    Smartphone,
    Code,
    Server,
    Sparkles,
    ArrowUpRight,
    BrainCircuit,
    Github,
    Headset
} from 'lucide-react'

const InfoPage = () => {
    const links = [
        {
            category: "Website",
            items: [
                {
                    title: "Yalla Learn Platform",
                    description: "Visit our main website to explore all features",
                    url: "https://yalla-learn.me",
                    icon: <Globe className="h-5 w-5" />,
                    external: true
                }
            ]
        },
        {
            category: "GitHub Repositories",
            items: [
                {
                    title: "Frontend Repository",
                    description: "React/Next.js web application source code",
                    url: "https://github.com/KhaledSaeed18/yalla-learn",
                    icon: <Code className="h-5 w-5" />,
                    external: true
                },
                {
                    title: "Backend Repository",
                    description: "API and server-side application code",
                    url: "https://github.com/KhaledSaeed18/yalla-learn-backend",
                    icon: <Server className="h-5 w-5" />,
                    external: true
                },
                {
                    title: "Mobile Repository",
                    description: "React Native mobile application",
                    url: "https://github.com/KhaledSaeed18/yalla-learn-app",
                    icon: <Smartphone className="h-5 w-5" />,
                    external: true
                },
                {
                    title: "Desktop Repository",
                    description: "Desktop application built with Electron",
                    url: "https://github.com/KhaledSaeed18/yalla-learn-desktop",
                    icon: <Laptop className="h-5 w-5" />,
                    external: true
                }
            ]
        },
        {
            category: "Support",
            items: [
                {
                    title: "Support & Feedback",
                    description: "Submit reviews, suggestions, or contact us with questions",
                    url: "https://yalla-learn.me/support",
                    icon: <Headset className="h-5 w-5" />,
                    external: true
                }
            ]
        },
    ]

    return (
        <div className="min-h-screen relative">
            {/* Theme Toggle Controls */}
            <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
                <div className="border border-border/50 rounded-lg p-1 shadow-lg flex items-center gap-2 transition-all duration-300 hover:shadow-xl">
                    <ModeToggle />
                    <div className="w-px h-6 bg-border hidden sm:block"></div>
                    <ColorThemeToggle />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-12 space-y-6">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 shadow-md shadow-primary"></div>
                            <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-border/50 shadow-lg">
                                <BrainCircuit className='text-primary' />
                            </div>
                        </div>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                            Yalla Learn
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Your sidekick for studying, collaborating, and planning your future, all in one place.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/80">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span>Learn Smart</span>
                            <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                <div className="space-y-8">
                    {links.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="space-y-6">
                            {/* Section Header */}
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    {section.category === "Website" && (
                                        <Globe className="h-6 w-6 text-primary" />
                                    )}
                                    {section.category === "GitHub Repositories" && (
                                        <Github className="h-6 w-6 text-primary" />
                                    )}
                                    {section.category === "Support" && (
                                        <Headset className="h-6 w-6 text-primary" />
                                    )}
                                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                                        {section.category}
                                    </h2>
                                </div>
                                {section.category === "GitHub Repositories" && (
                                    <p className="text-sm text-muted-foreground mb-3 max-w-lg mx-auto">
                                        Open source repositories - contributions and collaborations are welcome!
                                    </p>
                                )}
                                <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                            </div>

                            {/* Cards Grid */}
                            <div className={`grid gap-6 ${section.items.length > 2 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-2xl mx-auto'}`}>
                                {section.items.map((item, itemIndex) => (
                                    <Link
                                        href={item.url}
                                        target={item.external ? "_blank" : "_self"}
                                        rel={item.external ? "noopener noreferrer" : undefined}
                                        key={itemIndex}
                                    >
                                        <Card
                                            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative"
                                        >
                                            {/* Gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <CardHeader className="relative">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                                                            {item.icon}
                                                        </div>
                                                        <div className="flex-1">
                                                            <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                                                                {item.title}
                                                            </CardTitle>
                                                        </div>
                                                    </div>
                                                    {item.external && (
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                                    )}
                                                </div>
                                                <CardDescription className="text-muted-foreground mt-2">
                                                    {item.description}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="relative pt-0">
                                                <Button
                                                    variant="outline"
                                                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                                                >
                                                    <span>Browse {item.title.split(' ')[0]}</span>
                                                    <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default InfoPage