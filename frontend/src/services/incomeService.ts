import apiClient from "@/lib/axios";
import { CreateIncomePayload } from "@/types";

export const incomeService = {
    getIncomes: async (familyId: string) => {
        const incomeSourceResponse = await apiClient.get(`/incomes/${familyId}`);
        return incomeSourceResponse.data.data;
    },
    getIncomeById: async (id: string) => {
        const response = await apiClient.get(`/incomes/details/${id}`);
        return response.data.data;
    },
    createIncome: async (income: CreateIncomePayload) => {
        const incomeSourceResponse = await apiClient.post(`/incomes`, income);
        return incomeSourceResponse.data.data;
    },
    updateIncome: async (id: string, income: CreateIncomePayload) => {
        const response = await apiClient.put(`/incomes/${id}`, income);
        return response.data.data;
    },
    deleteIncome: async (id: string) => {
        const response = await apiClient.delete(`/incomes/${id}`);
        return response.data.data;
    }
}