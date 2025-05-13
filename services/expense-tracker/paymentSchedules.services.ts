import { api } from '@/lib/api/baseAPI';
import {
    GetPaymentSchedulesResponse,
    GetPaymentScheduleResponse,
    CreatePaymentScheduleRequest,
    CreatePaymentScheduleResponse,
    UpdatePaymentScheduleRequest,
    UpdatePaymentScheduleResponse,
    DeletePaymentScheduleResponse,
    PaymentSchedulesQueryParams
} from '@/types/expense-tracker/expenseTracker.types';

export const paymentSchedulesServices = {
    /**
     * Get all payment schedules with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the payment schedules response
     */
    getPaymentSchedules: (params?: PaymentSchedulesQueryParams) => {
        return api.get<GetPaymentSchedulesResponse>(
            '/expense-tracker/get-payment-schedules',
            params
        );
    },

    /**
     * Get a single payment schedule by ID
     * @param id - The payment schedule ID
     * @returns A promise that resolves to the payment schedule response
     */
    getPaymentSchedule: (id: string) => {
        return api.get<GetPaymentScheduleResponse>(
            `/expense-tracker/get-payment-schedule/${id}`
        );
    },

    /**
     * Create a new payment schedule
     * @param paymentScheduleData - The payment schedule data to create
     * @returns A promise that resolves to the created payment schedule response
     */
    createPaymentSchedule: (paymentScheduleData: CreatePaymentScheduleRequest) => {
        return api.post<CreatePaymentScheduleResponse>(
            '/expense-tracker/create-payment-schedule',
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
            `/expense-tracker/update-payment-schedule/${id}`,
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
            `/expense-tracker/delete-payment-schedule/${id}`
        );
    }
};
