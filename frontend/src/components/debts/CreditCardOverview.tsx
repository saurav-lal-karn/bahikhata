"use client";
import React from "react";
import { CreditCard, Calendar, AlertCircle, TrendingUp } from "lucide-react";

const cards = [
  {
    id: "1",
    name: "HDFC Regalia Gold",
    bank: "HDFC Bank",
    limit: 500000,
    balance: 85000,
    dueDate: "Jan 18",
    statementDate: "Jan 03",
    color: "from-blue-600 to-indigo-700",
    lastDigits: "4582"
  },
  {
    id: "2",
    name: "SBI SimplyClick",
    bank: "SBI Bank",
    limit: 200000,
    balance: 42000,
    dueDate: "Jan 25",
    statementDate: "Jan 10",
    color: "from-emerald-600 to-teal-700",
    lastDigits: "9921"
  }
];

export const CreditCardOverview = () => {
  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
           <CreditCard className="w-6 h-6 text-rose-500" /> Credit Card Monitor
        </h3>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
          {cards.length} Cards Active
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const utilization = Math.round((card.balance / card.limit) * 100);
            const isHigh = utilization > 30;

            return (
              <div key={card.id} className="relative group">
                <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${card.color} text-white shadow-xl relative overflow-hidden transition-transform group-hover:-translate-y-1`}>
                   {/* Card Chips & Design */}
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-24 h-24" />
                   </div>
                   
                   <div className="flex justify-between items-start mb-10">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{card.bank}</p>
                         <h4 className="text-lg font-black">{card.name}</h4>
                      </div>
                      <div className="w-10 h-8 bg-white/20 rounded-lg backdrop-blur-md border border-white/20" />
                   </div>

                   <div className="mb-8">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1 text-center">Current Outstanding</p>
                      <h3 className="text-3xl font-black text-center">₹{card.balance.toLocaleString()}</h3>
                   </div>

                   <div className="flex justify-between items-end">
                      <p className="text-sm font-bold font-mono tracking-widest opacity-80">**** **** **** {card.lastDigits}</p>
                      <div className="text-right">
                         <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Expires</p>
                         <p className="text-xs font-bold font-mono">12/28</p>
                      </div>
                   </div>
                </div>

                {/* Card Details Panel */}
                <div className="mt-4 p-5 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilization</p>
                         <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${isHigh ? 'text-red-500' : 'text-emerald-500'}`}>{utilization}%</span>
                            <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full rounded-full ${isHigh ? 'bg-red-500' : 'bg-emerald-500'}`}
                                 style={{ width: `${utilization}%` }}
                               />
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Due</p>
                         <p className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-1.5 justify-end">
                            <Calendar className="w-3 h-3 text-rose-500" /> {card.dueDate}
                         </p>
                      </div>
                   </div>

                   {isHigh && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                         <AlertCircle className="w-3 h-3 text-red-500" />
                         <p className="text-[9px] font-bold text-red-500 uppercase tracking-tight">High Utilization: May impact credit score</p>
                      </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
