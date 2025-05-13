import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userServices } from '@/services/user/user.services';
import {
    UserQueryParams,
    User,
    UserStatistics
} from '@/types/user/user.types';
import { toast } from 'sonner';

// Query keys
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (params?: UserQueryParams) => [...userKeys.lists(), { params }] as const,
    statistics: () => [...userKeys.all, 'statistics'] as const,
};

// Get all users hook with optional filtering, pagination, and sorting
export const useGetUsers = (params?: UserQueryParams) => {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: async () => {
            const response = await userServices.getUsers(params);
            return {
                users: response.data.users,
                pagination: response.data.pagination
            };
        },
    });
};

// Delete user hook
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userServices.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: userKeys.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: userKeys.statistics(),
            });

            toast.success('User deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete user');
        },
    });
};

// Get user statistics hook
export const useGetUserStatistics = () => {
    return useQuery({
        queryKey: userKeys.statistics(),
        queryFn: async () => {
            const response = await userServices.getUserStatistics();
            return response.data.statistics;
        },
    });
};
