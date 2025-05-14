"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetQuestion, useGetAnswers, useCreateAnswer, useVoteAnswer, useAcceptAnswer, useGetUserVotes } from "@/hooks/qa/useQa";
import { QaAnswersQueryParams } from "@/types/qa/qa.types";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    ChevronLeft,
    ArrowUpCircle,
    ArrowDownCircle,
    CheckCircle,
    ClockIcon,
    MessageSquareIcon,
    CalendarIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswerFormValues, answerSchema } from "@/lib/qa/validation";

export default function QaQuestionPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [answerPage, setAnswerPage] = useState(1);
    const answersPerPage = 10;
    const [answerParams, setAnswerParams] = useState<QaAnswersQueryParams>({
        page: answerPage,
        limit: answersPerPage,
    });

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const { data: question, isLoading: questionLoading, isError: questionError, error: questionErrorData } = useGetQuestion(slug);

    // Load answers when question ID is available
    const {
        data: answerData,
        isLoading: answersLoading,
        isError: answersError,
        error: answersErrorData
    } = useGetAnswers(
        question ? { ...answerParams, questionId: question.id } : undefined
    );

    // Load user votes for this question
    const {
        data: userVotes,
        isLoading: userVotesLoading
    } = useGetUserVotes(
        question?.id,
        undefined
    );

    const createAnswer = useCreateAnswer();
    const voteAnswer = useVoteAnswer();
    const acceptAnswer = useAcceptAnswer();

    // Form setup for creating a new answer
    const form = useForm<AnswerFormValues>({
        resolver: zodResolver(answerSchema),
        defaultValues: {
            content: "",
            questionId: "",
        },
    });

    // Replace useState with useEffect to set questionId when question data is available
    useEffect(() => {
        if (question) {
            form.setValue('questionId', question.id);
        }
    }, [question, form]);

    const onSubmitAnswer = (data: AnswerFormValues) => {
        if (!isAuthenticated) {
            router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        createAnswer.mutate(data, {
            onSuccess: () => {
                form.reset({ content: "", questionId: question?.id || "" });
            }
        });
    };

    const handleVote = (answerId: string, voteType: 'upvote' | 'downvote') => {
        if (!isAuthenticated) {
            router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        voteAnswer.mutate({
            answerId,
            type: voteType.toUpperCase() as 'UPVOTE' | 'DOWNVOTE'
        });
    };

    const handleAcceptAnswer = (answerId: string) => {
        if (!isAuthenticated || !question || question.userId !== user?.id) {
            return;
        }

        acceptAnswer.mutate({
            questionId: question.id,
            answerId
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const hasUserVoted = (answerId: string, voteType: 'upvote' | 'downvote') => {
        if (!userVotes) return false;

        const vote = userVotes[answerId];
        if (!vote) return false;

        return vote.toLowerCase() === voteType;
    };

    if (questionLoading) {
        return (
            <div className="container py-8 mx-auto">
                <div className="flex items-center mb-6">
                    <Button variant="ghost" size="sm" className="mr-2" asChild>
                        <Link href="/qa">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Questions
                        </Link>
                    </Button>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-48 w-full" />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-5 w-40" />
                    </div>
                </div>
            </div>
        );
    }

    if (questionError || !question) {
        return (
            <div className="container py-8 mx-auto">
                <div className="flex items-center mb-6">
                    <Button variant="ghost" size="sm" className="mr-2" asChild>
                        <Link href="/qa">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Questions
                        </Link>
                    </Button>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {(questionErrorData as any)?.message || 'Failed to load question. Please try again later or check the URL.'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container py-8 mx-auto">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" asChild>
                    <Link href="/qa">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Questions
                    </Link>
                </Button>
            </div>

            <div className="space-y-8">
                {/* Question Section */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-4">
                                <CardTitle className="text-2xl">{question.title}</CardTitle>
                                <Badge variant={question.status === "OPEN" ? "default" : "secondary"}>
                                    {question.status}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {question.tags.map((tag) => (
                                    <Badge key={tag.id} variant="outline">
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                            {question.content}
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={question.user.avatar || undefined} alt={question.user.firstName} />
                                <AvatarFallback>
                                    {getInitials(question.user.firstName, question.user.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">
                                    {question.user.firstName} {question.user.lastName}
                                </p>
                                {question.user.bio && (
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {question.user.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Asked on {formatDate(question.createdAt)}
                            {question.createdAt !== question.updatedAt && (
                                <span className="ml-3">
                                    (Updated: {formatDate(question.updatedAt)})
                                </span>
                            )}
                        </div>
                    </CardFooter>
                </Card>

                {/* Answers Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Answers ({question.answerCount || 0})
                        </h2>
                        {question.answerCount > 0 && (
                            <div className="flex gap-2">
                                {/* Add sorting controls here if needed */}
                            </div>
                        )}
                    </div>

                    {answersError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {(answersErrorData as any)?.message || 'Failed to load answers. Please try again later.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {answersLoading ? (
                        Array(3).fill(0).map((_, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center gap-2 min-w-[40px]">
                                            <Skeleton className="h-8 w-8" />
                                            <Skeleton className="h-6 w-10" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                        <div className="flex-1">
                                            <Skeleton className="h-24 w-full mb-4" />
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                    <Skeleton className="h-4 w-32" />
                                                </div>
                                                <Skeleton className="h-4 w-36" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <>
                            {(!answerData?.data?.answers || answerData.data.answers.length === 0) ? (
                                <div className="text-center py-8">
                                    <MessageSquareIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No answers yet</h3>
                                    <p className="text-muted-foreground mb-6">Be the first to answer this question</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {answerData.data.answers.map((answer) => (
                                        <Card key={answer.id} className={answer.isAccepted ? "border-primary" : ""}>
                                            {answer.isAccepted && (
                                                <div className="bg-primary/10 px-6 py-2 flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-primary" />
                                                    <span className="text-sm font-medium">Accepted Answer</span>
                                                </div>
                                            )}
                                            <CardContent className="pt-6">
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col items-center gap-2 min-w-[40px]">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleVote(answer.id, 'upvote')}
                                                            disabled={!isAuthenticated || createAnswer.isPending || voteAnswer.isPending}
                                                            className={hasUserVoted(answer.id, 'upvote') ? "text-primary" : ""}
                                                        >
                                                            <ArrowUpCircle className="h-5 w-5" />
                                                        </Button>
                                                        <span className="font-medium text-center">
                                                            {answer.upvotes - answer.downvotes}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleVote(answer.id, 'downvote')}
                                                            disabled={!isAuthenticated || createAnswer.isPending || voteAnswer.isPending}
                                                            className={hasUserVoted(answer.id, 'downvote') ? "text-destructive" : ""}
                                                        >
                                                            <ArrowDownCircle className="h-5 w-5" />
                                                        </Button>
                                                        {/* Accept answer button - only visible to question author */}
                                                        {isAuthenticated && question.userId === user?.id && question.status === "OPEN" && !answer.isAccepted && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="mt-2"
                                                                title="Accept this answer"
                                                                onClick={() => handleAcceptAnswer(answer.id)}
                                                                disabled={acceptAnswer.isPending}
                                                            >
                                                                <CheckCircle className="h-5 w-5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="prose dark:prose-invert max-w-none mb-4">
                                                            {answer.content}
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-7 w-7">
                                                                    <AvatarImage src={answer.user.avatar || undefined} alt={answer.user.firstName} />
                                                                    <AvatarFallback>
                                                                        {getInitials(answer.user.firstName, answer.user.lastName)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-sm">
                                                                    {answer.user.firstName} {answer.user.lastName}
                                                                </span>
                                                            </div>
                                                            <div className="text-muted-foreground text-sm">
                                                                <CalendarIcon className="inline h-3.5 w-3.5 mr-1" />
                                                                {formatDate(answer.createdAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {/* Pagination for answers if needed */}
                                    {answerData && answerData.data.pagination && answerData.data.pagination.totalPages > 1 && (
                                        <div className="flex justify-center mt-6">
                                            {/* Implement pagination here */}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Answer Form */}
                {question.status === "OPEN" && (
                    <div className="mt-8">
                        <Separator className="mb-6" />
                        <h2 className="text-xl font-bold mb-4">Your Answer</h2>

                        {!isAuthenticated ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-4">
                                        <p className="mb-4">You need to sign in to answer this question</p>
                                        <Button asChild>
                                            <Link href={`/auth/signin?redirect=${encodeURIComponent(window.location.pathname)}`}>
                                                Sign In
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmitAnswer)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write your answer here..."
                                                        className="min-h-[150px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <input type="hidden" {...form.register('questionId')} />
                                    <Button
                                        type="submit"
                                        className="w-full md:w-auto"
                                        disabled={createAnswer.isPending}
                                    >
                                        {createAnswer.isPending ? "Submitting..." : "Submit Answer"}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}