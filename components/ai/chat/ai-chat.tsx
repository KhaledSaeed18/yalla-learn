"use client"

import { useChat } from "ai/react"
import { useEffect, useRef } from "react"
import { ChatInput } from "./chat-input"
import { ChatMessage } from "./chat-message"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bot } from "lucide-react"

export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "👋 Hello! I'm your Yalla Learn AI assistant. How can I help with your studies or productivity today?",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleMessageSubmit = (content: string) => {
    const formData = new FormData()
    formData.append("content", content)
    handleSubmit({ preventDefault: () => {}, data: formData } as unknown as React.FormEvent<HTMLFormElement>)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle>Yalla Learn AI Assistant</CardTitle>
            <CardDescription>Powered by Google Gemini</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-6">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-2 overflow-hidden px-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          )}
          {error && (
            <div className="px-2 py-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
              Error: {error.message || "Something went wrong. Please try again."}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <ChatInput onSubmit={handleMessageSubmit} isLoading={isLoading} />
      </CardFooter>
    </Card>
  )
}
