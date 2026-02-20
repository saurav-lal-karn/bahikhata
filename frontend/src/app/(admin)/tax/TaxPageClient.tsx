"use client";
import React, { useState } from "react";
import {
    ScrollText,
    Plus,
    FileText,
    ShieldCheck,
    Download,
    ArrowUpRight,
    Info,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { TaxSavingTracker } from "@/components/tax/TaxSavingTracker";
import { DocumentVault } from "@/components/tax/DocumentVault";
import { AddDocumentForm } from "@/components/tax/AddDocumentForm";
import { useAuth } from "@/context/AuthContext";
import { taxService } from "@/services/taxService";
import { TaxDocument, TaxDeduction } from "@/types";
import toast from "react-hot-toast";

export default function TaxPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documents, setDocuments] = useState<TaxDocument[]>([]);
    const [deductions, setDeductions] = useState<TaxDeduction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentYear, setCurrentYear] = useState("2025-26"); // Should be dynamic ideally

    const fetchData = async () => {
        if (familyDetails?.id) {
            try {
                setIsLoading(true);
                const [docs, deds] = await Promise.all([
                    taxService.getDocuments(familyDetails.id),
                    taxService.getDeductions(familyDetails.id),
                ]);
                setDocuments(docs || []);
                setDeductions(deds || []);
            } catch (e) {
                console.error(e);
                toast.error("Failed to fetch tax data");
            } finally {
                setIsLoading(false);
            }
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [familyDetails?.id]);

    const handleDeleteDocument = async (id: string) => {
        try {
            await taxService.deleteDocument(id);
            toast.success("Document deleted");
            fetchData();
        } catch (e) {
            toast.error("Failed to delete document");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        fetchData();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Tax & Compliance
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Optimize your tax savings and keep your financial
                        documents organized.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex transform items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-6 py-3 font-bold text-gray-800 shadow-sm transition-all hover:scale-105 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <Download className="h-5 w-5" /> Export Tax Report
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:from-blue-600 hover:to-indigo-700 active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> Add Document
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left: Tax Saving Tracking (8/12) */}
                <div className="col-span-12 space-y-8 xl:col-span-8">
                    <TaxSavingTracker
                        deductions={deductions}
                        isLoading={isLoading}
                    />
                    <DocumentVault
                        documents={documents}
                        isLoading={isLoading}
                        onDelete={handleDeleteDocument}
                    />
                </div>

                {/* Right: Regional Insights (4/12) */}
                <div className="col-span-12 space-y-6 xl:col-span-4">
                    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 w-fit rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h4 className="mb-2 text-lg font-black text-gray-800 dark:text-white">
                            Section 80C Summary
                        </h4>
                        <p className="mb-6 text-xs font-medium text-gray-500">
                            You have utilized ₹1.2L of your ₹1.5L limit.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                <span>Utilization</span>
                                <span className="text-blue-600">80%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-50 dark:bg-gray-800">
                                <div className="h-full w-[80%] rounded-full bg-blue-500 shadow-lg shadow-blue-500/10" />
                            </div>
                        </div>

                        <button className="mt-8 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-600 uppercase hover:underline">
                            View Tax Calculator{" "}
                            <ArrowUpRight className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-700 to-blue-800 p-8 text-white shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ScrollText className="h-24 w-24" />
                        </div>
                        <h4 className="mb-4 text-xl font-black">
                            India Tax Filing 2026
                        </h4>
                        <p className="mb-6 text-xs leading-relaxed font-medium opacity-80">
                            The deadline for filing your ITR for the current
                            financial year is July 31, 2026. Keep your Form 16
                            ready!
                        </p>
                        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                            <Info className="h-5 w-5 shrink-0 text-amber-300" />
                            <p className="text-[10px] font-bold">
                                New Tax Regime is now the default. Review your
                                savings accordingly.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h4 className="mb-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            Compliance Checklist
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                                    <ShieldCheck className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    PF Contribution Linked
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                </div>
                                <span className="text-xs font-bold text-gray-500">
                                    Aadhaar-PAN Linked
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="max-w-2xl p-10"
            >
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[2rem] border-2 border-blue-100 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                        <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        Vault Secure Upload
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Add financial records to your encrypted storage.
                    </p>
                </div>
                <AddDocumentForm
                    onSuccess={closeModal}
                    onCancel={closeModal}
                    familyId={familyDetails?.id}
                />
            </Modal>
        </div>
    );
}
