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
} from '@/types/expense-tracker/income.types';

export const incomeServices = {
    /**
     * Get all income records with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the incomes response
     */
    getIncomes: (params?: IncomeQueryParams) => {
        return api.get<GetIncomesResponse>(
            '/expense-tracker/get-incomes',
            params
        );
    },

    /**
     * Get a single income record by ID
     * @param id - The income ID
     * @returns A promise that resolves to the income response
     */
    getIncome: (id: string) => {
        return api.get<GetIncomeResponse>(
            `/expense-tracker/get-income/${id}`
        );
    },

    /**
     * Create a new income record
     * @param incomeData - The income data to create
     * @returns A promise that resolves to the created income response
     */
    createIncome: (incomeData: CreateIncomeRequest) => {
        return api.post<CreateIncomeResponse>(
            '/expense-tracker/create-income',
            incomeData
        );
    },

    /**
     * Update an existing income record
     * @param id - The income ID to update
     * @param incomeData - The updated income data
     * @returns A promise that resolves to the updated income response
     */
    updateIncome: (id: string, incomeData: UpdateIncomeRequest) => {
        return api.put<UpdateIncomeResponse>(
            `/expense-tracker/update-income/${id}`,
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
            `/expense-tracker/delete-income/${id}`
        );
    }
};
