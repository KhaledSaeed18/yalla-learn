import { api } from '@/lib/api/baseAPI';
import {
    GetIncomesResponse,
    GetIncomeResponse,
    CreateIncomeRequest,
    CreateIncomeResponse,
    UpdateIncomeRequest,
    UpdateIncomeResponse,
    DeleteIncomeResponse,
    IncomeQueryParams
} from '@/types/expense-tracker/expenseTracker.types';

export const incomeServices = {
    /**
     * Get all income records with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the income records response
     */
    getIncomes: (params?: IncomeQueryParams) => {
        return api.get<GetIncomesResponse>(
            '/expense-tracker/incomes',
            params
        );
    },

    /**
     * Get a single income record by ID
     * @param id - The income ID
     * @returns A promise that resolves to the income record response
     */
    getIncomeById: (id: string) => {
        return api.get<GetIncomeResponse>(
            `/expense-tracker/incomes/${id}`
        );
    },

    /**
     * Create a new income record
     * @param incomeData - The income data to create
     * @returns A promise that resolves to the created income record response
     */
    createIncome: (incomeData: CreateIncomeRequest) => {
        return api.post<CreateIncomeResponse>(
            '/expense-tracker/incomes',
            incomeData
        );
    },

    /**
     * Update an existing income record
     * @param id - The income ID to update
     * @param incomeData - The updated income data
     * @returns A promise that resolves to the updated income record response
     */
    updateIncome: (id: string, incomeData: UpdateIncomeRequest) => {
        return api.put<UpdateIncomeResponse>(
            `/expense-tracker/incomes/${id}`,
            incomeData
        );
    },

    /**
     * Delete an income record
     * @param id - The income ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteIncome: (id: string) => {
        return api.delete<DeleteIncomeResponse>(
            `/expense-tracker/incomes/${id}`
        );
    }
};
