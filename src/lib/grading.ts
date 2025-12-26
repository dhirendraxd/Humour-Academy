import { api } from './api';
import { Assessment } from './assessments';

export interface Submission {
    id: string;
    assessment_id: string;
    student_id: string;
    submitted_at: string;
    total_score: number | null;
    graded: boolean;
    graded_at: string | null;
    feedback: string | null;
    student?: {
        name: string;
        email: string;
    };
    assessment?: Assessment;
    answers: any;
}

export const gradingService = {
    listSubmissions: async (params?: { cohort_id?: string }): Promise<Submission[]> => {
        const query = params?.cohort_id ? `?cohort_id=${params.cohort_id}` : '';
        return api.get<Submission[]>(`/grading/submissions${query}`);
    },

    gradeSubmission: async (id: string, data: { total_score: number; feedback: string; graded: boolean }): Promise<Submission> => {
        return api.put<Submission>(`/grading/submissions/${id}`, data);
    }
};
