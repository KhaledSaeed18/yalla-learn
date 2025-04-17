'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function ImageChat() {
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
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

    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Create a URL for the selected image file for preview
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImageUrl(url);
            // Clean up the object URL when the component unmounts or the file changes
            return () => URL.revokeObjectURL(url);
        } else {
            setImageUrl(undefined);
        }
    }, [imageFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImageFile(event.target.files[0]);
            // Clear previous messages when a new image is uploaded
            setMessages([]);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        setErrorDetails(null);

        if (!imageFile) {
            toast.error('Please upload an image first.');
            return;
        }

        // Convert the single File to a FileList to match the expected type
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFile);
        const fileList = dataTransfer.files;

        try {
            await handleSubmit(event, {
                experimental_attachments: fileList,
            });
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Submission error', { description: errorMessage });
        }
        // Note: We don't clear the image file here, allowing follow-up questions
    };

    const clearImage = () => {
        setImageFile(undefined);
        setImageUrl(undefined);
        setMessages([]); // Clear messages when image is cleared
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col w-full max-w-2xl py-12 mx-auto stretch px-4">
            <h1 className="text-2xl font-semibold mb-4 text-center">Chat with Image</h1>

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

            {/* Image Upload and Preview Area */}
            <div className="mb-4 p-4 border border-gray-300 rounded shadow-lg bg-white">
                {!imageUrl ? (
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg">
                        <label htmlFor="image-upload" className="cursor-pointer text-blue-500 hover:text-blue-700">
                            Click to upload an image
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                            ref={fileInputRef}
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WEBP</p>
                    </div>
                ) : (
                    <div className="relative group">
                        <Image
                            src={imageUrl}
                            alt="Uploaded preview"
                            width={500}
                            height={300}
                            className="rounded-lg object-contain max-h-80 w-auto mx-auto"
                        />
                        <button
                            onClick={clearImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Clear image"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>


            {/* Chat Messages Area */}
            {messages.length > 0 && (
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto p-4 border border-gray-200 rounded bg-gray-50">
                    {messages.map(m => (
                        <div key={m.id} className={`whitespace-pre-wrap p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
                            <span className="font-semibold capitalize">{m.role}: </span>
                            {m.content}
                            {/* We don't need to render attachments here as they are part of the prompt, not the response */}
                        </div>
                    ))}
                </div>
            )}

            {/* Input Form */}
            <form
                className="sticky bottom-0 bg-white py-4 border-t border-gray-200"
                onSubmit={handleFormSubmit}
            >
                <div className="flex items-center gap-2">
                    <input
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={input}
                        placeholder={isLoading ? "Processing..." : (imageFile ? "Ask something about the image..." : "Upload an image first...")}
                        onChange={handleInputChange}
                        disabled={isLoading || !imageFile} // Disable if loading or no image is uploaded
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim() || !imageFile} // Disable if loading, input empty, or no image
                        className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
}