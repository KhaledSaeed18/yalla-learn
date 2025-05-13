import { api } from '@/lib/api/baseAPI';
import {
    GetUsersResponse,
    DeleteUserResponse,
    GetUserStatisticsResponse,
    UserQueryParams
} from '@/types/user/user.types';

export const userServices = {
    /**
     * Get all users with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the users response
     */
    getUsers: (params?: UserQueryParams) => {
        return api.get<GetUsersResponse>(
            '/users/admin/users',
            params
        );
    },

    /**
     * Delete a user by ID
     * @param id - The user ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteUser: (id: string) => {
        return api.delete<DeleteUserResponse>(
            `/users/admin/delete-user/${id}`
        );
    },

    /**
     * Get user statistics for admin dashboard
     * @returns A promise that resolves to the user statistics response
     */
    getUserStatistics: () => {
        return api.get<GetUserStatisticsResponse>(
            '/users/admin/statistics'
        );
    }
};
