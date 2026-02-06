"use client";
import React, { useState } from "react";
import { 
  ShieldAlert,
  Plus,
  TrendingDown,
  Calculator,
  Info,
  Filter,
  Search,
  ChevronDown
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { LoanTracker } from "@/components/debts/LoanTracker";
import { CreditCardOverview } from "@/components/debts/CreditCardOverview";
import { PayoffCalculator } from "@/components/debts/PayoffCalculator";
import { AddLiabilityForm } from "@/components/debts/AddLiabilityForm";
import { useAuth } from "@/context/AuthContext";
import { debtService } from "@/services/debtService";
import { Debt } from "@/types";
import { LiabilityList } from "@/components/debts/LiabilityList";
import { DeleteConfirmationModal } from "@/components/ui/modal/DeleteConfirmationModal";
import toast from "react-hot-toast";

export default function DebtsPageClient() {
  const { user } = useAuth();
  const familyDetails = user?.family;
  const [activeTab, setActiveTab] = useState<"overview" | "strategy">("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedLender, setSelectedLender] = useState<string | null>(null);

  // Edit/Delete State
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique lenders
  const uniqueLenders = Array.from(new Set(debts.map(d => d.lender).filter(Boolean))) as string[];

  const fetchDebts = async () => {
     if(familyDetails?.id) {
         try {
             setIsLoading(true);
             const data = await debtService.getAll(familyDetails.id);
             setDebts(data || []); // Ensure array
         } catch(e) {
             console.error(e);
         } finally {
             setIsLoading(false);
         }
     }
  };

  React.useEffect(() => {
      fetchDebts();
  }, [familyDetails?.id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
      setIsModalOpen(false);
      setEditingDebt(null);
      fetchDebts(); // Refresh
  };

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt);
    setIsModalOpen(true);
  };

  const handleDeleteDebt = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await debtService.delete(deletingId);
      setDebts(prev => prev.filter(d => d.id !== deletingId));
      toast.success("Liability deleted successfully");
      setDeletingId(null);
    } catch (error) {
       console.error(error);
       toast.error("Failed to delete liability");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Liabilities & Debts
          </h1>
          <p className="text-gray-500 font-medium italic">
            Monitor loans, manage credit cards, and plan your way to a debt-free life.
          </p>
        </div>
        <button 
          onClick={openModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
        >
          <Plus className="w-5 h-5" /> Add New Liability
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-white/[0.03] rounded-2xl w-fit border border-gray-50 dark:border-gray-800/50">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === "overview" 
              ? "bg-white dark:bg-gray-900 text-red-600 shadow-sm ring-1 ring-black/5" 
              : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Debt Overview
        </button>
        <button
          onClick={() => setActiveTab("strategy")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === "strategy" 
              ? "bg-white dark:bg-gray-900 text-red-600 shadow-sm ring-1 ring-black/5" 
              : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <Calculator className="w-4 h-4" /> Payoff Strategy
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content (8/12) */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          {activeTab === "overview" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shadow-sm">
                  <div className="relative flex-1 w-full">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input 
                       type="text"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       placeholder="Search liabilities..."
                       className="w-full pl-12 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                     />
                  </div>
                  <button 
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={`flex items-center gap-2 px-6 py-2 border rounded-2xl text-sm font-bold transition-all ${isFilterVisible ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500'}`}
                  >
                    <Filter className="w-4 h-4" /> Filters
                  </button>
               </div>

               {isFilterVisible && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Lender</label>
                           <div className="relative">
                              <select 
                                value={selectedLender || ""}
                                onChange={(e) => setSelectedLender(e.target.value || null)}
                                className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-red-500/20 transition-all"
                              >
                                 <option value="">All Lenders</option>
                                 {uniqueLenders.map(lender => (
                                   <option key={lender} value={lender}>{lender}</option>
                                 ))}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                           </div>
                        </div>
                        <div className="flex items-end">
                           <button 
                             onClick={() => { setSearchTerm(""); setSelectedLender(null); }}
                             className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                           >
                              Reset Filters
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               <LiabilityList 
                 debts={debts.filter(d => {
                   const matchesSearch = d.lender.toLowerCase().includes(searchTerm.toLowerCase());
                   const matchesLender = !selectedLender || d.lender === selectedLender;
                   return matchesSearch && matchesLender;
                 })} 
                 isLoading={isLoading} 
                 onEdit={handleEditDebt}
                 onDelete={handleDeleteDebt}
               />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <PayoffCalculator />
            </div>
          )}
        </div>

        {/* Sidebar Insights (4/12) */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-red-700 to-rose-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-24 h-24" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Liability Ratio</p>
              <h3 className="text-2xl font-black mb-4">Moderate Risk</h3>
              <div className="h-2 w-full bg-white/20 rounded-full mb-2 overflow-hidden">
                 <div className="h-full bg-rose-400 w-[42%] rounded-full" />
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-90">
                Your debt-to-income ratio is 42%. Reducing this to below 35% will significantly improve your loan eligibility.
              </p>
           </div>

           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h4 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider mb-4">Upcoming Dues</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                       <span className="text-xs font-bold text-gray-700 dark:text-gray-300">HDFC Home EMI</span>
                    </div>
                    <span className="text-xs font-black text-gray-900 dark:text-white">Jan 15</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                       <span className="text-xs font-bold text-gray-700 dark:text-gray-300">SBI Credit Card</span>
                    </div>
                    <span className="text-xs font-black text-gray-900 dark:text-white">Jan 18</span>
                 </div>
              </div>
           </div>

           <div className="flex items-start gap-2 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Paying off small debts first ("Snowball Method") can help build psychological momentum. Check the Strategy tab!
              </p>
           </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-4xl p-10">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-[2rem] mx-auto flex items-center justify-center border-2 border-red-100 dark:border-red-800 mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">{editingDebt ? 'Edit Liability' : 'Record a Liability'}</h3>
          <p className="text-sm text-gray-500 font-medium">{editingDebt ? 'Update the details of your liability.' : 'Link a loan or credit card to track your repayment journey.'}</p>
        </div>
        <AddLiabilityForm 
          onSuccess={closeModal} 
          onCancel={closeModal} 
          familyId={familyDetails?.id}
          initialData={editingDebt} 
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete Liability"
        description="Are you sure you want to delete this liability? All related repayments and schedules will also be removed."
        isDeleting={isDeleting}
      />
    </div>
  );
}
