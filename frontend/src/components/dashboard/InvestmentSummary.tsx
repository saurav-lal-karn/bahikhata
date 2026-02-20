"use client";
import React from "react";
import {
    TrendingUp,
    ArrowUpRight,
    Briefcase,
    Coins,
    Landmark,
    TrendingDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
    analyticsService,
    InvestmentSummary as IInvestmentSummary,
} from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case "stocks":
            return <Briefcase className="h-4 w-4 text-blue-500" />;
        case "crypto":
            return <Coins className="h-4 w-4 text-orange-500" />;
        default:
            return <Landmark className="h-4 w-4 text-purple-500" />;
    }
};

export const InvestmentSummary = () => {
    const { user } = useAuth();
    const familyId = user?.family?.id;
    const [data, setData] = useState<IInvestmentSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (familyId) {
            analyticsService
                .getDashboardSummary(familyId)
                .then((res) => setData(res.investments))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [familyId]);

    const chartOptions: any = {
        chart: {
            type: "area",
            sparkline: { enabled: true },
        },
        stroke: { curve: "smooth", width: 2 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
            },
        },
        colors: [(data?.total_profit ?? 0) >= 0 ? "#10B981" : "#EF4444"],
        tooltip: { enabled: false },
    };

    const chartSeries = [
        {
            name: "Portfolio",
            data: [
                700000,
                715000,
                705000,
                725000,
                740000,
                765000,
                data?.total_value ?? 750000,
            ],
        },
    ];

    if (isLoading)
        return (
            <div className="h-96 animate-pulse rounded-2xl bg-gray-50 dark:bg-gray-800" />
        );

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
                        Investments
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Portfolio performance
                    </p>
                </div>
                <div
                    className={`p-2 ${(data?.total_profit ?? 0) >= 0 ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"} rounded-lg`}
                >
                    {(data?.total_profit ?? 0) >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
                    ) : (
                        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-500" />
                    )}
                </div>
            </div>

            <div className="mb-6">
                <div className="mb-1 flex items-end gap-2">
                    <h2 className="text-3xl font-black text-gray-800 dark:text-white/90">
                        ₹{data?.total_value.toLocaleString() ?? "0"}
                    </h2>
                    <span
                        className={`flex items-center pb-1 text-sm font-bold ${(data?.profit_change ?? 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                        {(data?.profit_change ?? 0) >= 0 ? (
                            <ArrowUpRight className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        {data?.profit_change.toFixed(1) ?? "0"}%
                    </span>
                </div>
                <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Total Portfolio Value
                </p>
            </div>

            <div className="mb-6 h-20">
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="area"
                    height="100%"
                />
            </div>

            <div className="space-y-4">
                {data?.assets.map((inv, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-white/5 dark:bg-white/[0.02]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800">
                                {getIcon(inv.type)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800 dark:text-white/90">
                                    {inv.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    ₹{inv.value.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`text-xs font-black ${inv.profit >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                            {inv.profit >= 0 ? "+" : ""}₹
                            {inv.profit.toLocaleString()}
                        </span>
                    </div>
                ))}
                {!data?.assets.length && (
                    <p className="py-4 text-center text-xs text-gray-400 italic">
                        No active investments found.
                    </p>
                )}
            </div>
        </div>
    );
};
