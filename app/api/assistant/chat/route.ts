import { google } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    let messages;

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

    try {
        const body = await req.json();
        messages = body.messages;
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to parse request body'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.error('Invalid message format:', messages);
        return new Response(JSON.stringify({ error: 'Invalid message format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Adding specific system instructions for the AI Assistant role
        const systemMessage = {
            role: 'system',
            content: `You are Yalla Learn AI Assistant, a helpful, conversational AI designed to assist students and users with their studies, learning, and productivity needs.
            
            - You're knowledgeable about a wide range of academic subjects
            - You can explain complex concepts in simpler terms
            - You're supportive and encouraging of learning
            - You provide practical study tips and learning strategies
            - You can suggest resources for further learning
            - You help users organize their studies and improve productivity
            
            USE MARKDOWN FORMATTING IN YOUR RESPONSES:
            - Use **double asterisks** for bold text
            - Place each bullet point on its own line using * or -
            - Use proper markdown syntax for lists, headings, and other formatting
            
            This is a text-based chat with markdown rendering capabilities.
            Users will send text messages and expect well-formatted responses.
            
            Keep responses concise, friendly, and focused on providing valuable assistance. Avoid any harmful, inappropriate, or off-topic content.`
        };

        // Add the system message if it's not already in the messages
        const hasSystemMessage = messages.some((m: CoreMessage) => m.role === 'system');
        const messagesWithSystem = hasSystemMessage ? messages : [systemMessage, ...messages];

        const result = await streamText({
            model: google('gemini-1.5-flash-latest'),
            messages: messagesWithSystem as CoreMessage[],
        });

        return result.toDataStreamResponse();
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
