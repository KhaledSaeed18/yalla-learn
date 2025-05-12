import { api } from '@/lib/api/baseAPI';
import {
    GetExpensesResponse,
    GetExpenseResponse,
    CreateExpenseRequest,
    CreateExpenseResponse,
    UpdateExpenseRequest,
    UpdateExpenseResponse,
    DeleteExpenseResponse,
    ExpenseQueryParams
} from '@/types/expense-tracker/expenseTracker.types';

export const expenseServices = {
    /**
     * Get all expenses with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the expenses response
     */
    getExpenses: (params?: ExpenseQueryParams) => {
        return api.get<GetExpensesResponse>(
            '/expense-tracker/expenses',
            params
        );
    },

    /**
     * Get a single expense by ID
     * @param id - The expense ID
     * @returns A promise that resolves to the expense response
     */
    getExpenseById: (id: string) => {
        return api.get<GetExpenseResponse>(
            `/expense-tracker/expenses/${id}`
        );
    },

    /**
     * Create a new expense
     * @param expenseData - The expense data to create
     * @returns A promise that resolves to the created expense response
     */
    createExpense: (expenseData: CreateExpenseRequest) => {
        return api.post<CreateExpenseResponse>(
            '/expense-tracker/expenses',
            expenseData
        );
    },

    /**
     * Update an existing expense
     * @param id - The expense ID to update
     * @param expenseData - The updated expense data
     * @returns A promise that resolves to the updated expense response
     */
    updateExpense: (id: string, expenseData: UpdateExpenseRequest) => {
        return api.put<UpdateExpenseResponse>(
            `/expense-tracker/expenses/${id}`,
            expenseData
        );
    },

    /**
     * Delete an expense
     * @param id - The expense ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteExpense: (id: string) => {
        return api.delete<DeleteExpenseResponse>(
            `/expense-tracker/expenses/${id}`
        );
    }
};
