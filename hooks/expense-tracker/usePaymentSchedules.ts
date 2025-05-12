import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentScheduleServices } from '@/services/expense-tracker/paymentSchedules.services';
import {
    PaymentSchedule,
    PaymentScheduleQueryParams,
    CreatePaymentScheduleRequest,
    UpdatePaymentScheduleRequest
} from '@/types/expense-tracker/expenseTracker.types';
import { toast } from 'sonner';

// Query keys
export const paymentScheduleKeys = {
    all: ['paymentSchedules'] as const,
    lists: () => [...paymentScheduleKeys.all, 'list'] as const,
    list: (params?: PaymentScheduleQueryParams) => [...paymentScheduleKeys.lists(), { params }] as const,
    details: () => [...paymentScheduleKeys.all, 'detail'] as const,
    detail: (id: string) => [...paymentScheduleKeys.details(), id] as const,
};

// Get all payment schedules hook with optional filtering
export const useGetPaymentSchedules = (params?: PaymentScheduleQueryParams) => {
    return useQuery({
        queryKey: paymentScheduleKeys.list(params),
        queryFn: async () => {
            const response = await paymentScheduleServices.getPaymentSchedules(params);
            return response.data.paymentSchedules;
        },
    });
};

// Get single payment schedule hook
export const useGetPaymentSchedule = (id: string) => {
    return useQuery({
        queryKey: paymentScheduleKeys.detail(id),
        queryFn: async () => {
            const response = await paymentScheduleServices.getPaymentScheduleById(id);
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
            paymentScheduleServices.createPaymentSchedule(paymentScheduleData),
        onSuccess: (response) => {
            // Update payment schedules list
            queryClient.setQueryData<PaymentSchedule[]>(
                paymentScheduleKeys.lists(),
                (oldData = []) => [...oldData, response.data.paymentSchedule]
            );

            // Invalidate related queries
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
            paymentScheduleServices.updatePaymentSchedule(id, paymentScheduleData),
        onSuccess: (response, { id }) => {
            // Update payment schedule detail
            queryClient.setQueryData(
                paymentScheduleKeys.detail(id),
                response.data.paymentSchedule
            );

            // Update payment schedule in lists
            queryClient.setQueryData<PaymentSchedule[]>(
                paymentScheduleKeys.lists(),
                (oldData = []) =>
                    oldData.map((item) =>
                        item.id === id ? response.data.paymentSchedule : item
                    )
            );

            toast.success('Payment schedule updated successfully');
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
        mutationFn: (id: string) => paymentScheduleServices.deletePaymentSchedule(id),
        onSuccess: (_, id) => {
            // Remove from payment schedule lists
            queryClient.setQueryData<PaymentSchedule[]>(
                paymentScheduleKeys.lists(),
                (oldData = []) => oldData.filter((item) => item.id !== id)
            );

            // Remove specific payment schedule data
            queryClient.removeQueries({
                queryKey: paymentScheduleKeys.detail(id),
            });

            toast.success('Payment schedule deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete payment schedule');
        },
    });
};
