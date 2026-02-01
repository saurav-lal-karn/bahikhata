"use client";
import React from "react";
import { Investment, InvestmentTransaction } from "@/types";
import { TrendingUp, Coins, MoreVertical, Pencil, Trash2, Plus, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { AddInvestmentTransactionForm } from "./AddInvestmentTransactionForm";
import { Modal } from "@/components/ui/modal";
import { investmentService } from "@/services/investmentService";


interface InvestmentListProps {
  investments?: Investment[];
  isLoading?: boolean;
}

export const InvestmentList: React.FC<InvestmentListProps> = ({ investments = [], isLoading = false }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [transactionModalId, setTransactionModalId] = useState<string | null>(null);
  const [visibleHistoryId, setVisibleHistoryId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<Record<string, InvestmentTransaction[]>>({});
  const [isLoadingHistory, setIsLoadingHistory] = useState<Record<string, boolean>>({});

  const fetchHistory = async (investmentId: string) => {
    try {
      setIsLoadingHistory(prev => ({ ...prev, [investmentId]: true }));
      const data = await investmentService.getTransactions(investmentId);
      setHistoryData(prev => ({ ...prev, [investmentId]: data }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingHistory(prev => ({ ...prev, [investmentId]: false }));
    }
  };

  const toggleHistory = (investmentId: string) => {
    if (visibleHistoryId === investmentId) {
      setVisibleHistoryId(null);
    } else {
      setVisibleHistoryId(investmentId);
      if (!historyData[investmentId]) {
        fetchHistory(investmentId);
      }
    }
  };

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
            <div key={inv.id} className="flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl group hover:shadow-lg transition-all relative overflow-hidden">
            <div className={`p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ${activeMenu === inv.id ? 'z-50' : 'z-10'}`}>
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
                          className="w-48 text-left"
                        >
                          <DropdownItem onClick={() => { setActiveMenu(null); setTransactionModalId(inv.id); }}>
                            <div className="flex items-center gap-2">
                               <Plus className="w-4 h-4 text-blue-500" />
                               <span className="font-bold">Record Transaction</span>
                            </div>
                          </DropdownItem>
                          <DropdownItem onClick={() => { setActiveMenu(null); toggleHistory(inv.id); }}>
                            <div className="flex items-center gap-2 text-gray-600">
                               <Calendar className="w-4 h-4" />
                               <span>{visibleHistoryId === inv.id ? 'Hide History' : 'View History'}</span>
                            </div>
                          </DropdownItem>
                          <div className="h-px bg-gray-50 dark:bg-gray-800 my-1" />
                          <DropdownItem onClick={() => setActiveMenu(null)}>
                            <div className="flex items-center gap-2">
                              <Pencil className="w-4 h-4 text-gray-500" />
                              <span>Edit Asset</span>
                            </div>
                          </DropdownItem>
                          <DropdownItem 
                            onClick={() => setActiveMenu(null)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold"
                          >
                            <div className="flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Asset</span>
                            </div>
                          </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {visibleHistoryId === inv.id && (
               <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                     <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Transaction History</h5>
                     {isLoadingHistory[inv.id] ? (
                        <div className="space-y-2">
                           {[1, 2].map(i => <div key={i} className="h-10 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />)}
                        </div>
                     ) : historyData[inv.id]?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {historyData[inv.id].map(item => (
                              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
                                 <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${item.type === 'BUY' ? 'bg-emerald-50 text-emerald-600' : item.type === 'SELL' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'}`}>
                                       {item.type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : item.type === 'SELL' ? <ArrowDownRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-xs font-black text-gray-900 dark:text-white">{item.type} {item.quantity} Units</span>
                                       <span className="text-[10px] font-medium text-gray-400">@ ₹{item.price_per_unit} • {new Date(item.transaction_date).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                                 <span className="text-xs font-black text-gray-800 dark:text-white">₹{(item.quantity * item.price_per_unit).toLocaleString()}</span>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-[10px] text-gray-400 font-medium italic text-center py-2">No transactions recorded yet.</p>
                     )}
                  </div>
               </div>
            )}
            </div>

        );
      })}

      <Modal isOpen={!!transactionModalId} onClose={() => setTransactionModalId(null)} className="max-w-md p-8">
        <div className="mb-6">
          <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1">Add Transaction</h3>
          <p className="text-xs text-gray-500 font-medium">Record a buy, sell, or dividend for this investment.</p>
        </div>
        {transactionModalId && (
          <AddInvestmentTransactionForm 
            investmentId={transactionModalId} 
            onSuccess={() => {
              setTransactionModalId(null);
              window.location.reload();
            }} 
            onCancel={() => setTransactionModalId(null)} 
          />
        )}
      </Modal>
    </div>
  );
};
