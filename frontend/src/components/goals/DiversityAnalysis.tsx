"use client";
import React from "react";
import {
    PieChart,
    Gem,
    Coins,
    Landmark,
    TrendingUp,
    AlertCircle,
} from "lucide-react";

const assets = [
    {
        label: "Mutual Funds",
        percentage: 45,
        icon: <TrendingUp className="h-3 w-3" />,
        color: "bg-blue-500",
    },
    {
        label: "Equity/Stocks",
        percentage: 25,
        icon: <TrendingUp className="h-3 w-3" />,
        color: "bg-indigo-500",
    },
    {
        label: "Gold / ETFs",
        percentage: 15,
        icon: <Gem className="h-3 w-3" />,
        color: "bg-amber-500",
    },
    {
        label: "Real Estate",
        percentage: 10,
        icon: <Landmark className="h-3 w-3" />,
        color: "bg-emerald-500",
    },
    {
        label: "Digital Assets",
        percentage: 5,
        icon: <Coins className="h-3 w-3" />,
        color: "bg-purple-500",
    },
];

export const DiversityAnalysis = () => {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black text-gray-800 dark:text-white">
                    <PieChart className="h-5 w-5 text-indigo-500" /> Portfolio
                    Mix
                </h3>
                <PieChart className="h-4 w-4 text-gray-300" />
            </div>

            <div className="space-y-5">
                <div className="flex h-4 w-full overflow-hidden rounded-full shadow-inner ring-1 ring-black/5">
                    {assets.map((asset, i) => (
                        <div
                            key={i}
                            className={asset.color}
                            style={{ width: `${asset.percentage}%` }}
                            title={`${asset.label}: ${asset.percentage}%`}
                        />
                    ))}
                </div>

                <div className="space-y-3 pt-2">
                    {assets.map((asset, i) => (
                        <div
                            key={i}
                            className="group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-2 w-2 rounded-full ${asset.color}`}
                                />
                                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                                    {asset.label}
                                </span>
                            </div>
                            <span className="text-[11px] font-black text-gray-900 transition-colors group-hover:text-indigo-500 dark:text-white">
                                {asset.percentage}%
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border-t border-gray-50 pt-4 dark:border-gray-800">
                    <div className="flex items-center gap-3 rounded-2xl bg-blue-50/50 p-3 dark:bg-blue-900/10">
                        <AlertCircle className="h-4 w-4 shrink-0 text-blue-500" />
                        <p className="text-[10px] leading-relaxed font-medium text-gray-500">
                            Your portfolio is{" "}
                            <span className="font-black text-blue-600">
                                well-diversified
                            </span>
                            . Exposure to high-risk assets is within the
                            recommended 10% limit.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
