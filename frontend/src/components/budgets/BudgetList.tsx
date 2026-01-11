"use client";
import React from "react";
import { 
  Utensils, 
  Car, 
  Tv, 
  ShoppingBag, 
  Zap, 
  HeartPulse,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

const initialBudgets = [
  {
    id: "1",
    category: "Food & Drinks",
    spent: 12500,
    limit: 15000,
    icon: <Utensils className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600",
    barColor: "bg-orange-500",
    rollover: true
  },
  {
    id: "2",
    category: "Transport",
    spent: 4200,
    limit: 5000,
    icon: <Car className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
    barColor: "bg-blue-500",
    rollover: false
  },
  {
    id: "3",
    category: "Entertainment",
    spent: 9800,
    limit: 8000,
    icon: <Tv className="w-5 h-5" />,
    color: "bg-red-50 text-red-600",
    barColor: "bg-red-500",
    rollover: true
  },
  {
    id: "4",
    category: "Shopping",
    spent: 16500,
    limit: 20000,
    icon: <ShoppingBag className="w-5 h-5" />,
    color: "bg-pink-50 text-pink-600",
    barColor: "bg-pink-500",
    rollover: true
  },
  {
    id: "5",
    category: "Utilities",
    spent: 3500,
    limit: 7000,
    icon: <Zap className="w-5 h-5" />,
    color: "bg-amber-50 text-amber-600",
    barColor: "bg-amber-500",
    rollover: false
  }
];

export const BudgetList = () => {
  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">Category Allocation</h3>
      </div>
      <div className="p-6 space-y-8">
        {initialBudgets.map((budget) => {
          const percentage = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
          const isOver = budget.spent > budget.limit;
          
          return (
            <div key={budget.id} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${budget.color} transition-transform group-hover:scale-110`}>
                    {budget.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-800 dark:text-white">{budget.category}</h4>
                    <div className="flex items-center gap-2">
                       {budget.rollover && (
                         <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                           <RefreshCw className="w-2.5 h-2.5" /> Rollover
                         </div>
                       )}
                       {isOver && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                            <AlertTriangle className="w-2.5 h-2.5" /> Warning
                          </div>
                       )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Spent</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">
                    ₹{budget.spent.toLocaleString()}
                    <span className="text-xs text-gray-400 font-bold ml-1">/ ₹{budget.limit.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              
              <div className="relative h-3 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out ${isOver ? 'bg-red-500 shadow-lg shadow-red-500/20' : budget.barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{percentage}% Utilized</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isOver ? 'text-red-500' : 'text-emerald-500'}`}>
                  {isOver ? `Over by ₹${(budget.spent - budget.limit).toLocaleString()}` : `₹${(budget.limit - budget.spent).toLocaleString()} Left`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
