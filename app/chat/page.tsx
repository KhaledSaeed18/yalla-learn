// src/app/chat/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import ConversationList from '@/components/chat/ConversationList';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';

const ChatPage: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        // Check authentication state
        if (!isAuthenticated) {
            toast.error("Authentication required", {
                description: "Please sign in to access the chat."
            });
            router.push('/auth/signin?redirect=/chat');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                    <p className="mb-4">Please sign in to access the chat feature.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] flex">
            <div className="w-1/3 border-r">
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold">Conversations</h2>
                    </div>
                    <ConversationList />
                </div>
            </div>

            <div className="w-2/3 flex flex-col">
                <MessageList />
                <MessageInput />
            </div>
        </div>
    );
};

export default ChatPage;