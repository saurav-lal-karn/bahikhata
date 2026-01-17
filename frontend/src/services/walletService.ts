import apiClient from "@/lib/axios";
import { CreateWalletPayload, CreateWalletTransferPayload } from "@/types";

export const walletService = {
    createWallet: async (wallet: CreateWalletPayload) => {
        const walletResponse = await apiClient.post("/wallets", wallet);
        return walletResponse.data.data;
    },
    getWallets: async (familyId: string) => {
        const walletResponse = await apiClient.get(`/wallets/${familyId}`);
        return walletResponse.data.data;
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