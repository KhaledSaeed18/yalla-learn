import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qaServices } from '@/services/qa/qa.services';
import {
    QaQuestionsQueryParams,
    CreateQuestionRequest,
    UpdateQuestionRequest,
    QaAnswersQueryParams,
    CreateAnswerRequest,
    UpdateAnswerRequest,
    VoteRequest,
    AcceptAnswerRequest,
    QaQuestion,
    QaAnswer
} from '@/types/qa/qa.types';

// Query keys
export const qaKeys = {
    all: ['qa'] as const,
    questions: () => [...qaKeys.all, 'questions'] as const,
    questionsList: (params?: QaQuestionsQueryParams) => [...qaKeys.questions(), { params }] as const,
    questionDetails: () => [...qaKeys.all, 'questionDetail'] as const,
    questionDetail: (idOrSlug: string) => [...qaKeys.questionDetails(), idOrSlug] as const,
    userQuestions: () => [...qaKeys.all, 'userQuestions'] as const,
    userQuestionsList: (params?: QaQuestionsQueryParams) => [...qaKeys.userQuestions(), { params }] as const,
    answers: () => [...qaKeys.all, 'answers'] as const,
    answersList: (params?: QaAnswersQueryParams) => [...qaKeys.answers(), { params }] as const,
    answerDetails: () => [...qaKeys.all, 'answerDetail'] as const,
    answerDetail: (id: string) => [...qaKeys.answerDetails(), id] as const,
    userVotes: () => [...qaKeys.all, 'userVotes'] as const,
    statistics: () => [...qaKeys.all, 'statistics'] as const,
};

// Get all questions hook with optional filtering, pagination, and sorting
export const useGetQuestions = (params?: QaQuestionsQueryParams) => {
    return useQuery({
        queryKey: qaKeys.questionsList(params),
        queryFn: async () => {
            const response = await qaServices.getQuestions(params);
            return response.data;
        },
    });
};

// Get questions belonging to the authenticated user
export const useGetUserQuestions = (params?: QaQuestionsQueryParams) => {
    return useQuery({
        queryKey: qaKeys.userQuestionsList(params),
        queryFn: async () => {
            const response = await qaServices.getUserQuestions(params);
            return {
                questions: response.data.questions,
                pagination: response.data.pagination
            };
        },
    });
};

// Get single question hook by ID or slug
export const useGetQuestion = (idOrSlug: string) => {
    return useQuery({
        queryKey: qaKeys.questionDetail(idOrSlug),
        queryFn: async () => {
            const response = await qaServices.getQuestion(idOrSlug);
            return response.data.question;
        },
        enabled: !!idOrSlug,
    });
};

// Create question hook
export const useCreateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (questionData: CreateQuestionRequest) =>
            qaServices.createQuestion(questionData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: qaKeys.questions(),
            });

            queryClient.invalidateQueries({
                queryKey: qaKeys.userQuestions(),
            });

            toast.success("Question created successfully");
            return response.data.question;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create question');
        },
    });
};

// Update question hook
export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, questionData }: { id: string; questionData: UpdateQuestionRequest }) =>
            qaServices.updateQuestion(id, questionData),
        onSuccess: (response, { id }) => {
            queryClient.setQueryData(
                qaKeys.questionDetail(id),
                response.data.question
            );

            queryClient.invalidateQueries({
                queryKey: qaKeys.questions(),
            });

            queryClient.invalidateQueries({
                queryKey: qaKeys.userQuestions(),
            });

            toast.success('Question updated successfully');
            return response.data.question;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update question');
        },
    });
};

// Delete question hook
export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => qaServices.deleteQuestion(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: qaKeys.questions(),
            });

            queryClient.invalidateQueries({
                queryKey: qaKeys.userQuestions(),
            });

            toast.success('Question deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete question');
        },
    });
};

// Admin delete question hook - allows admin to delete any question
export const useAdminDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => qaServices.adminDeleteQuestion(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: qaKeys.questions(),
            });

            toast.success('Question deleted successfully by admin');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete question');
        },
    });
};

// Get all answers hook with optional filtering, pagination, and sorting
export const useGetAnswers = (params?: QaAnswersQueryParams) => {
    return useQuery({
        queryKey: qaKeys.answersList(params),
        queryFn: async () => {
            const response = await qaServices.getAnswers(params);
            return response; // Return the full response to maintain the data.answers structure
        },
    });
};

// Get single answer hook by ID
export const useGetAnswer = (id: string) => {
    return useQuery({
        queryKey: qaKeys.answerDetail(id),
        queryFn: async () => {
            const response = await qaServices.getAnswer(id);
            return response.data.answer;
        },
        enabled: !!id,
    });
};

