"use client";
import React, { useState } from "react";
import { TrendingUp, Calendar, Info, Layers } from "lucide-react";
import { investmentService } from "@/services/investmentService";

interface AddInvestmentTransactionFormProps {
    investmentId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddInvestmentTransactionForm: React.FC<AddInvestmentTransactionFormProps> = ({ investmentId, onSuccess, onCancel }) => {
    const [type, setType] = useState<"BUY" | "SELL" | "DIVIDEND">("BUY");
    const [quantity, setQuantity] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Transaction Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['BUY', 'SELL', 'DIVIDEND'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                                    type === t 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Quantity</label>
                        <div className="relative">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                step="any"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="0.00"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Price Per Unit</label>
                        <div className="relative">
                            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                step="any"
                                value={pricePerUnit}
                                onChange={(e) => setPricePerUnit(e.target.value)}
                                placeholder="0.00"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            />
                        </div>
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
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        This transaction will update your holdings and average buy price automatically.
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
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Record Transaction"}
                </button>
            </div>
        </form>
    );
};
