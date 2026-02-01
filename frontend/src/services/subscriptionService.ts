import apiClient from "@/lib/axios";
import { Subscription, CreateSubscriptionPayload } from '../types';

export const subscriptionService = {
    async getSubscriptions(familyId?: string): Promise<Subscription[]> {
        const url = familyId ? `/subscriptions?family_id=${familyId}` : '/subscriptions';
        const response = await apiClient.get(url);
        return response.data;
    },

    async getSubscription(id: string): Promise<Subscription> {
        const response = await apiClient.get(`/subscriptions/${id}`);
        return response.data;
    },

    async createSubscription(payload: CreateSubscriptionPayload): Promise<Subscription> {
        const response = await apiClient.post('/subscriptions', payload);
        return response.data;
    },

    async deleteSubscription(id: string): Promise<void> {
        await apiClient.delete(`/subscriptions/${id}`);
    }
};
