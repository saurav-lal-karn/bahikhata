"use client";
import React from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const FinancialMetrics = () => {
  const metrics = [
    {
      title: "Total Balance",
      value: "₹2,45,600",
      change: "+2.5%",
      isPositive: true,
      icon: <Wallet className="text-purple-600 dark:text-purple-400" />,
      color: "purple"
    },
    {
      title: "Monthly Income",
      value: "₹85,000",
      change: "+12%",
      isPositive: true,
      icon: <TrendingUp className="text-green-600 dark:text-green-400" />,
      color: "green"
    },
    {
      title: "Monthly Expenses",
      value: "₹42,300",
      change: "-5%",
      isPositive: false,
      icon: <TrendingDown className="text-red-600 dark:text-red-400" />,
      color: "red"
    },
    {
      title: "Net Savings",
      value: "₹42,700",
      change: "+18%",
      isPositive: true,
      icon: <PiggyBank className="text-blue-600 dark:text-blue-400" />,
      color: "blue"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${metric.color}-50 dark:bg-${metric.color}-900/20`}>
              {metric.icon}
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {metric.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {metric.change}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {metric.title}
            </p>
            <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
              {metric.value}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};
