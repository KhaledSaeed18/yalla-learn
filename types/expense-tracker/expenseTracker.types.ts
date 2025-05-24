export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'SCHOLARSHIP' | 'OTHER';
export type Term = 'FALL' | 'SPRING' | 'SUMMER';
export type PaymentType = 'TUITION' | 'HOUSING' | 'MEAL_PLAN' | 'BOOKS' | 'LAB_FEES' | 'ACTIVITY_FEES' | 'TECHNOLOGY_FEES' | 'INSURANCE' | 'PARKING' | 'OTHER';

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

export interface ApiResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

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

export interface PaymentSchedule {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    paidDate: string | null;
    semesterId: string;
    userId: string;
    paymentType: PaymentType;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    semester?: Semester;
}

export interface CreatePaymentScheduleRequest {
    name: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    paidDate?: string | null;
    semesterId: string;
    paymentType: PaymentType;
    notes?: string | null;
}

export interface UpdatePaymentScheduleRequest {
    name?: string;
    amount?: number;
    dueDate?: string;
    isPaid?: boolean;
    paidDate?: string | null;
    semesterId?: string;
    paymentType?: PaymentType;
    notes?: string | null;
}

export interface PaymentSchedulesQueryParams {
    semesterId?: string;
    isPaid?: boolean;
    paymentType?: PaymentType;
    upcoming?: boolean;
    overdue?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface GetPaymentSchedulesResponse extends ApiResponse {
    data: {
        paymentSchedules: PaymentSchedule[];
        pagination?: Pagination;
    };
}

export interface GetPaymentScheduleResponse extends ApiResponse {
    data: {
        paymentSchedule: PaymentSchedule;
    };
}

export interface CreatePaymentScheduleResponse extends ApiResponse {
    data: {
        paymentSchedule: PaymentSchedule;
    };
}

export interface UpdatePaymentScheduleResponse extends ApiResponse {
    data: {
        paymentSchedule: PaymentSchedule;
    };
}

export interface DeletePaymentScheduleResponse extends ApiResponse {
    data: null;
}