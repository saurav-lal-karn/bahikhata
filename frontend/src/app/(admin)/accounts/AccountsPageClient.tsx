"use client";
import React, { useEffect, useState } from "react";
import {
    Plus,
    ArrowLeftRight,
    Banknote,
    CreditCard,
    Building2,
    TrendingUp,
    History,
    Info,
    Wallet,
    Trash2,
    Filter,
    ChevronDown,
    Search,
} from "lucide-react";

import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import { WalletCard } from "@/components/accounts/WalletCard";
import { InternalTransferForm } from "@/components/accounts/InternalTransferForm";
import { AddAccountForm } from "@/components/accounts/AddAccountForm";
import { WalletInfoType, WalletType, WalletTransfer } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { walletTypeService } from "@/services/walletTypeService";
import { walletService } from "@/services/walletService";
import { formatCurrency } from "@/lib/utils";

export default function AccountsPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const [walletTypes, setWalletTypes] = useState<WalletType[]>([]);
    const [wallets, setWallets] = useState<WalletInfoType[]>([]);
    const [allWallets, setAllWallets] = useState<WalletInfoType[]>([]);
    const [transfers, setTransfers] = useState<WalletTransfer[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [walletToDelete, setWalletToDelete] = useState<WalletInfoType | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (isInitial: boolean = false) => {
        if (!familyDetails?.id) return;

        setIsLoading(true);
        try {
            if (isInitial) {
                // Full initial load
                const [typesRes, allWalletsRes, transfersRes] =
                    await Promise.all([
                        walletTypeService.getWalletTypes(familyDetails.id),
                        walletService.getWallets(familyDetails.id, 1, 100), // Broad fetch for stats/forms/initial page
                        walletService.getWalletTransfers(familyDetails.id),
                    ]);

                setWalletTypes(typesRes);
                setAllWallets(allWalletsRes.wallets);
                setTotalCount(allWalletsRes.total_count);
                setTransfers(transfersRes);

                // Derive the first page display from the broad fetch
                if (currentPage === 1) {
                    setWallets(allWalletsRes.wallets.slice(0, pageSize));
                } else {
                    // If user was on a different page, fetch that specifically
                    const walletsRes = await walletService.getWallets(
                        familyDetails.id,
                        currentPage,
                        pageSize
                    );
                    setWallets(walletsRes.wallets);
                }
            } else {
                // Just a page change
                // If it's page 1 and we have the cache, use it
                if (currentPage === 1 && allWallets.length > 0) {
                    setWallets(allWallets.slice(0, pageSize));
                } else {
                    const walletsRes = await walletService.getWallets(
                        familyDetails.id,
                        currentPage,
                        pageSize
                    );
                    setWallets(walletsRes.wallets);
                    setTotalCount(walletsRes.total_count);
                }
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load wallets");
        } finally {
            setIsLoading(false);
        }
    };

    // Load initial data only when family changes
    useEffect(() => {
        if (familyDetails?.id) {
            fetchData(true);
        }
    }, [familyDetails?.id]);

    // Update list only when page changes (skip initial to avoid double call)
    useEffect(() => {
        // We only trigger this if we aren't in the middle of an initial family-based load
        // This effectively handles user navigation
        if (allWallets.length > 0) {
            fetchData(false);
        }
    }, [currentPage]);

    const handleTransferSuccess = () => {
        setIsTransferModalOpen(false);
        fetchData(true);
    };

    const handleDelete = async () => {
        if (!walletToDelete) return;
        try {
            await walletService.deleteWallet(walletToDelete.id);
            toast.success("Wallet deleted successfully");
            setIsDeleteModalOpen(false);
            setWalletToDelete(null);
            fetchData();
        } catch (error) {
            console.error("Failed to delete wallet:", error);
            toast.error("Failed to delete wallet");
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    // Calculate total liquid value
    const totalLiquidValue = allWallets.reduce(
        (acc, w) => acc + (w.balance + (w.starting_balance || 0)),
        0
    );
    const baseCurrency = allWallets[0]?.currency || "₹";

    const filteredWallets = wallets.filter((wallet) => {
        const matchesSearch =
            wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.wallet_issuer_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesType =
            !selectedType || wallet.wallet_type?.name === selectedType;
        const matchesBank =
            !selectedBank || wallet.wallet_issuer_name === selectedBank;

        return matchesSearch && matchesType && matchesBank;
    });

    const uniqueTypes = Array.from(
        new Set(allWallets.map((w) => w.wallet_type?.name).filter(Boolean))
    ) as string[];
    const uniqueBanks = Array.from(
        new Set(allWallets.map((w) => w.wallet_issuer_name).filter(Boolean))
    ) as string[];

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedType(null);
        setSelectedBank(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Accounts & Wallets
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Manage your bank accounts, digital wallets, and internal
                        movements.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={`flex transform items-center justify-center gap-2 rounded-2xl border px-6 py-3 font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${isFilterVisible ? "border-amber-200 bg-amber-50 text-amber-600" : "border-gray-100 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white"}`}
                    >
                        <Filter
                            className={`h-5 w-5 ${isFilterVisible ? "fill-amber-600" : ""}`}
                        />{" "}
                        Filters
                        {(selectedType || selectedBank || searchTerm) && (
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                        )}
                    </button>
                    <button
                        onClick={() => setIsTransferModalOpen(true)}
                        className="flex transform items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-6 py-3 font-bold text-gray-800 shadow-sm transition-all hover:scale-105 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <ArrowLeftRight className="h-5 w-5" /> Transfer
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:from-amber-400 hover:to-orange-500 active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> Add Account
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            {isFilterVisible && (
                <div className="animate-in slide-in-from-top-4 space-y-6 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm duration-300 dark:border-gray-800 dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div className="space-y-2">
                            <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Search Accounts
                            </label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="e.g. HDFC Bank, My Wallet..."
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-11 text-sm font-medium transition-all focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-800/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Account Type
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedType || ""}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value || null)
                                    }
                                    className="w-full appearance-none rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-800/50"
                                >
                                    <option value="">All Types</option>
                                    {uniqueTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Bank / Issuer
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedBank || ""}
                                    onChange={(e) =>
                                        setSelectedBank(e.target.value || null)
                                    }
                                    className="w-full appearance-none rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-800/50"
                                >
                                    <option value="">All Issuers</option>
                                    {uniqueBanks.map((bank) => (
                                        <option key={bank} value={bank}>
                                            {bank}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex h-full items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full rounded-2xl bg-gray-100 py-3 text-xs font-black tracking-widest text-gray-600 uppercase transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-8">
                {/* Left: Wallets List (8/12) */}
                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {filteredWallets.length > 0 ? (
                            filteredWallets.map((wallet, index) => {
                                const getWalletIcon = (typeName: string) => {
                                    switch (typeName) {
                                        case "Bank Account":
                                            return (
                                                <Building2 className="h-6 w-6" />
                                            );
                                        case "Physical Wallet":
                                            return (
                                                <Banknote className="h-6 w-6" />
                                            );
                                        case "Digital Wallet":
                                            return (
                                                <CreditCard className="h-6 w-6" />
                                            );
                                        default:
                                            return (
                                                <Wallet className="h-6 w-6" />
                                            );
                                    }
                                };

                                const getWalletColor = (typeName: string) => {
                                    switch (typeName) {
                                        case "Bank Account":
                                            return "bg-blue-50 text-blue-600";
                                        case "Physical Wallet":
                                            return "bg-amber-50 text-amber-600";
                                        case "Digital Wallet":
                                            return "bg-purple-50 text-purple-600";
                                        default:
                                            return "bg-emerald-50 text-emerald-600";
                                    }
                                };

                                return (
                                    <WalletCard
                                        key={wallet.id}
                                        id={wallet.id}
                                        name={wallet.name}
                                        type={
                                            wallet.wallet_type?.name || "Other"
                                        }
                                        balance={wallet.balance}
                                        currency={wallet.currency}
                                        accountNo={
                                            wallet.wallet_type?.name || "N/A"
                                        }
                                        bank={
                                            wallet.wallet_issuer_name || "N/A"
                                        }
                                        icon={getWalletIcon(
                                            wallet.wallet_type?.name || ""
                                        )}
                                        color={getWalletColor(
                                            wallet.wallet_type?.name || ""
                                        )}
                                        active={index === 0}
                                        onDelete={() => {
                                            setWalletToDelete(wallet);
                                            setIsDeleteModalOpen(true);
                                        }}
                                    />
                                );
                            })
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-gray-200 bg-gray-50/50 py-20 dark:border-gray-800 dark:bg-gray-800/30">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                                    <Wallet className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    No accounts found
                                </h3>
                                <p className="mt-2 max-w-xs text-center text-sm text-gray-500">
                                    Start tracking your assets by linking your
                                    first bank account or wallet.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalCount > pageSize && (
                        <div className="mt-6 flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="ml-2 text-sm font-bold text-gray-500">
                                Showing{" "}
                                <span className="text-gray-900 dark:text-white">
                                    {(currentPage - 1) * pageSize + 1}
                                </span>{" "}
                                to{" "}
                                <span className="text-gray-900 dark:text-white">
                                    {Math.min(
                                        currentPage * pageSize,
                                        totalCount
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="text-gray-900 dark:text-white">
                                    {totalCount}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 font-bold text-gray-800 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        {
                                            length: Math.ceil(
                                                totalCount / pageSize
                                            ),
                                        },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-10 w-10 rounded-xl font-bold transition-all ${currentPage === page ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(
                                                Math.ceil(
                                                    totalCount / pageSize
                                                ),
                                                prev + 1
                                            )
                                        )
                                    }
                                    disabled={
                                        currentPage ===
                                        Math.ceil(totalCount / pageSize)
                                    }
                                    className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 font-bold text-gray-800 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Transfer History & Stats (4/12) */}
                <div className="col-span-12 space-y-8 xl:col-span-4">
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h4 className="mb-6 flex items-center justify-between text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            Recent Transfers <History className="h-3.5 w-3.5" />
                        </h4>
                        <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
                            {transfers.length > 0 ? (
                                transfers.map((transfer) => (
                                    <div
                                        key={transfer.id}
                                        className="group flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-all group-hover:bg-amber-100 dark:bg-gray-800 dark:group-hover:bg-amber-900/20">
                                                <ArrowLeftRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="line-clamp-1 text-xs font-black text-gray-800 dark:text-white">
                                                    To{" "}
                                                    {transfer.to_wallet?.name}
                                                </p>
                                                <p className="text-[9px] font-medium text-gray-400">
                                                    {formatDate(transfer.date)}{" "}
                                                    • Internal
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-gray-900 dark:text-white">
                                            {formatCurrency(transfer.amount)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-center text-xs text-gray-400 italic">
                                    No recent transfers.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-600 to-orange-700 p-8 text-white shadow-xl">
                        <div className="absolute right-0 bottom-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                            <Building2 className="h-24 w-24" />
                        </div>
                        <p className="mb-1 text-[10px] font-black tracking-widest uppercase opacity-70">
                            Total Liquid Value
                        </p>
                        <h3 className="mb-4 text-3xl font-black">
                            {baseCurrency}{" "}
                            {(totalLiquidValue / 100000).toFixed(2)} Lakhs
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-100">
                            <TrendingUp className="h-4 w-4" /> Calculated
                            dynamically
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-800/50 dark:bg-amber-900/10">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <p className="text-[10px] leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                            Internal transfers between your own accounts do not
                            affect your expense budget.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="max-w-2xl p-10"
            >
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[2rem] border-2 border-amber-100 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                        <Wallet className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        Link New Account
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Add a bank account or liquid asset to your dashboard.
                    </p>
                </div>
                <AddAccountForm
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                    familyId={familyDetails?.id || ""}
                    walletTypes={walletTypes}
                />
            </Modal>

            <Modal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                className="max-w-2xl p-10"
            >
                <h3 className="mb-6 text-2xl font-black text-gray-800 dark:text-white">
                    Internal Transfer
                </h3>
                <InternalTransferForm
                    onSuccess={handleTransferSuccess}
                    onCancel={() => setIsTransferModalOpen(false)}
                    wallets={allWallets}
                    familyId={familyDetails?.id || ""}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="max-w-md p-8 text-center"
            >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                    <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mb-2 text-xl font-black text-gray-900 dark:text-white">
                    Delete this wallet?
                </h3>
                <p className="mb-8 text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <strong>{walletToDelete?.name}</strong>? This action cannot
                    be undone and will remove all associated transaction
                    history.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-500/30 transition-colors hover:bg-red-700"
                    >
                        Confirm Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}
