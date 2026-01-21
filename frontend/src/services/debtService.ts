import apiClient from "@/lib/axios";
import { CreateDebtPayload } from "@/types";

export const debtService = {
    create: async (payload: CreateDebtPayload) => {
        const response = await apiClient.post("/debts", payload);
        return response.data;
    },
    getAll: async (familyId?: string) => {
        const params = familyId ? { family_id: familyId } : {};
        const response = await apiClient.get("/debts", { params });
        return response.data.data;
    },
    delete: async (id: string) => {
        await apiClient.delete(`/debts/${id}`);
    }
};
