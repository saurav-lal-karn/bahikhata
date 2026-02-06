"use client";
import React, { useState } from "react";
import { 
  TrendingUp, 
  Wallet, 
  Calendar,
  Plus,
  ArrowUpCircle,
  ShieldCheck,
  FileText,
  Upload,
  X,
  PieChart,
  Gem,
  Landmark,
  Coins
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

import { investmentService } from "@/services/investmentService";
import toast from "react-hot-toast";
import { Investment } from "@/types";

interface AddInvestmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  familyId?: string;
  initialData?: Investment | null;
}

export const AddInvestmentForm: React.FC<AddInvestmentFormProps> = ({ onSuccess, onCancel, familyId, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "",
    quantity: initialData?.quantity.toString() || "",
    avgBuyPrice: initialData?.avg_buy_price.toString() || "",
    currentPrice: initialData?.current_price.toString() || "",
  });
  
  const [isCustomType, setIsCustomType] = useState(false);
  const [customTypeName, setCustomTypeName] = useState("");

  const investmentTypes = [
    { value: "Mutual Fund", label: "Mutual Fund" },
    { value: "Stock", label: "Stock" },
    { value: "Gold", label: "Gold" },
    { value: "Fixed Deposit", label: "Fixed Deposit" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Crypto", label: "Crypto" },
    { value: "custom", label: "+ Add Custom Type" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId) {
        toast.error("Family ID missing");
        return;
    }

    try {
        const type = isCustomType ? customTypeName : formData.type;
        const payload = {
            family_id: familyId,
            name: formData.name,
            type: type,
            quantity: Number(formData.quantity),
            avg_buy_price: Number(formData.avgBuyPrice),
            current_price: Number(formData.currentPrice || formData.avgBuyPrice)
        };

        if (initialData) {
            await investmentService.update(initialData.id!, payload);
            toast.success("Investment updated");
        } else {
            await investmentService.create(payload);
            toast.success("Investment recorded");
        }
        
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Failed to add investment", error);
        toast.error(initialData ? "Failed to update investment" : "Failed to add investment");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Visual & Info (4/12) */}
      <div className="lg:col-span-4">
        <div className="sticky top-0 h-full flex flex-col justify-center">
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-blue-500/5">
              <TrendingUp className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">Build Wealth</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mx-auto">
                Recording your investments helps track long-term growth and asset allocation.
              </p>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 group transition-all">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-left">Secure Records</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 group transition-all">
                <FileText className="w-5 h-5 text-purple-500" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-left">Upload Proofs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Fields (8/12) */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Asset Name</Label>
            <Input 
              required
              placeholder="e.g. HDFC Bluechip Fund"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all h-14"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Investment Type</Label>
            <Select 
              options={investmentTypes}
              placeholder="Select asset type"
              onChange={(value: string) => {
                if (value === "custom") {
                  setIsCustomType(true);
                  setFormData({...formData, type: ""});
                } else {
                  setIsCustomType(false);
                  setFormData({...formData, type: value});
                }
              }}
              value={formData.type}
              className="rounded-2xl h-14"
            />
          </div>
        </div>

        {/* Custom Type and Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isCustomType ? (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
               <Label className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">Custom Type Name</Label>
               <Input 
                 required
                 placeholder="e.g. Private Equity"
                 value={customTypeName}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTypeName(e.target.value)}
                 className="rounded-2xl border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 focus:border-blue-500 transition-all h-14"
               />
            </div>
          ) : (
            <div className="space-y-2">
               <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Quantity / Units</Label>
               <Input 
                 required
                 type="number"
                 placeholder="e.g. 10.5"
                 value={formData.quantity}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, quantity: e.target.value})}
                 className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all font-black h-14"
               />
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Avg Buy Price (₹)</Label>
            <Input 
              required
              type="number"
              placeholder="0.00"
              value={formData.avgBuyPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, avgBuyPrice: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all font-black text-lg h-14"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Current Price (Optional)</Label>
            <Input 
              type="number"
              placeholder="Same as Buy Price if new"
              value={formData.currentPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, currentPrice: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all h-14"
            />
          </div>
          {isCustomType && (
            <div className="space-y-2">
               <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Quantity / Units</Label>
               <Input 
                 required
                 type="number"
                 placeholder="e.g. 10.5"
                 value={formData.quantity}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, quantity: e.target.value})}
                 className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all font-black h-14"
               />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-50 dark:border-gray-800">
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            {initialData ? "Update Investment" : "Save Investment"}
          </Button>
        </div>
      </form>
    </div>
  );
};
