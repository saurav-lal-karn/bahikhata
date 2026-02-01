"use client";
import React from "react";
import { TrendingUp, ArrowUpRight, Gem } from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsService, ReportData } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

export const NetWorthTimeline = () => {
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

  const timeline = data?.net_worth_timeline || [];
  const latestWorth = timeline.length > 0 ? timeline[timeline.length - 1].value : 0;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
             <Gem className="w-6 h-6 text-amber-500" /> Net Worth Timeline
          </h3>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Snapshot of your wealth architecture.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 h-[300px] flex items-end gap-2 px-2">
              {timeline.map((point, i) => {
               const maxVal = Math.max(...timeline.map(p => p.value));
               const height = maxVal > 0 ? (point.value / maxVal) * 100 : 0;
               return (
               <div key={i} className="flex-1 flex flex-col justify-end gap-1.5 group/bar">
                  <div className="h-full w-full bg-gray-50/50 dark:bg-gray-800/30 rounded-lg relative overflow-hidden">
                     <div 
                       className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-700 group-hover/bar:from-blue-500 group-hover/bar:to-indigo-400 shadow-lg shadow-blue-500/10"
                       style={{ height: `${height}%` }}
                     />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 group-hover/bar:text-blue-500 transition-colors text-center uppercase tracking-tighter">
                    {point.date}
                  </span>
               </div>
              )})}
              {timeline.length === 0 && <div className="w-full flex items-center justify-center text-gray-400 italic">Historical data accumulating...</div>}
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Assets</p>
               <h4 className="text-2xl font-black text-gray-900 dark:text-white">₹{latestWorth.toLocaleString()}</h4>
               <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +12.4%
               </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
               <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Current Net Worth</p>
               <h3 className="text-3xl font-black text-gray-900 dark:text-white">₹{latestWorth.toLocaleString()}</h3>
            </div>
         </div>
      </div>
    </div>
  );
};
