"use client"

import type React from "react"
import { useChat } from "@ai-sdk/react"
import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { FileUp, Send, X, Loader2, MessageSquare, FileText } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Chat() {
    const [errorDetails, setErrorDetails] = useState<string | null>(null)
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: "/api/chat",
        onError: (error) => {
            let errorMessage = "An error occurred while sending your message"
            if (error instanceof Error) {
                errorMessage = error.message
                setErrorDetails(error.stack || null)
            } else if (typeof error === "string") {
                errorMessage = error
            } else if (error && typeof error === "object") {
                errorMessage = JSON.stringify(error)
            }
            toast.error("Error", {
                description: errorMessage,
                duration: 5000,
            })
        },
    })

    const [files, setFiles] = useState<FileList | undefined>(undefined)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setErrorDetails(null)

        if (!input.trim() && (!files || files.length === 0)) {
            return
        }

        try {
            await handleSubmit(event, {
                experimental_attachments: files,
            })
        } catch (error) {
            console.error("Form submission error:", error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            toast.error("Submission error", { description: errorMessage })
        } finally {
            setFiles(undefined)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(e.dataTransfer.files)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(e.target.files)
        }
    }

    const clearFiles = () => {
        setFiles(undefined)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-center my-4">
                <h1 className="text-2xl font-bold text-foreground">Chat with PDF</h1>
            </div>

            {/* Chat container */}
            <Card className="flex-1 overflow-hidden mb-4 p-0">
                <CardContent className="p-0 overflow-y-auto">
                    <div className="p-4 space-y-6">
                        {error && (
                            <div className="p-4 mb-4 text-destructive bg-destructive/10 rounded-md">
                                <div className="font-semibold">Error:</div>
                                <div>{error.message || "Something went wrong"}</div>
                                {errorDetails && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm">Technical details</summary>
                                        <pre className="text-xs mt-1 bg-destructive/20 p-2 overflow-auto max-h-40 rounded">{errorDetails}</pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[40vh] text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mb-2" />
                                <p>Start a conversation or upload a document</p>
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
                                                : "bg-card border border-border shadow-sm",
                                        )}
                                    >
                                        <div className="whitespace-pre-wrap">{message.content}</div>

                                        {(message.experimental_attachments?.length ?? 0) > 0 && (
                                            <div className="mt-3 space-y-3">
                                                {(message.experimental_attachments ?? [])
                                                    .filter(
                                                        (attachment) =>
                                                            attachment?.contentType?.startsWith("image/") ||
                                                            attachment?.contentType?.startsWith("application/pdf"),
                                                    )
                                                    .map((attachment, index) =>
                                                        attachment.contentType?.startsWith("image/") ? (
                                                            <div key={`${message.id}-${index}`} className="rounded-md overflow-hidden border border-border">
                                                                <Image
                                                                    src={attachment.url || "/placeholder.svg"}
                                                                    width={500}
                                                                    height={500}
                                                                    alt={attachment.name ?? `attachment-${index}`}
                                                                    className="max-w-full h-auto"
                                                                />
                                                            </div>
                                                        ) : attachment.contentType?.startsWith("application/pdf") ? (
                                                            <div
                                                                key={`${message.id}-${index}`}
                                                                className="rounded-md overflow-hidden border border-border"
                                                            >
                                                                <iframe
                                                                    src={attachment.url}
                                                                    width="100%"
                                                                    height="400"
                                                                    title={attachment.name ?? `attachment-${index}`}
                                                                    className="w-full bg-white"
                                                                />
                                                            </div>
                                                        ) : null,
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="p-0 border-t">
                    {/* File upload area */}
                    {(!files || files.length === 0) && (
                        <div
                            className={cn(
                                "w-full border-2 border-dashed rounded-none p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
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
                            <p className="text-sm text-muted-foreground">Drag & drop files here or click to browse</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">Supports images and PDFs</p>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileSelect}
                                multiple
                                accept="image/*,application/pdf"
                                ref={fileInputRef}
                            />
                        </div>
                    )}

                    {/* Selected files display */}
                    {files && files.length > 0 && (
                        <div className="w-full p-3 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-4 w-4 text-primary mr-2" />
                                    <span className="text-sm font-medium">
                                        {files.length} file{files.length !== 1 ? "s" : ""} selected
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={clearFiles}
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                    aria-label="Clear files"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {Array.from(files).map((file, index) => (
                                    <div key={index} className="text-xs bg-muted rounded px-2 py-1 truncate max-w-[200px]">
                                        {file.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Message input */}
                    <form onSubmit={handleFormSubmit} className="w-full p-3">
                        <div className="flex items-center gap-2">
                            <Input
                                className="flex-1"
                                value={input}
                                placeholder={isLoading ? "Processing..." : "Type your message..."}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || (!input.trim() && (!files || files.length === 0))}
                                variant={isLoading || (!input.trim() && (!files || files.length === 0)) ? "secondary" : "default"}
                                size="icon"
                                aria-label="Send message"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </Button>
                        </div>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}
