"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MindMapCanvas from "@/components/mind-map-canvas"
import { Loader2 } from "lucide-react"

interface MindMapData {
    root: {
        text: string
        children?: MindMapNode[]
    }
}

interface MindMapNode {
    text: string
    children?: MindMapNode[]
}

export default function MindMapPage() {
    const [prompt, setPrompt] = useState("")
    const [mindMapData, setMindMapData] = useState<MindMapData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generateMindMap = async () => {
        if (!prompt.trim()) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/mindmap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to generate mind map")
            }

            const data = await response.json()
            setMindMapData(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            console.error("Error generating mind map:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col container px-4 mx-auto my-4">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Mind Map Generator</h1>
                <p className="text-muted-foreground mt-1">Create insightful mind maps from any topic</p>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="p-4 rounded-lg shadow-sm border">
                    <div className="flex gap-3 items-center">
                        <Input
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter a topic for your mind map..."
                            className="flex-1"
                            disabled={loading}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && prompt.trim() && generateMindMap()}
                        />
                        <Button
                            onClick={generateMindMap}
                            disabled={loading || !prompt.trim()}
                            className="min-w-[140px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate Mind Map"
                            )}
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-3 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                            {error}
                        </div>
                    )}
                </div>

                <div className="rounded-lg shadow-sm border h-[70dvh] overflow-hidden">
                    {mindMapData ? (
                        <MindMapCanvas data={mindMapData} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            {loading ? (
                                <>
                                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                    <p>Generating your mind map...</p>
                                </>
                            ) : (
                                <>
                                    <div className="text-6xl mb-4">🧠</div>
                                    <p>Enter a topic and click "Generate Mind Map" to start</p>
                                    <p className="text-sm mt-2">Try topics like "Artificial Intelligence", "Climate Change", or "Web Development"</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
