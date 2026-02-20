import apiClient from "@/lib/axios";
import { CreateRecurringTransactionPayload } from "@/types";

export const recurringService = {
    create: async (payload: CreateRecurringTransactionPayload) => {
        const response = await apiClient.post("/recurring", payload);
        return response.data;
    },
    update: async (id: string, payload: any) => {
        const response = await apiClient.put(`/recurring/${id}`, payload);
        return response.data.data;
    },
    getAll: async (familyId?: string) => {
        const params = familyId ? { family_id: familyId } : {};
        const response = await apiClient.get("/recurring", { params });
        return response.data.data;
    },
    delete: async (id: string) => {
        await apiClient.delete(`/recurring/${id}`);
    },
    getInstances: async (recurringId: string) => {
        const response = await apiClient.get(
            `/recurring/${recurringId}/instances`
        );
        return response.data.data;
    },
    addInstance: async (recurringId: string, payload: any) => {
        const response = await apiClient.post(
            `/recurring/${recurringId}/instances`,
            payload
        );
        return response.data.data;
    },
};
