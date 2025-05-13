import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { NextResponse } from "next/server"

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
        const { concept, complexity, includeExamples } = await request.json()

        if (!concept || !complexity) {
            return NextResponse.json({ error: "Concept and complexity level are required." }, { status: 400 })
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

        const examplesRequirement = includeExamples
            ? "Include at least 3 practical, real-world examples that illustrate this concept."
            : "Include just 1 basic example."

        const prompt = `Explain the concept "${concept}" at a ${complexity} complexity level.

${examplesRequirement}

Format the response as a JSON object with the following structure:
{
  "concept": "The name of the concept",
  "summary": "A brief 1-2 sentence summary of the concept",
  "complexity": "The complexity level used for the explanation",
  "sections": [
    {
      "title": "Section title",
      "content": "Detailed explanation for this section",
      "visualDescription": "A description of how this could be visualized (e.g., 'A diagram showing energy flowing between two systems')"
    }
  ],
  "examples": ["Example 1", "Example 2", "Example 3"],
  "relatedConcepts": ["Related concept 1", "Related concept 2", "Related concept 3"],
  "furtherReading": ["Optional suggested resource 1", "Optional suggested resource 2"]
}

Make the explanation creative and engaging. For the visualDescription in each section, describe an image, diagram, or visual representation that would help illustrate that aspect of the concept.

Only return the JSON object, without any additional commentary or code blocks.`

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings,
        })

        const response = result.response
        const responseText = response.text()

        // Clean the response text to extract valid JSON
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

        // Try to parse the JSON response
        let explanation: ConceptExplanation
        try {
            explanation = JSON.parse(cleanText)
        } catch (error) {
            console.error("Failed to parse JSON response:", error)
            return NextResponse.json({
                error: "Failed to generate a valid explanation. Please try again with a different concept."
            }, { status: 500 })
        }

        // Validate the explanation structure
        if (!explanation.concept || !explanation.summary || !explanation.sections || !explanation.examples) {
            return NextResponse.json({
                error: "The generated explanation is incomplete. Please try again."
            }, { status: 500 })
        }

        return NextResponse.json({ explanation })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred during generation."
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
