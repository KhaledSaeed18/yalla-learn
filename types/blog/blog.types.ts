import { BlogCategory } from './blogCategories.types';

export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface BlogUser {
    id: string;
    firstName: string;
    lastName: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    thumbnail: string | null;
    status: PostStatus;
    readTime: string | number;
    publishedAt: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
    categories: BlogCategory[];
    user: BlogUser;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BlogPostsQueryParams {
    page?: number;
    limit?: number;
    status?: PostStatus;
    categoryId?: string;
    search?: string;
    sortBy?: 'title' | 'createdAt' | 'publishedAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}

export interface GetBlogPostsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        posts: BlogPost[];
        pagination: Pagination;
    };
}

export interface GetBlogPostResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        post: BlogPost;
    };
}

export interface CreateBlogPostRequest {
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    thumbnail?: string | null;
    status: PostStatus;
    readTime: number;
    publishedAt?: string | null;
    categoryIds: string[];
}

export interface CreateBlogPostResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        blogPost: BlogPost;
    };
}

export interface UpdateBlogPostRequest {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string | null;
    thumbnail?: string | null;
    status?: PostStatus;
    readTime?: number;
    publishedAt?: string | null;
    categoryIds?: string[];
}

export interface UpdateBlogPostResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        blogPost: BlogPost;
    };
}

export interface DeleteBlogPostResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface BlogPostError {
    message: string;
    status?: number;
}