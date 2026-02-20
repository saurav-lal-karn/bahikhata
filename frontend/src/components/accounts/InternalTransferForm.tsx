import React, { useState } from "react";
import {
    ArrowLeftRight,
    Check,
    Building2,
    Banknote,
    CreditCard,
    Wallet as WalletIcon,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { WalletInfoType } from "@/types";
import { toast } from "react-hot-toast";
import { walletService } from "@/services/walletService";
import DatePicker from "../form/date-picker";

interface InternalTransferFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    wallets: WalletInfoType[];
    familyId: string;
}

export const InternalTransferForm: React.FC<InternalTransferFormProps> = ({
    onSuccess,
    onCancel,
    wallets,
    familyId,
}) => {
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        remarks: "",
    });

    const getWalletById = (id: string) => wallets.find((w) => w.id === id);

    const selectedFrom = getWalletById(formData.from);
    const selectedTo = getWalletById(formData.to);

    const availableBalance = selectedFrom
        ? selectedFrom.balance + (selectedFrom.starting_balance || 0)
        : 0;
    const isAmountInvalid =
        formData.amount !== "" && Number(formData.amount) > availableBalance;

    const getWalletIcon = (typeName?: string) => {
        switch (typeName) {
            case "Bank Account":
                return <Building2 className="h-8 w-8" />;
            case "Physical Wallet":
                return <Banknote className="h-8 w-8" />;
            case "Digital Wallet":
                return <CreditCard className="h-8 w-8" />;
            default:
                return <WalletIcon className="h-8 w-8" />;
        }
    };

    const getWalletColor = (typeName?: string) => {
        switch (typeName) {
            case "Bank Account":
                return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800";
            case "Physical Wallet":
                return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800";
            case "Digital Wallet":
                return "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800";
            default:
                return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800";
        }
    };

    const walletOptions = wallets.map((w) => ({
        value: w.id,
        label: `${w.name} (${w.currency} ${w.balance.toLocaleString()})`,
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isAmountInvalid) return;

        try {
            await walletService.createWalletTransfer({
                from_wallet_id: formData.from,
                to_wallet_id: formData.to,
                amount: Number(formData.amount),
                date: formData.date,
                remarks: formData.remarks,
                family_id: familyId,
            });
            toast.success("Transfer completed successfully!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Transfer failed:", error);
            toast.error("Failed to complete transfer. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="mb-10 flex items-center justify-center gap-6">
                <div className="max-w-[200px] flex-1 space-y-3 text-center">
                    <div
                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-2 transition-all duration-300 ${formData.from ? getWalletColor(selectedFrom?.wallet_type?.name) : "border-gray-100 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800"}`}
                    >
                        {getWalletIcon(selectedFrom?.wallet_type?.name)}
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase">
                            From Account
                        </p>
                        <Select
                            options={walletOptions}
                            placeholder="Select Source"
                            value={formData.from}
                            onChange={(val) =>
                                setFormData({ ...formData, from: val })
                            }
                            className="h-10 rounded-xl text-xs"
                        />
                    </div>
                </div>

                <div className="mt-4 rounded-full bg-gray-50 p-4 dark:bg-gray-800">
                    <ArrowLeftRight className="h-6 w-6 text-gray-400" />
                </div>

                <div className="max-w-[200px] flex-1 space-y-3 text-center">
                    <div
                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-2 transition-all duration-300 ${formData.to ? getWalletColor(selectedTo?.wallet_type?.name) : "border-gray-100 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800"}`}
                    >
                        {getWalletIcon(selectedTo?.wallet_type?.name)}
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase">
                            To Account
                        </p>
                        <Select
                            options={walletOptions.filter(
                                (opt) => opt.value !== formData.from
                            )}
                            placeholder="Select Target"
                            value={formData.to}
                            onChange={(val) =>
                                setFormData({ ...formData, to: val })
                            }
                            className="h-10 rounded-xl text-xs"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Amount
                            </Label>
                            {formData.from && (
                                <span
                                    className={`text-[10px] font-black tracking-widest uppercase ${isAmountInvalid ? "text-red-500" : "text-gray-400"}`}
                                >
                                    Max: {selectedFrom?.currency}{" "}
                                    {availableBalance.toLocaleString()}
                                </span>
                            )}
                        </div>
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
                            className={`h-14 rounded-2xl text-xl font-black transition-all ${isAmountInvalid ? "border-red-500 ring-red-500/10 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                        />
                        {isAmountInvalid && (
                            <p className="animate-in fade-in text-[10px] font-bold tracking-wider text-red-500 uppercase duration-300">
                                Insufficient funds in source account
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Date
                        </Label>
                        <DatePicker
                            id="transaction-date-picker"
                            mode="single"
                            defaultDate={formData.date}
                            placeholder="Select transaction date"
                            className="h-14 rounded-2xl"
                            onChange={(selectedDates, dateStr) => {
                                if (dateStr) {
                                    setFormData({ ...formData, date: dateStr });
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                    Remarks
                </Label>
                <Input
                    placeholder="e.g. Cash withdrawal for home expenses"
                    value={formData.remarks}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, remarks: e.target.value })
                    }
                    className="h-14 rounded-2xl"
                />
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
                    disabled={
                        !formData.from ||
                        !formData.to ||
                        !formData.amount ||
                        isAmountInvalid
                    }
                    className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-12 font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:from-amber-500 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Check className="h-5 w-5" /> Confirm Transfer
                </Button>
            </div>
        </form>
    );
};
