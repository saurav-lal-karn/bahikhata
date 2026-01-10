"use client";
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const CashFlowChart = () => {
  const options: any = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: '#9CA3AF'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF'
        }
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    colors: ['#10B981', '#EF4444'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#9CA3AF'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      }
    }
  };

  const series = [
    {
      name: 'Income',
      data: [65000, 68000, 75000, 72000, 85000, 85000]
    },
    {
      name: 'Expenses',
      data: [45000, 42000, 48000, 50000, 42300, 38000]
    }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
            Cash Flow
          </h3>
          <p className="text-sm text-gray-500">Income vs Expenses over time</p>
        </div>
        <select className="bg-transparent text-sm font-medium text-gray-500 border-none focus:ring-0 outline-none">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>
      <Chart options={options} series={series} type="area" height={310} />
    </div>
  );
};
