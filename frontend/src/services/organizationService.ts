import apiClient from "@/lib/axios";
import { Tag, Project } from '@/types';

export interface Location {
    id: string;
    family_id: string;
    name: string;
    type?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTagRequest {
    family_id: string;
    name: string;
    color?: string;
    icon?: string;
    description?: string;
}

export interface UpdateTagRequest {
    name?: string;
    color?: string;
    icon?: string;
    description?: string;
}

export interface CreateProjectRequest {
    family_id: string;
    name: string;
    description?: string;
    status?: string;
    budget_amount?: number;
    color?: string;
    icon?: string;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: string;
    budget_amount?: number;
    color?: string;
    icon?: string;
}

export interface CreateLocationRequest {
    family_id: string;
    name: string;
    type?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    notes?: string;
}

export interface UpdateLocationRequest {
    name?: string;
    type?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    notes?: string;
}

export const organizationService = {
    // Tags
    getTags: async (familyId: string): Promise<Tag[]> => {
        const response = await apiClient.get(`/org/tags/family/${familyId}`);
        return response.data.data;
    },

    createTag: async (data: CreateTagRequest): Promise<Tag> => {
        const response = await apiClient.post('/org/tags', data);
        return response.data.data;
    },

    updateTag: async (id: string, data: UpdateTagRequest): Promise<Tag> => {
        const response = await apiClient.patch(`/org/tags/${id}`, data);
        return response.data.data;
    },

    deleteTag: async (id: string): Promise<void> => {
        await apiClient.delete(`/org/tags/${id}`);
    },

    // Projects
    getProjects: async (familyId: string): Promise<Project[]> => {
        const response = await apiClient.get(`/org/projects/family/${familyId}`);
        return response.data.data;
    },

    createProject: async (data: CreateProjectRequest): Promise<Project> => {
        const response = await apiClient.post('/org/projects', data);
        return response.data.data;
    },

    updateProject: async (id: string, data: UpdateProjectRequest): Promise<Project> => {
        const response = await apiClient.patch(`/org/projects/${id}`, data);
        return response.data.data;
    },

    deleteProject: async (id: string): Promise<void> => {
        await apiClient.delete(`/org/projects/${id}`);
    },

    // Locations
    getLocations: async (familyId: string): Promise<Location[]> => {
        const response = await apiClient.get(`/org/locations/family/${familyId}`);
        return response.data.data;
    },

    getLocation: async (id: string): Promise<Location> => {
        const response = await apiClient.get(`/org/locations/${id}`);
        return response.data.data;
    },

    createLocation: async (data: CreateLocationRequest): Promise<Location> => {
        const response = await apiClient.post('/org/locations', data);
        return response.data.data;
    },

    updateLocation: async (id: string, data: UpdateLocationRequest): Promise<Location> => {
        const response = await apiClient.patch(`/org/locations/${id}`, data);
        return response.data.data;
    },

    deleteLocation: async (id: string): Promise<void> => {
        await apiClient.delete(`/org/locations/${id}`);
    },
};
