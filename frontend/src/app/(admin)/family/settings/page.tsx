"use client";
import React, { useState } from "react";
import { 
  Building, 
  Globe, 
  Bell, 
  ShieldAlert, 
  Save, 
  ArrowLeft,
  IndianRupee,
  Lock,
  Trash2
} from "lucide-react";
import Link from "next/link";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

export default function FamilySettingsPage() {
  const [formData, setFormData] = useState({
    familyName: "The Karn Family",
    currency: "INR",
    budgetAlerts: true,
    weeklyReport: true
  });

  const currencies = [
    { value: "INR", label: "Indian Rupee (₹)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/family" 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Family Settings
          </h1>
          <p className="text-gray-500 font-medium">
            Configure global defaults for your household group.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* General Settings Section */}
        <section className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center gap-3">
            <Building className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800 dark:text-white">General Information</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Family Display Name</Label>
                <Input 
                  value={formData.familyName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, familyName: e.target.value})}
                  placeholder="e.g. Smith Household"
                  className="rounded-2xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Base Currency</Label>
                <Select 
                  options={currencies}
                  defaultValue={formData.currency}
                  onChange={(val: string) => setFormData({...formData, currency: val})}
                  className="rounded-2xl h-12"
                />
                <p className="text-[10px] text-gray-400 font-medium">All financial calculations will use this currency.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center gap-3">
            <Bell className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-gray-800 dark:text-white">Family Notifications</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800 dark:text-white">Over-budget Alerts</p>
                <p className="text-xs text-gray-500">Notify family owner when spending exceeds 90% of budget.</p>
              </div>
              <input type="checkbox" checked={formData.budgetAlerts} onChange={() => setFormData({...formData, budgetAlerts: !formData.budgetAlerts})} className="w-12 h-6 rounded-full bg-gray-200 checked:bg-blue-600 appearance-none transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:left-7" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800 dark:text-white">Weekly Summary Report</p>
                <p className="text-xs text-gray-500">Send an email summary of all transactions to all members.</p>
              </div>
              <input type="checkbox" checked={formData.weeklyReport} onChange={() => setFormData({...formData, weeklyReport: !formData.weeklyReport})} className="w-12 h-6 rounded-full bg-gray-200 checked:bg-blue-600 appearance-none transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:left-7" />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50/10 dark:bg-red-900/5 border border-red-100 dark:border-red-900/30 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-red-50 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/20 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-red-700 dark:text-red-400">Danger Zone</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800 dark:text-white">Transfer Ownership</p>
                <p className="text-xs text-gray-500">Hand over the administrative controls to another member.</p>
              </div>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs uppercase px-6">Transfer Control</Button>
            </div>
            
            <div className="pt-6 border-t border-red-100 dark:border-red-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">Delete Family Account</p>
                <p className="text-xs text-gray-400 font-medium">Permanently delete all expenses, income, and member data. This action is irreversible.</p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase px-6 gap-2">
                <Trash2 className="w-4 h-4" /> Delete Family
              </Button>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-blue-500/20 gap-2">
            <Save className="w-5 h-5" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
