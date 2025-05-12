import { api } from '@/lib/api/baseAPI';
import {
    GetPaymentSchedulesResponse,
    GetPaymentScheduleResponse,
    CreatePaymentScheduleRequest,
    CreatePaymentScheduleResponse,
    UpdatePaymentScheduleRequest,
    UpdatePaymentScheduleResponse,
    DeletePaymentScheduleResponse,
    PaymentScheduleQueryParams
} from '@/types/expense-tracker/expenseTracker.types';

export const paymentScheduleServices = {
    /**
     * Get all payment schedules with optional filtering
     * @param params - Query parameters for filtering
     * @returns A promise that resolves to the payment schedules response
     */
    getPaymentSchedules: (params?: PaymentScheduleQueryParams) => {
        return api.get<GetPaymentSchedulesResponse>(
            '/expense-tracker/payment-schedules',
            params
        );
    },

    /**
     * Get a single payment schedule by ID
     * @param id - The payment schedule ID
     * @returns A promise that resolves to the payment schedule response
     */
    getPaymentScheduleById: (id: string) => {
        return api.get<GetPaymentScheduleResponse>(
            `/expense-tracker/payment-schedules/${id}`
        );
    },

    /**
     * Create a new payment schedule
     * @param paymentScheduleData - The payment schedule data to create
     * @returns A promise that resolves to the created payment schedule response
     */
    createPaymentSchedule: (paymentScheduleData: CreatePaymentScheduleRequest) => {
        return api.post<CreatePaymentScheduleResponse>(
            '/expense-tracker/payment-schedules',
            paymentScheduleData
        );
    },

    /**
     * Update an existing payment schedule
     * @param id - The payment schedule ID to update
     * @param paymentScheduleData - The updated payment schedule data
     * @returns A promise that resolves to the updated payment schedule response
     */
    updatePaymentSchedule: (id: string, paymentScheduleData: UpdatePaymentScheduleRequest) => {
        return api.put<UpdatePaymentScheduleResponse>(
            `/expense-tracker/payment-schedules/${id}`,
            paymentScheduleData
        );
    },

    /**
     * Delete a payment schedule
     * @param id - The payment schedule ID to delete
     * @returns A promise that resolves to the delete response
     */
    deletePaymentSchedule: (id: string) => {
        return api.delete<DeletePaymentScheduleResponse>(
            `/expense-tracker/payment-schedules/${id}`
        );
    }
};
