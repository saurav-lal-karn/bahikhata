"use client";
import React from "react";
import {
    CheckCircle,
    AlertCircle,
    Clock,
    User,
    ArrowRight,
} from "lucide-react";

const auditItems = [
    {
        id: "1",
        user: "Priya Karn",
        action: "Added Expense",
        note: "Grocery - BigBasket",
        amount: 1250,
        status: "pending",
        time: "2h ago",
    },
    {
        id: "2",
        user: "Aryan Karn",
        action: "Added Expense",
        note: "Fuel - Shell",
        amount: 3500,
        status: "verified",
        time: "5h ago",
    },
    {
        id: "3",
        user: "Saurav Karn",
        action: "Added Income",
        note: "Bonus Credit",
        amount: 50000,
        status: "pending",
        time: "1d ago",
    },
];

export const LedgerAudit = () => {
    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-50 p-6 dark:border-gray-800">
                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white/90">
                    <CheckCircle className="h-5 w-5 text-emerald-500" /> Family
                    Ledger Audit
                </h3>
                <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-black tracking-widest text-gray-400 uppercase dark:bg-gray-800">
                    Verification Queue
                </span>
            </div>

            <div className="space-y-4 p-6">
                {auditItems.map((item) => (
                    <div
                        key={item.id}
                        className="group flex flex-col justify-between rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-all hover:border-emerald-100 md:flex-row md:items-center dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-emerald-900/30"
                    >
                        <div className="mb-3 flex items-center gap-4 md:mb-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-800 dark:text-white">
                                    {item.user}
                                </h4>
                                <p className="text-[10px] font-bold tracking-tight text-gray-400 uppercase">
                                    {item.action} •{" "}
                                    <span className="text-gray-500">
                                        {item.note}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900 dark:text-white">
                                    ₹{item.amount.toLocaleString()}
                                </p>
                                <div className="mt-0.5 flex items-center justify-end gap-1.5">
                                    <Clock className="h-3 w-3 text-gray-300" />
                                    <span className="text-[9px] font-bold text-gray-400">
                                        {item.time}
                                    </span>
                                </div>
                            </div>

                            {item.status === "pending" ? (
                                <button className="rounded-xl bg-emerald-600 px-4 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/20 transition-all hover:scale-105">
                                    Verify
                                </button>
                            ) : (
                                <div className="flex items-center gap-1 text-emerald-500">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-[10px] font-black tracking-widest uppercase">
                                        Done
                                    </span>
                                </div>
                            )}
                            <button className="p-2 text-gray-300 hover:text-gray-500">
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3 border-t border-gray-50 bg-blue-50/50 p-4 dark:border-gray-800 dark:bg-blue-900/10">
                <AlertCircle className="h-4 w-4 shrink-0 text-blue-500" />
                <p className="text-[9px] leading-relaxed font-medium text-gray-400 italic">
                    Auditing ensures data integrity. Verified transactions are
                    marked with a green checkmark in the global reports.
                </p>
            </div>
        </div>
    );
};
