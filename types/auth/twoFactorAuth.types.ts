export interface TwoFactorSetupResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        secret: string;
        qrCode: string;
    };
}

export interface TwoFactorVerifyRequest {
    token: string;
}

export interface TwoFactorVerifyResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface TwoFactorDisableRequest {
    token: string;
}

export interface TwoFactorDisableResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface TwoFactorStatusResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        totpEnabled: boolean;
    };
}
