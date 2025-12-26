import { api } from './api';

export interface Event {
    id: number;
    teacher_id: number;
    title: string;
    description: string;
    type: string;
    date: string;
    time: string;
    location_url?: string;
    details?: string;
    agenda?: string;
    learning_outcomes?: string;
    teacher?: {
        name: string;
        rank: string;
    };
    created_at: string;
}

export const eventService = {
    list: async (): Promise<Event[]> => {
        return api.get<Event[]>('/events');
    },

    create: async (data: Omit<Event, 'id' | 'teacher_id' | 'created_at' | 'teacher'>): Promise<Event> => {
        return api.post<Event>('/events', data);
    },

    delete: async (id: number): Promise<{ message: string }> => {
        return api.delete<{ message: string }>(`/events/${id}`);
    }
};
