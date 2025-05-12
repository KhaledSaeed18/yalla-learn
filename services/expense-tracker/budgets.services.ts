import { api } from '@/lib/api/baseAPI';
import {
    GetBudgetsResponse,
    GetBudgetResponse,
    CreateBudgetRequest,
    CreateBudgetResponse,
    UpdateBudgetRequest,
    UpdateBudgetResponse,
    DeleteBudgetResponse,
    BudgetQueryParams
} from '@/types/expense-tracker/expenseTracker.types';

export const budgetServices = {
    /**
     * Get all budgets with optional filtering
     * @param params - Query parameters for filtering
     * @returns A promise that resolves to the budgets response
     */
    getBudgets: (params?: BudgetQueryParams) => {
        return api.get<GetBudgetsResponse>(
            '/expense-tracker/budgets',
            params
        );
    },

    /**
     * Get a single budget by ID
     * @param id - The budget ID
     * @returns A promise that resolves to the budget response
     */
    getBudgetById: (id: string) => {
        return api.get<GetBudgetResponse>(
            `/expense-tracker/budgets/${id}`
        );
    },

    /**
     * Create a new budget
     * @param budgetData - The budget data to create
     * @returns A promise that resolves to the created budget response
     */
    createBudget: (budgetData: CreateBudgetRequest) => {
        return api.post<CreateBudgetResponse>(
            '/expense-tracker/budgets',
            budgetData
        );
    },

    /**
     * Update an existing budget
     * @param id - The budget ID to update
     * @param budgetData - The updated budget data
     * @returns A promise that resolves to the updated budget response
     */
    updateBudget: (id: string, budgetData: UpdateBudgetRequest) => {
        return api.put<UpdateBudgetResponse>(
            `/expense-tracker/budgets/${id}`,
            budgetData
        );
    },

    /**
     * Delete a budget
     * @param id - The budget ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteBudget: (id: string) => {
        return api.delete<DeleteBudgetResponse>(
            `/expense-tracker/budgets/${id}`
        );
    }
};
