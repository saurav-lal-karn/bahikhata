"use client";
import React from "react";
import { 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  RotateCcw,
  CheckCircle2,
  Lightbulb
} from "lucide-react";

const suggestions = [
  {
    category: "Transport",
    current: 5000,
    suggested: 4200,
    reason: "Consistent underspending by 15% over the last 3 months.",
    type: "decrease",
    color: "bg-blue-50 text-blue-600"
  },
  {
    category: "Entertainment",
    current: 8000,
    suggested: 10500,
    reason: "Frequently exceeding limit with movie premieres and events.",
    type: "increase",
    color: "bg-red-50 text-red-600"
  },
  {
    category: "Groceries",
    current: 12000,
    suggested: 12000,
    reason: "Spending is highly optimized. Maintain current levels.",
    type: "optimum",
    color: "bg-emerald-50 text-emerald-600"
  }
];

export const PredictiveBudgetPanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Lightbulb className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1">Smart Spending Analysis</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Bahikhata analyzes your historical data to suggest optimized budgets. Adjusting these values improves your financial health score.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:border-purple-200 dark:hover:border-purple-800/50 transition-all group flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.color}`}>
                {item.category}
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">₹{item.suggested.toLocaleString()}</h4>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${item.type === 'decrease' ? 'text-blue-500' : item.type === 'increase' ? 'text-red-500' : 'text-emerald-500'}`}>
                {item.type === 'decrease' && <ArrowDownRight className="w-3 h-3" />}
                {item.type === 'increase' && <ArrowUpRight className="w-3 h-3" />}
                {item.type === 'optimum' && <CheckCircle2 className="w-3 h-3" />}
                {item.type === 'optimum' ? "Target met" : `${Math.round(Math.abs(item.suggested - item.current) / item.current * 100)}% adjustment`}
              </span>
            </div>
            
            <p className="text-xs text-gray-500 font-medium mb-6 flex-grow leading-relaxed">
              "{item.reason}"
            </p>

            <button className="w-full py-3 bg-gray-50 dark:bg-gray-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white text-gray-600 dark:text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm">
              Apply Suggestion
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
