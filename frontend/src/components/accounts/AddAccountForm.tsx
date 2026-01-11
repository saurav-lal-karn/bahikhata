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

interface AddAccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddAccountForm: React.FC<AddAccountFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Bank Account",
    balance: "",
    accountNo: "",
    bank: "",
  });

  const accountTypes = [
    { value: "Bank Account", label: "Bank Account" },
    { value: "Digital Wallet", label: "Digital Wallet (UPI/Apps)" },
    { value: "Physical Wallet", label: "Physical Wallet / Cash" },
    { value: "Credit Card", label: "Credit Card Account" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding account:", formData);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Account Friendly Name</Label>
              <Input 
                required
                placeholder="e.g. HDFC Savings"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                className="rounded-2xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Account Type</Label>
              <Select 
                options={accountTypes}
                defaultValue={formData.type}
                onChange={(val: string) => setFormData({...formData, type: val})}
                className="rounded-2xl h-12"
              />
            </div>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Initial Balance (₹)</Label>
              <Input 
                required
                type="number"
                placeholder="0.00"
                value={formData.balance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, balance: e.target.value})}
                className="rounded-2xl h-12 font-bold"
              />
            </div>

            {formData.type === "Bank Account" || formData.type === "Credit Card" ? (
              <div className="space-y-2 animate-in fade-in duration-300">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Bank/Issuer Name</Label>
                <Input 
                  placeholder="e.g. HDFC Bank"
                  value={formData.bank}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, bank: e.target.value})}
                  className="rounded-2xl h-12"
                />
              </div>
            ) : null}
         </div>
      </div>

      {(formData.type === "Bank Account" || formData.type === "Digital Wallet") && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Account / ID / Phone (Optional)</Label>
          <Input 
            placeholder="**** 1234 or saurav@upi"
            value={formData.accountNo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, accountNo: e.target.value})}
            className="rounded-2xl h-12 font-mono"
          />
        </div>
      )}

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
