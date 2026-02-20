"use client";
import React from "react";

const budgets = [
    {
        category: "Food & Drinks",
        spent: 12000,
        limit: 15000,
        color: "bg-purple-500",
    },
    { category: "Transport", spent: 4500, limit: 5000, color: "bg-blue-500" },
    {
        category: "Entertainment",
        spent: 8000,
        limit: 7000,
        color: "bg-red-500",
    },
    { category: "Shopping", spent: 15000, limit: 20000, color: "bg-pink-500" },
];

export const BudgetProgress = () => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
                    Budget Progress
                </h3>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800">
                    Monthly
                </span>
            </div>

            <div className="space-y-6">
                {budgets.map((budget, index) => {
                    const percentage = Math.min(
                        Math.round((budget.spent / budget.limit) * 100),
                        100
                    );
                    const isOver = budget.spent > budget.limit;

                    return (
                        <div key={index}>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {budget.category}
                                </span>
                                <span className="text-xs font-bold text-gray-500">
                                    <span
                                        className={
                                            isOver
                                                ? "text-red-500"
                                                : "text-gray-800 dark:text-white/90"
                                        }
                                    >
                                        ₹{budget.spent.toLocaleString()}
                                    </span>{" "}
                                    / ₹{budget.limit.toLocaleString()}
                                </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-red-500" : budget.color}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="mt-6 w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-all hover:border-purple-500 hover:text-purple-500 dark:border-gray-700">
                + Adjust Budgets
            </button>
        </div>
    );
};
