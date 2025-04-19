'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Language options for translation
const languageOptions = [
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'nl', label: 'Dutch' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'ar', label: 'Arabic' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh-Hans', label: 'Chinese (Simplified)' },
]

// Azure translation API constants
const TRANSLATE_API_URL = 'https://api.cognitive.microsofttranslator.com/translate'
const API_VERSION = '3.0'

const Translation = () => {
    const [inputText, setInputText] = useState('')
    const [targetLanguage, setTargetLanguage] = useState('es')
    const [translatedText, setTranslatedText] = useState('')
    const [detectedLanguage, setDetectedLanguage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            toast('Please enter text to translate')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${TRANSLATE_API_URL}?api-version=${API_VERSION}&to=${targetLanguage}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY || '',
                    'Ocp-Apim-Subscription-Region': process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION || '',
                },
                body: JSON.stringify([
                    {
                        Text: inputText
                    }
                ])
            })

            if (!response.ok) {
                throw new Error(`Translation failed with status: ${response.status}`)
            }

            const data = await response.json()

            if (data && data.length > 0 && data[0].translations && data[0].translations.length > 0) {
                setTranslatedText(data[0].translations[0].text)

                if (data[0].detectedLanguage) {
                    setDetectedLanguage(data[0].detectedLanguage.language)
                }

                toast('Translation successful!',{
                    description: `Translated from ${getLanguageName(data[0].detectedLanguage.language)} to ${getLanguageName(targetLanguage)}`,
                    duration: 3000,
                })
            } else {
                throw new Error('Invalid response format from translation service')
            }
        } catch (err) {
            console.error('Translation error:', err)
            setError(err instanceof Error ? err.message : 'An unexpected error occurred')

            toast('Translation failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Get language name from code
    const getLanguageName = (code: string) => {
        return languageOptions.find(lang => lang.value === code)?.label || code
    }

    return (
        <div className="container max-w-4xl mx-auto py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Text Translation</h1>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Input Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Original Text</CardTitle>
                        <CardDescription>
                            Enter the text you want to translate
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Type or paste your text here..."
                            className="min-h-[200px] resize-none"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-full">
                                <Select
                                    value={targetLanguage}
                                    onValueChange={setTargetLanguage}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languageOptions.map(language => (
                                            <SelectItem key={language.value} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Translating...
                                    </>
                                ) : (
                                    'Translate'
                                )}
                            </Button>
                        </div>

                        {error && (
                            <div className="text-destructive text-sm w-full">
                                Error: {error}
                            </div>
                        )}
                    </CardFooter>
                </Card>

                {/* Output Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Translated Text</CardTitle>
                        <CardDescription>
                            {detectedLanguage ? (
                                <>Translated from {getLanguageName(detectedLanguage)} to {getLanguageName(targetLanguage)}</>
                            ) : (
                                <>Translation to {getLanguageName(targetLanguage)}</>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={`min-h-[200px] p-3 rounded-md border bg-muted/50 ${isLoading ? 'animate-pulse' : ''}`}>
                            {translatedText || (
                                <span className="text-muted-foreground">
                                    {isLoading ? 'Translating...' : 'Translation will appear here'}
                                </span>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        {translatedText && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    navigator.clipboard.writeText(translatedText);
                                    toast('Translated text copied to clipboard!')
                                }}
                            >
                                Copy to Clipboard
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Translation