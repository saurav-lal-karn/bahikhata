"use client";
import React from "react";
import { CreditCard, Calendar, AlertCircle, TrendingUp } from "lucide-react";

const cards = [
    {
        id: "1",
        name: "HDFC Regalia Gold",
        bank: "HDFC Bank",
        limit: 500000,
        balance: 85000,
        dueDate: "Jan 18",
        statementDate: "Jan 03",
        color: "from-blue-600 to-indigo-700",
        lastDigits: "4582",
    },
    {
        id: "2",
        name: "SBI SimplyClick",
        bank: "SBI Bank",
        limit: 200000,
        balance: 42000,
        dueDate: "Jan 25",
        statementDate: "Jan 10",
        color: "from-emerald-600 to-teal-700",
        lastDigits: "9921",
    },
];

export const CreditCardOverview = () => {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex items-center justify-between border-b border-gray-50 p-6 dark:border-gray-800">
                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white/90">
                    <CreditCard className="h-6 w-6 text-rose-500" /> Credit Card
                    Monitor
                </h3>
                <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-black tracking-widest text-gray-400 uppercase dark:bg-gray-800">
                    {cards.length} Cards Active
                </span>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {cards.map((card) => {
                        const utilization = Math.round(
                            (card.balance / card.limit) * 100
                        );
                        const isHigh = utilization > 30;

                        return (
                            <div key={card.id} className="group relative">
                                <div
                                    className={`rounded-[2rem] bg-gradient-to-br p-6 ${card.color} relative overflow-hidden text-white shadow-xl transition-transform group-hover:-translate-y-1`}
                                >
                                    {/* Card Chips & Design */}
                                    <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                                        <CreditCard className="h-24 w-24" />
                                    </div>

                                    <div className="mb-10 flex items-start justify-between">
                                        <div>
                                            <p className="mb-1 text-[10px] font-black tracking-widest uppercase opacity-70">
                                                {card.bank}
                                            </p>
                                            <h4 className="text-lg font-black">
                                                {card.name}
                                            </h4>
                                        </div>
                                        <div className="h-8 w-10 rounded-lg border border-white/20 bg-white/20 backdrop-blur-md" />
                                    </div>

                                    <div className="mb-8">
                                        <p className="mb-1 text-center text-[10px] font-black tracking-widest uppercase opacity-70">
                                            Current Outstanding
                                        </p>
                                        <h3 className="text-center text-3xl font-black">
                                            ₹{card.balance.toLocaleString()}
                                        </h3>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <p className="font-mono text-sm font-bold tracking-widest opacity-80">
                                            **** **** **** {card.lastDigits}
                                        </p>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black tracking-widest uppercase opacity-60">
                                                Expires
                                            </p>
                                            <p className="font-mono text-xs font-bold">
                                                12/28
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Details Panel */}
                                <div className="mt-4 space-y-4 rounded-3xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/30">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                Utilization
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-sm font-black ${isHigh ? "text-red-500" : "text-emerald-500"}`}
                                                >
                                                    {utilization}%
                                                </span>
                                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <div
                                                        className={`h-full rounded-full ${isHigh ? "bg-red-500" : "bg-emerald-500"}`}
                                                        style={{
                                                            width: `${utilization}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                Next Due
                                            </p>
                                            <p className="flex items-center justify-end gap-1.5 text-sm font-black text-gray-800 dark:text-white">
                                                <Calendar className="h-3 w-3 text-rose-500" />{" "}
                                                {card.dueDate}
                                            </p>
                                        </div>
                                    </div>

                                    {isHigh && (
                                        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-2 dark:border-red-900/30 dark:bg-red-900/10">
                                            <AlertCircle className="h-3 w-3 text-red-500" />
                                            <p className="text-[9px] font-bold tracking-tight text-red-500 uppercase">
                                                High Utilization: May impact
                                                credit score
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
