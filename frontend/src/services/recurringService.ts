import apiClient from "@/lib/axios";
import { CreateRecurringTransactionPayload } from "@/types";

export const recurringService = {
    create: async (payload: CreateRecurringTransactionPayload) => {
        const response = await apiClient.post("/recurring", payload);
        return response.data;
    },
    getAll: async (familyId?: string) => {
        const params = familyId ? { family_id: familyId } : {};
        const response = await apiClient.get("/recurring", { params });
        return response.data.data;
    },
    delete: async (id: string) => {
        await apiClient.delete(`/recurring/${id}`);
    }
};
