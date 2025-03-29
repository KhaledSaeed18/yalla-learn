import { api } from '@/lib/api/baseAPI';
import { GetBlogPostsResponse, GetBlogPostResponse, CreateBlogPostRequest, CreateBlogPostResponse, UpdateBlogPostRequest, UpdateBlogPostResponse, DeleteBlogPostResponse, BlogPostsQueryParams } from '@/types/blog/blog.types';

export const blogServices = {
    /**
     * Get all blog posts with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the blog posts response
     */
    getBlogPosts: (params?: BlogPostsQueryParams) => {
        return api.get<GetBlogPostsResponse>(
            '/blog/get-posts',
            params
        );
    },

    /**
     * Get blog posts belonging to the authenticated user
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the user's blog posts response
     */
    getUserBlogPosts: (params?: BlogPostsQueryParams) => {
        return api.get<GetBlogPostsResponse>(
            '/blog/get-user-blogs',
            params
        );
    },

    /**
     * Get a single blog post by ID or slug
     * @param idOrSlug - The blog post ID or slug
     * @returns A promise that resolves to the blog post response
     */
    getBlogPost: (idOrSlug: string) => {
        return api.get<GetBlogPostResponse>(
            `/blog/get-post/${idOrSlug}`
        );
    },

    /**
     * Create a new blog post
     * @param postData - The blog post data to create
     * @returns A promise that resolves to the created blog post response
     */
    createBlogPost: (postData: CreateBlogPostRequest) => {
        return api.post<CreateBlogPostResponse>(
            '/blog/create-post',
            postData
        );
    },

    /**
     * Update an existing blog post
     * @param id - The blog post ID to update
     * @param postData - The updated blog post data
     * @returns A promise that resolves to the updated blog post response
     */
    updateBlogPost: (id: string, postData: UpdateBlogPostRequest) => {
        return api.put<UpdateBlogPostResponse>(
            `/blog/update-post/${id}`,
            postData
        );
    },

    /**
     * Delete a blog post
     * @param id - The blog post ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteBlogPost: (id: string) => {
        return api.delete<DeleteBlogPostResponse>(
            `/blog/delete-post/${id}`
        );
    },

    /**
    * Admin endpoint to delete any blog post
    * @param id - The blog post ID to delete
    * @returns A promise that resolves to the delete response
    */
    adminDeleteBlogPost: (id: string) => {
        return api.delete<DeleteBlogPostResponse>(
            `/admin/delete-post/${id}`
        );
    }
};