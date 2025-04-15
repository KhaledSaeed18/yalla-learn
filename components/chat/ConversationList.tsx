import React from 'react';
import { useChat } from '@/context/ChatContext';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

const ConversationList: React.FC = () => {
    const {
        conversations,
        currentConversation,
        selectConversation,
        loadMoreConversations,
        unreadCounts,
        loadingConversations
    } = useChat();

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No conversations yet
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation._id}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${currentConversation === conversation._id ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => selectConversation(conversation._id)}
                        >
                            <div className="flex items-center">
                                <div className="relative">
                                    {conversation.participant.avatar ? (
                                        <Image
                                            src={conversation.participant.avatar}
                                            alt="Profile"
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-xl text-gray-600">
                                                {conversation.participant.firstName[0]}
                                            </span>
                                        </div>
                                    )}

                                    {unreadCounts[conversation._id] > 0 && (
                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            {unreadCounts[conversation._id] > 9 ? '9+' : unreadCounts[conversation._id]}
                                        </div>
                                    )}
                                </div>

                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">
                                            {conversation.participant.firstName} {conversation.participant.lastName}
                                        </h3>
                                        {conversation.lastMessage && (
                                            <span className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 truncate">
                                        {conversation.lastMessage?.content || 'No messages yet'}
                                    </p>

                                    <div className="text-xs text-gray-500 mt-1">
                                        {conversation.listing.title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {loadingConversations && (
                    <div className="p-4 text-center">
                        <span className="animate-pulse">Loading...</span>
                    </div>
                )}
            </div>

            {conversations.length > 0 && (
                <button
                    onClick={loadMoreConversations}
                    className="p-2 text-blue-500 hover:bg-gray-50"
                    disabled={loadingConversations}
                >
                    Load more
                </button>
            )}
        </div>
    );
};

export default ConversationList;