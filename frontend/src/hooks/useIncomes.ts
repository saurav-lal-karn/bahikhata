import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useIncomes = (
    familyId: string,
    page = 1,
    pageSize = 50,
    enabled = true
) => {
    return useQuery({
        queryKey: [QUERY_KEYS.INCOMES, familyId, page, pageSize],
        queryFn: () =>
            transactionService.getTransactions(familyId, {
                type: "INCOME",
                page: page,
                page_size: pageSize,
            }),
        enabled: !!familyId && enabled,
    });
};
