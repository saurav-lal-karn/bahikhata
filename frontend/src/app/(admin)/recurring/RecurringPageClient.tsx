"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  Repeat, 
  Plus, 
  Search,
  Zap,
  CheckCircle2,
  Clock,
  Filter,
  ChevronDown,
  AlertCircle
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { SubscriptionManager } from "@/components/recurring/SubscriptionManager";
import { UpcomingBillReminders } from "@/components/recurring/UpcomingBillReminders";
import { AddRecurringForm } from "@/components/recurring/AddRecurringForm";
import { useAuth } from "@/context/AuthContext";
import { recurringService } from "@/services/recurringService";
import { RecurringTransaction } from "@/types";

export default function RecurringPageClient() {
  const { user } = useAuth();
  const familyDetails = user?.family;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique transaction types
  const transactionTypes = Array.from(new Set(transactions.map(t => t.type).filter(Boolean))) as string[];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || t.type === selectedType;
    return matchesSearch && matchesType;
  });


  const fetchTransactions = async () => {
    if (familyDetails?.id) {
        try {
            setIsLoading(true);
            const data = await recurringService.getAll(familyDetails.id);
            setTransactions(data || []);
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [familyDetails?.id]);

  const openModal = () => {
      setEditingTransaction(null);
      setIsModalOpen(true);
  };
  
  const closeModal = () => {
      setIsModalOpen(false);
      setEditingTransaction(null);
      fetchTransactions();
  };

  const handleEdit = (transaction: RecurringTransaction) => {
      setEditingTransaction(transaction);
      setIsModalOpen(true);
  };

  const handleDeleteInitiate = (id: string) => {
      setDeletingId(id);
  };

  const handleDeleteConfirm = async () => {
      if (!deletingId) return;
      try {
          await recurringService.delete(deletingId);
          toast.success("Recurring transaction deleted");
          setDeletingId(null);
          fetchTransactions();
      } catch (e) {
          console.error(e);
          toast.error("Failed to delete recurring transaction");
      }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Recurring Bills & Automation
          </h1>
          <p className="text-gray-500 font-medium italic">
            Never miss a payment with automated tracking and early warning alerts.
          </p>
        </div>
        <button 
          onClick={openModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" /> Add Recurring Bill
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Active Subscriptions & Bills (8/12) */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
           <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 rounded-2xl">
                 <Repeat className="w-6 h-6" />
               </div>
                <div>
                   <h3 className="text-xl font-black text-gray-800 dark:text-white">Active Subscriptions</h3>
                   <p className="text-xs text-gray-500 font-medium">Tracking {filteredTransactions.length} digital services</p>
                </div>

             </div>
              <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none w-32 md:w-48"
                    />
                 </div>
                 <button 
                   onClick={() => setIsFilterVisible(!isFilterVisible)}
                   className={`p-2 rounded-xl transition-all border ${isFilterVisible ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-400'}`}
                 >
                   <Filter className="w-4 h-4" />
                 </button>
              </div>
           </div>

           {/* Filter Bar */}
           {isFilterVisible && (
             <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm animate-in slide-in-from-top-4 duration-300">
                <div className="flex flex-wrap items-end gap-4">
                   <div className="space-y-2 min-w-[200px]">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Filter by Type</label>
                      <div className="relative">
                         <select 
                           value={selectedType || ""}
                           onChange={(e) => setSelectedType(e.target.value || null)}
                           className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-xl text-xs font-bold appearance-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                         >
                            <option value="">All Categories</option>
                            {transactionTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      </div>
                   </div>
                   <button 
                     onClick={() => { setSearchTerm(""); setSelectedType(null); }}
                     className="px-6 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >
                     Clear
                   </button>
                </div>
             </div>
           )}

           <SubscriptionManager 
             transactions={filteredTransactions} 
             isLoading={isLoading} 
             onEdit={(t) => handleEdit(t as RecurringTransaction)}
             onDelete={handleDeleteInitiate}
           />

        </div>

        {/* Right: Alerts & Calendar (4/12) */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
           <UpcomingBillReminders transactions={transactions} isLoading={isLoading} />
           
           <div className="bg-gradient-to-br from-blue-800 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <Zap className="w-24 h-24" />
              </div>
              <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                 <Zap className="w-5 h-5 text-amber-400" /> Smart Savings
              </h4>
              <p className="text-xs font-medium leading-relaxed opacity-80 mb-6">
                You have 3 unused subscriptions costing you ₹850/month. Cancelling these could save you ₹10,200 annually.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                 Identify Waste
              </button>
           </div>

           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Automation Status</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Auto-payment for Rent Enabled</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Clock className="w-5 h-5 text-amber-500" />
                   <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Pending OTP for Netflix (Jan 15)</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-4xl p-10">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] mx-auto flex items-center justify-center border-2 border-blue-100 dark:border-blue-800 mb-4">
            <Repeat className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">{editingTransaction ? 'Edit Recurring Bill' : 'Automate Recurring Bill'}</h3>
          <p className="text-sm text-gray-500 font-medium">{editingTransaction ? 'Update your tracking preferences.' : 'Set up a tracking cycle for subscriptions, rent, or utilities.'}</p>
        </div>
        <AddRecurringForm 
            onSuccess={closeModal} 
            onCancel={closeModal} 
            familyId={familyDetails?.id} 
            initialData={editingTransaction}
        />
      </Modal>

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} className="max-w-md p-8">
         <div className="text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl mx-auto flex items-center justify-center mb-4">
               <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Delete Recurring Bill?</h3>
            <p className="text-xs text-gray-500 font-medium mb-8">
               This will stop tracking future payments. Past execution history will be preserved. This action cannot be undone.
            </p>
            <div className="flex gap-4">
               <button 
                 onClick={() => setDeletingId(null)}
                 className="flex-1 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs transition-all"
               >
                  Cancel
               </button>
               <button 
                 onClick={handleDeleteConfirm}
                 className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-red-500/20"
               >
                  Delete
               </button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
