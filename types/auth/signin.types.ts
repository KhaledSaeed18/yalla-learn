export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    avatar: string,
    bio: true,
    location: true,
    twoFactorEnabled?: boolean,
    totpEnabled?: boolean
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    } | {
        requiresOtp: boolean;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        }
    };
}

export interface TwoFactorSignInRequest {
    email: string;
    password: string;
    token: string;
}

export interface SignInError {
    message: string;
    status?: number;
}