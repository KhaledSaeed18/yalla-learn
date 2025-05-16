"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { FileText, ImageIcon, Network, SquareMousePointer, Languages, ListChecks, ClipboardCheck, Brain, ArrowRight, MessageCircle, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingIcons } from "./floating-icons"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

const aiTools = [
    {
        title: "PDF AI Chat",
        href: "/ai-tools/pdf",
        description: "Chat with PDFs - summarize, search and extract info instantly using AI.",
        longDescription:
            "Upload any PDF document and start a conversation with it. Our AI will analyze the content, allowing you to ask questions, request summaries, search for specific information, and extract key insights without having to read through the entire document.",
        icon: <FileText className="size-8" />,
        tags: ["Document Analysis", "Information Extraction", "Summarization"],
    },
    {
        title: "Image AI Chat",
        href: "/ai-tools/image",
        description: "Upload an image and chat with AI to explore, analyze, and understand it.",
        longDescription:
            "Upload any image and have a conversation about it with our AI. Get detailed descriptions, identify objects and people, analyze visual elements, understand context, and extract text from images. Perfect for research, learning, and content creation.",
        icon: <ImageIcon className="size-8" />,
        tags: ["Visual Analysis", "Image Understanding", "Object Recognition"],
    },
    {
        title: "Mindmap Creation",
        href: "/ai-tools/mindmap",
        description: "Turn ideas into clear, visual mindmaps in seconds with AI.",
        longDescription:
            "Transform your ideas, notes, or any text into beautifully organized visual mindmaps. Our AI analyzes your content, identifies key concepts and relationships, and generates interactive mindmaps that help you understand complex topics, organize thoughts, and study more effectively.",
        icon: <Network className="size-8" />,
        tags: ["Visual Learning", "Organization", "Concept Mapping"],
    },
    {
        title: "Flashcard Generation",
        href: "/ai-tools/flashcard",
        description: "Generate flashcards from any text or topic for effective learning.",
        longDescription:
            "Create effective study flashcards instantly from any text, document, or topic. Our AI identifies key concepts, creates question-answer pairs, and organizes them into decks. Study with spaced repetition, track your progress, and focus on areas where you need more practice.",
        icon: <SquareMousePointer className="size-8" />,
        tags: ["Memorization", "Study Aid", "Spaced Repetition"],
    },
    {
        title: "Translation",
        href: "/ai-tools/translation",
        description: "Translate text into 130+ languages instantly and accurately.",
        longDescription:
            "Translate any text, document, or conversation into over 130 languages with high accuracy. Our AI understands context, idioms, and specialized terminology to deliver natural-sounding translations. Perfect for language learning, international communication, and content localization.",
        icon: <Languages className="size-8" />,
        tags: ["Language Learning", "Global Communication", "Content Localization"],
    },
    {
        title: "AI Study Plan Generator",
        href: "/ai-tools/study-plan",
        description: "Generate a personalized study plan based on your subject, timeframe, and goals.",
        longDescription:
            "Create a customized study plan tailored to your specific needs. Input your subject, available time, learning goals, and current knowledge level. Our AI generates a structured learning path with daily tasks, resource recommendations, and milestone checkpoints to keep you on track.",
        icon: <ListChecks className="size-8" />,
        tags: ["Personalized Learning", "Time Management", "Goal Setting"],
    },
    {
        title: "AI Quiz Generator",
        href: "/ai-tools/quiz",
        description: "Create interactive quizzes on any topic with automatic scoring and explanations.",
        longDescription:
            "Generate comprehensive quizzes on any subject in seconds. Our AI creates varied question types (multiple choice, true/false, short answer), provides automatic scoring, and offers detailed explanations for each answer. Perfect for self-assessment, classroom use, and exam preparation.",
        icon: <ClipboardCheck className="size-8" />,
        tags: ["Assessment", "Knowledge Testing", "Exam Preparation"],
    },
    {
        title: "Concept Explainer",
        href: "/ai-tools/concept-explainer",
        description: "Receive clear explanations of complex concepts with visual descriptions.",
        longDescription:
            "Get simple, clear explanations of complex concepts across any field. Our AI breaks down difficult ideas into easy-to-understand components, provides visual descriptions, analogies, and examples. Perfect for students, lifelong learners, and anyone trying to understand challenging topics.",
        icon: <Brain className="size-8" />,
        tags: ["Visual Learning", "Simplified Concepts", "Interactive"],
    },
]

// These tools require authentication
const premiumAiTools = [
    {
        title: "AI Chat",
        href: "/dashboard/ai",
        description: "Chat with our AI assistant for personalized learning support.",
        longDescription:
            "Engage with our AI assistant for deep, personalized conversations about any subject. Get help with homework, clarify complex concepts, or explore new topics with an adaptive AI that learns your preferences and adjusts to your learning style.",
        icon: <MessageCircle className="size-8" />,
        tags: ["Personalized Support", "Homework Help", "Interactive Learning"],
        requiresAuth: true,
    },
    {
        title: "Voice AI Assistant",
        href: "/dashboard/ai/assistant",
        description: "Have natural voice conversations with our AI tutor.",
        longDescription:
            "Experience learning through natural voice conversations with our AI tutor. Ask questions, request explanations, or discuss complex topics using just your voice. Perfect for auditory learners, multitasking, or when you need a more natural, conversation-based approach to learning.",
        icon: <Mic className="size-8" />,
        tags: ["Voice Interaction", "Hands-free Learning", "Natural Conversation"],
        requiresAuth: true,
    },
]

