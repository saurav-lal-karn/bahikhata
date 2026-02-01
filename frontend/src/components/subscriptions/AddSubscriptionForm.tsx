"use client";
import React, { useState, useEffect } from "react";
import { Repeat } from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { subscriptionService } from "@/services/subscriptionService";
import { walletService } from "@/services/walletService";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { WalletInfoType, TransactionCategory, RecurringFrequency } from "@/types";
import toast from "react-hot-toast";

interface AddSubscriptionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddSubscriptionForm: React.FC<AddSubscriptionFormProps> = ({ onSuccess, onCancel }) => {
  const [wallets, setWallets] = useState<WalletInfoType[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    frequency: "MONTHLY" as RecurringFrequency,
    category_id: "",
    wallet_id: "",
    start_date: new Date().toISOString().split('T')[0],
    next_billing_date: "",
  });

  useEffect(() => {
    walletService.getWallets("").then(data => setWallets(data.wallets)).catch(console.error);
    transactionCategoryService.getCategories("").then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscriptionService.createSubscription({
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success("Subscription tracked");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add subscription", error);
      toast.error("Failed to add subscription");
    }
  };

  const frequencies: { value: RecurringFrequency; label: string }[] = [
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Service Name</Label>
          <Input 
            required
            placeholder="e.g. Netflix, Spotify, Gym"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
            className="rounded-2xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Amount (₹)</Label>
          <Input 
            required
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
            className="rounded-2xl h-12 font-bold text-purple-600"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Frequency</Label>
          <Select 
            options={frequencies}
            value={formData.frequency}
            onChange={(val: string) => setFormData({...formData, frequency: val as RecurringFrequency})}
            className="rounded-2xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Category</Label>
          <Select 
            options={[
                { value: "", label: "Select Category" },
                ...categories.filter(c => c.type === 'EXPENSE').map(c => ({ value: c.id, label: c.name }))
            ]}
            value={formData.category_id}
            onChange={(val: string) => setFormData({...formData, category_id: val})}
            className="rounded-2xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Default Wallet</Label>
          <Select 
            options={[
                { value: "", label: "Select Wallet" },
                ...wallets.map(w => ({ value: w.id, label: w.name }))
            ]}
            value={formData.wallet_id}
            onChange={(val: string) => setFormData({...formData, wallet_id: val})}
            className="rounded-2xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Start Date</Label>
          <Input 
            required
            type="date"
            value={formData.start_date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, start_date: e.target.value})}
            className="rounded-2xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Next Billing Date</Label>
          <Input 
            type="date"
            value={formData.next_billing_date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, next_billing_date: e.target.value})}
            className="rounded-2xl h-12"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="rounded-2xl px-8 h-12"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-500 text-white rounded-2xl px-12 h-12 font-bold shadow-lg shadow-purple-500/20"
        >
          <Repeat className="w-5 h-5 mr-2" /> Start Tracking
        </Button>
      </div>
    </form>
  );
};
