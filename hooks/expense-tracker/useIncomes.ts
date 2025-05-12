import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incomeServices } from '@/services/expense-tracker/income.services';
import {
    Income,
    IncomeQueryParams,
    CreateIncomeRequest,
    UpdateIncomeRequest
} from '@/types/expense-tracker/expenseTracker.types';
import { toast } from 'sonner';

// Query keys
export const incomeKeys = {
    all: ['incomes'] as const,
    lists: () => [...incomeKeys.all, 'list'] as const,
    list: (params?: IncomeQueryParams) => [...incomeKeys.lists(), { params }] as const,
    details: () => [...incomeKeys.all, 'detail'] as const,
    detail: (id: string) => [...incomeKeys.details(), id] as const,
};

// Get all income records hook with optional filtering, pagination, and sorting
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

// Get single income record hook
export const useGetIncome = (id: string) => {
    return useQuery({
        queryKey: incomeKeys.detail(id),
        queryFn: async () => {
            const response = await incomeServices.getIncomeById(id);
            return response.data.income;
        },
        enabled: !!id,
    });
};

// Create income record hook
export const useCreateIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (incomeData: CreateIncomeRequest) =>
            incomeServices.createIncome(incomeData),
        onSuccess: (response) => {
            // Update income list
            queryClient.setQueryData(
                incomeKeys.lists(),
                (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        incomes: [response.data.income, ...(oldData.incomes || [])],
                        pagination: oldData.pagination ? {
                            ...oldData.pagination,
                            total: (oldData.pagination.total || 0) + 1
                        } : undefined
                    };
                }
            );

            // Invalidate related queries
            queryClient.invalidateQueries({
                queryKey: incomeKeys.lists(),
            });

            toast.success("Income record created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create income record');
        },
    });
};

// Update income record hook
export const useUpdateIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, incomeData }: { id: string; incomeData: UpdateIncomeRequest }) =>
            incomeServices.updateIncome(id, incomeData),
        onSuccess: (response, { id }) => {
            // Update income detail
            queryClient.setQueryData(
                incomeKeys.detail(id),
                response.data.income
            );

            // Update income records in lists
            queryClient.invalidateQueries({
                queryKey: incomeKeys.lists(),
            });

            toast.success('Income record updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update income record');
        },
    });
};

// Delete income record hook
export const useDeleteIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => incomeServices.deleteIncome(id),
        onSuccess: (_, id) => {
            // Remove from income lists
            queryClient.invalidateQueries({
                queryKey: incomeKeys.lists(),
            });

            // Remove specific income data
            queryClient.removeQueries({
                queryKey: incomeKeys.detail(id),
            });

            toast.success('Income record deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete income record');
        },
    });
};
