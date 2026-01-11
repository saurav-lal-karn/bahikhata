"use client";
import React, { useState } from "react";
import { 
  ScrollText, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Download,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { TaxSavingTracker } from "@/components/tax/TaxSavingTracker";
import { DocumentVault } from "@/components/tax/DocumentVault";
import { AddDocumentForm } from "@/components/tax/AddDocumentForm";

export default function TaxPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Tax & Compliance
          </h1>
          <p className="text-gray-500 font-medium italic">
            Optimize your tax savings and keep your financial documents organized.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-sm"
           >
             <Download className="w-5 h-5" /> Export Tax Report
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
           >
             <Plus className="w-5 h-5" /> Add Document
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Tax Saving Tracking (8/12) */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
           <TaxSavingTracker />
           <DocumentVault />
        </div>

        {/* Right: Regional Insights (4/12) */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm overflow-hidden relative group">
              <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 rounded-2xl w-fit mb-4">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-gray-800 dark:text-white mb-2">Section 80C Summary</h4>
              <p className="text-xs text-gray-500 font-medium mb-6">You have utilized ₹1.2L of your ₹1.5L limit.</p>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Utilization</span>
                    <span className="text-blue-600">80%</span>
                 </div>
                 <div className="h-2 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[80%] rounded-full shadow-lg shadow-blue-500/10" />
                 </div>
              </div>

              <button className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                 View Tax Calculator <ArrowUpRight className="w-3 h-3" />
              </button>
           </div>

           <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ScrollText className="w-24 h-24" />
              </div>
              <h4 className="text-xl font-black mb-4">India Tax Filing 2026</h4>
              <p className="text-xs font-medium opacity-80 leading-relaxed mb-6">
                The deadline for filing your ITR for the current financial year is July 31, 2026. Keep your Form 16 ready!
              </p>
              <div className="p-4 bg-white/10 rounded-2xl flex items-center gap-3">
                 <Info className="w-5 h-5 text-amber-300 shrink-0" />
                 <p className="text-[10px] font-bold">New Tax Regime is now the default. Review your savings accordingly.</p>
              </div>
           </div>

           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Compliance Checklist</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-white" />
                   </div>
                   <span className="text-xs font-bold text-gray-700 dark:text-gray-300">PF Contribution Linked</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                   </div>
                   <span className="text-xs font-bold text-gray-500">Aadhaar-PAN Linked</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl p-10">
         <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] mx-auto flex items-center justify-center border-2 border-blue-100 dark:border-blue-800 mb-4">
               <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Vault Secure Upload</h3>
            <p className="text-sm text-gray-500 font-medium">Add financial records to your encrypted storage.</p>
         </div>
         <AddDocumentForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
