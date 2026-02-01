import apiClient from "@/lib/axios";
import { Contact } from '@/types';

export const contactService = {
    getContacts: async (familyId: string): Promise<Contact[]> => {
        const response = await apiClient.get(`/contacts/family/${familyId}`);
        return response.data.data;
    },
};
