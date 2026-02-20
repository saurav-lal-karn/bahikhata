"use client";
import React, { useState } from "react";
import {
    TrendingUp,
    Wallet,
    Calendar,
    Plus,
    ArrowUpCircle,
    ShieldCheck,
    FileText,
    Upload,
    X,
    PieChart,
    Gem,
    Landmark,
    Coins,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

import { investmentService } from "@/services/investmentService";
import toast from "react-hot-toast";
import { Investment } from "@/types";

interface AddInvestmentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    familyId?: string;
    initialData?: Investment | null;
}

export const AddInvestmentForm: React.FC<AddInvestmentFormProps> = ({
    onSuccess,
    onCancel,
    familyId,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        type: initialData?.type || "",
        quantity: initialData?.quantity.toString() || "",
        avgBuyPrice: initialData?.avg_buy_price.toString() || "",
        currentPrice: initialData?.current_price.toString() || "",
    });

    const [isCustomType, setIsCustomType] = useState(false);
    const [customTypeName, setCustomTypeName] = useState("");

    const investmentTypes = [
        { value: "Mutual Fund", label: "Mutual Fund" },
        { value: "Stock", label: "Stock" },
        { value: "Gold", label: "Gold" },
        { value: "Fixed Deposit", label: "Fixed Deposit" },
        { value: "Real Estate", label: "Real Estate" },
        { value: "Crypto", label: "Crypto" },
        { value: "custom", label: "+ Add Custom Type" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!familyId) {
            toast.error("Family ID missing");
            return;
        }

        try {
            const type = isCustomType ? customTypeName : formData.type;
            const payload = {
                family_id: familyId,
                name: formData.name,
                type: type,
                quantity: Number(formData.quantity),
                avg_buy_price: Number(formData.avgBuyPrice),
                current_price: Number(
                    formData.currentPrice || formData.avgBuyPrice
                ),
            };

            if (initialData) {
                await investmentService.update(initialData.id!, payload);
                toast.success("Investment updated");
            } else {
                await investmentService.create(payload);
                toast.success("Investment recorded");
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to add investment", error);
            toast.error(
                initialData
                    ? "Failed to update investment"
                    : "Failed to add investment"
            );
        }
    };

    return (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Column: Visual & Info (4/12) */}
            <div className="lg:col-span-4">
                <div className="sticky top-0 flex h-full flex-col justify-center">
                    <div className="space-y-6 rounded-3xl border border-blue-100 bg-blue-50/50 p-8 text-center dark:border-blue-800/50 dark:bg-blue-900/10">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner ring-8 ring-blue-500/5 dark:bg-blue-900/20 dark:text-blue-400">
                            <TrendingUp className="h-10 w-10" />
                        </div>
                        <div>
                            <h4 className="mb-2 text-xl font-black text-gray-800 dark:text-white">
                                Build Wealth
                            </h4>
                            <p className="mx-auto text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                Recording your investments helps track long-term
                                growth and asset allocation.
                            </p>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all dark:border-gray-800 dark:bg-gray-900">
                                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                <p className="text-left text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                    Secure Records
                                </p>
                            </div>
                            <div className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all dark:border-gray-800 dark:bg-gray-900">
                                <FileText className="h-5 w-5 text-purple-500" />
                                <p className="text-left text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                    Upload Proofs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form Fields (8/12) */}
            <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Asset Name
                        </Label>
                        <Input
                            required
                            placeholder="e.g. HDFC Bluechip Fund"
                            value={formData.name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="h-14 rounded-2xl border-gray-100 bg-gray-50 transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Investment Type
                        </Label>
                        <Select
                            options={investmentTypes}
                            placeholder="Select asset type"
                            onChange={(value: string) => {
                                if (value === "custom") {
                                    setIsCustomType(true);
                                    setFormData({ ...formData, type: "" });
                                } else {
                                    setIsCustomType(false);
                                    setFormData({ ...formData, type: value });
                                }
                            }}
                            value={formData.type}
                            className="h-14 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Custom Type and Amount */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {isCustomType ? (
                        <div className="animate-in fade-in slide-in-from-top-2 space-y-2 duration-300">
                            <Label className="text-[10px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                Custom Type Name
                            </Label>
                            <Input
                                required
                                placeholder="e.g. Private Equity"
                                value={customTypeName}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setCustomTypeName(e.target.value)}
                                className="h-14 rounded-2xl border-blue-100 bg-blue-50/20 transition-all focus:border-blue-500 dark:border-blue-900/30 dark:bg-blue-900/10"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Quantity / Units
                            </Label>
                            <Input
                                required
                                type="number"
                                placeholder="e.g. 10.5"
                                value={formData.quantity}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        quantity: e.target.value,
                                    })
                                }
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 font-black transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Avg Buy Price (₹)
                        </Label>
                        <Input
                            required
                            type="number"
                            placeholder="0.00"
                            value={formData.avgBuyPrice}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    avgBuyPrice: e.target.value,
                                })
                            }
                            className="h-14 rounded-2xl border-gray-100 bg-gray-50 text-lg font-black transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Current Price (Optional)
                        </Label>
                        <Input
                            type="number"
                            placeholder="Same as Buy Price if new"
                            value={formData.currentPrice}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    currentPrice: e.target.value,
                                })
                            }
                            className="h-14 rounded-2xl border-gray-100 bg-gray-50 transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>
                    {isCustomType && (
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Quantity / Units
                            </Label>
                            <Input
                                required
                                type="number"
                                placeholder="e.g. 10.5"
                                value={formData.quantity}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        quantity: e.target.value,
                                    })
                                }
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 font-black transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-4 border-t border-gray-50 pt-6 dark:border-gray-800">
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
                        className="h-12 transform rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-12 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 active:translate-y-0"
                    >
                        {initialData ? "Update Investment" : "Save Investment"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
