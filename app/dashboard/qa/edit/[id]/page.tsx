"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetQuestion } from "@/hooks/qa/useQa";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import QuestionForm from "@/components/QuestionForm";

export default function EditQuestionPage() {
    const router = useRouter();
    const params = useParams();
    const questionId = params.id as string;

    const { data: question, isLoading, isError, error } = useGetQuestion(questionId);

    if (isLoading) {
        return (
            <div className="container px-0 mx-auto">
                <div className="flex items-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Edit Question</h1>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-10 w-1/2" />
                    <div className="flex justify-end gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container px-0 mx-auto">
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {(error as any)?.message || 'Failed to load question data. Please try again.'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="container px-0 mx-auto">
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Question not found or you don't have permission to edit it.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container px-0 mx-auto">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Edit Question</h1>
            </div>

            <QuestionForm
                mode="edit"
                initialData={{
                    id: question.id,
                    title: question.title,
                    content: question.content,
                    tags: question.tags.map(tag => tag.id),
                }}
            />
        </div>
    );
}
