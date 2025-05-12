// Types for expense tracking feature
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'SCHOLARSHIP' | 'OTHER';
export type BudgetPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'YEARLY';
export type Term = 'FALL' | 'SPRING' | 'SUMMER';
export type UniversityPaymentType = 'TUITION' | 'HOUSING' | 'MEAL_PLAN' | 'BOOKS' | 'LAB_FEES' | 'ACTIVITY_FEES' | 'TECHNOLOGY_FEES' | 'INSURANCE' | 'PARKING' | 'OTHER';

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

// 1. Expense Categories
export interface ExpenseCategory {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    isDefault: boolean;
    color: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GetCategoriesResponse extends ApiResponse {
    data: {
        categories: ExpenseCategory[];
    };
}

export interface GetCategoryResponse extends ApiResponse {
    data: {
        category: ExpenseCategory;
    };
}

export interface CreateCategoryRequest {
    name: string;
    description?: string | null;
    icon?: string | null;
    isDefault?: boolean;
    color?: string | null;
}

export interface CreateCategoryResponse extends ApiResponse {
    data: {
        category: ExpenseCategory;
    };
}

export interface UpdateCategoryRequest {
    name?: string;
    description?: string | null;
    icon?: string | null;
    isDefault?: boolean;
    color?: string | null;
}

export interface UpdateCategoryResponse extends ApiResponse {
    data: {
        category: ExpenseCategory;
    };
}

export interface DeleteCategoryResponse extends ApiResponse { }

// 2. Expenses
export interface Expense {
    id: string;
    amount: number;
    description: string | null;
    date: string;
    categoryId: string;
    category: ExpenseCategory;
    paymentMethod: PaymentMethod | null;
    location: string | null;
    semesterId: string | null;
    semester?: Semester | null;
    createdAt: string;
    updatedAt: string;
}

export interface ExpenseQueryParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    categoryIds?: string[];
    semesterId?: string;
    minAmount?: number;
    maxAmount?: number;
    paymentMethods?: PaymentMethod[];
    sortBy?: 'date' | 'amount' | 'createdAt';
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

export interface CreateExpenseRequest {
    amount: number;
    description?: string | null;
    date: string;
    categoryId: string;
    paymentMethod?: PaymentMethod | null;
    location?: string | null;
    semesterId?: string | null;
}

export interface CreateExpenseResponse extends ApiResponse {
    data: {
        expense: Expense;
    };
}

export interface UpdateExpenseRequest {
    amount?: number;
    description?: string | null;
    date?: string;
    categoryId?: string;
    paymentMethod?: PaymentMethod | null;
    location?: string | null;
    semesterId?: string | null;
}

export interface UpdateExpenseResponse extends ApiResponse {
    data: {
        expense: Expense;
    };
}

export interface DeleteExpenseResponse extends ApiResponse { }

// 3. Income
export interface Income {
    id: string;
    amount: number;
    source: string;
    description: string | null;
    date: string;
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
    sortBy?: 'date' | 'amount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface GetIncomesResponse extends ApiResponse {
    data: {
        incomes: Income[];
        pagination: Pagination;
    };
}

export interface GetIncomeResponse extends ApiResponse {
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

export interface CreateIncomeResponse extends ApiResponse {
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

export interface UpdateIncomeResponse extends ApiResponse {
    data: {
        income: Income;
    };
}

export interface DeleteIncomeResponse extends ApiResponse { }

// 4. Budgets
export interface Budget {
    id: string;
    amount: number;
    period: BudgetPeriod;
    startDate: string;
    endDate: string | null;
    categoryId: string;
    category: ExpenseCategory;
    semesterId: string | null;
    semester?: Semester | null;
    createdAt: string;
    updatedAt: string;
}

export interface BudgetQueryParams {
    categoryId?: string;
    semesterId?: string;
    period?: BudgetPeriod;
    includeExpired?: boolean;
}

export interface GetBudgetsResponse extends ApiResponse {
    data: {
        budgets: Budget[];
    };
}

export interface GetBudgetResponse extends ApiResponse {
    data: {
        budget: Budget;
    };
}

export interface CreateBudgetRequest {
    amount: number;
    period: BudgetPeriod;
    startDate: string;
    endDate?: string | null;
    categoryId: string;
    semesterId?: string | null;
}

export interface CreateBudgetResponse extends ApiResponse {
    data: {
        budget: Budget;
    };
}

export interface UpdateBudgetRequest {
    amount?: number;
    period?: BudgetPeriod;
    startDate?: string;
    endDate?: string | null;
    categoryId?: string;
    semesterId?: string | null;
}

export interface UpdateBudgetResponse extends ApiResponse {
    data: {
        budget: Budget;
    };
}

export interface DeleteBudgetResponse extends ApiResponse { }

// 5. Semesters
export interface Semester {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    year: number;
    term: Term;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetSemestersResponse extends ApiResponse {
    data: {
        semesters: Semester[];
    };
}

export interface GetActiveSemesterResponse extends ApiResponse {
    data: {
        semester: Semester | null;
    };
}

export interface GetSemesterResponse extends ApiResponse {
    data: {
        semester: Semester;
    };
}

export interface CreateSemesterRequest {
    name: string;
    startDate: string;
    endDate: string;
    year: number;
    term: Term;
    isActive?: boolean;
}

export interface CreateSemesterResponse extends ApiResponse {
    data: {
        semester: Semester;
    };
}

export interface UpdateSemesterRequest {
    name?: string;
    startDate?: string;
    endDate?: string;
    year?: number;
    term?: Term;
    isActive?: boolean;
}

export interface UpdateSemesterResponse extends ApiResponse {
    data: {
        semester: Semester;
    };
}

export interface DeleteSemesterResponse extends ApiResponse { }

// 6. Payment Schedules
export interface PaymentSchedule {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    paidDate: string | null;
    semesterId: string;
    semester: Semester;
    paymentType: UniversityPaymentType;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentScheduleQueryParams {
    semesterId?: string;
    isPaid?: boolean;
    paymentType?: UniversityPaymentType;
    upcoming?: boolean; // Due in next 30 days
    overdue?: boolean; // Unpaid and past due date
}

export interface GetPaymentSchedulesResponse extends ApiResponse {
    data: {
        paymentSchedules: PaymentSchedule[];
    };
}

export interface GetPaymentScheduleResponse extends ApiResponse {
    data: {
        paymentSchedule: PaymentSchedule;
    };
}

export interface CreatePaymentScheduleRequest {
    name: string;
    amount: number;
    dueDate: string;
    isPaid?: boolean;
    paidDate?: string | null;
    semesterId: string;
    paymentType: UniversityPaymentType;
    notes?: string | null;
}

export interface CreatePaymentScheduleResponse extends ApiResponse {
    data: {
        paymentSchedule: PaymentSchedule;
    };
}

export interface UpdatePaymentScheduleRequest {
    name?: string;
    amount?: number;
    dueDate?: string;
    isPaid?: boolean;
    paidDate?: string | null;
    semesterId?: string;
    paymentType?: UniversityPaymentType;
    notes?: string | null;
}

export interface UpdatePaymentScheduleResponse extends ApiResponse {
    data: {
        paymentSchedule: PaymentSchedule;
    };
}

export interface DeletePaymentScheduleResponse extends ApiResponse { }

// 7. Savings Goals
export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    startDate: string | null;
    targetDate: string | null;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SavingsGoalQueryParams {
    includeCompleted?: boolean;
}

export interface GetSavingsGoalsResponse extends ApiResponse {
    data: {
        savingsGoals: SavingsGoal[];
    };
}

export interface GetSavingsGoalResponse extends ApiResponse {
    data: {
        savingsGoal: SavingsGoal;
    };
}

export interface CreateSavingsGoalRequest {
    name: string;
    targetAmount: number;
    currentAmount?: number;
    startDate?: string | null;
    targetDate?: string | null;
    isCompleted?: boolean;
}

export interface CreateSavingsGoalResponse extends ApiResponse {
    data: {
        savingsGoal: SavingsGoal;
    };
}

export interface UpdateSavingsGoalRequest {
    name?: string;
    targetAmount?: number;
    currentAmount?: number;
    startDate?: string | null;
    targetDate?: string | null;
    isCompleted?: boolean;
}

export interface UpdateSavingsGoalResponse extends ApiResponse {
    data: {
        savingsGoal: SavingsGoal;
    };
}

export interface DeleteSavingsGoalResponse extends ApiResponse { }

// Error types
export interface ExpenseTrackerError {
    message: string;
    status?: number;
}
