"use client";
import React from "react";
import { Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";


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
             
             <Dropdown isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} className="w-32 text-left">
                <DropdownItem onClick={() => { setIsMenuOpen(false); onEdit?.(); }}>
                  <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-gray-500" />
                    <span>Edit</span>
                  </div>
                </DropdownItem>
                <DropdownItem 
                  onClick={() => { setIsMenuOpen(false); onDelete?.(); }}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
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
    </div>
  );
};
