"use client";
import React, { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  Check, 
  Landmark, 
  CreditCard, 
  Percent,
  Calendar
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

import { debtService } from "@/services/debtService";
import { contactService } from "@/services/contactService";
import toast from "react-hot-toast";
import { Contact, Debt } from "@/types";

interface AddLiabilityFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  familyId?: string;
  initialData?: Debt | null;
}

export const AddLiabilityForm: React.FC<AddLiabilityFormProps> = ({ onSuccess, onCancel, familyId, initialData }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState({
    lender: initialData?.lender || "",
	lender_contact_id: initialData?.lender_contact_id || initialData?.lender_contact?.id || "",
    totalAmount: initialData?.total_amount.toString() || "",
    remainingAmount: initialData?.remaining_amount.toString() || "",
    interestRate: initialData?.interest_rate.toString() || "",
    dueDateDay: initialData ? new Date(initialData.due_date).getDate().toString() : "5",
  });

  console.log(initialData)

  useEffect(() => {
	if (familyId) {
		contactService.getContacts(familyId).then(setContacts).catch(console.error);
	}
  }, [familyId]);

  const liabilityTypes = [
    { value: "Loan", label: "Fixed Term Loan" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Mortgage", label: "Home Mortgage" },
    { value: "Personal Debt", label: "Personal Debt (Informal)" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId) {
       toast.error("Family ID missing");
       return;
    }

    try {
        // Construct a due date for the current/next month based on the day
        const now = new Date();
        const due = new Date(now.getFullYear(), now.getMonth(), parseInt(formData.dueDateDay));
        if (due < now) {
            due.setMonth(due.getMonth() + 1);
        }

        const payload = {
            family_id: familyId,
            lender: formData.lender,
            lender_contact_id: formData.lender_contact_id || undefined,
            total_amount: Number(formData.totalAmount),
            remaining_amount: Number(formData.remainingAmount || formData.totalAmount),
            interest_rate: Number(formData.interestRate),
            due_date: due.toISOString()
        };

        if (initialData) {
            await debtService.update(initialData.id, payload);
             toast.success("Liability updated");
        } else {
            await debtService.create(payload);
            toast.success("Liability recorded");
        }
        
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Failed to add liability", error);
        toast.error(initialData ? "Failed to update liability" : "Failed to add liability");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">


             <div className="space-y-2">
               <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Lender Contact</Label>
               <Select 
                 options={[
					{ value: "", label: "Informal / Individual" },
					...contacts.filter(c => c.type === 'LENDER' || c.type === 'OTHER').map(c => ({value: c.id, label: c.name}))
				 ]}
                 placeholder="Select a contact"
                 onChange={(value: string) => {
					 const contact = contacts.find(c => c.id === value);
					 setFormData({
						 ...formData, 
						 lender_contact_id: value,
						 lender: contact ? contact.name : ""
					 });
				 }}
                 value={formData.lender_contact_id}
                 className="rounded-2xl h-12"
               />
             </div>

			 <div className="space-y-2">
               <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Lender Name (Display)</Label>
               <Input 
                 required
                 placeholder="e.g. HDFC Bank, Chase"
                 value={formData.lender}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lender: e.target.value})}
                 className="rounded-2xl h-12"
               />
             </div>


         </div>

         <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Total Outstanding (₹)</Label>
              <Input 
                required
                type="number"
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, totalAmount: e.target.value})}
                className="rounded-2xl h-12 font-black text-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Interest (%)</Label>
                <div className="relative">
                  <Input 
                    type="number"
                    step={0.01}
                    placeholder="8.5"
                    value={formData.interestRate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, interestRate: e.target.value})}
                    className="rounded-2xl h-12 pr-10"
                  />
                  <Percent className="w-3.5 h-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Due Day</Label>
                <div className="relative">
                  <Input 
                    type="number"
                    placeholder="5"
                    value={formData.dueDateDay}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, dueDateDay: e.target.value})}
                    className="rounded-2xl h-12 pr-10"
                  />
                  <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
               <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Remaining Amount (Optional)</Label>
               <Input 
                 type="number"
                 placeholder="Same as total if new"
                 value={formData.remainingAmount}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, remainingAmount: e.target.value})}
                 className="rounded-2xl h-12"
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
          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-red-500/20 transition-all flex items-center gap-2"
        >
          <Check className="w-5 h-5" /> {initialData ? "Update Liability" : "Record Liability"}
        </Button>
      </div>
    </form>
  );
};
