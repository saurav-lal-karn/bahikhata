"use client";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useIncomeStats } from "@/hooks/useIncomeStats";

export const IncomeStats = ({ familyId }: { familyId: string }) => {
    const { data: stats = [], isLoading } = useIncomeStats(familyId);

    if (isLoading) {
        return (
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-32 animate-pulse rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/50"
                    />
                ))}
            </div>
        );
    }

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
