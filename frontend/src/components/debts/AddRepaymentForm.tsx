"use client";
import React, { useState } from "react";
import { Landmark, Calendar, Info } from "lucide-react";
import { debtService } from "@/services/debtService";

interface AddRepaymentFormProps {
    debtId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddRepaymentForm: React.FC<AddRepaymentFormProps> = ({ debtId, onSuccess, onCancel }) => {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Repayment Amount</label>
                    <div className="relative">
                        <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 p-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800/50">
                    <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        This repayment will automatically reduce the remaining amount of your liability.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold hover:from-red-50 hover:to-rose-500 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Record Repayment"}
                </button>
            </div>
        </form>
    );
};
