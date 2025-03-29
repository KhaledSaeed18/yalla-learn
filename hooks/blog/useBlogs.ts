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
    userBlogs: () => [...blogKeys.all, 'userBlogs'] as const,
    userBlogsList: (params?: BlogPostsQueryParams) => [...blogKeys.userBlogs(), { params }] as const,
    statistics: () => [...blogKeys.all, 'statistics'] as const,
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

// Get blog posts belonging to the authenticated user
export const useGetUserBlogPosts = (params?: BlogPostsQueryParams) => {
    return useQuery({
        queryKey: blogKeys.userBlogsList(params),
        queryFn: async () => {
            const response = await blogServices.getUserBlogPosts(params);
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

            queryClient.getQueriesData({ queryKey: blogKeys.userBlogs() }).forEach(([queryKey, queryData]) => {
                if (queryData && typeof queryData === 'object' && 'posts' in queryData) {
                    const typedData = queryData as {
                        posts: BlogPost[];
                        pagination?: { total: number }
                    };

                    queryClient.setQueryData(queryKey, {
                        ...queryData,
                        posts: [response.data.blogPost, ...typedData.posts],
                        pagination: typedData.pagination ? {
                            ...typedData.pagination,
                            total: (typedData.pagination.total || 0) + 1
                        } : undefined
                    });
                }
            });

            queryClient.invalidateQueries({
                queryKey: blogKeys.statistics(),
            });

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
        onSuccess: (response, { id, postData }) => {
            queryClient.setQueryData(
                blogKeys.detail(id),
                (oldData: BlogPost | undefined) => {
                    if (!oldData) return oldData;
                    return { ...oldData, ...postData };
                }
            );

            queryClient.getQueriesData({ queryKey: blogKeys.userBlogs() }).forEach(([queryKey, queryData]) => {
                if (queryData && typeof queryData === 'object' && 'posts' in queryData) {
                    queryClient.setQueryData(queryKey, {
                        ...queryData,
                        posts: (queryData.posts as BlogPost[]).map((post: BlogPost) =>
                            post.id === id ? { ...post, ...postData } : post
                        )
                    });
                }
            });

            queryClient.invalidateQueries({
                queryKey: blogKeys.statistics(),
            });

            toast.success('Blog post updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update blog post');
        },
    });
};

// Delete blog post hook
export const useDeleteBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => blogServices.deleteBlogPost(id),
        onSuccess: (_, id) => {
            queryClient.getQueriesData({ queryKey: blogKeys.userBlogs() }).forEach(([queryKey, queryData]) => {
                if (queryData && typeof queryData === 'object' && 'posts' in queryData) {
                    const typedData = queryData as {
                        posts: BlogPost[];
                        pagination?: { total: number }
                    };

                    queryClient.setQueryData(queryKey, {
                        ...queryData,
                        posts: typedData.posts.filter((post: BlogPost) => post.id !== id),
                        pagination: typedData.pagination ? {
                            ...typedData.pagination,
                            total: Math.max(0, typedData.pagination.total - 1)
                        } : undefined
                    });
                }
            });

            queryClient.removeQueries({
                queryKey: blogKeys.detail(id),
            });

            queryClient.invalidateQueries({
                queryKey: blogKeys.statistics(),
            });

            toast.success('Blog post deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete blog post');
        },
    });
};

// Admin delete blog post hook - allows admin to delete any blog post
export const useAdminDeleteBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => blogServices.adminDeleteBlogPost(id),
        onSuccess: (_, id) => {
            queryClient.getQueriesData({ queryKey: blogKeys.lists() }).forEach(([queryKey, queryData]) => {
                if (queryData && typeof queryData === 'object' && 'posts' in queryData) {
                    const typedData = queryData as {
                        posts: BlogPost[];
                        pagination?: { total: number }
                    };

                    queryClient.setQueryData(queryKey, {
                        ...queryData,
                        posts: typedData.posts.filter((post: BlogPost) => post.id !== id),
                        pagination: typedData.pagination ? {
                            ...typedData.pagination,
                            total: Math.max(0, typedData.pagination.total - 1)
                        } : undefined
                    });
                }
            });

            queryClient.getQueriesData({ queryKey: blogKeys.userBlogs() }).forEach(([queryKey, queryData]) => {
                if (queryData && typeof queryData === 'object' && 'posts' in queryData) {
                    const typedData = queryData as {
                        posts: BlogPost[];
                        pagination?: { total: number }
                    };

                    queryClient.setQueryData(queryKey, {
                        ...queryData,
                        posts: typedData.posts.filter((post: BlogPost) => post.id !== id),
                        pagination: typedData.pagination ? {
                            ...typedData.pagination,
                            total: Math.max(0, typedData.pagination.total - 1)
                        } : undefined
                    });
                }
            });

            queryClient.removeQueries({
                queryKey: blogKeys.detail(id),
            });

            queryClient.invalidateQueries({
                queryKey: blogKeys.statistics(),
            });

            toast.success('Blog post deleted successfully by admin');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Admin failed to delete blog post');
        },
    });
};

// Get admin blog statistics hook
export const useGetAdminBlogStatistics = () => {
    return useQuery({
        queryKey: blogKeys.statistics(),
        queryFn: async () => {
            const response = await blogServices.getAdminBlogStatistics();
            return response.data.statistics;
        },
    });
};