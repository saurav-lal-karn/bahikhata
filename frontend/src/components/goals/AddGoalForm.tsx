"use client";
import React, { useState, useEffect } from "react";
import { 
  Target, 
  Landmark, 
  Plane, 
  ShoppingBag, 
  Home, 
  ShieldCheck,
  Check
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { goalService } from "@/services/goalService";
import toast from "react-hot-toast";
import DatePicker from "../form/date-picker";

import { Goal } from "@/types";

interface AddGoalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  familyId: string;
  initialData?: Goal | null;
}

const icons = [
  { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
  { id: 'travel', icon: <Plane className="w-5 h-5" />, label: 'Travel' },
  { id: 'shopping', icon: <ShoppingBag className="w-5 h-5" />, label: 'Shopping' },
  { id: 'security', icon: <ShieldCheck className="w-5 h-5" />, label: 'Safety' },
  { id: 'wealth', icon: <Target className="w-5 h-5" />, label: 'Wealth' },
  { id: 'asset', icon: <Landmark className="w-5 h-5" />, label: 'Asset' },
];

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ onSuccess, onCancel, familyId, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    current: "",
    deadline: "",
    description: "",
    icon: "wealth"
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        target: initialData.target_amount.toString(),
        current: initialData.current_amount.toString(),
        deadline: new Date(initialData.deadline).toISOString(),
        description: initialData.description || "",
        icon: initialData.icon_name || "wealth"
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        target_amount: Number(formData.target),
        current_amount: Number(formData.current) || 0,
        description: formData.description,
        icon_name: formData.icon,
        deadline: new Date(formData.deadline).toISOString(), // Format to RFC3339
        family_id: familyId
      };

      if (initialData) {
        await goalService.updateGoal(initialData.id, payload);
        toast.success("Goal updated successfully");
      } else {
        await goalService.createGoal(payload);
        toast.success("Goal created successfully");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to save goal:", error);
      toast.error(initialData ? "Failed to update goal" : "Failed to create goal");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Goal Name</Label>
              <Input 
                required
                placeholder="e.g. Dream House Fund"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                className="rounded-2xl h-14"
              />
            </div>

            <div className="space-y-2">
               <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Description (Optional)</Label>
               <textarea 
                 rows={2}
                 placeholder="Why is this goal important?"
                 value={formData.description}
                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                 className="w-full rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none"
               />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Choose Icon</Label>
              <div className="flex flex-wrap gap-3">
                 {icons.map((item) => (
                   <button
                     key={item.id}
                     type="button"
                     onClick={() => setFormData({...formData, icon: item.id})}
                     className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                       formData.icon === item.id 
                         ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-100 dark:ring-emerald-900/40' 
                         : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-800'
                     }`}
                   >
                     {item.icon}
                   </button>
                 ))}
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Target (₹)</Label>
                 <Input 
                   required
                   type="number"
                   placeholder="10,00,000"
                   value={formData.target}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, target: e.target.value})}
                   className="rounded-2xl h-14 font-black"
                 />
               </div>
               <div className="space-y-2">
                 <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Initial (₹)</Label>
                 <Input 
                   type="number"
                   placeholder="0"
                   value={formData.current}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, current: e.target.value})}
                   className="rounded-2xl h-14 font-bold text-gray-500"
                 />
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Target Date</Label>
               <DatePicker
                    id="transaction-date-picker"
                    mode="single"
                    defaultDate={formData.deadline}
                    placeholder="Select transaction date"
                    onChange={(selectedDates, dateStr) => {
                    if (dateStr) {
                        setFormData({...formData, deadline: dateStr});
                    }
                    }}
                />
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
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
        >
          <Check className="w-5 h-5" /> {initialData ? 'Update Goal' : 'Start Saving'}
        </Button>
      </div>
    </form>
  );
};
