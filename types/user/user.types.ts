export type UserRole = 'USER' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isVerified: boolean;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    isVerified?: boolean;
    sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}

export interface GetUsersResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        users: User[];
        pagination: Pagination;
    };
}

export interface DeleteUserResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface UserStatistics {
    totalUsers: number;
    newUsersToday: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    adminUsers: number;
    regularUsers: number;
    usersByMonth: {
        month: string;
        count: number;
    }[];
}

export interface GetUserStatisticsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        statistics: UserStatistics;
    };
}

export interface UserError {
    message: string;
    status?: number;
}
