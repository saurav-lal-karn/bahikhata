"use client";
import React from "react";
import { PieChart as PieChartIcon, ArrowUpRight, TrendingDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { analyticsService, ReportData } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const SpendingInsights = () => {
  const { user } = useAuth();
  const familyId = user?.family?.id;
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (familyId) {
      analyticsService.getReportData(familyId)
        .then(setData)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [familyId]);

  if (isLoading) return <div className="h-96 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-[2.5rem]" />;

  const spending = data?.category_spending || [];

  const chartOptions: any = {
    chart: { type: "donut" },
    labels: spending.map(s => s.category),
    colors: spending.map(s => s.color),
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Spend",
              color: "#6B7280",
              formatter: () => `₹${spending.reduce((acc, s) => acc + s.amount, 0).toLocaleString()}`
            }
          }
        }
      }
    }
  };

  const chartSeries = spending.map(s => s.amount);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Spending Structure</h3>
          <p className="text-sm text-gray-500 font-medium">Monthly allocation</p>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl">
          <TrendingDown className="w-5 h-5 text-red-500" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-10">
        <div className="h-[250px]">
          <Chart options={chartOptions} series={chartSeries} type="donut" height="100%" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {spending.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">{item.category}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">₹{item.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
