import axios, { AxiosResponse, Method } from 'axios';
import { Store } from '@reduxjs/toolkit';
import { logout } from '@/lib/auth/logout';
import { refreshTokenAction } from '@/redux/slices/authSlice';

let storeReference: Store | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

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

// Process queued requests with new token or reject them
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(request => {
        if (error) {
            request.reject(error);
        } else {
            request.resolve(token);
        }
    });

    failedQueue = [];
};

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

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data?.message === "Unauthorized: Token has expired" &&
            !originalRequest._retry &&
            storeReference
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const result = await storeReference.dispatch(refreshTokenAction() as any);

                if (result.meta.requestStatus === 'fulfilled') {
                    const newToken = result.payload.accessToken;
                    console.log('New token:', newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    processQueue(null, newToken);

                    return axios(originalRequest);
                } else {
                    processQueue(result.payload);

                    if (
                        result.payload === "Refresh token expired" ||
                        (typeof result.payload === 'string' &&
                            result.payload.includes("Refresh token expired"))
                    ) {
                        await logout(true, true);
                    }

                    return Promise.reject(result.payload);
                }
            } catch (refreshError) {
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle refresh token expired error directly from a request
        if (
            error.response &&
            error.response.status === 500 &&
            error.response.data?.message === "Refresh token expired"
        ) {
            // Log out the user and terminate session
            await logout(true);
        }

        return Promise.reject(error);
    }
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
            const errorData = {
                status: error.response.status,
                message: error.response.data?.message || 'Server error occurred',
                errors: error.response.data?.errors || null,
                code: error.response.data?.code || null,
            };
            throw errorData;
        } else if (error.request) {
            throw {
                status: 0,
                message: 'No response from server. Please check your internet connection.',
            };
        } else {
            throw {
                message: error.message || 'An error occurred while preparing the request',
            };
        }
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