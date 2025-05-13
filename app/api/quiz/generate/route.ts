import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { NextResponse } from "next/server"

export interface QuizQuestion {
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
}

const MODEL_NAME = "gemini-1.5-flash-latest"
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""

if (!API_KEY) {
    console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables.")
}

export async function POST(request: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    try {
        const { topic, numQuestions, difficulty } = await request.json()

        if (!topic || !numQuestions || !difficulty) {
            return NextResponse.json({ error: "All fields are required: topic, numQuestions, difficulty." }, { status: 400 })
        }

        const genAI = new GoogleGenerativeAI(API_KEY)
        const model = genAI.getGenerativeModel({ model: MODEL_NAME })

        const generationConfig = {
            temperature: 0.7,
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

        const prompt = `Generate a quiz with ${numQuestions} multiple-choice questions about "${topic}" at a ${difficulty} difficulty level.

Format the output as a JSON array of objects. Each object should represent a question and have these properties:
- question: the text of the question
- options: an array of 4 possible answers (one correct, three incorrect)
- correctAnswer: the text of the correct answer (must match exactly one of the options)
- explanation: a brief explanation of why the answer is correct

Make sure the questions are challenging and appropriate for the ${difficulty} level. Do not include any introductory or closing text, only the JSON array.`

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings,
        })

        const response = result.response
        const responseText = response.text()

        // Remove code block markers if present
        let cleanText = responseText.trim()
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json/, '').trim()
        }
        if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```/, '').trim()
        }
        if (cleanText.endsWith('```')) {
            cleanText = cleanText.replace(/```$/, '').trim()
        }

        // Find valid JSON in the response
        let jsonStartIndex = cleanText.indexOf('[');
        let jsonEndIndex = cleanText.lastIndexOf(']');

        // If we found valid JSON array markers
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
            cleanText = cleanText.substring(jsonStartIndex, jsonEndIndex + 1);
        }

        let quizQuestions: QuizQuestion[] = []
        let parseError = null

        try {
            quizQuestions = JSON.parse(cleanText)
        } catch (e) {
            parseError = e
            console.error("JSON parse error:", e)

            // Try to recover by adding missing brackets or fixing common issues
            try {
                if (!cleanText.trim().endsWith(']')) {
                    cleanText = cleanText.trim() + ']'
                    quizQuestions = JSON.parse(cleanText)
                    console.log("Recovered JSON by adding closing bracket")
                }
            } catch (recoveryError) {
                console.error("Recovery attempt failed:", recoveryError)
            }
        }

        // If we still have no valid quiz questions
        if (quizQuestions.length === 0) {
            // Try regenerating with a simpler prompt as fallback
            if (parseError) {
                try {
                    const fallbackPrompt = `Generate a ${difficulty} difficulty quiz with ${numQuestions} multiple-choice questions about "${topic}". Format as a JSON array of objects with properties: question (string), options (array of 4 strings), correctAnswer (string that matches one option), and explanation (string). Return ONLY valid JSON without extra text.`

                    const fallbackResult = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: fallbackPrompt }] }],
                        generationConfig,
                        safetySettings,
                    })

                    let fallbackText = fallbackResult.response.text().trim()

                    // Clean up the fallback response
                    if (fallbackText.startsWith('```json')) {
                        fallbackText = fallbackText.replace(/^```json/, '').trim()
                    }
                    if (fallbackText.startsWith('```')) {
                        fallbackText = fallbackText.replace(/^```/, '').trim()
                    }
                    if (fallbackText.endsWith('```')) {
                        fallbackText = fallbackText.replace(/```$/, '').trim()
                    }

                    // Find valid JSON in the fallback response
                    jsonStartIndex = fallbackText.indexOf('[');
                    jsonEndIndex = fallbackText.lastIndexOf(']');

                    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
                        fallbackText = fallbackText.substring(jsonStartIndex, jsonEndIndex + 1);
                    }

                    quizQuestions = JSON.parse(fallbackText)
                    console.log("Successfully used fallback prompt")
                } catch (fallbackError) {
                    console.error("Fallback generation also failed:", fallbackError)
                    return NextResponse.json({
                        error: "Failed to generate a valid quiz. Please try again with different parameters.",
                    }, { status: 500 })
                }
            }
        }

        if (quizQuestions.length === 0) {
            return NextResponse.json({
                error: "Failed to generate valid quiz questions. The AI response could not be processed.",
            }, { status: 500 })
        }

        return NextResponse.json({ quizQuestions })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred during generation."
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
