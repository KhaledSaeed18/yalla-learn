"use client"

import QuestionForm from "@/components/QuestionForm";

export default function AskQuestionPage() {
    return (
        <div className="container px-0 mx-auto">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Ask a Question</h1>
            </div>

            <QuestionForm mode="create" />
        </div>
    );
}
