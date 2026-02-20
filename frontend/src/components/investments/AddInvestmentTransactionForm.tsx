"use client";
import React, { useState } from "react";
import { TrendingUp, Calendar, Info, Layers } from "lucide-react";
import { investmentService } from "@/services/investmentService";

interface AddInvestmentTransactionFormProps {
    investmentId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddInvestmentTransactionForm: React.FC<
    AddInvestmentTransactionFormProps
> = ({ investmentId, onSuccess, onCancel }) => {
    const [type, setType] = useState<"BUY" | "SELL" | "DIVIDEND">("BUY");
    const [quantity, setQuantity] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await investmentService.addTransaction(investmentId, {
                type,
                quantity: parseFloat(quantity),
                price_per_unit: parseFloat(pricePerUnit),
                transaction_date: new Date(date).toISOString(),
            });
            onSuccess();
        } catch (error) {
            console.error("Failed to add investment transaction:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Transaction Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(["BUY", "SELL", "DIVIDEND"] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`rounded-xl border py-2 text-[10px] font-black tracking-widest uppercase transition-all ${
                                    type === t
                                        ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                        : "border-gray-100 bg-white text-gray-400 hover:text-gray-600 dark:border-gray-800 dark:bg-gray-900"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            Quantity
                        </label>
                        <div className="relative">
                            <Layers className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                step="any"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="0.00"
                                required
                                className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            Price Per Unit
                        </label>
                        <div className="relative">
                            <TrendingUp className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                step="any"
                                value={pricePerUnit}
                                onChange={(e) =>
                                    setPricePerUnit(e.target.value)
                                }
                                placeholder="0.00"
                                required
                                className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800"
                            />
                        </div>
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
                            className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-900/10">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <p className="text-[10px] leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                        This transaction will update your holdings and average
                        buy price automatically.
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
                    className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Record Transaction"}
                </button>
            </div>
        </form>
    );
};
