"use client";
import React, { useEffect, useState } from "react";
import {
    ArrowUpRight,
    ArrowDownRight,
    IndianRupee,
    Search,
    Filter,
    MoreVertical,
} from "lucide-react";
import { Transaction } from "@/types";
import { transactionService } from "@/services/transactionService";
import { formatCurrency } from "@/lib/utils";

interface WalletStatementProps {
    walletId: string;
    familyId: string;
}

export const WalletStatement = ({
    walletId,
    familyId,
}: WalletStatementProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getTransactions(
                familyId,
                {
                    wallet_id: walletId,
                    page_size: 10, // Show only recent 10 for details page
                }
            );
            setTransactions(response.transactions);
            setTotalCount(response.total_count);
        } catch (error) {
            console.error("Failed to fetch wallet transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (walletId && familyId) {
            fetchTransactions();
        }
    }, [walletId, familyId]);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 dark:bg-gray-800">
                    <IndianRupee className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    No transactions found
                </h3>
                <p className="text-sm text-gray-500">
                    This wallet doesn't have any activity yet.
                </p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    Recent Statement
                </h3>
                <div className="flex gap-2">
                    <button className="rounded-xl bg-gray-50 p-2 text-gray-400 transition-colors hover:text-gray-600 dark:bg-gray-800/50 dark:hover:text-gray-200">
                        <Search className="h-4 w-4" />
                    </button>
                    <button className="rounded-xl bg-gray-50 p-2 text-gray-400 transition-colors hover:text-gray-600 dark:bg-gray-800/50 dark:hover:text-gray-200">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-800">
                                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    Transaction
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    Category
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    Date
                                </th>
                                <th className="px-8 py-5 text-right text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    Amount
                                </th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/20"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                                                    tx.type === "INCOME"
                                                        ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                                                        : "bg-red-50 text-red-600 dark:bg-red-900/20"
                                                }`}
                                            >
                                                {tx.type === "INCOME" ? (
                                                    <ArrowUpRight className="h-5 w-5" />
                                                ) : (
                                                    <ArrowDownRight className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="mb-1 text-sm leading-none font-bold text-gray-900 dark:text-white">
                                                    {tx.name}
                                                </p>
                                                <p className="max-w-[150px] truncate text-[10px] font-medium text-gray-400">
                                                    {tx.description ||
                                                        "No description"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold tracking-tight text-gray-600 uppercase dark:bg-gray-800 dark:text-gray-400">
                                            {tx.category?.name ||
                                                "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-semibold text-gray-500">
                                        {formatDate(tx.transaction_date)}
                                    </td>
                                    <td
                                        className={`px-8 py-5 text-right text-sm font-black ${
                                            tx.type === "INCOME"
                                                ? "text-green-600"
                                                : "text-gray-900 dark:text-white"
                                        }`}
                                    >
                                        {tx.type === "INCOME" ? "+" : "-"}{" "}
                                        {formatCurrency(tx.amount)}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="rounded-lg p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalCount > 10 && (
                    <div className="border-t border-gray-50 bg-gray-50/50 p-4 text-center dark:border-gray-800 dark:bg-gray-800/20">
                        <button className="text-xs font-black tracking-widest text-amber-600 uppercase transition-colors hover:text-amber-700">
                            View All Transactions
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
