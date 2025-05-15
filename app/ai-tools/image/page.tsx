'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useState, useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { FileUp, Send, X, Loader2, Copy, CheckCircle, Volume2, Camera } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formatMessageText = (text: string) => {
    if (!text) return text;

    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    const processedBold = boldParts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return <strong key={`bold-${index}`}>{boldText}</strong>;
        }
        return part;
    });

    const lines = processedBold.flatMap((part, partIndex) => {
        if (typeof part !== 'string') return part;

        const textLines = part.split('\n');
        return textLines.map((line, lineIndex) => {
            if (line.trim().startsWith('* ')) {
                return (
                    <div key={`bullet-${partIndex}-${lineIndex}`} className="flex ml-2 my-1">
                        <span className="mr-2">•</span>
                        <span>{line.substring(2)}</span>
                    </div>
                );
            }
            return lineIndex < textLines.length - 1 ? <React.Fragment key={`line-${partIndex}-${lineIndex}`}>{line}<br /></React.Fragment> : line;
        });
    });

    return lines;
};

export default function ImageChat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
        api: '/api/chat',
        onError: (error) => {
            let errorMessage = 'An error occurred while sending your message';
            if (error instanceof Error) {
                errorMessage = error.message;
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
    const [isDragging, setIsDragging] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImageUrl(undefined);
        }
    }, [imageFile]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const scrollContainer = messagesContainerRef.current;
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    const scrollToTop = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = 0;
        }
    }

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setShowScrollToTop(container.scrollTop > 300);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const copyToClipboard = (text: string, messageId: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedMessageId(messageId);
                toast.success("Copied to clipboard");

                setTimeout(() => {
                    setCopiedMessageId(null);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                toast.error("Failed to copy text");
            });
    };

    const speakText = (text: string, messageId: string) => {
        if ("speechSynthesis" in window) {
            if (speakingMessageId === messageId) {
                window.speechSynthesis.cancel();
                setSpeakingMessageId(null);
                return;
            }

            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            setSpeakingMessageId(messageId);

            utterance.onend = () => {
                setSpeakingMessageId(null);
            };

            utterance.onerror = () => {
                setSpeakingMessageId(null);
            };

            window.speechSynthesis.speak(utterance);
        } else {
            toast.error("Text-to-speech is not supported in your browser");
        }
    };

    useEffect(() => {
        return () => {
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImageFile(event.target.files[0]);
            setMessages([]);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!imageFile) {
            toast.error('Please upload an image first.');
            return;
        }

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
    };

    const clearImage = () => {
        setImageFile(undefined);
        setImageUrl(undefined);
        setMessages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = () => {
        setIsDragging(false);
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setImageFile(e.dataTransfer.files[0]);
            setMessages([]);
        }
    }

    return (
        <div className="flex flex-col w-full px-4 container mx-auto">
            <Card className="flex-1 overflow-hidden my-6 p-0 relative border-primary">
                <CardContent className="p-0 overflow-y-auto h-[60vh]" ref={messagesContainerRef}>
                    <div className="p-4 space-y-6">
                        {error && (
                            <div className="p-4 mb-4 text-destructive bg-destructive/10 rounded-md">
                                <div className="font-semibold">Error:</div>
                                <div>{error.message || "Something went wrong"}</div>
                            </div>
                        )}

                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[55vh] text-muted-foreground">
                                <Camera className="h-12 w-12 mb-2 text-primary" />
                                <h3 className="text-lg font-medium mb-1">Chat with Image</h3>
                                <p className='text-center'>Upload an image to start an interactive conversation about its contents</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex flex-col max-w-[80%] rounded-lg p-4",
                                            message.role === "user"
                                                ? "ml-auto bg-primary text-primary-foreground"
                                                : "bg-card border border-border shadow-sm relative",
                                        )}
                                    >
                                        {message.role === "assistant" && (
                                            <div className="absolute top-2 right-2 flex space-x-1">
                                                <Button
                                                    variant={speakingMessageId === message.id ? "default" : "ghost"}
                                                    size="icon"
                                                    className={cn(
                                                        "h-6 w-6 transition-all",
                                                        speakingMessageId === message.id
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-70 hover:opacity-100"
                                                    )}
                                                    onClick={() => speakText(message.content, message.id)}
                                                    aria-label={speakingMessageId === message.id ? "Stop speaking" : "Speak message"}
                                                >
                                                    <Volume2 className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-70 hover:opacity-100"
                                                    onClick={() => copyToClipboard(message.content, message.id)}
                                                    aria-label="Copy message"
                                                >
                                                    {copiedMessageId === message.id ?
                                                        <CheckCircle className="h-4 w-4" /> :
                                                        <Copy className="h-4 w-4" />
                                                    }
                                                </Button>
                                            </div>
                                        )}
                                        <div className={cn(
                                            "whitespace-pre-wrap",
                                            message.role === "assistant" && "pr-6"
                                        )}>
                                            {formatMessageText(message.content)}
                                        </div>

                                        {(message.experimental_attachments?.length ?? 0) > 0 && (
                                            <div className="mt-3 space-y-3">
                                                {(message.experimental_attachments ?? [])
                                                    .filter(
                                                        (attachment) =>
                                                            attachment?.contentType?.startsWith("image/"),
                                                    )
                                                    .map((attachment, index) => (
                                                        <div key={`${message.id}-${index}`} className="rounded-md overflow-hidden border border-border">
                                                            <Image
                                                                src={attachment.url || "/placeholder.svg"}
                                                                width={500}
                                                                height={500}
                                                                alt={attachment.name ?? `attachment-${index}`}
                                                                className="max-w-full h-auto"
                                                            />
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Scroll to top button */}
                {showScrollToTop && (
                    <div className="absolute bottom-35 left-1/2 transform -translate-x-1/2 z-10">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full shadow-md"
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up">
                                <path d="m5 12 7-7 7 7" />
                                <path d="M12 19V5" />
                            </svg>
                        </Button>
                    </div>
                )}

                <CardFooter className="p-0 border-t border-primary">
                    {/* Image upload area */}
                    {!imageFile && (
                        <div
                            className={cn(
                                "w-full border rounded-none p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
                                isDragging
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50 dark:hover:border-primary/30",
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Drag & drop an image here or click to browse</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">Supports PNG, JPG, GIF, WEBP</p>
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                                ref={fileInputRef}
                            />
                        </div>
                    )}

                    {/* Selected image display */}
                    {imageFile && (
                        <div className="w-full p-3 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Camera className="h-4 w-4 text-primary mr-2" />
                                    <span className="text-sm font-medium">
                                        Image selected: {imageFile.name}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={clearImage}
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                    aria-label="Clear image"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {imageUrl && (
                                <div className="mt-2 flex justify-center">
                                    <div className="relative max-w-xs max-h-40 overflow-hidden rounded-md">
                                        <Image
                                            src={imageUrl}
                                            alt="Selected image preview"
                                            width={200}
                                            height={150}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Message input */}
                    <form onSubmit={handleFormSubmit} className="w-full p-3">
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <Input
                                className="flex-1"
                                value={input}
                                placeholder={isLoading ? "Processing..." : imageFile ? "Ask something about the image..." : "Upload an image first..."}
                                onChange={handleInputChange}
                                disabled={isLoading || !imageFile}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim() || !imageFile}
                                variant={isLoading || !input.trim() || !imageFile ? "secondary" : "default"}
                                size="icon"
                                aria-label="Send message"
                                className='w-full md:w-9'
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </Button>
                        </div>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}