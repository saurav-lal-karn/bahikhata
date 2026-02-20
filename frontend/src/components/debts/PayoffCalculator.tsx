"use client";
import React, { useState } from "react";
import {
    Calculator,
    RotateCcw,
    TrendingDown,
    CheckCircle2,
    Info,
    ChevronRight,
    TrendingUp,
    Snowflake,
    Zap,
} from "lucide-react";

export const PayoffCalculator = () => {
    const [method, setMethod] = useState<"snowball" | "avalanche">("snowball");

    return (
        <div className="space-y-8">
            <div className="rounded-[2.5rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-8 dark:border-indigo-800/50 dark:from-indigo-900/10 dark:to-blue-900/10">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white shadow-xl shadow-indigo-500/10 dark:bg-gray-900">
                        <Calculator className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                            Repayment Strategy Planner
                        </h3>
                        <p className="max-w-2xl text-sm leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                            Optimize your debt-free journey. Compare different
                            psychological and mathematical models to find what
                            works for your family's financial temperament.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Strategy Toggle */}
                <div className="space-y-6 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="flex items-center gap-2 text-sm font-black tracking-widest text-gray-800 uppercase dark:text-white">
                        Choose Your Path
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => setMethod("snowball")}
                            className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-all ${
                                method === "snowball"
                                    ? "border-blue-500 bg-blue-50/20 ring-4 ring-blue-500/5 dark:bg-blue-900/10"
                                    : "border-gray-100 hover:border-blue-200 dark:border-gray-800"
                            }`}
                        >
                            <div className="relative z-10 flex items-center gap-4">
                                <div
                                    className={`rounded-2xl p-3 ${method === "snowball" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-gray-100 text-gray-500"}`}
                                >
                                    <Snowflake className="h-6 w-6" />
                                </div>
                                <div>
                                    <h5 className="mb-1 font-black text-gray-800 dark:text-white">
                                        Debt Snowball
                                    </h5>
                                    <p className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">
                                        Psychological Wins
                                    </p>
                                </div>
                            </div>
                            <p className="relative z-10 mt-4 text-xs leading-relaxed font-medium text-gray-500">
                                Pay off the{" "}
                                <span className="font-black text-blue-600">
                                    smallest balance
                                </span>{" "}
                                first. Great for building momentum and
                                confidence.
                            </p>
                            {method === "snowball" && (
                                <div className="absolute top-0 right-0 p-4">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => setMethod("avalanche")}
                            className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-all ${
                                method === "avalanche"
                                    ? "border-purple-500 bg-purple-50/20 ring-4 ring-purple-500/5 dark:bg-purple-900/10"
                                    : "border-gray-100 hover:border-purple-200 dark:border-gray-800"
                            }`}
                        >
                            <div className="relative z-10 flex items-center gap-4">
                                <div
                                    className={`rounded-2xl p-3 ${method === "avalanche" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "bg-gray-100 text-gray-500"}`}
                                >
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <h5 className="mb-1 font-black text-gray-800 dark:text-white">
                                        Debt Avalanche
                                    </h5>
                                    <p className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">
                                        Mathematical Efficiency
                                    </p>
                                </div>
                            </div>
                            <p className="relative z-10 mt-4 text-xs leading-relaxed font-medium text-gray-500">
                                Pay off the{" "}
                                <span className="font-black text-purple-600">
                                    highest interest rate
                                </span>{" "}
                                first. Saves the most money in the long run.
                            </p>
                            {method === "avalanche" && (
                                <div className="absolute top-0 right-0 p-4">
                                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Calculator Result Preview */}
                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-8 flex items-center justify-between">
                            <h4 className="text-sm font-black tracking-widest text-gray-800 uppercase dark:text-white">
                                Projection
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400">
                                    EXTRA PAYMENT:
                                </span>
                                <span className="text-xs font-black text-indigo-600 italic">
                                    ₹5,000 / mo
                                </span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10">
                                    <TrendingDown className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Total Interest Saved
                                    </p>
                                    <h4 className="text-2xl font-black text-emerald-500">
                                        ₹2.45 Lakhs
                                    </h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/10">
                                    <RotateCcw className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Time Reduced By
                                    </p>
                                    <h4 className="text-2xl font-black text-blue-600">
                                        18 Months
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-gray-50 pt-8 dark:border-gray-800">
                            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-xs font-black tracking-widest text-white uppercase transition-all hover:scale-[1.02] dark:bg-white dark:text-black">
                                Generate Step-By-Step Guide{" "}
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
