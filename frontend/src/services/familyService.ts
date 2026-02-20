import apiClient from "@/lib/axios";
import type {
    FamilySettings,
    UpdateFamilySettingsPayload,
    InviteMemberPayload,
    FamilyMember,
    FamilyStats,
} from "@/types";

export const familyService = {
    getFamily: async (id: string): Promise<FamilySettings> => {
        const response = await apiClient.get(`/families/${id}`);
        return response.data.data;
    },

    updateFamilySettings: async (
        id: string,
        data: UpdateFamilySettingsPayload
    ): Promise<FamilySettings> => {
        const response = await apiClient.put(`/families/${id}`, data);
        return response.data.data;
    },

    inviteMember: async (data: InviteMemberPayload) => {
        const response = await apiClient.post("/family-members/invite", data);
        return response.data;
    },
    getFamilyMembers: async (familyId: string): Promise<FamilyMember[]> => {
        const response = await apiClient.get(`/family-members/${familyId}`);
        return response.data.data;
    },
    getFamilyStats: async (familyId: string): Promise<FamilyStats> => {
        const response = await apiClient.get(`/families/${familyId}/stats`);
        return response.data.data;
    },
};
