"use client";
import React from "react";
import { TrendingUp, ArrowUpRight, Briefcase, Coins, Landmark } from "lucide-react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const InvestmentSummary = () => {
  const investments = [
    { name: "Stocks", value: "₹4,50,000", profit: "+12.4%", icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
    { name: "Mutual Funds", value: "₹2,10,000", profit: "+8.2%", icon: <Landmark className="w-4 h-4 text-purple-500" /> },
    { name: "Crypto", value: "₹45,000", profit: "-4.5%", icon: <Coins className="w-4 h-4 text-orange-500" /> },
  ];

  const chartOptions: any = {
    chart: {
      type: 'area',
      sparkline: { enabled: true },
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
      }
    },
    colors: ['#8B5CF6'],
    tooltip: { enabled: false }
  };

  const chartSeries = [{
    name: 'Portfolio',
    data: [700000, 715000, 705000, 725000, 740000, 765000, 750000]
  }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
            Investments
          </h3>
          <p className="text-xs text-gray-500 mt-1">Portfolio performance</p>
        </div>
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-2 mb-1">
          <h2 className="text-3xl font-black text-gray-800 dark:text-white/90">₹7,05,000</h2>
          <span className="flex items-center text-sm font-bold text-green-500 pb-1">
            <ArrowUpRight className="w-4 h-4" /> 15.2%
          </span>
        </div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Portfolio Value</p>
      </div>

      <div className="h-20 mb-6">
        <Chart options={chartOptions} series={chartSeries} type="area" height="100%" />
      </div>

      <div className="space-y-4">
        {investments.map((inv, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {inv.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90">{inv.name}</p>
                <p className="text-xs text-gray-500">{inv.value}</p>
              </div>
            </div>
            <span className={`text-xs font-black ${inv.profit.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {inv.profit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
