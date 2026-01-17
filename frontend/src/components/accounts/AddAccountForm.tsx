"use client";
import React, { useState } from "react";
import { 
  Building2, 
  Banknote, 
  CreditCard, 
  Check, 
  Wallet,
  ShieldCheck
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { WalletType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { walletService } from "@/services/walletService";

interface AddAccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  familyId: string;
  walletTypes: WalletType[];
}

export const AddAccountForm: React.FC<AddAccountFormProps> = ({ onSuccess, onCancel, familyId, walletTypes }) => {
  const { user } = useAuth();
  const familyCurrency = user?.family?.currency || "USD";

  const [formData, setFormData] = useState({
    name: "",
    wallet_type_id: "",
    starting_balance: "",
    currency: familyCurrency,
    wallet_id: "",
    wallet_issuer_name: "",
    description: "",
    is_custom_type: false,
    custom_type_name: "",
    custom_type_description: "",
    family_id: familyId,
  });

  const isCustomType = formData.wallet_type_id === "custom";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
         const accountData = {
            ...formData,
            starting_balance: Number(formData.starting_balance),
            is_custom_type: isCustomType,
        };

        await walletService.createWallet(accountData);
        toast.success("Account added successfully");
        if (onSuccess) onSuccess();
    } catch (error) {
        toast.error("Failed to add account");
    }
  };

  const accountTypeOptions = [
    ...walletTypes.map((type) => ({
      value: type.id,
      label: type.name,
    })),
    { value: "custom", label: "Other / Add Custom Type" }
  ];

  const currencies = [
    { value: "INR", label: "Indian Rupee (₹)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Account Friendly Name */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest md:text-right">Account Name</Label>
          <div className="md:col-span-3">
            <Input 
              required
              placeholder="e.g. HDFC Savings"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
              className="rounded-2xl h-12"
            />
          </div>
        </div>

        {/* Account Type */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest md:text-right">Account Type</Label>
          <div className="md:col-span-3">
            <Select 
              options={accountTypeOptions}
              placeholder="Select Account Type"
              onChange={(val: string) => setFormData({...formData, wallet_type_id: val})}
              className="rounded-2xl h-12"
            />
          </div>
        </div>

        {/* Currency Selector */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest md:text-right">Currency</Label>
          <div className="md:col-span-3">
            <Select 
              options={currencies}
              defaultValue={formData.currency}
              onChange={(val: string) => setFormData({...formData, currency: val})}
              className="rounded-2xl h-12"
            />
          </div>
        </div>

        {/* Custom Type Fields */}
        {isCustomType && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 bg-amber-50/30 dark:bg-amber-900/5 p-6 rounded-3xl border border-amber-100/50 dark:border-amber-800/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase tracking-widest md:text-right">Type Name</Label>
              <div className="md:col-span-3">
                <Input 
                  required
                  placeholder="e.g. Crypto Hardware Wallet"
                  value={formData.custom_type_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, custom_type_name: e.target.value})}
                  className="rounded-2xl h-12 border-amber-200 dark:border-amber-800 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Label className="text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase tracking-widest md:text-right">Type Description</Label>
              <div className="md:col-span-3">
                <Input 
                  placeholder="e.g. Ledger Nano X"
                  value={formData.custom_type_description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, custom_type_description: e.target.value})}
                  className="rounded-2xl h-12 border-amber-200 dark:border-amber-800 focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Initial Balance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest md:text-right">Initial Balance</Label>
          <div className="md:col-span-3">
            <Input 
              required
              type="number"
              placeholder="0.00"
              value={formData.starting_balance}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, starting_balance: e.target.value})}
              className="rounded-2xl h-12 font-bold"
            />
          </div>
        </div>

        {/* Bank/Issuer Name */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center animate-in fade-in duration-300">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest md:text-right">Bank / Issuer</Label>
          <div className="md:col-span-3">
            <Input 
              placeholder="e.g. HDFC Bank"
              value={formData.wallet_issuer_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, wallet_issuer_name: e.target.value})}
              className="rounded-2xl h-12"
            />
          </div>
        </div>

        {/* Account / ID / Phone */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center animate-in fade-in duration-300">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest md:text-right">Account / ID</Label>
          <div className="md:col-span-3">
            <Input 
              placeholder="**** 1234 or saurav@upi"
              value={formData.wallet_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, wallet_id: e.target.value})}
              className="rounded-2xl h-12 font-mono"
            />
          </div>
        </div>

        {/* Description / Notes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start animate-in fade-in duration-300">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest md:text-right pt-4">Description</Label>
          <div className="md:col-span-3">
            <textarea 
              placeholder="Add any specific details about this account..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
              className="w-full min-h-[100px] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Security Check */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/50 flex items-center gap-3">
         <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
         <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
            Your banking data is stored locally and encrypted. Bahikhata never connects directly to your bank servers.
         </p>
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
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Check className="w-5 h-5" /> Save Account
        </Button>
      </div>
    </form>
  );
};
