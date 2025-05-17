import Link from "next/link"
import { BrainCircuit, Sparkles, ClipboardCheck, FileText, CircleHelp, Info, Headset, Download, BriefcaseBusiness } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Logo and description */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <BrainCircuit className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">Yalla Learn</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your sidekick for studying, collaborating, and planning your future, all in one place.
                        </p>
                    </div>

                    {/* Main Navigation */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Main Navigation</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <BrainCircuit className="h-4 w-4 text-primary" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai-tools" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    AI Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/productivity-tools" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <ClipboardCheck className="h-4 w-4 text-primary" />
                                    Productivity Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/download" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <Download className="h-4 w-4 text-primary" />
                                    Download
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/qa" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <CircleHelp className="h-4 w-4 text-primary" />
                                    Q&A
                                </Link>
                            </li>
                            <li>
                                <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <BriefcaseBusiness className="h-4 w-4 text-primary" />
                                    Jobs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Tools */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Popular Tools</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/ai-tools/pdf" className="text-muted-foreground hover:text-foreground transition-colors">
                                    PDF AI Chat
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai-tools/mindmap" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Mindmap Creation
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai-tools/flashcard" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Flashcard Generation
                                </Link>
                            </li>
                            <li>
                                <Link href="/productivity-tools/pomodoro" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Focus & Time Management
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect & Support */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Connect & Support</h3>
                        <ul className="space-y-2 text-sm mb-4">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <Headset className="h-4 w-4 text-primary" />
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()}{" "}
                            <Link href="/" className="text-muted-foreground underline hover:text-foreground transition-colors">
                                Yalla Learn.
                            </Link>
                            {" "}
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

