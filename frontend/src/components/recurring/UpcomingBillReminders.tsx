"use client";
import React from "react";
import { BellRing, Calendar, Clock, ArrowRight } from "lucide-react";
import { RecurringTransaction } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface UpcomingBillRemindersProps {
    transactions?: RecurringTransaction[];
    isLoading?: boolean;
}

export const UpcomingBillReminders: React.FC<UpcomingBillRemindersProps> = ({
    transactions = [],
    isLoading = false,
}) => {
    if (isLoading)
        return (
            <div className="py-4 text-center text-xs">Loading alerts...</div>
        );

    // Filter valid future bills or bills due soon (ignoring past due for simplicity or showing them as overdue)
    // Let's show everything sorted by date for now
    const sorted = [...transactions].sort(
        (a, b) =>
            new Date(a.next_due_date).getTime() -
            new Date(b.next_due_date).getTime()
    );
    const upcoming = sorted.slice(0, 3); // Top 3

    const totalUpcoming = upcoming.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black text-gray-800 dark:text-white">
                    <BellRing className="h-5 w-5 text-blue-500" /> Bill Alerts
                </h3>
                <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/20">
                    {upcoming.length} Upcoming
                </span>
            </div>

            <div className="space-y-4">
                {upcoming.length === 0 ? (
                    <div className="text-center text-xs text-gray-400">
                        No upcoming bills found.
                    </div>
                ) : (
                    upcoming.map((bill) => {
                        const daysDiff = Math.ceil(
                            (new Date(bill.next_due_date).getTime() -
                                new Date().getTime()) /
                                (1000 * 3600 * 24)
                        );
                        const urgent = daysDiff <= 5;
                        const dateLabel =
                            daysDiff < 0
                                ? `Overdue ${Math.abs(daysDiff)}d`
                                : daysDiff === 0
                                  ? "Today"
                                  : `In ${daysDiff} Days`;

                        return (
                            <div
                                key={bill.id}
                                className={`group cursor-pointer rounded-2xl border p-4 transition-all ${urgent ? "border-red-100 bg-red-50/20 dark:border-red-900/40 dark:bg-red-900/10" : "border-gray-50 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30"}`}
                            >
                                <div className="mb-2 flex items-start justify-between">
                                    <div>
                                        <h4 className="text-sm leading-tight font-black text-gray-800 dark:text-white">
                                            {bill.name}
                                        </h4>
                                        <p className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                                            {bill.type}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-gray-900 dark:text-white">
                                            {formatCurrency(bill.amount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock
                                            className={`h-3 w-3 ${urgent ? "text-red-500" : "text-blue-500"}`}
                                        />
                                        <span
                                            className={`text-[10px] font-black uppercase ${urgent ? "text-red-500" : "text-gray-500"}`}
                                        >
                                            {dateLabel}
                                        </span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6 text-center dark:border-gray-800">
                <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Total Upcoming Inflow
                </p>
                <h4 className="text-xl font-black text-gray-900 dark:text-white">
                    {formatCurrency(totalUpcoming)}
                </h4>
            </div>
        </div>
    );
};
