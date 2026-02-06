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
import { contactService } from "@/services/contactService";
import { WalletInfoType, TransactionCategory, RecurringFrequency } from "@/types";
import { Contact } from "@/types";
import toast from "react-hot-toast";
import DatePicker from "../form/date-picker";

import { Subscription } from "@/types";

interface AddSubscriptionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  familyId?: string;
  initialData?: Subscription | null;
}

export const AddSubscriptionForm: React.FC<AddSubscriptionFormProps> = ({ onSuccess, onCancel, familyId, initialData }) => {
  const [wallets, setWallets] = useState<WalletInfoType[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    amount: initialData?.amount.toString() || "",
    frequency: (initialData?.frequency as RecurringFrequency) || "MONTHLY",
    category_id: initialData?.category_id || "",
    wallet_id: initialData?.wallet_id || "",
    vendor_id: initialData?.vendor_id || "",
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    next_billing_date: initialData?.next_billing_date ? new Date(initialData.next_billing_date).toISOString().split('T')[0] : "",
    family_id: familyId,
  });

  useEffect(() => {
    if (!familyId) return;
    walletService.getWallets(familyId).then(data => setWallets(data.wallets)).catch(console.error);
    transactionCategoryService.getCategories(familyId).then(setCategories).catch(console.error);
    contactService.getContacts(familyId).then(setContacts).catch(console.error);
  }, [familyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        amount: Number(formData.amount),
        frequency: formData.frequency,
        category_id: formData.category_id || undefined,
        wallet_id: formData.wallet_id || undefined,
        vendor_id: formData.vendor_id || undefined,
        start_date: formData.start_date,
        next_billing_date: formData.next_billing_date || undefined,
        family_id: familyId || "",
      };

      if (initialData) {
        await subscriptionService.updateSubscription(initialData.id, payload);
        toast.success("Subscription updated");
      } else {
        await subscriptionService.createSubscription(payload);
        toast.success("Subscription tracked");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add subscription", error);
      toast.error(initialData ? "Failed to update subscription" : "Failed to add subscription");
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
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Vendor / Service Provider (optional)</Label>
          <Select 
            options={[
                { value: "", label: "Select Vendor" },
                ...contacts.filter(c => c.type === "VENDOR" || c.type === "OTHER").map(c => ({ value: c.id, label: c.name }))
            ]}
            value={formData.vendor_id}
            onChange={(val: string) => setFormData({...formData, vendor_id: val})}
            className="rounded-2xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Start Date</Label>
          <DatePicker
            id="start-date-picker"
            mode="single"
            defaultDate={formData.start_date}
            placeholder="Select start date"
            onChange={(selectedDates, dateStr) => {
                if (dateStr) {
                    setFormData({...formData, start_date: dateStr});
                }
            }}
        />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Next Billing Date</Label>
          <DatePicker
            id="next-billing-date-picker"
            mode="single"
            defaultDate={formData.next_billing_date}
            placeholder="Select next billing date"
            onChange={(selectedDates, dateStr) => {
                if (dateStr) {
                    setFormData({...formData, next_billing_date: dateStr});
                }
            }}
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
          <Repeat className="w-5 h-5 mr-2" /> {initialData ? "Update Subscription" : "Start Tracking"}
        </Button>
      </div>
    </form>
  );
};
