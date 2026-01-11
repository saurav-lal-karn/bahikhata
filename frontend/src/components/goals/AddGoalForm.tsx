"use client";
import React, { useState } from "react";
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

interface AddGoalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const icons = [
  { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
  { id: 'travel', icon: <Plane className="w-5 h-5" />, label: 'Travel' },
  { id: 'shopping', icon: <ShoppingBag className="w-5 h-5" />, label: 'Shopping' },
  { id: 'security', icon: <ShieldCheck className="w-5 h-5" />, label: 'Safety' },
  { id: 'wealth', icon: <Target className="w-5 h-5" />, label: 'Wealth' },
  { id: 'asset', icon: <Landmark className="w-5 h-5" />, label: 'Asset' },
];

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    current: "",
    deadline: "",
    icon: "wealth"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving goal:", formData);
    if (onSuccess) onSuccess();
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
              <Input 
                type="date"
                required
                value={formData.deadline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, deadline: e.target.value})}
                className="rounded-2xl h-14"
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
          <Check className="w-5 h-5" /> Start Saving
        </Button>
      </div>
    </form>
  );
};
