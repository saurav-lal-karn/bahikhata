"use client";
import React from "react";
import { TrendingUp, ArrowUpRight, Gem } from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsService, ReportData } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

export const NetWorthTimeline = () => {
    const { user } = useAuth();
    const familyId = user?.family?.id;
    const [data, setData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (familyId) {
            analyticsService
                .getReportData(familyId)
                .then(setData)
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [familyId]);

    if (isLoading)
        return (
            <div className="h-96 animate-pulse rounded-[2.5rem] bg-gray-50 dark:bg-gray-800" />
        );

    const timeline = data?.net_worth_timeline || [];
    const latestWorth =
        timeline.length > 0 ? timeline[timeline.length - 1].value : 0;

    return (
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <h3 className="flex items-center gap-3 text-2xl font-black text-gray-800 dark:text-white">
                        <Gem className="h-6 w-6 text-amber-500" /> Net Worth
                        Timeline
                    </h3>
                    <p className="mt-1 text-sm font-medium text-gray-500 italic">
                        Snapshot of your wealth architecture.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                <div className="flex h-[300px] items-end gap-2 px-2 lg:col-span-8">
                    {timeline.map((point, i) => {
                        const maxVal = Math.max(
                            ...timeline.map((p) => p.value)
                        );
                        const height =
                            maxVal > 0 ? (point.value / maxVal) * 100 : 0;
                        return (
                            <div
                                key={i}
                                className="group/bar flex flex-1 flex-col justify-end gap-1.5"
                            >
                                <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-50/50 dark:bg-gray-800/30">
                                    <div
                                        className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/10 transition-all duration-700 group-hover/bar:from-blue-500 group-hover/bar:to-indigo-400"
                                        style={{ height: `${height}%` }}
                                    />
                                </div>
                                <span className="text-center text-[9px] font-black tracking-tighter text-gray-400 uppercase transition-colors group-hover/bar:text-blue-500">
                                    {point.date}
                                </span>
                            </div>
                        );
                    })}
                    {timeline.length === 0 && (
                        <div className="flex w-full items-center justify-center text-gray-400 italic">
                            Historical data accumulating...
                        </div>
                    )}
                </div>

                <div className="space-y-6 lg:col-span-4">
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 dark:border-emerald-800/50 dark:bg-emerald-900/10">
                        <p className="mb-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                            Total Assets
                        </p>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                            ₹{latestWorth.toLocaleString()}
                        </h4>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <ArrowUpRight className="h-3 w-3" /> +12.4%
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                        <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase dark:text-gray-500">
                            Current Net Worth
                        </p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                            ₹{latestWorth.toLocaleString()}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};
