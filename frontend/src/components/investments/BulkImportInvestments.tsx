"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    FileSpreadsheet,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    Download,
    Trash2,
    TrendingUp,
} from "lucide-react";
import Button from "@/components/ui/button/Button";

interface BulkImportInvestmentsProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface ImportedInvestment {
    id: string;
    name: string;
    amount: string;
    type: string;
    date: string;
    status: "valid" | "invalid";
    error?: string;
}

export const BulkImportInvestments: React.FC<BulkImportInvestmentsProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [importedData, setImportedData] = useState<ImportedInvestment[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            handleFileSelection(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
        },
        multiple: false,
    });

    const handleFileSelection = (selectedFile: File) => {
        setFile(selectedFile);
        setIsProcessing(true);

        // Simulate parsing
        setTimeout(() => {
            const mockData: ImportedInvestment[] = [
                {
                    id: "1",
                    name: "Groww Nifty 50",
                    amount: "25000",
                    type: "Mutual Fund",
                    date: "2026-01-05",
                    status: "valid",
                },
                {
                    id: "2",
                    name: "Zomato Stocks",
                    amount: "12000",
                    type: "Stock",
                    date: "2026-01-10",
                    status: "valid",
                },
                {
                    id: "3",
                    name: "Gold Bar 24K",
                    amount: "abc",
                    type: "Gold",
                    date: "2026-01-12",
                    status: "invalid",
                    error: "Invalid amount",
                },
            ];
            setImportedData(mockData);
            setIsProcessing(false);
        }, 1500);
    };

    const removeFile = () => {
        setFile(null);
        setImportedData([]);
    };

    const removeRow = (id: string) => {
        setImportedData((prev) => prev.filter((row) => row.id !== id));
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <div
                    {...getRootProps()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition-all ${isDragActive ? "border-blue-500 bg-blue-50/10" : "border-gray-200 hover:border-blue-500 dark:border-gray-800"}`}
                >
                    <input {...getInputProps()} />
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                        <Upload className="h-10 w-10" />
                    </div>
                    <h4 className="mb-2 text-xl font-black text-gray-900 dark:text-white">
                        Bulk Import Investments
                    </h4>
                    <p className="mb-6 max-w-sm text-sm text-gray-500">
                        Quickly add multiple portfolio entries using a CSV or
                        Excel template.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="h-auto gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase"
                        >
                            <Download className="h-4 w-4" /> Template
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20">
                                <FileSpreadsheet className="h-6 w-6" />
                            </div>
                            <div>
                                <h5 className="text-sm font-black text-gray-900 dark:text-white">
                                    {file.name}
                                </h5>
                                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                    {isProcessing
                                        ? "Processing..."
                                        : `${importedData.length} records found`}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-2 text-gray-400 transition-colors hover:text-red-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {!isProcessing && importedData.length > 0 && (
                        <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm dark:border-gray-800">
                            <div className="no-scrollbar max-h-[350px] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-gray-50/50 backdrop-blur-md dark:bg-white/[0.02]">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                Asset Name
                                            </th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4 text-center text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {importedData.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="group hover:bg-gray-50/30 dark:hover:bg-white/[0.01]"
                                            >
                                                <td className="px-6 py-4">
                                                    {row.status === "valid" ? (
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    ) : (
                                                        <div
                                                            className="flex items-center gap-1.5"
                                                            title={row.error}
                                                        >
                                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-black text-gray-800 dark:text-white">
                                                        {row.name}
                                                    </p>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                        {row.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span
                                                        className={`text-sm font-black ${row.status === "valid" ? "text-blue-600" : "text-red-400"}`}
                                                    >
                                                        ₹{row.amount}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            removeRow(row.id)
                                                        }
                                                        className="text-gray-300 transition-colors hover:text-red-500"
                                                    >
                                                        <Trash2 className="mx-auto h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            Data pre-validation complete
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                className="h-12 rounded-2xl px-8 font-bold text-gray-500"
                            >
                                Discard
                            </Button>
                            <Button
                                disabled={
                                    importedData.some(
                                        (d) => d.status === "invalid"
                                    ) || importedData.length === 0
                                }
                                className="h-12 rounded-2xl bg-blue-600 px-12 font-bold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Import{" "}
                                {
                                    importedData.filter(
                                        (d) => d.status === "valid"
                                    ).length
                                }{" "}
                                Records
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
