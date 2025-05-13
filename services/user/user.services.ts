import { api } from '@/lib/api/baseAPI';
import {
    GetUsersResponse,
    DeleteUserResponse,
    GetUserStatisticsResponse,
    UserQueryParams,
    GetUserProfileResponse,
    UpdateProfileRequest,
    UpdateProfileResponse,
    DeleteAccountResponse,
    ChangePasswordRequest,
    ChangePasswordResponse
} from '@/types/user/user.types';

export const userServices = {

    // User Services:
    /**
     * Get the authenticated user's profile
     * @returns A promise that resolves to the user profile response
     */
    getUserProfile: () => {
        return api.get<GetUserProfileResponse>('/users/profile');
    },

    /**
     * Update the authenticated user's profile
     * @param data - The profile data to update
     * @returns A promise that resolves to the updated profile response
     */
    updateProfile: (data: UpdateProfileRequest) => {
        return api.put<UpdateProfileResponse>('/users/update-profile', data);
    },

    /**
     * Delete the authenticated user's account
     * @returns A promise that resolves to the delete account response
     */
    deleteAccount: () => {
        return api.delete<DeleteAccountResponse>('/users/delete-account');
    },

    /**
     * Change the authenticated user's password
     * @param data - The old and new password
     * @returns A promise that resolves to the change password response
     */
    changePassword: (data: ChangePasswordRequest) => {
        return api.post<ChangePasswordResponse>('/users/change-password', data);
    },

    // admin services:

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
