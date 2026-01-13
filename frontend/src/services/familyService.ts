import apiClient from "@/lib/axios";

export interface InviteMemberPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const familyService = {
  inviteMember: async (data: InviteMemberPayload) => {
    const response = await apiClient.post("/families/invite", data);
    return response.data;
  },
  // Add other family-related methods here
};
