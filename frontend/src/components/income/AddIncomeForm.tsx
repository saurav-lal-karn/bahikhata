"use client";
import React, { useState } from "react";
import { 
  Briefcase, 
  Wallet, 
  TrendingUp, 
  Clock,
  Plus,
  ArrowUpCircle,
  ShieldCheck,
  FileText
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

interface AddIncomeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddIncomeForm: React.FC<AddIncomeFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    source: "",
    account: "Primary Bank",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });
  
  const [isCustomSource, setIsCustomSource] = useState(false);
  const [customSourceName, setCustomSourceName] = useState("");
  const [isCustomAccount, setIsCustomAccount] = useState(false);
  const [customAccountName, setCustomAccountName] = useState("");

  const sources = [
    { value: "salary", label: "Salary" },
    { value: "freelance", label: "Freelancing" },
    { value: "investments", label: "Investments" },
    { value: "rent", label: "Rental Income" },
    { value: "gift", label: "Gifts / Awards" },
    { value: "custom", label: "+ Add Custom Source" }
  ];

  const accounts = [
    { value: "Primary Bank", label: "Primary Bank" },
    { value: "Savings", label: "Savings Account" },
    { value: "Digital Wallet", label: "Digital Wallet" },
    { value: "Cash", label: "Cash in Hand" },
    { value: "custom", label: "+ Add Custom Account" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      source: isCustomSource ? customSourceName : formData.source,
      account: isCustomAccount ? customAccountName : formData.account
    };
    console.log("Submitting income:", finalData);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Visual & Presets (5/12) */}
      <div className="lg:col-span-5">
        <div className="sticky top-0 h-full flex flex-col justify-center">
          <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/50 rounded-3xl p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-green-500/5">
              <ArrowUpCircle className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">Record Earning</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px] mx-auto">
                Track your various income streams and watch your wealth grow.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center group cursor-pointer hover:border-green-500 transition-all">
                <ShieldCheck className="w-6 h-6 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verified</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center group cursor-pointer hover:border-green-500 transition-all">
                <FileText className="w-6 h-6 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payslip</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Fields (7/12) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Transaction Title</Label>
            <div className="relative group">
              <Input 
                required
                placeholder="e.g. Freelance Payout"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-green-500 transition-all pl-11 h-14"
              />
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Amount (₹)</Label>
            <Input 
              required
              type="number"
              step={0.01}
              placeholder="0.00"
              value={formData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-green-500 transition-all font-black text-lg h-14"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Income Source</Label>
            <Select 
              options={sources}
              placeholder="Pick a source"
              onChange={(value: string) => {
                if (value === "custom") {
                  setIsCustomSource(true);
                } else {
                  setIsCustomSource(false);
                  setFormData({...formData, source: value});
                }
              }}
              className="rounded-2xl h-14"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Deposit To</Label>
            <Select 
              options={accounts}
              defaultValue="Primary Bank"
              onChange={(value: string) => {
                if (value === "custom") {
                  setIsCustomAccount(true);
                } else {
                  setIsCustomAccount(false);
                  setFormData({...formData, account: value});
                }
              }}
              className="rounded-2xl h-14"
            />
          </div>
        </div>

        {/* Conditional Custom Fields */}
        {(isCustomSource || isCustomAccount) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-400">
            {isCustomSource && (
              <div className="space-y-2">
                <Label className="text-green-600 dark:text-green-400 font-bold text-[10px] uppercase tracking-widest">New Source Name</Label>
                <Input 
                  required
                  placeholder="e.g. Dividend Yield"
                  value={customSourceName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomSourceName(e.target.value)}
                  className="rounded-2xl border-green-100 dark:border-green-900/30 bg-green-50/20 dark:bg-green-900/10 focus:border-green-500 transition-all h-14"
                />
              </div>
            )}
            {isCustomAccount && (
              <div className="space-y-2">
                <Label className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">New Account Name</Label>
                <Input 
                  required
                  placeholder="e.g. Crypto Wallet"
                  value={customAccountName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomAccountName(e.target.value)}
                  className="rounded-2xl border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 focus:border-blue-500 transition-all h-14"
                />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          <div className="sm:col-span-5 space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Date Received</Label>
            <Input 
              type="date"
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-green-500 transition-all h-14 font-medium"
            />
          </div>
          <div className="sm:col-span-7 space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Remarks (Optional)</Label>
            <textarea 
              rows={1}
              placeholder="Any notes?"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
              className="w-full rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500 transition-all min-h-[56px] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-50 dark:border-gray-800">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="rounded-2xl px-8 h-12 font-bold text-gray-500 hover:text-gray-700"
            >
              Discard
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-green-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Add to Balance
          </Button>
        </div>
      </form>
    </div>
  );
};
