import apiClient from "@/lib/axios";

export const paymentMethodService = {
    getPaymentMethods: async (familyId: string) => {
        const paymentMethodsResponse = await apiClient.get(`/payment-methods?familyId=${familyId}`);
        return paymentMethodsResponse.data.data;
    }
}