"use client";
import React from "react";
import { 
  Tv, 
  Wifi, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink,
  CreditCard,
  AlertCircle,
  Zap
} from "lucide-react";
import { RecurringTransaction } from "@/types";

interface SubscriptionManagerProps {
  transactions?: RecurringTransaction[];
  isLoading?: boolean;
}

// Helper to determine icon/color based on type/name
const getStyle = (type: string, name: string) => {
    const lowerType = type.toLowerCase();
    const lowerName = name.toLowerCase();
    
    if (lowerType === 'entertainment' || lowerName.includes('netflix') || lowerName.includes('prime')) {
        return { icon: <Tv className="w-5 h-5" />, color: "bg-red-50 text-red-600" };
    }
    if (lowerType === 'utilities' || lowerName.includes('fiber') || lowerName.includes('wifi')) {
        return { icon: <Wifi className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" };
    }
    if (lowerName.includes('phone') || lowerType.includes('mobile')) {
         return { icon: <Smartphone className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" };
    }
    return { icon: <ShieldCheck className="w-5 h-5" />, color: "bg-cyan-50 text-cyan-600" };
};

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ transactions = [], isLoading = false }) => {
  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (transactions.length === 0) return <div className="text-center py-10 text-gray-500">No active subscriptions found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {transactions.map((sub) => {
         const style = getStyle(sub.type, sub.name);
         return (
         <div key={sub.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-transparent hover:border-b-blue-500">
           <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${style.color} transition-transform group-hover:scale-110`}>
                {style.icon}
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Cost</p>
                 <p className="text-lg font-black text-gray-900 dark:text-white">₹{sub.amount.toLocaleString()}</p>
                 <span className="text-[9px] font-bold text-gray-400 uppercase">{sub.frequency}</span>
              </div>
           </div>

           <div className="mb-6">
              <h4 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
                 {sub.name} <ExternalLink className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <div className="flex items-center gap-3 mt-2">
                 <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <CreditCard className="w-3 h-3" /> Auto-Pay (Simulated)
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
                 <p className="text-[11px] font-black text-gray-800 dark:text-white">{new Date(sub.next_due_date).toLocaleDateString()}</p>
              </div>
           </div>
         </div>
       );})}
    </div>
  );
};
