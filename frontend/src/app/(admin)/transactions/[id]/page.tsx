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
    Briefcase
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
                        const att = await attachmentService.getAttachmentById(tx.file_id);
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!transaction) return null;

    const isExpense = transaction.type === 'EXPENSE';
    const isImage = attachment?.file_type?.startsWith('image/');
    const fileUrl = attachment ? `${process.env.NEXT_PUBLIC_URL}/uploads/${attachment.file_path.split('/').pop()}` : null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Back to transactions</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isExpense ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
                        }`}>
                        {transaction.type}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                        ID: {transaction.id.slice(0, 8)}...
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] dark:opacity-[0.1] -mr-10 -mt-10">
                            <CreditCard className="w-64 h-64 text-gray-900 dark:text-white" />
                        </div>

                        <div className="relative space-y-8">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                                    {transaction.title}
                                </h1>
                                <p className="text-gray-500 font-medium text-lg">
                                    {transaction.description || "No description provided."}
                                </p>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className={`text-6xl font-black ${isExpense ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {isExpense ? '-' : '+'} {formatCurrency(transaction.amount, 'en-IN', 'INR')}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" /> Date
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">{formatDateTime(transaction.transaction_date)}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Tag className="w-3.5 h-3.5" /> Category
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">{transaction.category?.name || "Uncategorized"}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <CreditCard className="w-3.5 h-3.5" /> Method
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">{transaction.payment_method?.name || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="bg-gray-50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-8 px-2 flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Associated Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Contact</span>
                                    <p className="font-bold text-gray-900 dark:text-white">{transaction.contact?.name || "None"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
                                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Project</span>
                                    <p className="font-bold text-gray-900 dark:text-white">{transaction.project?.name || "Personal"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Location</span>
                                    <p className="font-bold text-gray-900 dark:text-white">{transaction.location?.name || "None"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
                                <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Wallet</span>
                                    <p className="font-bold text-gray-900 dark:text-white">{transaction.wallet?.name || "Main Wallet"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Items Section */}
                    {transaction.items && transaction.items.length > 0 && (
                        <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 px-2 flex items-center gap-3">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                Transaction Items
                            </h3>
                            <div className="space-y-3">
                                {transaction.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">
                                                {item.name}
                                            </h4>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="font-medium">
                                                    Qty: <span className="font-bold text-gray-700 dark:text-gray-300">{item.quantity}</span>
                                                </span>
                                                <span className="font-medium">
                                                    @ {formatCurrency(item.unit_price || 0, 'en-IN', 'INR')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-sm font-black text-gray-900 dark:text-white">
                                                {formatCurrency(item.amount, 'en-IN', 'INR')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                        Total ({transaction.items.length} {transaction.items.length === 1 ? 'item' : 'items'})
                                    </span>
                                    <span className="text-lg font-black text-gray-900 dark:text-white">
                                        {formatCurrency(transaction.items.reduce((sum, item) => sum + item.amount, 0), 'en-IN', 'INR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar / Attachment */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            AI Document Attachment
                        </h3>

                        {attachment ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                                        {isImage ? <ImageIcon className="w-5 h-5 text-gray-400" /> : <FileText className="w-5 h-5 text-gray-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                            {attachment.file_name}
                                        </p>
                                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] mt-1">
                                            {(attachment.file_size! / 1024 / 1024).toFixed(2)} MB • {attachment.file_type?.split('/').pop()?.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                {isImage && fileUrl && (
                                    <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                                        <img
                                            src={fileUrl}
                                            alt="Receipt Preview"
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                                            onClick={() => window.open(fileUrl, '_blank')}
                                        />
                                    </div>
                                )}

                                <a
                                    href={fileUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    View Original
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        ) : (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-gray-300 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No document attached</p>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
                        <MessageSquare className="w-8 h-8 mb-4 opacity-50" />
                        <h4 className="text-lg font-black mb-2">Need to adjust?</h4>
                        <p className="text-sm font-bold text-blue-100 mb-6">You can edit this transaction at any time from the main list.</p>
                        <button
                            onClick={() => router.back()}
                            className="text-xs font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all"
                        >
                            Return to list
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
