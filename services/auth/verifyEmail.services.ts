import { api } from '@/lib/api/baseAPI';
import {
    VerifyEmailRequest,
    VerifyEmailResponse,
    ResendVerificationRequest,
    ResendVerificationResponse
} from '@/types/auth/verifyEmail.types';

export const verifyEmailServices = {
    /**
     * Verify user email with verification code
     * @param verificationData - Email and verification code
     * @returns A promise that resolves to the verification response
     */
    verifyEmail: (verificationData: VerifyEmailRequest) => {
        return api.post<VerifyEmailResponse>('/auth/verify-email', verificationData);
    },

    /**
     * Resend verification code to user email
     * @param emailData - User email
     * @returns A promise that resolves to the resend verification response
     */
    resendVerification: (emailData: ResendVerificationRequest) => {
        return api.post<ResendVerificationResponse>('/auth/resend-verification', emailData);
    },
};