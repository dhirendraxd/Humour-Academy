// API client for Laravel backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', API_BASE_URL);

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

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API] ${options.method || 'GET'} ${url}`);

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include', // Important for Sanctum
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let error = { message: 'An error occurred' };
            
            if (contentType?.includes('application/json')) {
                error = await response.json().catch(() => ({ message: 'An error occurred' }));
            }
            
            console.error(`[API Error] ${response.status}: ${error.message}`);
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[API] Response:`, data);
        return data;
    } catch (error) {
        console.error('[API] Request failed:', error);
        throw error;
    }
}
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
