// src/components/chat/MessageList.tsx
import React, { useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { formatRelative } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';

const MessageList: React.FC = () => {
    const {
        currentConversation,
        messages,
        loadMoreMessages,
        loadingMessages
    } = useChat();

    const { user } = useSelector((state: RootState) => state.auth);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversationMessages = currentConversation
        ? messages[currentConversation] || []
        : [];

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversationMessages.length]);

    if (!currentConversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between bg-white">
                <h2 className="font-semibold">
                    {/* You would need to get conversation details here */}
                    Chat
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
                <div ref={messagesEndRef} />

                {conversationMessages.map((message) => {
                    const isOwnMessage = message.senderId === user?.id;

                    return (
                        <div
                            key={message._id}
                            className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                {!isOwnMessage && (
                                    <div className="flex items-center mb-1">
                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 mr-2">
                                            {message.sender?.avatar ? (
                                                <Image
                                                    src={message.sender.avatar}
                                                    alt="Avatar"
                                                    width={24}
                                                    height={24}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {message.sender?.firstName?.[0] || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-600">
                                            {message.sender?.firstName || 'User'}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={`p-3 rounded-lg ${isOwnMessage
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 rounded-bl-none'
                                        }`}
                                >
                                    <p>{message.content}</p>
                                </div>

                                <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : ''}`}>
                                    {formatRelative(new Date(message.createdAt), new Date())}
                                    {isOwnMessage && (
                                        <span className="ml-2">
                                            {message.read ? '✓✓' : '✓'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {loadingMessages ? (
                    <div className="py-2 text-center">
                        <span className="animate-pulse">Loading messages...</span>
                    </div>
                ) : (
                    conversationMessages.length > 0 && (
                        <button
                            onClick={() => currentConversation && loadMoreMessages(currentConversation)}
                            className="p-2 text-blue-500 hover:bg-gray-50 self-center"
                        >
                            Load older messages
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default MessageList;