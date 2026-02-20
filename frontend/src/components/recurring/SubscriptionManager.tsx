"use client";
import React from "react";
import {
    Tv,
    Wifi,
    Smartphone,
    ShieldCheck,
    ExternalLink,
    CreditCard,
    AlertCircle,
    Zap,
    MoreVertical,
    Pencil,
    Trash2,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";
import { Subscription, RecurringTransaction, RecurringInstance } from "@/types";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { recurringService } from "@/services/recurringService";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface SubscriptionManagerProps {
    transactions?: (Subscription | RecurringTransaction)[];
    isLoading?: boolean;
    onEdit?: (subscription: Subscription | RecurringTransaction) => void;
    onDelete?: (id: string) => void;
}

// Helper to determine icon/color based on type/name
const getStyle = (type: string, name: string) => {
    const lowerType = type.toLowerCase();
    const lowerName = name.toLowerCase();

    if (
        lowerType === "entertainment" ||
        lowerName.includes("netflix") ||
        lowerName.includes("prime")
    ) {
        return {
            icon: <Tv className="h-5 w-5" />,
            color: "bg-red-50 text-red-600",
        };
    }
    if (
        lowerType === "utilities" ||
        lowerName.includes("fiber") ||
        lowerName.includes("wifi")
    ) {
        return {
            icon: <Wifi className="h-5 w-5" />,
            color: "bg-blue-50 text-blue-600",
        };
    }
    if (
        lowerType === "utilities" ||
        lowerName.includes("fiber") ||
        lowerName.includes("wifi")
    ) {
        return {
            icon: <Wifi className="h-5 w-5" />,
            color: "bg-blue-50 text-blue-600",
        };
    }
    if (lowerName.includes("phone") || lowerType.includes("mobile")) {
        return {
            icon: <Smartphone className="h-5 w-5" />,
            color: "bg-amber-50 text-amber-600",
        };
    }
    return {
        icon: <ShieldCheck className="h-5 w-5" />,
        color: "bg-cyan-50 text-cyan-600",
    };
};

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
    transactions = [],
    isLoading = false,
    onEdit,
    onDelete,
}) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [visibleHistoryId, setVisibleHistoryId] = useState<string | null>(
        null
    );
    const [historyData, setHistoryData] = useState<
        Record<string, RecurringInstance[]>
    >({});
    const [isLoadingHistory, setIsLoadingHistory] = useState<
        Record<string, boolean>
    >({});

    const fetchInstances = async (recurringId: string) => {
        try {
            setIsLoadingHistory((prev) => ({ ...prev, [recurringId]: true }));
            const data = await recurringService.getInstances(recurringId);
            setHistoryData((prev) => ({ ...prev, [recurringId]: data }));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingHistory((prev) => ({ ...prev, [recurringId]: false }));
        }
    };

    const toggleHistory = (recurringId: string) => {
        if (visibleHistoryId === recurringId) {
            setVisibleHistoryId(null);
        } else {
            setVisibleHistoryId(recurringId);
            if (!historyData[recurringId]) {
                fetchInstances(recurringId);
            }
        }
    };

    if (isLoading)
        return (
            <div className="py-10 text-center font-medium text-gray-400">
                Crunching your subscription data...
            </div>
        );
    if (transactions.length === 0)
        return (
            <div className="py-10 text-center text-gray-500">
                No active subscriptions found.
            </div>
        );

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {transactions.map((sub) => {
                const categoryName =
                    "category" in sub
                        ? sub.category?.name
                        : (sub as RecurringTransaction).type;
                const style = getStyle(
                    categoryName || "Subscription",
                    sub.name
                );
                const nextDate =
                    "next_billing_date" in sub
                        ? sub.next_billing_date
                        : (sub as RecurringTransaction).next_due_date;

                return (
                    <div
                        key={sub.id}
                        className={`group relative flex flex-col rounded-[2.5rem] border border-b-8 border-gray-100 border-b-transparent bg-white p-8 shadow-sm transition-all hover:border-b-blue-500/30 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 ${activeMenu === sub.id ? "z-50" : "z-10"}`}
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <div
                                className={`rounded-3xl p-5 ${style.color} shadow-lg shadow-current/10 transition-transform group-hover:scale-110 group-hover:rotate-3`}
                            >
                                {style.icon}
                            </div>
                            <div className="flex items-center gap-5 text-right">
                                <div className="flex flex-col items-end">
                                    <p className="mb-1.5 text-[10px] leading-none font-black tracking-widest text-gray-400 uppercase">
                                        Monthly
                                    </p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                                        {formatCurrency(sub.amount)}
                                    </p>
                                    <span className="mt-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-500 uppercase dark:bg-blue-900/20">
                                        {sub.frequency}
                                    </span>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(
                                                activeMenu === sub.id
                                                    ? null
                                                    : sub.id
                                            );
                                        }}
                                        className="rounded-2xl bg-gray-50 p-2.5 text-gray-400 transition-all hover:rotate-90 hover:text-gray-900 dark:bg-gray-800 dark:hover:text-white"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </button>

                                    <Dropdown
                                        isOpen={activeMenu === sub.id}
                                        onClose={() => setActiveMenu(null)}
                                        className="w-48 text-left"
                                    >
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                toggleHistory(sub.id);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                                <span>
                                                    {visibleHistoryId === sub.id
                                                        ? "Hide History"
                                                        : "View Run History"}
                                                </span>
                                            </div>
                                        </DropdownItem>
                                        <div className="my-1 h-px bg-gray-50 dark:bg-gray-800" />
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                onEdit?.(sub);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Pencil className="h-4 w-4 text-gray-500" />
                                                <span>Edit Settings</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                onDelete?.(sub.id);
                                            }}
                                            className="font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete Subscription</span>
                                            </div>
                                        </DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="flex items-center gap-2 text-xl font-black text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white">
                                {sub.name}{" "}
                                <ExternalLink className="h-4 w-4 -translate-y-1 text-gray-300 opacity-0 transition-all group-hover:opacity-100" />
                            </h4>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-[10px] font-black text-gray-400 uppercase dark:border-gray-800 dark:bg-gray-800">
                                    <CreditCard className="h-3.5 w-3.5" />{" "}
                                    {"category" in sub
                                        ? sub.category?.name
                                        : (sub as RecurringTransaction).type}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-6 dark:border-gray-800">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500 opacity-75" />
                                </div>
                                <span className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                                    Active
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="mb-1 block text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    Upcoming
                                </span>
                                <p className="flex items-center gap-1.5 text-xs font-black text-gray-800 dark:text-white">
                                    <Clock className="h-3 w-3 text-amber-500" />{" "}
                                    {formatDateTime(nextDate || "")}
                                </p>
                            </div>
                        </div>

                        {visibleHistoryId === sub.id && (
                            <div className="animate-in slide-in-from-top-4 mt-8 border-t border-gray-50 pt-8 duration-500 dark:border-gray-800">
                                <h5 className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                    <Zap className="h-3.5 w-3.5 text-blue-500" />{" "}
                                    Execution Logs
                                </h5>
                                {isLoadingHistory[sub.id] ? (
                                    <div className="space-y-3">
                                        {[1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="h-12 animate-pulse rounded-2xl bg-gray-50 dark:bg-gray-800"
                                            />
                                        ))}
                                    </div>
                                ) : historyData[sub.id]?.length ? (
                                    <div className="custom-scrollbar max-h-48 space-y-3 overflow-y-auto pr-2">
                                        {historyData[sub.id].map((instance) => (
                                            <div
                                                key={instance.id}
                                                className="group/item flex items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-4 transition-all hover:border-gray-100 hover:bg-white dark:bg-gray-800/50 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`rounded-xl p-2 ${instance.status === "SUCCESS" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                                                    >
                                                        {instance.status ===
                                                        "SUCCESS" ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <XCircle className="h-3.5 w-3.5" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-gray-900 dark:text-white">
                                                            Processed
                                                        </span>
                                                        <span className="text-[10px] font-medium text-gray-400">
                                                            {new Date(
                                                                instance.execution_date
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                {instance.status === "FAILED" &&
                                                    instance.error_message && (
                                                        <span
                                                            className="max-w-[100px] truncate text-[9px] font-bold text-red-500"
                                                            title={
                                                                instance.error_message
                                                            }
                                                        >
                                                            {
                                                                instance.error_message
                                                            }
                                                        </span>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-4 text-center dark:border-gray-800 dark:bg-gray-800/50">
                                        <p className="text-[10px] font-medium text-gray-400 italic">
                                            No execution logs found for this
                                            cycle.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
