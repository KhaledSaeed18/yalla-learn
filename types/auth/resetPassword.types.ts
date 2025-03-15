export interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    status: string;
    statusCode: number;
    message: string;
}