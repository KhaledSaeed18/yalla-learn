import { FileText, ImageIcon, Network, SquareMousePointer, Languages, Sparkles } from "lucide-react"
import { AnimatedBeamMultipleOutputUI } from "@/components/shared/AnimatedBeamMultipleOutputUI"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"

const AIToolsPage = () => {
    const tools = [
        {
            title: "PDF AI Chat",
            href: "/ai-tools/pdf",
            description: "Chat with PDFs - summarize, search and extract info instantly using AI.",
            icon: FileText,
            color: "from-primary/20 to-primary/5",
            iconColor: "text-primary",
        },
        {
            title: "Image AI Chat",
            href: "/ai-tools/image",
            description: "Upload an image and chat with AI to explore, analyze, and understand it.",
            icon: ImageIcon,
            color: "from-primary/20 to-primary/5",
            iconColor: "text-primary",
        },
        {
            title: "Mindmap Creation",
            href: "/ai-tools/mindmap",
            description: "Turn ideas into clear, visual mindmaps in seconds with AI.",
            icon: Network,
            color: "from-primary/20 to-primary/5",
            iconColor: "text-primary",
        },
        {
            title: "Flashcard Generation",
            href: "/ai-tools/flashcard",
            description: "Generate flashcards from any text or topic for effective learning.",
            icon: SquareMousePointer,
            color: "from-primary/20 to-primary/5",
            iconColor: "text-primary",
        },
        {
            title: "Translation",
            href: "/ai-tools/translation",
            description: "Translate text into 130+ languages instantly and accurately.",
            icon: Languages,
            color: "from-primary/20 to-primary/5",
            iconColor: "text-primary",
        },
    ]

    return (
        <main className="flex flex-col w-full min-h-screen">
            {/* Hero Section with Animation */}
            <section className="relative w-full overflow-hidden pt-12 pb-24">
                <div className="container px-4 mx-auto relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white dark:text-black text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI-Powered Tools
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-primary text-transparent bg-clip-text">
                            Discover Our AI Tools
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Enhance your learning experience with our suite of AI-powered tools designed to help you study,
                            collaborate, and create more effectively.
                        </p>
                    </div>

                    <div className="w-full max-w-3xl mx-auto h-[300px] flex items-center justify-center">
                        <AnimatedBeamMultipleOutputUI />
                    </div>
                </div>
            </section>

            {/* Tools Grid Section */}
            <section className="py-16 bg-white dark:bg-gray-950 relative z-20 -mt-16 rounded-t-3xl">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tools.map((tool, index) => (
                            <Link href={tool.href} key={index} className="group">
                                <Card
                                    className={cn(
                                        "h-full overflow-hidden border border-transparent",
                                        "transition-all duration-500 ease-out",
                                        "hover:border-primary/30",
                                        "dark:bg-gray-900 dark:hover:bg-gray-800",
                                        "relative",
                                    )}
                                >
                                    {/* Gradient background that appears on hover */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                                            tool.color,
                                            "group-hover:opacity-100",
                                        )}
                                    />

                                    {/* Card content */}
                                    <div className="p-8 h-full flex flex-col relative z-10">
                                        <div className="mb-5 relative">
                                            {/* Icon container with animation */}
                                            <div className="relative">
                                                <div
                                                    className={cn(
                                                        "w-12 h-12 rounded-lg flex items-center justify-center",
                                                        "bg-gray-100 dark:bg-gray-800",
                                                        "transition-all duration-500 ease-out",
                                                        "group-hover:bg-primary/10 group-hover:scale-110",
                                                        "group-hover:rotate-3",
                                                    )}
                                                >
                                                    <tool.icon
                                                        className={cn(
                                                            "w-6 h-6",
                                                            tool.iconColor,
                                                            "transition-transform duration-500",
                                                            "group-hover:scale-110",
                                                        )}
                                                    />
                                                </div>

                                                {/* Decorative dots */}
                                                <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                                                <div className="absolute -left-1 -bottom-1 w-2 h-2 rounded-full bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-semibold mb-3 transition-transform duration-500 group-hover:translate-x-1">
                                            {tool.title}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-300 flex-grow mb-5 transition-colors duration-500 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                                            {tool.description}
                                        </p>

                                        <div className="flex items-center text-primary font-medium text-sm">
                                            <span className="transition-transform duration-500 group-hover:translate-x-1">Explore Tool</span>
                                            <svg
                                                className="w-4 h-4 ml-1 transition-all duration-500 transform group-hover:translate-x-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default AIToolsPage
