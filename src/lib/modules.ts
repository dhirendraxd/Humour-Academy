import { api } from './api';

export interface Curriculum {
    id: number;
    title: string;
    description: string;
    outcomes?: string;
    prerequisites?: string;
    modules?: Module[];
    created_at: string;
}

export interface Teacher {
    id: number;
    name: string;
    rank: string;
    bio: string;
}

export interface Module {
    id: number;
    curriculum_id: number;
    teacher_id: number;
    title: string;
    description: string;
    order_index: number;
    duration_months: number;
    teacher?: Teacher;
    curriculum?: Curriculum;
    cohorts?: Cohort[];
    created_at: string;
}

export interface Cohort {
    id: number;
    module_id: number;
    title: string;
    start_date: string;
    application_deadline: string;
    end_date: string;
    status: 'planned' | 'active' | 'completed';
    capacity: number;
    enrollments_count?: number;
    module?: Module;
    created_at: string;
}

export interface Enrollment {
    id: number;
    student_id: number;
    cohort_id: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    application_details?: {
        interests: string;
        experience: string;
        motivation: string;
    };
    student?: {
        id: number;
        name: string;
        email: string;
        bio?: string;
    };
    cohort?: Cohort;
    created_at: string;
}

export const moduleService = {
    // ... items ...
    // Curriculums
    listCurriculums: async (): Promise<Curriculum[]> => {
        return api.get<Curriculum[]>('/curriculums');
    },

    // Modules
    listModules: async (curriculumId?: number): Promise<Module[]> => {
        return api.get<Module[]>(`/modules${curriculumId ? `?curriculum_id=${curriculumId}` : ''}`);
    },

    getModule: async (id: number): Promise<Module> => {
        return api.get<Module>(`/modules/${id}`);
    },

    // Cohorts
    listCohorts: async (moduleId: number): Promise<Cohort[]> => {
        return api.get<Cohort[]>(`/cohorts?module_id=${moduleId}`);
    },

    createCohort: async (data: Partial<Cohort>): Promise<Cohort> => {
        return api.post<Cohort>('/cohorts', data);
    },

    updateCohort: async (id: number, data: Partial<Cohort>): Promise<Cohort> => {
        return api.put<Cohort>(`/cohorts/${id}`, data);
    },

    // Enrollments
    apply: async (cohortId: number, application_details?: any): Promise<Enrollment> => {
        return api.post<Enrollment>('/enrollments', { cohort_id: cohortId, application_details });
    },

    applyToCurriculum: async (curriculumId: number, application_details?: any): Promise<Enrollment> => {
        return api.post<Enrollment>('/enrollments', { curriculum_id: curriculumId, application_details });
    },

    listRequests: async (): Promise<Enrollment[]> => {
        return api.get<Enrollment[]>('/enrollments');
    },

    updateStatus: async (enrollmentId: number, status: 'approved' | 'rejected' | 'completed'): Promise<Enrollment> => {
        return api.put<Enrollment>(`/enrollments/${enrollmentId}`, { status });
    }
};
