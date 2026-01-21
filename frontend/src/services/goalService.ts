import apiClient from "@/lib/axios";
import { CreateGoalPayload } from "@/types";

export const goalService = {
    createGoal: async (goal: CreateGoalPayload) => {
        const response = await apiClient.post(`/goals`, goal);
        return response.data.data;
    },
    getGoals: async (familyId: string) => {
        const response = await apiClient.get(`/goals/${familyId}`);
        return response.data.data;
    }
}
