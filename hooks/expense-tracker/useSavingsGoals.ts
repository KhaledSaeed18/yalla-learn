import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsGoalServices } from '@/services/expense-tracker/savingsGoals.services';
import {
    SavingsGoal,
    SavingsGoalQueryParams,
    CreateSavingsGoalRequest,
    UpdateSavingsGoalRequest
} from '@/types/expense-tracker/expenseTracker.types';
import { toast } from 'sonner';

// Query keys
export const savingsGoalKeys = {
    all: ['savingsGoals'] as const,
    lists: () => [...savingsGoalKeys.all, 'list'] as const,
    list: (params?: SavingsGoalQueryParams) => [...savingsGoalKeys.lists(), { params }] as const,
    details: () => [...savingsGoalKeys.all, 'detail'] as const,
    detail: (id: string) => [...savingsGoalKeys.details(), id] as const,
};

// Get all savings goals hook with optional filtering
export const useGetSavingsGoals = (params?: SavingsGoalQueryParams) => {
    return useQuery({
        queryKey: savingsGoalKeys.list(params),
        queryFn: async () => {
            const response = await savingsGoalServices.getSavingsGoals(params);
            return response.data.savingsGoals;
        },
    });
};

// Get single savings goal hook
export const useGetSavingsGoal = (id: string) => {
    return useQuery({
        queryKey: savingsGoalKeys.detail(id),
        queryFn: async () => {
            const response = await savingsGoalServices.getSavingsGoalById(id);
            return response.data.savingsGoal;
        },
        enabled: !!id,
    });
};

// Create savings goal hook
export const useCreateSavingsGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savingsGoalData: CreateSavingsGoalRequest) =>
            savingsGoalServices.createSavingsGoal(savingsGoalData),
        onSuccess: (response) => {
            // Update savings goals list
            queryClient.setQueryData<SavingsGoal[]>(
                savingsGoalKeys.lists(),
                (oldData = []) => [...oldData, response.data.savingsGoal]
            );

            // Invalidate related queries
            queryClient.invalidateQueries({
                queryKey: savingsGoalKeys.lists(),
            });

            toast.success("Savings goal created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create savings goal');
        },
    });
};

// Update savings goal hook
export const useUpdateSavingsGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, savingsGoalData }: { id: string; savingsGoalData: UpdateSavingsGoalRequest }) =>
            savingsGoalServices.updateSavingsGoal(id, savingsGoalData),
        onSuccess: (response, { id }) => {
            // Update savings goal detail
            queryClient.setQueryData(
                savingsGoalKeys.detail(id),
                response.data.savingsGoal
            );

            // Update savings goal in lists
            queryClient.setQueryData<SavingsGoal[]>(
                savingsGoalKeys.lists(),
                (oldData = []) =>
                    oldData.map((item) =>
                        item.id === id ? response.data.savingsGoal : item
                    )
            );

            toast.success('Savings goal updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update savings goal');
        },
    });
};

// Delete savings goal hook
export const useDeleteSavingsGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => savingsGoalServices.deleteSavingsGoal(id),
        onSuccess: (_, id) => {
            // Remove from savings goal lists
            queryClient.setQueryData<SavingsGoal[]>(
                savingsGoalKeys.lists(),
                (oldData = []) => oldData.filter((item) => item.id !== id)
            );

            // Remove specific savings goal data
            queryClient.removeQueries({
                queryKey: savingsGoalKeys.detail(id),
            });

            toast.success('Savings goal deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete savings goal');
        },
    });
};
