import apiClient from "@/lib/axios";
import { CreateTaxDocumentPayload, CreateTaxDeductionPayload } from "@/types";

export const taxService = {
    // Documents
    createDocument: async (payload: CreateTaxDocumentPayload) => {
        const response = await apiClient.post("/tax/documents", payload);
        return response.data;
    },
    getDocuments: async (familyId: string, year?: string) => {
        const params: any = { family_id: familyId };
        if (year) params.year = year;
        const response = await apiClient.get("/tax/documents", { params });
        return response.data.data;
    },
    deleteDocument: async (id: string) => {
        await apiClient.delete(`/tax/documents/${id}`);
    },

    // Deductions
    createDeduction: async (payload: CreateTaxDeductionPayload) => {
        const response = await apiClient.post("/tax/deductions", payload);
        return response.data;
    },
    getDeductions: async (familyId: string, year?: string) => {
        const params: any = { family_id: familyId };
        if (year) params.year = year;
        const response = await apiClient.get("/tax/deductions", { params });
        return response.data.data;
    },
    deleteDeduction: async (id: string) => {
        await apiClient.delete(`/tax/deductions/${id}`);
    },
};
