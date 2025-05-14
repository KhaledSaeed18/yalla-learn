export type QuestionStatus = 'OPEN' | 'CLOSED';

export interface QaUser {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    bio: string | null;
    location: string | null;
}

export interface QaTag {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    questionCount?: number;
}

export interface QaAnswer {
    id: string;
    content: string;
    questionId: string;
    userId: string;
    isAccepted: boolean;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    updatedAt: string;
    user: QaUser;
}

export interface QaQuestion {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: QuestionStatus;
    userId: string;
    createdAt: string;
    updatedAt: string;
    tags: QaTag[];
    user: QaUser;
    answers: QaAnswer[];
    answerCount: number;
}

export interface Pagination {
    totalQuestions?: number;
    totalAnswers?: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface QaQuestionsQueryParams {
    page?: number;
    limit?: number;
    status?: QuestionStatus;
    tagId?: string;
    userId?: string;
    search?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}

export interface QaAnswersQueryParams {
    page?: number;
    limit?: number;
    questionId?: string;
    userId?: string;
    sortBy?: 'createdAt' | 'upvotes' | 'isAccepted';
    sortOrder?: 'asc' | 'desc';
}

export interface GetQuestionsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        questions: QaQuestion[];
        pagination: Pagination;
    };
}

export interface GetQuestionResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        question: QaQuestion;
    };
}

export interface CreateQuestionRequest {
    title: string;
    content: string;
    tags: string[];
    slug?: string;
}

export interface CreateQuestionResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        question: QaQuestion;
    };
}

export interface UpdateQuestionRequest {
    title?: string;
    content?: string;
    status?: QuestionStatus;
    tags?: string[];
}

export interface UpdateQuestionResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        question: QaQuestion;
    };
}

export interface DeleteQuestionResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface QuestionError {
    message: string;
    status?: number;
}

export interface GetAnswersResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        answers: QaAnswer[];
        pagination: Pagination;
    };
}

export interface GetAnswerResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        answer: QaAnswer;
    };
}

export interface CreateAnswerRequest {
    content: string;
    questionId: string;
}

export interface CreateAnswerResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        answer: QaAnswer;
    };
}

export interface UpdateAnswerRequest {
    content: string;
}

export interface UpdateAnswerResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        answer: QaAnswer;
    };
}

export interface DeleteAnswerResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface VoteRequest {
    answerId: string;
    type: 'UPVOTE' | 'DOWNVOTE';
}

export interface VoteResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        action: 'added' | 'changed' | 'removed';
        voteType: 'UPVOTE' | 'DOWNVOTE';
    };
}

export interface AcceptAnswerRequest {
    questionId: string;
    answerId: string;
}

export interface AcceptAnswerResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        answer: QaAnswer;
    };
}

export interface GetUserVotesResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        votes: Record<string, 'UPVOTE' | 'DOWNVOTE'>;
    };
}

export interface QaAuthorStatistics {
    id: string;
    name: string;
    questionCount: number;
    answerCount: number;
}

export interface TagDistribution {
    id: string;
    name: string;
    questionCount: number;
}

export interface RecentActivityStatistics {
    id: string;
    title?: string;
    content?: string;
    type: 'QUESTION' | 'ANSWER';
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

export interface QaStatistics {
    totalCounts: {
        questions: number;
        answers: number;
        tags: number;
    };
    questionsByStatus: {
        open: number;
        closed: number;
    };
    userActivity: {
        topContributors: QaAuthorStatistics[];
    };
    tagDistribution: TagDistribution[];
    recentActivity: {
        lastWeekQuestions: number;
        lastWeekAnswers: number;
        lastMonthQuestions: number;
        lastMonthAnswers: number;
        recentItems: RecentActivityStatistics[];
    };
    metrics: {
        questionsWithoutAnswers: number;
        averageAnswersPerQuestion: number;
    };
}

export interface GetQaStatisticsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        statistics: QaStatistics;
    };
}
