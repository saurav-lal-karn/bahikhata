"use client";
import React, { useState } from "react";
import { 
  FileText, 
  Check, 
  Upload, 
  Shield, 
  X
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

interface AddDocumentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Receipt",
    year: new Date().getFullYear().toString(),
    remarks: ""
  });

  const categories = [
    { value: "Receipt", label: "Expense Receipt" },
    { value: "Policy", label: "Insurance Policy" },
    { value: "Form 16", label: "Tax Form 16" },
    { value: "Investment Proof", label: "Investment Proof" },
    { value: "Other", label: "Other Financial Record" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Uploading document:", formData);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Document Name</Label>
              <Input 
                required
                placeholder="e.g. Amazon Electronics Invoice"
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
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Financial Year</Label>
              <Input 
                required
                placeholder="2025-26"
                value={formData.year}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, year: e.target.value})}
                className="rounded-2xl h-12 font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Files (Mock)</Label>
              <div className="h-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between px-4 group cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                 <span className="text-xs text-gray-400 font-bold">Select PDF or Image...</span>
                 <Upload className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
              </div>
            </div>
         </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Remarks / Tags</Label>
        <Input 
          placeholder="e.g. Laptop purchase, tax deductible"
          value={formData.remarks}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, remarks: e.target.value})}
          className="rounded-2xl h-12"
        />
      </div>

      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-3">
         <Shield className="w-5 h-5 text-indigo-500 shrink-0" />
         <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
            Documents are encrypted at rest. Vault access requires your account password for retrieval.
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
          className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Check className="w-5 h-5" /> Secure Upload
        </Button>
      </div>
    </form>
  );
};
