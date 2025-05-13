import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { expensesServices } from '@/services/expense-tracker/expenses.services';
import {
    ExpensesQueryParams,
    CreateExpenseRequest,
    UpdateExpenseRequest,
    Expense
} from '@/types/expense-tracker/expenseTracker.types';

// Query keys
export const expenseKeys = {
    all: ['expenses'] as const,
    lists: () => [...expenseKeys.all, 'list'] as const,
    list: (params?: ExpensesQueryParams) => [...expenseKeys.lists(), { params }] as const,
    details: () => [...expenseKeys.all, 'detail'] as const,
    detail: (id: string) => [...expenseKeys.details(), id] as const,
};

// Get all expenses hook with optional filtering, pagination, and sorting
export const useGetExpenses = (params?: ExpensesQueryParams) => {
    return useQuery({
        queryKey: expenseKeys.list(params),
        queryFn: async () => {
            const response = await expensesServices.getExpenses(params);
            return {
                expenses: response.data.expenses,
                pagination: response.data.pagination
            };
        },
    });
};

// Get single expense hook by ID
export const useGetExpense = (id: string) => {
    return useQuery({
        queryKey: expenseKeys.detail(id),
        queryFn: async () => {
            const response = await expensesServices.getExpense(id);
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
            expensesServices.createExpense(expenseData),
        onSuccess: (response) => {
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
            expensesServices.updateExpense(id, expenseData),
        onSuccess: (response, { id }) => {
            queryClient.invalidateQueries({
                queryKey: expenseKeys.detail(id),
            });

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
        mutationFn: (id: string) => expensesServices.deleteExpense(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: expenseKeys.lists(),
            });

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