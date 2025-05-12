import { api } from '@/lib/api/baseAPI';
import {
    GetCategoriesResponse,
    GetCategoryResponse,
    CreateCategoryRequest,
    CreateCategoryResponse,
    UpdateCategoryRequest,
    UpdateCategoryResponse,
    DeleteCategoryResponse
} from '@/types/expense-tracker/expenseTracker.types';

export const expenseCategoryServices = {
    /**
     * Get all expense categories
     * @returns A promise that resolves to the categories response
     */
    getCategories: () => {
        return api.get<GetCategoriesResponse>(
            '/expense-tracker/categories'
        );
    },

    /**
     * Get a single expense category by ID
     * @param id - The category ID
     * @returns A promise that resolves to the category response
     */
    getCategoryById: (id: string) => {
        return api.get<GetCategoryResponse>(
            `/expense-tracker/categories/${id}`
        );
    },

    /**
     * Create a new expense category
     * @param categoryData - The category data to create
     * @returns A promise that resolves to the created category response
     */
    createCategory: (categoryData: CreateCategoryRequest) => {
        return api.post<CreateCategoryResponse>(
            '/expense-tracker/categories',
            categoryData
        );
    },

    /**
     * Update an existing expense category
     * @param id - The category ID to update
     * @param categoryData - The updated category data
     * @returns A promise that resolves to the updated category response
     */
    updateCategory: (id: string, categoryData: UpdateCategoryRequest) => {
        return api.put<UpdateCategoryResponse>(
            `/expense-tracker/categories/${id}`,
            categoryData
        );
    },

    /**
     * Delete an expense category
     * @param id - The category ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteCategory: (id: string) => {
        return api.delete<DeleteCategoryResponse>(
            `/expense-tracker/categories/${id}`
        );
    }
};
