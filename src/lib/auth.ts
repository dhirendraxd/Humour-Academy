import { api, tokenManager } from './api';

// Types for authentication
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'faculty' | 'bod';
    email_verified_at: string | null;
    bio?: string | null;
    city?: string | null;
    phone?: string | null;
    interests?: string[] | null;
    level?: number;
    rank?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    role?: 'student' | 'faculty' | 'bod';
    password: string;
    password_confirmation: string;
    bio?: string;
    city?: string;
    phone?: string;
    interests?: string[];
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    bio?: string;
    city?: string;
    phone?: string;
    interests?: string[];
    rank?: string; // Optional for now as it might be read-only in backend
}

export interface RequestCodeResponse { message: string; dev_code?: number }

// Authentication functions
export const auth = {
    // Register a new user (legacy; not used for passwordless)
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', credentials);
        tokenManager.setToken(response.token);
        return response;
    },

    // Legacy password login (still available)
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        tokenManager.setToken(response.token);
        return response;
    },

    // Passwordless: request email code
    requestLoginCode: async (email: string): Promise<RequestCodeResponse> => {
        return api.post<RequestCodeResponse>('/auth/request-code', { email });
    },

    // Passwordless: verify email code
    verifyLoginCode: async (email: string, code: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/verify-code', { email, code });
        tokenManager.setToken(response.token);
        return response;
    },

    // Logout user
    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } finally {
            tokenManager.removeToken();
        }
    },

    // Get current user
    getUser: async (): Promise<User> => {
        return api.get<User>('/user');
    },

    // Update user profile
    updateProfile: async (data: UpdateProfileData): Promise<{ message: string; user: User }> => {
        return api.put<{ message: string; user: User }>('/user/profile', data);
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return tokenManager.getToken() !== null;
    },
};
