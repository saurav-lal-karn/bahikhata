"use client";
import React from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsService, ReportData } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

export const FinancialHealthScore = () => {
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
            <div className="h-48 animate-pulse rounded-[2rem] bg-gray-50 dark:bg-gray-800" />
        );

    const score = data?.health_score ?? 0;

    return (
        <div className="rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-lg shadow-indigo-500/20">
            <div className="mb-8 flex items-center gap-4">
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                    <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Financial Health</h3>
            </div>

            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="mb-2 text-6xl font-black">{score}</h2>
                    <p className="text-sm font-medium text-white/60">
                        Out of 100 points
                    </p>
                </div>
                <div className="text-right">
                    <span className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-black tracking-widest uppercase">
                        {score >= 80
                            ? "Excellent"
                            : score >= 60
                              ? "Good"
                              : "Needs Work"}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-emerald-400 transition-all duration-1000"
                        style={{ width: `${score}%` }}
                    />
                </div>
                <p className="text-xs font-medium text-white/60">
                    Your score is calculated based on savings rate,
                    debt-to-income ratio, and consistency.
                </p>
            </div>

            <button className="group mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black tracking-widest text-indigo-600 uppercase transition-colors hover:bg-gray-50">
                Improve Score{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
};
