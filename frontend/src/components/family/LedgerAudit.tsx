"use client";
import React from "react";
import { CheckCircle, AlertCircle, Clock, User, ArrowRight } from "lucide-react";

const auditItems = [
  { id: "1", user: "Priya Karn", action: "Added Expense", note: "Grocery - BigBasket", amount: 1250, status: "pending", time: "2h ago" },
  { id: "2", user: "Aryan Karn", action: "Added Expense", note: "Fuel - Shell", amount: 3500, status: "verified", time: "5h ago" },
  { id: "3", user: "Saurav Karn", action: "Added Income", note: "Bonus Credit", amount: 50000, status: "pending", time: "1d ago" },
];

export const LedgerAudit = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
           <CheckCircle className="w-5 h-5 text-emerald-500" /> Family Ledger Audit
        </h3>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
           Verification Queue
        </span>
      </div>

      <div className="p-6 space-y-4">
         {auditItems.map((item) => (
           <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-50 dark:border-gray-800 group hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                 <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-sm">
                    <User className="w-5 h-5 text-gray-400" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-gray-800 dark:text-white">{item.user}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                       {item.action} • <span className="text-gray-500">{item.note}</span>
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="text-right">
                    <p className="text-sm font-black text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                       <Clock className="w-3 h-3 text-gray-300" />
                       <span className="text-[9px] font-bold text-gray-400">{item.time}</span>
                    </div>
                 </div>

                 {item.status === "pending" ? (
                   <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                      Verify
                   </button>
                 ) : (
                   <div className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Done</span>
                   </div>
                 )}
                 <button className="p-2 text-gray-300 hover:text-gray-500">
                    <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
         ))}
      </div>

      <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-t border-gray-50 dark:border-gray-800 flex items-center gap-3">
         <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
         <p className="text-[9px] text-gray-400 font-medium leading-relaxed italic">
            Auditing ensures data integrity. Verified transactions are marked with a green checkmark in the global reports.
         </p>
      </div>
    </div>
  );
};
