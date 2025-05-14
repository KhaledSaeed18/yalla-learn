"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetQaTags } from "@/hooks/qa/useQaTags";
import { useCreateQuestion, useUpdateQuestion } from "@/hooks/qa/useQa";
import { questionSchema, QuestionFormValues } from "@/lib/qa/validation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import Select from 'react-select';
import { useTheme } from "next-themes";

interface QuestionFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        id?: string;
        title: string;
        content: string;
        tags: string[];
    };
}

export default function QuestionForm({ mode, initialData }: QuestionFormProps) {
    const router = useRouter();
    const { data: tags = [], isLoading: tagsLoading } = useGetQaTags();
    const createQuestion = useCreateQuestion();
    const updateQuestion = useUpdateQuestion();
    const [content, setContent] = useState<string>(initialData?.content || "");
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === "dark";

    const tagOptions = tags.map(tag => ({
        value: tag.id,
        label: tag.name
    }));

    const selectStyles = {
        control: (base: any) => ({
            ...base,
            background: isDarkMode ? "hsl(240 10% 3.9%)" : base.background,
            borderColor: isDarkMode ? "hsl(240 3.7% 15.9%)" : base.borderColor,
            boxShadow: isDarkMode ? "none" : base.boxShadow,
            "&:hover": {
                borderColor: isDarkMode ? "hsl(240 5% 64.9%)" : base.borderColor,
            },
        }),
        menu: (base: any) => ({
            ...base,
            background: isDarkMode ? "hsl(240 10% 3.9%)" : base.background,
            borderColor: isDarkMode ? "hsl(240 3.7% 15.9%)" : base.borderColor,
            boxShadow: isDarkMode ? "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)" : base.boxShadow,
        }),
        option: (base: any, state: { isFocused: boolean; isSelected: boolean }) => ({
            ...base,
            backgroundColor: isDarkMode
                ? state.isSelected 
                    ? "hsl(240 5.9% 10%)" 
                    : state.isFocused 
                        ? "hsl(240 4.9% 15%)" 
                        : base.backgroundColor
                : base.backgroundColor,
            color: isDarkMode ? "hsl(0 0% 98%)" : base.color,
            "&:active": {
                backgroundColor: isDarkMode ? "hsl(240 5.9% 10%)" : base.backgroundColor,
            },
        }),
        multiValue: (base: any) => ({
            ...base,
            backgroundColor: isDarkMode ? "hsl(240 5.9% 10%)" : base.backgroundColor,
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: isDarkMode ? "hsl(0 0% 98%)" : base.color,
        }),
        multiValueRemove: (base: any) => ({
            ...base,
            color: isDarkMode ? "hsl(0 0% 98%)" : base.color,
            "&:hover": {
                backgroundColor: isDarkMode ? "hsl(0 72.2% 50.6%)" : base.backgroundColor,
                color: isDarkMode ? "white" : base.color,
            },
        }),
        input: (base: any) => ({
            ...base,
            color: isDarkMode ? "hsl(0 0% 98%)" : base.color,
        }),
        placeholder: (base: any) => ({
            ...base,
            color: isDarkMode ? "hsl(240 5% 64.9%)" : base.color,
        }),
        singleValue: (base: any) => ({
            ...base,
            color: isDarkMode ? "hsl(0 0% 98%)" : base.color,
        }),
    };

    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            title: initialData?.title || "",
            content: initialData?.content || "",
            tags: initialData?.tags || [],
            status: "OPEN"
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                content: initialData.content,
                tags: initialData.tags,
                status: "OPEN"
            });
            setContent(initialData.content);
        }
    }, [initialData, form]);

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/&/g, '-and-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    const onSubmit = (data: QuestionFormValues) => {
        if (mode === 'create') {
            const questionData = {
                title: data.title,
                content, 
                tags: data.tags,
                slug: slugify(data.title)
            };

            createQuestion.mutate(questionData, {
                onSuccess: () => {
                    router.push('/dashboard/qa');
                }
            });
        } else if (mode === 'edit' && initialData?.id) {
            const questionData = {
                title: data.title,
                content,
                tags: data.tags
            };

            updateQuestion.mutate({
                id: initialData.id,
                questionData
            }, {
                onSuccess: () => {
                    router.push('/dashboard/qa');
                }
            });
        }
    };

    const handleEditorChange = (html: string) => {
        setContent(html);
        form.setValue("content", html, { shouldValidate: true });
    };

    const isPending = mode === 'create' ? createQuestion.isPending : updateQuestion.isPending;
    const error = mode === 'create' ? createQuestion.error : updateQuestion.error;
    const isError = mode === 'create' ? createQuestion.isError : updateQuestion.isError;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{mode === 'create' ? 'New Question' : 'Edit Question'}</CardTitle>
                <CardDescription>
                    {mode === 'create'
                        ? 'Provide details about your question to get better answers'
                        : 'Update your question details'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="What's your question? Be specific."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The title should summarize your question (5-255 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question Details</FormLabel>
                                    <FormControl>
                                        <TipTapEditor
                                            onChange={handleEditorChange}
                                            content={content}
                                            placeholder="Explain your question in detail. Include any relevant code, research, or context."
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide as much detail as possible (minimum 20 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        {tagsLoading ? (
                                            <Skeleton className="h-10 w-full" />
                                        ) : (
                                            <Select
                                                isMulti
                                                options={tagOptions}
                                                placeholder="Select tags that relate to your question"
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                styles={selectStyles}
                                                onChange={(selectedOptions) => {
                                                    const selectedValues = selectedOptions ?
                                                        selectedOptions.map(option => option.value) :
                                                        [];
                                                    field.onChange(selectedValues);
                                                }}
                                                value={tagOptions.filter(option =>
                                                    field.value.includes(option.value)
                                                )}
                                                isLoading={tagsLoading}
                                            />
                                        )}
                                    </FormControl>
                                    <FormDescription>
                                        Select at least one tag to categorize your question
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {(error as any)?.message || `Failed to ${mode === 'create' ? 'post' : 'update'} question. Please try again.`}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/dashboard/qa')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || !form.formState.isValid || content.length < 20}
                            >
                                {isPending
                                    ? (mode === 'create' ? "Posting..." : "Updating...")
                                    : (mode === 'create' ? "Post Question" : "Update Question")
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
