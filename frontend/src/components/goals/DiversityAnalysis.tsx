"use client";
import React from "react";
import { 
  PieChart, 
  Gem, 
  Coins, 
  Landmark, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

const assets = [
  { label: "Mutual Funds", percentage: 45, icon: <TrendingUp className="w-3 h-3" />, color: "bg-blue-500" },
  { label: "Equity/Stocks", percentage: 25, icon: <TrendingUp className="w-3 h-3" />, color: "bg-indigo-500" },
  { label: "Gold / ETFs", percentage: 15, icon: <Gem className="w-3 h-3" />, color: "bg-amber-500" },
  { label: "Real Estate", percentage: 10, icon: <Landmark className="w-3 h-3" />, color: "bg-emerald-500" },
  { label: "Digital Assets", percentage: 5, icon: <Coins className="w-3 h-3" />, color: "bg-purple-500" },
];

export const DiversityAnalysis = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-500" /> Portfolio Mix
        </h3>
        <PieChart className="w-4 h-4 text-gray-300" />
      </div>

      <div className="space-y-5">
        <div className="flex h-4 w-full rounded-full overflow-hidden shadow-inner ring-1 ring-black/5">
           {assets.map((asset, i) => (
             <div 
               key={i} 
               className={asset.color} 
               style={{ width: `${asset.percentage}%` }}
               title={`${asset.label}: ${asset.percentage}%`}
             />
           ))}
        </div>

        <div className="space-y-3 pt-2">
           {assets.map((asset, i) => (
             <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${asset.color}`} />
                   <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{asset.label}</span>
                </div>
                <span className="text-[11px] font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  {asset.percentage}%
                </span>
             </div>
           ))}
        </div>

        <div className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-800">
           <div className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl">
              <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                Your portfolio is <span className="text-blue-600 font-black">well-diversified</span>. Exposure to high-risk assets is within the recommended 10% limit.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
