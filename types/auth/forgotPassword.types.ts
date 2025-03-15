export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    status: string;
    statusCode: number;
    message: string;
}