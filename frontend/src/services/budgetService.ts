import apiClient from "@/lib/axios";
import { CreateBudgetPayload } from "@/types";

export interface BudgetPeriod {
    id: string;
    budget_id: string;
    start_date: string;
    end_date: string;
    spent_amount: number;
    is_closed?: boolean;
}

export interface BudgetAlert {
    id: string;
    budget_id: string;
    period_id?: string;
    threshold_percentage: number;
    triggered_at?: string;
    message?: string;
    budget?: { id: string; amount_limit: number; category?: { name: string } };
    period?: BudgetPeriod;
}

export const budgetService = {
    createBudget: async (budget: CreateBudgetPayload) => {
        const response = await apiClient.post(`/budgets`, budget);
        return response.data.data;
    },
    updateBudget: async (id: string, budget: any) => {
        const response = await apiClient.put(`/budgets/${id}`, budget);
        return response.data.data;
    },
    deleteBudget: async (id: string) => {
        await apiClient.delete(`/budgets/${id}`);
    },
    getBudgets: async (familyId: string) => {
        const response = await apiClient.get(`/budgets/family/${familyId}`);
        return response.data.data;
    },
    getPeriods: async (budgetId: string): Promise<BudgetPeriod[]> => {
        const response = await apiClient.get(`/budgets/${budgetId}/periods`);
        return response.data.data;
    },
    getAlerts: async (familyId: string): Promise<BudgetAlert[]> => {
        const response = await apiClient.get(
            `/budgets/alerts?family_id=${familyId}`
        );
        return response.data.data;
    },
    acknowledgeAlert: async (alertId: string): Promise<void> => {
        await apiClient.post(`/budgets/alerts/${alertId}/ack`);
    },
};
