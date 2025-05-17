"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ExternalLink, Loader2, Search as SearchIcon } from "lucide-react"
import Link from "next/link"

interface SearchResult {
    title: string
    url: string
    description: string
}

export default function SearchPage() {
    const [query, setQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const performSearch = async () => {
        if (!query.trim()) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to perform search")
            }

            const data = await response.json()
            setSearchResults(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            console.error("Error performing search:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col container px-4 mx-auto my-4">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">AI Web Search</h1>
                <p className="text-muted-foreground mt-1">Search the web with AI and get relevant results</p>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="p-4 rounded-lg shadow-sm border">
                    <div className="flex gap-3 items-center">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your search query..."
                            className="flex-1"
                            disabled={loading}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && query.trim() && performSearch()}
                        />
                        <Button
                            onClick={performSearch}
                            disabled={loading || !query.trim()}
                            className="min-w-[140px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <SearchIcon className="mr-2 h-4 w-4" />
                                    Search
                                </>
                            )}
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-3 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {searchResults.length > 0 ? (
                    <div className="space-y-4">
                        {searchResults.map((result, index) => (
                            <Link
                                key={index}
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-lg text-primary">{result.title}</h3>
                                            <span className="text-muted-foreground hover:text-primary transition-colors">
                                                <ExternalLink className="h-4 w-4" />
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 truncate">{result.url}</p>
                                        <p className="text-muted-foreground text-sm">{result.description}</p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : !loading && query.trim() !== '' ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <SearchIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground text-center">
                            No search results found. Try a different query.
                        </p>
                    </div>
                ) : !loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                        <SearchIcon className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-center">
                            Enter a search query to find information on the web
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
