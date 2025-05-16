"use client"

import { useEffect, useState } from "react"
import CallButton from "@/components/ai/assistant/CallButton"
import ParticipantCard from "@/components/ai/assistant/ParticipantCard"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function YallaLearnAssistant() {
    const { user } = useSelector((state: RootState) => state.auth)
    const [vapi, setVapi] = useState<any>(null)
    const [status, setStatus] = useState("Ready")
    const [isConnecting, setIsConnecting] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isApiKeyValid, setIsApiKeyValid] = useState(true)

    // Event handlers
    const handleCallStart = () => {
        setIsConnecting(false)
        setIsConnected(true)
        setErrorMessage("")
        setStatus("Connected")

    }

    const handleCallEnd = () => {
        setIsConnecting(false)
        setIsConnected(false)
        setStatus("Call ended")
    }

    const handleSpeechStart = () => {
        setIsSpeaking(true)
    }

    const handleSpeechEnd = () => {
        setIsSpeaking(false)
    }


    const handleError = (error: any) => {
        console.error("Vapi error:", error)
        setIsConnecting(false)

        if (error?.error?.message?.includes("card details")) {
            setErrorMessage("Payment required. Visit the Vapi dashboard to set up your payment method.")
        } else if (error?.error?.statusCode === 401 || error?.error?.statusCode === 403) {
            setErrorMessage("API key is invalid. Please check your environment variables.")
            setIsApiKeyValid(false)
        } else {
            setErrorMessage(error?.error?.message || "An error occurred")
        }

        setStatus("Error")
    }

    // Initialize Vapi on client-side only
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("@vapi-ai/web").then((module) => {
                const Vapi = module.default

                const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || ""

                if (!apiKey) {
                    setErrorMessage("API key is missing. Please check your environment variables.")
                    setStatus("Error")
                    setIsApiKeyValid(false)
                    return
                }

                // Initialize Vapi
                const vapiInstance = new Vapi(apiKey)
                setVapi(vapiInstance)
                setIsApiKeyValid(true)

                vapiInstance
                    .on("call-start", handleCallStart)
                    .on("call-end", handleCallEnd)
                    .on("speech-start", handleSpeechStart)
                    .on("speech-end", handleSpeechEnd)
                    .on("error", handleError)
            })
        }

        // Cleanup function
        return () => {
            if (vapi) {
                vapi.stop()
            }
        }
    }, [])

    // Start call function
    const startCall = () => {
        if (!isApiKeyValid) {
            setErrorMessage("Cannot start call: API key is invalid or missing.")
            return
        }

        setIsConnecting(true)
        setStatus("Connecting...")
        setErrorMessage("")

        vapi.start(assistantOptions)
    }

    // End call function
    const endCall = () => {
        if (vapi) {
            vapi.stop()
        }
    }

    // Get assistant status text
    const getAssistantStatus = () => {
        if (isConnecting) return "Connecting..."
        if (isConnected) {
            return isSpeaking ? "Speaking..." : "Listening..."
        }
        return "Waiting..."
    }

    return (
        <div className="h-[calc(90dvh-3rem)] bg-background flex flex-col items-center justify-center">
            <div className="max-w-6xl w-full mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Yalla Learn Assistant
                    </h1>
                    <p className="text-muted-foreground">
                        Have a voice conversation with our AI assistant
                    </p>
                </div>

                {errorMessage && (
                    <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg mb-6 text-center">
                        <p>{errorMessage}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <ParticipantCard
                        name="Yalla Learn AI"
                        role="Educational Coach"
                        status={getAssistantStatus()}
                        avatarSrc="/avatars/coach-avatar.png"
                        isActive={isSpeaking && isConnected}
                    />

                    <ParticipantCard
                        name={user ? `${user.firstName} ${user.lastName}` : "You"}
                        role="Learner"
                        status={isConnected ? "Ready" : "Waiting..."}
                        avatarSrc={user?.avatar || ""}
                        isActive={!isSpeaking && isConnected}
                    />
                </div>

                <div className="flex justify-center mt-6">
                    <CallButton
                        onClick={isConnected ? endCall : startCall}
                        isConnected={isConnected}
                        isConnecting={isConnecting}
                        disabled={isConnecting || !isApiKeyValid}
                    />
                </div>
            </div>
        </div>
    )
}

// Assistant configuration
const assistantOptions = {
    name: "Yalla Learn Assistance",
    firstMessage: "Hi! I'm your academic assistant from Yalla Learn. How can I help you with your studies today?",
    transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
    },
    voice: {
        provider: "playht",
        voiceId: "jennifer",
    },
    model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.5,
        maxTokens: 250,
        messages: [
            {
                role: "system",
                content: `You are a voice assistant for Yalla Learn, an educational platform designed to help users learn new skills and knowledge.

                Your job is to assist users with their learning needs, answer questions, and provide guidance on various educational topics.

                You can help with:
                1) Explaining complex concepts in simple terms
                2) Providing learning resources and recommendations
                3) Answering questions on a wide range of academic and practical subjects
                4) Offering study tips and learning strategies

                Be friendly, supportive, and encouraging. Your goal is to make learning accessible and enjoyable for all users.

                If the user goes off-topic or asks about something inappropriate, politely steer the conversation back to educational topics.

                - Be engaging and enthusiastic about learning
                - Keep your responses concise and easy to understand
                - Use conversational language appropriate for a voice assistant
                - Encourage questions and curiosity`,
            },
        ],
    },
}
