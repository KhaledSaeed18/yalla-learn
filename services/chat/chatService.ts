import { api } from '@/lib/api/baseAPI';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    content: string;
    read: boolean;
    createdAt: string;
    sender?: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
}

interface Conversation {
    _id: string;
    listingId: string;
    listing: {
        id: string;
        title: string;
        images?: string[];
    };
    participant: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    lastMessage?: Message;
    unreadCount?: number;
    createdAt: string;
    updatedAt: string;
}

interface ConversationResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        conversations: Conversation[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
}

interface MessagesResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        conversation: Conversation;
        messages: Message[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
}

interface CreateConversationResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        conversation: Conversation;
    };
}

class ChatService {
    private socket: Socket | null = null;
    private accessToken: string | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;

    // Initialize socket connection
    initializeSocket(token: string): void {
        if (this.socket?.connected && this.accessToken === token) {
            console.log('Socket already connected with the same token');
            return;
        }

        // Disconnect existing socket if any
        this.disconnectSocket();

        this.accessToken = token;
        this.reconnectAttempts = 0;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5005';

        try {
            this.socket = io(socketUrl, {
                auth: {
                    token
                },
                transports: ['websocket'],
                autoConnect: true,
                reconnectionAttempts: 3,
                reconnectionDelay: 1000,
                timeout: 10000
            });

            this.socket.on('connect', () => {
                console.log('Socket connected:', this.socket?.id);
                this.reconnectAttempts = 0;
                if (this.reconnectTimeout) {
                    clearTimeout(this.reconnectTimeout);
                    this.reconnectTimeout = null;
                }
            });

            this.socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                if (error.message.includes('auth') || error.message.includes('token') || error.message.includes('unauthorized')) {
                    toast.error("Authentication error", {
                        description: "Your session may have expired. Please try refreshing the page."
                    });
                }
                this.handleReconnect();
            });

            this.socket.on('disconnect', (reason) => {
                console.warn('Socket disconnected:', reason);
                if (reason === 'io server disconnect' || reason === 'io client disconnect') {
                    // The server/client has forcefully disconnected the socket
                    this.handleReconnect();
                }
            });

            this.socket.on('error', (error) => {
                console.error('Socket error:', error);
                if (typeof error === 'string' && (error.includes('auth') || error.includes('unauthorized'))) {
                    toast.error("Chat connection error", {
                        description: error
                    });
                }
            });
        } catch (error) {
            console.error('Failed to initialize socket:', error);
            toast.error("Chat connection failed", {
                description: error instanceof Error ? error.message : "Could not connect to chat server"
            });
        }
    }

    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnect attempts reached');
            toast.error("Connection lost", {
                description: "Could not reconnect to the chat server. Please refresh the page."
            });
            return;
        }

        this.reconnectAttempts++;

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);

        this.reconnectTimeout = setTimeout(() => {
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            if (this.accessToken) {
                this.initializeSocket(this.accessToken);
            }
        }, delay);
    }

    // Disconnect socket
    disconnectSocket(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    // Fetch user conversations with pagination
    async getUserConversations(page = 1, limit = 20): Promise<ConversationResponse> {
        try {
            return await api.get<ConversationResponse>('/chat/conversations', { page, limit });
        } catch (error) {
            console.error('Error fetching conversations:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : typeof error === 'object' && error && 'message' in error
                    ? (error as any).message
                    : 'Failed to load conversations';

            if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || (error as any)?.status === 401) {
                toast.error("Authentication Error", {
                    description: "Your session may have expired. Please refresh the page."
                });
            }

            throw error;
        }
    }

    // Fetch messages for a specific conversation
    async getConversationMessages(conversationId: string, page = 1, limit = 50): Promise<MessagesResponse> {
        return api.get<MessagesResponse>(`/chat/conversations/${conversationId}/messages`, { page, limit });
    }

    // Create or get conversation with listing owner
    async createOrGetConversation(listingId: string): Promise<CreateConversationResponse> {
        try {
            return await api.post<CreateConversationResponse>('/chat/conversations', { listingId });
        } catch (error) {
            console.error('Error creating conversation:', error);

            const errorMessage = error instanceof Error
                ? error.message
                : typeof error === 'object' && error && 'message' in error
                    ? (error as any).message
                    : 'Failed to create conversation';

            if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || (error as any)?.status === 401) {
                toast.error("Authentication Error", {
                    description: "Your session may have expired. Please refresh the page."
                });
            }

            throw error;
        }
    }

    // Join a specific conversation room
    joinConversation(conversationId: string): void {
        if (this.socket && this.socket.connected) {
            this.socket.emit('join-conversation', conversationId);
        }
    }

    // Send a message
    sendMessage(conversationId: string, content: string): void {
        if (this.socket && this.socket.connected) {
            this.socket.emit('send-message', {
                conversationId,
                content
            });
        }
    }

    // Create a new conversation and send first message
    sendNewConversationMessage(listingId: string, receiverId: string, content: string): void {
        if (this.socket && this.socket.connected) {
            this.socket.emit('send-message', {
                conversationId: '', // Empty for new conversation
                listingId,
                receiverId,
                content
            });
        }
    }

    // Mark all messages in a conversation as read
    markMessagesAsRead(conversationId: string): void {
        if (this.socket && this.socket.connected) {
            this.socket.emit('mark-read', conversationId);
        }
    }

    // Listen for new messages
    onNewMessage(callback: (message: Message) => void): void {
        if (this.socket) {
            this.socket.on('new-message', (data) => {
                callback(data.message);
            });
        }
    }

    // Listen for new conversations
    onNewConversation(callback: (data: { conversation: Conversation }) => void): void {
        if (this.socket) {
            this.socket.on('new-conversation', callback);
        }
    }

    // Listen for messages being read
    onMessagesRead(callback: (data: { conversationId: string, readBy: string }) => void): void {
        if (this.socket) {
            this.socket.on('messages-read', callback);
        }
    }

    // Listen for notifications
    onNotification(callback: (data: { type: string, data: any }) => void): void {
        if (this.socket) {
            this.socket.on('notification', callback);
        }
    }

    // Remove a specific socket listener
    removeListener(event: string): void {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    // Check if socket is connected
    isSocketConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Reconnect socket with new token if needed
    reconnect(token: string): void {
        if (this.accessToken !== token) {
            this.initializeSocket(token);
        } else if (!this.isSocketConnected()) {
            this.initializeSocket(token);
        }
    }
}

export const chatService = new ChatService();