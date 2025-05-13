// Analytics and statistics types for expense tracking feature

export type ExpenseSummaryPeriod = 'this-month' | 'last-month' | 'this-year' | 'last-year' | 'all-time' | 'custom';
export type GroupByOption = 'day' | 'week' | 'month' | 'year';

// Query parameters for expense summary by category
export interface ExpenseSummaryParams {
    startDate?: string;
    endDate?: string;
    semesterId?: string;
}

// Query parameters for expense-income comparison
export interface ExpenseIncomeComparisonParams {
    startDate?: string;
    endDate?: string;
    groupBy?: GroupByOption;
    semesterId?: string;
}

// Query parameters for dashboard statistics
export interface DashboardStatsParams {
    period: ExpenseSummaryPeriod;
    startDate?: string;
    endDate?: string;
    semesterId?: string;
}

// Category summary in the expense summary
export interface CategorySummary {
    category: string;
    total: number;
    count: number;
    percentage: number;
}

// Time period information
export interface TimeframePeriod {
    startDate: string;
    endDate: string;
    groupBy?: GroupByOption;
}

// Expense summary response
export interface ExpenseSummaryResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        categories: CategorySummary[];
        totalExpenses: number;
        expenseCount: number;
        timeframe: TimeframePeriod;
    };
}

// Period data for expense-income comparison
export interface PeriodComparison {
    period: string;
    expenses: number;
    income: number;
    net: number;
}

// Summary data for expense-income comparison
export interface ComparisonSummary {
    totalExpenses: number;
    totalIncome: number;
    netSavings: number;
    savingsRate: number;
}

// Response for expense-income comparison
export interface ExpenseIncomeComparisonResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        comparison: PeriodComparison[];
        summary: ComparisonSummary;
        timeframe: TimeframePeriod;
    };
}

// Summary data for dashboard statistics
export interface DashboardSummary {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
}

// Insight data for dashboard statistics
export interface DashboardInsights {
    avgDailyExpense: number;
    topCategory: CategorySummary;
    upcomingPaymentsCount: number;
    upcomingPaymentsTotal: number;
    overduePaymentsCount: number;
    overduePaymentsTotal: number;
}

// Context data for dashboard statistics
export interface DashboardContext {
    period: ExpenseSummaryPeriod;
    startDate: string;
    endDate: string;
    activeSemester?: {
        id: string;
        name: string;
        startDate: string;
        endDate: string;
        year: number;
        term: string;
        isActive: boolean;
        userId: string;
        createdAt: string;
        updatedAt: string;
        _count?: {
            expenses: number;
            paymentSchedules: number;
        };
    };
}

// Response for dashboard statistics
export interface DashboardStatsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        summary: DashboardSummary;
        insights: DashboardInsights;
        context: DashboardContext;
    };
}
