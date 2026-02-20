"use client";
import React, { useState } from "react";
import { Landmark, Calendar, Info } from "lucide-react";
import { debtService } from "@/services/debtService";

interface AddRepaymentFormProps {
    debtId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddRepaymentForm: React.FC<AddRepaymentFormProps> = ({
    debtId,
    onSuccess,
    onCancel,
}) => {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await debtService.addRepayment(debtId, {
                amount: parseFloat(amount),
                repayment_date: new Date(date).toISOString(),
            });
            onSuccess();
        } catch (error) {
            console.error("Failed to add repayment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Repayment Amount
                    </label>
                    <div className="relative">
                        <Landmark className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-red-500/20 dark:bg-gray-800"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-red-500/20 dark:bg-gray-800"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50/50 p-4 dark:border-red-800/50 dark:bg-red-900/10">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <p className="text-[10px] leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                        This repayment will automatically reduce the remaining
                        amount of your liability.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 rounded-2xl bg-gray-100 py-3 font-bold text-gray-600 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 py-3 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:from-red-50 hover:to-rose-500 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Record Repayment"}
                </button>
            </div>
        </form>
    );
};
