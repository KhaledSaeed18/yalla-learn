import Link from "next/link"
import { Github, Twitter, Linkedin, BrainCircuit } from "lucide-react"

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

                    {/* Quick links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Connect</h3>
                        <div className="flex space-x-4">
                            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link
                                href="https://twitter.com"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} Yalla Learn. All rights reserved.
                        </p>
                        <div className="flex space-x-4 text-xs text-muted-foreground">
                            <Link href="/privacy" className="hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

