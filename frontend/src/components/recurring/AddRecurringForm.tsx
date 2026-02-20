"use client";
import React, { useState } from "react";
import {
    Repeat,
    Check,
    Tv,
    Wifi,
    ExternalLink,
    ShieldCheck,
    Calendar,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

import { recurringService } from "@/services/recurringService";
import toast from "react-hot-toast";
import { RecurringTransaction } from "@/types";

interface AddRecurringFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    familyId?: string;
    initialData?: RecurringTransaction | null;
}

export const AddRecurringForm: React.FC<AddRecurringFormProps> = ({
    onSuccess,
    onCancel,
    familyId,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        amount: initialData?.amount.toString() || "",
        frequency: initialData?.frequency || "Monthly",
        category: initialData?.type || "Entertainment",
        paymentFrom: "",
        nextDate: initialData
            ? new Date(initialData.next_due_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
    });

    const frequencies = [
        { value: "Monthly", label: "Every Month" },
        { value: "Yearly", label: "Every Year (Annual)" },
        { value: "Quarterly", label: "Every 3 Months" },
        { value: "Weekly", label: "Every Week" },
    ];

    const categories = [
        { value: "Entertainment", label: "Entertainment (Netflix, Spotify)" },
        { value: "Utilities", label: "Utilities (Electricity, WiFi)" },
        { value: "Rent", label: "Rent / Housing" },
        { value: "Insurance", label: "Insurance Premiums" },
        { value: "SIP", label: "Investment (SIP/Mutual Funds)" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!familyId) {
            toast.error("Family ID missing");
            return;
        }

        try {
            const payload = {
                family_id: familyId,
                name: formData.name,
                amount: Number(formData.amount),
                frequency: formData.frequency,
                next_due_date: new Date(formData.nextDate).toISOString(),
                type: formData.category,
            };

            if (initialData) {
                await recurringService.update(initialData.id, payload);
                toast.success("Recurring transaction updated");
            } else {
                await recurringService.create(payload);
                toast.success("Recurring transaction set up");
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to set up recurring transaction", error);
            toast.error(
                initialData
                    ? "Failed to update subscription"
                    : "Failed to set up recurring transaction"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Service / Bill Name
                        </Label>
                        <Input
                            required
                            placeholder="e.g. Netflix Premium"
                            value={formData.name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Category
                        </Label>
                        <Select
                            options={categories}
                            defaultValue={formData.category}
                            onChange={(val: string) =>
                                setFormData({ ...formData, category: val })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Billing Frequency
                        </Label>
                        <Select
                            options={frequencies}
                            defaultValue={formData.frequency}
                            onChange={(val: string) =>
                                setFormData({ ...formData, frequency: val })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Cycle Amount (₹)
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
                            className="h-12 rounded-2xl font-black text-blue-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Next Due Date
                        </Label>
                        <Input
                            type="date"
                            required
                            value={formData.nextDate}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    nextDate: e.target.value,
                                })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Paid From (Wallet)
                        </Label>
                        <Input
                            placeholder="e.g. HDFC Account"
                            value={formData.paymentFrom}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    paymentFrom: e.target.value,
                                })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-900/10">
                <ShieldCheck className="h-5 w-5 shrink-0 text-blue-500" />
                <p className="text-[10px] leading-relaxed font-medium text-gray-500 italic dark:text-gray-400">
                    Automated tracking sets up a virtual reminder. You'll still
                    need to manually verify the transaction unless Bank Sync is
                    active.
                </p>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-50 pt-8 dark:border-gray-800">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="h-12 rounded-2xl px-8 font-bold text-gray-500"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-12 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500"
                >
                    <Check className="h-5 w-5" />{" "}
                    {initialData ? "Update Automation" : "Activate Automation"}
                </Button>
            </div>
        </form>
    );
};
