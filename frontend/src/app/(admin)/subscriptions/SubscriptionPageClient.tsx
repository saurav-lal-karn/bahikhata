"use client";
import React, { useState, useEffect } from "react";
import { 
  Repeat, 
  Plus, 
  Trash2, 
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import { subscriptionService } from "@/services/subscriptionService";
import { Subscription } from "@/types";
import Button from "@/components/ui/button/Button";
import { AddSubscriptionForm } from "@/components/subscriptions/AddSubscriptionForm";
import toast from "react-hot-toast";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function SubscriptionPageClient() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      // Assuming 'user' object has 'familyId' or similar property based on context
      // If user type definition is loose, we might need to cast or check
      const familyId = (user as any)?.family.id;
      const data = await subscriptionService.getSubscriptions(familyId);
      setSubscriptions(data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.family?.id) return;
    fetchSubscriptions();
  }, [user]);

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this subscription?")) return;
      try {
          await subscriptionService.deleteSubscription(id);
          toast.success("Subscription removed");
          fetchSubscriptions();
      } catch (error) {
          toast.error("Failed to delete");
      }
  };

  const monthlyBurn = subscriptions.reduce((sum, s) => {
      if (s.frequency === 'MONTHLY') return sum + s.amount;
      if (s.frequency === 'YEARLY') return sum + (s.amount / 12);
      return sum;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Subscriptions
          </h1>
          <p className="text-gray-500 font-medium italic">
            Manage your recurring digital services and monthly burn rate.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl px-6 py-6 font-bold shadow-xl shadow-purple-500/20"
        >
          <Plus className="w-5 h-5 mr-2" /> Track New Subscription
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-purple-600">
                <Zap className="w-16 h-16" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Burn Rate</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(monthlyBurn)}</h3>
            <p className="text-xs text-purple-500 font-bold mt-2">Active Recurrences</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-indigo-600">
                <TrendingUp className="w-16 h-16" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Annual Projection</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(monthlyBurn * 12)}</h3>
            <p className="text-xs text-indigo-500 font-bold mt-2">Estimated yearly cost</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-rose-600">
                <Clock className="w-16 h-16" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Services</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{subscriptions.length}</h3>
            <p className="text-xs text-rose-500 font-bold mt-2">Total tracked subscriptions</p>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-48 bg-gray-50 dark:bg-gray-800/50 rounded-3xl animate-pulse" />
              ))
          ) : subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                  <div key={sub.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:border-purple-200 dark:hover:border-purple-900/50 transition-all group">
                      <div className="flex items-start justify-between mb-6">
                          <div className="p-3 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-2xl">
                              <Repeat className="w-6 h-6" />
                          </div>
                          <div className="flex items-center gap-2">
                              <button onClick={() => handleDelete(sub.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                      <div>
                          <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1">{sub.name}</h4>
                          <div className="flex items-center gap-2 mb-4">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                                  {sub.category?.name || "Uncategorized"}
                              </span>
                          </div>
                          <div className="flex items-end justify-between">
                              <div>
                                  <p className="text-2xl font-black text-purple-600 italic">{formatCurrency(sub.amount)}</p>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">per {sub.frequency.toLowerCase()}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Next Bill</p>
                                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                      {sub.next_billing_date ? formatDateTime(sub.next_billing_date) : 'N/A'}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                  <Repeat className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold text-lg">No subscriptions tracked yet.</p>
                  <Button onClick={() => setIsModalOpen(true)} className="mt-6 rounded-2xl">Track First Subscription</Button>
              </div>
          )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl p-8">
          <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Add Subscription</h2>
              <p className="text-gray-500 text-sm font-medium italic">Keep track of your digital recurrences and never get surprised by a bill.</p>
          </div>
          <AddSubscriptionForm onSuccess={() => { setIsModalOpen(false); fetchSubscriptions(); }} onCancel={() => setIsModalOpen(false)} familyId={user?.family?.id} />
      </Modal>
    </div>
  );
}
