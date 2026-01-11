"use client";
import React, { useState } from "react";
import { UserPlus, Mail, Shield, User, Info } from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

interface AddFamilyMemberProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddFamilyMember: React.FC<AddFamilyMemberProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "Member"
  });

  const roles = [
    { value: "Member", label: "Family Member (Can record & view)" },
    { value: "Admin", label: "Family Admin (Can manage members)" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inviting member:", formData);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Context (5/12) */}
      <div className="lg:col-span-5">
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-8 space-y-6 h-full flex flex-col justify-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-blue-500/5">
            <UserPlus className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">Share Data</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[240px] mx-auto">
              Collaborate on household budgets by inviting family members.
            </p>
          </div>
          
          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Shield className="w-5 h-5 text-purple-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800 dark:text-white">Role Management</p>
                <p className="text-[10px] text-gray-400 font-medium">Control who can edit or just view data.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Info className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800 dark:text-white">Instant Sync</p>
                <p className="text-[10px] text-gray-400 font-medium">Changes made by members sync instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form (7/12) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Full Name</Label>
          <div className="relative group">
            <Input 
              required
              placeholder="e.g. Aakash Lalkarn"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all pl-11 h-14"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Email Address</Label>
          <div className="relative group">
            <Input 
              required
              type="email"
              placeholder="member@email.com"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
              className="rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all pl-11 h-14"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Designation & Role</Label>
          <Select 
            options={roles}
            defaultValue="Member"
            onChange={(value: string) => setFormData({...formData, role: value})}
            className="rounded-2xl h-14"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="rounded-2xl px-8 h-12 font-bold text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Send Invitation
          </Button>
        </div>
      </form>
    </div>
  );
};
