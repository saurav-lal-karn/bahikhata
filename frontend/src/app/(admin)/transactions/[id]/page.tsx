"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    Tag,
    CreditCard,
    MessageSquare,
    FileText,
    ExternalLink,
    Image as ImageIcon,
    User,
    Building2,
    MapPin,
    Briefcase,
} from "lucide-react";
import { transactionService } from "@/services/transactionService";
import { attachmentService } from "@/services/attachmentService";
import { Transaction, Attachment } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function TransactionDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tx = await transactionService.getTransactionById(id);
                setTransaction(tx);

                if (tx.file_id) {
                    try {
                        const att = await attachmentService.getAttachmentById(
                            tx.file_id
                        );
                        setAttachment(att);
                    } catch (err) {
                        console.error("Failed to fetch attachment", err);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch transaction details", error);
                toast.error("Transaction not found");
                router.push("/expenses");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"></div>
            </div>
        );
    }

    if (!transaction) return null;

    const isExpense = transaction.type === "EXPENSE";
    const isImage = attachment?.file_type?.startsWith("image/");
    const fileUrl = attachment
        ? `${process.env.NEXT_PUBLIC_URL}/uploads/${attachment.file_path.split("/").pop()}`
        : null;

    return (
        <div className="mx-auto max-w-6xl space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-xs font-bold tracking-widest uppercase">
                        Back to transactions
                    </span>
                </button>
                <div className="flex items-center gap-3">
                    <span
                        className={`rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                            isExpense
                                ? "bg-red-50 text-red-600 dark:bg-red-900/20"
                                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                        }`}
                    >
                        {transaction.type}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-black tracking-widest text-gray-400 uppercase dark:bg-gray-800">
                        ID: {transaction.id.slice(0, 8)}...
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Details */}
                <div className="space-y-8 lg:col-span-2">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 p-10 opacity-[0.03] dark:opacity-[0.1]">
                            <CreditCard className="h-64 w-64 text-gray-900 dark:text-white" />
                        </div>

                        <div className="relative space-y-8">
                            <div>
                                <h1 className="mb-2 text-4xl leading-tight font-black text-gray-900 dark:text-white">
                                    {transaction.title}
                                </h1>
                                <p className="text-lg font-medium text-gray-500">
                                    {transaction.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span
                                    className={`text-6xl font-black ${isExpense ? "text-red-500" : "text-emerald-500"}`}
                                >
                                    {isExpense ? "-" : "+"}{" "}
                                    {formatCurrency(
                                        transaction.amount,
                                        "en-IN",
                                        "INR"
                                    )}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8 md:grid-cols-3 dark:border-gray-800">
                                <div className="space-y-2">
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        <Calendar className="h-3.5 w-3.5" />{" "}
                                        Date
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {formatDateTime(
                                            transaction.transaction_date
                                        )}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        <Tag className="h-3.5 w-3.5" /> Category
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {transaction.category?.name ||
                                            "Uncategorized"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        <CreditCard className="h-3.5 w-3.5" />{" "}
                                        Method
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {transaction.payment_method?.name ||
                                            "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="rounded-[2.5rem] border border-gray-100 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-800/20">
                        <h3 className="mb-8 flex items-center gap-3 px-2 text-sm font-black tracking-widest text-gray-900 uppercase dark:text-white">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            Associated Information
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        Contact
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {transaction.contact?.name || "None"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        Project
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {transaction.project?.name ||
                                            "Personal"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        Location
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {transaction.location?.name || "None"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        Wallet
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {transaction.wallet?.name ||
                                            "Main Wallet"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Items Section */}
                    {transaction.items && transaction.items.length > 0 && (
                        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                            <h3 className="mb-6 flex items-center gap-3 px-2 text-sm font-black tracking-widest text-gray-900 uppercase dark:text-white">
                                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                                Transaction Items
                            </h3>
                            <div className="space-y-3">
                                {transaction.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-purple-200 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-purple-800"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <h4 className="mb-1 truncate text-sm font-bold text-gray-900 dark:text-white">
                                                {item.name}
                                            </h4>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="font-medium">
                                                    Qty:{" "}
                                                    <span className="font-bold text-gray-700 dark:text-gray-300">
                                                        {item.quantity}
                                                    </span>
                                                </span>
                                                <span className="font-medium">
                                                    @{" "}
                                                    {formatCurrency(
                                                        item.unit_price || 0,
                                                        "en-IN",
                                                        "INR"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="text-sm font-black text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    item.amount,
                                                    "en-IN",
                                                    "INR"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                                    <span className="text-xs font-black tracking-widest text-gray-500 uppercase">
                                        Total ({transaction.items.length}{" "}
                                        {transaction.items.length === 1
                                            ? "item"
                                            : "items"}
                                        )
                                    </span>
                                    <span className="text-lg font-black text-gray-900 dark:text-white">
                                        {formatCurrency(
                                            transaction.items.reduce(
                                                (sum, item) =>
                                                    sum + item.amount,
                                                0
                                            ),
                                            "en-IN",
                                            "INR"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar / Attachment */}
                <div className="space-y-8">
                    <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                        <h3 className="mb-6 flex items-center gap-3 text-sm font-black tracking-widest text-gray-900 uppercase dark:text-white">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            AI Document Attachment
                        </h3>

                        {attachment ? (
                            <div className="space-y-6">
                                <div className="group flex items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-700">
                                        {isImage ? (
                                            <ImageIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-gray-900 dark:text-white">
                                            {attachment.file_name}
                                        </p>
                                        <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase">
                                            {(
                                                attachment.file_size! /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB •{" "}
                                            {attachment.file_type
                                                ?.split("/")
                                                .pop()
                                                ?.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                {isImage && fileUrl && (
                                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                                        <img
                                            src={fileUrl}
                                            alt="Receipt Preview"
                                            className="h-auto w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-105"
                                            onClick={() =>
                                                window.open(fileUrl, "_blank")
                                            }
                                        />
                                    </div>
                                )}

                                <a
                                    href={fileUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
                                >
                                    View Original
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-4 py-12 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300 dark:border-gray-700 dark:bg-gray-800">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    No document attached
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white shadow-xl shadow-blue-500/20">
                        <MessageSquare className="mb-4 h-8 w-8 opacity-50" />
                        <h4 className="mb-2 text-lg font-black">
                            Need to adjust?
                        </h4>
                        <p className="mb-6 text-sm font-bold text-blue-100">
                            You can edit this transaction at any time from the
                            main list.
                        </p>
                        <button
                            onClick={() => router.back()}
                            className="rounded-xl bg-white/20 px-6 py-3 text-xs font-black tracking-widest uppercase transition-all hover:bg-white/30"
                        >
                            Return to list
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
