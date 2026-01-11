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

interface AddInvestmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddInvestmentForm: React.FC<AddInvestmentFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });
  
  const [isCustomType, setIsCustomType] = useState(false);
  const [customTypeName, setCustomTypeName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const investmentTypes = [
    { value: "Mutual Fund", label: "Mutual Fund" },
    { value: "Stock", label: "Stock" },
    { value: "Gold", label: "Gold" },
    { value: "Fixed Deposit", label: "Fixed Deposit" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Crypto", label: "Crypto" },
    { value: "custom", label: "+ Add Custom Type" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => setFile(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      type: isCustomType ? customTypeName : formData.type,
      document: file ? file.name : null
    };
    console.log("Submitting investment:", finalData);
    if (onSuccess) onSuccess();
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
               <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Investment Logic</Label>
               <div className="flex items-center h-14 px-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs text-gray-400 font-medium italic">
                 Standard asset tracking enabled.
               </div>
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Principal Amount (₹)</Label>
            <Input 
              required
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all font-black text-lg h-14"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Purchase Date</Label>
            <Input 
              type="date"
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all h-14"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Account / Portfolio</Label>
            <div className="relative group">
              <Input 
                placeholder="e.g. Zerodha / Groww"
                className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all h-14"
              />
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Investment Document / Image</Label>
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl cursor-pointer bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <p className="text-xs font-bold text-gray-500">Click or drag to upload receipt</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={removeFile} type="button" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Remarks</Label>
          <textarea 
            rows={2}
            placeholder="Additional notes about this investment..."
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
            className="w-full rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
          />
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
            Save Investment
          </Button>
        </div>
      </form>
    </div>
  );
};
