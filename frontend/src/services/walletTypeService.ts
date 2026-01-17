import apiClient from "@/lib/axios";

export const walletTypeService = {
    getWalletTypes: async (familyId: string) => {
        const walletTypesResponse = await apiClient.get(`/wallet-types/${familyId}`);
        return walletTypesResponse.data.data;
    }
}