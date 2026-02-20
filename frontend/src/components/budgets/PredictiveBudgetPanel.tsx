"use client";
import React from "react";
import {
    Sparkles,
    ArrowUpRight,
    ArrowDownRight,
    RotateCcw,
    CheckCircle2,
    Lightbulb,
} from "lucide-react";

const suggestions = [
    {
        category: "Transport",
        current: 5000,
        suggested: 4200,
        reason: "Consistent underspending by 15% over the last 3 months.",
        type: "decrease",
        color: "bg-blue-50 text-blue-600",
    },
    {
        category: "Entertainment",
        current: 8000,
        suggested: 10500,
        reason: "Frequently exceeding limit with movie premieres and events.",
        type: "increase",
        color: "bg-red-50 text-red-600",
    },
    {
        category: "Groceries",
        current: 12000,
        suggested: 12000,
        reason: "Spending is highly optimized. Maintain current levels.",
        type: "optimum",
        color: "bg-emerald-50 text-emerald-600",
    },
];

export const PredictiveBudgetPanel = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-8 md:flex-row dark:border-amber-800/50 dark:from-amber-900/10 dark:to-orange-900/10">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-gray-900">
                    <Lightbulb className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                    <h3 className="mb-1 text-xl font-black text-gray-800 dark:text-white">
                        Smart Spending Analysis
                    </h3>
                    <p className="text-sm leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                        Bahikhata analyzes your historical data to suggest
                        optimized budgets. Adjusting these values improves your
                        financial health score.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((item, i) => (
                    <div
                        key={i}
                        className="group flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-purple-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-800/50"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <span
                                className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${item.color}`}
                            >
                                {item.category}
                            </span>
                            <Sparkles className="h-4 w-4 text-amber-400 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>

                        <div className="mb-2 flex items-baseline gap-2">
                            <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                                ₹{item.suggested.toLocaleString()}
                            </h4>
                            <span
                                className={`flex items-center gap-0.5 text-xs font-bold ${item.type === "decrease" ? "text-blue-500" : item.type === "increase" ? "text-red-500" : "text-emerald-500"}`}
                            >
                                {item.type === "decrease" && (
                                    <ArrowDownRight className="h-3 w-3" />
                                )}
                                {item.type === "increase" && (
                                    <ArrowUpRight className="h-3 w-3" />
                                )}
                                {item.type === "optimum" && (
                                    <CheckCircle2 className="h-3 w-3" />
                                )}
                                {item.type === "optimum"
                                    ? "Target met"
                                    : `${Math.round((Math.abs(item.suggested - item.current) / item.current) * 100)}% adjustment`}
                            </span>
                        </div>

                        <p className="mb-6 flex-grow text-xs leading-relaxed font-medium text-gray-500">
                            "{item.reason}"
                        </p>

                        <button className="w-full rounded-2xl bg-gray-50 py-3 text-xs font-black tracking-widest text-gray-600 uppercase shadow-sm transition-all hover:bg-purple-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-purple-600 dark:hover:text-white">
                            Apply Suggestion
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
