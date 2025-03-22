import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogCategoryServices } from '@/services/blog/blogCategories.services';
import { BlogCategory, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/blog/blogCategories.types';
import { toast } from 'sonner';

// Query keys
export const blogCategoryKeys = {
    all: ['blogCategories'] as const,
    lists: () => [...blogCategoryKeys.all, 'list'] as const,
    list: (filters: any) => [...blogCategoryKeys.lists(), { filters }] as const,
    details: () => [...blogCategoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...blogCategoryKeys.details(), id] as const,
};

// Get all categories hook
export const useGetBlogCategories = () => {
    return useQuery({
        queryKey: blogCategoryKeys.lists(),
        queryFn: async () => {
            const response = await blogCategoryServices.getCategories();
            return response.data.categories;
        },
    });
};

// Get single category hook
export const useGetBlogCategory = (id: string) => {
    return useQuery({
        queryKey: blogCategoryKeys.detail(id),
        queryFn: async () => {
            const response = await blogCategoryServices.getCategoryById(id);
            return response.data.category;
        },
        enabled: !!id,
    });
};

// Create category hook
export const useCreateBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryData: CreateCategoryRequest) =>
            blogCategoryServices.createCategory(categoryData),
        onSuccess: (response) => {
            queryClient.setQueryData<BlogCategory[]>(
                blogCategoryKeys.lists(),
                (oldData = []) => [...oldData, response.data.category]
            );

            queryClient.invalidateQueries({
                queryKey: blogCategoryKeys.lists(),
            });

            toast.success("Category created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create category');
        },
    });
};

// Update category hook
export const useUpdateBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, categoryData }: { id: string; categoryData: UpdateCategoryRequest }) =>
            blogCategoryServices.updateCategory(id, categoryData),
        onSuccess: (response, { id }) => {
            queryClient.setQueryData(
                blogCategoryKeys.detail(id),
                response.data.category
            );

            queryClient.setQueryData<BlogCategory[]>(
                blogCategoryKeys.lists(),
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
export const useDeleteBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => blogCategoryServices.deleteCategory(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<BlogCategory[]>(
                blogCategoryKeys.lists(),
                (oldData = []) => oldData.filter((item) => item.id !== id)
            );

            queryClient.removeQueries({
                queryKey: blogCategoryKeys.detail(id),
            });

            toast.success('Category deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete category');
        },
    });
};