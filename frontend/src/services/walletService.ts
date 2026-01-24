import apiClient from "@/lib/axios";
import { CreateWalletPayload, CreateWalletTransferPayload, WalletInfoType } from "@/types";

export const walletService = {
    createWallet: async (wallet: CreateWalletPayload) => {
        const walletResponse = await apiClient.post("/wallets", wallet);
        return walletResponse.data.data;
    },
    getWallets: async (familyId: string) => {
        const walletResponse = await apiClient.get(`/wallets/family/${familyId}`);
        return walletResponse.data.data;
    },
    getWallet: async (id: string) => {
        const response = await apiClient.get(`/wallets/${id}`);
        return response.data.data;
    },
    updateWallet: async (id: string, wallet: CreateWalletPayload) => {
        const response = await apiClient.put(`/wallets/${id}`, wallet);
        return response.data.data;
    },
    deleteWallet: async (id: string) => {
        const response = await apiClient.delete(`/wallets/${id}`);
        return response.data.data;
    },
    createWalletTransfer: async (transfer: CreateWalletTransferPayload) => {
        const response = await apiClient.post("/wallet-transfers", transfer);
        return response.data.data;
    },
    getWalletTransfers: async (familyId: string) => {
        const response = await apiClient.get(`/wallet-transfers/${familyId}`);
        return response.data.data;
    }
}