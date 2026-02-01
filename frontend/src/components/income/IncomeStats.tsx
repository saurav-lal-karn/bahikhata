"use client";
import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, IndianRupee, TrendingUp, Briefcase, Wallet } from "lucide-react";
import { transactionService } from "@/services/transactionService";

interface StatItem {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  change?: string;
  isPositive?: boolean;
}

export const IncomeStats = ({ familyId, refreshKey }: { familyId: string; refreshKey?: number }) => {
  const [stats, setStats] = useState<StatItem[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!familyId) return;
      try {
        const response = await transactionService.getTransactionStats(familyId, 'INCOME');
        
        const formattedStats: StatItem[] = [
          {
            title: "Total Income",
            value: formatCurrency(response.total_amount),
            subtitle: `${response.total_count} transactions`,
            icon: <IndianRupee className="w-6 h-6" />,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20"
          },
          {
            title: "This Month",
            value: formatCurrency(response.this_month),
            change: response.last_month > 0 ? `${(((response.this_month - response.last_month) / response.last_month) * 100).toFixed(1)}%` : "+100%",
            isPositive: response.this_month >= response.last_month,
            icon: <TrendingUp className="w-6 h-6" />,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20"
          },
          {
            title: "Average Income",
            value: formatCurrency(response.average_amount),
            subtitle: "Per transaction",
            icon: <Briefcase className="w-6 h-6" />,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20"
          },
          {
            title: "Total Transactions",
            value: response.total_count.toString(),
            subtitle: "All time records",
            icon: <Wallet className="w-6 h-6" />,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-900/20"
          }
        ];
        setStats(formattedStats);
      } catch (e) {
        console.error('Failed to fetch income stats:', e);
      }
    };
    fetchStats();
  }, [familyId, refreshKey]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/50 shadow-sm hover:shadow-md transition-shadow">
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
