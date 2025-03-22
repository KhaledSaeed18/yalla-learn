import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogServices } from '@/services/blog/blog.services';
import { BlogPost, BlogPostsQueryParams, CreateBlogPostRequest, UpdateBlogPostRequest } from '@/types/blog/blog.types';
import { toast } from 'sonner';

// Query keys
export const blogKeys = {
    all: ['blogs'] as const,
    lists: () => [...blogKeys.all, 'list'] as const,
    list: (params?: BlogPostsQueryParams) => [...blogKeys.lists(), { params }] as const,
    details: () => [...blogKeys.all, 'detail'] as const,
    detail: (idOrSlug: string) => [...blogKeys.details(), idOrSlug] as const,
};

// Get all blog posts hook with optional filtering, pagination, and sorting
export const useGetBlogPosts = (params?: BlogPostsQueryParams) => {
    return useQuery({
        queryKey: blogKeys.list(params),
        queryFn: async () => {
            const response = await blogServices.getBlogPosts(params);
            return {
                posts: response.data.posts,
                pagination: response.data.pagination
            };
        },
    });
};

// Get single blog post hook by ID or slug
export const useGetBlogPost = (idOrSlug: string) => {
    return useQuery({
        queryKey: blogKeys.detail(idOrSlug),
        queryFn: async () => {
            const response = await blogServices.getBlogPost(idOrSlug);
            return response.data.post;
        },
        enabled: !!idOrSlug,
    });
};

// Create blog post hook
export const useCreateBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postData: CreateBlogPostRequest) =>
            blogServices.createBlogPost(postData),
        onSuccess: (response) => {
            queryClient.setQueryData(
                blogKeys.list(),
                (oldData: any) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        posts: [response.data.blogPost, ...(oldData.posts || [])],
                        pagination: oldData.pagination ? {
                            ...oldData.pagination,
                            total: (oldData.pagination.total || 0) + 1
                        } : undefined
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: blogKeys.lists(),
            });

            toast.success("Blog post created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create blog post');
        },
    });
};

// Update blog post hook
export const useUpdateBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, postData }: { id: string; postData: UpdateBlogPostRequest }) =>
            blogServices.updateBlogPost(id, postData),
        onSuccess: (response, { id }) => {
            queryClient.setQueryData(
                blogKeys.detail(id),
                response.data.blogPost
            );

            queryClient.invalidateQueries({
                queryKey: blogKeys.lists(),
            });

            toast.success('Blog post updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update blog post');
        },
    });
};

export const useDeleteBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => blogServices.deleteBlogPost(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: blogKeys.lists(),
            });

            queryClient.removeQueries({
                queryKey: blogKeys.detail(id),
            });

            toast.success('Blog post deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete blog post');
        },
    });
};