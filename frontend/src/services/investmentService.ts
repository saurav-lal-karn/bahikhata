import apiClient from "@/lib/axios";
import { CreateInvestmentPayload } from "@/types";

export const investmentService = {
    create: async (payload: CreateInvestmentPayload) => {
        const response = await apiClient.post("/investments", payload);
        return response.data;
    },
    getAll: async (familyId?: string) => {
        const params = familyId ? { family_id: familyId } : {};
        const response = await apiClient.get("/investments", { params });
        return response.data.data;
    },
    delete: async (id: string) => {
        await apiClient.delete(`/investments/${id}`);
    },
    getTransactions: async (investmentId: string) => {
        const response = await apiClient.get(`/investments/${investmentId}/transactions`);
        return response.data.data;
    },
    addTransaction: async (investmentId: string, payload: any) => {
        const response = await apiClient.post(`/investments/${investmentId}/transactions`, payload);
        return response.data.data;
    }
};
