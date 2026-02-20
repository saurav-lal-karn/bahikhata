"use client";
import React from "react";
import { Investment, InvestmentTransaction } from "@/types";
import {
    TrendingUp,
    Coins,
    MoreVertical,
    Pencil,
    Trash2,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    BarChart3,
    LineChart,
} from "lucide-react";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { AddInvestmentTransactionForm } from "./AddInvestmentTransactionForm";
import { AddValuationForm } from "./AddValuationForm";
import { Modal } from "@/components/ui/modal";
import { investmentService } from "@/services/investmentService";
import { formatCurrency } from "@/lib/utils";

export interface InvestmentValuation {
    id: string;
    investment_id: string;
    price_per_unit: number;
    valuation_date: string;
    source?: string;
    created_at: string;
}

interface InvestmentListProps {
    investments?: Investment[];
    isLoading?: boolean;
    onEdit?: (investment: Investment) => void;
    onDelete?: (id: string) => void;
}

export const InvestmentList: React.FC<InvestmentListProps> = ({
    investments = [],
    isLoading = false,
    onEdit,
    onDelete,
}) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [transactionModalId, setTransactionModalId] = useState<string | null>(
        null
    );
    const [valuationModalId, setValuationModalId] = useState<string | null>(
        null
    );
    const [visibleHistoryId, setVisibleHistoryId] = useState<string | null>(
        null
    );
    const [historyData, setHistoryData] = useState<
        Record<string, InvestmentTransaction[]>
    >({});
    const [isLoadingHistory, setIsLoadingHistory] = useState<
        Record<string, boolean>
    >({});
    const [visibleValuationsId, setVisibleValuationsId] = useState<
        string | null
    >(null);
    const [valuationsData, setValuationsData] = useState<
        Record<string, InvestmentValuation[]>
    >({});
    const [isLoadingValuations, setIsLoadingValuations] = useState<
        Record<string, boolean>
    >({});

    const fetchHistory = async (investmentId: string) => {
        try {
            setIsLoadingHistory((prev) => ({ ...prev, [investmentId]: true }));
            const data = await investmentService.getTransactions(investmentId);
            setHistoryData((prev) => ({ ...prev, [investmentId]: data }));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingHistory((prev) => ({ ...prev, [investmentId]: false }));
        }
    };

    const toggleHistory = (investmentId: string) => {
        if (visibleHistoryId === investmentId) {
            setVisibleHistoryId(null);
        } else {
            setVisibleHistoryId(investmentId);
            if (!historyData[investmentId]) {
                fetchHistory(investmentId);
            }
        }
    };

    const fetchValuations = async (investmentId: string) => {
        try {
            setIsLoadingValuations((prev) => ({
                ...prev,
                [investmentId]: true,
            }));
            const data = await investmentService.getValuations(investmentId);
            setValuationsData((prev) => ({ ...prev, [investmentId]: data }));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingValuations((prev) => ({
                ...prev,
                [investmentId]: false,
            }));
        }
    };

    const toggleValuations = (investmentId: string) => {
        if (visibleValuationsId === investmentId) {
            setVisibleValuationsId(null);
        } else {
            setVisibleValuationsId(investmentId);
            if (!valuationsData[investmentId]) {
                fetchValuations(investmentId);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-24 rounded-3xl bg-gray-100 dark:bg-gray-800"
                    />
                ))}
            </div>
        );
    }

    if (investments.length === 0) {
        return (
            <div className="py-10 text-center font-medium text-gray-500">
                No investments recorded yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {investments.map((inv, index) => {
                const currentValue = inv.current_price * inv.quantity;
                const investedValue = inv.avg_buy_price * inv.quantity;
                const profit = currentValue - investedValue;
                const isProfit = profit >= 0;
                const isLastItem = index > investments.length - 3;

                return (
                    <div
                        key={inv.id}
                        className={`group relative flex flex-col rounded-3xl border border-gray-100 bg-white transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 ${activeMenu === inv.id ? "z-50" : ""}`}
                    >
                        <div className="flex flex-col items-center justify-between gap-6 p-6 sm:flex-row">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/10">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 capitalize dark:text-white">
                                        {inv.name}
                                    </h4>
                                    <div className="mt-1 flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                                            <Coins className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {inv.quantity} Units @{" "}
                                                {formatCurrency(
                                                    inv.avg_buy_price
                                                )}
                                            </span>
                                        </div>
                                        <span className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-xs font-bold text-gray-400">
                                            {inv.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-right">
                                <div>
                                    <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Current Value
                                    </p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                                        {formatCurrency(currentValue)}
                                    </p>
                                    <p
                                        className={`mt-1 text-xs font-bold ${isProfit ? "text-emerald-500" : "text-red-500"}`}
                                    >
                                        {isProfit ? "+" : ""}
                                        {formatCurrency(profit)} (
                                        {(
                                            (profit / investedValue) *
                                            100
                                        ).toFixed(1)}
                                        %)
                                    </p>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (inv.id) {
                                                setActiveMenu(
                                                    activeMenu === inv.id
                                                        ? null
                                                        : inv.id
                                                );
                                            }
                                        }}
                                        className="dropdown-toggle p-2 text-gray-400 transition-all hover:text-gray-600 dark:hover:text-white"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </button>

                                    <Dropdown
                                        isOpen={activeMenu === inv.id}
                                        onClose={() => setActiveMenu(null)}
                                        className={`w-48 text-left ${isLastItem ? "bottom-full !mt-0 mb-2 origin-bottom-right" : ""}`}
                                    >
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                setTransactionModalId(inv.id);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Plus className="h-4 w-4 text-blue-500" />
                                                <span className="font-bold">
                                                    Record Transaction
                                                </span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                setValuationModalId(inv.id);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4 text-purple-500" />
                                                <span className="font-bold">
                                                    Add Valuation
                                                </span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                toggleValuations(inv.id);
                                            }}
                                        >
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <LineChart className="h-4 w-4" />
                                                <span>
                                                    {visibleValuationsId ===
                                                    inv.id
                                                        ? "Hide Valuations"
                                                        : "View Valuations"}
                                                </span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                toggleHistory(inv.id);
                                            }}
                                        >
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {visibleHistoryId === inv.id
                                                        ? "Hide History"
                                                        : "View History"}
                                                </span>
                                            </div>
                                        </DropdownItem>
                                        <div className="my-1 h-px bg-gray-50 dark:bg-gray-800" />
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                onEdit?.(inv);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Pencil className="h-4 w-4 text-gray-500" />
                                                <span>Edit Asset</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                onDelete?.(inv.id!);
                                            }}
                                            className="font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete Asset</span>
                                            </div>
                                        </DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        {visibleHistoryId === inv.id && (
                            <div className="animate-in slide-in-from-top-2 px-6 pb-6 duration-300">
                                <div className="border-t border-gray-50 pt-6 dark:border-gray-800">
                                    <h5 className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Transaction History
                                    </h5>
                                    {isLoadingHistory[inv.id] ? (
                                        <div className="space-y-2">
                                            {[1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-10 animate-pulse rounded-xl bg-gray-50 dark:bg-gray-800"
                                                />
                                            ))}
                                        </div>
                                    ) : historyData[inv.id]?.length ? (
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {historyData[inv.id].map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-3 transition-all hover:border-gray-100 dark:bg-gray-800/50 dark:hover:border-gray-700"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`rounded-lg p-2 ${item.type === "BUY" ? "bg-emerald-50 text-emerald-600" : item.type === "SELL" ? "bg-red-50 text-red-600" : "bg-purple-50 text-purple-600"}`}
                                                        >
                                                            {item.type ===
                                                            "BUY" ? (
                                                                <ArrowUpRight className="h-3 w-3" />
                                                            ) : item.type ===
                                                              "SELL" ? (
                                                                <ArrowDownRight className="h-3 w-3" />
                                                            ) : (
                                                                <TrendingUp className="h-3 w-3" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-gray-900 dark:text-white">
                                                                {item.type}{" "}
                                                                {item.quantity}{" "}
                                                                Units
                                                            </span>
                                                            <span className="text-[10px] font-medium text-gray-400">
                                                                @ ₹
                                                                {
                                                                    item.price_per_unit
                                                                }{" "}
                                                                •{" "}
                                                                {new Date(
                                                                    item.transaction_date
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-black text-gray-800 dark:text-white">
                                                        ₹
                                                        {(
                                                            item.quantity *
                                                            item.price_per_unit
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-2 text-center text-[10px] font-medium text-gray-400 italic">
                                            No transactions recorded yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {visibleValuationsId === inv.id && (
                            <div className="animate-in slide-in-from-top-2 px-6 pb-6 duration-300">
                                <div className="border-t border-gray-50 pt-6 dark:border-gray-800">
                                    <h5 className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Valuation History
                                    </h5>
                                    {isLoadingValuations[inv.id] ? (
                                        <div className="space-y-2">
                                            {[1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-10 animate-pulse rounded-xl bg-gray-50 dark:bg-gray-800"
                                                />
                                            ))}
                                        </div>
                                    ) : valuationsData[inv.id]?.length ? (
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {valuationsData[inv.id].map((v) => (
                                                <div
                                                    key={v.id}
                                                    className="flex items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-3 transition-all hover:border-gray-100 dark:bg-gray-800/50 dark:hover:border-gray-700"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/20">
                                                            <LineChart className="h-3 w-3" />
                                                        </div>
                                                        <span className="text-[10px] font-medium text-gray-400">
                                                            {new Date(
                                                                v.valuation_date
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-black text-gray-800 dark:text-white">
                                                        ₹
                                                        {Number(
                                                            v.price_per_unit
                                                        ).toLocaleString()}
                                                        /unit
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-2 text-center text-[10px] font-medium text-gray-400 italic">
                                            No valuations recorded yet. Add one
                                            from the menu.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <Modal
                isOpen={!!transactionModalId}
                onClose={() => setTransactionModalId(null)}
                className="max-w-md p-8"
            >
                <div className="mb-6">
                    <h3 className="mb-1 text-xl font-black text-gray-800 dark:text-white">
                        Add Transaction
                    </h3>
                    <p className="text-xs font-medium text-gray-500">
                        Record a buy, sell, or dividend for this investment.
                    </p>
                </div>
                {transactionModalId && (
                    <AddInvestmentTransactionForm
                        investmentId={transactionModalId}
                        onSuccess={() => {
                            const id = transactionModalId;
                            setTransactionModalId(null);
                            if (id) fetchHistory(id);
                        }}
                        onCancel={() => setTransactionModalId(null)}
                    />
                )}
            </Modal>

            <Modal
                isOpen={!!valuationModalId}
                onClose={() => setValuationModalId(null)}
                className="max-w-md p-8"
            >
                <div className="mb-6">
                    <h3 className="mb-1 text-xl font-black text-gray-800 dark:text-white">
                        Add Valuation
                    </h3>
                    <p className="text-xs font-medium text-gray-500">
                        Record price per unit on a date for this investment.
                    </p>
                </div>
                {valuationModalId && (
                    <AddValuationForm
                        investmentId={valuationModalId}
                        onSuccess={() => {
                            const id = valuationModalId;
                            setValuationModalId(null);
                            if (id) fetchValuations(id);
                        }}
                        onCancel={() => setValuationModalId(null)}
                    />
                )}
            </Modal>
        </div>
    );
};
