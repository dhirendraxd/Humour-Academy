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
    listSubmissions: async (): Promise<Submission[]> => {
        return api.get<Submission[]>('/grading/submissions');
    },

    gradeSubmission: async (id: string, data: { total_score: number; feedback: string; graded: boolean }): Promise<Submission> => {
        return api.put<Submission>(`/grading/submissions/${id}`, data);
    }
};
