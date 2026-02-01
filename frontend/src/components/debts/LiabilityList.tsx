import { Debt } from "@/types";
import { Landmark, Calendar, Percent, MoreVertical, Pencil, Trash2, Plus, TrendingDown } from "lucide-react";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { AddRepaymentForm } from "./AddRepaymentForm";
import { Modal } from "@/components/ui/modal";
import { debtService } from "@/services/debtService";
import { DebtRepayment } from "@/types";


interface LiabilityListProps {
  debts?: Debt[];
  isLoading?: boolean;
}

export const LiabilityList: React.FC<LiabilityListProps> = ({ debts = [], isLoading = false }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [repaymentModalId, setRepaymentModalId] = useState<string | null>(null);
  const [visibleHistoryId, setVisibleHistoryId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<Record<string, DebtRepayment[]>>({});
  const [isLoadingHistory, setIsLoadingHistory] = useState<Record<string, boolean>>({});

  const fetchRepayments = async (debtId: string) => {
    try {
      setIsLoadingHistory(prev => ({ ...prev, [debtId]: true }));
      const data = await debtService.getRepayments(debtId);
      setHistoryData(prev => ({ ...prev, [debtId]: data }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingHistory(prev => ({ ...prev, [debtId]: false }));
    }
  };

  const toggleHistory = (debtId: string) => {
    if (visibleHistoryId === debtId) {
      setVisibleHistoryId(null);
    } else {
      setVisibleHistoryId(debtId);
      if (!historyData[debtId]) {
        fetchRepayments(debtId);
      }
    }
  };

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
        <div key={debt.id} className="flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl group hover:shadow-lg transition-all relative overflow-hidden">
        <div className={`p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ${activeMenu === debt.id ? 'z-50' : 'z-10'}`}>
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
          
          <div className="text-right flex items-center gap-6">
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Outstanding</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">₹{debt.remaining_amount.toLocaleString()}</p>
                <p className="text-xs font-medium text-red-500 mt-1">Total: ₹{debt.total_amount.toLocaleString()}</p>
             </div>

             <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === debt.id ? null : debt.id);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all dropdown-toggle"
                >
                   <MoreVertical className="w-5 h-5" />
                </button>
                
                <Dropdown 
                  isOpen={activeMenu === debt.id} 
                  onClose={() => setActiveMenu(null)} 
                  className="w-48 text-left"
                >
                  <DropdownItem onClick={() => { setActiveMenu(null); setRepaymentModalId(debt.id); }}>
                    <div className="flex items-center gap-2">
                       <Plus className="w-4 h-4 text-red-500" />
                       <span className="font-bold">Record Repayment</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { setActiveMenu(null); toggleHistory(debt.id); }}>
                    <div className="flex items-center gap-2 text-gray-600">
                       <Calendar className="w-4 h-4" />
                       <span>{visibleHistoryId === debt.id ? 'Hide History' : 'View History'}</span>
                    </div>
                  </DropdownItem>
                  <div className="h-px bg-gray-50 dark:bg-gray-800 my-1" />
                  <DropdownItem onClick={() => setActiveMenu(null)}>
                    <div className="flex items-center gap-2">
                      <Pencil className="w-4 h-4 text-gray-500" />
                      <span>Edit Liability</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem 
                    onClick={() => setActiveMenu(null)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Liability</span>
                    </div>
                  </DropdownItem>
                </Dropdown>
             </div>
          </div>
        </div>

        {visibleHistoryId === debt.id && (
           <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
              <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                 <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Repayment History</h5>
                 {isLoadingHistory[debt.id] ? (
                    <div className="space-y-2">
                       {[1, 2].map(i => <div key={i} className="h-10 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />)}
                    </div>
                 ) : historyData[debt.id]?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {historyData[debt.id].map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
                             <div className="flex flex-col">
                                <span className="text-xs font-black text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</span>
                                <span className="text-[10px] font-medium text-gray-400">{new Date(item.repayment_date).toLocaleDateString()}</span>
                             </div>
                             <TrendingDown className="w-3 h-3 text-red-500" />
                          </div>
                       ))}
                    </div>
                 ) : (
                    <p className="text-[10px] text-gray-400 font-medium italic text-center py-2">No repayments recorded yet.</p>
                 )}
              </div>
           </div>
        )}
        </div>
      ))}

      <Modal isOpen={!!repaymentModalId} onClose={() => setRepaymentModalId(null)} className="max-w-md p-8">
        <div className="mb-6">
          <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1">Add Repayment</h3>
          <p className="text-xs text-gray-500 font-medium">Record a partial or full payment of your liability.</p>
        </div>
        {repaymentModalId && (
          <AddRepaymentForm 
            debtId={repaymentModalId} 
            onSuccess={() => {
              setRepaymentModalId(null);
              window.location.reload();
            }} 
            onCancel={() => setRepaymentModalId(null)} 
          />
        )}
      </Modal>
    </div>
  );
};
