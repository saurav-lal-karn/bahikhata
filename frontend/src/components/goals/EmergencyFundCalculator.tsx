"use client";
import React, { useState } from "react";
import { ShieldCheck, AlertCircle, Info, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const EmergencyFundCalculator = () => {
    const [months, setMonths] = useState(6);
    const avgExpense = 65000; // Mocked
    const recommended = avgExpense * months;
    const currentSaved = 240000; // Mocked
    const progress = Math.min(
        Math.round((currentSaved / recommended) * 100),
        100
    );

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black text-gray-800 dark:text-white">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />{" "}
                    Emergency Fund
                </h3>
                <span className="text-xs font-bold text-gray-400">
                    Security Tool
                </span>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="mb-1 flex items-center justify-between">
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            Target Duration
                        </p>
                        <span className="text-xs font-black text-emerald-600">
                            {months} Months Buffer
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {[3, 6, 12].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMonths(m)}
                                className={`flex-1 rounded-xl py-1.5 text-[10px] font-black uppercase transition-all ${
                                    months === m
                                        ? "bg-emerald-600 text-white shadow-md"
                                        : "border border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800"
                                }`}
                            >
                                {m}m
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                            Recommended
                        </span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                            {formatCurrency(recommended, "en-IN", "INR")}
                        </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                            Current Savings
                        </span>
                        <span className="text-sm font-black text-emerald-500">
                            {formatCurrency(currentSaved, "en-IN", "INR")}
                        </span>
                    </div>

                    <div className="pt-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-1 flex justify-between">
                            <span className="text-[8px] font-black text-gray-400 uppercase">
                                {progress}% Protected
                            </span>
                            <span className="text-[8px] font-black text-emerald-500 uppercase">
                                {progress === 100 ? "Secured" : "In Progress"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-[9px] leading-relaxed font-bold text-gray-400 italic">
                    <Info className="h-3 w-3 shrink-0 text-blue-500" />
                    Based on your average monthly expense of ₹
                    {avgExpense.toLocaleString()}.
                </div>
            </div>
        </div>
    );
};
