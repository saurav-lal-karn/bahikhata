import apiClient from "@/lib/axios";

export const expenseCategoryService = {
    getCategories: async (familyId: string) => {
        const categoriesResponse = await apiClient.get(`/expense-categories/${familyId}`);
        return categoriesResponse.data.data;
    }
}