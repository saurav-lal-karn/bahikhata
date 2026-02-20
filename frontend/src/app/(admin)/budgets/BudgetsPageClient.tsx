"use client";
import React, { useEffect, useState } from "react";
import {
    Target,
    TrendingUp,
    Sparkles,
    History,
    Plus,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    ChevronDown,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { BudgetList } from "@/components/budgets/BudgetList";
import { AddBudgetForm } from "@/components/budgets/AddBudgetForm";
import { PredictiveBudgetPanel } from "@/components/budgets/PredictiveBudgetPanel";
import { useAuth } from "@/context/AuthContext";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { budgetService } from "@/services/budgetService";
import type { BudgetAlert } from "@/services/budgetService";
import { ExpenseCategory, Budget } from "@/types";
import { AlertCircle, CheckCheck } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DeleteConfirmationModal } from "@/components/ui/modal/DeleteConfirmationModal";
import toast from "react-hot-toast";

export default function BudgetsPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;

    const [activeTab, setActiveTab] = useState<
        "active" | "suggestions" | "archives"
    >("active");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDate, setActiveDate] = useState(new Date());

    const navigateMonth = (direction: "prev" | "next") => {
        setActiveDate((prev) => {
            const newDate = new Date(prev);
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(activeDate);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
    const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

    // Edit/Delete State
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBudget(null);
        // Refresh budgets
        if (familyDetails?.id) {
            budgetService.getBudgets(familyDetails.id).then(setBudgets);
        }
    };

    const handleEditBudget = (budget: Budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const handleDeleteBudget = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            setIsDeleting(true);
            await budgetService.deleteBudget(deletingId);
            setBudgets((prev) => prev.filter((b) => b.id !== deletingId));
            toast.success("Budget deleted successfully");
            setDeletingId(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete budget");
        } finally {
            setIsDeleting(false);
        }
    };

    // Month Picker Logic
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setPickerYear(activeDate.getFullYear());
    }, [activeDate]);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = new Date(activeDate);
        newDate.setFullYear(pickerYear);
        newDate.setMonth(monthIndex);
        setActiveDate(newDate);
        setIsMonthPickerOpen(false);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!familyDetails?.id) return;

            try {
                setIsLoading(true);
                const [categoriesResponse, budgetsResponse] = await Promise.all(
                    [
                        transactionCategoryService.getCategories(
                            familyDetails.id,
                            true,
                            "EXPENSE"
                        ),
                        budgetService.getBudgets(familyDetails.id),
                    ]
                );

                if (isMounted) {
                    setCategories(categoriesResponse);
                    setBudgets(budgetsResponse);
                }
                budgetService
                    .getAlerts(familyDetails.id)
                    .then((data) => isMounted && setAlerts(data))
                    .catch(() => isMounted && setAlerts([]));
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to fetch data:", error);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [familyDetails]);

    const handleAcknowledgeAlert = async (alertId: string) => {
        try {
            setAcknowledgingId(alertId);
            await budgetService.acknowledgeAlert(alertId);
            setAlerts((prev) => prev.filter((a) => a.id !== alertId));
        } catch (e) {
            console.error("Failed to acknowledge alert", e);
        } finally {
            setAcknowledgingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Budget Manager
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Plan your spending and save for what matters most.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-2xl border border-gray-100 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <button
                            onClick={() => navigateMonth("prev")}
                            className="p-2 text-gray-400 transition-colors hover:text-blue-500"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="relative">
                            <div
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() =>
                                    setIsMonthPickerOpen(!isMonthPickerOpen)
                                }
                            >
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <span className="min-w-[100px] text-center text-sm font-black text-gray-800 dark:text-white">
                                    {formattedDate}
                                </span>
                            </div>

                            <Dropdown
                                isOpen={isMonthPickerOpen}
                                onClose={() => setIsMonthPickerOpen(false)}
                                className="top-full left-1/2 mt-2 w-72 -translate-x-1/2 p-4"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() =>
                                                setPickerYear(
                                                    (prev) => prev - 1
                                                )
                                            }
                                            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <ChevronLeft className="h-4 w-4 text-gray-600" />
                                        </button>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {pickerYear}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setPickerYear(
                                                    (prev) => prev + 1
                                                )
                                            }
                                            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <ChevronRight className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {monthNames.map((month, index) => (
                                            <button
                                                key={month}
                                                onClick={() =>
                                                    handleMonthSelect(index)
                                                }
                                                className={`rounded-lg p-2 text-xs font-medium transition-colors ${
                                                    activeDate.getMonth() ===
                                                        index &&
                                                    activeDate.getFullYear() ===
                                                        pickerYear
                                                        ? "bg-blue-600 text-white"
                                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                } `}
                                            >
                                                {month.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Dropdown>
                        </div>
                        <button
                            onClick={() => navigateMonth("next")}
                            className="p-2 text-gray-400 transition-colors hover:text-blue-500"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:from-purple-500 hover:to-indigo-500 active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> Set Budget
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex w-fit items-center gap-2 rounded-2xl border border-gray-50 bg-gray-100/50 p-1.5 dark:border-gray-800/50 dark:bg-white/[0.03]">
                    {[
                        {
                            id: "active",
                            label: "Active Budgets",
                            icon: <Target className="h-4 w-4" />,
                        },
                        {
                            id: "suggestions",
                            label: "AI Suggestions",
                            icon: (
                                <Sparkles className="h-4 w-4 text-amber-500" />
                            ),
                        },
                        {
                            id: "archives",
                            label: "Monthly Archives",
                            icon: <History className="h-4 w-4" />,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black transition-all ${
                                activeTab === tab.id
                                    ? "bg-white text-purple-600 shadow-sm ring-1 ring-black/5 dark:bg-gray-900"
                                    : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative isolate">
                        <button
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className={`rounded-xl border p-2.5 transition-all ${isFilterVisible ? "border-purple-200 bg-purple-50 text-purple-600" : "border-gray-100 bg-white text-gray-400 hover:text-gray-600 dark:border-gray-800 dark:bg-gray-900"}`}
                        >
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            {isFilterVisible && activeTab === "active" && (
                <div className="animate-in slide-in-from-top-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm duration-300 dark:border-gray-800 dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Search Categories
                            </label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Search budget categories..."
                                    className="w-full rounded-2xl border border-transparent bg-gray-50 py-2.5 pr-4 pl-11 text-sm font-medium transition-all focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-800/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Specific Category
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCategory || ""}
                                    onChange={(e) =>
                                        setSelectedCategory(
                                            e.target.value || null
                                        )
                                    }
                                    className="w-full appearance-none rounded-2xl border border-transparent bg-gray-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-800/50"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory(null);
                                }}
                                className="w-full rounded-2xl bg-gray-100 py-2.5 text-xs font-black tracking-widest text-gray-600 uppercase transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 space-y-6 lg:col-span-8">
                    {activeTab === "active" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <BudgetList
                                budgets={budgets.filter((b) => {
                                    const matchesSearch = b.category?.name
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase());
                                    const matchesCategory =
                                        !selectedCategory ||
                                        b.category?.name === selectedCategory;
                                    return matchesSearch && matchesCategory;
                                })}
                                isLoading={isLoading}
                                onEdit={handleEditBudget}
                                onDelete={handleDeleteBudget}
                            />
                        </div>
                    )}
                    {activeTab === "suggestions" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <PredictiveBudgetPanel />
                        </div>
                    )}
                    {activeTab === "archives" && (
                        <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                                <History className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                Historical Data
                            </h3>
                            <p className="mx-auto max-w-xs text-sm text-gray-500">
                                Track your budgeting performance over the past
                                months.
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar Insights */}
                <div className="col-span-12 space-y-6 lg:col-span-4">
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 to-purple-800 p-6 text-white shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                            <TrendingUp className="h-24 w-24" />
                        </div>
                        <p className="mb-1 text-[10px] font-black tracking-widest uppercase opacity-70">
                            Overall Health
                        </p>
                        <h3 className="mb-4 text-2xl font-black">On Track</h3>
                        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
                            <div className="h-full w-[65%] rounded-full bg-emerald-400" />
                        </div>
                        <p className="text-xs leading-relaxed font-medium opacity-90">
                            You've used 65% of your total budget. Stay below
                            ₹15,000 this week to meet your savings goal.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <h4 className="text-sm font-black tracking-wider text-gray-800 uppercase dark:text-white">
                                Budget Alerts
                            </h4>
                        </div>
                        {alerts.length === 0 ? (
                            <p className="text-xs font-medium text-gray-500">
                                No alerts right now.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {alerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="rounded-2xl border border-orange-100 bg-orange-50 p-3 dark:border-orange-800/50 dark:bg-orange-900/20"
                                    >
                                        <p className="mb-1 text-xs font-bold text-gray-800 dark:text-white">
                                            {alert.budget?.category?.name ??
                                                "Budget"}{" "}
                                            – {alert.threshold_percentage}%
                                            threshold
                                        </p>
                                        {alert.message && (
                                            <p className="mb-2 text-[10px] text-gray-600 dark:text-gray-400">
                                                {alert.message}
                                            </p>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleAcknowledgeAlert(alert.id)
                                            }
                                            disabled={
                                                acknowledgingId === alert.id
                                            }
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 hover:text-orange-700"
                                        >
                                            <CheckCheck className="h-3.5 w-3.5" />{" "}
                                            {acknowledgingId === alert.id
                                                ? "..."
                                                : "Acknowledge"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex items-center gap-2">
                            <Filter className="h-4 w-4 text-purple-600" />
                            <h4 className="text-sm font-black tracking-wider text-gray-800 uppercase dark:text-white">
                                Top Overspent
                            </h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">
                                    Entertainment
                                </span>
                                <span className="text-xs font-black text-red-500">
                                    + ₹2,400
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">
                                    Shopping
                                </span>
                                <span className="text-xs font-black text-amber-500">
                                    Near Limit
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Set Budget Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-4xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        {editingBudget
                            ? "Edit Budget"
                            : "Configure Category Budget"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {editingBudget
                            ? "Update your monthly spending limits."
                            : "Set monthly limits and enable rollover for specific needs."}
                    </p>
                </div>
                <AddBudgetForm
                    onSuccess={closeModal}
                    onCancel={closeModal}
                    categories={categories}
                    family_id={familyDetails?.id || ""}
                    initialData={editingBudget}
                />
            </Modal>

            <DeleteConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Budget"
                description="Are you sure you want to delete this budget? This action cannot be undone."
                isDeleting={isDeleting}
            />
        </div>
    );
}
