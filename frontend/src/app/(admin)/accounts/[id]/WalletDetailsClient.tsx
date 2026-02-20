"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Wallet,
    Building2,
    CreditCard,
    Banknote,
    Pencil,
    Trash2,
    Calendar,
    Info,
} from "lucide-react";
import { WalletInfoType, WalletType } from "@/types";
import { walletService } from "@/services/walletService";
import { walletTypeService } from "@/services/walletTypeService";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui/modal";
import { AddAccountForm } from "@/components/accounts/AddAccountForm";
import { WalletStatement } from "@/components/accounts/WalletStatement";
import toast from "react-hot-toast";

interface WalletDetailsClientProps {
    walletId: string;
}

export default function WalletDetailsClient({
    walletId,
}: WalletDetailsClientProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [wallet, setWallet] = useState<WalletInfoType | null>(null);
    const [walletTypes, setWalletTypes] = useState<WalletType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchWalletDetails = async () => {
        try {
            setLoading(true);
            const data = await walletService.getWallet(walletId);
            setWallet(data);
        } catch (error) {
            console.error("Failed to fetch wallet details:", error);
            toast.error("Failed to load wallet details");
            router.push("/accounts");
        } finally {
            setLoading(false);
        }
    };

    const fetchWalletTypes = async () => {
        if (user?.family?.id) {
            try {
                const types = await walletTypeService.getWalletTypes(
                    user.family.id
                );
                setWalletTypes(types);
            } catch (error) {
                console.error("Failed to fetch wallet types", error);
            }
        }
    };

    useEffect(() => {
        fetchWalletDetails();
        fetchWalletTypes();
    }, [walletId, user?.family?.id]);

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchWalletDetails();
    };

    const handleDelete = async () => {
        try {
            await walletService.deleteWallet(walletId);
            toast.success("Wallet deleted successfully");
            router.push("/accounts");
        } catch (error) {
            console.error("Failed to delete wallet:", error);
            toast.error("Failed to delete wallet");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!wallet) return null;

    const getWalletIcon = (typeName: string) => {
        switch (typeName) {
            case "Bank Account":
                return <Building2 className="h-12 w-12" />;
            case "Physical Wallet":
                return <Banknote className="h-12 w-12" />;
            case "Digital Wallet":
                return <CreditCard className="h-12 w-12" />;
            default:
                return <Wallet className="h-12 w-12" />;
        }
    };

    const currencySymbol = (code: string) => {
        switch (code) {
            case "INR":
                return "₹";
            case "USD":
                return "$";
            case "EUR":
                return "€";
            case "GBP":
                return "£";
            default:
                return code;
        }
    };

    return (
        <div className="animate-in fade-in mx-auto max-w-4xl space-y-8 duration-500">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="rounded-xl bg-gray-100 p-2 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                    Wallet Details
                </h1>
            </div>

            {/* Main Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm md:p-12 dark:border-gray-800 dark:bg-gray-900">
                {/* Background Accents */}
                <div className="pointer-events-none absolute top-0 right-0 p-12 opacity-5">
                    {getWalletIcon(wallet.wallet_type?.name || "")}
                </div>

                <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2">
                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-900/20 dark:text-amber-500">
                                {getWalletIcon(wallet.wallet_type?.name || "")}
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase">
                                    {wallet.wallet_type?.name}
                                </p>
                                <h2 className="text-3xl leading-tight font-black text-gray-900 capitalize dark:text-white">
                                    {wallet.name}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                Current Balance
                            </p>
                            <h3 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-black text-transparent md:text-5xl dark:from-white dark:to-gray-400">
                                {currencySymbol(wallet.currency)}
                                {wallet.balance.toLocaleString()}
                            </h3>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex transform items-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 font-bold text-gray-700 transition-all hover:scale-105 hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Pencil className="h-4 w-4" /> Edit
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="flex transform items-center gap-2 rounded-2xl bg-red-50 px-6 py-3 font-bold text-red-600 transition-all hover:scale-105 hover:bg-red-100 active:scale-95 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <Trash2 className="h-4 w-4" /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6 rounded-[2rem] bg-gray-50 p-8 dark:bg-gray-800/50">
                        <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                            <Info className="h-5 w-5 text-amber-500" /> Account
                            Info
                        </h4>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    Description
                                </label>
                                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {wallet.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Bank / Issuer
                                    </label>
                                    <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                                        {wallet.wallet_issuer_name || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Account / ID
                                    </label>
                                    <p className="mt-1 font-mono text-sm font-medium text-gray-600 dark:text-gray-300">
                                        {wallet.provider_wallet_id || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Starting Balance
                                    </label>
                                    <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                                        {currencySymbol(wallet.currency)}
                                        {wallet.starting_balance.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Date Created
                                    </label>
                                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(
                                            wallet.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Statement */}
            <WalletStatement
                walletId={walletId}
                familyId={user?.family?.id || ""}
            />

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                className="max-w-2xl p-10"
            >
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[2rem] border-2 border-amber-100 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                        <Pencil className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        Edit Wallet
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Update account details.
                    </p>
                </div>
                <AddAccountForm
                    familyId={user?.family?.id || ""}
                    walletTypes={walletTypes}
                    initialData={wallet}
                    onSuccess={handleEditSuccess}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="max-w-md p-8 text-center"
            >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                    <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mb-2 text-xl font-black text-gray-900 dark:text-white">
                    Delete this wallet?
                </h3>
                <p className="mb-8 text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <strong>{wallet.name}</strong>? This action cannot be undone
                    and will remove all associated transaction history.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-500/30 transition-colors hover:bg-red-700"
                    >
                        Confirm Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}
