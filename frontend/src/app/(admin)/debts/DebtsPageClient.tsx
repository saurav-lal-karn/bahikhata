"use client";
import React, { useState } from "react";
import {
    ShieldAlert,
    Plus,
    TrendingDown,
    Calculator,
    Info,
    Filter,
    Search,
    ChevronDown,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { LoanTracker } from "@/components/debts/LoanTracker";
import { CreditCardOverview } from "@/components/debts/CreditCardOverview";
import { PayoffCalculator } from "@/components/debts/PayoffCalculator";
import { AddLiabilityForm } from "@/components/debts/AddLiabilityForm";
import { useAuth } from "@/context/AuthContext";
import { debtService } from "@/services/debtService";
import { Debt } from "@/types";
import { LiabilityList } from "@/components/debts/LiabilityList";
import { DeleteConfirmationModal } from "@/components/ui/modal/DeleteConfirmationModal";
import toast from "react-hot-toast";

export default function DebtsPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;
    const [activeTab, setActiveTab] = useState<"overview" | "strategy">(
        "overview"
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedLender, setSelectedLender] = useState<string | null>(null);

    // Edit/Delete State
    const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Extract unique lenders
    const uniqueLenders = Array.from(
        new Set(debts.map((d) => d.lender).filter(Boolean))
    ) as string[];

    const fetchDebts = async () => {
        if (familyDetails?.id) {
            try {
                setIsLoading(true);
                const data = await debtService.getAll(familyDetails.id);
                setDebts(data || []); // Ensure array
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
    };

    React.useEffect(() => {
        fetchDebts();
    }, [familyDetails?.id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDebt(null);
        fetchDebts(); // Refresh
    };

    const handleEditDebt = (debt: Debt) => {
        setEditingDebt(debt);
        setIsModalOpen(true);
    };

    const handleDeleteDebt = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            setIsDeleting(true);
            await debtService.delete(deletingId);
            setDebts((prev) => prev.filter((d) => d.id !== deletingId));
            toast.success("Liability deleted successfully");
            setDeletingId(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete liability");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Liabilities & Debts
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Monitor loans, manage credit cards, and plan your way to
                        a debt-free life.
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 hover:from-red-500 hover:to-rose-500 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Add New Liability
                </button>
            </div>

            {/* Tabs */}
            <div className="flex w-fit items-center gap-2 rounded-2xl border border-gray-50 bg-gray-100/50 p-1.5 dark:border-gray-800/50 dark:bg-white/[0.03]">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-black transition-all ${
                        activeTab === "overview"
                            ? "bg-white text-red-600 shadow-sm ring-1 ring-black/5 dark:bg-gray-900"
                            : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    }`}
                >
                    <ShieldAlert className="h-4 w-4" /> Debt Overview
                </button>
                <button
                    onClick={() => setActiveTab("strategy")}
                    className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-black transition-all ${
                        activeTab === "strategy"
                            ? "bg-white text-red-600 shadow-sm ring-1 ring-black/5 dark:bg-gray-900"
                            : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    }`}
                >
                    <Calculator className="h-4 w-4" /> Payoff Strategy
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Content (8/12) */}
                <div className="col-span-12 space-y-8 xl:col-span-8">
                    {activeTab === "overview" ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-300">
                            <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row dark:border-gray-800 dark:bg-gray-900">
                                <div className="relative w-full flex-1">
                                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Search liabilities..."
                                        className="w-full rounded-2xl border border-transparent bg-gray-50 py-2 pr-4 pl-12 text-sm font-medium transition-all focus:ring-2 focus:ring-red-500/20 dark:bg-gray-800/50"
                                    />
                                </div>
                                <button
                                    onClick={() =>
                                        setIsFilterVisible(!isFilterVisible)
                                    }
                                    className={`flex items-center gap-2 rounded-2xl border px-6 py-2 text-sm font-bold transition-all ${isFilterVisible ? "border-red-200 bg-red-50 text-red-600" : "border-transparent bg-gray-50 text-gray-500 dark:bg-gray-900"}`}
                                >
                                    <Filter className="h-4 w-4" /> Filters
                                </button>
                            </div>

                            {isFilterVisible && (
                                <div className="animate-in slide-in-from-top-4 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm duration-300 dark:border-gray-800 dark:bg-gray-900">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                Lender
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedLender || ""}
                                                    onChange={(e) =>
                                                        setSelectedLender(
                                                            e.target.value ||
                                                                null
                                                        )
                                                    }
                                                    className="w-full appearance-none rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800/50"
                                                >
                                                    <option value="">
                                                        All Lenders
                                                    </option>
                                                    {uniqueLenders.map(
                                                        (lender) => (
                                                            <option
                                                                key={lender}
                                                                value={lender}
                                                            >
                                                                {lender}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                onClick={() => {
                                                    setSearchTerm("");
                                                    setSelectedLender(null);
                                                }}
                                                className="w-full rounded-2xl bg-gray-100 py-3 text-[10px] font-black tracking-widest text-gray-600 uppercase transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <LiabilityList
                                debts={debts.filter((d) => {
                                    const matchesSearch = d.lender
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase());
                                    const matchesLender =
                                        !selectedLender ||
                                        d.lender === selectedLender;
                                    return matchesSearch && matchesLender;
                                })}
                                isLoading={isLoading}
                                onEdit={handleEditDebt}
                                onDelete={handleDeleteDebt}
                            />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <PayoffCalculator />
                        </div>
                    )}
                </div>

                {/* Sidebar Insights (4/12) */}
                <div className="col-span-12 space-y-6 xl:col-span-4">
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 to-rose-800 p-6 text-white shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                            <TrendingDown className="h-24 w-24" />
                        </div>
                        <p className="mb-1 text-[10px] font-black tracking-widest uppercase opacity-70">
                            Liability Ratio
                        </p>
                        <h3 className="mb-4 text-2xl font-black">
                            Moderate Risk
                        </h3>
                        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
                            <div className="h-full w-[42%] rounded-full bg-rose-400" />
                        </div>
                        <p className="text-xs leading-relaxed font-medium opacity-90">
                            Your debt-to-income ratio is 42%. Reducing this to
                            below 35% will significantly improve your loan
                            eligibility.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h4 className="mb-4 text-sm font-black tracking-wider text-gray-800 uppercase dark:text-white">
                            Upcoming Dues
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                        HDFC Home EMI
                                    </span>
                                </div>
                                <span className="text-xs font-black text-gray-900 dark:text-white">
                                    Jan 15
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                        SBI Credit Card
                                    </span>
                                </div>
                                <span className="text-xs font-black text-gray-900 dark:text-white">
                                    Jan 18
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-900/10">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        <p className="text-[10px] leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                            Paying off small debts first ("Snowball Method") can
                            help build psychological momentum. Check the
                            Strategy tab!
                        </p>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-4xl p-10"
            >
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[2rem] border-2 border-red-100 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        {editingDebt ? "Edit Liability" : "Record a Liability"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {editingDebt
                            ? "Update the details of your liability."
                            : "Link a loan or credit card to track your repayment journey."}
                    </p>
                </div>
                <AddLiabilityForm
                    onSuccess={closeModal}
                    onCancel={closeModal}
                    familyId={familyDetails?.id}
                    initialData={editingDebt}
                />
            </Modal>

            <DeleteConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Liability"
                description="Are you sure you want to delete this liability? All related repayments and schedules will also be removed."
                isDeleting={isDeleting}
            />
        </div>
    );
}
