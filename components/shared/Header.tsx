"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { ModeToggle } from "../theme/mode-toggle"
import { Separator } from "../ui/separator"
import React from "react"

export function Header() {
    const [isOpen, setIsOpen] = useState(false)

    // Navigation data with dropdown content
    const navItems = [
        {
            name: "Products",
            href: "/products",
            content: [
                {
                    title: "Product A",
                    href: "/products/a",
                    description: "Our flagship product with amazing features.",
                },
                {
                    title: "Product B",
                    href: "/products/b",
                    description: "Advanced solution for professional users.",
                },
                {
                    title: "Product C",
                    href: "/products/c",
                    description: "Entry-level option with essential features.",
                },
            ],
        },
        {
            name: "Services",
            href: "/services",
            content: [
                {
                    title: "Consulting",
                    href: "/services/consulting",
                    description: "Expert advice for your business needs.",
                },
                {
                    title: "Implementation",
                    href: "/services/implementation",
                    description: "Full-service setup and configuration.",
                },
                {
                    title: "Support",
                    href: "/services/support",
                    description: "24/7 technical assistance and maintenance.",
                },
            ],
        },
        {
            name: "Resources",
            href: "/resources",
            content: [
                {
                    title: "Documentation",
                    href: "/resources/docs",
                    description: "Comprehensive guides and references.",
                },
                {
                    title: "Blog",
                    href: "/resources/blog",
                    description: "Latest news, tips, and best practices.",
                },
                {
                    title: "Webinars",
                    href: "/resources/webinars",
                    description: "Educational sessions and demonstrations.",
                },
            ],
        },
        {
            name: "About",
            href: "/about",
        },
        {
            name: "Contact",
            href: "/contact",
        },
    ]

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container mx-auto flex px-4 h-16 items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold">Logo</span>
                </Link>

                {/* Desktop Navigation Menu */}
                <div className="hidden md:flex md:flex-1 md:justify-center mx-auto">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.name}>
                                    {item.content ? (
                                        <>
                                            <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                    {item.content.map((subItem) => (
                                                        <li key={subItem.title}>
                                                            <NavigationMenuLink asChild>
                                                                <a
                                                                    href={subItem.href}
                                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                                >
                                                                    <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                                        {subItem.description}
                                                                    </p>
                                                                </a>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </>
                                    ) : (
                                        <Link href={item.href} legacyBehavior passHref>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.name}</NavigationMenuLink>
                                        </Link>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right side items */}
                <div className="flex items-center gap-2 ml-auto">
                    <ModeToggle />
                    <Button asChild className="hidden md:inline-flex">
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-3">
                            <SheetTitle>
                                Menu
                            </SheetTitle>
                            <SheetDescription className="sr-only">
                                Navigate through our pages.
                            </SheetDescription>
                            <nav className="flex flex-col space-y-4 pt-2">
                                {navItems.map((item) =>
                                    item.content ? (
                                        <Collapsible key={item.name} className="w-full">
                                            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-base font-medium cursor-pointer">
                                                {item.name}
                                                <ChevronDown className="h-4 w-4" />
                                            </CollapsibleTrigger>
                                            <Separator />

                                            <CollapsibleContent className="pl-4">
                                                <div className="flex flex-col space-y-2 pt-2">
                                                    {item.content.map((subItem) => (
                                                        <React.Fragment key={subItem.title}>
                                                            <Link
                                                                key={subItem.title}
                                                                href={subItem.href}
                                                                className="text-sm transition-colors hover:text-primary"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {subItem.title}
                                                            </Link>
                                                            <Separator />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <>
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="text-base font-medium transition-colors hover:text-primary"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                            <Separator />
                                        </>
                                    ),
                                )}
                                <Button asChild className="mt-4">
                                    <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                                        Sign In
                                    </Link>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

