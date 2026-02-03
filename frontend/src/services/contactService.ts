import apiClient from "@/lib/axios";
import { Contact } from '@/types';

export interface CreateContactRequest {
    family_id: string;
    name: string;
    type: 'VENDOR' | 'LENDER' | 'EMPLOYER' | 'OTHER';
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export interface UpdateContactRequest {
    name?: string;
    type?: 'VENDOR' | 'LENDER' | 'EMPLOYER' | 'OTHER';
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export const contactService = {
    getContacts: async (familyId: string): Promise<Contact[]> => {
        const response = await apiClient.get(`/contacts/family/${familyId}`);
        return response.data.data;
    },

    getContact: async (id: string): Promise<Contact> => {
        const response = await apiClient.get(`/contacts/${id}`);
        return response.data.data;
    },

    createContact: async (data: CreateContactRequest): Promise<Contact> => {
        const response = await apiClient.post('/contacts', data);
        return response.data.data;
    },

    updateContact: async (id: string, data: UpdateContactRequest): Promise<Contact> => {
        const response = await apiClient.patch(`/contacts/${id}`, data);
        return response.data.data;
    },

    deleteContact: async (id: string): Promise<void> => {
        await apiClient.delete(`/contacts/${id}`);
    },
};
