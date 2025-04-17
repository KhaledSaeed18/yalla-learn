import { google } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai'; // Import CoreMessage

export const maxDuration = 30;

export async function POST(req: Request) {
    // Parse the request as a FormData if it's multipart (has attachments)
    // or as JSON if it's a regular request
    const contentType = req.headers.get('content-type') || '';
    let messages;
    let attachments = [];

    // Check for API key using the standard name expected by @ai-sdk/google
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

    if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData();
        messages = JSON.parse(formData.get('messages') as string);

        // Get attachments if any
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('files.') && value instanceof Blob) {
                attachments.push({
                    name: key.replace('files.', ''),
                    content: value,
                    contentType: value.type,
                });
            }
        }
    } else {
        const body = await req.json();
        messages = body.messages;
    }

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.error('Invalid message format:', messages);
        return new Response(JSON.stringify({ error: 'Invalid message format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Process attachments and modify the last user message
    if (attachments.length > 0) {
        try {
            const userMessageIndex = messages.findLastIndex(
                (m: CoreMessage) => m.role === 'user',
            );

            if (userMessageIndex === -1) {
                throw new Error('No user message found to attach files to.');
            }

            const userMessage = messages[userMessageIndex];

            // Ensure content is an array for multimodal input
            const contentArray: Array<
                | { type: 'text'; text: string }
                | { type: 'image'; image: Buffer }
                | { type: 'inlineData'; mimeType: string; data: Buffer }
            > = [];

            // Add existing text content if any
            if (typeof userMessage.content === 'string' && userMessage.content.trim() !== '') {
                contentArray.push({ type: 'text', text: userMessage.content });
            }

            // Process and add attachments
            const processedAttachments = await Promise.all(
                attachments.map(async attachment => {
                    try {
                        const buffer = Buffer.from(await attachment.content.arrayBuffer());
                        if (attachment.contentType?.startsWith('image/')) {
                            return { type: 'image' as const, image: buffer };
                        } else if (attachment.contentType) {
                            // Use inlineData for other types like PDF
                            return {
                                type: 'inlineData' as const,
                                mimeType: attachment.contentType,
                                data: buffer,
                            };
                        } else {
                            console.warn(`Skipping attachment with unknown content type: ${attachment.name}`);
                            return null; // Skip attachments without a known type
                        }
                    } catch (err) {
                        console.error('Error processing attachment buffer:', err);
                        throw new Error(`Failed to process attachment buffer: ${attachment.name}`);
                    }
                })
            );

            // Add valid processed attachments to the content array
            processedAttachments.forEach(att => {
                if (att) {
                    contentArray.push(att);
                }
            });

            // Update the user message content
            messages[userMessageIndex].content = contentArray;

        } catch (err) {
            console.error('Error processing attachments:', err);
            return new Response(JSON.stringify({
                error: err instanceof Error ? err.message : 'Failed to process attachments'
            }), {
                status: 400, // Use 400 for bad request due to attachment issues
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    try {
        // Log the request (without full base64 data to avoid bloating logs)
        console.log('Processing chat request with model gemini-1.5-flash-latest'); // Updated model name

        const result = await streamText({ // Use await here
            model: google('gemini-1.5-flash-latest'), // Remove googleApiKey property
            messages: messages as CoreMessage[], // Cast messages to CoreMessage[]
        });

        return result.toDataStreamResponse();
    } catch (error) {
        // More detailed error logging
        console.error('Error in chat API:', error);

        // Structured error response with more details
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