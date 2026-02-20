"use client";
import React from "react";
import {
    FileText,
    Download,
    Trash2,
    Search,
    Filter,
    Shield,
} from "lucide-react";
import { TaxDocument } from "@/types";

interface DocumentVaultProps {
    documents?: TaxDocument[];
    isLoading?: boolean;
    onDelete?: (id: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
    documents = [],
    isLoading = false,
    onDelete,
}) => {
    if (isLoading)
        return <div className="py-10 text-center">Loading vault...</div>;

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-50 p-6 md:flex-row md:items-center dark:border-gray-800">
                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white/90">
                    <FileText className="h-5 w-5 text-indigo-500" /> Document
                    Vault
                </h3>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find document..."
                            className="w-full rounded-xl bg-gray-50 py-2 pr-4 pl-9 text-xs outline-none focus:ring-1 focus:ring-indigo-500 md:w-48 dark:bg-gray-800"
                        />
                    </div>
                    <button className="rounded-xl bg-gray-50 p-2 dark:bg-gray-800">
                        <Filter className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="p-6">
                {documents.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-400">
                        No documents found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-indigo-100 dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-indigo-900/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl border border-gray-100 bg-white p-3 text-indigo-500 shadow-sm transition-transform group-hover:scale-110 dark:border-gray-800 dark:bg-gray-900">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-800 dark:text-white">
                                            {doc.name}
                                        </h4>
                                        <div className="mt-0.5 flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                {doc.category} • {doc.year}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                                <Shield className="h-2.5 w-2.5 text-emerald-500" />{" "}
                                                Secure
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white">
                                        <Download className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            onDelete && onDelete(doc.id)
                                        }
                                        className="rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-600 hover:text-white"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="text-right group-hover:hidden">
                                    <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        {new Date(
                                            doc.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    End-to-end encrypted storage
                </span>
            </div>
        </div>
    );
};
