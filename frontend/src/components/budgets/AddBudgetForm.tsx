"use client";
import React, { useState } from "react";
import { Target, HelpCircle, RefreshCw, Info } from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ExpenseCategory } from "@/types";
import { budgetService } from "@/services/budgetService";
import toast from "react-hot-toast";

import { Budget } from "@/types";

interface AddBudgetFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    categories?: ExpenseCategory[];
    family_id?: string;
    initialData?: Budget | null;
}

export const AddBudgetForm: React.FC<AddBudgetFormProps> = ({
    onSuccess,
    onCancel,
    categories = [],
    family_id,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        category: initialData?.category?.id || "",
        amount: initialData?.amount_limit.toString() || "",
        period: "Weekly", // Assuming default as Weekly based on existing code, or map from initialData if available
        alertThreshold: "80", // Default
        rollover: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!family_id) {
            toast.error("Family ID is missing");
            return;
        }
        try {
            const category = categories.find((c) => c.id === formData.category);
            if (!category) throw new Error("Invalid Category");

            const payload = {
                category_id: category.id,
                amount_limit: Number(formData.amount),
                family_id: family_id,
                period: formData.period,
                alert_threshold: Number(formData.alertThreshold),
                currency: "INR",
                start_date: new Date().toISOString(),
                end_date: new Date(
                    new Date().setMonth(new Date().getMonth() + 1)
                ).toISOString(),
            };

            if (initialData) {
                await budgetService.updateBudget(initialData.id, payload);
                toast.success("Budget updated successfully");
            } else {
                await budgetService.createBudget(payload);
                toast.success("Budget set successfully");
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to set budget:", error);
            toast.error(
                initialData ? "Failed to update budget" : "Failed to set budget"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Expense Category
                        </Label>
                        <Select
                            options={categories.map((category) => ({
                                value: category.id,
                                label: category.name,
                            }))}
                            placeholder="Pick a category"
                            onChange={(value: string) =>
                                setFormData({ ...formData, category: value })
                            }
                            className="h-14 rounded-2xl"
                            value={formData.category}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Limit (₹)
                        </Label>
                        <Input
                            required
                            type="number"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value,
                                })
                            }
                            className="h-14 rounded-2xl border-gray-100 bg-gray-50 text-xl font-black transition-all focus:border-purple-500 dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Period
                            </Label>
                            <Select
                                options={[
                                    { value: "Weekly", label: "Weekly" },
                                    { value: "Monthly", label: "Monthly" },
                                    { value: "Yearly", label: "Yearly" },
                                ]}
                                defaultValue="Weekly"
                                onChange={(value: string) =>
                                    setFormData({ ...formData, period: value })
                                }
                                className="h-14 rounded-2xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Alert at (%)
                            </Label>
                            <Input
                                type="number"
                                placeholder="80"
                                value={formData.alertThreshold}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        alertThreshold: e.target.value,
                                    })
                                }
                                className="h-14 rounded-2xl font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-purple-100 bg-purple-50/50 p-6 dark:border-purple-800/50 dark:bg-purple-900/10">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-xl bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30">
                                <RefreshCw className="h-5 w-5" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                                Enable Rollover
                            </h4>
                            <div className="ml-auto">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            rollover: !formData.rollover,
                                        })
                                    }
                                    className={`relative h-6 w-12 rounded-full transition-colors ${formData.rollover ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"}`}
                                >
                                    <div
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${formData.rollover ? "left-7" : "left-1"}`}
                                    />
                                </button>
                            </div>
                        </div>
                        <p className="text-[11px] leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                            When enabled, any unspent funds from this budget
                            will be added to next month's allowance for this
                            category.
                        </p>
                    </div>

                    <div className="flex items-start gap-3 px-2">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        <p className="text-[10px] leading-relaxed font-bold tracking-wider text-gray-400 uppercase">
                            Budgets are calculated on the 1st of every month at
                            00:00. You can adjust limits anytime.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-50 pt-8 dark:border-gray-800">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="h-12 rounded-2xl px-8 font-bold text-gray-500"
                >
                    Discard Changes
                </Button>
                <Button
                    type="submit"
                    className="h-12 transform rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-12 font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 active:translate-y-0"
                >
                    Confirm Budget
                </Button>
            </div>
        </form>
    );
};
