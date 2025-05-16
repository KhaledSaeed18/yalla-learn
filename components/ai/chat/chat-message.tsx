import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-4 py-4", isUser ? "justify-end" : "")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("flex-1 space-y-2 overflow-hidden px-1", isUser ? "text-right" : "text-left")}>
        <div className="font-semibold">{isUser ? "You" : "Yalla Learn AI"}</div>
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
          {message.content}
        </div>
      </div>
    </div>
  )
}
