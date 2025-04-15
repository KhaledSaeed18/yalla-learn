import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '../ui/dialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// For testing purposes
const TEST_LISTING_ID = 'cm9i906v40003twkfyz0mj2ks';
const TEST_RECEIVER_ID = 'cm9i8jema0000twa8vxmk5kaa';

interface ContactOwnerButtonProps {
    listingId: string;
    ownerId: string;
}

const ContactOwnerButton: React.FC<ContactOwnerButtonProps> = ({ listingId, ownerId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { createConversation, sendNewMessage } = useChat();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    // Use the provided IDs or fall back to test IDs if they're empty
    const effectiveListingId = listingId || TEST_LISTING_ID;
    const effectiveOwnerId = ownerId || TEST_RECEIVER_ID;

    const handleContact = async () => {
        if (!message.trim()) return;

        if (!isAuthenticated) {
            toast.error('Authentication required', {
                description: 'Please sign in to contact the owner',
            });
            router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Add some debug logging
            console.log(`Creating conversation for listing: ${effectiveListingId}`);

            // Create or get conversation
            const conversationId = await createConversation(effectiveListingId);

            if (!conversationId) {
                throw new Error('Failed to create conversation');
            }

            console.log(`Sending message to owner: ${effectiveOwnerId}`);

            // Send initial message
            sendNewMessage(effectiveListingId, effectiveOwnerId, message);

            // Show success message
            toast.success('Message sent!', {
                description: 'Your message has been sent to the owner.'
            });

            // Close dialog and redirect to chat
            setIsOpen(false);
            router.push(`/chat?conversation=${conversationId}`);
        } catch (error) {
            console.error('Error starting conversation:', error);

            // Handle different error types
            if (error instanceof Error) {
                setError(error.message);

                if (error.message.includes('unauthorized') || error.message.includes('Authentication')) {
                    toast.error('Authentication error', {
                        description: 'Your session may have expired. Please sign in again.'
                    });
                    router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname));
                } else {
                    toast.error('Failed to send message', {
                        description: error.message || 'Please try again later'
                    });
                }
            } else {
                toast.error('Something went wrong', {
                    description: 'Failed to contact owner. Please try again.'
                });
                setError('Failed to contact owner');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (open && !isAuthenticated) {
            toast.error('Authentication required', {
                description: 'Please sign in to contact the owner'
            });
            router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }
        setIsOpen(open);
        if (!open) {
            setMessage('');
            setError(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    Contact Owner
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <div className="text-xs text-gray-500 mb-2">
                    Using: listing={effectiveListingId.substring(0, 8)}... owner={effectiveOwnerId.substring(0, 8)}...
                </div>

                <Textarea
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full mb-4"
                    disabled={loading}
                />

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => setIsOpen(false)}
                        className="mr-2"
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleContact}
                        disabled={!message.trim() || loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ContactOwnerButton;