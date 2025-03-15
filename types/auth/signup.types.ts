import { User } from "./signin.types";

export interface SignUpRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        user: User;
    };
}

export interface SignUpError {
    message: string;
    status?: number;
}