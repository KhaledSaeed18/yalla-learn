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
      
      Ensure the mind map is comprehensive, well-structured, and logical. The JSON should be valid and properly nested.
    `;

        const response = await generateText({
            model: google('gemini-1.5-flash-latest'),
            prompt: enhancedPrompt,
        });

        // Try to parse the response as JSON
        try {
            // First, find JSON content if it's embedded in text
            const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                response.match(/\{[\s\S]*"root"[\s\S]*\}/);

            const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response;
            const parsedResponse = JSON.parse(jsonContent.trim());

            return new Response(JSON.stringify(parsedResponse), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
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
