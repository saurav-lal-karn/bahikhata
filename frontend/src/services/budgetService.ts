import apiClient from "@/lib/axios";
import { CreateBudgetPayload } from "@/types";

export const budgetService = {
    createBudget: async (budget: CreateBudgetPayload) => {
        const response = await apiClient.post(`/budgets`, budget);
        return response.data.data;
    },
    getBudgets: async (familyId: string) => {
        const response = await apiClient.get(`/budgets/${familyId}`);
        return response.data.data;
    }
}