export function AIToolsSection() {
    const router = useRouter()
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    const sectionRef = useRef<HTMLDivElement>(null)

    const floatingIconsArray = [
        <FileText key="file" className="h-8 w-8 text-primary" />,
        <ImageIcon key="image" className="h-8 w-8 text-primary" />,
        <Network key="network" className="h-8 w-8 text-primary" />,
        <SquareMousePointer key="pointer" className="h-8 w-8 text-primary" />,
        <Languages key="languages" className="h-8 w-8 text-primary" />,
        <ListChecks key="list" className="h-8 w-8 text-primary" />,
        <ClipboardCheck key="clipboard" className="h-8 w-8 text-primary" />,
        <Brain key="brain" className="h-8 w-8 text-primary" />,
        <MessageCircle key="chat" className="h-8 w-8 text-primary" />,
        <Mic key="mic" className="h-8 w-8 text-primary" />,
    ]

    const handleAuthClick = (href: string) => {
        if (isAuthenticated) {
            router.push(href)
        } else {
            router.push('/auth/signin')
        }
    }

    return (
        <section ref={sectionRef} className="relative py-24 overflow-hidden">
            {/* Floating Icons Background */}
            <FloatingIcons icons={floatingIconsArray} count={15} />

            <div className="container mx-auto relative">
                {/* AI Tool Cards with Alternating Layout */}
                <div className="space-y-16">
                    {aiTools.map((tool, index) => {
                        const isEven = index % 2 === 0

                        return (
                            <motion.div
                                key={tool.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="mb-12"
                            >
                                <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card/80 to-card shadow-xl backdrop-blur-sm">
                                    {/* Icon Section - Alternating between right and left */}
                                    <div className={`absolute top-0 ${isEven ? "right-0" : "left-0"} w-1/2 h-full hidden md:block`}>
                                        <div className="w-full h-full bg-primary/5 backdrop-blur-sm flex items-center justify-center">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                className="relative w-4/5 aspect-square"
                                            >
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse"
                                                    style={{ animationDuration: "4s" }}
                                                />
                                                <div
                                                    className="absolute inset-4 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-pulse"
                                                    style={{ animationDuration: "5s", animationDelay: "0.5s" }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">{tool.icon}</div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Content Section - Alternating between left and right */}
                                    <div className={`p-8 md:p-12 md:w-1/2 ${isEven ? "md:ml-0" : "md:ml-auto"}`}>
                                        <div className="flex items-center mb-4">
                                            <div className="mr-4 p-3 rounded-xl bg-primary/10 text-primary">{tool.icon}</div>
                                            <div>
                                                <h3 className="text-2xl font-bold">{tool.title}</h3>
                                                <p className="text-muted-foreground">{tool.description}</p>
                                            </div>
                                        </div>
                                        <p className="mb-6 text-lg">{tool.longDescription}</p>
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {tool.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Button size="lg" className="group" asChild>
                                            <a href={tool.href}>
                                                Try {tool.title}
                                                <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </motion.div>
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Premium AI tools that require authentication */}
                <div className="mt-20 mb-10">
                    <h2 className="text-3xl font-bold text-center mb-10">Premium AI Tools</h2>
                    <div className="space-y-16">
                        {premiumAiTools.map((tool, index) => {
                            const isEven = index % 2 === 0

                            return (
                                <motion.div
                                    key={tool.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.7, delay: 0.1 }}
                                    className="mb-12"
                                >
                                    <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card/80 to-card shadow-xl backdrop-blur-sm">
                                        {/* Icon Section - Alternating between right and left */}
                                        <div className={`absolute top-0 ${isEven ? "right-0" : "left-0"} w-1/2 h-full hidden md:block`}>
                                            <div className="w-full h-full bg-primary/5 backdrop-blur-sm flex items-center justify-center">
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    whileInView={{ scale: 1, opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: 0.3 }}
                                                    className="relative w-4/5 aspect-square"
                                                >
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse"
                                                        style={{ animationDuration: "4s" }}
                                                    />
                                                    <div
                                                        className="absolute inset-4 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-pulse"
                                                        style={{ animationDuration: "5s", animationDelay: "0.5s" }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">{tool.icon}</div>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Content Section - Alternating between left and right */}
                                        <div className={`p-8 md:p-12 md:w-1/2 ${isEven ? "md:ml-0" : "md:ml-auto"}`}>
                                            <div className="flex items-center mb-4">
                                                <div className="mr-4 p-3 rounded-xl bg-primary/10 text-primary">{tool.icon}</div>
                                                <div>
                                                    <h3 className="text-2xl font-bold">{tool.title}</h3>
                                                    <p className="text-muted-foreground">{tool.description}</p>
                                                </div>
                                            </div>
                                            <p className="mb-6 text-lg">{tool.longDescription}</p>
                                            <div className="flex flex-wrap gap-3 mb-6">
                                                {tool.tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Button
                                                size="lg"
                                                className="group"
                                                onClick={() => handleAuthClick(tool.href)}
                                            >
                                                {isAuthenticated ? `Try ${tool.title}` : 'Sign In to Get Started'}
                                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
