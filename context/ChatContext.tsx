"use client";
// src/contexts/ChatContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { chatService } from '@/services/chat/chatService';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';

interface ChatContextType {
    conversations: any[];
    currentConversation: string | null;
    messages: Record<string, any[]>;
    unreadCounts: Record<string, number>;
    loadingConversations: boolean;
    loadingMessages: boolean;
    errors: {
        conversations: string | null;
        messages: Record<string, string | null>;
    };
    loadMoreConversations: () => Promise<void>;
    loadMoreMessages: (conversationId: string) => Promise<void>;
    selectConversation: (conversationId: string) => void;
    sendMessage: (content: string) => void;
    createConversation: (listingId: string) => Promise<string>;
    sendNewMessage: (listingId: string, receiverId: string, content: string) => void;
    clearErrors: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, accessToken, user } = useSelector((state: RootState) => state.auth);

    const [conversations, setConversations] = useState<any[]>([]);
    const [currentConversation, setCurrentConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, any[]>>({});
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [errors, setErrors] = useState({
        conversations: null as string | null,
        messages: {} as Record<string, string | null>
    });
    const [pagination, setPagination] = useState({
        conversations: { page: 1, hasMore: true },
        messages: {} as Record<string, { page: number; hasMore: boolean }>
    });

    // Initialize socket when auth state changes
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            // Initialize or reconnect socket with current token
            chatService.reconnect(accessToken);
            fetchConversations();

            // Setup socket listeners
            chatService.onNewMessage((message) => {
                handleNewMessage(message);
            });

            chatService.onNewConversation(({ conversation }) => {
                setConversations((prev) => [conversation, ...prev]);
            });

            chatService.onMessagesRead(({ conversationId, readBy }) => {
                if (readBy !== currentConversation) {
                    updateMessagesReadStatus(conversationId);
                }
            });
        } else if (!isAuthenticated) {
            // Clean up when logged out
            chatService.disconnectSocket();
            setConversations([]);
            setMessages({});
            setCurrentConversation(null);
            setPagination({
                conversations: { page: 1, hasMore: true },
                messages: {}
            });
        }

        return () => {
            chatService.removeListener('new-message');
            chatService.removeListener('new-conversation');
            chatService.removeListener('messages-read');
            chatService.removeListener('notification');
        };
    }, [isAuthenticated, accessToken]);

    // Check socket connection periodically
    useEffect(() => {
        if (!isAuthenticated || !accessToken) return;

        const checkConnectionInterval = setInterval(() => {
            if (isAuthenticated && accessToken && !chatService.isSocketConnected()) {
                console.log('Reconnecting socket due to lost connection...');
                chatService.reconnect(accessToken);
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(checkConnectionInterval);
    }, [isAuthenticated, accessToken]);

    const fetchConversations = useCallback(async () => {
        if (loadingConversations || !pagination.conversations.hasMore || !isAuthenticated) return;

        setLoadingConversations(true);
        setErrors(prev => ({ ...prev, conversations: null }));

        try {
            // Add a timeout to the fetch request to handle network issues
            const fetchWithTimeout = new Promise(async (resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('Network request timed out. Please check your connection.'));
                }, 15000); // 15 second timeout

                try {
                    const response = await chatService.getUserConversations(
                        pagination.conversations.page,
                        20
                    );
                    clearTimeout(timeoutId);
                    resolve(response);
                } catch (error) {
                    clearTimeout(timeoutId);
                    reject(error);
                }
            });

            const response = await fetchWithTimeout as any;

            // Validate response structure
            if (!response || !response.data || !Array.isArray(response.data.conversations)) {
                throw new Error('Invalid response format from server');
            }

            const { conversations: newConversations, pagination: paginationData } = response.data;

            setConversations((prev) =>
                pagination.conversations.page === 1
                    ? newConversations
                    : [...prev, ...newConversations]
            );

            // Update unread counts
            const newUnreadCounts = { ...unreadCounts };
            newConversations.forEach((conv) => {
                newUnreadCounts[conv._id] = conv.unreadCount || 0;
            });
            setUnreadCounts(newUnreadCounts);

            setPagination(prev => ({
                ...prev,
                conversations: {
                    page: paginationData.page + 1,
                    hasMore: paginationData.page < paginationData.pages
                }
            }));
        } catch (error) {
            // Enhanced error detection and formatting
            let errorMessage = 'Failed to fetch conversations. Please try again later.';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
                // Try to extract useful information from the error object
                const errorObj = error as any;
                if (errorObj.status) {
                    // If we get a 401, the token might be expired
                    if (errorObj.status === 401) {
                        errorMessage = "Your session may have expired. Please refresh the page.";
                        toast.error("Authentication Error", {
                            description: errorMessage
                        });
                    } else {
                        errorMessage += ` (Status: ${errorObj.status})`;
                    }
                }
                if (errorObj.message) errorMessage = errorObj.message;
                if (errorObj.code) errorMessage += ` (Code: ${errorObj.code})`;
            }

            console.error('Error fetching conversations:', error);
            setErrors(prev => ({ ...prev, conversations: errorMessage }));
        } finally {
            setLoadingConversations(false);
        }
    }, [isAuthenticated, loadingConversations, pagination.conversations.hasMore, pagination.conversations.page, unreadCounts]);

    const fetchMessages = async (conversationId: string, reset = false) => {
        if (!conversationId) return;

        setLoadingMessages(true);
        setErrors(prev => ({
            ...prev,
            messages: {
                ...prev.messages,
                [conversationId]: null
            }
        }));

        const page = reset
            ? 1
            : (pagination.messages[conversationId]?.page || 1);

        if (!reset && pagination.messages[conversationId]?.hasMore === false) {
            setLoadingMessages(false);
            return;
        }

        try {
            // Add a timeout to the fetch request to handle network issues
            const fetchWithTimeout = new Promise(async (resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('Network request timed out. Please check your connection.'));
                }, 15000); // 15 second timeout

                try {
                    const response = await chatService.getConversationMessages(
                        conversationId,
                        page,
                        50
                    );
                    clearTimeout(timeoutId);
                    resolve(response);
                } catch (error) {
                    clearTimeout(timeoutId);
                    reject(error);
                }
            });

            const response = await fetchWithTimeout as any;

            // Validate response structure
            if (!response || !response.data || !Array.isArray(response.data.messages)) {
                throw new Error('Invalid response format from server');
            }

            const { messages: newMessages, pagination: paginationData } = response.data;

            setMessages(prev => ({
                ...prev,
                [conversationId]: reset
                    ? newMessages
                    : [...(prev[conversationId] || []), ...newMessages]
            }));

            setPagination(prev => ({
                ...prev,
                messages: {
                    ...prev.messages,
                    [conversationId]: {
                        page: paginationData.page + 1,
                        hasMore: paginationData.page < paginationData.pages
                    }
                }
            }));
        } catch (error) {
            // Enhanced error detection and formatting
            let errorMessage = 'Failed to fetch messages. Please try again later.';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
                // Try to extract useful information from the error object
                const errorObj = error as any;
                if (errorObj.status) errorMessage += ` (Status: ${errorObj.status})`;
                if (errorObj.message) errorMessage = errorObj.message;
                if (errorObj.code) errorMessage += ` (Code: ${errorObj.code})`;
            }

            console.error('Error fetching messages:', error);
            setErrors(prev => ({
                ...prev,
                messages: {
                    ...prev.messages,
                    [conversationId]: errorMessage
                }
            }));
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleNewMessage = (message: any) => {
        const conversationId = message.conversationId;

        // Add message to conversation
        setMessages(prev => ({
            ...prev,
            [conversationId]: [message, ...(prev[conversationId] || [])]
        }));

        // Update unread count if not in current conversation
        if (currentConversation !== conversationId) {
            setUnreadCounts(prev => ({
                ...prev,
                [conversationId]: (prev[conversationId] || 0) + 1
            }));
        }

        // Move conversation to top of list
        setConversations(prev => {
            const existingConv = prev.find(c => c._id === conversationId);
            if (existingConv) {
                const updatedConv = {
                    ...existingConv,
                    lastMessage: message,
                    updatedAt: new Date().toISOString()
                };

                return [
                    updatedConv,
                    ...prev.filter(c => c._id !== conversationId)
                ];
            }
            return prev;
        });
    };

    const updateMessagesReadStatus = (conversationId: string) => {
        setMessages(prev => {
            const conversationMessages = prev[conversationId];
            if (!conversationMessages) return prev;

            const updatedMessages = conversationMessages.map(msg => ({
                ...msg,
                read: true
            }));

            return {
                ...prev,
                [conversationId]: updatedMessages
            };
        });
    };

    const loadMoreConversations = async () => {
        await fetchConversations();
    };

    const loadMoreMessages = async (conversationId: string) => {
        await fetchMessages(conversationId);
    };

    const selectConversation = (conversationId: string) => {
        setCurrentConversation(conversationId);
    };

    const sendMessage = (content: string) => {
        if (!currentConversation || !content.trim()) return;

        chatService.sendMessage(currentConversation, content.trim());
    };

    const createConversation = async (listingId: string): Promise<string> => {
        try {
            const response = await chatService.createOrGetConversation(listingId);
            const newConversationId = response.data.conversation._id;

            // Add to conversations if not already there
            setConversations(prev => {
                if (!prev.some(c => c._id === newConversationId)) {
                    return [response.data.conversation, ...prev];
                }
                return prev;
            });

            return newConversationId;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to create conversation. Please try again later.';

            console.error('Error creating conversation:', error);
            throw new Error(errorMessage);
        }
    };

    const sendNewMessage = (listingId: string, receiverId: string, content: string) => {
        if (!content.trim()) return;

        chatService.sendNewConversationMessage(listingId, receiverId, content.trim());
    };

    const clearErrors = () => {
        setErrors({
            conversations: null,
            messages: {}
        });
    };

    // Add this utility function to help with debugging network issues
    useEffect(() => {
        // Log errors to help with debugging
        if (errors.conversations) {
            console.warn('Chat conversation error state:', errors.conversations);
        }

        Object.entries(errors.messages).forEach(([convId, error]) => {
            if (error) {
                console.warn(`Chat messages error for conversation ${convId}:`, error);
            }
        });
    }, [errors]);

    return (
        <ChatContext.Provider
            value={{
                conversations,
                currentConversation,
                messages,
                unreadCounts,
                loadingConversations,
                loadingMessages,
                errors,
                loadMoreConversations,
                loadMoreMessages,
                selectConversation,
                sendMessage,
                createConversation,
                sendNewMessage,
                clearErrors
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};