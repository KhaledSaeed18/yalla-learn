"use client"

import { useChat } from "@ai-sdk/react"
import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import "./ai-chat.css"

export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/assistant/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "👋 Hello! I'm your Yalla Learn AI assistant. How can I help with your studies or productivity today?",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 py-4 ${message.role === "user" ? "flex-row-reverse justify-end" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow
                  ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`flex-1 space-y-2 overflow-hidden px-1 ${message.role === "user" ? "text-right" : "text-left"}`}
              >
                <div className="font-semibold">{message.role === "user" ? "You" : "Yalla Learn AI"}</div>
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                  {message.role === "user" ? (
                    message.content
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          strong: ({ node, children, ...props }) => <span className="font-bold" {...props}>{children}</span>,
                          ul: ({ node, children, ...props }) => <ul className="my-2 ml-2 list-disc space-y-1" {...props}>{children}</ul>,
                          li: ({ node, children, ...props }) => <li className="my-0.5" {...props}>{children}</li>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
        <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="resize-none pr-12"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-4 h-8 w-8"
          >
            <Bot className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
