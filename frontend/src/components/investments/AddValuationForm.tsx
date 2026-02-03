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

export function AddValuationForm({ investmentId, onSuccess, onCancel }: AddValuationFormProps) {
  const [valuationDate, setValuationDate] = useState(new Date().toISOString().split("T")[0]);
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
        valuation_date: new Date(valuationDate).toISOString().split("T")[0],
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
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={valuationDate}
              onChange={(e) => setValuationDate(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Price per unit (₹)</label>
          <div className="relative">
            <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              step="any"
              min="0"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              placeholder="0.00"
              required
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm font-bold focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
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
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Add Valuation"}
        </button>
      </div>
    </form>
  );
}
