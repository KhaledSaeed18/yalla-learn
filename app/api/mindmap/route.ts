import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            console.error('Missing Google Generative AI API key (GOOGLE_GENERATIVE_AI_API_KEY)');
            return new Response(JSON.stringify({
                error: 'Server configuration error: Missing API key'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Enhance the prompt to get a structured response suitable for mind maps
        const enhancedPrompt = `
        Create a structured mind map for the following topic: "${prompt}"
        Format the result as a JSON object with the following structure:
        {
        "root": {
            "text": "Main Topic",
            "children": [
            {
                "text": "Subtopic 1",
                "children": [
                {"text": "Detail 1.1"},
                {"text": "Detail 1.2"}
                ]
            },
            {
                "text": "Subtopic 2",
                "children": [
                {"text": "Detail 2.1"},
                {"text": "Detail 2.2"}
                ]
            }
            ]
        }
        }
        Ensure the mind map is comprehensive, well-structured, and logical, designed to flow from top to bottom rather than left to right. The JSON should be valid and properly nested.
    `;

        const response = await generateText({
            model: google('gemini-1.5-flash-latest'),
            prompt: enhancedPrompt,
        });

        // Try to parse the response as JSON
        try {
            // Check if the response is already a JSON object with a 'text' field
            let jsonContent: string | any = response;

            // Handle case where response is an object with a text property containing the JSON
            if (typeof response === 'object' && response !== null && 'text' in response) {
                jsonContent = response.text;
            }

            // If we're working with a string, extract JSON content if embedded in text
            if (typeof jsonContent === 'string') {
                // First, try to match JSON code blocks (```json ... ```)
                const jsonMatch = jsonContent.match(/```json\s*([\s\S]*?)\s*```/) ||
                    // Then try to match any JSON-like structure with "root"
                    jsonContent.match(/\{[\s\S]*"root"[\s\S]*\}/);

                if (jsonMatch) {
                    jsonContent = jsonMatch[1] || jsonMatch[0];
                }
            }

            // Ensure we're working with a string before attempting to parse
            if (typeof jsonContent !== 'string') {
                jsonContent = JSON.stringify(jsonContent);
            }

            const parsedResponse = JSON.parse(jsonContent.trim());

            // Verify the structure has the expected format with a "root" property
            if (!parsedResponse.root) {
                throw new Error("Invalid mind map structure - missing root node");
            }

            return new Response(JSON.stringify(parsedResponse), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);

            // For debugging purposes, log the response structure
            console.log('Response type:', typeof response);
            console.log('Response preview:',
                typeof response === 'string'
                    ? (response as string).substring(0, 200)
                    : JSON.stringify(response).substring(0, 200)
            );

            // If the response is an object with a valid root structure already, try to use it directly
            if (typeof response === 'object' && response !== null &&
                'text' in response && typeof response.text === 'string') {
                try {
                    const parsedText = JSON.parse(response.text);
                    if (parsedText.root && typeof parsedText.root === 'object') {
                        return new Response(JSON.stringify(parsedText), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                } catch (innerParseError) {
                    // Continue to the fallback response if parsing fails
                }
            }

            // Return the raw text if parsing fails
            return new Response(JSON.stringify({
                error: 'Failed to generate structured mind map',
                rawResponse: response
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error('Error generating mind map:', error);
        const errorMessage = error instanceof Error
            ? error.message
            : 'An unknown error occurred while processing your request';

        return new Response(JSON.stringify({
            error: errorMessage,
            timestamp: new Date().toISOString(),
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
