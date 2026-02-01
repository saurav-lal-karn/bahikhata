"use client";
import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Plus, 
  HeartPulse, 
  Car, 
  Home, 
  Briefcase, 
  Umbrella,
  Calendar,
  DollarSign,
  AlertCircle
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import { insuranceService } from "@/services/insuranceService";
import { InsurancePolicy } from "@/types";
import Button from "@/components/ui/button/Button";
import { AddInsuranceForm } from "@/components/insurance/AddInsuranceForm";

const getPolicyIcon = (type: string) => {
  const className = "w-6 h-6";
  switch (type) {
    case 'LIFE': return <HeartPulse className={className} />;
    case 'HEALTH': return <ShieldCheck className={className} />;
    case 'MOTOR': return <Car className={className} />;
    case 'PROPERTY': return <Home className={className} />;
    case 'TRAVEL': return <Briefcase className={className} />;
    default: return <Umbrella className={className} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'LAPSED': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'EXPIRED': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

export default function InsurancePageClient() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPolicies = async () => {
    try {
      setIsLoading(true);
      const data = await insuranceService.getPolicies();
      setPolicies(data);
    } catch (error) {
      console.error("Failed to fetch policies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const totalSumAssured = policies.reduce((sum, p) => sum + p.sum_assured, 0);
  const annualPremium = policies.reduce((sum, p) => {
      let multiplier = 1;
      if (p.premium_frequency === 'MONTHLY') multiplier = 12;
      if (p.premium_frequency === 'QUARTERLY') multiplier = 4;
      return sum + (p.premium_amount * multiplier);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Insurance & Safety
          </h1>
          <p className="text-gray-500 font-medium italic">
            Protect your family and assets with comprehensive coverage.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl px-6 py-6 font-bold shadow-xl shadow-blue-500/20"
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Policy
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-16 h-16 text-blue-600" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Coverage</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">₹{totalSumAssured.toLocaleString()}</h3>
            <p className="text-xs text-blue-500 font-bold mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Fully Protected
            </p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <DollarSign className="w-16 h-16 text-emerald-600" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Annual Premium</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">₹{annualPremium.toLocaleString()}</h3>
            <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Scheduled Payments
            </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-16 h-16 text-amber-600" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Policies</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{policies.length}</h3>
            <p className="text-xs text-amber-500 font-bold mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> 0 Expiring soon
            </p>
        </div>
      </div>

      {/* Policies List */}
      <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Provider</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Coverage</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Premium</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td colSpan={6} className="px-8 py-6 h-20 bg-gray-50/50 dark:bg-gray-800/20" />
                  </tr>
                ))
              ) : policies.length > 0 ? (
                policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-2xl">
                          {getPolicyIcon(policy.type)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{policy.policy_name}</p>
                          <p className="text-xs text-gray-500">#{policy.policy_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-700 dark:text-gray-300">{policy.provider?.name || "Manual Label"}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900 dark:text-white">₹{policy.sum_assured.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-emerald-600">₹{policy.premium_amount.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{policy.premium_frequency}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(policy.status)}`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-gray-500">
                      {policy.next_due_date ? new Date(policy.next_due_date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <Umbrella className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold text-lg">No insurance policies found.</p>
                    <p className="text-gray-400 text-sm mb-6">Secure your future by adding your first policy.</p>
                    <Button onClick={() => setIsModalOpen(true)} variant="outline" className="rounded-2xl font-bold">Add Your First Policy</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl p-8">
          <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Add Insurance Policy</h2>
              <p className="text-gray-500 text-sm font-medium italic">Enter your policy details for centralized tracking and reminders.</p>
          </div>
          <AddInsuranceForm onSuccess={() => { setIsModalOpen(false); fetchPolicies(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
