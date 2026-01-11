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
  Building
} from "lucide-react";

const initialIncome = [
  {
    id: "1",
    name: "Monthly Salary - TechCorp",
    source: "Salary",
    amount: 75000.00,
    type: "Regular",
    date: "01 May 2026",
    status: "Received",
    icon: <Briefcase className="w-5 h-5" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
  },
  {
    id: "2",
    name: "Freelance Project - Web Design",
    source: "Freelancing",
    amount: 15000.00,
    type: "One-time",
    date: "12 May 2026",
    status: "Received",
    icon: <Wallet className="w-5 h-5" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
  },
  {
    id: "3",
    name: "Stock Dividends",
    source: "Investments",
    amount: 2400.00,
    type: "Investment",
    date: "15 May 2026",
    status: "Received",
    icon: <TrendingUp className="w-5 h-5" />,
    iconBg: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
  },
  {
    id: "4",
    name: "Rental Income",
    source: "Property",
    amount: 12000.00,
    type: "Regular",
    date: "05 May 2026",
    status: "Expected",
    icon: <Building className="w-5 h-5" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
  }
];

export const IncomeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [income] = useState(initialIncome);

  const filteredIncome = income.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-50 dark:border-gray-800">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Source info</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Source</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Format</th>
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
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.iconBg} shadow-sm group-hover:rotate-12 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white/90 leading-tight mb-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Expected' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                        <p className={`text-[10px] font-medium uppercase tracking-wider ${item.status === 'Expected' ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                    {item.source}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 italic">
                  {item.type}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                  {item.date}
                </td>
                <td className="py-4 px-6 text-sm font-black text-right text-green-600 dark:text-green-400">
                  + ₹{item.amount.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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
          Showing <span className="font-bold text-gray-800 dark:text-white/90">1</span> to <span className="font-bold text-gray-800 dark:text-white/90">{filteredIncome.length}</span> of <span className="font-bold text-gray-800 dark:text-white/90">{income.length}</span> entries
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-500 disabled:opacity-50 transition-all hover:bg-gray-50 dark:hover:bg-gray-800" disabled>Previous</button>
          <button className="px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-500 disabled:opacity-50 transition-all hover:bg-gray-50 dark:hover:bg-gray-800" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};
