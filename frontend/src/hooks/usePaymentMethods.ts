import { useQuery } from "@tanstack/react-query";
import { paymentMethodService } from "@/services/paymentMethodService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const usePaymentMethods = (familyId: string, enabled = true) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PAYMENT_METHODS, familyId],
        queryFn: () =>
            paymentMethodService.getPaymentMethods(familyId).catch(() => []),
        enabled: !!familyId && enabled,
    });
};
