"use client";
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const ExpenseTrends = () => {
  const options: any = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        distributed: true,
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#9CA3AF', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF' },
        formatter: (val: number) => `₹${val/1000}k`
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3,
    },
    colors: ['#8B5CF6', '#8B5CF6', '#8B5CF6', '#EC4899', '#8B5CF6', '#8B5CF6', '#8B5CF6'],
  };

  const series = [{
    name: 'Expenses',
    data: [2500, 3100, 2800, 4500, 3200, 5100, 4200]
  }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
            Daily Trends
          </h3>
          <p className="text-sm text-gray-500">Expense variation this week</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span className="text-xs text-gray-400 font-medium">Regular</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            <span className="text-xs text-gray-400 font-medium">Peak</span>
          </div>
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height={280} />
    </div>
  );
};
