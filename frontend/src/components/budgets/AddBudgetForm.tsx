"use client";
import React, { useState } from "react";
import { 
  Target, 
  HelpCircle,
  RefreshCw,
  Info
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ExpenseCategory } from "@/types";
import { budgetService } from "@/services/budgetService";
import toast from "react-hot-toast";

interface AddBudgetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  categories?: ExpenseCategory[];
  family_id?: string;
}

export const AddBudgetForm: React.FC<AddBudgetFormProps> = ({ onSuccess, onCancel, categories = [], family_id }) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
    alertThreshold: "80",
    rollover: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!family_id) {
        toast.error("Family ID is missing");
        return;
    }
    try {
        await budgetService.createBudget({
            category_id: formData.category,
            amount_limit: Number(formData.amount),
            family_id: family_id,
            period: formData.period,
            alert_threshold: Number(formData.alertThreshold)
        });
        toast.success("Budget set successfully");
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Failed to set budget:", error);
        toast.error("Failed to set budget");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Expense Category</Label>
            <Select 
              options={categories.map((category) => ({ value: category.id, label: category.name }))}
              placeholder="Pick a category"
              onChange={(value: string) => setFormData({...formData, category: value})}
              className="rounded-2xl h-14"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Limit (₹)</Label>
            <Input 
              required
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 transition-all font-black text-xl h-14"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Period</Label>
                <Select 
                    options={[
                        { value: "Weekly", label: "Weekly" },
                        { value: "Monthly", label: "Monthly" },
                        { value: "Yearly", label: "Yearly" }
                    ]}
                    defaultValue="monthly"
                    onChange={(value: string) => setFormData({...formData, period: value})}
                    className="rounded-2xl h-14"
                />
             </div>
             <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Alert at (%)</Label>
                <Input 
                  type="number"
                  placeholder="80"
                  value={formData.alertThreshold}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, alertThreshold: e.target.value})}
                  className="rounded-2xl h-14 font-bold"
                />
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                   <RefreshCw className="w-5 h-5" />
                 </div>
                 <h4 className="text-sm font-bold text-gray-800 dark:text-white">Enable Rollover</h4>
                 <div className="ml-auto">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, rollover: !formData.rollover})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.rollover ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.rollover ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                When enabled, any unspent funds from this budget will be added to next month's allowance for this category.
              </p>
           </div>

           <div className="flex items-start gap-3 px-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                Budgets are calculated on the 1st of every month at 00:00. You can adjust limits anytime.
              </p>
           </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-50 dark:border-gray-800">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="rounded-2xl px-8 h-12 font-bold text-gray-500"
        >
          Discard Changes
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-purple-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          Confirm Budget
        </Button>
      </div>
    </form>
  );
};
