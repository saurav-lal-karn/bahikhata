"use client";
import React from "react";

const budgets = [
  { category: "Food & Drinks", spent: 12000, limit: 15000, color: "bg-purple-500" },
  { category: "Transport", spent: 4500, limit: 5000, color: "bg-blue-500" },
  { category: "Entertainment", spent: 8000, limit: 7000, color: "bg-red-500" },
  { category: "Shopping", spent: 15000, limit: 20000, color: "bg-pink-500" },
];

export const BudgetProgress = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          Budget Progress
        </h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
          Monthly
        </span>
      </div>

      <div className="space-y-6">
        {budgets.map((budget, index) => {
          const percentage = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
          const isOver = budget.spent > budget.limit;

          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{budget.category}</span>
                <span className="text-xs font-bold text-gray-500">
                  <span className={isOver ? "text-red-500" : "text-gray-800 dark:text-white/90"}>
                    ₹{budget.spent.toLocaleString()}
                  </span> 
                  {" "}/ ₹{budget.limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : budget.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 py-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-500 hover:text-purple-500 hover:border-purple-500 transition-all">
        + Adjust Budgets
      </button>
    </div>
  );
};
