"use client";
import React, { useEffect, useState } from "react";
import {
    ArrowUpRight,
    ArrowDownRight,
    IndianRupee,
    PieChart,
    CreditCard,
    TrendingUp,
} from "lucide-react";
import { transactionService } from "@/services/transactionService";
import { ExpenseStats } from "@/types";
import { formatCurrency } from "@/lib/utils";

export const ExpensesStats = ({
    familyId,
    refreshKey,
}: {
    familyId: string;
    refreshKey?: number;
}) => {
    const [stats, setStats] = useState<ExpenseStats[]>([]);
    const [loading, setLoading] = useState(true);

    const formatPercentage = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    };

    useEffect(() => {
        const fetchStats = async () => {
            if (!familyId || familyId === "") {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await transactionService.getTransactionStats(
                    familyId,
                    "EXPENSE"
                );

                const formattedStats: ExpenseStats[] = [
                    {
                        title: "Total Expenses",
                        value: formatCurrency(response.total_amount),
                        subtitle: `${response.total_count} transactions`,
                        icon: <IndianRupee className="h-6 w-6" />,
                        bg: "bg-purple-100 dark:bg-purple-900/20",
                        color: "text-purple-600 dark:text-purple-400",
                    },
                    {
                        title: "This Month",
                        value: formatCurrency(response.this_month),
                        subtitle: "Current month spending",
                        icon: <TrendingUp className="h-6 w-6" />,
                        bg: "bg-blue-100 dark:bg-blue-900/20",
                        color: "text-blue-600 dark:text-blue-400",
                        change: formatPercentage(
                            response.this_month,
                            response.last_month
                        ),
                        isPositive: response.this_month <= response.last_month,
                    },
                    {
                        title: "Average Expense",
                        value: formatCurrency(response.average_amount),
                        subtitle: "Per transaction",
                        icon: <PieChart className="h-6 w-6" />,
                        bg: "bg-green-100 dark:bg-green-900/20",
                        color: "text-green-600 dark:text-green-400",
                    },
                    {
                        title: "Total Transactions",
                        value: response.total_count.toString(),
                        subtitle: "All time",
                        icon: <CreditCard className="h-6 w-6" />,
                        bg: "bg-orange-100 dark:bg-orange-900/20",
                        color: "text-orange-600 dark:text-orange-400",
                    },
                ];

                setStats(formattedStats);
            } catch (error) {
                console.error("Failed to fetch expense stats:", error);
                setStats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [familyId, refreshKey]);

    if (loading) {
        return (
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
                    >
                        <div className="h-20 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
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
