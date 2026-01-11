"use client";
import React from "react";
import { PieChart, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const SpendingInsights = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Spending Trend Chart Placeholder */}
      <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-xl font-black text-gray-800 dark:text-white">Monthly Trend</h4>
            <p className="text-sm text-gray-500 font-medium italic">Income vs Expenses</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expenses</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-4 px-2">
          {[65, 45, 75, 55, 90, 40, 60, 85, 50, 70, 40, 95].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-t-lg relative group h-full flex items-end overflow-hidden">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 opacity-80 group-hover:opacity-100 transition-all rounded-t-sm" 
                  style={{ height: `${val}%` }}
                ></div>
                <div 
                  className="absolute w-full bg-gradient-to-t from-purple-600 to-purple-400 opacity-60 group-hover:opacity-80 transition-all rounded-t-sm" 
                  style={{ height: `${val * 0.6}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">{['J','F','M','A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution Placeholder */}
      <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm text-center">
        <div className="flex items-center justify-between mb-8 text-left">
          <div>
            <h4 className="text-xl font-black text-gray-800 dark:text-white">Category Mix</h4>
            <p className="text-sm text-gray-500 font-medium italic">Spending by category</p>
          </div>
          <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-blue-500 transition-colors">
            <PieChart className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-gray-100 dark:text-gray-800"></circle>
              <circle cx="18" cy="18" r="15.9" fill="transparent" strokeDasharray="30 100" stroke="currentColor" strokeWidth="3" className="text-purple-500"></circle>
              <circle cx="18" cy="18" r="15.9" fill="transparent" strokeDasharray="25 100" strokeDashoffset="-30" stroke="currentColor" strokeWidth="3" className="text-blue-500"></circle>
              <circle cx="18" cy="18" r="15.9" fill="transparent" strokeDasharray="15 100" strokeDashoffset="-55" stroke="currentColor" strokeWidth="3" className="text-green-500"></circle>
              <circle cx="18" cy="18" r="15.9" fill="transparent" strokeDasharray="30 100" strokeDashoffset="-70" stroke="currentColor" strokeWidth="3" className="text-orange-500"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-900 dark:text-white">100%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Analyzed</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-left w-full max-w-[200px]">
            {[
              { label: 'Housing', val: '30%', color: 'bg-purple-500' },
              { label: 'Food', val: '25%', color: 'bg-blue-500' },
              { label: 'Travel', val: '15%', color: 'bg-green-500' },
              { label: 'Misc', val: '30%', color: 'bg-orange-500' },
            ].map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></span>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{cat.label}</span>
                </div>
                <span className="text-xs font-black text-gray-900 dark:text-white">{cat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
