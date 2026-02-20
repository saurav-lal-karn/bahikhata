"use client";
import React, { useState } from "react";
import {
    Building2,
    Banknote,
    CreditCard,
    Check,
    Wallet,
    ShieldCheck,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { WalletType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { walletService } from "@/services/walletService";

interface AddAccountFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    familyId: string;
    walletTypes: WalletType[];
    initialData?: any; // Using any for now to be flexible, but should be WalletInfoType
}

export const AddAccountForm: React.FC<AddAccountFormProps> = ({
    onSuccess,
    onCancel,
    familyId,
    walletTypes,
    initialData,
}) => {
    const { user } = useAuth();
    const familyCurrency = user?.family?.currency || "USD";

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        wallet_type_id: initialData?.wallet_type_id || "",
        starting_balance: initialData?.starting_balance?.toString() || "",
        currency: initialData?.currency || familyCurrency,
        provider_wallet_id: initialData?.provider_wallet_id || "",
        wallet_issuer_name: initialData?.wallet_issuer_name || "",
        description: initialData?.description || "",
        is_custom_type: false,
        custom_type_name: "",
        custom_type_description: "",
        family_id: familyId,
    });

    const isCustomType = formData.wallet_type_id === "custom";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const accountData = {
                ...formData,
                starting_balance: Number(formData.starting_balance),
                is_custom_type: isCustomType,
            };

            if (initialData) {
                await walletService.updateWallet(initialData.id, accountData);
                toast.success("Account updated successfully");
            } else {
                await walletService.createWallet(accountData);
                toast.success("Account added successfully");
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(
                initialData
                    ? "Failed to update account"
                    : "Failed to add account"
            );
        }
    };

    const accountTypeOptions = [
        ...walletTypes.map((type) => ({
            value: type.id,
            label: type.name,
        })),
        { value: "custom", label: "Other / Add Custom Type" },
    ];

    const currencies = [
        { value: "INR", label: "Indian Rupee (₹)" },
        { value: "USD", label: "US Dollar ($)" },
        { value: "EUR", label: "Euro (€)" },
        { value: "GBP", label: "British Pound (£)" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
                {/* Account Friendly Name */}
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase md:text-right dark:text-gray-300">
                        Account Name
                    </Label>
                    <div className="md:col-span-3">
                        <Input
                            required
                            placeholder="e.g. HDFC Savings"
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
                </div>

                {/* Account Type */}
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase md:text-right dark:text-gray-300">
                        Account Type
                    </Label>
                    <div className="md:col-span-3">
                        <Select
                            options={accountTypeOptions}
                            placeholder="Select Account Type"
                            onChange={(val: string) =>
                                setFormData({
                                    ...formData,
                                    wallet_type_id: val,
                                })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Currency Selector */}
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase md:text-right dark:text-gray-300">
                        Currency
                    </Label>
                    <div className="md:col-span-3">
                        <Select
                            options={currencies}
                            defaultValue={formData.currency}
                            onChange={(val: string) =>
                                setFormData({ ...formData, currency: val })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Custom Type Fields */}
                {isCustomType && (
                    <div className="animate-in slide-in-from-top-4 space-y-6 rounded-3xl border border-amber-100/50 bg-amber-50/30 p-6 duration-500 dark:border-amber-800/20 dark:bg-amber-900/5">
                        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                            <Label className="text-[10px] font-bold tracking-widest text-amber-700 uppercase md:text-right dark:text-amber-400">
                                Type Name
                            </Label>
                            <div className="md:col-span-3">
                                <Input
                                    required
                                    placeholder="e.g. Crypto Hardware Wallet"
                                    value={formData.custom_type_name}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            custom_type_name: e.target.value,
                                        })
                                    }
                                    className="h-12 rounded-2xl border-amber-200 focus:border-amber-500 dark:border-amber-800"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                            <Label className="text-[10px] font-bold tracking-widest text-amber-700 uppercase md:text-right dark:text-amber-400">
                                Type Description
                            </Label>
                            <div className="md:col-span-3">
                                <Input
                                    placeholder="e.g. Ledger Nano X"
                                    value={formData.custom_type_description}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            custom_type_description:
                                                e.target.value,
                                        })
                                    }
                                    className="h-12 rounded-2xl border-amber-200 focus:border-amber-500 dark:border-amber-800"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial Balance */}
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase md:text-right dark:text-gray-300">
                        Initial Balance
                    </Label>
                    <div className="md:col-span-3">
                        <Input
                            required
                            type="number"
                            placeholder="0.00"
                            value={formData.starting_balance}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    starting_balance: e.target.value,
                                })
                            }
                            className="h-12 rounded-2xl font-bold"
                        />
                    </div>
                </div>

                {/* Bank/Issuer Name */}
                <div className="animate-in fade-in grid grid-cols-1 items-center gap-4 duration-300 md:grid-cols-4">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase md:text-right dark:text-gray-300">
                        Bank / Issuer
                    </Label>
                    <div className="md:col-span-3">
                        <Input
                            placeholder="e.g. HDFC Bank"
                            value={formData.wallet_issuer_name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    wallet_issuer_name: e.target.value,
                                })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Account / ID / Phone */}
                <div className="animate-in fade-in grid grid-cols-1 items-center gap-4 duration-300 md:grid-cols-4">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase md:text-right dark:text-gray-300">
                        Account / ID
                    </Label>
                    <div className="md:col-span-3">
                        <Input
                            placeholder="**** 1234 or saurav@upi"
                            value={formData.provider_wallet_id}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    provider_wallet_id: e.target.value,
                                })
                            }
                            className="h-12 rounded-2xl font-mono"
                        />
                    </div>
                </div>

                {/* Description / Notes */}
                <div className="animate-in fade-in grid grid-cols-1 items-start gap-4 duration-300 md:grid-cols-4">
                    <Label className="pt-4 text-[10px] font-bold tracking-widest text-gray-700 uppercase md:text-right dark:text-gray-300">
                        Description
                    </Label>
                    <div className="md:col-span-3">
                        <textarea
                            placeholder="Add any specific details about this account..."
                            value={formData.description}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="min-h-[100px] w-full resize-none rounded-2xl border border-gray-100 bg-white p-4 text-sm transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Security Check */}
            <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-900/10">
                <ShieldCheck className="h-5 w-5 shrink-0 text-amber-500" />
                <p className="text-[10px] leading-relaxed font-medium text-gray-500 italic dark:text-gray-400">
                    Your banking data is stored locally and encrypted. Bahikhata
                    never connects directly to your bank servers.
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
                    className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-12 font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:from-amber-500 hover:to-orange-500"
                >
                    <Check className="h-5 w-5" />{" "}
                    {initialData ? "Update Account" : "Save Account"}
                </Button>
            </div>
        </form>
    );
};
