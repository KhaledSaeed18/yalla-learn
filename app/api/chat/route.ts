import { google } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    const contentType = req.headers.get('content-type') || '';
    let messages;
    let attachments = [];

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

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.error('Invalid message format:', messages);
        return new Response(JSON.stringify({ error: 'Invalid message format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (attachments.length > 0) {
        try {
            const userMessageIndex = messages.findLastIndex(
                (m: CoreMessage) => m.role === 'user',
            );

            if (userMessageIndex === -1) {
                throw new Error('No user message found to attach files to.');
            }

            const userMessage = messages[userMessageIndex];

            const contentArray: Array<
                | { type: 'text'; text: string }
                | { type: 'image'; image: Buffer }
                | { type: 'inlineData'; mimeType: string; data: Buffer }
            > = [];

            if (typeof userMessage.content === 'string' && userMessage.content.trim() !== '') {
                contentArray.push({ type: 'text', text: userMessage.content });
            }

            const processedAttachments = await Promise.all(
                attachments.map(async attachment => {
                    try {
                        const buffer = Buffer.from(await attachment.content.arrayBuffer());
                        if (attachment.contentType?.startsWith('image/')) {
                            return { type: 'image' as const, image: buffer };
                        } else if (attachment.contentType) {
                            return {
                                type: 'inlineData' as const,
                                mimeType: attachment.contentType,
                                data: buffer,
                            };
                        } else {
                            console.warn(`Skipping attachment with unknown content type: ${attachment.name}`);
                            return null;
                        }
                    } catch (err) {
                        console.error('Error processing attachment buffer:', err);
                        throw new Error(`Failed to process attachment buffer: ${attachment.name}`);
                    }
                })
            );

            processedAttachments.forEach(att => {
                if (att) {
                    contentArray.push(att);
                }
            });

            messages[userMessageIndex].content = contentArray;

        } catch (err) {
            console.error('Error processing attachments:', err);
            return new Response(JSON.stringify({
                error: err instanceof Error ? err.message : 'Failed to process attachments'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    try {
        const result = await streamText({
            model: google('gemini-1.5-flash-latest'),
            messages: messages as CoreMessage[],
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