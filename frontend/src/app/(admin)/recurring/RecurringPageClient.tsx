"use client";
import React, { useState } from "react";
import { 
  Repeat, 
  Plus, 
  Search,
  Zap,
  CheckCircle2,
  Clock,
  Filter
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

  React.useEffect(() => {
    fetchTransactions();
  }, [familyDetails?.id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
      setIsModalOpen(false);
      fetchTransactions();
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
                  <p className="text-xs text-gray-500 font-medium">Tracking {transactions.length} digital services</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Search..." 
                     className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none w-32 md:w-48"
                   />
                </div>
                <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Filter className="w-4 h-4 text-gray-400" />
                </button>
             </div>
           </div>

           <SubscriptionManager transactions={transactions} isLoading={isLoading} />
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
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Automate Recurring Bill</h3>
          <p className="text-sm text-gray-500 font-medium">Set up a tracking cycle for subscriptions, rent, or utilities.</p>
        </div>
        <AddRecurringForm onSuccess={closeModal} onCancel={closeModal} familyId={familyDetails?.id} />
      </Modal>
    </div>
  );
}
