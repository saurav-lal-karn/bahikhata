"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, IndianRupee, PieChart, CreditCard, TrendingUp } from "lucide-react";
import { expenseService } from "@/services/expenseService";
import { ExpenseStats, ExpenseStatsResponse } from "@/types";

export const ExpensesStats = ({ familyId, refreshKey }: { familyId: string; refreshKey?: number }) => {
  const [stats, setStats] = useState<ExpenseStats[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!familyId || familyId === "") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response: ExpenseStatsResponse = await expenseService.getExpenseStats(familyId);
        
        const formattedStats: ExpenseStats[] = [
          {
            title: "Total Expenses",
            value: formatCurrency(response.total_amount),
            subtitle: `${response.total_expenses} transactions`,
            icon: <IndianRupee className="w-6 h-6" />,
            bg: "bg-purple-100 dark:bg-purple-900/20",
            color: "text-purple-600 dark:text-purple-400",
          },
          {
            title: "This Month",
            value: formatCurrency(response.this_month),
            subtitle: "Current month spending",
            icon: <TrendingUp className="w-6 h-6" />,
            bg: "bg-blue-100 dark:bg-blue-900/20",
            color: "text-blue-600 dark:text-blue-400",
            change: formatPercentage(response.this_month, response.last_month),
            isPositive: response.this_month <= response.last_month,
          },
          {
            title: "Average Expense",
            value: formatCurrency(response.average_expense),
            subtitle: "Per transaction",
            icon: <PieChart className="w-6 h-6" />,
            bg: "bg-green-100 dark:bg-green-900/20",
            color: "text-green-600 dark:text-green-400",
          },
          {
            title: "Total Transactions",
            value: response.total_expenses.toString(),
            subtitle: "All time",
            icon: <CreditCard className="w-6 h-6" />,
            bg: "bg-orange-100 dark:bg-orange-900/20",
            color: "text-orange-600 dark:text-orange-400",
          },
        ];

        setStats(formattedStats);
      } catch (error) {
        console.error('Failed to fetch expense stats:', error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [familyId, refreshKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

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
