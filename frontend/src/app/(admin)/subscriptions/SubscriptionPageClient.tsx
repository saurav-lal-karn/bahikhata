"use client";
import React, { useState, useEffect } from "react";
import { Repeat, Plus, Trash2, Clock, TrendingUp, Zap } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import { subscriptionService } from "@/services/subscriptionService";
import { Subscription } from "@/types";
import Button from "@/components/ui/button/Button";
import { AddSubscriptionForm } from "@/components/subscriptions/AddSubscriptionForm";
import toast from "react-hot-toast";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { DeleteConfirmationModal } from "@/components/ui/modal/DeleteConfirmationModal";
import { SubscriptionManager } from "@/components/recurring/SubscriptionManager";

export default function SubscriptionPageClient() {
    const { user } = useAuth();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] =
        useState<Subscription | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleEdit = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            setIsDeleting(true);
            await subscriptionService.deleteSubscription(deletingId);
            toast.success("Subscription removed");
            fetchSubscriptions();
            setDeletingId(null);
        } catch (error) {
            toast.error("Failed to delete");
        } finally {
            setIsDeleting(false);
        }
    };

    const monthlyBurn = subscriptions.reduce((sum, s) => {
        if (s.frequency === "MONTHLY") return sum + s.amount;
        if (s.frequency === "YEARLY") return sum + s.amount / 12;
        return sum;
    }, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Subscriptions
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Manage your recurring digital services and monthly burn
                        rate.
                    </p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6 font-bold text-white shadow-xl shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500"
                >
                    <Plus className="mr-2 h-5 w-5" /> Track New Subscription
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="absolute top-0 right-0 p-4 text-purple-600 opacity-10 transition-transform group-hover:scale-110">
                        <Zap className="h-16 w-16" />
                    </div>
                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Monthly Burn Rate
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(monthlyBurn)}
                    </h3>
                    <p className="mt-2 text-xs font-bold text-purple-500">
                        Active Recurrences
                    </p>
                </div>

                <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="absolute top-0 right-0 p-4 text-indigo-600 opacity-10 transition-transform group-hover:scale-110">
                        <TrendingUp className="h-16 w-16" />
                    </div>
                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Annual Projection
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(monthlyBurn * 12)}
                    </h3>
                    <p className="mt-2 text-xs font-bold text-indigo-500">
                        Estimated yearly cost
                    </p>
                </div>

                <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="absolute top-0 right-0 p-4 text-rose-600 opacity-10 transition-transform group-hover:scale-110">
                        <Clock className="h-16 w-16" />
                    </div>
                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Active Services
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {subscriptions.length}
                    </h3>
                    <p className="mt-2 text-xs font-bold text-rose-500">
                        Total tracked subscriptions
                    </p>
                </div>
            </div>

            {/* Subscriptions Grid */}
            <div className="mt-8">
                <SubscriptionManager
                    transactions={subscriptions}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingSubscription(null);
                }}
                className="max-w-2xl p-8"
            >
                <div className="mb-8">
                    <h2 className="mb-2 text-2xl font-black text-gray-900 dark:text-white">
                        {editingSubscription
                            ? "Edit Subscription"
                            : "Add Subscription"}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 italic">
                        {editingSubscription
                            ? "Update subscription details."
                            : "Keep track of your digital recurrences and never get surprised by a bill."}
                    </p>
                </div>
                <AddSubscriptionForm
                    onSuccess={() => {
                        setIsModalOpen(false);
                        setEditingSubscription(null);
                        fetchSubscriptions();
                    }}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingSubscription(null);
                    }}
                    familyId={user?.family?.id}
                    initialData={editingSubscription}
                />
            </Modal>

            <DeleteConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Subscription"
                description="Are you sure you want to stop tracking this subscription? This will remove it from your recurring expenses."
                isDeleting={isDeleting}
            />
        </div>
    );
}
