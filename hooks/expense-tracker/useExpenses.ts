import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseServices } from '@/services/expense-tracker/expenses.services';
import {
    Expense,
    ExpenseQueryParams,
    CreateExpenseRequest,
    UpdateExpenseRequest
} from '@/types/expense-tracker/expenseTracker.types';
import { toast } from 'sonner';

// Query keys
export const expenseKeys = {
    all: ['expenses'] as const,
    lists: () => [...expenseKeys.all, 'list'] as const,
    list: (params?: ExpenseQueryParams) => [...expenseKeys.lists(), { params }] as const,
    details: () => [...expenseKeys.all, 'detail'] as const,
    detail: (id: string) => [...expenseKeys.details(), id] as const,
};

// Get all expenses hook with optional filtering, pagination, and sorting
export const useGetExpenses = (params?: ExpenseQueryParams) => {
    return useQuery({
        queryKey: expenseKeys.list(params),
        queryFn: async () => {
            const response = await expenseServices.getExpenses(params);
            return {
                expenses: response.data.expenses,
                pagination: response.data.pagination
            };
        },
    });
};

// Get single expense hook
export const useGetExpense = (id: string) => {
    return useQuery({
        queryKey: expenseKeys.detail(id),
        queryFn: async () => {
            const response = await expenseServices.getExpenseById(id);
            return response.data.expense;
        },
        enabled: !!id,
    });
};

// Create expense hook
export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (expenseData: CreateExpenseRequest) =>
            expenseServices.createExpense(expenseData),
        onSuccess: (response) => {
            // Update expenses list
            queryClient.setQueryData(
                expenseKeys.lists(),
                (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        expenses: [response.data.expense, ...(oldData.expenses || [])],
                        pagination: oldData.pagination ? {
                            ...oldData.pagination,
                            total: (oldData.pagination.total || 0) + 1
                        } : undefined
                    };
                }
            );

            // Invalidate related queries
            queryClient.invalidateQueries({
                queryKey: expenseKeys.lists(),
            });

            toast.success("Expense created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create expense');
        },
    });
};

// Update expense hook
export const useUpdateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, expenseData }: { id: string; expenseData: UpdateExpenseRequest }) =>
            expenseServices.updateExpense(id, expenseData),
        onSuccess: (response, { id }) => {
            // Update expense detail
            queryClient.setQueryData(
                expenseKeys.detail(id),
                response.data.expense
            );

            // Update expenses in lists
            queryClient.invalidateQueries({
                queryKey: expenseKeys.lists(),
            });

            toast.success('Expense updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update expense');
        },
    });
};

// Delete expense hook
export const useDeleteExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => expenseServices.deleteExpense(id),
        onSuccess: (_, id) => {
            // Remove from expense lists
            queryClient.invalidateQueries({
                queryKey: expenseKeys.lists(),
            });

            // Remove specific expense data
            queryClient.removeQueries({
                queryKey: expenseKeys.detail(id),
            });

            toast.success('Expense deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete expense');
        },
    });
};
