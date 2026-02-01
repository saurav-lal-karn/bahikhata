import apiClient from "@/lib/axios";
import { Tag, Project } from '@/types';

export const organizationService = {
    getTags: async (familyId: string): Promise<Tag[]> => {
        const response = await apiClient.get(`/org/tags/family/${familyId}`);
        return response.data.data;
    },
    getProjects: async (familyId: string): Promise<Project[]> => {
        const response = await apiClient.get(`/org/projects/family/${familyId}`);
        return response.data.data;
    },
};
