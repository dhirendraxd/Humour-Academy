import { api } from './api';

export interface Teacher {
    id: number;
    name: string;
    rank: string;
    bio: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    teacher_id: number;
    teacher?: Teacher;
    created_at: string;
    updated_at: string;
}

export interface Enrollment {
    id: number;
    student_id: number;
    course_id: number;
    status: 'pending' | 'approved' | 'rejected';
    student?: {
        id: number;
        name: string;
        email: string;
        bio?: string;
    };
    course?: Course;
    created_at: string;
}

export const courseService = {
    // List all available courses
    list: async (): Promise<Course[]> => {
        return api.get<Course[]>('/courses');
    },

    // Create a new course (Teacher)
    create: async (data: { title: string; description: string }): Promise<Course> => {
        return api.post<Course>('/courses', data);
    },

    // Apply for a course (Student)
    apply: async (courseId: number): Promise<{ message: string }> => {
        return api.post<{ message: string }>('/enrollments', { course_id: courseId });
    },

    // List pending requests (Teacher)
    listRequests: async (): Promise<Enrollment[]> => {
        return api.get<Enrollment[]>('/active-enrollments');
    },

    // Update request status (Teacher)
    updateStatus: async (enrollmentId: number, status: 'approved' | 'rejected'): Promise<{ message: string }> => {
        return api.put<{ message: string }>(`/enrollments/${enrollmentId}`, { status });
    }
};
