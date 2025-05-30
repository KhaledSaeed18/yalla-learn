"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Menu, LogOut, LayoutDashboard, ChevronDown, Image, Network, Languages, Sparkles, FileText, SquareMousePointer, BrainCircuit, ListChecks, ClipboardCheck, Brain, Clock, ScanEye, Info, Headset, CircleHelp, Download, BriefcaseBusiness, Search as SearchIcon } from "lucide-react"
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

    // Create a reusable ListItem component for navigation menu
    const ListItem = React.forwardRef<
        React.ElementRef<"a">,
        React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode; title: string }
    >(({ className, title, icon, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild className="transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground">
                    <a
                        ref={ref}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none group"
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none flex items-center">
                            <span className="transition-transform duration-300 group-hover:scale-105">
                                {icon}
                            </span>
                            <span className="transition-colors duration-300 group-hover:text-primary">
                                {title}
                            </span>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    });
    ListItem.displayName = "ListItem";

    // Navigation data with dropdown content
    const navItems = [
        {
            name: "AI Tools",
            href: "/ai-tools",
            icon: <Sparkles className="size-5 mr-2 text-primary" />,
            title: "AI Tools",
            description: "Explore our AI tools to enhance your productivity and learning experience.",
            descriptionIcon: <Sparkles className="size-10 text-primary" />,
            content: [
                {
                    title: "PDF AI Chat",
                    href: "/ai-tools/pdf",
                    description: "Chat with PDFs - summarize, search and extract info instantly using AI.",
                    icon: <FileText className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Image AI Chat",
                    href: "/ai-tools/image",
                    description: "Upload an image and chat with AI to explore, analyze, and understand it.",
                    icon: <Image className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Mindmap Creation",
                    href: "/ai-tools/mindmap",
                    description: "Turn ideas into clear, visual mindmaps in seconds with AI.",
                    icon: <Network className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Flashcard Generation",
                    href: "/ai-tools/flashcard",
                    description: "Generate flashcards from any text or topic for effective learning.",
                    icon: <SquareMousePointer className="size-5 mr-2 text-primary" />
                },
                // {
                //     title: "Translation",
                //     href: "/ai-tools/translation",
                //     description: "Translate text into 130+ languages instantly and accurately.",
                //     icon: <Languages className="size-5 mr-2 text-primary" />
                // },
                {
                    title: "AI Study Plan Generator",
                    href: "/ai-tools/study-plan",
                    description: "Generate a personalized study plan based on your subject, timeframe, and goals.",
                    icon: <ListChecks className="size-5 mr-2 text-primary" />
                },
                {
                    title: "AI Quiz Generator",
                    href: "/ai-tools/quiz",
                    description: "Create interactive quizzes on any topic with automatic scoring and explanations.",
                    icon: <ClipboardCheck className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Concept Explainer",
                    href: "/ai-tools/concept-explainer",
                    description: "Receive clear explanations of complex concepts with visual descriptions.",
                    icon: <Brain className="size-5 mr-2 text-primary" />
                },
                {
                    title: "AI Web Search",
                    href: "/ai-tools/search",
                    description: "Search the web with AI and get relevant results instantly.",
                    icon: <SearchIcon className="size-5 mr-2 text-primary" />
                }
            ],
        },
        {
            name: "Productivity Tools",
            href: "/productivity-tools",
            icon: <ClipboardCheck className="size-5 mr-2 text-primary" />,
            title: "Productivity Tools",
            description: "Boost your productivity with our specialized tools designed to help you work smarter.",
            descriptionIcon: <ClipboardCheck className="size-10 text-primary" />,
            content: [
                {
                    title: "Focus & Time Management",
                    href: "/productivity-tools/pomodoro",
                    description: "Enhance your focus with Pomodoro technique - 25/5 minute timer cycles with customizable options.",
                    icon: <Clock className="size-5 mr-2 text-primary" />
                },
                {
                    title: "Focus Mode",
                    href: "/productivity-tools/focus-mode",
                    description: "Enter a distraction-free environment to maximize your concentration and productivity.",
                    icon: <ScanEye className="size-5 mr-2 text-primary" />
                },
            ],
        },
        {
            name: "Blog",
            href: "/blog",
            icon: <FileText className="size-5 mr-2 text-primary" />
        },
        {
            name: "Q&A",
            href: "/qa",
            icon: <CircleHelp className="size-5 mr-2 text-primary" />
        },
        {
            name: "Jobs",
            href: "/jobs",
            icon: <BriefcaseBusiness className="size-5 mr-2 text-primary" />
        },
        {
            name: "Download",
            href: "/download",
            icon: <Download className="size-5 mr-2 text-primary" />
        },
        {
            name: "About",
            href: "/about",
            icon: <Info className="size-5 mr-2 text-primary" />
        },
        {
            name: "Support",
            href: "/support",
            icon: <Headset className="size-5 mr-2 text-primary" />
        },
    ]

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container mx-auto px-4 flex h-16 items-center">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center"
                    aria-label="Yalla Learn Home Page">
                    <span className="text-lg flex justify-center items-center font-bold hover:scale-105">
                        <BrainCircuit className="h-8 w-8 text-primary" aria-hidden="true" />
                        {"Yalla Learn"}
                        <span className="sr-only">Navigate to home page</span>
                    </span>
                </Link>

                {/* Desktop Navigation Menu */}
                <div className="hidden xl:flex xl:flex-1 xl:justify-center mx-auto">
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
                                                <div className="flex">
                                                    <Link
                                                        href={item.href}
                                                        className="w-1/3 p-4 bg-accent text-accent-foreground flex flex-col gap-2 justify-end rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-accent/90 relative overflow-hidden group"
                                                    >
                                                        <div className="transition-transform duration-300 group-hover:translate-y-1">
                                                            {item.descriptionIcon}
                                                        </div>
                                                        <h3 className="text-lg font-bold transition-colors duration-300 group-hover:text-primary">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm transition-opacity duration-300 group-hover:opacity-90">
                                                            {item.description}
                                                        </p>
                                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                                                    </Link>
                                                    <ul className="grid w-2/3 gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                        {item.content.map((subItem) => (
                                                            <ListItem
                                                                key={subItem.title}
                                                                href={subItem.href}
                                                                title={subItem.title}
                                                                icon={subItem.icon}
                                                            >
                                                                {subItem.description}
                                                            </ListItem>
                                                        ))}
                                                    </ul>
                                                </div>
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
                    <div className="hidden xl:inline-flex">
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
                        <SheetTrigger asChild className="xl:hidden">
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

