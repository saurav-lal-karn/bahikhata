"use client";
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const ExpenseBreakdown = () => {
    const options: any = {
        chart: {
            type: "donut",
            background: "transparent",
        },
        labels: ["Housing", "Food", "Transport", "Utilities", "Leisure"],
        colors: ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"],
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: "bottom",
            fontSize: "14px",
            labels: {
                colors: ["#9CA3AF"],
            },
        },
        stroke: {
            show: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "75%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total Expenses",
                            formatter: () => "₹42,300",
                            color: "#9CA3AF",
                        },
                        value: {
                            color: "#F9FAFB",
                        },
                    },
                },
            },
        },
    };

    const series = [45, 25, 15, 10, 5];

    return (
        <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-6 text-lg font-bold text-gray-800 dark:text-white/90">
                Spending Breakdown
            </h3>
            <div className="flex items-center justify-center">
                <Chart
                    options={options}
                    series={series}
                    type="donut"
                    width="100%"
                    height={350}
                />
            </div>
        </div>
    );
};
