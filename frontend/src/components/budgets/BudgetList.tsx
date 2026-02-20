"use client";
import React from "react";
import {
    Utensils,
    Car,
    Tv,
    ShoppingBag,
    Zap,
    HeartPulse,
    RefreshCw,
    AlertTriangle,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";

import { Budget } from "@/types";
import { BudgetSkeleton } from "./BudgetSkeleton";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface BudgetListProps {
    budgets?: Budget[];
    isLoading?: boolean;
    onEdit?: (budget: Budget) => void;
    onDelete?: (id: string) => void;
}

const getCategoryIcon = (iconName: string = "default") => {
    // You might want to move this to a shared mapping file if used elsewhere
    // For now, mapping simplified
    const className = "w-5 h-5";
    switch (iconName.toLowerCase()) {
        case "food":
        case "utensils":
            return <Utensils className={className} />;
        case "transport":
        case "car":
            return <Car className={className} />;
        case "entertainment":
        case "tv":
            return <Tv className={className} />;
        case "shopping":
        case "shoppingbag":
            return <ShoppingBag className={className} />;
        case "utilities":
        case "zap":
            return <Zap className={className} />;
        case "health":
            return <HeartPulse className={className} />;
        default:
            return <Zap className={className} />;
    }
};

const getCategoryColor = (name: string = "") => {
    // Basic color hash or mapping based on name length/char for consistency if no explicit color
    const colors = [
        { color: "bg-orange-50 text-orange-600", barColor: "bg-orange-500" },
        { color: "bg-blue-50 text-blue-600", barColor: "bg-blue-500" },
        { color: "bg-red-50 text-red-600", barColor: "bg-red-500" },
        { color: "bg-pink-50 text-pink-600", barColor: "bg-pink-500" },
        { color: "bg-amber-50 text-amber-600", barColor: "bg-amber-500" },
        { color: "bg-emerald-50 text-emerald-600", barColor: "bg-emerald-500" },
        { color: "bg-indigo-50 text-indigo-600", barColor: "bg-indigo-500" },
    ];
    return colors[name.length % colors.length];
};

export const BudgetList: React.FC<BudgetListProps> = ({
    budgets = [],
    isLoading = false,
    onEdit,
    onDelete,
}) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    return (
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
            <div className="border-b border-gray-50 p-6 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    Category Allocation
                </h3>
            </div>
            <div className="space-y-8 p-6">
                {isLoading ? (
                    Array(3)
                        .fill(0)
                        .map((_, i) => <BudgetSkeleton key={i} />)
                ) : budgets.length > 0 ? (
                    budgets.map((budget) => {
                        // Note: Currently backend doesn't send 'spent' or 'rollover'.
                        // Mocking spent as 0 if not present, or random/calculated if we had expenses.
                        // For now, simply showing 0 spent or mocking for visual verification if needed.
                        // Let's assume 0 spent for new budgets.
                        const spent = 0;
                        const limit = budget.amount_limit;
                        const percentage =
                            limit > 0
                                ? Math.min(
                                      Math.round((spent / limit) * 100),
                                      100
                                  )
                                : 0;
                        const isOver = spent > limit;
                        const { color, barColor } = getCategoryColor(
                            budget.category?.name
                        );
                        // Note: budget.category might be populated if using Preload, otherwise use name logic?
                        // Actually DTO says 'category' is ExpenseCategory object
                        const categoryName = budget.category?.name || "Unknown";

                        return (
                            <div
                                key={budget.id}
                                className={`group relative ${activeMenu === budget.id ? "z-50" : "z-10"}`}
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`rounded-2xl p-3 ${color} transition-transform group-hover:scale-110`}
                                        >
                                            {getCategoryIcon(
                                                budget.category?.name ||
                                                    "default"
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-800 dark:text-white">
                                                {categoryName}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                {/* Rollover not in DTO yet, so hiding or can assume false */}
                                                {/* {budget.rollover && (
                             <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                               <RefreshCw className="w-2.5 h-2.5" /> Rollover
                             </div>
                           )} */}
                                                {isOver && (
                                                    <div className="flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-red-500 uppercase dark:bg-red-900/20">
                                                        <AlertTriangle className="h-2.5 w-2.5" />{" "}
                                                        Warning
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-right">
                                        <div>
                                            <p className="mb-1 text-xs leading-none font-bold tracking-widest text-gray-400 uppercase">
                                                Spent
                                            </p>
                                            <p className="text-lg font-black text-gray-900 dark:text-white">
                                                {formatCurrency(spent)}
                                                <span className="ml-1 text-xs font-bold text-gray-400">
                                                    / {formatCurrency(limit)}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(
                                                        activeMenu === budget.id
                                                            ? null
                                                            : budget.id
                                                    );
                                                }}
                                                className="dropdown-toggle p-2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-white"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>

                                            <Dropdown
                                                isOpen={
                                                    activeMenu === budget.id
                                                }
                                                onClose={() =>
                                                    setActiveMenu(null)
                                                }
                                                className="w-32"
                                            >
                                                <DropdownItem
                                                    onClick={() => {
                                                        setActiveMenu(null);
                                                        onEdit?.(budget);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Pencil className="h-4 w-4 text-gray-500" />
                                                        <span>Edit</span>
                                                    </div>
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => {
                                                        setActiveMenu(null);
                                                        onDelete?.(budget.id);
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
                                    </div>
                                </div>

                                <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-50 dark:bg-gray-800">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${isOver ? "bg-red-500 shadow-lg shadow-red-500/20" : barColor}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        {percentage}% Utilized
                                    </span>
                                    <span
                                        className={`text-[10px] font-black tracking-widest uppercase ${isOver ? "text-red-500" : "text-emerald-500"}`}
                                    >
                                        {isOver
                                            ? `Over by ${formatCurrency(spent - limit)}`
                                            : `${formatCurrency(limit - spent)} Left`}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center text-gray-500">
                        <p>No budgets configured yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
