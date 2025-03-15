export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface VerifyEmailResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            isVerified: boolean;
        }
    };
}

export interface ResendVerificationRequest {
    email: string;
}

export interface ResendVerificationResponse {
    status: string;
    statusCode: number;
    message: string;
}