// Types for expense tracking feature
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'SCHOLARSHIP' | 'OTHER';
export type Term = 'FALL' | 'SPRING' | 'SUMMER';

// Expense Category Type enum
export enum ExpenseCategoryType {
    HOUSING = 'HOUSING',
    FOOD = 'FOOD',
    TRANSPORTATION = 'TRANSPORTATION',
    EDUCATION = 'EDUCATION',
    ENTERTAINMENT = 'ENTERTAINMENT',
    HEALTHCARE = 'HEALTHCARE',
    CLOTHING = 'CLOTHING',
    UTILITIES = 'UTILITIES',
    SUBSCRIPTIONS = 'SUBSCRIPTIONS',
    SAVINGS = 'SAVINGS',
    PERSONAL_CARE = 'PERSONAL_CARE',
    GIFTS = 'GIFTS',
    TRAVEL = 'TRAVEL',
    TECH = 'TECH',
    INSURANCE = 'INSURANCE',
    OTHER = 'OTHER'
}

// Base response interface
export interface ApiResponse {
    status: string;
    statusCode: number;
    message: string;
}

// Pagination interface
export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Semester Interfaces
export interface Semester {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    year: number;
    term: Term;
    isActive: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        expenses: number;
        budgets: number;
        paymentSchedules: number;
    };
}

export interface CreateSemesterRequest {
    name: string;
    startDate: string;
    endDate: string;
    year: number;
    term: Term;
    isActive: boolean;
}

export interface UpdateSemesterRequest {
    name?: string;
    startDate?: string;
    endDate?: string;
    year?: number;
    term?: Term;
    isActive?: boolean;
}

export interface GetSemestersResponse extends ApiResponse {
    data: {
        semesters: Semester[];
    };
}

export interface GetSemesterResponse extends ApiResponse {
    data: {
        semester: Semester;
    };
}

export interface CreateSemesterResponse extends ApiResponse {
    data: {
        semester: Semester;
    };
}

export interface UpdateSemesterResponse extends ApiResponse {
    data: {
        semester: Semester;
    };
}

export interface DeleteSemesterResponse extends ApiResponse { }

// Expense Interfaces
export interface Expense {
    id: string;
    amount: string;
    description: string;
    date: string;
    category: keyof typeof ExpenseCategoryType;
    userId: string;
    paymentMethod: PaymentMethod;
    location: string;
    semesterId: string;
    createdAt: string;
    updatedAt: string;
    semester: Semester;
}

export interface CreateExpenseRequest {
    amount: number;
    description: string;
    date: string;
    category: keyof typeof ExpenseCategoryType;
    paymentMethod: PaymentMethod;
    location: string;
    semesterId: string;
}

export interface UpdateExpenseRequest {
    amount?: number;
    description?: string;
    date?: string;
    category?: keyof typeof ExpenseCategoryType;
    paymentMethod?: PaymentMethod;
    location?: string;
    semesterId?: string;
}

export interface ExpensesQueryParams {
    page?: number;
    limit?: number;
    semesterId?: string;
    category?: keyof typeof ExpenseCategoryType;
    paymentMethod?: PaymentMethod;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: 'amount' | 'date' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface GetExpensesResponse extends ApiResponse {
    data: {
        expenses: Expense[];
        pagination: Pagination;
    };
}

export interface GetExpenseResponse extends ApiResponse {
    data: {
        expense: Expense;
    };
}

export interface CreateExpenseResponse extends ApiResponse {
    data: {
        expense: Expense;
    };
}

export interface UpdateExpenseResponse extends ApiResponse {
    data: {
        expense: Expense;
    };
}

export interface DeleteExpenseResponse extends ApiResponse { }