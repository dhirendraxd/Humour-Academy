// API client for Laravel backend
const API_BASE_URL = '/api';

// Get authentication token from localStorage
const getToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// Set authentication token in localStorage
const setToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

// Remove authentication token from localStorage
const removeToken = (): void => {
    localStorage.removeItem('auth_token');
};

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Important for Sanctum
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: 'An error occurred',
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// API methods
export const api = {
    // GET request
    get: <T>(endpoint: string): Promise<T> => {
        return apiRequest<T>(endpoint, { method: 'GET' });
    },

    // POST request
    post: <T>(endpoint: string, data?: unknown): Promise<T> => {
        return apiRequest<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    // PUT request
    put: <T>(endpoint: string, data?: unknown): Promise<T> => {
        return apiRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    // DELETE request
    delete: <T>(endpoint: string): Promise<T> => {
        return apiRequest<T>(endpoint, { method: 'DELETE' });
    },
};

// Token management utilities
export const tokenManager = {
    getToken,
    setToken,
    removeToken,
};
