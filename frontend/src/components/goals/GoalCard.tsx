"use client";
import React from "react";
import { Calendar, MoreVertical, Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { AddContributionForm } from "./AddContributionForm";
import { Modal } from "@/components/ui/modal";
import { goalService } from "@/services/goalService";
import { GoalContribution } from "@/types";


interface GoalCardProps {
  title: string;
  target: number;
  current: number;
  deadline: string;
  icon: React.ReactNode;
  color: string;
  barColor: string;
  id?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}


export const GoalCard: React.FC<GoalCardProps> = ({ 
  title, 
  target, 
  current, 
  deadline, 
  icon, 
  color, 
  barColor,
  id,
  onEdit,
  onDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<GoalContribution[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    if (!id) return;
    try {
      setIsLoadingHistory(true);
      const data = await goalService.getContributions(id);
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const toggleHistory = () => {
    if (!showHistory) {
      fetchHistory();
    }
    setShowHistory(!showHistory);
  };

  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const remaining = Math.max(target - current, 0);

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full border-b-4 border-b-transparent hover:border-b-current relative ${isMenuOpen ? 'z-50' : 'z-10'}`} style={{ borderBottomColor: barColor.replace('bg-', '') }}>
      <div className="flex items-center justify-between mb-6">

        <div className={`p-4 rounded-2xl ${color} transition-transform group-hover:scale-110 shadow-sm`}>
          {icon}
        </div>
        <div className="text-right flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
             <Calendar className="w-3 h-3" /> {deadline}
          </div>
          
          <div className="relative">
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setIsMenuOpen(!isMenuOpen);
               }}
               className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors dropdown-toggle"
             >
                <MoreVertical className="w-4 h-4" />
             </button>
             
             <Dropdown isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} className="w-48 text-left">
                <DropdownItem onClick={() => { setIsMenuOpen(false); setIsContributionModalOpen(true); }}>
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Record Contribution</span>
                  </div>
                </DropdownItem>
                <DropdownItem onClick={() => { setIsMenuOpen(false); toggleHistory(); }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{showHistory ? 'Hide History' : 'View History'}</span>
                  </div>
                </DropdownItem>
                <div className="h-px bg-gray-50 dark:bg-gray-800 my-1" />
                <DropdownItem onClick={() => { setIsMenuOpen(false); onEdit?.(); }}>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Pencil className="w-4 h-4" />
                    <span>Edit Goal</span>
                  </div>
                </DropdownItem>
                <DropdownItem 
                  onClick={() => { setIsMenuOpen(false); onDelete?.(); }}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Goal</span>
                  </div>
                </DropdownItem>
             </Dropdown>
          </div>
        </div>

      </div>

      <div className="flex-grow mb-6">
        <h4 className="text-lg font-black text-gray-800 dark:text-white mb-4 line-clamp-1">{title}</h4>
        <div className="flex justify-between items-baseline mb-2">
           <span className="text-2xl font-black text-gray-900 dark:text-white">
             ₹{(current / 100000).toFixed(1)}L
           </span>
           <span className="text-xs font-bold text-gray-400">
             Target: ₹{(target / 100000).toFixed(1)}L
           </span>
        </div>
        
        <div className="h-3 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
           <div 
             className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
             style={{ width: `${percentage}%` }}
           />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
           {percentage}% Complete
         </div>
         <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
           ₹{(remaining / 100000).toFixed(1)}L to go
         </div>
      </div>

      {showHistory && (
        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 animate-in slide-in-from-top-2 duration-300">
           <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Contribution History</h5>
           {isLoadingHistory ? (
             <div className="space-y-2">
                {[1, 2].map(i => <div key={i} className="h-10 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />)}
             </div>
           ) : history.length > 0 ? (
             <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</span>
                        <span className="text-[10px] font-medium text-gray-400">{new Date(item.contribution_date).toLocaleDateString()}</span>
                     </div>
                     <Plus className="w-3 h-3 text-emerald-500" />
                  </div>
                ))}
             </div>
           ) : (
             <p className="text-[10px] text-gray-400 font-medium italic">No contributions recorded yet.</p>
           )}
        </div>
      )}

      <Modal isOpen={isContributionModalOpen} onClose={() => setIsContributionModalOpen(false)} className="max-w-md p-8">
        <div className="mb-6">
          <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1">Add Contribution</h3>
          <p className="text-xs text-gray-500 font-medium">Record a new payment towards your goal: <span className="text-emerald-600 font-bold">{title}</span></p>
        </div>
        <AddContributionForm 
          goalId={id || ""} 
          onSuccess={() => {
            setIsContributionModalOpen(false);
            fetchHistory();
            window.location.reload();
          }} 
          onCancel={() => setIsContributionModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};
