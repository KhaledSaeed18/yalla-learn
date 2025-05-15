"use client"

import { AnimatePresence, motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Brain, FileText, ArrowRight, Book, Lightbulb, Atom, Network, ExternalLink, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ExplanationSection {
    title: string
    content: string
    visualDescription?: string
}

interface ConceptExplanation {
    concept: string
    summary: string
    complexity: string
    sections: ExplanationSection[]
    examples: string[]
    relatedConcepts: string[]
    furtherReading?: string[]
}

const formSchema = z.object({
    concept: z.string().min(1, {
        message: "Please enter a concept or topic.",
    }),
    complexity: z.enum(["Beginner", "Intermediate", "Advanced"]),
    includeExamples: z.boolean().default(true),
})

export default function ConceptExplainer() {
    const [explanation, setExplanation] = useState<ConceptExplanation | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            concept: "",
            complexity: "Intermediate",
            includeExamples: true,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setExplanation(null)

        try {
            const response = await fetch("/api/concept-explainer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate explanation")
            }

            setExplanation(data.explanation)
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An unknown error occurred while generating the explanation."
            )
        } finally {
            setIsLoading(false)
        }
    }

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Brain className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Concept Explainer</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Receive clear explanations of complex concepts with visual descriptions to enhance understanding.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Generate Explanation</CardTitle>
                        <CardDescription>
                            Enter a concept or topic to receive a detailed explanation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="concept"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Concept or Topic</FormLabel>
                                            <FormControl>
                                                <Input placeholder="E.g., Quantum Computing, Photosynthesis, Blockchain" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter any concept you want to understand better.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="complexity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Complexity Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select complexity level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Choose the level of detail and technical language.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="includeExamples"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Include Practical Examples</FormLabel>
                                                <FormDescription>
                                                    Include real-world examples that illustrate the concept.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>Generating...</>
                                    ) : (
                                        <>
                                            Explain Concept
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="lg:col-span-2 mt-8 mx-2 lg:mx-0 lg:mt-0">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                className="flex flex-col items-center justify-center h-full space-y-4 min-h-[400px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <Brain className="w-10 h-10 text-primary animate-pulse" />
                                    </div>
                                    <svg className="animate-spin h-16 w-16 text-primary/20" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium">Generating explanation...</p>
                                <p className="text-sm text-muted-foreground text-center max-w-md">
                                    We're creating a detailed explanation with visual descriptions and examples.
                                </p>
                            </motion.div>
                        ) : explanation ? (
                            <motion.div
                                key="results"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <motion.div variants={itemVariants} className="bg-primary/5 rounded-lg p-6 border">
                                    <h2 className="text-2xl font-bold mb-2">{explanation.concept}</h2>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                            {explanation.complexity}
                                        </span>
                                    </div>
                                    <p className="text-lg leading-relaxed">{explanation.summary}</p>
                                </motion.div>

                                <Tabs defaultValue="explanation" className="w-full">
                                    <TabsList className="grid grid-cols-3">
                                        <TabsTrigger value="explanation">
                                            <Book className="mr-2 h-4 w-4" />
                                            Explanation
                                        </TabsTrigger>
                                        <TabsTrigger value="examples">
                                            <Lightbulb className="mr-2 h-4 w-4" />
                                            Examples
                                        </TabsTrigger>
                                        <TabsTrigger value="related">
                                            <Network className="mr-2 h-4 w-4" />
                                            Related
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="explanation" className="space-y-4 mt-4">
                                        {explanation.sections.map((section, index) => (
                                            <motion.div
                                                key={`section-${index}`}
                                                variants={itemVariants}
                                                className="border rounded-lg overflow-hidden"
                                            >
                                                <div className="p-4 border-b bg-muted/30">
                                                    <h3 className="font-semibold flex items-center">
                                                        <Atom className="mr-2 h-4 w-4 text-primary" />
                                                        {section.title}
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    <div className="prose max-w-none dark:prose-invert">
                                                        <p>{section.content}</p>
                                                    </div>
                                                </div>
                                                {section.visualDescription && (
                                                    <div className="p-4 bg-primary/5 border-t">
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-primary/10 p-2 rounded-full">
                                                                <FileText className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <div className="text-sm italic">
                                                                <span className="font-medium">Visual description: </span>
                                                                {section.visualDescription}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="examples" className="space-y-4 mt-4">
                                        {explanation.examples.map((example, index) => (
                                            <motion.div
                                                key={`example-${index}`}
                                                variants={itemVariants}
                                                className="border rounded-lg p-4 bg-card relative"
                                            >
                                                <div className="flex gap-3">
                                                    <div
                                                        className={cn(
                                                            "flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center",
                                                            "bg-primary/10 text-primary font-medium"
                                                        )}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <div className="prose dark:prose-invert max-w-none">
                                                        <p>{example}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="related" className="mt-4">
                                        <motion.div
                                            variants={itemVariants}
                                            className="border rounded-lg p-4"
                                        >
                                            <h3 className="font-semibold mb-4">Related Concepts</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {explanation.relatedConcepts.map((concept, index) => (
                                                    <Button
                                                        key={`concept-${index}`}
                                                        variant="outline"
                                                        size="sm"
                                                        className="hover:bg-primary/10"
                                                        onClick={() => {
                                                            form.setValue("concept", concept);
                                                            onSubmit({ ...form.getValues(), concept });
                                                        }}
                                                    >
                                                        {concept}
                                                        <ArrowRight className="ml-2 h-3 w-3" />
                                                    </Button>
                                                ))}
                                            </div>

                                            {explanation.furtherReading && explanation.furtherReading.length > 0 && (
                                                <>
                                                    <Separator className="my-4" />
                                                    <h3 className="font-semibold mb-2">Further Reading</h3>
                                                    <ul className="space-y-2">
                                                        {explanation.furtherReading.map((source, index) => (
                                                            <li key={`source-${index}`} className="flex items-start gap-2">
                                                                <ExternalLink className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                                                <span className="text-sm">{source}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </motion.div>
                                    </TabsContent>
                                </Tabs>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Brain className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No explanation generated yet</h3>
                                <p className="text-muted-foreground max-w-md">
                                    Enter a concept or topic on the left and click "Explain Concept" to generate a detailed explanation.
                                </p>
                                <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-md">
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => {
                                            form.setValue("concept", "Quantum Computing");
                                            onSubmit({ ...form.getValues(), concept: "Quantum Computing" });
                                        }}
                                    >
                                        <Atom className="mr-2 h-4 w-4" />
                                        Quantum Computing
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => {
                                            form.setValue("concept", "Climate Change");
                                            onSubmit({ ...form.getValues(), concept: "Climate Change" });
                                        }}
                                    >
                                        <Atom className="mr-2 h-4 w-4" />
                                        Climate Change
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => {
                                            form.setValue("concept", "Neural Networks");
                                            onSubmit({ ...form.getValues(), concept: "Neural Networks" });
                                        }}
                                    >
                                        <Atom className="mr-2 h-4 w-4" />
                                        Neural Networks
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => {
                                            form.setValue("concept", "Bitcoin");
                                            onSubmit({ ...form.getValues(), concept: "Bitcoin" });
                                        }}
                                    >
                                        <Atom className="mr-2 h-4 w-4" />
                                        Bitcoin
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
