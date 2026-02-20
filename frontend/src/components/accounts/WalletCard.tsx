"use client";
import React from "react";
import { MoreVertical, ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { formatCurrency } from "@/lib/utils";

interface WalletCardProps {
    id: string; // Add id prop
    name: string;
    type: string;
    balance: number;
    currency?: string;
    accountNo: string;
    bank: string;
    icon: React.ReactNode;
    color: string;
    active?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
    id,
    name,
    type,
    balance,
    currency = "INR",
    accountNo,
    bank,
    icon,
    color,
    active,
    onEdit,
    onDelete,
}) => {
    const router = useRouter(); // Use router
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleEdit = () => {
        router.push(`/accounts/${id}`);
    };
    const getCurrencySymbol = (code: string) => {
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
        <div
            className={`group relative rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ${isMenuOpen ? "z-50" : "z-10"} ${active ? "ring-2 ring-amber-500/50" : ""}`}
        >
            <div className="relative z-20 mb-8 flex items-center justify-between">
                <div
                    className={`rounded-2xl p-4 ${color} shadow-sm transition-transform group-hover:scale-110`}
                >
                    {icon}
                </div>
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className="dropdown-toggle p-2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-white"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    <Dropdown
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        className="w-36 text-left"
                    >
                        <DropdownItem
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.push(`/accounts/${id}`);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Pencil className="h-4 w-4 text-gray-500" />
                                <span>Details / Edit</span>
                            </div>
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                onDelete?.();
                                setIsMenuOpen(false);
                            }}
                            className="font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                            </div>
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>

            <div className="relative mb-8">
                <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    {type}
                </p>
                <h4 className="mb-2 text-lg font-black text-gray-800 dark:text-white">
                    {name}
                </h4>
                <p className="font-mono text-[11px] font-bold tracking-wider text-gray-500">
                    {accountNo} • {bank}
                </p>
            </div>

            <div className="relative flex items-end justify-between border-t border-gray-50 pt-6 dark:border-gray-800">
                <div>
                    <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Available Balance
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(balance)}
                    </h3>
                </div>
                <button
                    onClick={() => router.push(`/accounts/${id}`)}
                    className="rounded-xl bg-gray-50 p-3 transition-all hover:bg-amber-500 hover:text-white dark:bg-gray-800"
                >
                    <ExternalLink className="h-4 w-4" />
                </button>
            </div>

            {active && (
                <div className="absolute top-0 right-0 p-4">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                </div>
            )}
        </div>
    );
};
