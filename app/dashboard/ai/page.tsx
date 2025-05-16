import { AIChat } from "@/components/ai/chat/ai-chat-fixed"

export const metadata = {
  title: "AI Assistant - Yalla Learn",
  description: "Get help with your studies and productivity using our AI assistant",
}

export default function AIAssistantPage() {
  return (
    <div className="container">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">Yalla Learn AI</h1>
          <p className="text-muted-foreground">Ask questions, get study help, or find productivity tips</p>
        </div>
        <AIChat />
      </div>
    </div>
  )
}
