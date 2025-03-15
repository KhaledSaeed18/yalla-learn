import { api } from '@/lib/api/baseAPI';
import { ForgotPasswordRequest, ForgotPasswordResponse } from '@/types/auth/forgotPassword.types';

export const forgotPasswordServices = {
    /**
     * Send forgot password request to receive reset code
     * @param emailData - User's email
     * @returns A promise that resolves to the forgot password response
     */
    forgotPassword: (emailData: ForgotPasswordRequest) => {
        return api.post<ForgotPasswordResponse>('/auth/forgot-password', emailData);
    },
};