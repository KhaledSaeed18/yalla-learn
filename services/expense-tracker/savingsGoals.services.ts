import { api } from '@/lib/api/baseAPI';
import {
    GetSavingsGoalsResponse,
    GetSavingsGoalResponse,
    CreateSavingsGoalRequest,
    CreateSavingsGoalResponse,
    UpdateSavingsGoalRequest,
    UpdateSavingsGoalResponse,
    DeleteSavingsGoalResponse,
    SavingsGoalQueryParams
} from '@/types/expense-tracker/expenseTracker.types';

export const savingsGoalServices = {
    /**
     * Get all savings goals with optional filtering
     * @param params - Query parameters for filtering
     * @returns A promise that resolves to the savings goals response
     */
    getSavingsGoals: (params?: SavingsGoalQueryParams) => {
        return api.get<GetSavingsGoalsResponse>(
            '/expense-tracker/savings-goals',
            params
        );
    },

    /**
     * Get a single savings goal by ID
     * @param id - The savings goal ID
     * @returns A promise that resolves to the savings goal response
     */
    getSavingsGoalById: (id: string) => {
        return api.get<GetSavingsGoalResponse>(
            `/expense-tracker/savings-goals/${id}`
        );
    },

    /**
     * Create a new savings goal
     * @param savingsGoalData - The savings goal data to create
     * @returns A promise that resolves to the created savings goal response
     */
    createSavingsGoal: (savingsGoalData: CreateSavingsGoalRequest) => {
        return api.post<CreateSavingsGoalResponse>(
            '/expense-tracker/savings-goals',
            savingsGoalData
        );
    },

    /**
     * Update an existing savings goal
     * @param id - The savings goal ID to update
     * @param savingsGoalData - The updated savings goal data
     * @returns A promise that resolves to the updated savings goal response
     */
    updateSavingsGoal: (id: string, savingsGoalData: UpdateSavingsGoalRequest) => {
        return api.put<UpdateSavingsGoalResponse>(
            `/expense-tracker/savings-goals/${id}`,
            savingsGoalData
        );
    },

    /**
     * Delete a savings goal
     * @param id - The savings goal ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteSavingsGoal: (id: string) => {
        return api.delete<DeleteSavingsGoalResponse>(
            `/expense-tracker/savings-goals/${id}`
        );
    }
};
