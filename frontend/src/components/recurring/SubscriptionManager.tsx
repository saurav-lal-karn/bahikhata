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
  Zap,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { Subscription, RecurringTransaction, RecurringInstance } from "@/types";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { recurringService } from "@/services/recurringService";
import { formatCurrency, formatDateTime } from "@/lib/utils";


interface SubscriptionManagerProps {
  transactions?: (Subscription | RecurringTransaction)[];
  isLoading?: boolean;
  onEdit?: (subscription: Subscription | RecurringTransaction) => void;
  onDelete?: (id: string) => void;
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
    if (lowerType === 'utilities' || lowerName.includes('fiber') || lowerName.includes('wifi')) {
        return { icon: <Wifi className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" };
    }
    if (lowerName.includes('phone') || lowerType.includes('mobile')) {
         return { icon: <Smartphone className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" };
    }
    return { icon: <ShieldCheck className="w-5 h-5" />, color: "bg-cyan-50 text-cyan-600" };
};

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ transactions = [], isLoading = false, onEdit, onDelete }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [visibleHistoryId, setVisibleHistoryId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<Record<string, RecurringInstance[]>>({});
  const [isLoadingHistory, setIsLoadingHistory] = useState<Record<string, boolean>>({});

  const fetchInstances = async (recurringId: string) => {
    try {
      setIsLoadingHistory(prev => ({ ...prev, [recurringId]: true }));
      const data = await recurringService.getInstances(recurringId);
      setHistoryData(prev => ({ ...prev, [recurringId]: data }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingHistory(prev => ({ ...prev, [recurringId]: false }));
    }
  };

  const toggleHistory = (recurringId: string) => {
    if (visibleHistoryId === recurringId) {
      setVisibleHistoryId(null);
    } else {
      setVisibleHistoryId(recurringId);
      if (!historyData[recurringId]) {
        fetchInstances(recurringId);
      }
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-400 font-medium">Crunching your subscription data...</div>;
  if (transactions.length === 0) return <div className="text-center py-10 text-gray-500">No active subscriptions found.</div>;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {transactions.map((sub) => {
         const categoryName = 'category' in sub ? sub.category?.name : (sub as RecurringTransaction).type;
         const style = getStyle(categoryName || "Subscription", sub.name);
         const nextDate = 'next_billing_date' in sub ? sub.next_billing_date : (sub as RecurringTransaction).next_due_date;

         return (
         <div key={sub.id} className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group border-b-8 border-b-transparent hover:border-b-blue-500/30 relative flex flex-col ${activeMenu === sub.id ? 'z-50' : 'z-10'}`}>
           <div className="flex items-center justify-between mb-8">
              <div className={`p-5 rounded-3xl ${style.color} shadow-lg shadow-current/10 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {style.icon}
              </div>
              <div className="text-right flex items-center gap-5">
                 <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Monthly</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(sub.amount)}</p>
                    <span className="text-[10px] font-black text-blue-500 uppercase bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full mt-1">{sub.frequency}</span>
                 </div>

                 <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === sub.id ? null : sub.id);
                      }}
                      className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all hover:rotate-90"
                    >
                       <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    <Dropdown 
                      isOpen={activeMenu === sub.id} 
                      onClose={() => setActiveMenu(null)} 
                      className="w-48 text-left"
                    >
                      <DropdownItem onClick={() => { setActiveMenu(null); toggleHistory(sub.id); }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{visibleHistoryId === sub.id ? 'Hide History' : 'View Run History'}</span>
                        </div>
                      </DropdownItem>
                      <div className="h-px bg-gray-50 dark:bg-gray-800 my-1" />
                      <DropdownItem onClick={() => { setActiveMenu(null); onEdit?.(sub); }}>
                        <div className="flex items-center gap-2">
                          <Pencil className="w-4 h-4 text-gray-500" />
                          <span>Edit Settings</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => { setActiveMenu(null); onDelete?.(sub.id); }}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Subscription</span>
                        </div>
                      </DropdownItem>
                    </Dropdown>
                 </div>
              </div>

           </div>

           <div className="mb-8">
              <h4 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                 {sub.name} <ExternalLink className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
              </h4>
              <div className="flex items-center gap-3 mt-3">
                 <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                    <CreditCard className="w-3.5 h-3.5" /> {'category' in sub ? sub.category?.name : (sub as RecurringTransaction).type}
                 </div>
              </div>
           </div>

           <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                 <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Active</span>
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Upcoming</span>
                 <p className="text-xs font-black text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-500" /> {formatDateTime(nextDate || "")}
                 </p>
              </div>
           </div>

           {visibleHistoryId === sub.id && (
             <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 animate-in slide-in-from-top-4 duration-500">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <Zap className="w-3.5 h-3.5 text-blue-500" /> Execution Logs
                </h5>
                {isLoadingHistory[sub.id] ? (
                   <div className="space-y-3">
                      {[1, 2].map(i => <div key={i} className="h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
                   </div>
                ) : historyData[sub.id]?.length ? (
                   <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {historyData[sub.id].map(instance => (
                         <div key={instance.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl group/item hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                            <div className="flex items-center gap-3">
                               <div className={`p-2 rounded-xl ${instance.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                  {instance.status === 'SUCCESS' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-xs font-black text-gray-900 dark:text-white">Processed</span>
                                  <span className="text-[10px] font-medium text-gray-400">{new Date(instance.execution_date).toLocaleDateString()}</span>
                               </div>
                            </div>
                            {instance.status === 'FAILED' && instance.error_message && (
                               <span className="text-[9px] font-bold text-red-500 max-w-[100px] truncate" title={instance.error_message}>{instance.error_message}</span>
                            )}
                         </div>
                      ))}
                   </div>
                ) : (
                   <div className="py-4 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                      <p className="text-[10px] text-gray-400 font-medium italic">No execution logs found for this cycle.</p>
                   </div>
                )}
             </div>
           )}
         </div>
       );})}
    </div>
  );
};
