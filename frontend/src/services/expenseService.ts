import { CreateExpensePayload, Expense } from "@/types";
import apiClient from "@/lib/axios";

export const expenseService = {
    createExpense: async (expense: CreateExpensePayload) => {
        const expenseResponse = await apiClient.post("/expenses", expense);
        return expenseResponse.data.data;
    },
    getExpenses: async (familyId: string) => {
        const expensesResponse = await apiClient.get(`/expenses/${familyId}`);
        return expensesResponse.data.data;
    },
    updateExpense: async (id: string, expense: Expense) => {
        const expenseResponse = await apiClient.put(`/expenses/${id}`, expense);
        return expenseResponse.data.data;
    },
    deleteExpense: async (id: string) => {
        const expenseResponse = await apiClient.delete(`/expenses/${id}`);
        return expenseResponse.data.data;
    },
    getExpenseStats: async (familyId: string) => {
        const expenseStatsResponse = await apiClient.get(`/expenses/stats/${familyId}`);
        return expenseStatsResponse.data.data;
    },
    getExpenseDetails: async (id: string) => {
        const expenseDetailsResponse = await apiClient.get(`/expenses/${id}`);
        return expenseDetailsResponse.data.data;
    }
}