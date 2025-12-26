import { api } from './api';

export interface Question {
    id: string;
    type: 'mcq' | 'written';
    question: string;
    points: number;
    options?: string[];
    correct_answer?: string;
    explanation?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category_tag?: string;
}

export interface Assessment {
    id: string;
    title: string;
    description: string;
    type: 'quiz' | 'assignment' | 'exam' | 'practice';
    total_marks: number;
    due_date: string;
    faculty_id: string;
    questions?: Question[];
    created_at: string;
}

export const assessmentService = {
    list: async (): Promise<Assessment[]> => {
        return api.get<Assessment[]>('/assessments');
    },

    get: async (id: string): Promise<Assessment> => {
        return api.get<Assessment>(`/assessments/${id}`);
    },

    create: async (data: Partial<Assessment>): Promise<Assessment> => {
        return api.post<Assessment>('/assessments', data);
    },

    update: async (id: string, data: Partial<Assessment>): Promise<Assessment> => {
        return api.put<Assessment>(`/assessments/${id}`, data);
    },

    delete: async (id: string): Promise<{ message: string }> => {
        return api.delete<{ message: string }>(`/assessments/${id}`);
    }
};
