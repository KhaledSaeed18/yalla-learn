import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { analyticsServices } from '@/services/expense-tracker/analytics.services';
import {
    ExpenseSummaryParams,
    ExpenseIncomeComparisonParams,
    DashboardStatsParams
} from '@/types/expense-tracker/analytics.types';

// Query keys
export const analyticsKeys = {
    all: ['analytics'] as const,
    expenseSummary: () => [...analyticsKeys.all, 'expense-summary'] as const,
    expenseSummaryParams: (params?: ExpenseSummaryParams) => [...analyticsKeys.expenseSummary(), { params }] as const,
    expenseIncomeComparison: () => [...analyticsKeys.all, 'expense-income-comparison'] as const,
    expenseIncomeComparisonParams: (params?: ExpenseIncomeComparisonParams) => [...analyticsKeys.expenseIncomeComparison(), { params }] as const,
    dashboardStats: () => [...analyticsKeys.all, 'dashboard-stats'] as const,
    dashboardStatsParams: (params: DashboardStatsParams) => [...analyticsKeys.dashboardStats(), { params }] as const,
};

// Get expense summary by category hook
export const useGetExpenseSummary = (params?: ExpenseSummaryParams) => {
    return useQuery({
        queryKey: analyticsKeys.expenseSummaryParams(params),
        queryFn: async () => {
            const response = await analyticsServices.getExpenseSummary(params);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get expense-income comparison hook
export const useGetExpenseIncomeComparison = (params?: ExpenseIncomeComparisonParams) => {
    return useQuery({
        queryKey: analyticsKeys.expenseIncomeComparisonParams(params),
        queryFn: async () => {
            const response = await analyticsServices.getExpenseIncomeComparison(params);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get dashboard statistics hook
export const useGetDashboardStats = (params: DashboardStatsParams) => {
    return useQuery({
        queryKey: analyticsKeys.dashboardStatsParams(params),
        queryFn: async () => {
            try {
                const response = await analyticsServices.getDashboardStats(params);
                return response.data;
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch dashboard statistics');
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
