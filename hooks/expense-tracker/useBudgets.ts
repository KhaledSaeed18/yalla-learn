import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetServices } from '@/services/expense-tracker/budgets.services';
import {
    Budget,
    BudgetQueryParams,
    CreateBudgetRequest,
    UpdateBudgetRequest
} from '@/types/expense-tracker/expenseTracker.types';
import { toast } from 'sonner';

// Query keys
export const budgetKeys = {
    all: ['budgets'] as const,
    lists: () => [...budgetKeys.all, 'list'] as const,
    list: (params?: BudgetQueryParams) => [...budgetKeys.lists(), { params }] as const,
    details: () => [...budgetKeys.all, 'detail'] as const,
    detail: (id: string) => [...budgetKeys.details(), id] as const,
};

// Get all budgets hook with optional filtering
export const useGetBudgets = (params?: BudgetQueryParams) => {
    return useQuery({
        queryKey: budgetKeys.list(params),
        queryFn: async () => {
            const response = await budgetServices.getBudgets(params);
            return response.data.budgets;
        },
    });
};

// Get single budget hook
export const useGetBudget = (id: string) => {
    return useQuery({
        queryKey: budgetKeys.detail(id),
        queryFn: async () => {
            const response = await budgetServices.getBudgetById(id);
            return response.data.budget;
        },
        enabled: !!id,
    });
};

// Create budget hook
export const useCreateBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (budgetData: CreateBudgetRequest) =>
            budgetServices.createBudget(budgetData),
        onSuccess: (response) => {
            // Update budgets list
            queryClient.setQueryData<Budget[]>(
                budgetKeys.lists(),
                (oldData = []) => [...oldData, response.data.budget]
            );

            // Invalidate related queries
            queryClient.invalidateQueries({
                queryKey: budgetKeys.lists(),
            });

            toast.success("Budget created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create budget');
        },
    });
};

// Update budget hook
export const useUpdateBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, budgetData }: { id: string; budgetData: UpdateBudgetRequest }) =>
            budgetServices.updateBudget(id, budgetData),
        onSuccess: (response, { id }) => {
            // Update budget detail
            queryClient.setQueryData(
                budgetKeys.detail(id),
                response.data.budget
            );

            // Update budget lists
            queryClient.setQueryData<Budget[]>(
                budgetKeys.lists(),
                (oldData = []) =>
                    oldData.map((item) =>
                        item.id === id ? response.data.budget : item
                    )
            );

            toast.success('Budget updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update budget');
        },
    });
};

// Delete budget hook
export const useDeleteBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => budgetServices.deleteBudget(id),
        onSuccess: (_, id) => {
            // Remove from budget lists
            queryClient.setQueryData<Budget[]>(
                budgetKeys.lists(),
                (oldData = []) => oldData.filter((item) => item.id !== id)
            );

            // Remove specific budget data
            queryClient.removeQueries({
                queryKey: budgetKeys.detail(id),
            });

            toast.success('Budget deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete budget');
        },
    });
};
