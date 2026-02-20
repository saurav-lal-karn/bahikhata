import { useQuery } from "@tanstack/react-query";
import { contactService } from "@/services/contactService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useContacts = (familyId: string, enabled = true) => {
    return useQuery({
        queryKey: [QUERY_KEYS.CONTACTS, familyId],
        queryFn: () => contactService.getContacts(familyId),
        enabled: !!familyId && enabled,
    });
};
