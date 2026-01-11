"use client";
import React from "react";
import { Zap, Trophy, TrendingUp, ShieldCheck, HeartPulse } from "lucide-react";

export const FinancialHealthScore = () => {
  const score = 84;
  
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-3">
           <HeartPulse className="w-6 h-6 text-rose-500" /> Health Score
        </h3>
        <Trophy className="w-5 h-5 text-amber-500" />
      </div>

      <div className="flex flex-col items-center justify-center py-10 relative">
         {/* Circular Score Visual */}
         <div className="w-48 h-48 flex items-center justify-center relative">
            <svg 
              viewBox="0 0 192 192" 
              className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-sm"
            >
               {/* Track Circle */}
               <circle 
                 cx="96" cy="96" r="84" 
                 fill="transparent" 
                 stroke="currentColor" 
                 strokeWidth="12" 
                 className="text-gray-100 dark:text-gray-800"
               />
               {/* Progress Circle */}
               <circle 
                 cx="96" cy="96" r="84" 
                 fill="transparent" 
                 stroke="currentColor" 
                 strokeWidth="12" 
                 strokeDasharray={2 * Math.PI * 84}
                 strokeDashoffset={2 * Math.PI * 84 * (1 - score/100)}
                 strokeLinecap="round"
                 className="text-emerald-500 transition-all duration-1000 ease-out"
               />
            </svg>
            <div className="text-center group cursor-pointer relative z-20">
               <h2 className="text-5xl font-black text-gray-900 dark:text-white group-hover:scale-110 transition-transform">{score}</h2>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Excellent</p>
            </div>
         </div>
         
         {/* Pulse Effect Gradient at bottom of score area */}
         <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
         <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Savings Rate</p>
            <div className="flex items-center gap-2">
               <span className="text-sm font-black text-gray-800 dark:text-white">32%</span>
               <TrendingUp className="w-3 h-3 text-emerald-500" />
            </div>
         </div>
         <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Debt Ratio</p>
            <div className="flex items-center gap-2">
               <span className="text-sm font-black text-gray-800 dark:text-white">14%</span>
               <ShieldCheck className="w-3 h-3 text-emerald-500" />
            </div>
         </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-start gap-3">
         <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
         <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Your score is in the top 5% of Bahikhata users. Boost it to 90 by increasing your ELSS investments.
         </p>
      </div>
    </div>
  );
};
