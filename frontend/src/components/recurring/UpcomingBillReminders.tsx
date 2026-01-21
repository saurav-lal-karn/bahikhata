"use client";
import React from "react";
import { BellRing, Calendar, Clock, ArrowRight } from "lucide-react";
import { RecurringTransaction } from "@/types";

interface UpcomingBillRemindersProps {
  transactions?: RecurringTransaction[];
  isLoading?: boolean;
}

export const UpcomingBillReminders: React.FC<UpcomingBillRemindersProps> = ({ transactions = [], isLoading = false }) => {
  if (isLoading) return <div className="text-center py-4 text-xs">Loading alerts...</div>;

  // Filter valid future bills or bills due soon (ignoring past due for simplicity or showing them as overdue)
  // Let's show everything sorted by date for now
  const sorted = [...transactions].sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime());
  const upcoming = sorted.slice(0, 3); // Top 3

  const totalUpcoming = upcoming.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm border-l-8 border-l-blue-500">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
          <BellRing className="w-5 h-5 text-blue-500" /> Bill Alerts
        </h3>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">{upcoming.length} Upcoming</span>
      </div>

      <div className="space-y-4">
        {upcoming.length === 0 ? (
             <div className="text-xs text-gray-400 text-center">No upcoming bills found.</div>
        ) : upcoming.map((bill) => {
          const daysDiff = Math.ceil((new Date(bill.next_due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          const urgent = daysDiff <= 5;
          const dateLabel = daysDiff < 0 ? `Overdue ${Math.abs(daysDiff)}d` : daysDiff === 0 ? "Today" : `In ${daysDiff} Days`;

          return (
          <div key={bill.id} className={`p-4 rounded-2xl border transition-all group cursor-pointer ${urgent ? 'border-red-100 bg-red-50/20 dark:border-red-900/40 dark:bg-red-900/10' : 'border-gray-50 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30'}`}>
            <div className="flex justify-between items-start mb-2">
               <div>
                  <h4 className="text-sm font-black text-gray-800 dark:text-white leading-tight">{bill.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{bill.type}</p>
               </div>
               <div className="text-right">
                  <p className="text-sm font-black text-gray-900 dark:text-white">₹{bill.amount.toLocaleString()}</p>
               </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
               <div className="flex items-center gap-2">
                  <Clock className={`w-3 h-3 ${urgent ? 'text-red-500' : 'text-blue-500'}`} />
                  <span className={`text-[10px] font-black uppercase ${urgent ? 'text-red-500' : 'text-gray-500'}`}>{dateLabel}</span>
               </div>
               <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        )})}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Upcoming Inflow</p>
         <h4 className="text-xl font-black text-gray-900 dark:text-white">₹{totalUpcoming.toLocaleString()}</h4>
      </div>
    </div>
  );
};
