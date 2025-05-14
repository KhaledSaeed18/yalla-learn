import { api } from '@/lib/api/baseAPI';
import {
    GetQuestionsResponse,
    GetQuestionResponse,
    CreateQuestionRequest,
    CreateQuestionResponse,
    UpdateQuestionRequest,
    UpdateQuestionResponse,
    DeleteQuestionResponse,
    QaQuestionsQueryParams,
    GetQaStatisticsResponse,
    GetAnswersResponse,
    GetAnswerResponse,
    CreateAnswerRequest,
    CreateAnswerResponse,
    UpdateAnswerRequest,
    UpdateAnswerResponse,
    DeleteAnswerResponse,
    QaAnswersQueryParams,
    VoteRequest,
    VoteResponse,
    AcceptAnswerRequest,
    AcceptAnswerResponse,
    GetUserVotesResponse
} from '@/types/qa/qa.types';

export const qaServices = {
    /**
     * Get all questions with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the questions response
     */
    getQuestions: (params?: QaQuestionsQueryParams) => {
        return api.get<GetQuestionsResponse>(
            '/qa/questions',
            params
        );
    },

    /**
     * Get questions belonging to the authenticated user
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the user's questions response
     */
    getUserQuestions: (params?: QaQuestionsQueryParams) => {
        return api.get<GetQuestionsResponse>(
            '/qa/user/questions',
            params
        );
    },

    /**
     * Get a single question by ID or slug
     * @param idOrSlug - The question ID or slug
     * @returns A promise that resolves to the question response
     */
    getQuestion: (idOrSlug: string) => {
        return api.get<GetQuestionResponse>(
            `/qa/questions/${idOrSlug}`
        );
    },

    /**
     * Create a new question
     * @param questionData - The question data to create
     * @returns A promise that resolves to the created question response
     */
    createQuestion: (questionData: CreateQuestionRequest) => {
        return api.post<CreateQuestionResponse>(
            '/qa/questions',
            questionData
        );
    },

    /**
     * Update an existing question
     * @param id - The question ID to update
     * @param questionData - The updated question data
     * @returns A promise that resolves to the updated question response
     */
    updateQuestion: (id: string, questionData: UpdateQuestionRequest) => {
        return api.put<UpdateQuestionResponse>(
            `/qa/questions/${id}`,
            questionData
        );
    },

    /**
     * Delete a question
     * @param id - The question ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteQuestion: (id: string) => {
        return api.delete<DeleteQuestionResponse>(
            `/qa/questions/${id}`
        );
    },

    /**
     * Admin endpoint to delete any question
     * @param id - The question ID to delete
     * @returns A promise that resolves to the delete response
     */
    adminDeleteQuestion: (id: string) => {
        return api.delete<DeleteQuestionResponse>(
            `/qa/admin/questions/${id}`
        );
    },

    /**
     * Get all answers with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the answers response
     */
    getAnswers: (params?: QaAnswersQueryParams) => {
        return api.get<GetAnswersResponse>(
            '/qa/answers',
            params
        );
    },

    /**
     * Get a single answer by ID
     * @param id - The answer ID
     * @returns A promise that resolves to the answer response
     */
    getAnswer: (id: string) => {
        return api.get<GetAnswerResponse>(
            `/qa/answers/${id}`
        );
    },

    /**
     * Create a new answer
     * @param answerData - The answer data to create
     * @returns A promise that resolves to the created answer response
     */
    createAnswer: (answerData: CreateAnswerRequest) => {
        return api.post<CreateAnswerResponse>(
            '/qa/answers',
            answerData
        );
    },

    /**
     * Update an existing answer
     * @param id - The answer ID to update
     * @param answerData - The updated answer data
     * @returns A promise that resolves to the updated answer response
     */
    updateAnswer: (id: string, answerData: UpdateAnswerRequest) => {
        return api.put<UpdateAnswerResponse>(
            `/qa/answers/${id}`,
            answerData
        );
    },

    /**
     * Delete an answer
     * @param id - The answer ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteAnswer: (id: string) => {
        return api.delete<DeleteAnswerResponse>(
            `/qa/answers/${id}`
        );
    },

    /**
     * Admin endpoint to delete any answer
     * @param id - The answer ID to delete
     * @returns A promise that resolves to the delete response
     */
    adminDeleteAnswer: (id: string) => {
        return api.delete<DeleteAnswerResponse>(
            `/qa/admin/answers/${id}`
        );
    },

    /**
     * Vote on an answer
     * @param voteData - The vote data (answerId and type)
     * @returns A promise that resolves to the vote response
     */
    voteAnswer: (voteData: VoteRequest) => {
        return api.post<VoteResponse>(
            '/qa/answers/vote',
            voteData
        );
    },

    /**
     * Accept an answer for a question
     * @param acceptData - The answer and question IDs
     * @returns A promise that resolves to the accept response
     */
    acceptAnswer: (acceptData: AcceptAnswerRequest) => {
        return api.post<AcceptAnswerResponse>(
            '/qa/answers/accept',
            acceptData
        );
    },

    /**
     * Unaccept a previously accepted answer
     * @param unacceptData - The answer and question IDs
     * @returns A promise that resolves to the unaccept response
     */
    unacceptAnswer: (unacceptData: AcceptAnswerRequest) => {
        return api.post<AcceptAnswerResponse>(
            '/qa/answers/unaccept',
            unacceptData
        );
    },

    /**
     * Get the authenticated user's votes
     * @param questionId - Optional filter by question ID
     * @param answerId - Optional filter by answer ID
     * @returns A promise that resolves to the user votes response
     */
    getUserVotes: (questionId?: string, answerId?: string) => {
        const params: any = {};
        if (questionId) params.questionId = questionId;
        if (answerId) params.answerId = answerId;

        return api.get<GetUserVotesResponse>(
            '/qa/user/votes',
            params
        );
    },

    /**
     * Get admin Q&A statistics
     * @returns A promise that resolves to the Q&A statistics response
     */
    getAdminQaStatistics: () => {
        return api.get<GetQaStatisticsResponse>(
            '/qa/admin/statistics'
        );
    }
};
