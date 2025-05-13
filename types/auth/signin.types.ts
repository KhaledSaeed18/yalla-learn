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
    twoFactorEnabled?: boolean
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
    };
}

export interface SignInError {
    message: string;
    status?: number;
}