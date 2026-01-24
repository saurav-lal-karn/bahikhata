"use client";
import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Wallet,
  Briefcase,
  TrendingUp,
  CreditCard,
  Building,
  Pencil,
  MoreVertical,
  X,
  ChevronDown
} from "lucide-react";

import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

import { Income } from "@/types";

interface IncomeListProps {
  incomes: Income[];
  isLoading: boolean;
}

export const IncomeList = ({ incomes, isLoading }: IncomeListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // Extract unique filter options
  const sources = Array.from(new Set(incomes.map(i => i.source?.name).filter(Boolean))) as string[];
  const wallets = Array.from(new Set(incomes.map(i => i.wallet?.name).filter(Boolean))) as string[];

  const filteredIncome = incomes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.source?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = !selectedSource || item.source?.name === selectedSource;
    const matchesWallet = !selectedWallet || item.wallet?.name === selectedWallet;
    
    return matchesSearch && matchesSource && matchesWallet;
  });

  const clearFilters = () => {
    setSelectedSource(null);
    setSelectedWallet(null);
    setSearchTerm("");
  };


  const getIconForSource = (sourceName: string) => {
    const name = sourceName.toLowerCase();
    if (name.includes('salary')) return <Briefcase className="w-5 h-5" />;
    if (name.includes('freelance')) return <Wallet className="w-5 h-5" />;
    if (name.includes('invest')) return <TrendingUp className="w-5 h-5" />;
    if (name.includes('rent')) return <Building className="w-5 h-5" />;
    return <CreditCard className="w-5 h-5" />;
  };

  const getIconBgForSource = (sourceName: string) => {
    const name = sourceName.toLowerCase();
    if (name.includes('salary')) return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    if (name.includes('freelance')) return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
    if (name.includes('invest')) return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
    if (name.includes('rent')) return "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
    return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/50 overflow-hidden shadow-sm p-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your earnings...</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/50 overflow-hidden shadow-sm">
      {/* Table Header / Actions */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
          Recent Earnings
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search earnings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${isFilterVisible ? 'bg-green-50 border-green-200 text-green-600 shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-700 hover:bg-gray-50'}`}
          >
            <Filter className={`w-4 h-4 ${isFilterVisible ? 'fill-green-600' : ''}`} /> Filters
            {(selectedSource || selectedWallet) && (
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
            )}
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {isFilterVisible && (
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-50 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Category</label>
              <div className="relative">
                <select 
                  value={selectedSource || ""}
                  onChange={(e) => setSelectedSource(e.target.value || null)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-green-500/20 transition-all font-bold"
                >
                  <option value="">All Sources</option>
                  {sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Received In</label>
              <div className="relative">
                <select 
                  value={selectedWallet || ""}
                  onChange={(e) => setSelectedWallet(e.target.value || null)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-green-500/20 transition-all font-bold"
                >
                  <option value="">All Wallets</option>
                  {wallets.map(wallet => (
                    <option key={wallet} value={wallet}>{wallet}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2 pb-0.5">
              <button 
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-50 dark:border-gray-800">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Source info</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Source</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Wallet</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Amount</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {filteredIncome.map((item) => (
              <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getIconBgForSource(item.source?.name || '')} shadow-sm group-hover:rotate-12 transition-transform`}>
                      {getIconForSource(item.source?.name || '')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white/90 leading-tight mb-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-green-600 dark:text-green-400">
                          Received
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                    {item.source?.name}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 italic">
                  {item.wallet?.name}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                  {new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(item.date))}
                </td>
                <td className="py-4 px-6 text-sm font-black text-right text-green-600 dark:text-green-400">
                  + ₹{item.amount.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === item.id ? null : item.id);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all dropdown-toggle"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    <Dropdown 
                      isOpen={activeMenu === item.id} 
                      onClose={() => setActiveMenu(null)} 
                      className="w-32"
                    >
                      <DropdownItem onClick={() => setActiveMenu(null)}>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Pencil className="w-4 h-4" />
                          <span>Edit</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => setActiveMenu(null)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </div>
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        {filteredIncome.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">No earnings found</h4>
            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-800 dark:text-white/90">{filteredIncome.length > 0 ? 1 : 0}</span> to <span className="font-bold text-gray-800 dark:text-white/90">{filteredIncome.length}</span> of <span className="font-bold text-gray-800 dark:text-white/90">{incomes.length}</span> entries
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-500 disabled:opacity-50 transition-all hover:bg-gray-50 dark:hover:bg-gray-800" disabled>Previous</button>
          <button className="px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-500 disabled:opacity-50 transition-all hover:bg-gray-50 dark:hover:bg-gray-800" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};
