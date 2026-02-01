import apiClient from "@/lib/axios";
import { InsurancePolicy, CreateInsurancePolicyPayload } from '../types';

export const insuranceService = {
    async getPolicies(): Promise<InsurancePolicy[]> {
        const response = await apiClient.get('/insurance');
        return response.data;
    },

    async getPolicy(id: string): Promise<InsurancePolicy> {
        const response = await apiClient.get(`/insurance/${id}`);
        return response.data;
    },

    async createPolicy(payload: CreateInsurancePolicyPayload): Promise<InsurancePolicy> {
        const response = await apiClient.post('/insurance', payload);
        return response.data;
    },

    async deletePolicy(id: string): Promise<void> {
        await apiClient.delete(`/insurance/${id}`);
    }
};
