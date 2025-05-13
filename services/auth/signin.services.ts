import { api } from '@/lib/api/baseAPI';
import { SignInRequest, SignInResponse, TwoFactorSignInRequest } from '@/types/auth/signin.types';

export const authServices = {
    /**
     * Sign in a user with email and password
     * @param credentials - The user's email and password
     * @returns A promise that resolves to the sign-in response
     */
    signIn: (credentials: SignInRequest) => {
        return api.post<SignInResponse>(
            '/auth/signin',
            credentials
        );
    },

    /**
     * Complete sign in with 2FA token
     * @param credentials - The user's email, password, and 2FA token
     * @returns A promise that resolves to the sign-in response
     */
    twoFactorSignIn: (credentials: TwoFactorSignInRequest) => {
        return api.post<SignInResponse>(
            '/auth/2fa/signin',
            credentials
        );
    },
};