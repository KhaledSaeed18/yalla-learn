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
        <main className="container px-4 mx-auto my-4 ">
            <header className="border-b p-4">
                <h1 className="text-2xl font-bold">Mind Map Generator</h1>
            </header>

            <div className="p-4 flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a topic for your mind map..."
                        className="flex-1"
                        disabled={loading}
                    />
                    <Button onClick={generateMindMap} disabled={loading || !prompt.trim()}>
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

                {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}

                <div className="flex-1 border h-dvh rounded-md overflow-hidden">
                    {mindMapData ? (
                        <MindMapCanvas data={mindMapData} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            {loading ? "Generating mind map..." : 'Enter a topic and click "Generate Mind Map" to start'}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
