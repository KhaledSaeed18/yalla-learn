export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GetCategoriesResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        categories: BlogCategory[];
    };
}

export interface GetCategoryResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        category: BlogCategory;
    };
}

export interface CreateCategoryRequest {
    name: string;
    slug: string;
    description?: string | null;
}

export interface CreateCategoryResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        category: BlogCategory;
    };
}

export interface UpdateCategoryRequest {
    name?: string;
    slug?: string;
    description?: string | null;
}

export interface UpdateCategoryResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        category: BlogCategory;
    };
}

export interface DeleteCategoryResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface CategoryError {
    message: string;
    status?: number;
}