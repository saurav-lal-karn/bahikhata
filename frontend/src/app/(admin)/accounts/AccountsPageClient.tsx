"use client";
import React, { useEffect, useState } from "react";
import { 
  Plus, 
  ArrowLeftRight, 
  Banknote, 
  CreditCard,
  Building2,
  TrendingUp,
  History,
  Info,
  Wallet
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { WalletCard } from "@/components/accounts/WalletCard";
import { InternalTransferForm } from "@/components/accounts/InternalTransferForm";
import { AddAccountForm } from "@/components/accounts/AddAccountForm";
import { WalletType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {walletTypeService} from "@/services/walletTypeService";

export default function AccountsPageClient() {
    const {user} = useAuth();
    const familyDetails = user?.family;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const [walletTypes, setWalletTypes] = useState<WalletType[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
        if (!familyDetails?.id) return;

        try {
            const response = await walletTypeService.getWalletTypes(familyDetails.id);
            if (isMounted) {
            setWalletTypes(response);
            }
        } catch (error) {
            if (isMounted) {
            console.error('Failed to fetch wallet types:', error);
            }
        }
        };

        fetchData();

        return () => {
        isMounted = false;
        };
    }, [familyDetails]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Accounts & Wallets
          </h1>
          <p className="text-gray-500 font-medium italic">
            Manage your bank accounts, digital wallets, and internal movements.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsTransferModalOpen(true)}
             className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-sm"
           >
             <ArrowLeftRight className="w-5 h-5" /> Transfer
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
           >
             <Plus className="w-5 h-5" /> Add Account
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Wallets List (8/12) */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WalletCard 
                name="Saurav - HDFC Savings"
                type="Bank Account"
                balance={425000}
                accountNo="**** 9821"
                bank="HDFC Bank"
                icon={<Building2 className="w-6 h-6" />}
                color="bg-blue-50 text-blue-600"
                active
              />
              <WalletCard 
                name="Family - SBI Joint"
                type="Bank Account"
                balance={1250000}
                accountNo="**** 4432"
                bank="SBI Bank"
                icon={<Building2 className="w-6 h-6" />}
                color="bg-emerald-50 text-emerald-600"
              />
              <WalletCard 
                name="Personal Cash"
                type="Physical Wallet"
                balance={12500}
                accountNo="Petty Cash"
                bank="Liquid Assets"
                icon={<Banknote className="w-6 h-6" />}
                color="bg-amber-50 text-amber-600"
              />
              <WalletCard 
                name="PhonePe / Digital"
                type="Digital Wallet"
                balance={5400}
                accountNo="88XXXXXX11"
                bank="Digital"
                icon={<CreditCard className="w-6 h-6" />}
                color="bg-purple-50 text-purple-600"
              />
           </div>
        </div>

        {/* Right: Transfer History & Stats (4/12) */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                 Recent Transfers <History className="w-3.5 h-3.5" />
              </h4>
              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-all cursor-pointer group">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/20 transition-all">
                             <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-600" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-gray-800 dark:text-white">To SBI Joint</p>
                             <p className="text-[9px] font-medium text-gray-400">Jan 10 • Internal</p>
                          </div>
                       </div>
                       <span className="text-xs font-black text-gray-900 dark:text-white">₹50,000</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <Building2 className="w-24 h-24" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Total Liquid Value</p>
              <h3 className="text-3xl font-black mb-4">₹16.92 Lakhs</h3>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-100">
                 <TrendingUp className="w-4 h-4" /> +2.4% from last month
              </div>
           </div>

           <div className="flex items-start gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/50">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Internal transfers between your own accounts do not affect your expense budget.
              </p>
           </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl p-10">
         <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] mx-auto flex items-center justify-center border-2 border-amber-100 dark:border-amber-800 mb-4">
               <Wallet className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Link New Account</h3>
            <p className="text-sm text-gray-500 font-medium">Add a bank account or liquid asset to your dashboard.</p>
         </div>
         <AddAccountForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} familyId={familyDetails?.id || ""} walletTypes={walletTypes} />
      </Modal>

      <Modal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} className="max-w-2xl p-10">
         <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-6">Internal Transfer</h3>
         <InternalTransferForm onSuccess={() => setIsTransferModalOpen(false)} onCancel={() => setIsTransferModalOpen(false)} />
      </Modal>
    </div>
  );
}
