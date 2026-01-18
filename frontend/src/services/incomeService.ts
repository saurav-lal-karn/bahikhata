import apiClient from "@/lib/axios";
import { CreateIncomePayload } from "@/types";

export const incomeService = {
    getIncomes: async (familyId: string) => {
        const incomeSourceResponse = await apiClient.get(`/incomes/${familyId}`);
        return incomeSourceResponse.data.data;
    },
    createIncome: async (income: CreateIncomePayload) => {
        const incomeSourceResponse = await apiClient.post(`/incomes`, income);
        return incomeSourceResponse.data.data;
    }
}