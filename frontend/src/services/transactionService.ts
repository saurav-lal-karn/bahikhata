import apiClient from "@/lib/axios";
import {
    CreateTransactionPayload,
    TransactionListResponse,
    Transaction,
} from "@/types";

export const transactionService = {
    bulkImport: async (payload: { transactions: any[] }, familyId: string) => {
        const response = await apiClient.post(
            `/transactions/bulk-import/${familyId}`,
            payload
        );
        return response.data.data;
    },
    createTransaction: async (data: CreateTransactionPayload) => {
        const response = await apiClient.post("/transactions", data);
        return response.data.data;
    },
    getTransactions: async (
        familyId: string,
        filters: Record<string, string | number | boolean | undefined> = {}
    ) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, String(value));
            }
        });
        const queryParams = params.toString();
        const response = await apiClient.get(
            `/transactions/${familyId}?${queryParams}`
        );
        return response.data.data as TransactionListResponse;
    },
    getTransactionById: async (id: string) => {
        const response = await apiClient.get(`/transactions/details/${id}`);
        return response.data.data as Transaction;
    },
    updateTransaction: async (
        id: string,
        data: Partial<CreateTransactionPayload>
    ) => {
        const response = await apiClient.put(`/transactions/${id}`, data);
        return response.data.data;
    },
    deleteTransaction: async (id: string) => {
        const response = await apiClient.delete(`/transactions/${id}`);
        return response.data.data;
    },
    getTransactionStats: async (familyId: string, type?: string) => {
        let url = `/transactions/stats/${familyId}`;
        if (type) {
            url += `?type=${type}`;
        }
        const response = await apiClient.get(url);
        return response.data.data;
    },
};
