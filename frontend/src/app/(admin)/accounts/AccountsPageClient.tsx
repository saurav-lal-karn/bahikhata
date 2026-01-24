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
  Wallet,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import { WalletCard } from "@/components/accounts/WalletCard";
import { InternalTransferForm } from "@/components/accounts/InternalTransferForm";
import { AddAccountForm } from "@/components/accounts/AddAccountForm";
import { WalletInfoType, WalletType, WalletTransfer } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {walletTypeService} from "@/services/walletTypeService";
import {walletService} from "@/services/walletService";

export default function AccountsPageClient() {
    const {user} = useAuth();
    const familyDetails = user?.family;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const [walletTypes, setWalletTypes] = useState<WalletType[]>([]);
    const [wallets, setWallets] = useState<WalletInfoType[]>([]);
    const [transfers, setTransfers] = useState<WalletTransfer[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [walletToDelete, setWalletToDelete] = useState<WalletInfoType | null>(null);


    const fetchData = async () => {
        if (!familyDetails?.id) return;

        try {
            const [typesRes, walletsRes, transfersRes] = await Promise.all([
                walletTypeService.getWalletTypes(familyDetails.id),
                walletService.getWallets(familyDetails.id),
                walletService.getWalletTransfers(familyDetails.id)
            ]);

            setWalletTypes(typesRes);
            setWallets(walletsRes);
            setTransfers(transfersRes);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [familyDetails]);

    const handleTransferSuccess = () => {
        setIsTransferModalOpen(false);
        fetchData();
    };

    const handleDelete = async () => {
        if (!walletToDelete) return;
        try {
            await walletService.deleteWallet(walletToDelete.id);
            toast.success("Wallet deleted successfully");
            setIsDeleteModalOpen(false);
            setWalletToDelete(null);
            fetchData();
        } catch (error) {
            console.error('Failed to delete wallet:', error);
            toast.error("Failed to delete wallet");
        }
    };


    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Calculate total liquid value
    const totalLiquidValue = wallets.reduce((acc, w) => acc + (w.balance + (w.starting_balance || 0)), 0);
    const baseCurrency = wallets[0]?.currency || "₹";

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
              {wallets.length > 0 ? (
                wallets.map((wallet, index) => {
                  const getWalletIcon = (typeName: string) => {
                    switch (typeName) {
                      case "Bank Account": return <Building2 className="w-6 h-6" />;
                      case "Physical Wallet": return <Banknote className="w-6 h-6" />;
                      case "Digital Wallet": return <CreditCard className="w-6 h-6" />;
                      default: return <Wallet className="w-6 h-6" />;
                    }
                  };

                  const getWalletColor = (typeName: string) => {
                    switch (typeName) {
                      case "Bank Account": return "bg-blue-50 text-blue-600";
                      case "Physical Wallet": return "bg-amber-50 text-amber-600";
                      case "Digital Wallet": return "bg-purple-50 text-purple-600";
                      default: return "bg-emerald-50 text-emerald-600";
                    }
                  };

                  return (
                    <WalletCard 
                      key={wallet.id}
                      id={wallet.id}
                      name={wallet.name}
                      type={wallet.wallet_type?.name || "Other"}
                      balance={wallet.balance + (wallet.starting_balance || 0)}
                      currency={wallet.currency}
                      accountNo={wallet.wallet_type?.name || "N/A"}
                      bank={wallet.wallet_issuer_name || "N/A"}
                      icon={getWalletIcon(wallet.wallet_type?.name || "")}
                      color={getWalletColor(wallet.wallet_type?.name || "")}
                      active={index === 0}
                      onDelete={() => {
                        setWalletToDelete(wallet);
                        setIsDeleteModalOpen(true);
                      }}
                    />

                  );
                })
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                    <Wallet className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">No accounts found</h3>
                  <p className="text-sm text-gray-500 text-center max-w-xs mt-2">
                    Start tracking your assets by linking your first bank account or wallet.
                  </p>
                </div>
              )}
           </div>
        </div>

        {/* Right: Transfer History & Stats (4/12) */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                 Recent Transfers <History className="w-3.5 h-3.5" />
              </h4>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                 {transfers.length > 0 ? (
                   transfers.map((transfer) => (
                      <div key={transfer.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-all cursor-pointer group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/20 transition-all">
                               <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-600" />
                            </div>
                            <div>
                               <p className="text-xs font-black text-gray-800 dark:text-white line-clamp-1">To {transfer.to_wallet?.name}</p>
                               <p className="text-[9px] font-medium text-gray-400">{formatDate(transfer.date)} • Internal</p>
                            </div>
                         </div>
                         <span className="text-xs font-black text-gray-900 dark:text-white">
                           {transfer.to_wallet?.currency} {transfer.amount.toLocaleString()}
                         </span>
                      </div>
                   ))
                 ) : (
                   <p className="text-xs text-center py-4 text-gray-400 italic">No recent transfers.</p>
                 )}
              </div>
           </div>

           <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <Building2 className="w-24 h-24" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Total Liquid Value</p>
              <h3 className="text-3xl font-black mb-4">{baseCurrency} {(totalLiquidValue / 100000).toFixed(2)} Lakhs</h3>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-100">
                 <TrendingUp className="w-4 h-4" /> Calculated dynamically
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
         <InternalTransferForm 
            onSuccess={handleTransferSuccess} 
            onCancel={() => setIsTransferModalOpen(false)} 
            wallets={wallets} 
            familyId={familyDetails?.id || ""} 
         />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-md p-8 text-center">
         <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full mx-auto flex items-center justify-center mb-6">
            <Trash2 className="w-8 h-8 text-red-600" />
         </div>
         <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Delete this wallet?</h3>
         <p className="text-sm text-gray-500 mb-8">
            Are you sure you want to delete <strong>{walletToDelete?.name}</strong>? This action cannot be undone and will remove all associated transaction history.
         </p>
         <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              className="px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
            >
              Confirm Delete
            </button>
         </div>
      </Modal>
    </div>

  );
}
