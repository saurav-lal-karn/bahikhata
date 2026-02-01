import apiClient from "@/lib/axios";
import { CreateGoalPayload } from "@/types";

export const goalService = {
    createGoal: async (goal: CreateGoalPayload) => {
        const response = await apiClient.post(`/goals`, goal);
        return response.data.data;
    },
    getGoals: async (familyId: string) => {
        const response = await apiClient.get(`/goals`, { params: { family_id: familyId } });
        return response.data.data;
    },
    getContributions: async (goalId: string) => {
        const response = await apiClient.get(`/goals/${goalId}/contributions`);
        return response.data.data;
    },
    addContribution: async (goalId: string, payload: any) => {
        const response = await apiClient.post(`/goals/${goalId}/contributions`, payload);
        return response.data.data;
    }
}
