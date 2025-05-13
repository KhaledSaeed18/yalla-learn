export interface Income {
    id: string;
    amount: number;
    source: string;
    description: string | null;
    date: string;
    userId: string;
    recurring: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IncomeQueryParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    recurring?: boolean;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: 'date' | 'amount' | 'createdAt' | 'updatedAt' | 'source';
    sortOrder?: 'asc' | 'desc';
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface GetIncomesResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        incomes: Income[];
        pagination: Pagination;
    };
}

export interface GetIncomeResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        income: Income;
    };
}

export interface CreateIncomeRequest {
    amount: number;
    source: string;
    description?: string | null;
    date: string;
    recurring?: boolean;
}

export interface CreateIncomeResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        income: Income;
    };
}

export interface UpdateIncomeRequest {
    amount?: number;
    source?: string;
    description?: string | null;
    date?: string;
    recurring?: boolean;
}

export interface UpdateIncomeResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        income: Income;
    };
}

export interface DeleteIncomeResponse {
    status: string;
    statusCode: number;
    message: string;
    data: null;
}

export interface IncomeError {
    message: string;
    status?: number;
}
