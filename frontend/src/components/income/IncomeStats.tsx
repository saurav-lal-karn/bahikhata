"use client";
import React, { useState, useEffect } from "react";
import {
    ArrowUpRight,
    ArrowDownRight,
    IndianRupee,
    TrendingUp,
    Briefcase,
    Wallet,
} from "lucide-react";
import { transactionService } from "@/services/transactionService";
import { formatCurrency } from "@/lib/utils";

interface StatItem {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    change?: string;
    isPositive?: boolean;
}

export const IncomeStats = ({
    familyId,
    refreshKey,
}: {
    familyId: string;
    refreshKey?: number;
}) => {
    const [stats, setStats] = useState<StatItem[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            if (!familyId) return;
            try {
                const response = await transactionService.getTransactionStats(
                    familyId,
                    "INCOME"
                );

                const formattedStats: StatItem[] = [
                    {
                        title: "Total Income",
                        value: formatCurrency(response.total_amount),
                        subtitle: `${response.total_count} transactions`,
                        icon: <IndianRupee className="h-6 w-6" />,
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
                        icon: <TrendingUp className="h-6 w-6" />,
                        color: "text-blue-600 dark:text-blue-400",
                        bg: "bg-blue-50 dark:bg-blue-900/20",
                    },
                    {
                        title: "Average Income",
                        value: formatCurrency(response.average_amount),
                        subtitle: "Per transaction",
                        icon: <Briefcase className="h-6 w-6" />,
                        color: "text-purple-600 dark:text-purple-400",
                        bg: "bg-purple-50 dark:bg-purple-900/20",
                    },
                    {
                        title: "Total Transactions",
                        value: response.total_count.toString(),
                        subtitle: "All time records",
                        icon: <Wallet className="h-6 w-6" />,
                        color: "text-orange-600 dark:text-orange-400",
                        bg: "bg-orange-50 dark:bg-orange-900/20",
                    },
                ];
                setStats(formattedStats);
            } catch (e) {
                console.error("Failed to fetch income stats:", e);
            }
        };
        fetchStats();
    }, [familyId, refreshKey]);

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <div
                            className={`rounded-2xl p-3 ${stat.bg} ${stat.color}`}
                        >
                            {stat.icon}
                        </div>
                        {stat.change && (
                            <div
                                className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? "text-green-500" : "text-red-500"}`}
                            >
                                {stat.isPositive ? (
                                    <ArrowUpRight className="h-3 w-3" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3" />
                                )}
                                {stat.change}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">
                            {stat.title}
                        </p>
                        <h4 className="text-2xl leading-none font-black text-gray-900 dark:text-white">
                            {stat.value}
                        </h4>
                        {stat.subtitle && (
                            <p className="mt-2 text-xs font-medium text-gray-400">
                                {stat.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
