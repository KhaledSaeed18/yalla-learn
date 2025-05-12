import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseCategoryServices } from '@/services/expense-tracker/categories.services';
import { ExpenseCategory, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/expense-tracker/expenseTracker.types';
import { toast } from 'sonner';

// Query keys
export const expenseCategoryKeys = {
    all: ['expenseCategories'] as const,
    lists: () => [...expenseCategoryKeys.all, 'list'] as const,
    list: (filters: any) => [...expenseCategoryKeys.lists(), { filters }] as const,
    details: () => [...expenseCategoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...expenseCategoryKeys.details(), id] as const,
};

// Get all categories hook
export const useGetExpenseCategories = () => {
    return useQuery({
        queryKey: expenseCategoryKeys.lists(),
        queryFn: async () => {
            const response = await expenseCategoryServices.getCategories();
            return response.data.categories;
        },
    });
};

// Get single category hook
export const useGetExpenseCategory = (id: string) => {
    return useQuery({
        queryKey: expenseCategoryKeys.detail(id),
        queryFn: async () => {
            const response = await expenseCategoryServices.getCategoryById(id);
            return response.data.category;
        },
        enabled: !!id,
    });
};

// Create category hook
export const useCreateExpenseCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryData: CreateCategoryRequest) =>
            expenseCategoryServices.createCategory(categoryData),
        onSuccess: (response) => {
            queryClient.setQueryData<ExpenseCategory[]>(
                expenseCategoryKeys.lists(),
                (oldData = []) => [...oldData, response.data.category]
            );

            queryClient.invalidateQueries({
                queryKey: expenseCategoryKeys.lists(),
            });

            toast.success("Category created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create category');
        },
    });
};

// Update category hook
export const useUpdateExpenseCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, categoryData }: { id: string; categoryData: UpdateCategoryRequest }) =>
            expenseCategoryServices.updateCategory(id, categoryData),
        onSuccess: (response, { id }) => {
            queryClient.setQueryData(
                expenseCategoryKeys.detail(id),
                response.data.category
            );

            queryClient.setQueryData<ExpenseCategory[]>(
                expenseCategoryKeys.lists(),
                (oldData = []) =>
                    oldData.map((item) =>
                        item.id === id ? response.data.category : item
                    )
            );

            toast.success('Category updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update category');
        },
    });
};

// Delete category hook
export const useDeleteExpenseCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => expenseCategoryServices.deleteCategory(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<ExpenseCategory[]>(
                expenseCategoryKeys.lists(),
                (oldData = []) => oldData.filter((item) => item.id !== id)
            );

            queryClient.removeQueries({
                queryKey: expenseCategoryKeys.detail(id),
            });

            toast.success('Category deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete category');
        },
    });
};
