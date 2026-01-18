import apiClient from "@/lib/axios";
import { IncomeType } from "@/types";

export const incomeTypeService = {
    getIncomeTypes: async (familyId: string) => {
        const incomeTypeResponse = await apiClient.get(`/income-types/${familyId}`);
        return incomeTypeResponse.data.data;
    },
    createIncomeType: async (incomeType: IncomeType) => {
        const incomeTypeResponse = await apiClient.post(`/income-types`, incomeType);
        return incomeTypeResponse.data.data;
    }
}