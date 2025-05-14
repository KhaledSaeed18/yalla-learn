'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                    About Yalla Learn
                </h1>
                <p className="text-xl max-w-3xl mx-auto">
                    Empowering students with the tools they need to excel in their educational journey and beyond.
                </p>
            </motion.div>

            {/* Mission Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col justify-center"
                >
                    <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                    <p className="text-lg mb-4">
                        At Yalla Learn, we believe that education should be accessible, collaborative, and tailored to individual needs. Our platform combines productivity tools, AI-powered learning assistants, and community features to create a comprehensive ecosystem for students.
                    </p>
                    <p className="text-lg">
                        We're dedicated to helping students manage their academic responsibilities, enhance their learning experience, and connect with peers who share their educational journey.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative h-[400px] rounded-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 sm:w-60 sm:h-60 bg-primary/90 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-3xl">
                            Yalla Learn
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-24"
            >
                <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">AI-Powered Tools</h3>
                        <p>Leverage the power of artificial intelligence to enhance your learning experience with concept explainers, flashcards, quizzes, and more.</p>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Productivity Tools</h3>
                        <p>Stay organized and focused with our suite of productivity tools, including Pomodoro timers, focus mode, kanban boards, and expense trackers.</p>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Community & Collaboration</h3>
                        <p>Connect with fellow students, share resources, and collaborate on projects to enhance your educational experience.</p>
                    </Card>
                </div>
            </motion.div>

            {/* Vision Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.2 }}
                className="bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-xl p-8 mb-24"
            >
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                    <p className="text-lg mb-6">
                        We envision a future where every student has access to the tools, resources, and community they need to thrive academically and personally. Yalla Learn aims to be the central hub for student productivity, collaboration, and AI-enhanced learning.
                    </p>
                    <p className="text-lg font-medium">
                        Join us in revolutionizing the educational experience!
                    </p>
                </div>
            </motion.div>
            

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2 }}
                className="text-center"
            >
                <h2 className="text-3xl font-bold mb-6">Join Yalla Learn Today</h2>
                <p className="text-xl max-w-3xl mx-auto mb-8">
                    Experience the future of education with our comprehensive platform designed for students by students.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <a href="/auth/signup" className="bg-primary dark:text-black text-white px-8 py-3 rounded-lg font-medium transition-colors">
                        Sign Up Now
                    </a>
                    <a href="/support" className="bg-secondary px-8 py-3 rounded-lg font-medium transition-colors">
                        Contact Us
                    </a>
                </div>
            </motion.div>
        </div>
    );
}