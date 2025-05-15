"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2, Copy, Volume2, Trash2, History, Star, StarOff, Sparkles, Languages, Check, ArrowLeftRight, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchParams, useRouter } from "next/navigation"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { languageOptions } from "@/constants/languages"

const TRANSLATE_API_URL = "https://api.cognitive.microsofttranslator.com/translate"
const API_VERSION = "3.0"

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
    const router = useRouter()
    const searchParams = useSearchParams()

    const [inputText, setInputText] = useState("")
    const debouncedInputText = useDebounce(inputText, 1000)
    const [sourceLanguage, setSourceLanguage] = useState("en")
    const [targetLanguage, setTargetLanguage] = useState("ar")
    const [translatedText, setTranslatedText] = useState("")
    const [detectedLanguage, setDetectedLanguage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [autoTranslate, setAutoTranslate] = useState(false)
    const [autoDetect, setAutoDetect] = useState(true)
    const [translationHistory, setTranslationHistory] = useState<TranslationHistoryItem[]>([])
    const [activeTab, setActiveTab] = useState(() => {
        const tabParam = searchParams.get("tab")
        return tabParam === "history" ? "history" : "translate"
    })
    const [copied, setCopied] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const outputRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)

        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", tab)

        router.replace(`/translation?${params.toString()}`, { scroll: false })
    }

    useEffect(() => {
        const tabParam = searchParams.get("tab")
        if (tabParam === "history" || tabParam === "translate") {
            setActiveTab(tabParam)
        }
    }, [searchParams])

    useEffect(() => {
        const savedHistory = localStorage.getItem("translationHistory")
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory)
                if (Array.isArray(parsedHistory)) {
                    setTranslationHistory(parsedHistory)
                    console.log("Loaded translation history:", parsedHistory)
                }
            } catch (e) {
                console.error("Failed to parse translation history", e)
            }
        }
    }, [])

    useEffect(() => {
        if (translationHistory.length > 0) {
            try {
                localStorage.setItem("translationHistory", JSON.stringify(translationHistory))
                console.log("Saved translation history:", translationHistory)
            } catch (e) {
                console.error("Failed to save translation history", e)
            }
        }
    }, [translationHistory])

    useEffect(() => {
        if (activeTab === "history") {
            const savedHistory = localStorage.getItem("translationHistory")
            if (savedHistory) {
                try {
                    setTranslationHistory(JSON.parse(savedHistory))
                } catch (e) {
                    console.error("Failed to parse translation history", e)
                    toast("Could not load translation history", {
                        description: "There was an error loading your saved translations",
                    })
                }
            }
        }
    }, [activeTab])

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

            toast("Translation failed. Please try again.", {
                description: err instanceof Error ? err.message : "An unexpected error occurred",
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const getLanguageName = (code: string) => {
        return languageOptions.find((lang) => lang.value === code)?.label || code
    }

    const copyToClipboard = () => {
        if (translatedText) {
            navigator.clipboard.writeText(translatedText)
            setCopied(true)
            toast("Copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const clearInput = () => {
        setInputText("")
        setTranslatedText("")
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const swapLanguages = () => {
        if (!autoDetect) {
            const temp = sourceLanguage
            setSourceLanguage(targetLanguage)
            setTargetLanguage(temp)

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

    const toggleFavorite = (id: string) => {
        setTranslationHistory((prev) => {
            const updated = prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
            localStorage.setItem("translationHistory", JSON.stringify(updated))
            return updated
        })
    }

    const deleteHistoryItem = (id: string) => {
        setTranslationHistory((prev) => {
            const updated = prev.filter((item) => item.id !== id)
            localStorage.setItem("translationHistory", JSON.stringify(updated))
            return updated
        })
    }

    const clearHistory = () => {
        if (confirm("Are you sure you want to clear all history?")) {
            setTranslationHistory([])
            try {
                localStorage.removeItem("translationHistory")
                toast("Translation history cleared")
            } catch (e) {
                console.error("Failed to clear translation history", e)
            }
        }
    }

    const useHistoryItem = (item: TranslationHistoryItem) => {
        setInputText(item.sourceText)
        setTranslatedText(item.translatedText)
        setSourceLanguage(item.sourceLanguage)
        setTargetLanguage(item.targetLanguage)
        setActiveTab("translate")
    }

    const speakText = (text: string, lang: string) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = lang
            window.speechSynthesis.speak(utterance)
        } else {
            toast("Text-to-speech is not supported in your browser")
        }
    }

    const formatRelativeTime = (timestamp: number) => {
        const now = Date.now()
        const diff = now - timestamp

        if (diff < 60000) return "just now"
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
        return `${Math.floor(diff / 86400000)}d ago`
    }

    return (
        <div className="container mx-auto px-4 my-4 transition-colors duration-300">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Languages className="h-8 w-8" />
                        <span>AI Translator</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Translate your text to any of{" "}
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-primary dark:text-black text-white shadow-sm transition-all duration-300 hover:shadow-md transform hover:scale-105 hover:cursor-pointer">
                            {languageOptions.length}
                        </span>
                        {" "}supported languages
                    </p>
                </div>

                <Tabs defaultValue="translate" value={activeTab} onValueChange={handleTabChange} className="w-full">
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

                                <CardFooter className="flex flex-col items-start gap-4 w-full">
                                    <div className="flex flex-col lg:flex-row justify-around items-center w-full gap-4">
                                        <div className="w-full sm:w-auto">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        disabled={autoDetect}
                                                        className="w-[140px] sm:w-[180px] justify-between"
                                                    >
                                                        {sourceLanguage
                                                            ? languageOptions.find((language) => language.value === sourceLanguage)?.label
                                                            : "Source language"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[180px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search language..." />
                                                        <CommandList>
                                                            <CommandEmpty>No language found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {languageOptions.map((language) => (
                                                                    <CommandItem
                                                                        key={language.value}
                                                                        value={language.value}
                                                                        onSelect={(value) => {
                                                                            setSourceLanguage(value)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                sourceLanguage === language.value ? "opacity-100" : "opacity-0",
                                                                            )}
                                                                        />
                                                                        {language.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="flex items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={swapLanguages}
                                                disabled={autoDetect}
                                                title="Swap languages, disabled when auto-detect is enabled"
                                            >
                                                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>

                                        <div className="w-full sm:w-auto">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-[140px] sm:w-[180px] justify-between"
                                                    >
                                                        {targetLanguage
                                                            ? languageOptions.find((language) => language.value === targetLanguage)?.label
                                                            : "Target language"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[180px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search language..." />
                                                        <CommandList>
                                                            <CommandEmpty>No language found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {languageOptions.map((language) => (
                                                                    <CommandItem
                                                                        key={language.value}
                                                                        value={language.value}
                                                                        onSelect={(value) => {
                                                                            setTargetLanguage(value)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                targetLanguage === language.value ? "opacity-100" : "opacity-0",
                                                                            )}
                                                                        />
                                                                        {language.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
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
                                        <Button variant="outline" size="sm" onClick={clearHistory}>
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
                                            <CardContent className="py-3 px-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge variant="outline" className="text-xs whitespace-normal">
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
