"use client";
import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertCircle, 
  Info,
  ChevronRight
} from "lucide-react";

export const EmergencyFundCalculator = () => {
  const [months, setMonths] = useState(6);
  const avgExpense = 65000; // Mocked
  const recommended = avgExpense * months;
  const currentSaved = 240000; // Mocked
  const progress = Math.min(Math.round((currentSaved / recommended) * 100), 100);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm overflow-hidden border-l-8 border-l-emerald-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" /> Emergency Fund
        </h3>
        <span className="text-xs font-bold text-gray-400">Security Tool</span>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Duration</p>
            <span className="text-xs font-black text-emerald-600">{months} Months Buffer</span>
          </div>
          <div className="flex gap-2">
            {[3, 6, 12].map((m) => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  months === m 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-800'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-2">
           <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Recommended</span>
              <span className="text-lg font-black text-gray-900 dark:text-white">₹{(recommended / 100000).toFixed(2)}L</span>
           </div>
           <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Current Savings</span>
              <span className="text-sm font-black text-emerald-500">₹{(currentSaved / 100000).toFixed(2)}L</span>
           </div>
           
           <div className="pt-2">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                   style={{ width: `${progress}%` }}
                 />
              </div>
              <div className="flex justify-between mt-1">
                 <span className="text-[8px] font-black text-gray-400 uppercase">{progress}% Protected</span>
                 <span className="text-[8px] font-black text-emerald-500 uppercase">{progress === 100 ? 'Secured' : 'In Progress'}</span>
              </div>
           </div>
        </div>

        <div className="flex items-start gap-2 text-[9px] font-bold text-gray-400 leading-relaxed italic">
           <Info className="w-3 h-3 text-blue-500 shrink-0" />
           Based on your average monthly expense of ₹{avgExpense.toLocaleString()}.
        </div>
      </div>
    </div>
  );
};
