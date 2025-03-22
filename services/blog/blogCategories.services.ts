import { api } from '@/lib/api/baseAPI';
import {
    BlogCategory,
    GetCategoriesResponse,
    GetCategoryResponse,
    CreateCategoryRequest,
    CreateCategoryResponse,
    UpdateCategoryRequest,
    UpdateCategoryResponse,
    DeleteCategoryResponse
} from '@/types/blog/blogCategories.types';

export const blogCategoryServices = {
    /**
     * Get all blog categories
     * @returns A promise that resolves to the categories response
     */
    getCategories: () => {
        return api.get<GetCategoriesResponse>('/blog/get-categories');
    },

    /**
     * Get a single blog category by ID
     * @param id - The category ID
     * @returns A promise that resolves to the category response
     */
    getCategoryById: (id: string) => {
        return api.get<GetCategoryResponse>(`/blog/get-category/${id}`);
    },

    /**
     * Create a new blog category
     * @param categoryData - The category data to create
     * @returns A promise that resolves to the created category response
     */
    createCategory: (categoryData: CreateCategoryRequest) => {
        return api.post<CreateCategoryResponse>('/blog/create-category', categoryData);
    },

    /**
     * Update an existing blog category
     * @param id - The category ID to update
     * @param categoryData - The updated category data
     * @returns A promise that resolves to the updated category response
     */
    updateCategory: (id: string, categoryData: UpdateCategoryRequest) => {
        return api.put<UpdateCategoryResponse>(`/blog/update-category/${id}`, categoryData);
    },

    /**
     * Delete a blog category
     * @param id - The category ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteCategory: (id: string) => {
        return api.delete<DeleteCategoryResponse>(`/blog/delete-category/${id}`);
    }
};