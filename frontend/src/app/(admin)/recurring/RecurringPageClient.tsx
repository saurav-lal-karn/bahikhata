"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
    Repeat,
    Plus,
    Search,
    Zap,
    CheckCircle2,
    Clock,
    Filter,
    ChevronDown,
    AlertCircle,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { SubscriptionManager } from "@/components/recurring/SubscriptionManager";
import { UpcomingBillReminders } from "@/components/recurring/UpcomingBillReminders";
import { AddRecurringForm } from "@/components/recurring/AddRecurringForm";
import { useAuth } from "@/context/AuthContext";
import { recurringService } from "@/services/recurringService";
import { RecurringTransaction } from "@/types";

export default function RecurringPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<RecurringTransaction[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [editingTransaction, setEditingTransaction] =
        useState<RecurringTransaction | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Extract unique transaction types
    const transactionTypes = Array.from(
        new Set(transactions.map((t) => t.type).filter(Boolean))
    ) as string[];

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch =
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !selectedType || t.type === selectedType;
        return matchesSearch && matchesType;
    });

    const fetchTransactions = async () => {
        if (familyDetails?.id) {
            try {
                setIsLoading(true);
                const data = await recurringService.getAll(familyDetails.id);
                setTransactions(data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [familyDetails?.id]);

    const openModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        fetchTransactions();
    };

    const handleEdit = (transaction: RecurringTransaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDeleteInitiate = (id: string) => {
        setDeletingId(id);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;
        try {
            await recurringService.delete(deletingId);
            toast.success("Recurring transaction deleted");
            setDeletingId(null);
            fetchTransactions();
        } catch (e) {
            console.error(e);
            toast.error("Failed to delete recurring transaction");
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Recurring Bills & Automation
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Never miss a payment with automated tracking and early
                        warning alerts.
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:from-blue-500 hover:to-cyan-500 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Add Recurring Bill
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left: Active Subscriptions & Bills (8/12) */}
                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20">
                                <Repeat className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-800 dark:text-white">
                                    Active Subscriptions
                                </h3>
                                <p className="text-xs font-medium text-gray-500">
                                    Tracking {filteredTransactions.length}{" "}
                                    digital services
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-32 rounded-xl bg-gray-50 py-2 pr-4 pl-9 text-xs outline-none focus:ring-1 focus:ring-blue-500 md:w-48 dark:bg-gray-800"
                                />
                            </div>
                            <button
                                onClick={() =>
                                    setIsFilterVisible(!isFilterVisible)
                                }
                                className={`rounded-xl border p-2 transition-all ${isFilterVisible ? "border-blue-200 bg-blue-50 text-blue-600" : "border-transparent bg-gray-50 text-gray-400 dark:bg-gray-800"}`}
                            >
                                <Filter className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    {isFilterVisible && (
                        <div className="animate-in slide-in-from-top-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm duration-300 dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex flex-wrap items-end gap-4">
                                <div className="min-w-[200px] space-y-2">
                                    <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Filter by Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedType || ""}
                                            onChange={(e) =>
                                                setSelectedType(
                                                    e.target.value || null
                                                )
                                            }
                                            className="w-full appearance-none rounded-xl border border-transparent bg-gray-50 py-2.5 pr-10 pl-4 text-xs font-bold transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800/50"
                                        >
                                            <option value="">
                                                All Categories
                                            </option>
                                            {transactionTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedType(null);
                                    }}
                                    className="rounded-xl bg-gray-50 px-6 py-2.5 text-[10px] font-black tracking-widest text-gray-500 uppercase transition-all hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}

                    <SubscriptionManager
                        transactions={filteredTransactions}
                        isLoading={isLoading}
                        onEdit={(t) => handleEdit(t as RecurringTransaction)}
                        onDelete={handleDeleteInitiate}
                    />
                </div>

                {/* Right: Alerts & Calendar (4/12) */}
                <div className="col-span-12 space-y-8 xl:col-span-4">
                    <UpcomingBillReminders
                        transactions={transactions}
                        isLoading={isLoading}
                    />

                    <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-800 to-indigo-900 p-8 text-white shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                            <Zap className="h-24 w-24" />
                        </div>
                        <h4 className="mb-4 flex items-center gap-2 text-xl font-black">
                            <Zap className="h-5 w-5 text-amber-400" /> Smart
                            Savings
                        </h4>
                        <p className="mb-6 text-xs leading-relaxed font-medium opacity-80">
                            You have 3 unused subscriptions costing you
                            ₹850/month. Cancelling these could save you ₹10,200
                            annually.
                        </p>
                        <button className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-white/20">
                            Identify Waste
                        </button>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h4 className="mb-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            Automation Status
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    Auto-payment for Rent Enabled
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-amber-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    Pending OTP for Netflix (Jan 15)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-4xl p-10"
            >
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[2rem] border-2 border-blue-100 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                        <Repeat className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        {editingTransaction
                            ? "Edit Recurring Bill"
                            : "Automate Recurring Bill"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {editingTransaction
                            ? "Update your tracking preferences."
                            : "Set up a tracking cycle for subscriptions, rent, or utilities."}
                    </p>
                </div>
                <AddRecurringForm
                    onSuccess={closeModal}
                    onCancel={closeModal}
                    familyId={familyDetails?.id}
                    initialData={editingTransaction}
                />
            </Modal>

            <Modal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                className="max-w-md p-8"
            >
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-900/10">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-xl font-black text-gray-900 dark:text-white">
                        Delete Recurring Bill?
                    </h3>
                    <p className="mb-8 text-xs font-medium text-gray-500">
                        This will stop tracking future payments. Past execution
                        history will be preserved. This action cannot be undone.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setDeletingId(null)}
                            className="flex-1 rounded-xl bg-gray-50 py-3 text-xs font-bold text-gray-600 transition-all hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            className="flex-1 rounded-xl bg-red-500 py-3 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
