'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useCreateContactForm } from '@/hooks/support/useSupport';
import { supportFormSchema } from '@/lib/validations/support.validations';

// FAQ data
const faqItems = [
    {
        question: "How do I get started with Yalla Learn?",
        answer: "Simply sign up for an account, complete your profile, and you'll have immediate access to our productivity tools and AI features. Check out our getting started guide for a step-by-step walkthrough."
    },
    {
        question: "Are all features available in the free plan?",
        answer: "The free plan gives you access to basic features including task management, note-taking, and limited AI tool usage. Premium plans unlock advanced features like unlimited AI tools, priority support, and advanced analytics."
    },
    {
        question: "How can I collaborate with other students?",
        answer: "You can create or join study groups through the dashboard. Once in a group, you can share resources, create group schedules, and communicate with other members."
    },
    {
        question: "Is my data secure on Yalla Learn?",
        answer: "Yes, we take data security very seriously. All data is encrypted both in transit and at rest. We never share your personal information with third parties without your explicit consent."
    },
    {
        question: "Can I export my data from Yalla Learn?",
        answer: "Yes, you can export your data in various formats including PDF, Excel, and JSON from your account settings page."
    },
    {
        question: "How do I report a bug or suggest a feature?",
        answer: "You can use the support form on this page to report bugs or suggest features. We value user feedback and actively incorporate suggestions into our development roadmap."
    },
];

export default function SupportPage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const createContactForm = useCreateContactForm();

    const form = useForm<z.infer<typeof supportFormSchema>>({
        resolver: zodResolver(supportFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    function onSubmit(values: z.infer<typeof supportFormSchema>) {
        createContactForm.mutate(values, {
            onSuccess: () => {
                setIsSuccess(true);
                form.reset();

                setTimeout(() => {
                    setIsSuccess(false);
                }, 5000);
            }
        });
    }

    return (
        <div className="container mx-auto py-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                    Support & Help Center
                </h1>
                <p className="text-xl max-w-3xl mx-auto">
                    Have questions or need assistance? We're here to help you get the most out of Yalla Learn.
                </p>
            </motion.div>

            {/* Main Content */}
            <Tabs defaultValue="contact" className="mb-16">
                <TabsList className="grid w-full max-w-md mx-auto md:grid-cols-2">
                    <TabsTrigger value="contact">Contact Us</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                {/* Contact Form */}
                <TabsContent value="contact" className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col justify-center"
                        >
                            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                            <p className="text-lg mb-6">
                                We'd love to hear from you! Fill out the form and our team will get back to you as soon as possible.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Form</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Your name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="your.email@example.com" type="email" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="subject"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Subject</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="How can we help you?" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="message"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Message</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Please describe your issue or question in detail..."
                                                                className="min-h-[120px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={createContactForm.isPending}
                                            >
                                                {createContactForm.isPending ? 'Sending...' : 'Send Message'}
                                            </Button>

                                            {isSuccess && (
                                                <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
                                                    Thank you for reaching out! Your message has been sent successfully. We'll get back to you shortly.
                                                </div>
                                            )}
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* FAQ Section */}
                <TabsContent value="faq" className="mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

                        <div className="space-y-6">
                            {faqItems.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                >
                                    <Card className="overflow-hidden">
                                        <CardHeader className="bg-muted/50 py-4">
                                            <CardTitle className="text-lg">{faq.question}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <p>{faq.answer}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <p className="text-lg mb-4">Didn't find what you're looking for?</p>
                            <Link href="/support">
                                <Button>
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}