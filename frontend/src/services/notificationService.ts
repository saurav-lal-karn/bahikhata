import apiClient from "@/lib/axios";

export interface Notification {
    id: string;
    user_id: string;
    family_id: string;
    title: string;
    message: string;
    type: string;
    status: "read" | "unread";
    created_at: string;
    updated_at: string;
}

export interface ListNotificationsParams {
    family_id?: string;
    status?: "read" | "unread";
    limit?: number;
}

export const notificationService = {
    list: async (
        params: ListNotificationsParams = {}
    ): Promise<Notification[]> => {
        const searchParams = new URLSearchParams();
        if (params.family_id) searchParams.set("family_id", params.family_id);
        if (params.status) searchParams.set("status", params.status);
        if (params.limit) searchParams.set("limit", String(params.limit));
        const query = searchParams.toString();
        const url = query ? `/notifications?${query}` : "/notifications";
        const response = await apiClient.get(url);
        return response.data.data;
    },

    markRead: async (id: string, status: "read" | "unread"): Promise<void> => {
        await apiClient.patch(`/notifications/${id}`, { status });
    },

    markAllRead: async (familyId?: string): Promise<void> => {
        await apiClient.post(
            "/notifications/mark-all-read",
            familyId ? { family_id: familyId } : {}
        );
    },
};
