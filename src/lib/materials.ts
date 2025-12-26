import { api } from './api';

export interface Material {
    id: string;
    title: string;
    description: string | null;
    file_url: string | null;
    learning_objectives: string[] | null;
    prerequisites: string | null;
    estimated_study_time: string | null;
    resource_type: string | null;
    module_breakdown: string | null;
    faculty_id: string;
    created_at: string;
}

export const materialService = {
    list: async (): Promise<Material[]> => {
        return api.get<Material[]>('/materials');
    },

    create: async (data: Partial<Material>): Promise<Material> => {
        return api.post<Material>('/materials', data);
    },

    update: async (id: string, data: Partial<Material>): Promise<Material> => {
        return api.put<Material>(`/materials/${id}`, data);
    },

    delete: async (id: string): Promise<{ message: string }> => {
        return api.delete<{ message: string }>(`/materials/${id}`);
    }
};
