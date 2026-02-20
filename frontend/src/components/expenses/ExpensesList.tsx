"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Filter,
    Download,
    Trash2,
    ShoppingCart,
    Pencil,
    MoreVertical,
    ChevronDown,
    Eye,
} from "lucide-react";
import Link from "next/link";

import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

import { transactionService } from "@/services/transactionService";
import { organizationService } from "@/services/organizationService";
import { contactService } from "@/services/contactService";
import { Transaction } from "@/types";
import { Contact } from "@/types";
import { Project } from "@/types";
import { Location } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const ExpensesList = ({
    familyId,
    refreshKey,
    onEdit,
    onDelete,
}: {
    familyId: string;
    refreshKey?: number;
    onEdit?: (expense: Transaction) => void;
    onDelete?: (id: string) => void;
}) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(
        null
    );
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    );
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
        null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [totalCount, setTotalCount] = useState(0);

    // Extract unique filter options from data
    const categories = Array.from(
        new Set(expenses.map((e) => e.category?.name).filter(Boolean))
    ) as string[];
    const methods = Array.from(
        new Set(expenses.map((e) => e.payment_method?.name).filter(Boolean))
    ) as string[];

    const filteredExpenses = expenses.filter((expense) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            !searchTerm ||
            expense.title?.toLowerCase().includes(search) ||
            false ||
            expense.category?.name?.toLowerCase().includes(search) ||
            false ||
            expense.contact?.name?.toLowerCase().includes(search) ||
            false;
        const matchesCategory =
            !selectedCategory || expense.category?.name === selectedCategory;
        const matchesMethod =
            !selectedMethod || expense.payment_method?.name === selectedMethod;

        return matchesSearch && matchesCategory && matchesMethod;
    });

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedMethod(null);
        setSelectedContactId(null);
        setSelectedProjectId(null);
        setSelectedLocationId(null);
        setSearchTerm("");
    };

    useEffect(() => {
        const fetchOptions = async () => {
            if (!familyId) return;
            try {
                const [c, p, loc] = await Promise.all([
                    contactService.getContacts(familyId),
                    organizationService.getProjects(familyId),
                    organizationService.getLocations(familyId).catch(() => []),
                ]);
                setContacts(c);
                setProjects(p);
                setLocations(loc);
            } catch (e) {
                console.error("Failed to fetch filter options", e);
            }
        };
        fetchOptions();
    }, [familyId]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const params: Record<
                    string,
                    string | number | boolean | undefined
                > = {
                    type: "EXPENSE",
                    page: currentPage,
                    page_size: pageSize,
                };
                if (selectedContactId) params.contact_id = selectedContactId;
                if (selectedProjectId) params.project_id = selectedProjectId;
                if (selectedLocationId) params.location_id = selectedLocationId;
                const response = await transactionService.getTransactions(
                    familyId,
                    params
                );
                setExpenses(response.transactions);
                setTotalCount(response.total_count);
            } catch (error) {
                console.error("Failed to fetch expenses:", error);
            }
        };
        if (familyId && familyId !== "") {
            fetchExpenses();
        }
    }, [
        familyId,
        refreshKey,
        selectedContactId,
        selectedProjectId,
        selectedLocationId,
        currentPage,
        pageSize,
    ]);

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Table Header / Actions */}
            <div className="space-y-4 border-b border-gray-100 p-6 md:flex md:items-center md:justify-between md:space-y-0 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    All Expenses
                </h3>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none sm:w-64 dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${isFilterVisible ? "border-purple-200 bg-purple-50 text-purple-600 shadow-sm" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900"}`}
                    >
                        <Filter
                            className={`h-4 w-4 ${isFilterVisible ? "fill-purple-600" : ""}`}
                        />{" "}
                        Filters
                        {(selectedCategory ||
                            selectedMethod ||
                            selectedContactId ||
                            selectedProjectId ||
                            selectedLocationId) && (
                            <span className="flex h-2 w-2 rounded-full bg-purple-500" />
                        )}
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">
                        <Download className="h-4 w-4" /> Export
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            {isFilterVisible && (
                <div className="animate-in slide-in-from-top-4 border-b border-gray-100 bg-gray-50/50 p-6 duration-300 dark:border-gray-800 dark:bg-gray-800/20">
                    <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCategory || ""}
                                    onChange={(e) =>
                                        setSelectedCategory(
                                            e.target.value || null
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Payment Method
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedMethod || ""}
                                    onChange={(e) =>
                                        setSelectedMethod(
                                            e.target.value || null
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <option value="">All Methods</option>
                                    {methods.map((method) => (
                                        <option key={method} value={method}>
                                            {method}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Contact / Vendor
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedContactId || ""}
                                    onChange={(e) =>
                                        setSelectedContactId(
                                            e.target.value || null
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <option value="">All Contacts</option>
                                    {contacts.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Project
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedProjectId || ""}
                                    onChange={(e) =>
                                        setSelectedProjectId(
                                            e.target.value || null
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <option value="">All Projects</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Location
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedLocationId || ""}
                                    onChange={(e) =>
                                        setSelectedLocationId(
                                            e.target.value || null
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.name}
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
                        <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Transaction
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Details
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Category
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Method
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Tags
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredExpenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {/* <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${expense.iconBg} shadow-sm transform group-hover:scale-110 transition-transform`}>
                      {expense.icon}
                    </div> */}
                                        <div>
                                            <h4 className="mb-1 text-sm leading-tight font-bold text-gray-800 dark:text-white/90">
                                                <Link
                                                    href={`/transactions/${expense.id}`}
                                                    className="transition-colors hover:text-emerald-500"
                                                >
                                                    {expense.title}
                                                </Link>
                                            </h4>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {(expense.contact?.name ||
                                            expense.project?.name ||
                                            expense.location?.name) && (
                                            <div className="mt-1 flex flex-wrap gap-1.5">
                                                {expense.contact?.name && (
                                                    <span className="inline-flex items-center rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                        {expense.contact.name}
                                                    </span>
                                                )}
                                                {expense.project?.name && (
                                                    <span className="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                                        {expense.project.name}
                                                    </span>
                                                )}
                                                {expense.location?.name && (
                                                    <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                                        {expense.location.name}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        {expense.category?.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 italic dark:text-gray-400">
                                    {expense.payment_method?.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {formatDateTime(expense.transaction_date)}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-black text-gray-900 dark:text-white">
                                    -{" "}
                                    {formatCurrency(
                                        expense.amount,
                                        "en-IN",
                                        "INR"
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {expense.tags &&
                                            expense.tags.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1.5">
                                                    {expense.tags?.map(
                                                        (tag) => (
                                                            <span
                                                                key={tag}
                                                                className="inline-flex items-center rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                                                            >
                                                                {tag}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (expense.id) {
                                                    setActiveMenu(
                                                        activeMenu ===
                                                            expense.id
                                                            ? null
                                                            : expense.id
                                                    );
                                                }
                                            }}
                                            className="dropdown-toggle p-2 text-gray-400 transition-all hover:text-gray-600 dark:hover:text-white"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>

                                        <Dropdown
                                            isOpen={activeMenu === expense.id}
                                            onClose={() => setActiveMenu(null)}
                                            className="w-32"
                                        >
                                            <DropdownItem
                                                onClick={() => {
                                                    setActiveMenu(null);
                                                    router.push(
                                                        `/transactions/${expense.id}`
                                                    );
                                                }}
                                            >
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Eye className="h-4 w-4" />
                                                    <span>View</span>
                                                </div>
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => {
                                                    setActiveMenu(null);
                                                    if (onEdit) onEdit(expense);
                                                }}
                                            >
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Pencil className="h-4 w-4" />
                                                    <span>Edit</span>
                                                </div>
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => {
                                                    setActiveMenu(null);
                                                    if (onDelete && expense.id)
                                                        onDelete(expense.id);
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
                {filteredExpenses.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                            <ShoppingCart className="h-8 w-8" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">
                            No expenses found
                        </h4>
                        <p className="text-sm text-gray-500">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between border-t border-gray-100 p-6 dark:border-gray-800">
                <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-bold text-gray-800 dark:text-white/90">
                        {(currentPage - 1) * pageSize + 1}
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
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage * pageSize >= totalCount}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
