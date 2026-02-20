"use client";
import React, { useState } from "react";
import {
    Search,
    Filter,
    Download,
    Trash2,
    Wallet,
    Briefcase,
    TrendingUp,
    CreditCard,
    Building,
    Pencil,
    MoreVertical,
    ChevronDown,
} from "lucide-react";

import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface IncomeListProps {
    incomes: Transaction[];
    isLoading: boolean;
    onEdit: (income: Transaction) => void;
    onDelete: (id: string) => void;
    currentPage: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
}

export const IncomeList = ({
    incomes,
    isLoading,
    onEdit,
    onDelete,
    currentPage,
    pageSize,
    totalCount,
    onPageChange,
}: IncomeListProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

    // Extract unique filter options
    const sources = Array.from(
        new Set(incomes.map((i) => i.category?.name).filter(Boolean))
    ) as string[];
    const wallets = Array.from(
        new Set(incomes.map((i) => i.wallet?.name).filter(Boolean))
    ) as string[];

    const filteredIncome = incomes.filter((item) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            !searchTerm ||
            item.title?.toLowerCase().includes(search) ||
            false ||
            item.category?.name?.toLowerCase().includes(search) ||
            false;
        const matchesSource =
            !selectedSource || item.category?.name === selectedSource;
        const matchesWallet =
            !selectedWallet || item.wallet?.name === selectedWallet;

        return matchesSearch && matchesSource && matchesWallet;
    });

    const clearFilters = () => {
        setSelectedSource(null);
        setSelectedWallet(null);
        setSearchTerm("");
    };

    const getIconForSource = (sourceName: string) => {
        const name = sourceName.toLowerCase();
        if (name.includes("salary")) return <Briefcase className="h-5 w-5" />;
        if (name.includes("freelance")) return <Wallet className="h-5 w-5" />;
        if (name.includes("invest")) return <TrendingUp className="h-5 w-5" />;
        if (name.includes("rent")) return <Building className="h-5 w-5" />;
        return <CreditCard className="h-5 w-5" />;
    };

    const getIconBgForSource = (sourceName: string) => {
        const name = sourceName.toLowerCase();
        if (name.includes("salary"))
            return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
        if (name.includes("freelance"))
            return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
        if (name.includes("invest"))
            return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
        if (name.includes("rent"))
            return "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    };

    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-20 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"></div>
                <p className="font-medium text-gray-500">
                    Loading your earnings...
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
            {/* Table Header / Actions */}
            <div className="space-y-4 border-b border-gray-50 p-6 md:flex md:items-center md:justify-between md:space-y-0 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    Recent Earnings
                </h3>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search earnings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2 pr-4 pl-10 text-sm transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none sm:w-64 dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${isFilterVisible ? "border-green-200 bg-green-50 text-green-600 shadow-sm" : "border-gray-100 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900"}`}
                    >
                        <Filter
                            className={`h-4 w-4 ${isFilterVisible ? "fill-green-600" : ""}`}
                        />{" "}
                        Filters
                        {(selectedSource || selectedWallet) && (
                            <span className="flex h-2 w-2 rounded-full bg-green-500" />
                        )}
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">
                        <Download className="h-4 w-4" /> Export
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            {isFilterVisible && (
                <div className="animate-in slide-in-from-top-4 border-b border-gray-50 bg-gray-50/50 p-6 duration-300 dark:border-gray-800 dark:bg-gray-800/20">
                    <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Source Category
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedSource || ""}
                                    onChange={(e) =>
                                        setSelectedSource(
                                            e.target.value || null
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-green-500/20 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <option value="">All Sources</option>
                                    {sources.map((source) => (
                                        <option key={source} value={source}>
                                            {source}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Received In
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedWallet || ""}
                                    onChange={(e) =>
                                        setSelectedWallet(
                                            e.target.value || null
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-green-500/20 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <option value="">All Wallets</option>
                                    {wallets.map((wallet) => (
                                        <option key={wallet} value={wallet}>
                                            {wallet}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pb-0.5">
                            <button
                                onClick={clearFilters}
                                className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-2.5 text-xs font-black tracking-widest text-gray-600 uppercase transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-gray-50 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Source info
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Source
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Wallet
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {filteredIncome.map((item) => (
                            <tr
                                key={item.id}
                                className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getIconBgForSource(item.category?.name || "")} shadow-sm transition-transform group-hover:rotate-12`}
                                        >
                                            {getIconForSource(
                                                item.category?.name || ""
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-sm leading-tight font-bold text-gray-800 dark:text-white/90">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                                <p className="text-[10px] font-medium tracking-wider text-green-600 uppercase dark:text-green-400">
                                                    Received
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-400">
                                        {item.category?.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 italic dark:text-gray-400">
                                    {item.wallet?.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {new Intl.DateTimeFormat("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(new Date(item.transaction_date))}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-black text-green-600 dark:text-green-400">
                                    +{" "}
                                    {formatCurrency(
                                        item.amount,
                                        "en-IN",
                                        "INR"
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenu(
                                                    activeMenu === item.id
                                                        ? null
                                                        : item.id
                                                );
                                            }}
                                            className="dropdown-toggle p-2 text-gray-400 transition-all hover:text-gray-600 dark:hover:text-white"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>

                                        <Dropdown
                                            isOpen={activeMenu === item.id}
                                            onClose={() => setActiveMenu(null)}
                                            className="w-32"
                                        >
                                            <DropdownItem
                                                onClick={() => {
                                                    onEdit(item);
                                                    setActiveMenu(null);
                                                }}
                                            >
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Pencil className="h-4 w-4" />
                                                    <span>Edit</span>
                                                </div>
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => {
                                                    onDelete(item.id);
                                                    setActiveMenu(null);
                                                }}
                                                className="font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span>Delete</span>
                                                </div>
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredIncome.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-gray-800">
                            <TrendingUp className="h-8 w-8" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">
                            No earnings found
                        </h4>
                        <p className="text-sm text-gray-500">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between border-t border-gray-50 p-6 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-500">
                    Showing{" "}
                    <span className="font-bold text-gray-800 dark:text-white/90">
                        {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-gray-800 dark:text-white/90">
                        {Math.min(currentPage * pageSize, totalCount)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-gray-800 dark:text-white/90">
                        {totalCount}
                    </span>{" "}
                    entries
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() =>
                            onPageChange(Math.max(currentPage - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="rounded-xl border border-gray-100 px-4 py-2 text-sm font-bold text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage * pageSize >= totalCount}
                        className="rounded-xl border border-gray-100 px-4 py-2 text-sm font-bold text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
