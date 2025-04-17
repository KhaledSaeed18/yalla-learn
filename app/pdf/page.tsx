'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function Chat() {
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: '/api/chat',
        onError: (error) => {
            let errorMessage = 'An error occurred while sending your message';
            if (error instanceof Error) {
                errorMessage = error.message;
                setErrorDetails(error.stack || null);
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object') {
                errorMessage = JSON.stringify(error);
            }
            toast.error('Error', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });

    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFormSubmit = async (event: React.FormEvent) => {
        setErrorDetails(null);

        try {
            await handleSubmit(event, {
                experimental_attachments: files,
            });
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Submission error', { description: errorMessage });
        } finally {
            setFiles(undefined);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {error && (
                <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-md">
                    <div className="font-semibold">Error:</div>
                    <div>{error.message || 'Something went wrong'}</div>
                    {errorDetails && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-sm">Technical details</summary>
                            <pre className="text-xs mt-1 bg-red-100 p-2 overflow-auto max-h-40">{errorDetails}</pre>
                        </details>
                    )}
                </div>
            )}

            {messages.map(m => (
                <div key={m.id} className="whitespace-pre-wrap">
                    {m.role === 'user' ? 'User: ' : 'AI: '}
                    {m.content}
                    <div>
                        {m?.experimental_attachments
                            ?.filter(
                                attachment =>
                                    attachment?.contentType?.startsWith('image/') ||
                                    attachment?.contentType?.startsWith('application/pdf'),
                            )
                            .map((attachment, index) =>
                                attachment.contentType?.startsWith('image/') ? (
                                    <Image
                                        key={`${m.id}-${index}`}
                                        src={attachment.url}
                                        width={500}
                                        height={500}
                                        alt={attachment.name ?? `attachment-${index}`}
                                    />
                                ) : attachment.contentType?.startsWith('application/pdf') ? (
                                    <iframe
                                        key={`${m.id}-${index}`}
                                        src={attachment.url}
                                        width="500"
                                        height="600"
                                        title={attachment.name ?? `attachment-${index}`}
                                    />
                                ) : null,
                            )}
                    </div>
                </div>
            ))}

            <form
                className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
                onSubmit={handleFormSubmit}
            >
                <div className="flex items-center gap-2">
                    <label className="relative cursor-pointer px-3 py-1.5 rounded text-sm">
                        {files?.length ? `${files.length} file(s) selected` : 'Upload files'}
                        <input
                            type="file"
                            className="hidden"
                            onChange={event => {
                                if (event.target.files) {
                                    setFiles(event.target.files);
                                }
                            }}
                            multiple
                            accept="image/*,application/pdf"
                            ref={fileInputRef}
                        />
                    </label>
                    {files && files.length > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                setFiles(undefined);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                            className="text-xs text-red-500"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        className="w-full p-2 border rounded"
                        value={input}
                        placeholder={isLoading ? "Processing..." : "Say something..."}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        // Disable button if loading OR (input is empty AND no files are selected)
                        disabled={isLoading || (!input.trim() && (files?.length ?? 0) === 0)}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
}