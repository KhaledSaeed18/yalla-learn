import React from 'react';
import ChatTester from '@/components/chat/ChatTester';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chat Testing | RealRental',
    description: 'Test the messaging functionality',
};

export default function ChatTestPage() {
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">Chat Testing Page</h1>
            <p className="mb-4 text-gray-600">
                Use this page to test chat functionality with hardcoded values.
            </p>

            <div className="my-6">
                <ChatTester />
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-md">
                <h2 className="font-semibold mb-2">Test Configuration</h2>
                <p className="text-sm text-gray-600 mb-1">
                    Listing ID: <code className="bg-gray-100 p-1 rounded">cm9i906v40003twkfyz0mj2ks</code>
                </p>
                <p className="text-sm text-gray-600">
                    User ID: <code className="bg-gray-100 p-1 rounded">cm9i8jema0000twa8vxmk5kaa</code>
                </p>
            </div>
        </div>
    );
}
