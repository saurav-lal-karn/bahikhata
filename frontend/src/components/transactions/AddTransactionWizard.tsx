"use client";

import React, { useState, useCallback } from "react";
import {
    Plus,
    Upload,
    FileText,
    ChevronRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    X,
    Eye
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useDropzone } from "react-dropzone";
import { aiService } from "@/services/aiService";
import { AddExpenseForm } from "../expenses/AddExpenseForm";
import { IncomeForm } from "../income/IncomeForm";
import toast from "react-hot-toast";
import Button from "@/components/ui/button/Button";

interface AddTransactionWizardProps {
    isOpen: boolean;
    onClose: () => void;
    familyId: string;
    categories: any[];
    incomeTypes: any[];
    paymentMethods: any[];
    wallets: any[];
    tags: any[];
    locations: any[];
    projects: any[];
    contacts: any[];
}

type WizardStep = "SELECT_MODE" | "UPLOAD" | "AI_REVIEW" | "EXTRACTING" | "VERIFY";
type EntryMode = "MANUAL" | "AI_UPLOAD";
type TransactionType = "EXPENSE" | "INCOME";

export const AddTransactionWizard: React.FC<AddTransactionWizardProps> = (props) => {
    const { isOpen, onClose, familyId } = props;
    const [step, setStep] = useState<WizardStep>("SELECT_MODE");
    const [entryMode, setEntryMode] = useState<EntryMode | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // AI States
    const [isProcessing, setIsProcessing] = useState(false);
    const [classification, setClassification] = useState<{
        ocr_text: string;
        transaction_type: string;
        category: string;
        confidence_score: number;
    } | null>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);

    const resetWizard = useCallback(() => {
        setStep("SELECT_MODE");
        setEntryMode(null);
        setFile(null);
        setPreviewUrl(null);
        setClassification(null);
        setAnalysisData(null);
        setIsProcessing(false);
    }, []);

    const handleClose = () => {
        resetWizard();
        onClose();
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setStep("AI_REVIEW");
            handleInitialClassification(selectedFile);
        }
    }, [familyId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
            "application/pdf": [],
        },
        multiple: false,
    });

    const handleInitialClassification = async (selectedFile: File) => {
        setIsProcessing(true);
        try {
            const result = await aiService.ocrClassify(selectedFile, familyId);
            setClassification(result);
        } catch (error) {
            console.error("Classification error:", error);
            toast.error("AI classification failed. You can still proceed manually.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmClassification = async () => {
        if (!classification) return;
        setStep("EXTRACTING");
        setIsProcessing(true);
        try {
            const result = await aiService.extractStructured(
                classification.ocr_text,
                classification.transaction_type,
                classification.category
            );

            // Map new API structure to what forms expect
            const mappedData = {
                ...result.extracted_data,
                file_id: (classification as any).file_id, // Get file_id from classification result
                amount: result.extracted_data.total_amount,
                confidence: result.confidence_score,
                field_confidence: result.field_confidence,
                ocr_text: classification.ocr_text // Keep OCR text for potential storage
            };

            setAnalysisData(mappedData);
            setStep("VERIFY");
        } catch (error) {
            console.error("Extraction error:", error);
            toast.error("Failed to extract structured data.");
            setStep("AI_REVIEW");
        } finally {
            setIsProcessing(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case "SELECT_MODE":
                return (
                    <div className="space-y-6 py-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">How would you like to add?</h3>
                            <p className="mt-2 text-gray-500">Choose your preferred entry method</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <button
                                onClick={() => {
                                    setEntryMode("AI_UPLOAD");
                                    setStep("UPLOAD");
                                }}
                                className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 p-8 transition-all hover:border-emerald-500 hover:bg-emerald-50/30 dark:border-gray-800 dark:hover:border-emerald-500/50"
                            >
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">AI Smart Upload</span>
                                <span className="mt-1 text-xs text-gray-500">Auto-fill from receipt/bill</span>
                            </button>
                            <button
                                onClick={() => {
                                    setEntryMode("MANUAL");
                                    setStep("VERIFY"); // Skip to form for manual entry
                                }}
                                className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 p-8 transition-all hover:border-blue-500 hover:bg-blue-50/30 dark:border-gray-800 dark:hover:border-blue-500/50"
                            >
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">Manual Entry</span>
                                <span className="mt-1 text-xs text-gray-500">Type details yourself</span>
                            </button>
                        </div>
                    </div>
                );

            case "UPLOAD":
                return (
                    <div className="space-y-6 py-8">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setStep("SELECT_MODE")} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h3 className="text-xl font-bold">Upload Document</h3>
                        </div>
                        <div
                            {...getRootProps()}
                            className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all ${isDragActive ? "border-emerald-500 bg-emerald-50/50" : "border-gray-200 hover:border-emerald-500/50"
                                } dark:border-gray-800`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">
                                <Plus className="h-8 w-8" />
                            </div>
                            <p className="mt-4 font-bold text-gray-900 dark:text-white">Click or drag receipt here</p>
                            <p className="mt-1 text-xs text-gray-500">Supports PDF, PNG, JPG (Max 5MB)</p>
                        </div>
                    </div>
                );

            case "AI_REVIEW":
                return (
                    <div className="space-y-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setStep("UPLOAD")} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <h3 className="text-xl font-bold">AI Review</h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full dark:bg-emerald-900/20">
                                <CheckCircle2 className="h-4 w-4" />
                                OCR READY
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* File Preview */}
                            <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                                {file?.type.startsWith("image") ? (
                                    <img src={previewUrl!} alt="Preview" className="h-full w-full object-contain max-h-[400px]" />
                                ) : (
                                    <div className="flex h-[300px] items-center justify-center bg-gray-50 dark:bg-gray-900">
                                        <FileText className="h-16 w-16 text-gray-400" />
                                        <span className="ml-2 text-sm text-gray-500">{file?.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Classification Results */}
                            <div className="flex flex-col justify-between space-y-4">
                                <div className="space-y-4">
                                    <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detected Type</p>
                                        {isProcessing ? (
                                            <div className="mt-2 flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                                                <span className="text-sm font-medium">Analyzing document type...</span>
                                            </div>
                                        ) : (
                                            <div className="mt-2 flex items-center gap-3">
                                                <span className={`rounded-lg px-3 py-1 text-sm font-bold ${classification?.transaction_type === "EXPENSE"
                                                    ? "bg-red-100 text-red-600 dark:bg-red-900/20"
                                                    : "bg-green-100 text-green-600 dark:bg-green-900/20"
                                                    }`}>
                                                    {classification?.transaction_type || "UNKNOWN"}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Confidence: {((classification?.confidence_score || 0) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Suggested Category</p>
                                        {isProcessing ? (
                                            <div className="mt-2 flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                                                <span className="text-sm font-medium">Categorizing...</span>
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                                                {classification?.category || "Uncategorized"}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleConfirmClassification}
                                        disabled={isProcessing || !classification}
                                        className="w-full h-12 rounded-xl text-md font-bold"
                                    >
                                        Confirm & Extract Details
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <button
                                        onClick={() => setStep("UPLOAD")}
                                        className="w-full text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Re-upload Document
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "EXTRACTING":
                return (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                        <div className="relative">
                            <Loader2 className="h-20 w-20 animate-spin text-emerald-600" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-emerald-600/50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Extracting Details...</h3>
                            <p className="text-gray-500">AI is reading items, amounts, and merchant details.</p>
                        </div>
                        <div className="w-full max-w-xs bg-gray-100 rounded-full h-2 dark:bg-gray-800">
                            <div className="bg-emerald-600 h-2 rounded-full animate-progress-indeterminate"></div>
                        </div>
                    </div>
                );

            case "VERIFY":
                const isIncome = classification?.transaction_type === "INCOME";
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black">Final Verification</h3>
                                <span className={`ml-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    }`}>
                                    {isIncome ? "Income" : "Expense"}
                                </span>
                            </div>
                            <button
                                onClick={() => setStep(entryMode === "AI_UPLOAD" ? "AI_REVIEW" : "SELECT_MODE")}
                                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Start Over
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                            {/* Document Preview - Left (Sticky) */}
                            {entryMode === "AI_UPLOAD" && (
                                <div className="lg:col-span-5">
                                    <div className="sticky top-0 space-y-4">
                                        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white ring-8 ring-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:ring-gray-900/50">
                                            <div className="flex items-center justify-between bg-gray-50 px-4 py-2 dark:bg-gray-800/50">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt View</span>
                                                <button
                                                    onClick={() => window.open(previewUrl!, "_blank")}
                                                    className="rounded-lg p-1.5 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </div>
                                            {file?.type.startsWith("image") ? (
                                                <img src={previewUrl!} alt="Receipt" className="h-auto max-h-[60vh] w-full object-contain" />
                                            ) : (
                                                <iframe src={previewUrl!} className="h-[60vh] w-full" title="File Preview" />
                                            )}
                                        </div>
                                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                </div>
                                                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                                                    <span className="font-bold">AI Helper:</span> I've mapped the details for you. Check specifically the <span className="font-bold">Total Amount</span> and <span className="font-bold">Category</span>.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form - Right */}
                            <div className={entryMode === "AI_UPLOAD" ? "lg:col-span-7" : "lg:col-span-12"}>
                                {isIncome ? (
                                    <IncomeForm
                                        {...props}
                                        prefilledData={analysisData}
                                        onSuccess={async () => {
                                            if (entryMode === "AI_UPLOAD" && analysisData?.file_id && classification?.ocr_text) {
                                                try {
                                                    await aiService.storeDocument(
                                                        analysisData.file_id,
                                                        classification.ocr_text,
                                                        {
                                                            source: "WIZARD_UPLOAD",
                                                            type: "INCOME",
                                                            category: analysisData.category
                                                        }
                                                    );
                                                } catch (e) {
                                                    console.error("Failed to store document in vector DB", e);
                                                }
                                            }
                                            handleClose();
                                        }}
                                        onCancel={handleClose}
                                    />
                                ) : (
                                    <AddExpenseForm
                                        {...props}
                                        prefilledData={analysisData}
                                        onSuccess={async () => {
                                            if (entryMode === "AI_UPLOAD" && analysisData?.file_id && classification?.ocr_text) {
                                                try {
                                                    await aiService.storeDocument(
                                                        analysisData.file_id,
                                                        classification.ocr_text,
                                                        {
                                                            source: "WIZARD_UPLOAD",
                                                            type: "EXPENSE",
                                                            category: analysisData.category
                                                        }
                                                    );
                                                } catch (e) {
                                                    console.error("Failed to store document in vector DB", e);
                                                }
                                            }
                                            handleClose();
                                        }}
                                        onCancel={handleClose}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className={`max-w-7xl transition-all duration-300 ${step === "VERIFY" ? "p-10" : "p-8 sm:p-12"}`}
        >
            {renderStep()}
        </Modal>
    );
};
