"use client";
import React from "react";
import { ArrowUpRight, ArrowDownRight, IndianRupee, PieChart, CreditCard, Wallet } from "lucide-react";

export const ExpensesStats = () => {
  const stats = [
    {
      title: "Monthly Expenses",
      value: "₹42,850",
      change: "+12.5%",
      isPositive: false,
      icon: <IndianRupee className="w-6 h-6" />,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "Daily Average",
      value: "₹1,428",
      change: "-2.4%",
      isPositive: true,
      icon: <PieChart className="w-6 h-6" />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Top Category",
      value: "Housing",
      subtitle: "₹25,000 this month",
      icon: <CreditCard className="w-6 h-6" />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Current Balance",
      value: "₹1,24,500",
      subtitle: "Across all accounts",
      icon: <Wallet className="w-6 h-6" />,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            {stat.change && (
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
            <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-none">
              {stat.value}
            </h4>
            {stat.subtitle && (
              <p className="mt-2 text-xs text-gray-400 font-medium">{stat.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
