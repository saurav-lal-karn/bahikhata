"use client";
import React from "react";
import { MoreVertical, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface WalletCardProps {
  name: string;
  type: string;
  balance: number;
  currency?: string;
  accountNo: string;
  bank: string;
  icon: React.ReactNode;
  color: string;
  active?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ 
  name, 
  type, 
  balance, 
  currency = "INR",
  accountNo, 
  bank, 
  icon, 
  color,
  active,
  onEdit,
  onDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case "INR": return "₹";
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      default: return code;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${active ? 'ring-2 ring-amber-500/50' : ''}`}>
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`p-4 rounded-2xl ${color} transition-transform group-hover:scale-110 shadow-sm`}>
          {icon}
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors dropdown-toggle"
          >
             <MoreVertical className="w-5 h-5" />
          </button>
          
          <Dropdown isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} className="w-36">
            <DropdownItem onClick={() => { onEdit?.(); setIsMenuOpen(false); }}>
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-gray-500" />
                <span>Edit Wallet</span>
              </div>
            </DropdownItem>
            <DropdownItem 
              onClick={() => { onDelete?.(); setIsMenuOpen(false); }}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </div>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="relative z-10 mb-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{type}</p>
        <h4 className="text-lg font-black text-gray-800 dark:text-white mb-2">{name}</h4>
        <p className="text-[11px] font-bold text-gray-500 font-mono tracking-wider">{accountNo} • {bank}</p>
      </div>

      <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex items-end justify-between relative z-10">
         <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available Balance</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{getCurrencySymbol(currency)}{balance.toLocaleString()}</h3>
         </div>
         <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-amber-500 hover:text-white transition-all">
            <ExternalLink className="w-4 h-4" />
         </button>
      </div>

      {active && (
        <div className="absolute top-0 right-0 p-4">
           <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
        </div>
      )}
    </div>
  );
};
