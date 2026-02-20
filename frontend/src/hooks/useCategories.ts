import { useQuery } from "@tanstack/react-query";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useCategories = (
    familyId: string,
    type: "INCOME" | "EXPENSE",
    activeOnly = true,
    enabled = true
) => {
    return useQuery({
        queryKey: [
            type === "INCOME"
                ? QUERY_KEYS.INCOME_TYPES
                : QUERY_KEYS.EXPENSE_TYPES,
            familyId,
        ],
        queryFn: () =>
            transactionCategoryService.getCategories(
                familyId,
                activeOnly,
                type
            ),
        enabled: !!familyId && enabled,
    });
};
