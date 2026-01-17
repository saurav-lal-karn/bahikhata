import React, { useState } from "react";
import { ArrowLeftRight, Check, Building2, Banknote, CreditCard, Wallet as WalletIcon } from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { WalletInfoType } from "@/types";
import { toast } from "react-hot-toast";
import { walletService } from "@/services/walletService";

interface InternalTransferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  wallets: WalletInfoType[];
  familyId: string;
}

export const InternalTransferForm: React.FC<InternalTransferFormProps> = ({ onSuccess, onCancel, wallets, familyId }) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    remarks: ""
  });

  const getWalletById = (id: string) => wallets.find(w => w.id === id);

  const selectedFrom = getWalletById(formData.from);
  const selectedTo = getWalletById(formData.to);

  const availableBalance = selectedFrom ? (selectedFrom.balance + (selectedFrom.starting_balance || 0)) : 0;
  const isAmountInvalid = formData.amount !== "" && Number(formData.amount) > availableBalance;

  const getWalletIcon = (typeName?: string) => {
    switch (typeName) {
      case "Bank Account": return <Building2 className="w-8 h-8" />;
      case "Physical Wallet": return <Banknote className="w-8 h-8" />;
      case "Digital Wallet": return <CreditCard className="w-8 h-8" />;
      default: return <WalletIcon className="w-8 h-8" />;
    }
  };

  const getWalletColor = (typeName?: string) => {
    switch (typeName) {
      case "Bank Account": return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800";
      case "Physical Wallet": return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800";
      case "Digital Wallet": return "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800";
      default: return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800";
    }
  };

  const walletOptions = wallets.map(w => ({
    value: w.id,
    label: `${w.name} (${w.currency} ${(w.balance + (w.starting_balance || 0)).toLocaleString()})`
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAmountInvalid) return;
    
    try {
      await walletService.createWalletTransfer({
        from_wallet_id: formData.from,
        to_wallet_id: formData.to,
        amount: Number(formData.amount),
        date: formData.date,
        remarks: formData.remarks,
        family_id: familyId
      });
      toast.success("Transfer completed successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error("Failed to complete transfer. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-6 justify-center mb-10">
         <div className="text-center space-y-3 flex-1 max-w-[200px]">
            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border-2 transition-all duration-300 ${formData.from ? getWalletColor(selectedFrom?.wallet_type?.name) : 'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}>
               {getWalletIcon(selectedFrom?.wallet_type?.name)}
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase text-gray-400">From Account</p>
               <Select 
                 options={walletOptions}
                 placeholder="Select Source"
                 value={formData.from}
                 onChange={(val) => setFormData({...formData, from: val})}
                 className="rounded-xl h-10 text-xs"
               />
            </div>
         </div>
         
         <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mt-4">
            <ArrowLeftRight className="w-6 h-6 text-gray-400" />
         </div>

         <div className="text-center space-y-3 flex-1 max-w-[200px]">
            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border-2 transition-all duration-300 ${formData.to ? getWalletColor(selectedTo?.wallet_type?.name) : 'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}>
               {getWalletIcon(selectedTo?.wallet_type?.name)}
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase text-gray-400">To Account</p>
               <Select 
                 options={walletOptions.filter(opt => opt.value !== formData.from)}
                 placeholder="Select Target"
                 value={formData.to}
                 onChange={(val) => setFormData({...formData, to: val})}
                 className="rounded-xl h-10 text-xs"
               />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Amount</Label>
                {formData.from && (
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isAmountInvalid ? 'text-red-500' : 'text-gray-400'}`}>
                    Max: {selectedFrom?.currency} {availableBalance.toLocaleString()}
                  </span>
                )}
              </div>
              <Input 
                required
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
                className={`rounded-2xl h-14 font-black text-xl transition-all ${isAmountInvalid ? 'border-red-500 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              />
              {isAmountInvalid && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider animate-in fade-in duration-300">
                  Insufficient funds in source account
                </p>
              )}
            </div>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Date</Label>
              <Input 
                type="date"
                required
                value={formData.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})}
                className="rounded-2xl h-14"
              />
            </div>
         </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Remarks</Label>
        <Input 
          placeholder="e.g. Cash withdrawal for home expenses"
          value={formData.remarks}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, remarks: e.target.value})}
          className="rounded-2xl h-14"
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-50 dark:border-gray-800">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="rounded-2xl px-8 h-12 font-bold text-gray-500"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!formData.from || !formData.to || !formData.amount || isAmountInvalid}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" /> Confirm Transfer
        </Button>
      </div>
    </form>
  );
};
