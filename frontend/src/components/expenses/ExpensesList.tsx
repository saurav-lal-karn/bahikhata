"use client";
import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ShoppingCart,
  Pencil,
  MoreVertical,
  ChevronDown
} from "lucide-react";

import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

import { transactionService } from "@/services/transactionService";
import { organizationService } from "@/services/organizationService";
import { contactService } from "@/services/contactService";
import { Transaction } from "@/types";
import { Contact } from "@/types";
import { Project } from "@/types";
import { Location } from "@/types";

export const ExpensesList = ({ familyId, refreshKey }: { familyId: string; refreshKey?: number }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Extract unique filter options from data
  const categories = Array.from(new Set(expenses.map(e => e.category?.name).filter(Boolean))) as string[];
  const methods = Array.from(new Set(expenses.map(e => e.payment_method?.name).filter(Boolean))) as string[];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || expense.category?.name === selectedCategory;
    const matchesMethod = !selectedMethod || expense.payment_method?.name === selectedMethod;

    return matchesSearch && matchesCategory && matchesMethod;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedMethod(null);
    setSelectedContactId(null);
    setSelectedProjectId(null);
    setSelectedLocationId(null);
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchOptions = async () => {
      if (!familyId) return;
      try {
        const [c, p, loc] = await Promise.all([
          contactService.getContacts(familyId),
          organizationService.getProjects(familyId),
          organizationService.getLocations(familyId).catch(() => [])
        ]);
        setContacts(c);
        setProjects(p);
        setLocations(loc);
      } catch (e) {
        console.error("Failed to fetch filter options", e);
      }
    };
    fetchOptions();
  }, [familyId]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const params: Record<string, string | number | boolean | undefined> = { type: 'EXPENSE' };
        if (selectedContactId) params.contact_id = selectedContactId;
        if (selectedProjectId) params.project_id = selectedProjectId;
        if (selectedLocationId) params.location_id = selectedLocationId;
        const response = await transactionService.getTransactions(familyId, params);
        setExpenses(response.transactions);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      }
    };
    if (familyId && familyId !== "") {
      fetchExpenses();
    }
  }, [familyId, refreshKey, selectedContactId, selectedProjectId, selectedLocationId]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
      {/* Table Header / Actions */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
          All Expenses
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${isFilterVisible ? 'bg-purple-50 border-purple-200 text-purple-600 shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 hover:bg-gray-50'}`}
          >
            <Filter className={`w-4 h-4 ${isFilterVisible ? 'fill-purple-600' : ''}`} /> Filters
            {(selectedCategory || selectedMethod || selectedContactId || selectedProjectId || selectedLocationId) && (
              <span className="flex h-2 w-2 rounded-full bg-purple-500" />
            )}
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {isFilterVisible && (
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
              <div className="relative">
                <select 
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</label>
              <div className="relative">
                <select 
                  value={selectedMethod || ""}
                  onChange={(e) => setSelectedMethod(e.target.value || null)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold"
                >
                  <option value="">All Methods</option>
                  {methods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact / Vendor</label>
              <div className="relative">
                <select 
                  value={selectedContactId || ""}
                  onChange={(e) => setSelectedContactId(e.target.value || null)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold"
                >
                  <option value="">All Contacts</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project</label>
              <div className="relative">
                <select 
                  value={selectedProjectId || ""}
                  onChange={(e) => setSelectedProjectId(e.target.value || null)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold"
                >
                  <option value="">All Projects</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</label>
              <div className="relative">
                <select 
                  value={selectedLocationId || ""}
                  onChange={(e) => setSelectedLocationId(e.target.value || null)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold"
                >
                  <option value="">All Locations</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
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
            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Transaction</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Method</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Amount</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {/* <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${expense.iconBg} shadow-sm transform group-hover:scale-110 transition-transform`}>
                      {expense.icon}
                    </div> */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white/90 leading-tight mb-1">
                        {expense.name}
                      </h4>
                        {(expense.contact?.name || expense.project?.name || expense.location?.name) && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {expense.contact?.name && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                              {expense.contact.name}
                            </span>
                          )}
                          {expense.project?.name && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                              {expense.project.name}
                            </span>
                          )}
                          {expense.location?.name && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                              {expense.location.name}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    {expense.category?.name}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 italic">
                  {expense.payment_method?.name}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                  {expense.transaction_date}
                </td>
                <td className="py-4 px-6 text-sm font-black text-right text-gray-900 dark:text-white">
                  ₹{expense.amount.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (expense.id) {
                          setActiveMenu(activeMenu === expense.id ? null : expense.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all dropdown-toggle"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    <Dropdown 
                      isOpen={activeMenu === expense.id} 
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
        {filteredExpenses.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">No expenses found</h4>
            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-gray-800 dark:text-white/90">1</span> to <span className="font-bold text-gray-800 dark:text-white/90">{filteredExpenses.length}</span> of <span className="font-bold text-gray-800 dark:text-white/90">{expenses.length}</span> entries
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium disabled:opacity-50 transition-all hover:bg-gray-50 dark:hover:bg-gray-800" disabled>Previous</button>
          <button className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium disabled:opacity-50 transition-all hover:bg-gray-50 dark:hover:bg-gray-800" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};
