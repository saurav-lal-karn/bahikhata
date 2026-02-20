"use client";
import React from "react";
import { ReportsStats } from "@/components/reports/ReportsStats";
import { SpendingInsights } from "@/components/reports/SpendingInsights";
import {
    Calendar,
    Download,
    Presentation,
    FileText,
    Clock,
    HeartPulse,
    Gem,
} from "lucide-react";
import { NetWorthTimeline } from "@/components/reports/NetWorthTimeline";
import { FinancialHealthScore } from "@/components/reports/FinancialHealthScore";

export default function ReportsPageClient() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Financial Analytics
                    </h1>
                    <p className="font-medium text-gray-500">
                        Deep dive into your household's financial health.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            May 2026
                        </span>
                    </div>
                    <button className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500 active:scale-95">
                        <Download className="h-5 w-5" /> Export Report
                    </button>
                </div>
            </div>

            <ReportsStats />

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 xl:col-span-8">
                    <NetWorthTimeline />
                </div>
                <div className="col-span-12 xl:col-span-4">
                    <FinancialHealthScore />
                </div>
            </div>

            <SpendingInsights />

            {/* Recent Summaries */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex items-center justify-between border-b border-gray-50 p-6 dark:border-gray-800">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white/90">
                        <Presentation className="h-5 w-5 text-blue-500" />{" "}
                        Monthly Summaries
                    </h3>
                    <button className="text-sm font-bold text-blue-600 hover:underline">
                        View All Archives
                    </button>
                </div>
                <div className="grid grid-cols-1 divide-y divide-gray-50 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-gray-800">
                    {[
                        {
                            month: "April 2026",
                            type: "Complete",
                            size: "1.2 MB",
                        },
                        {
                            month: "March 2026",
                            type: "Complete",
                            size: "1.5 MB",
                        },
                        {
                            month: "February 2026",
                            type: "Archive",
                            size: "2.1 MB",
                        },
                    ].map((report, i) => (
                        <div
                            key={i}
                            className="group cursor-pointer p-8 transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"
                        >
                            <div className="mb-4 flex items-center gap-4">
                                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 transition-transform group-hover:rotate-12 dark:bg-blue-900/20 dark:text-blue-400">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-800 dark:text-white">
                                        {report.month} Report
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            {report.type}
                                        </span>
                                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            •
                                        </span>
                                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            {report.size}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-blue-600">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" /> Generated 2d
                                    ago
                                </span>
                                <Download className="h-4 w-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
