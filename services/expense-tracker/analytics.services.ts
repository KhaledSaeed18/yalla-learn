import { api } from '@/lib/api/baseAPI';
import {
    ExpenseSummaryParams,
    ExpenseSummaryResponse,
    ExpenseIncomeComparisonParams,
    ExpenseIncomeComparisonResponse,
    DashboardStatsParams,
    DashboardStatsResponse
} from '@/types/expense-tracker/analytics.types';

export const analyticsServices = {
    /**
     * Get expense summary by category
     * @param params - Query parameters for filtering by date range and semester
     * @returns A promise that resolves to the expense summary response
     */
    getExpenseSummary: (params?: ExpenseSummaryParams) => {
        return api.get<ExpenseSummaryResponse>(
            '/expense-tracker/reports/expense-summary',
            params
        );
    },

    /**
     * Get expense-income comparison data
     * @param params - Query parameters for filtering by date range, grouping, and semester
     * @returns A promise that resolves to the expense-income comparison response
     */
    getExpenseIncomeComparison: (params?: ExpenseIncomeComparisonParams) => {
        return api.get<ExpenseIncomeComparisonResponse>(
            '/expense-tracker/reports/expense-income-comparison',
            params
        );
    },

    /**
     * Get dashboard statistics
     * @param params - Query parameters for period, date range, and semester
     * @returns A promise that resolves to the dashboard statistics response
     */
    getDashboardStats: (params: DashboardStatsParams) => {
        return api.get<DashboardStatsResponse>(
            '/expense-tracker/dashboard/stats',
            params
        );
    }
};
