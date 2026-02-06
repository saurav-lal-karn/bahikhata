import apiClient from "@/lib/axios";
import { CreateDebtPayload } from "@/types";

export const debtService = {
    create: async (payload: CreateDebtPayload) => {
        const response = await apiClient.post("/debts", payload);
        return response.data;
    },
    update: async (id: string, payload: any) => {
        const response = await apiClient.put(`/debts/${id}`, payload);
        return response.data.data;
    },
    getAll: async (familyId?: string) => {
        const params = familyId ? { family_id: familyId } : {};
        const response = await apiClient.get("/debts", { params });
        return response.data.data;
    },
    delete: async (id: string) => {
        await apiClient.delete(`/debts/${id}`);
    },
    getRepayments: async (debtId: string) => {
        const response = await apiClient.get(`/debts/${debtId}/repayments`);
        return response.data.data;
    },
    addRepayment: async (debtId: string, payload: any) => {
        const response = await apiClient.post(`/debts/${debtId}/repayments`, payload);
        return response.data.data;
    },
    getAmortizationSchedule: async (debtId: string) => {
        const response = await apiClient.get(`/debts/${debtId}/amortization`);
        return response.data.data;
    },
};
