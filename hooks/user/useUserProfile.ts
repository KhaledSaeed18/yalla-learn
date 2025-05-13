import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userServices } from '@/services/user/user.services';
import {
    UpdateProfileRequest,
    ChangePasswordRequest,
    User
} from '@/types/user/user.types';
import { toast } from 'sonner';

// Query keys
export const userProfileKeys = {
    profile: ['userProfile'] as const,
};

// Get authenticated user profile
export const useGetUserProfile = () => {
    return useQuery({
        queryKey: userProfileKeys.profile,
        queryFn: async () => {
            const response = await userServices.getUserProfile();
            return response.data.user;
        },
    });
};

// Update user profile
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => userServices.updateProfile(data),
        onSuccess: (response) => {
            queryClient.setQueryData(userProfileKeys.profile, response.data.user);
            toast.success('Profile updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update profile');
        },
    });
};

// Delete user account
export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: () => userServices.deleteAccount(),
        onSuccess: () => {
            toast.success('Account deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete account');
        },
    });
};

// Change password
export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => userServices.changePassword(data),
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to change password');
        },
    });
};
