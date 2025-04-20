import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { NextResponse } from "next/server"

interface Flashcard {
    term: string
    definition: string
}

const MODEL_NAME = "gemini-1.5-flash-latest"
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""

if (!API_KEY) {
    console.error("GOOGLE_API_KEY is not set in environment variables.")
}

export async function POST(request: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    try {
        const { topic } = await request.json()

        if (!topic || typeof topic !== "string" || !topic.trim()) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 })
        }

        const genAI = new GoogleGenerativeAI(API_KEY)
        const model = genAI.getGenerativeModel({ model: MODEL_NAME })

        const generationConfig = {
            temperature: 0.8, 
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        }

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ]

        const prompt = `Generate a list of flashcards for the topic: "${topic}".
Each flashcard must have a term and a concise definition.
Format the output strictly as a list of "Term: Definition" pairs, with each pair on a new line.
Ensure terms and definitions are distinct and clearly separated by a single colon and a space (': ').
Do not include any introductory text, explanations, or numbering. Just the list.

Example for "Spanish Greetings":
Hello: Hola
Goodbye: Adiós
Good morning: Buenos días
Thank you: Gracias

Now generate for "${topic}":`

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings,
        })

        const response = result.response
        const responseText = response.text()

        if (!responseText) {
            console.warn("Gemini API returned an empty response.")
            return NextResponse.json({ flashcards: [] })
        }

        const flashcards: Flashcard[] = responseText
            .split("\n")
            .map((line) => {
                const parts = line.split(": ")
                if (parts.length >= 2 && parts[0].trim()) {
                    const term = parts[0].trim()
                    const definition = parts.slice(1).join(": ").trim()
                    if (definition) {
                        return { term, definition }
                    }
                }
                return null
            })
            .filter((card): card is Flashcard => card !== null)

        return NextResponse.json({ flashcards })

    } catch (error: unknown) {
        console.error("Error in /api/flashcard/generate:", error)
        const message = error instanceof Error ? error.message : "An unknown error occurred during generation."
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
