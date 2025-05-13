import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentSchedulesServices } from '@/services/expense-tracker/paymentSchedules.services';
import {
    PaymentSchedulesQueryParams,
    CreatePaymentScheduleRequest,
    UpdatePaymentScheduleRequest
} from '@/types/expense-tracker/expenseTracker.types';

// Query keys
export const paymentScheduleKeys = {
    all: ['paymentSchedules'] as const,
    lists: () => [...paymentScheduleKeys.all, 'list'] as const,
    list: (params?: PaymentSchedulesQueryParams) => [...paymentScheduleKeys.lists(), { params }] as const,
    details: () => [...paymentScheduleKeys.all, 'detail'] as const,
    detail: (id: string) => [...paymentScheduleKeys.details(), id] as const,
};

// Get all payment schedules hook with optional filtering, pagination, and sorting
export const useGetPaymentSchedules = (params?: PaymentSchedulesQueryParams) => {
    return useQuery({
        queryKey: paymentScheduleKeys.list(params),
        queryFn: async () => {
            const response = await paymentSchedulesServices.getPaymentSchedules(params);
            return {
                paymentSchedules: response.data.paymentSchedules,
                pagination: response.data.pagination
            };
        },
    });
};

// Get single payment schedule hook by ID
export const useGetPaymentSchedule = (id: string) => {
    return useQuery({
        queryKey: paymentScheduleKeys.detail(id),
        queryFn: async () => {
            const response = await paymentSchedulesServices.getPaymentSchedule(id);
            return response.data.paymentSchedule;
        },
        enabled: !!id,
    });
};

// Create payment schedule hook
export const useCreatePaymentSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (paymentScheduleData: CreatePaymentScheduleRequest) =>
            paymentSchedulesServices.createPaymentSchedule(paymentScheduleData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: paymentScheduleKeys.lists(),
            });

            toast.success("Payment schedule created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create payment schedule');
        },
    });
};

// Update payment schedule hook
export const useUpdatePaymentSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, paymentScheduleData }: { id: string; paymentScheduleData: UpdatePaymentScheduleRequest }) =>
            paymentSchedulesServices.updatePaymentSchedule(id, paymentScheduleData),
        onSuccess: (response, { id }) => {
            queryClient.invalidateQueries({
                queryKey: paymentScheduleKeys.detail(id),
            });

            queryClient.invalidateQueries({
                queryKey: paymentScheduleKeys.lists(),
            });

            toast.success("Payment schedule updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update payment schedule');
        },
    });
};

// Delete payment schedule hook
export const useDeletePaymentSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => paymentSchedulesServices.deletePaymentSchedule(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: paymentScheduleKeys.lists(),
            });

            toast.success("Payment schedule deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete payment schedule');
        },
    });
};
