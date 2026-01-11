"use client";
import React, { useState } from "react";
import { 
  Calculator, 
  RotateCcw, 
  TrendingDown, 
  CheckCircle2,
  Info,
  ChevronRight,
  TrendingUp,
  Snowflake,
  Zap
} from "lucide-react";

export const PayoffCalculator = () => {
  const [method, setMethod] = useState<"snowball" | "avalanche">("snowball");
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-[2.5rem] p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/10 shrink-0">
             <Calculator className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Repayment Strategy Planner</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
              Optimize your debt-free journey. Compare different psychological and mathematical models to find what works for your family's financial temperament.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Strategy Toggle */}
         <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <h4 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
               Choose Your Path
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
               <button 
                 onClick={() => setMethod("snowball")}
                 className={`p-6 rounded-3xl border transition-all text-left relative overflow-hidden group ${
                   method === "snowball" 
                     ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 ring-4 ring-blue-500/5' 
                     : 'border-gray-100 dark:border-gray-800 hover:border-blue-200'
                 }`}
               >
                  <div className="flex items-center gap-4 relative z-10">
                     <div className={`p-3 rounded-2xl ${method === 'snowball' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-gray-500'}`}>
                        <Snowflake className="w-6 h-6" />
                     </div>
                     <div>
                        <h5 className="font-black text-gray-800 dark:text-white mb-1">Debt Snowball</h5>
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Psychological Wins</p>
                     </div>
                  </div>
                  <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed relative z-10">
                    Pay off the <span className="text-blue-600 font-black">smallest balance</span> first. Great for building momentum and confidence.
                  </p>
                  {method === 'snowball' && <div className="absolute top-0 right-0 p-4"><CheckCircle2 className="w-5 h-5 text-blue-500" /></div>}
               </button>

               <button 
                 onClick={() => setMethod("avalanche")}
                 className={`p-6 rounded-3xl border transition-all text-left relative overflow-hidden group ${
                   method === "avalanche" 
                     ? 'border-purple-500 bg-purple-50/20 dark:bg-purple-900/10 ring-4 ring-purple-500/5' 
                     : 'border-gray-100 dark:border-gray-800 hover:border-purple-200'
                 }`}
               >
                  <div className="flex items-center gap-4 relative z-10">
                     <div className={`p-3 rounded-2xl ${method === 'avalanche' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-100 text-gray-500'}`}>
                        <Zap className="w-6 h-6" />
                     </div>
                     <div>
                        <h5 className="font-black text-gray-800 dark:text-white mb-1">Debt Avalanche</h5>
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Mathematical Efficiency</p>
                     </div>
                  </div>
                  <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed relative z-10">
                    Pay off the <span className="text-purple-600 font-black">highest interest rate</span> first. Saves the most money in the long run.
                  </p>
                  {method === 'avalanche' && <div className="absolute top-0 right-0 p-4"><CheckCircle2 className="w-5 h-5 text-purple-500" /></div>}
               </button>
            </div>
         </div>

         {/* Calculator Result Preview */}
         <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">Projection</h4>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-gray-400">EXTRA PAYMENT:</span>
                     <span className="text-xs font-black text-indigo-600 italic">₹5,000 / mo</span>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                        <TrendingDown className="w-7 h-7" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Interest Saved</p>
                        <h4 className="text-2xl font-black text-emerald-500">₹2.45 Lakhs</h4>
                     </div>
                  </div>

                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                        <RotateCcw className="w-7 h-7" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time Reduced By</p>
                        <h4 className="text-2xl font-black text-blue-600">18 Months</h4>
                     </div>
                  </div>
               </div>

               <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800">
                  <button className="w-full py-4 bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                     Generate Step-By-Step Guide <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
