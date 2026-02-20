"use client";
import React from "react";
import { ScrollText, TrendingUp, Landmark, ShieldCheck } from "lucide-react";
import { TaxDeduction } from "@/types";

interface TaxSavingTrackerProps {
    deductions?: TaxDeduction[];
    isLoading?: boolean;
}

export const TaxSavingTracker: React.FC<TaxSavingTrackerProps> = ({
    deductions = [],
    isLoading = false,
}) => {
    if (isLoading)
        return <div className="py-10 text-center">Loading savings...</div>;
    return (
        <div className="overflow-hidden rounded-3xl border border-t-8 border-gray-100 border-t-blue-600 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-50 p-6 dark:border-gray-800">
                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white/90">
                    <ScrollText className="h-5 w-5 text-blue-500" /> Tax-Saving
                    Investments
                </h3>
                <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-black tracking-widest text-gray-400 uppercase dark:bg-gray-800">
                    FY 2025-26
                </span>
            </div>

            <div className="space-y-6 p-6">
                {deductions.length === 0 ? (
                    <div className="text-center text-gray-400">
                        No deductions tracked
                    </div>
                ) : (
                    deductions.map((saving) => {
                        const progress = Math.round(
                            (saving.amount / saving.max_limit) * 100
                        );

                        return (
                            <div
                                key={saving.id}
                                className="group rounded-2xl border border-gray-50 p-5 transition-all hover:border-blue-100 dark:border-gray-800 dark:hover:border-blue-900/30"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`rounded-xl bg-blue-50 p-2.5 text-blue-600`}
                                        >
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-800 dark:text-white">
                                                {saving.name}
                                            </h4>
                                            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                {saving.category} Deduction
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-gray-900 dark:text-white">
                                            ₹{saving.amount.toLocaleString()}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">
                                            Limit: ₹
                                            {saving.max_limit.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-50 dark:bg-gray-800">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                                        style={{
                                            width: `${Math.min(progress, 100)}%`,
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[9px] font-black tracking-widest uppercase">
                                    <span className="text-gray-400">
                                        {progress}% Utilized
                                    </span>
                                    <span className="text-blue-500">
                                        ₹
                                        {Math.max(
                                            0,
                                            saving.max_limit - saving.amount
                                        ).toLocaleString()}{" "}
                                        Remaining
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
