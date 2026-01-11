"use client";
import React from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Gem, Landmark, ShieldAlert } from "lucide-react";

export const NetWorthTimeline = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
             <Gem className="w-6 h-6 text-amber-500" /> Net Worth Timeline
          </h3>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Snapshot of your wealth architecture.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
           <div className="px-4 py-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm text-xs font-black text-gray-900 dark:text-white">Assets</div>
           <div className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400">Liabilities</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Chart Placeholder / Visual */}
         <div className="lg:col-span-8 h-[300px] flex items-end gap-2 px-2">
             {[45, 52, 48, 65, 72, 85, 82, 95, 110, 105, 125, 142].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-1.5 group/bar">
                 <div className="h-full w-full bg-gray-50/50 dark:bg-gray-800/30 rounded-lg relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-700 group-hover/bar:from-blue-500 group-hover/bar:to-indigo-400 shadow-lg shadow-blue-500/10"
                      style={{ height: `${val / 1.5}%` }}
                    />
                    {/* Liability Line Mock */}
                    <div 
                      className="absolute w-full border-t-2 border-red-400 dark:border-red-500/50 z-20 shadow-[0_-2px_10px_rgba(248,113,113,0.3)]"
                      style={{ bottom: `${(val * 0.4) / 1.5}%` }}
                    />
                 </div>
                 <span className="text-[9px] font-black text-gray-400 group-hover/bar:text-blue-500 transition-colors text-center uppercase tracking-tighter">
                   {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][i]}
                 </span>
              </div>
            ))}
         </div>

         {/* Stats */}
         <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Assets</p>
               <h4 className="text-2xl font-black text-gray-900 dark:text-white">₹54,20,000</h4>
               <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +12.4%
               </div>
            </div>

            <div className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/50">
               <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Total Liabilities</p>
               <h4 className="text-2xl font-black text-gray-900 dark:text-white">₹12,45,000</h4>
               <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 mt-1">
                  <ArrowDownRight className="w-3 h-3" /> -2.1%
               </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
               <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Current Net Worth</p>
               <h3 className="text-3xl font-black text-gray-900 dark:text-white">₹41,75,000</h3>
            </div>
         </div>
      </div>
    </div>
  );
};
