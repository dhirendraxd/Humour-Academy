export interface Profile {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    role: 'student' | 'faculty' | 'bod';
    level: number;
    rank: string;
    bio?: string;
    city?: string;
    phone?: string;
    interests?: string[];
}

export const MOCK_PROFILES: Profile[] = [];

export const MOCK_USER = null;
