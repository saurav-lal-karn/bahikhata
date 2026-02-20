"use client";
import React from "react";
import { Landmark, TrendingDown, Calendar, Clock } from "lucide-react";

const loans = [
    {
        id: "1",
        name: "Home Loan - HDFC Bank",
        principal: 4500000,
        remaining: 3250000,
        emi: 42000,
        interest: 8.5,
        tenure: "15 Years",
        left: "9 Years",
        color: "bg-blue-50 text-blue-600",
        barColor: "bg-blue-500",
    },
    {
        id: "2",
        name: "Car Loan - ICICI",
        principal: 800000,
        remaining: 320000,
        emi: 15500,
        interest: 9.2,
        tenure: "5 Years",
        left: "2 Years",
        color: "bg-indigo-50 text-indigo-600",
        barColor: "bg-indigo-500",
    },
];

export const LoanTracker = () => {
    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex items-center justify-between border-b border-gray-50 p-6 dark:border-gray-800">
                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white/90">
                    <Landmark className="h-6 w-6 text-blue-500" /> Active Loans
                </h3>
                <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-black tracking-widest text-gray-400 uppercase dark:bg-gray-800">
                    {loans.length} Loans
                </span>
            </div>

            <div className="space-y-6 p-6">
                {loans.map((loan) => {
                    const progress = Math.round(
                        ((loan.principal - loan.remaining) / loan.principal) *
                            100
                    );

                    return (
                        <div
                            key={loan.id}
                            className="group rounded-3xl border border-gray-50 p-6 transition-all hover:border-blue-100 dark:border-gray-800 dark:hover:border-blue-900/30"
                        >
                            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`rounded-2xl p-4 ${loan.color} shadow-sm transition-transform group-hover:scale-110`}
                                    >
                                        <Landmark className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-gray-800 dark:text-white">
                                            {loan.name}
                                        </h4>
                                        <div className="mt-1 flex items-center gap-3">
                                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                <TrendingDown className="h-3 w-3" />{" "}
                                                {loan.interest}% Int.
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                <Clock className="h-3 w-3" />{" "}
                                                {loan.left} left
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end text-right">
                                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Monthly EMI
                                    </p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                                        ₹{loan.emi.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                                <div>
                                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Total Loan
                                    </p>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        ₹{(loan.principal / 100000).toFixed(1)}L
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Remaining
                                    </p>
                                    <p className="text-sm font-black text-red-500">
                                        ₹{(loan.remaining / 100000).toFixed(1)}L
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Paid Off
                                    </p>
                                    <p className="text-sm font-bold text-emerald-500">
                                        ₹
                                        {(
                                            (loan.principal - loan.remaining) /
                                            100000
                                        ).toFixed(1)}
                                        L
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Tenure
                                    </p>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        {loan.tenure}
                                    </p>
                                </div>
                            </div>

                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-50 dark:bg-gray-800">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${loan.barColor} shadow-lg shadow-blue-500/10`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    {progress}% Repaid
                                </span>
                                <button className="flex items-center gap-1 text-[10px] font-black tracking-widest text-blue-600 uppercase hover:underline">
                                    View Schedule{" "}
                                    <Calendar className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
