'use client'

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import { chatService } from '@/services/chat/chatService';
import { toast } from 'sonner';

// Hardcoded values for testing
const TEST_LISTING_ID = 'cm9i906v40003twkfyz0mj2ks';
const TEST_RECEIVER_ID = 'cm9i8jema0000twa8vxmk5kaa';

const ChatTester: React.FC = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [socketStatus, setSocketStatus] = useState<'connected' | 'disconnected'>('disconnected');
    const { sendNewMessage, createConversation } = useChat();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Check socket connection status periodically
    React.useEffect(() => {
        const checkSocketStatus = () => {
            const isConnected = chatService.isSocketConnected();
            setSocketStatus(isConnected ? 'connected' : 'disconnected');
        };

        checkSocketStatus(); // Check immediately
        const interval = setInterval(checkSocketStatus, 3000); // Then check every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handleSendTestMessage = async () => {
        if (!message.trim()) return;

        setLoading(true);
        try {
            // First create or get conversation
            const conversationId = await createConversation(TEST_LISTING_ID);
            console.log('Conversation created or retrieved:', conversationId);

            // Then send the message
            sendNewMessage(TEST_LISTING_ID, TEST_RECEIVER_ID, message);

            toast.success('Test message sent!', {
                description: `Message sent to listing ID: ${TEST_LISTING_ID}`
            });

            setMessage('');
        } catch (error) {
            console.error('Error sending test message:', error);
            toast.error('Failed to send test message', {
                description: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4 border rounded bg-gray-50">
                <p className="text-sm text-gray-600">Sign in to test the chat functionality</p>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded">
            <h3 className="font-medium mb-2">Chat Testing Panel</h3>

            <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${socketStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                <span className="text-xs text-gray-600">
                    Socket: {socketStatus}
                </span>
            </div>

            <div className="text-xs text-gray-500 mb-4">
                <p>Testing with:</p>
                <p>Listing ID: {TEST_LISTING_ID}</p>
                <p>Receiver ID: {TEST_RECEIVER_ID}</p>
            </div>

            <Textarea
                placeholder="Write your test message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full mb-4"
                disabled={loading}
            />

            <Button
                onClick={handleSendTestMessage}
                disabled={!message.trim() || loading}
                size="sm"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    'Send Test Message'
                )}
            </Button>
        </div>
    );
};

export default ChatTester;
