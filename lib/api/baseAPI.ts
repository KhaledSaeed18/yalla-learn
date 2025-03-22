import axios, { AxiosResponse, Method } from 'axios';
import { Store } from '@reduxjs/toolkit';

let storeReference: Store | null = null;

export const setStoreReference = (store: Store): void => {
    storeReference = store;
};

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const API_TIMEOUT: number = 30000;

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (storeReference?.getState()?.auth?.isAuthenticated) {
            const token = storeReference.getState().auth.accessToken;
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

type ApiClientResponse<T = any> = T;
type ApiParams = Record<string, any>;

const apiClient = async <T = any>(
    method: Method,
    url: string,
    data?: any,
    params?: ApiParams
): Promise<ApiClientResponse<T>> => {
    try {
        const response: AxiosResponse<T> = await axiosInstance({
            method,
            url,
            data,
            params,
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw {
                status: error.response.status,
                message: error.response.data.message || 'An error occurred',
            } as ApiError;
        }
        throw {
            message: error.message || 'Network error occurred',
        } as ApiError;
    }
};

export const api = {
    get: <T = any>(url: string, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        apiClient<T>('GET', url, undefined, params),
    post: <T = any>(url: string, data?: any, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        apiClient<T>('POST', url, data, params),
    put: <T = any>(url: string, data?: any, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        apiClient<T>('PUT', url, data, params),
    patch: <T = any>(url: string, data?: any, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        apiClient<T>('PATCH', url, data, params),
    delete: <T = any>(url: string, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        apiClient<T>('DELETE', url, undefined, params),
};

export type ApiError = {
    status?: number;
    message: string;
};