"use client";
import React from "react";
import { ScrollText, TrendingUp, Landmark, ShieldCheck } from "lucide-react";
import { TaxDeduction } from "@/types";

interface TaxSavingTrackerProps {
  deductions?: TaxDeduction[];
  isLoading?: boolean;
}

export const TaxSavingTracker: React.FC<TaxSavingTrackerProps> = ({ deductions = [], isLoading = false }) => {
  if (isLoading) return <div className="text-center py-10">Loading savings...</div>;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden border-t-8 border-t-blue-600">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
           <ScrollText className="w-5 h-5 text-blue-500" /> Tax-Saving Investments
        </h3>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
           FY 2025-26
        </span>
      </div>

      <div className="p-6 space-y-6">
         {deductions.length === 0 ? <div className="text-center text-gray-400">No deductions tracked</div> : deductions.map((saving) => {
           const progress = Math.round((saving.amount / saving.max_limit) * 100);
           
           return (
             <div key={saving.id} className="p-5 border border-gray-50 dark:border-gray-800 rounded-2xl hover:border-blue-100 dark:hover:border-blue-900/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-blue-50 text-blue-600`}>
                         <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-gray-800 dark:text-white">{saving.name}</h4>
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{saving.category} Deduction</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-white">₹{saving.amount.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Limit: ₹{saving.max_limit.toLocaleString()}</p>
                   </div>
                </div>

                <div className="h-2 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                   <div 
                     className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                     style={{ width: `${Math.min(progress, 100)}%` }}
                   />
                </div>
                
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                   <span className="text-gray-400">{progress}% Utilized</span>
                   <span className="text-blue-500">₹{Math.max(0, saving.max_limit - saving.amount).toLocaleString()} Remaining</span>
                </div>
             </div>
           );
         })}
      </div>
    </div>
  );
};
