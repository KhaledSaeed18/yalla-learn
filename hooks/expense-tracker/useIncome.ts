import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { incomeServices } from '@/services/expense-tracker/income.services';
import {
    IncomeQueryParams,
    CreateIncomeRequest,
    UpdateIncomeRequest,
    Income
} from '@/types/expense-tracker/income.types';

// Query keys
export const incomeKeys = {
    all: ['incomes'] as const,
    lists: () => [...incomeKeys.all, 'list'] as const,
    list: (params?: IncomeQueryParams) => [...incomeKeys.lists(), { params }] as const,
    details: () => [...incomeKeys.all, 'detail'] as const,
    detail: (id: string) => [...incomeKeys.details(), id] as const,
};

// Get all incomes hook with optional filtering, pagination, and sorting
export const useGetIncomes = (params?: IncomeQueryParams) => {
    return useQuery({
        queryKey: incomeKeys.list(params),
        queryFn: async () => {
            const response = await incomeServices.getIncomes(params);
            return {
                incomes: response.data.incomes,
                pagination: response.data.pagination
            };
        },
    });
};

// Get single income hook by ID
export const useGetIncome = (id: string) => {
    return useQuery({
        queryKey: incomeKeys.detail(id),
        queryFn: async () => {
            const response = await incomeServices.getIncome(id);
            return response.data.income;
        },
        enabled: !!id,
    });
};

// Create income hook
export const useCreateIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (incomeData: CreateIncomeRequest) =>
            incomeServices.createIncome(incomeData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: incomeKeys.lists(),
            });

            toast.success("Income created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create income record');
        },
    });
};

// Update income hook
export const useUpdateIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, incomeData }: { id: string; incomeData: UpdateIncomeRequest }) =>
            incomeServices.updateIncome(id, incomeData),
        onSuccess: (response, { id }) => {
            queryClient.invalidateQueries({
                queryKey: incomeKeys.detail(id),
            });

            queryClient.invalidateQueries({
                queryKey: incomeKeys.lists(),
            });

            toast.success('Income updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update income record');
        },
    });
};

// Delete income hook
export const useDeleteIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => incomeServices.deleteIncome(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: incomeKeys.lists(),
            });

            queryClient.removeQueries({
                queryKey: incomeKeys.detail(id),
            });

            toast.success('Income deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete income record');
        },
    });
};
