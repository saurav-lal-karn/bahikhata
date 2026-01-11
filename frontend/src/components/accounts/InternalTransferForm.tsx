"use client";
import React, { useState } from "react";
import { ArrowLeftRight, Check, ShoppingBag, Landmark } from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

interface InternalTransferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const InternalTransferForm: React.FC<InternalTransferFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    remarks: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Processing transfer:", formData);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-6 justify-center mb-10">
         <div className="text-center space-y-3 flex-1 max-w-[180px]">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-3xl mx-auto flex items-center justify-center border-2 border-blue-100 dark:border-blue-800">
               <Building2Icon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400">From Account</p>
         </div>
         
         <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
            <ArrowLeftRight className="w-6 h-6 text-gray-400" />
         </div>

         <div className="text-center space-y-3 flex-1 max-w-[180px]">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl mx-auto flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-800">
               <Building2Icon className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400">To Account</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Amount (₹)</Label>
              <Input 
                required
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
                className="rounded-2xl h-14 font-black text-xl"
              />
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
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Check className="w-5 h-5" /> Confirm Transfer
        </Button>
      </div>
    </form>
  );
};

const Building2Icon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
    <path d="M10 6h4"/>
    <path d="M10 10h4"/>
    <path d="M10 14h4"/>
    <path d="M10 18h4"/>
  </svg>
);
