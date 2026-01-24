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
  AlertTriangle,
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react";


import { Budget } from "@/types";
import { BudgetSkeleton } from "./BudgetSkeleton";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useState } from "react";


interface BudgetListProps {
  budgets?: Budget[];
  isLoading?: boolean;
}

const getCategoryIcon = (iconName: string = 'default') => {
    // You might want to move this to a shared mapping file if used elsewhere
    // For now, mapping simplified
    const className="w-5 h-5";
    switch(iconName.toLowerCase()) {
        case 'food': case 'utensils': return <Utensils className={className} />;
        case 'transport': case 'car': return <Car className={className} />;
        case 'entertainment': case 'tv': return <Tv className={className} />;
        case 'shopping': case 'shoppingbag': return <ShoppingBag className={className} />;
        case 'utilities': case 'zap': return <Zap className={className} />;
        case 'health': return <HeartPulse className={className} />;
        default: return <Zap className={className} />;
    }
};

const getCategoryColor = (name: string = '') => {
    // Basic color hash or mapping based on name length/char for consistency if no explicit color
    const colors = [
        { color: "bg-orange-50 text-orange-600", barColor: "bg-orange-500" },
        { color: "bg-blue-50 text-blue-600", barColor: "bg-blue-500" },
        { color: "bg-red-50 text-red-600", barColor: "bg-red-500" },
        { color: "bg-pink-50 text-pink-600", barColor: "bg-pink-500" },
        { color: "bg-amber-50 text-amber-600", barColor: "bg-amber-500" },
        { color: "bg-emerald-50 text-emerald-600", barColor: "bg-emerald-500" },
        { color: "bg-indigo-50 text-indigo-600", barColor: "bg-indigo-500" },
    ];
    return colors[name.length % colors.length];
};

export const BudgetList: React.FC<BudgetListProps> = ({ budgets = [], isLoading = false }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">

      <div className="p-6 border-b border-gray-50 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">Category Allocation</h3>
      </div>
      <div className="p-6 space-y-8">
        {isLoading ? (
             Array(3).fill(0).map((_, i) => <BudgetSkeleton key={i} />)
        ) : budgets.length > 0 ? (
            budgets.map((budget) => {
            // Note: Currently backend doesn't send 'spent' or 'rollover'. 
            // Mocking spent as 0 if not present, or random/calculated if we had expenses.
            // For now, simply showing 0 spent or mocking for visual verification if needed.
            // Let's assume 0 spent for new budgets.
            const spent = 0; 
            const limit = budget.amount_limit;
            const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
            const isOver = spent > limit;
            const { color, barColor } = getCategoryColor(budget.category?.name); 
            // Note: budget.category might be populated if using Preload, otherwise use name logic?
            // Actually DTO says 'category' is ExpenseCategory object
            const categoryName = budget.category?.name || "Unknown";

            return (
                <div key={budget.id} className={`group relative ${activeMenu === budget.id ? 'z-50' : 'z-10'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">

                    <div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110`}>
                        {getCategoryIcon(budget.category?.name || 'default')} 
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-800 dark:text-white">{categoryName}</h4>
                        <div className="flex items-center gap-2">
                            {/* Rollover not in DTO yet, so hiding or can assume false */}
                           {/* {budget.rollover && (
                             <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                               <RefreshCw className="w-2.5 h-2.5" /> Rollover
                             </div>
                           )} */}
                           {isOver && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                <AlertTriangle className="w-2.5 h-2.5" /> Warning
                              </div>
                           )}
                        </div>
                    </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Spent</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white">
                                ₹{spent.toLocaleString()}
                                <span className="text-xs text-gray-400 font-bold ml-1">/ ₹{limit.toLocaleString()}</span>
                            </p>
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === budget.id ? null : budget.id);
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors dropdown-toggle"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            <Dropdown 
                                isOpen={activeMenu === budget.id} 
                                onClose={() => setActiveMenu(null)} 
                                className="w-32"
                            >
                                <DropdownItem onClick={() => setActiveMenu(null)}>
                                    <div className="flex items-center gap-2">
                                        <Pencil className="w-4 h-4 text-gray-500" />
                                        <span>Edit</span>
                                    </div>
                                </DropdownItem>
                                <DropdownItem 
                                    onClick={() => setActiveMenu(null)}
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                                >
                                    <div className="flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </div>
                                </DropdownItem>
                            </Dropdown>
                        </div>
                    </div>

                </div>
                
                <div className="relative h-3 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out ${isOver ? 'bg-red-500 shadow-lg shadow-red-500/20' : barColor}`}
                    style={{ width: `${percentage}%` }}
                    />
                </div>
                
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{percentage}% Utilized</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isOver ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isOver ? `Over by ₹${(spent - limit).toLocaleString()}` : `₹${(limit - spent).toLocaleString()} Left`}
                    </span>
                </div>
                </div>
            );
            })
        ) : (
            <div className="text-center py-8 text-gray-500">
                <p>No budgets configured yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};
