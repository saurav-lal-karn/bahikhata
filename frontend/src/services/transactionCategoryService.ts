import apiClient from "@/lib/axios";
import { TransactionCategory, TransactionType } from "@/types";

export const transactionCategoryService = {
    createCategory: async (data: {
        name: string;
        type: TransactionType;
        family_id: string;
        parent_id?: string;
    }) => {
        const response = await apiClient.post("/transaction-categories", data);
        return response.data.data;
    },
    getCategories: async (
        familyId: string,
        includeSystem: boolean = true,
        type?: string
    ) => {
        let url = `/transaction-categories/${familyId}?include_system=${includeSystem}`;
        if (type) {
            url += `&type=${type}`;
        }
        const response = await apiClient.get(url);
        return response.data.data as TransactionCategory[];
    },
    getCategoryById: async (id: string) => {
        const response = await apiClient.get(
            `/transaction-categories/details/${id}`
        );
        return response.data.data as TransactionCategory;
    },
    updateCategory: async (id: string, data: Partial<TransactionCategory>) => {
        const response = await apiClient.put(
            `/transaction-categories/${id}`,
            data
        );
        return response.data.data;
    },
    deleteCategory: async (id: string) => {
        const response = await apiClient.delete(
            `/transaction-categories/${id}`
        );
        return response.data.data;
    },
};
