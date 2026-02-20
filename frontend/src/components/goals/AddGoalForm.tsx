"use client";
import React, { useState, useEffect } from "react";
import {
    Target,
    Landmark,
    Plane,
    ShoppingBag,
    Home,
    ShieldCheck,
    Check,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { goalService } from "@/services/goalService";
import toast from "react-hot-toast";
import DatePicker from "../form/date-picker";

import { Goal } from "@/types";

interface AddGoalFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    familyId: string;
    initialData?: Goal | null;
}

const icons = [
    { id: "home", icon: <Home className="h-5 w-5" />, label: "Home" },
    { id: "travel", icon: <Plane className="h-5 w-5" />, label: "Travel" },
    {
        id: "shopping",
        icon: <ShoppingBag className="h-5 w-5" />,
        label: "Shopping",
    },
    {
        id: "security",
        icon: <ShieldCheck className="h-5 w-5" />,
        label: "Safety",
    },
    { id: "wealth", icon: <Target className="h-5 w-5" />, label: "Wealth" },
    { id: "asset", icon: <Landmark className="h-5 w-5" />, label: "Asset" },
];

export const AddGoalForm: React.FC<AddGoalFormProps> = ({
    onSuccess,
    onCancel,
    familyId,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        target: "",
        current: "",
        deadline: "",
        description: "",
        icon: "wealth",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                target: initialData.target_amount.toString(),
                current: initialData.current_amount.toString(),
                deadline: new Date(initialData.deadline).toISOString(),
                description: initialData.description || "",
                icon: initialData.icon_name || "wealth",
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                target_amount: Number(formData.target),
                current_amount: Number(formData.current) || 0,
                description: formData.description,
                icon_name: formData.icon,
                deadline: new Date(formData.deadline).toISOString(), // Format to RFC3339
                family_id: familyId,
            };

            if (initialData) {
                await goalService.updateGoal(initialData.id, payload);
                toast.success("Goal updated successfully");
            } else {
                await goalService.createGoal(payload);
                toast.success("Goal created successfully");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to save goal:", error);
            toast.error(
                initialData ? "Failed to update goal" : "Failed to create goal"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Goal Name
                        </Label>
                        <Input
                            required
                            placeholder="e.g. Dream House Fund"
                            value={formData.name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="h-14 rounded-2xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Description (Optional)
                        </Label>
                        <textarea
                            rows={2}
                            placeholder="Why is this goal important?"
                            value={formData.description}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="w-full resize-none rounded-2xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Choose Icon
                        </Label>
                        <div className="flex flex-wrap gap-3">
                            {icons.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            icon: item.id,
                                        })
                                    }
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                                        formData.icon === item.id
                                            ? "bg-emerald-600 text-white shadow-lg ring-4 shadow-emerald-500/30 ring-emerald-100 dark:ring-emerald-900/40"
                                            : "border border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800"
                                    }`}
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Target (₹)
                            </Label>
                            <Input
                                required
                                type="number"
                                placeholder="10,00,000"
                                value={formData.target}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        target: e.target.value,
                                    })
                                }
                                className="h-14 rounded-2xl font-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Initial (₹)
                            </Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.current}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        current: e.target.value,
                                    })
                                }
                                className="h-14 rounded-2xl font-bold text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Target Date
                        </Label>
                        <DatePicker
                            id="transaction-date-picker"
                            mode="single"
                            defaultDate={formData.deadline}
                            placeholder="Select transaction date"
                            onChange={(selectedDates, dateStr) => {
                                if (dateStr) {
                                    setFormData({
                                        ...formData,
                                        deadline: dateStr,
                                    });
                                }
                            }}
                        />
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
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex h-12 transform items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-12 font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:from-emerald-500 hover:to-teal-500 active:translate-y-0"
                >
                    <Check className="h-5 w-5" />{" "}
                    {initialData ? "Update Goal" : "Start Saving"}
                </Button>
            </div>
        </form>
    );
};
