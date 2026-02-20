import React from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { formatCurrency } from "@/lib/utils";
import { IndianRupee, TrendingUp, Briefcase, Wallet } from "lucide-react";

export interface StatItem {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    change?: string;
    isPositive?: boolean;
}

export const useIncomeStats = (familyId: string, enabled = true) => {
    return useQuery({
        queryKey: [QUERY_KEYS.INCOME_STATS, familyId],
        queryFn: async () => {
            const response = await transactionService.getTransactionStats(
                familyId,
                "INCOME"
            );

            const formattedStats: StatItem[] = [
                {
                    title: "Total Income",
                    value: formatCurrency(response.total_amount),
                    subtitle: `${response.total_count} transactions`,
                    icon: React.createElement(IndianRupee, {
                        className: "h-6 w-6",
                    }),
                    color: "text-green-600 dark:text-green-400",
                    bg: "bg-green-50 dark:bg-green-900/20",
                },
                {
                    title: "This Month",
                    value: formatCurrency(response.this_month),
                    change:
                        response.last_month > 0
                            ? `${(((response.this_month - response.last_month) / response.last_month) * 100).toFixed(1)}%`
                            : "+100%",
                    isPositive: response.this_month >= response.last_month,
                    icon: React.createElement(TrendingUp, {
                        className: "h-6 w-6",
                    }),
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-blue-50 dark:bg-blue-900/20",
                },
                {
                    title: "Average Income",
                    value: formatCurrency(response.average_amount),
                    subtitle: "Per transaction",
                    icon: React.createElement(Briefcase, {
                        className: "h-6 w-6",
                    }),
                    color: "text-purple-600 dark:text-purple-400",
                    bg: "bg-purple-50 dark:bg-purple-900/20",
                },
                {
                    title: "Total Transactions",
                    value: response.total_count.toString(),
                    subtitle: "All time records",
                    icon: React.createElement(Wallet, { className: "h-6 w-6" }),
                    color: "text-orange-600 dark:text-orange-400",
                    bg: "bg-orange-50 dark:bg-orange-900/20",
                },
            ];
            return formattedStats;
        },
        enabled: !!familyId && enabled,
    });
};