// Create answer hook
export const useCreateAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (answerData: CreateAnswerRequest) =>
            qaServices.createAnswer(answerData),
        onSuccess: (response, variables) => {
            // Update the question cache with the new answer
            queryClient.setQueryData<QaQuestion | undefined>(
                qaKeys.questionDetail(variables.questionId),
                (oldQuestion) => {
                    if (!oldQuestion) return undefined;

                    return {
                        ...oldQuestion,
                        answers: [...(oldQuestion.answers || []), response.data.answer],
                        answerCount: (oldQuestion.answerCount || 0) + 1
                    };
                }
            );

            toast.success("Answer submitted successfully");
            return response.data.answer;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to submit answer');
        },
    });
};

// Update answer hook
export const useUpdateAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, answerData }: { id: string; answerData: UpdateAnswerRequest }) =>
            qaServices.updateAnswer(id, answerData),
        onSuccess: (response, { id }) => {
            queryClient.setQueryData(
                qaKeys.answerDetail(id),
                response.data.answer
            );

            // Update answer in the question cache
            queryClient.invalidateQueries({
                queryKey: qaKeys.questionDetails(),
            });

            toast.success('Answer updated successfully');
            return response.data.answer;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update answer');
        },
    });
};

// Delete answer hook
export const useDeleteAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => qaServices.deleteAnswer(id),
        onSuccess: (_, id) => {
            // Update answer lists
            queryClient.invalidateQueries({
                queryKey: qaKeys.answers(),
            });

            // Update question with removed answer
            queryClient.invalidateQueries({
                queryKey: qaKeys.questionDetails(),
            });

            toast.success('Answer deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete answer');
        },
    });
};

// Admin delete answer hook
export const useAdminDeleteAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => qaServices.adminDeleteAnswer(id),
        onSuccess: (_, id) => {
            // Update answer lists
            queryClient.invalidateQueries({
                queryKey: qaKeys.answers(),
            });

            // Update question with removed answer
            queryClient.invalidateQueries({
                queryKey: qaKeys.questionDetails(),
            });

            toast.success('Answer deleted successfully by admin');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete answer');
        },
    });
};

// Vote on answer hook
export const useVoteAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (voteData: VoteRequest) => qaServices.voteAnswer(voteData),
        onSuccess: (response, variables) => {
            // Update answer lists
            queryClient.invalidateQueries({
                queryKey: qaKeys.answers(),
            });

            // Update question with updated answer votes
            queryClient.invalidateQueries({
                queryKey: qaKeys.questionDetails(),
            });

            // Update user votes
            queryClient.invalidateQueries({
                queryKey: qaKeys.userVotes(),
            });

            const actionMessage =
                response.data.action === 'added'
                    ? `${response.data.voteType === 'UPVOTE' ? 'Upvoted' : 'Downvoted'} answer`
                    : response.data.action === 'changed'
                        ? `Changed vote to ${response.data.voteType === 'UPVOTE' ? 'upvote' : 'downvote'}`
                        : 'Removed vote';

            toast.success(actionMessage);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to vote on answer');
        },
    });
};

// Accept answer hook
export const useAcceptAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (acceptData: AcceptAnswerRequest) => qaServices.acceptAnswer(acceptData),
        onSuccess: (response, variables) => {
            // Update answer lists
            queryClient.invalidateQueries({
                queryKey: qaKeys.answers(),
            });

            // Update question with accepted answer
            queryClient.invalidateQueries({
                queryKey: qaKeys.questionDetail(variables.questionId),
            });

            toast.success('Answer marked as accepted');
            return response.data.answer;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to accept answer');
        },
    });
};

// Unaccept answer hook
export const useUnacceptAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (unacceptData: AcceptAnswerRequest) => qaServices.unacceptAnswer(unacceptData),
        onSuccess: (response, variables) => {
            // Update answer lists
            queryClient.invalidateQueries({
                queryKey: qaKeys.answers(),
            });

            // Update question with unaccepted answer
            queryClient.invalidateQueries({
                queryKey: qaKeys.questionDetail(variables.questionId),
            });

            toast.success('Answer acceptance removed');
            return response.data.answer;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to remove answer acceptance');
        },
    });
};

// Get user votes hook
export const useGetUserVotes = (questionId?: string, answerId?: string) => {
    return useQuery({
        queryKey: [...qaKeys.userVotes(), { questionId, answerId }],
        queryFn: async () => {
            const response = await qaServices.getUserVotes(questionId, answerId);
            return response.data.votes;
        },
    });
};

// Get admin Q&A statistics hook
export const useGetAdminQaStatistics = () => {
    return useQuery({
        queryKey: qaKeys.statistics(),
        queryFn: async () => {
            const response = await qaServices.getAdminQaStatistics();
            return response.data.statistics;
        },
    });
};
