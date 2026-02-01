"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Wallet, 
  Building2, 
  CreditCard, 
  Banknote, 
  Pencil, 
  Trash2, 
  Calendar,
  Info
} from "lucide-react";
import { WalletInfoType, WalletType } from "@/types";
import { walletService } from "@/services/walletService";
import { walletTypeService } from "@/services/walletTypeService";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui/modal";
import { AddAccountForm } from "@/components/accounts/AddAccountForm";
import { WalletStatement } from "@/components/accounts/WalletStatement";
import toast from "react-hot-toast";

interface WalletDetailsClientProps {
  walletId: string;
}

export default function WalletDetailsClient({ walletId }: WalletDetailsClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletInfoType | null>(null);
  const [walletTypes, setWalletTypes] = useState<WalletType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchWalletDetails = async () => {
    try {
      setLoading(true);
      const data = await walletService.getWallet(walletId);
      setWallet(data);
    } catch (error) {
      console.error("Failed to fetch wallet details:", error);
      toast.error("Failed to load wallet details");
      router.push("/accounts");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletTypes = async () => {
    if (user?.family?.id) {
       try {
           const types = await walletTypeService.getWalletTypes(user.family.id);
           setWalletTypes(types);
       } catch (error) {
           console.error("Failed to fetch wallet types", error);
       }
    }
  };

  useEffect(() => {
    fetchWalletDetails();
    fetchWalletTypes();
  }, [walletId, user?.family?.id]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    fetchWalletDetails();
  };

  const handleDelete = async () => {
    try {
      await walletService.deleteWallet(walletId);
      toast.success("Wallet deleted successfully");
      router.push("/accounts");
    } catch (error) {
      console.error("Failed to delete wallet:", error);
      toast.error("Failed to delete wallet");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!wallet) return null;

  const getWalletIcon = (typeName: string) => {
    switch (typeName) {
      case "Bank Account": return <Building2 className="w-12 h-12" />;
      case "Physical Wallet": return <Banknote className="w-12 h-12" />;
      case "Digital Wallet": return <CreditCard className="w-12 h-12" />;
      default: return <Wallet className="w-12 h-12" />;
    }
  };

  const currencySymbol = (code: string) => {
      switch (code) {
        case "INR": return "₹";
        case "USD": return "$";
        case "EUR": return "€";
        case "GBP": return "£";
        default: return code;
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header / Nav */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Wallet Details</h1>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           {getWalletIcon(wallet.wallet_type?.name || "")}
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-[2rem] bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm">
                      {getWalletIcon(wallet.wallet_type?.name || "")}
                  </div>
                  <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{wallet.wallet_type?.name}</p>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white capitalize leading-tight">{wallet.name}</h2>
                  </div>
               </div>

               <div className="space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Current Balance</p>
                  <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    {currencySymbol(wallet.currency)}{wallet.balance.toLocaleString()}
                  </h3>
               </div>

               <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl font-bold text-gray-700 dark:text-gray-300 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-2xl font-bold text-red-600 dark:text-red-400 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
               </div>
            </div>

            <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-8 rounded-[2rem]">
               <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-500" /> Account Info
               </h4>
               
               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                      {wallet.description || "No description provided."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank / Issuer</label>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{wallet.wallet_issuer_name || "N/A"}</p>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account / ID</label>
                        <p className="text-sm font-mono font-medium text-gray-600 dark:text-gray-300 mt-1">{wallet.provider_wallet_id || "N/A"}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starting Balance</label>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                           {currencySymbol(wallet.currency)}{wallet.starting_balance.toLocaleString()}
                        </p>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Created</label>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                           <Calendar className="w-3.5 h-3.5" />
                           {new Date(wallet.created_at).toLocaleDateString()}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      </div>

      {/* Wallet Statement */}
      <WalletStatement walletId={walletId} familyId={user?.family?.id || ""} />

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-2xl p-10">
         <div className="mb-10 text-center">
             <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] mx-auto flex items-center justify-center border-2 border-amber-100 dark:border-amber-800 mb-4">
                <Pencil className="w-8 h-8 text-amber-600" />
             </div>
             <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Edit Wallet</h3>
             <p className="text-sm text-gray-500 font-medium">Update account details.</p>
         </div>
         <AddAccountForm 
           familyId={user?.family?.id || ""} 
           walletTypes={walletTypes} 
           initialData={wallet}
           onSuccess={handleEditSuccess}
           onCancel={() => setIsEditModalOpen(false)}
         />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-md p-8 text-center">
         <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full mx-auto flex items-center justify-center mb-6">
            <Trash2 className="w-8 h-8 text-red-600" />
         </div>
         <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Delete this wallet?</h3>
         <p className="text-sm text-gray-500 mb-8">
            Are you sure you want to delete <strong>{wallet.name}</strong>? This action cannot be undone and will remove all associated transaction history.
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
