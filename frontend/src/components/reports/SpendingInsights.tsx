"use client";
import React from "react";
import {
    PieChart as PieChartIcon,
    ArrowUpRight,
    TrendingDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { analyticsService, ReportData } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const SpendingInsights = () => {
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

    const spending = data?.category_spending || [];

    const chartOptions: any = {
        chart: { type: "donut" },
        labels: spending.map((s) => s.category),
        colors: spending.map((s) => s.color),
        dataLabels: { enabled: false },
        legend: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: "75%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total Spend",
                            color: "#6B7280",
                            formatter: () =>
                                `₹${spending.reduce((acc, s) => acc + s.amount, 0).toLocaleString()}`,
                        },
                    },
                },
            },
        },
    };

    const chartSeries = spending.map((s) => s.amount);

    return (
        <div className="flex h-full flex-col rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Spending Structure
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Monthly allocation
                    </p>
                </div>
                <div className="rounded-2xl bg-red-50 p-3 dark:bg-red-900/10">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-10">
                <div className="h-[250px]">
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="donut"
                        height="100%"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {spending.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-white/[0.02]"
                        >
                            <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <div>
                                <p className="mb-1 text-[10px] leading-none font-black tracking-widest text-gray-400 uppercase">
                                    {item.category}
                                </p>
                                <p className="text-sm font-bold text-gray-800 dark:text-white">
                                    ₹{item.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
