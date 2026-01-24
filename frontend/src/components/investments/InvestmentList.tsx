import { Investment } from "@/types";
import { TrendingUp, Coins, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";


interface InvestmentListProps {
  investments?: Investment[];
  isLoading?: boolean;
}

export const InvestmentList: React.FC<InvestmentListProps> = ({ investments = [], isLoading = false }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl" />)}
    </div>;
  }

  if (investments.length === 0) {
      return <div className="text-center py-10 text-gray-500 font-medium">No investments recorded yet.</div>;
  }

  return (
    <div className="space-y-4">
      {investments.map((inv) => {
        const currentValue = inv.current_price * inv.quantity;
        const investedValue = inv.avg_buy_price * inv.quantity;
        const profit = currentValue - investedValue;
        const isProfit = profit >= 0;

        return (
            <div key={inv.id} className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:shadow-lg transition-all relative ${activeMenu === inv.id ? 'z-50' : 'z-10'}`}>
            <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                <h4 className="text-lg font-black text-gray-900 dark:text-white capitalize">{inv.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Coins className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{inv.quantity} Units @ ₹{inv.avg_buy_price}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{inv.type}</span>
                </div>
                </div>
            </div>
            
            <div className="text-right flex items-center gap-6">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Value</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">₹{currentValue.toLocaleString()}</p>
                    <p className={`text-xs font-bold mt-1 ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isProfit ? '+' : ''}₹{profit.toLocaleString()} ({((profit/investedValue)*100).toFixed(1)}%)
                    </p>
                </div>

                <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inv.id) {
                            setActiveMenu(activeMenu === inv.id ? null : inv.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all dropdown-toggle"
                    >
                       <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    <Dropdown 
                      isOpen={activeMenu === inv.id} 
                      onClose={() => setActiveMenu(null)} 
                      className="w-32 text-left"
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

        );
      })}
    </div>
  );
};
