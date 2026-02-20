"use client";
import React, { useState } from "react";
import { BarChart3, Calendar } from "lucide-react";
import { investmentService } from "@/services/investmentService";
import toast from "react-hot-toast";

interface AddValuationFormProps {
    investmentId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddValuationForm({
    investmentId,
    onSuccess,
    onCancel,
}: AddValuationFormProps) {
    const [valuationDate, setValuationDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(pricePerUnit);
        if (Number.isNaN(price) || price <= 0) {
            toast.error("Enter a valid price");
            return;
        }
        try {
            setIsLoading(true);
            await investmentService.addValuation(investmentId, {
                valuation_date: new Date(valuationDate)
                    .toISOString()
                    .split("T")[0],
                price_per_unit: price,
            });
            toast.success("Valuation added");
            onSuccess();
        } catch (err) {
            console.error("Failed to add valuation", err);
            toast.error("Failed to add valuation");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            value={valuationDate}
                            onChange={(e) => setValuationDate(e.target.value)}
                            required
                            className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-800"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Price per unit (₹)
                    </label>
                    <div className="relative">
                        <BarChart3 className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            step="any"
                            min="0"
                            value={pricePerUnit}
                            onChange={(e) => setPricePerUnit(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-800"
                        />
                    </div>
                </div>
            </div>
            <div className="flex gap-3 pt-4">
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
                    className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? "Saving…" : "Add Valuation"}
                </button>
            </div>
        </form>
    );
}
