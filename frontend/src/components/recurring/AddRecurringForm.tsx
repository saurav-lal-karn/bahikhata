"use client";
import React, { useState } from "react";
import { 
  Repeat, 
  Check, 
  Tv, 
  Wifi, 
  ExternalLink,
  ShieldCheck,
  Calendar
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

import { recurringService } from "@/services/recurringService";
import toast from "react-hot-toast";
import { RecurringTransaction } from "@/types";

interface AddRecurringFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  familyId?: string;
  initialData?: RecurringTransaction | null;
}

export const AddRecurringForm: React.FC<AddRecurringFormProps> = ({ onSuccess, onCancel, familyId, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    amount: initialData?.amount.toString() || "",
    frequency: initialData?.frequency || "Monthly",
    category: initialData?.type || "Entertainment",
    paymentFrom: "",
    nextDate: initialData ? new Date(initialData.next_due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const frequencies = [
    { value: "Monthly", label: "Every Month" },
    { value: "Yearly", label: "Every Year (Annual)" },
    { value: "Quarterly", label: "Every 3 Months" },
    { value: "Weekly", label: "Every Week" }
  ];

  const categories = [
    { value: "Entertainment", label: "Entertainment (Netflix, Spotify)" },
    { value: "Utilities", label: "Utilities (Electricity, WiFi)" },
    { value: "Rent", label: "Rent / Housing" },
    { value: "Insurance", label: "Insurance Premiums" },
    { value: "SIP", label: "Investment (SIP/Mutual Funds)" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId) {
        toast.error("Family ID missing");
        return;
    }

    try {
        const payload = {
            family_id: familyId,
            name: formData.name,
            amount: Number(formData.amount),
            frequency: formData.frequency,
            next_due_date: new Date(formData.nextDate).toISOString(),
            type: formData.category
        };

        if (initialData) {
            await recurringService.update(initialData.id, payload);
            toast.success("Recurring transaction updated");
        } else {
            await recurringService.create(payload);
            toast.success("Recurring transaction set up");
        }
        
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Failed to set up recurring transaction", error);
        toast.error(initialData ? "Failed to update subscription" : "Failed to set up recurring transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Service / Bill Name</Label>
              <Input 
                required
                placeholder="e.g. Netflix Premium"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                className="rounded-2xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Category</Label>
              <Select 
                options={categories}
                defaultValue={formData.category}
                onChange={(val: string) => setFormData({...formData, category: val})}
                className="rounded-2xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Billing Frequency</Label>
              <Select 
                options={frequencies}
                defaultValue={formData.frequency}
                onChange={(val: string) => setFormData({...formData, frequency: val})}
                className="rounded-2xl h-12"
              />
            </div>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Cycle Amount (₹)</Label>
              <Input 
                required
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
                className="rounded-2xl h-12 font-black text-blue-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Next Due Date</Label>
              <Input 
                type="date"
                required
                value={formData.nextDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, nextDate: e.target.value})}
                className="rounded-2xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Paid From (Wallet)</Label>
              <Input 
                placeholder="e.g. HDFC Account"
                value={formData.paymentFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, paymentFrom: e.target.value})}
                className="rounded-2xl h-12"
              />
            </div>
         </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-center gap-3">
         <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
         <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
            Automated tracking sets up a virtual reminder. You'll still need to manually verify the transaction unless Bank Sync is active.
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
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Check className="w-5 h-5" /> {initialData ? "Update Automation" : "Activate Automation"}
        </Button>
      </div>
    </form>
  );
};
