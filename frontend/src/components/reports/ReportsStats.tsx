"use client";
import React from "react";
import { TrendingUp, TrendingDown, Target, Zap } from "lucide-react";

export const ReportsStats = () => {
  const stats = [
    {
      title: "Net Savings",
      value: "₹42,150",
      change: "+8.4%",
      isPositive: true,
      icon: <Target className="w-6 h-6" />,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Avg. Daily Spend",
      value: "₹1,320",
      change: "-5.2%",
      isPositive: true,
      icon: <TrendingDown className="w-6 h-6" />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Savings Rate",
      value: "49.5%",
      change: "+1.2%",
      isPositive: true,
      icon: <Zap className="w-6 h-6" />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Projected Spend",
      value: "₹48,000",
      change: "+2.1%",
      isPositive: false,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/50 shadow-sm transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
            <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-none">
              {stat.value}
            </h4>
            <p className={`mt-2 text-xs font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change} vs last month
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
