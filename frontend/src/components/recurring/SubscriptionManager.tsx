"use client";
import React from "react";
import { 
  Tv, 
  Wifi, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink,
  CreditCard,
  AlertCircle
} from "lucide-react";

const subscriptions = [
  {
    id: "1",
    name: "Netflix Premium",
    cost: 649,
    cycle: "Monthly",
    nextDate: "Jan 15",
    method: "HDFC Card *4582",
    icon: <Tv className="w-5 h-5" />,
    color: "bg-red-50 text-red-600"
  },
  {
    id: "2",
    name: "Jio Fiber 1Gbps",
    cost: 1769,
    cycle: "Monthly",
    nextDate: "Jan 22",
    method: "UPI / Auto-pay",
    icon: <Wifi className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: "3",
    name: "Amazon Prime",
    cost: 1499,
    cycle: "Annual",
    nextDate: "Jun 10",
    method: "SBI Card *9921",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "bg-cyan-50 text-cyan-600"
  },
  {
    id: "4",
    name: "Google One 2TB",
    cost: 650,
    cycle: "Monthly",
    nextDate: "Jan 28",
    method: "HDFC Card *4582",
    icon: <Smartphone className="w-5 h-5" />,
    color: "bg-amber-50 text-amber-600"
  }
];

export const SubscriptionManager = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {subscriptions.map((sub) => (
         <div key={sub.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-transparent hover:border-b-blue-500">
           <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${sub.color} transition-transform group-hover:scale-110`}>
                {sub.icon}
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Cost</p>
                 <p className="text-lg font-black text-gray-900 dark:text-white">₹{sub.cost.toLocaleString()}</p>
                 <span className="text-[9px] font-bold text-gray-400 uppercase">{sub.cycle}</span>
              </div>
           </div>

           <div className="mb-6">
              <h4 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
                 {sub.name} <ExternalLink className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <div className="flex items-center gap-3 mt-2">
                 <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <CreditCard className="w-3 h-3" /> {sub.method}
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
              </div>
              <div className="text-right">
                 <span className="text-[9px] font-bold text-gray-400 uppercase">Next Billing</span>
                 <p className="text-[11px] font-black text-gray-800 dark:text-white">{sub.nextDate}</p>
              </div>
           </div>
         </div>
       ))}
    </div>
  );
};
