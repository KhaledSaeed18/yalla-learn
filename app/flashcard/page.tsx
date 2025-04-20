"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Flashcard {
    term: string
    definition: string
}

export default function FlashcardPage() {
    const [topic, setTopic] = useState("")
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())

    const handleGenerateFlashcards = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic or some terms and definitions.")
            setFlashcards([])
            return
        }

        setLoading(true)
        setError(null)
        setFlashcards([])
        setFlippedCards(new Set())

        try {
            const response = await fetch("/api/flashcard/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }

            const data: { flashcards: Flashcard[] } = await response.json()

            if (data.flashcards && data.flashcards.length > 0) {
                setFlashcards(data.flashcards)
            } else {
                setError("No valid flashcards could be generated. Please check the topic or format.")
            }
        } catch (err: unknown) {
            console.error("Error generating flashcards:", err)
            const message = err instanceof Error ? err.message : "An unknown error occurred"
            setError(`Failed to generate flashcards: ${message}`)
        } finally {
            setLoading(false)
        }
    }

    const toggleFlip = (index: number) => {
        setFlippedCards((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(index)) {
                newSet.delete(index)
            } else {
                newSet.add(index)
            }
            return newSet
        })
    }

    return (
        <div className="container mx-auto md:min-h-[70dvh] flex items-center justify-center py-4 md:py-0 px-4">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">Flashcard Generator</CardTitle>
                    <CardDescription>
                        Enter a topic (e.g., "Photosynthesis") or paste your own terms and definitions (one per line, like "Term: Definition") to generate flashcards using AI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Textarea
                        id="topicInput"
                        placeholder="Enter a topic like 'World Capitals' or paste your list:&#10;Ottawa: Capital of Canada&#10;Paris: Capital of France&#10;Tokyo: Capital of Japan"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="min-h-[120px] resize-y"
                        disabled={loading}
                    />
                    <Button onClick={handleGenerateFlashcards} disabled={loading || !topic.trim()} className="w-full">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            "Generate Flashcards"
                        )}
                    </Button>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {flashcards.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4 text-center">Generated Flashcards</h2>
                            <div className="flashcards-container">
                                {flashcards.map((card, index) => (
                                    <div
                                        key={index}
                                        className={cn("flashcard", { flipped: flippedCards.has(index) })}
                                        onClick={() => toggleFlip(index)}
                                    >
                                        <div className="flashcard-inner">
                                            <div className="flashcard-front">
                                                <span className="term">{card.term}</span>
                                            </div>
                                            <div className="flashcard-back">
                                                <span className="definition">{card.definition}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
