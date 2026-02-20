"use client";
import React, { useState } from "react";
import {
    TrendingUp,
    Wallet,
    Landmark,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Search,
    PieChart,
    Gem,
    Coins,
    FileSpreadsheet,
    ChevronDown,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { AddInvestmentForm } from "@/components/investments/AddInvestmentForm";
import { BulkImportInvestments } from "@/components/investments/BulkImportInvestments";
import { useAuth } from "@/context/AuthContext";
import { investmentService } from "@/services/investmentService";
import { Investment } from "@/types";
import { InvestmentList } from "@/components/investments/InvestmentList";
import { formatCurrency } from "@/lib/utils";
import { DeleteConfirmationModal } from "@/components/ui/modal/DeleteConfirmationModal";
import toast from "react-hot-toast";

export default function InvestmentsPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Edit/Delete State
    const [editingInvestment, setEditingInvestment] =
        useState<Investment | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Extract unique investment types
    const investmentTypes = Array.from(
        new Set(investments.map((inv) => inv.type).filter(Boolean))
    ) as string[];

    const fetchInvestments = async () => {
        if (familyDetails?.id) {
            try {
                setIsLoading(true);
                const data = await investmentService.getAll(familyDetails.id);
                setInvestments(data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
    };

    React.useEffect(() => {
        fetchInvestments();
    }, [familyDetails?.id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingInvestment(null);
        fetchInvestments();
    };

    const handleEditInvestment = (investment: Investment) => {
        setEditingInvestment(investment);
        setIsModalOpen(true);
    };

    const handleDeleteInvestment = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            setIsDeleting(true);
            await investmentService.delete(deletingId);
            setInvestments((prev) => prev.filter((i) => i.id !== deletingId));
            toast.success("Investment deleted successfully");
            setDeletingId(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete investment");
        } finally {
            setIsDeleting(false);
        }
    };

    const openBulkModal = () => setIsBulkModalOpen(true);
    const closeBulkModal = () => setIsBulkModalOpen(false);

    const filteredInvestments = investments.filter((inv) => {
        const matchesSearch =
            inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !selectedType || inv.type === selectedType;

        return matchesSearch && matchesType;
    });

    const totalInvested = investments.reduce(
        (acc, inv) => acc + inv.quantity * inv.avg_buy_price,
        0
    );
    const totalCurrent = investments.reduce(
        (acc, inv) => acc + inv.quantity * inv.current_price,
        0
    );
    const totalGain =
        totalInvested > 0
            ? ((totalCurrent - totalInvested) / totalInvested) * 100
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Family Investments
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Track and manage your household's long-term wealth.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={openBulkModal}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-5 py-3 font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <FileSpreadsheet className="h-5 w-5 text-blue-600" />{" "}
                        Import
                    </button>
                    <button
                        onClick={openModal}
                        className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500 active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> Add Investment
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center gap-4">
                        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                            Total Invested
                        </p>
                    </div>
                    <h2 className="mb-1 text-3xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(totalInvested)}
                    </h2>
                    <p className="text-xs font-medium text-gray-400">
                        Principal amount across all assets
                    </p>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center gap-4">
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                            Current Value
                        </p>
                    </div>
                    <h2 className="mb-1 text-3xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(totalCurrent)}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <ArrowUpRight className="h-4 w-4" /> +
                        {totalGain.toFixed(1)}% Overall Return
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center gap-4">
                        <div className="rounded-2xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                            <Coins className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                            Net Gain
                        </p>
                    </div>
                    <h2 className="mb-1 text-3xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(totalCurrent - totalInvested)}
                    </h2>
                    <p className="text-xs font-bold tracking-wider text-emerald-500 uppercase">
                        Unrealized Profits
                    </p>
                </div>
            </div>

            {/* Portfolio List */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-50 p-6 md:flex-row dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                        Asset Allocation
                    </h3>
                    <div className="flex w-full items-center gap-3 md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-2xl border border-none bg-gray-50 py-2.5 pr-4 pl-12 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-900/50"
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className={`rounded-xl border p-2.5 transition-all ${isFilterVisible ? "border-blue-200 bg-blue-50 text-blue-600" : "border-transparent bg-gray-50 text-gray-400 dark:bg-gray-900"}`}
                        >
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                {isFilterVisible && (
                    <div className="animate-in slide-in-from-top-4 border-b border-gray-50 bg-gray-50/50 p-6 duration-300 dark:border-gray-800 dark:bg-gray-800/20">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="min-w-[200px] space-y-2">
                                <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    Asset Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedType || ""}
                                        onChange={(e) =>
                                            setSelectedType(
                                                e.target.value || null
                                            )
                                        }
                                        className="w-full appearance-none rounded-2xl border border-gray-100 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <option value="">All Types</option>
                                        {investmentTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedType(null);
                                    setSearchTerm("");
                                }}
                                className="rounded-2xl border border-gray-100 bg-white px-6 py-2.5 text-[10px] font-black tracking-widest text-gray-500 uppercase transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-6">
                    <InvestmentList
                        investments={filteredInvestments}
                        isLoading={isLoading}
                        onEdit={handleEditInvestment}
                        onDelete={handleDeleteInvestment}
                    />
                </div>
            </div>

            {/* Add Investment Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-5xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 flex items-center gap-3 text-2xl font-black text-gray-800 dark:text-white">
                        <TrendingUp className="h-8 w-8 text-blue-500" />{" "}
                        {editingInvestment
                            ? "Edit Investment"
                            : "New Investment"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {editingInvestment
                            ? "Update details regarding this asset."
                            : "Add a new asset, stock, or fund to your portfolio."}
                    </p>
                </div>
                <AddInvestmentForm
                    onSuccess={closeModal}
                    onCancel={closeModal}
                    familyId={familyDetails?.id}
                    initialData={editingInvestment}
                />
            </Modal>

            <DeleteConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Investment"
                description="Are you sure you want to delete this investment? All transaction history and valuations associated with it will also be deleted."
                isDeleting={isDeleting}
            />

            {/* Bulk Import Modal */}
            <Modal
                isOpen={isBulkModalOpen}
                onClose={closeBulkModal}
                className="max-w-4xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        Bulk Import Portfolio
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Upload a CSV or Excel file to batch import your
                        investment history.
                    </p>
                </div>
                <BulkImportInvestments
                    onSuccess={closeBulkModal}
                    onCancel={closeBulkModal}
                />
            </Modal>
        </div>
    );
}
