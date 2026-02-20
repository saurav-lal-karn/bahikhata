import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/walletService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useWallets = (
    familyId: string,
    page = 1,
    pageSize = 100,
    enabled = true
) => {
    return useQuery({
        queryKey: [QUERY_KEYS.WALLETS, familyId, page, pageSize],
        queryFn: () => walletService.getWallets(familyId, page, pageSize),
        enabled: !!familyId && enabled,
    });
};
