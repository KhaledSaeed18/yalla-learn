'use client';

import { useState } from 'react';
import RoleBasedRoute from '@/components/RoleBasedRoute';
import { useUserRole } from '@/hooks/useUserRole';
import {
    useGetBlogCategories,
    useCreateBlogCategory,
    useUpdateBlogCategory,
    useDeleteBlogCategory
} from '@/hooks/blog/useBlogCategories';
import { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/blog/blogCategories.types';

export default function DashboardPage() {
    const { isAdmin } = useUserRole();

    // Use the query hooks
    const {
        data: blogCategories = [],
        isLoading,
        isError,
        error,
        refetch
    } = useGetBlogCategories();

    // Use mutation hooks
    const createCategory = useCreateBlogCategory();
    const updateCategory = useUpdateBlogCategory();
    const deleteCategory = useDeleteBlogCategory();

    // Form state for create/update (simplified example)
    const [categoryForm, setCategoryForm] = useState<CreateCategoryRequest>({
        name: '',
        slug: '',
        description: ''
    });

    // Handle form submission for creating a category
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        createCategory.mutate(categoryForm);
    };

    // Handle updating a category
    const handleUpdateCategory = (id: string) => {
        updateCategory.mutate({
            id,
            categoryData: categoryForm as UpdateCategoryRequest
        });
    };

    // Handle deleting a category
    const handleDeleteCategory = (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory.mutate(id);
        }
    };

    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            {isAdmin ? (
                <div className="">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-500">Welcome to the admin dashboard</p>

                    {/* Status section */}
                    {isError && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                            Error: {(error as any)?.message || 'Failed to fetch categories'}
                        </div>
                    )}

                    {/* Simple form example */}
                    <form onSubmit={handleCreateCategory} className="mt-4 p-4 border rounded">
                        <h2 className="text-lg font-bold mb-2">Create New Category</h2>
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="Category Name"
                                className="w-full px-3 py-2 border rounded"
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="Slug"
                                className="w-full px-3 py-2 border rounded"
                                value={categoryForm.slug}
                                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <textarea
                                placeholder="Description"
                                className="w-full px-3 py-2 border rounded"
                                value={categoryForm.description || ''}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={createCategory.isPending}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {createCategory.isPending ? 'Creating...' : 'Create Category'}
                        </button>
                    </form>

                    {/* Categories list with loading state */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">Blog Categories</h2>
                            <button
                                onClick={() => refetch()}
                                disabled={isLoading}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Refresh
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="mt-4 p-4 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                                <p className="mt-2">Loading categories...</p>
                            </div>
                        ) : (
                            blogCategories.length > 0 ? (
                                <ul className="mt-2 divide-y">
                                    {blogCategories.map((category) => (
                                        <li key={category.id} className="py-3 flex justify-between items-center">
                                            <span className="font-medium">{category.name}</span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setCategoryForm({
                                                            name: category.name,
                                                            slug: category.slug,
                                                            description: category.description
                                                        });
                                                        // Open edit form or modal in a real implementation
                                                    }}
                                                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                    disabled={deleteCategory.isPending}
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-gray-500">No categories found.</p>
                            )
                        )}
                    </div>
                </div>
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold">User Dashboard</h1>
                    <p className="text-gray-500">Welcome to the user dashboard</p>
                </div>
            )}
        </RoleBasedRoute>
    );
}