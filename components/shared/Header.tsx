"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Menu, LogOut, LayoutDashboard, ChevronDown, Image, Network, Languages, Sparkles, FileText, SquareMousePointer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ModeToggle } from "../theme/mode-toggle"
import { Separator } from "../ui/separator"
import React from "react"
import SignInButton from "./SigninButton"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { logout } from "@/lib/auth/logout"
import { ColorThemeToggle } from "../theme/color-theme-toggle"

export function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    const handleLogout = useCallback(async (e: React.MouseEvent) => {
        try {
            e.preventDefault()
            await logout()
        } catch (error) {
            toast.error("Error", {
                description: error instanceof Error ? error.message : "An unknown error occurred",
            })
        }
    }, []);

    const getUserInitials = () => {
        if (!user?.firstName || !user?.lastName) return "U";
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    };

    // Navigation data with dropdown content
    const navItems = [
        {
            name: "AI Tools",
            href: "/ai-tools",
            icon: <Sparkles className="size-5 mr-2 text-primary" />,
            content: [
                {
                    title: "PDF AI Chat",
                    href: "/pdf",
                    description: "Chat with PDFs - summarize, search and extract info instantly using AI.",
                    icon: <FileText className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Image AI Chat",
                    href: "/image",
                    description: "Upload an image and chat with AI to explore, analyze, and understand it.",
                    icon: <Image className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Mindmap Creation",
                    href: "/mindmap",
                    description: "Turn ideas into clear, visual mindmaps in seconds with AI.",
                    icon: <Network className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Flashcard Generation",
                    href: "/flashcard",
                    description: "Generate flashcards from any text or topic for effective learning.",
                    icon: <SquareMousePointer className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Translation",
                    href: "/translation",
                    description: "Translate text into 130+ languages instantly and accurately.",
                    icon: <Languages className="size-5 mr-2 text-primary" />
                }
            ],
        },
        {
            name: "Blog",
            href: "/blog",
            icon: <FileText className="size-5 mr-2 text-primary" />
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
                                            <NavigationMenuTrigger>
                                                <span className="animate-pulse">{item.icon}</span>
                                                {item.name}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                    {item.content.map((subItem) => (
                                                        <li key={subItem.title}>
                                                            <NavigationMenuLink asChild>
                                                                <a
                                                                    href={subItem.href}
                                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                                >
                                                                    <div className="text-sm font-medium leading-none flex items-center">
                                                                        {subItem.icon}
                                                                        {subItem.title}
                                                                    </div>
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
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                <div className="flex items-center">
                                                    <span className="animate-pulse inline">{item.icon}</span>
                                                    {item.name}
                                                </div>
                                            </NavigationMenuLink>
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
                    <ColorThemeToggle />

                    {/* User Profile or Sign In button */}
                    <div className="hidden md:inline-flex">
                        {isAuthenticated ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="relative p-0 h-10 w-10 rounded-full overflow-hidden">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} className="object-cover" />
                                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4" align="end">
                                    <div className="flex items-center gap-4 pb-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h4 className="font-semibold">{user?.firstName} {user?.lastName}</h4>
                                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="space-y-2 pt-2">
                                        <Link
                                            href="/dashboard"
                                            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="flex w-full items-center justify-start gap-2 px-2 text-sm hover:bg-destructive/10 hover:text-destructive"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <SignInButton />
                        )}
                    </div>

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
                                                <div className="flex items-center">
                                                    {item.icon}{item.name}
                                                </div>
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
                                                                className="text-sm transition-colors hover:text-primary flex items-center"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {subItem.icon}
                                                                {subItem.title}
                                                            </Link>
                                                            <Separator />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <React.Fragment key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-base font-medium transition-colors hover:text-primary"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                            <Separator />
                                        </React.Fragment>
                                    ),
                                )}

                                {/* Show either auth buttons or user info in mobile menu */}
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center gap-4 py-2">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                                                <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h4 className="font-semibold">{user?.firstName} {user?.lastName}</h4>
                                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 text-base font-medium transition-colors hover:text-primary"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LayoutDashboard className="h-5 w-5" />
                                            Dashboard
                                        </Link>
                                        <Separator />
                                        <Button
                                            variant="ghost"
                                            className="flex w-full items-center justify-start gap-2 px-0 text-base font-medium transition-colors hover:text-destructive"
                                            onClick={(e) => {
                                                handleLogout(e);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button asChild className="mt-4">
                                        <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                                            Sign In
                                        </Link>
                                    </Button>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

