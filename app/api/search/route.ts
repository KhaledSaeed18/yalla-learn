import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

interface SearchResult {
    title: string;
    url: string;
    description: string;
}

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

        const { query } = await req.json();

        if (!query || typeof query !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid search query' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const enhancedPrompt = `
        Search the web for information about: "${query}"
        
        Format the results as a JSON array with 5-10 of the most relevant search results. Each result should include:
        1. title: A descriptive title for the page
        2. url: The full URL of the page
        3. description: A brief summary of what information the page contains
        
        Return the data in the following format:
        [
          {
            "title": "Result Title",
            "url": "https://example.com/page",
            "description": "Brief description of the page content and why it's relevant to the search query"
          },
          ...
        ]
        
        Provide only factual, accurate information from reputable sources. The JSON should be valid and properly structured. 
        Do not include introductory or explanatory text, only the JSON array.
    `;

        const response = await generateText({
            model: google('gemini-1.5-flash-latest'),
            prompt: enhancedPrompt,
        });

        try {
            let jsonContent: string | any = response;

            if (typeof response === 'object' && response !== null && 'text' in response) {
                jsonContent = response.text;
            }

            if (typeof jsonContent === 'string') {
                const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
                    jsonContent.match(/\[\s*\{[\s\S]*\}\s*\]/);

                if (jsonMatch) {
                    jsonContent = jsonMatch[1] || jsonMatch[0];
                }
            }

            if (typeof jsonContent !== 'string') {
                jsonContent = JSON.stringify(jsonContent);
            }

            const parsedResponse = JSON.parse(jsonContent.trim());

            if (!Array.isArray(parsedResponse)) {
                throw new Error("Invalid search results structure - expected array");
            }

            const validatedResults = parsedResponse.filter((item: any) =>
                item &&
                typeof item === 'object' &&
                typeof item.title === 'string' &&
                typeof item.url === 'string' &&
                typeof item.description === 'string'
            );

            return new Response(JSON.stringify(validatedResults), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (parseError) {
            console.error("Error parsing search results:", parseError);

            if (typeof response === 'object' && response !== null &&
                'text' in response && typeof response.text === 'string') {
                try {
                    const cleanedText = response.text.replace(/```json|```/g, '').trim();
                    const parsedText = JSON.parse(cleanedText);

                    if (Array.isArray(parsedText)) {
                        return new Response(JSON.stringify(parsedText), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                } catch (innerParseError) {
                    console.error('Failed to parse response text as JSON:', innerParseError);
                }
            }

            return new Response(JSON.stringify({
                error: 'Failed to generate structured search results',
                rawResponse: response
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
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
