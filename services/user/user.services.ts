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
import {
    TwoFactorSetupResponse,
    TwoFactorVerifyRequest,
    TwoFactorVerifyResponse,
    TwoFactorDisableRequest,
    TwoFactorDisableResponse,
    TwoFactorStatusResponse
} from '@/types/auth/twoFactorAuth.types';

export const userServices = {

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

    /**
     * Check 2-factor authentication status
     * @returns A promise that resolves to the 2FA status response
     */
    check2FAStatus: () => {
        return api.get<TwoFactorStatusResponse>('/auth/2fa/status');
    },

    /**
     * Setup 2-factor authentication
     * @returns A promise that resolves to the 2FA setup response
     */
    setup2FA: () => {
        return api.post<TwoFactorSetupResponse>('/auth/2fa/setup');
    },

    /**
     * Verify and enable 2-factor authentication
     * @param data - The verification token from authenticator app
     * @returns A promise that resolves to the 2FA verification response
     */
    verify2FA: (data: TwoFactorVerifyRequest) => {
        return api.post<TwoFactorVerifyResponse>('/auth/2fa/verify', data);
    },

    /**
     * Disable 2-factor authentication
     * @param data - The token from authenticator app
     * @returns A promise that resolves to the 2FA disable response
     */
    disable2FA: (data: TwoFactorDisableRequest) => {
        return api.post<TwoFactorDisableResponse>('/auth/2fa/disable', data);
    },


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
