import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';

const MessageInput: React.FC = () => {
    const [message, setMessage] = useState('');
    const { currentConversation, sendMessage } = useChat();

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() && currentConversation) {
            sendMessage(message);
            setMessage('');
        }
    };

    if (!currentConversation) {
        return null;
    }

    return (
        <form onSubmit={handleSend} className="border-t p-4 bg-white">
            <div className="flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!currentConversation}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!message.trim() || !currentConversation}
                >
                    Send
                </button>
            </div>
        </form>
    );
};

export default MessageInput;