"use client";
import React, { useState } from "react";
import { Coins, Calendar, Info } from "lucide-react";
import { goalService } from "@/services/goalService";

interface AddContributionFormProps {
    goalId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddContributionForm: React.FC<AddContributionFormProps> = ({ goalId, onSuccess, onCancel }) => {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await goalService.addContribution(goalId, {
                amount: parseFloat(amount),
                contribution_date: new Date(date).toISOString(),
            });
            onSuccess();
        } catch (error) {
            console.error("Failed to add contribution:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Contribution Amount</label>
                    <div className="relative">
                        <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
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
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                    <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        This contribution will automatically update the goal's current amount and progress.
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
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Record Contribution"}
                </button>
            </div>
        </form>
    );
};
