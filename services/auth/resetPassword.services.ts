import { api } from '@/lib/api/baseAPI';
import { ResetPasswordRequest, ResetPasswordResponse } from '@/types/auth/resetPassword.types';

export const resetPasswordServices = {
    /**
     * Reset user password with verification code
     * @param resetData - Email, verification code, and new password
     * @returns A promise that resolves to the reset password response
     */
    resetPassword: (resetData: ResetPasswordRequest) => {
        return api.post<ResetPasswordResponse>(
            '/auth/reset-password',
            resetData
        );
    },
};