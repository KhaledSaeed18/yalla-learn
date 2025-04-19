"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Loader2,
    Copy,
    Volume2,
    Trash2,
    History,
    Star,
    StarOff,
    FlipHorizontalIcon as SwapHorizontal,
    Check,
    MoonStar,
    SunMedium,
    Sparkles,
    Languages,
} from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

// Language options for translation
const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "nl", label: "Dutch" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "ar", label: "Arabic" },
    { value: "ru", label: "Russian" },
    { value: "zh-Hans", label: "Chinese (Simplified)" },
]

// Azure translation API constants
const TRANSLATE_API_URL = "https://api.cognitive.microsofttranslator.com/translate"
const API_VERSION = "3.0"

// Type for translation history items
interface TranslationHistoryItem {
    id: string
    sourceText: string
    translatedText: string
    sourceLanguage: string
    targetLanguage: string
    timestamp: number
    isFavorite: boolean
}

const Translation = () => {
    const [inputText, setInputText] = useState("")
    const debouncedInputText = useDebounce(inputText, 1000)
    const [sourceLanguage, setSourceLanguage] = useState("en")
    const [targetLanguage, setTargetLanguage] = useState("es")
    const [translatedText, setTranslatedText] = useState("")
    const [detectedLanguage, setDetectedLanguage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [autoTranslate, setAutoTranslate] = useState(false)
    const [autoDetect, setAutoDetect] = useState(true)
    const [translationHistory, setTranslationHistory] = useState<TranslationHistoryItem[]>([])
    const [activeTab, setActiveTab] = useState("translate")
    const [copied, setCopied] = useState(false)
    const { theme, setTheme } = useTheme()
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const outputRef = useRef<HTMLDivElement>(null)

    // Load history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("translationHistory")
        if (savedHistory) {
            try {
                setTranslationHistory(JSON.parse(savedHistory))
            } catch (e) {
                console.error("Failed to parse translation history", e)
            }
        }
    }, [])

    // Save history to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("translationHistory", JSON.stringify(translationHistory))
    }, [translationHistory])

    // Auto-translate when input text changes (if enabled)
    useEffect(() => {
        if (autoTranslate && debouncedInputText && debouncedInputText.trim().length > 0) {
            handleTranslate()
        }
    }, [debouncedInputText, targetLanguage, autoTranslate, autoDetect])

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            toast("Please enter text to translate")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `${TRANSLATE_API_URL}?api-version=${API_VERSION}&to=${targetLanguage}${autoDetect ? "" : `&from=${sourceLanguage}`}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY || "",
                        "Ocp-Apim-Subscription-Region": process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION || "",
                    },
                    body: JSON.stringify([
                        {
                            Text: inputText,
                        },
                    ]),
                },
            )

            if (!response.ok) {
                throw new Error(`Translation failed with status: ${response.status}`)
            }

            const data = await response.json()

            if (data && data.length > 0 && data[0].translations && data[0].translations.length > 0) {
                setTranslatedText(data[0].translations[0].text)

                if (data[0].detectedLanguage) {
                    setDetectedLanguage(data[0].detectedLanguage.language)
                    if (autoDetect) {
                        setSourceLanguage(data[0].detectedLanguage.language)
                    }
                }

                // Add to history
                const newHistoryItem: TranslationHistoryItem = {
                    id: Date.now().toString(),
                    sourceText: inputText,
                    translatedText: data[0].translations[0].text,
                    sourceLanguage: autoDetect ? data[0].detectedLanguage?.language || "unknown" : sourceLanguage,
                    targetLanguage,
                    timestamp: Date.now(),
                    isFavorite: false,
                }

                setTranslationHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)])
            } else {
                throw new Error("Invalid response format from translation service")
            }
        } catch (err) {
            console.error("Translation error:", err)
            setError(err instanceof Error ? err.message : "An unexpected error occurred")

            toast("Translation failed. Please try again.", {
                description: err instanceof Error ? err.message : "An unexpected error occurred",
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Get language name from code
    const getLanguageName = (code: string) => {
        return languageOptions.find((lang) => lang.value === code)?.label || code
    }

    // Copy translated text to clipboard
    const copyToClipboard = () => {
        if (translatedText) {
            navigator.clipboard.writeText(translatedText)
            setCopied(true)
            toast("Copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Clear input text
    const clearInput = () => {
        setInputText("")
        setTranslatedText("")
        setError(null)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    // Swap source and target languages
    const swapLanguages = () => {
        if (!autoDetect) {
            const temp = sourceLanguage
            setSourceLanguage(targetLanguage)
            setTargetLanguage(temp)

            // Also swap the text if there's translated content
            if (translatedText) {
                setInputText(translatedText)
                setTranslatedText(inputText)
            }
        } else {
            toast("Cannot swap when auto-detect is enabled", {
                description: "Please disable auto-detect first",
            })
        }
    }

    // Toggle favorite status for a history item
    const toggleFavorite = (id: string) => {
        setTranslationHistory((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
        )
    }

    // Delete a history item
    const deleteHistoryItem = (id: string) => {
        setTranslationHistory((prev) => prev.filter((item) => item.id !== id))
    }

    // Use a history item
    const useHistoryItem = (item: TranslationHistoryItem) => {
        setInputText(item.sourceText)
        setTranslatedText(item.translatedText)
        setSourceLanguage(item.sourceLanguage)
        setTargetLanguage(item.targetLanguage)
        setActiveTab("translate")
    }

    // Text-to-speech function
    const speakText = (text: string, lang: string) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = lang
            window.speechSynthesis.speak(utterance)
            toast("Speaking text")
        } else {
            toast("Text-to-speech is not supported in your browser")
        }
    }

    // Use a common phrase
    const useCommonPhrase = useCallback(
        (phrase: { text: string; language: string }) => {
            setInputText(phrase.text)
            setSourceLanguage(phrase.language)
            if (autoTranslate) {
                // Translation will happen automatically due to the useEffect
            } else {
                handleTranslate()
            }
        },
        [autoTranslate, handleTranslate],
    )

    // Format relative time for history items
    const formatRelativeTime = (timestamp: number) => {
        const now = Date.now()
        const diff = now - timestamp

        if (diff < 60000) return "just now"
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
        return `${Math.floor(diff / 86400000)}d ago`
    }

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4 transition-colors duration-300">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Languages className="h-8 w-8" />
                        <span>Translator</span>
                    </h1>
                </div>

                <Tabs defaultValue="translate" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="translate" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            <span>Translate</span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            <span>History</span>
                            {translationHistory.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {translationHistory.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="translate" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Input Card */}
                            <Card className="transition-all duration-300 hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Original Text</CardTitle>
                                        <div className="flex items-center gap-2">
                                            {inputText && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => speakText(inputText, sourceLanguage)}>
                                                                <Volume2 className="h-4 w-4" />
                                                                <span className="sr-only">Speak text</span>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Speak text</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            {inputText && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={clearInput}>
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Clear text</span>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Clear text</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </div>
                                    <CardDescription>
                                        {autoDetect
                                            ? "Language will be detected automatically"
                                            : `Translating from ${getLanguageName(sourceLanguage)}`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        ref={inputRef}
                                        placeholder="Type or paste your text here..."
                                        className="min-h-[200px] resize-none transition-all duration-300 focus:border-primary"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                        <span>{inputText.length} characters</span>
                                        {inputText.length > 0 && (
                                            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearInput}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col items-start gap-4">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-full">
                                            <Select value={sourceLanguage} onValueChange={setSourceLanguage} disabled={autoDetect}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Source language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languageOptions.map((language) => (
                                                        <SelectItem key={language.value} value={language.value}>
                                                            {language.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="w-full">
                                            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Target language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languageOptions.map((language) => (
                                                        <SelectItem key={language.value} value={language.value}>
                                                            {language.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex items-center space-x-2">
                                            <Switch id="auto-detect" checked={autoDetect} onCheckedChange={setAutoDetect} />
                                            <Label htmlFor="auto-detect">Auto-detect language</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch id="auto-translate" checked={autoTranslate} onCheckedChange={setAutoTranslate} />
                                            <Label htmlFor="auto-translate">Auto-translate as you type</Label>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>

                            {/* Output Card */}
                            <Card className="transition-all duration-300 hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Translated Text</CardTitle>
                                        <div className="flex items-center gap-2">
                                            {translatedText && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => speakText(translatedText, targetLanguage)}
                                                            >
                                                                <Volume2 className="h-4 w-4" />
                                                                <span className="sr-only">Speak translation</span>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Speak translation</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            {translatedText && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                                                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                                <span className="sr-only">Copy to clipboard</span>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </div>
                                    <CardDescription>
                                        {detectedLanguage ? (
                                            <>
                                                Translated from {getLanguageName(detectedLanguage)} to {getLanguageName(targetLanguage)}
                                            </>
                                        ) : (
                                            <>Translation to {getLanguageName(targetLanguage)}</>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        ref={outputRef}
                                        className={cn(
                                            "min-h-[200px] p-3 rounded-md border bg-muted/50 transition-all duration-300",
                                            isLoading ? "animate-pulse" : "",
                                            translatedText ? "text-foreground" : "text-muted-foreground",
                                        )}
                                    >
                                        {translatedText || <span>{isLoading ? "Translating..." : "Translation will appear here"}</span>}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    {translatedText ? (
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
                                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                {copied ? "Copied!" : "Copy"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => speakText(translatedText, targetLanguage)}
                                                className="flex items-center gap-2"
                                            >
                                                <Volume2 className="h-4 w-4" />
                                                Speak
                                            </Button>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}

                                    <Button
                                        onClick={handleTranslate}
                                        disabled={isLoading || !inputText.trim()}
                                        className="transition-all duration-300"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Translating...
                                            </>
                                        ) : (
                                            "Translate"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        {translationHistory.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-8">
                                    <History className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground text-center">Your translation history will appear here</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Recent Translations</h3>
                                    {translationHistory.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to clear all history?")) {
                                                    setTranslationHistory([])
                                                    toast("Translation history cleared")
                                                }
                                            }}
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {translationHistory.map((item) => (
                                        <Card
                                            key={item.id}
                                            className={cn(
                                                "transition-all duration-300 hover:shadow-md",
                                                item.isFavorite ? "border-amber-300 dark:border-amber-700" : "",
                                            )}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline">
                                                                {getLanguageName(item.sourceLanguage)} → {getLanguageName(item.targetLanguage)}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatRelativeTime(item.timestamp)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => toggleFavorite(item.id)}
                                                            >
                                                                {item.isFavorite ? (
                                                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                                ) : (
                                                                    <StarOff className="h-4 w-4" />
                                                                )}
                                                                <span className="sr-only">
                                                                    {item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                                                                </span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => deleteHistoryItem(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete</span>
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-2 mt-1">
                                                        <div className="text-sm">
                                                            <p className="font-medium">Original:</p>
                                                            <p className="text-muted-foreground line-clamp-2">{item.sourceText}</p>
                                                        </div>
                                                        <div className="text-sm">
                                                            <p className="font-medium">Translation:</p>
                                                            <p className="text-muted-foreground line-clamp-2">{item.translatedText}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end mt-2">
                                                        <Button variant="default" size="sm" onClick={() => useHistoryItem(item)}>
                                                            Use This Translation
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Translation
