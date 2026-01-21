import React from "react";
import { Debt } from "@/types";
import { Landmark, Calendar, Percent } from "lucide-react";

interface LiabilityListProps {
  debts?: Debt[];
  isLoading?: boolean;
}

export const LiabilityList: React.FC<LiabilityListProps> = ({ debts = [], isLoading = false }) => {
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl" />)}
    </div>;
  }

  if (debts.length === 0) {
      return <div className="text-center py-10 text-gray-500 font-medium">No liabilities recorded yet.</div>;
  }

  return (
    <div className="space-y-4">
      {debts.map((debt) => (
        <div key={debt.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 flex items-center justify-center">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white capitalize">{debt.lender}</h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                   <Percent className="w-3 h-3 text-gray-400" />
                   <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{debt.interest_rate}% Interest</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                   <Calendar className="w-3 h-3 text-gray-400" />
                   <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Due: {new Date(debt.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Outstanding</p>
             <p className="text-2xl font-black text-gray-900 dark:text-white">₹{debt.remaining_amount.toLocaleString()}</p>
             <p className="text-xs font-medium text-red-500 mt-1">Total: ₹{debt.total_amount.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
