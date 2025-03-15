import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/api/baseAPI';
import { User } from '@/types/auth/signin.types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

export const refreshTokenAction = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            const refreshTokenValue = state.auth.refreshToken;

            if (!refreshTokenValue) {
                return rejectWithValue('No refresh token available');
            }

            const response = await axiosInstance.post('/auth/refresh-token', {
                refreshToken: refreshTokenValue
            });

            if (response.data.status === 'success') {
                return { accessToken: response.data.data.accessToken };
            } else {
                return rejectWithValue(response.data.message || 'Failed to refresh token');
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to refresh token'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.error = null;
        },
        setAuthError: (state, action) => {
            state.error = action.payload;
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshTokenAction.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
            })
            .addCase(refreshTokenAction.rejected, (state) => {
                state.accessToken = null;
                state.refreshToken = null;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setAuthData, setAuthError, clearTokens, clearError } = authSlice.actions;
export default authSlice.reducer;