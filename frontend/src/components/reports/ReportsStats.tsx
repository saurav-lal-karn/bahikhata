"use client";
import React from "react";
import { TrendingUp, TrendingDown, Target, Zap, Wallet, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsService, DashboardSummary } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

export const ReportsStats = () => {
  const { user } = useAuth();
  const familyId = user?.family?.id;
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (familyId) {
      analyticsService.getDashboardSummary(familyId)
        .then(setData)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [familyId]);

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />)}
  </div>;

  const stats = [
    {
      title: "Total Wealth",
      value: `₹${((data?.total_balance ?? 0) + (data?.investments.total_value ?? 0)).toLocaleString()}`,
      change: "+4.2%",
      isPositive: true,
      icon: <Wallet className="w-6 h-6" />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Avg. Savings",
      value: `₹${data?.net_savings.toLocaleString() ?? '0'}`,
      change: `${data?.savings_change != null ? (data.savings_change >= 0 ? '+' : '') + data.savings_change.toFixed(1) : '0.0'}%`,
      isPositive: (data?.savings_change ?? 0) >= 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: "Goal Completion",
      value: `${data?.goals_summary.length ? (data.goals_summary.reduce((acc, g) => acc + g.percentage, 0) / data.goals_summary.length).toFixed(0) : '0'}%`,
      change: "On Track",
      isPositive: true,
      icon: <Target className="w-6 h-6" />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Invest. ROI",
      value: `₹${data?.investments.total_profit.toLocaleString() ?? '0'}`,
      change: `${data?.investments.profit_change != null ? (data.investments.profit_change >= 0 ? '+' : '') + data.investments.profit_change.toFixed(1) : '0.0'}%`,
      isPositive: (data?.investments.profit_change ?? 0) >= 0,
      icon: <BarChart3 className="w-6 h-6" />,
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
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
