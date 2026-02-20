"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { UploadDialog } from "./UploadDialog";
import { Modal } from "@/components/ui/modal";
import { AddExpenseForm } from "./expenses/AddExpenseForm";
import { IncomeForm } from "./income/IncomeForm";
import { useAuth } from "@/context/AuthContext";
import useGoBack from "@/hooks/useGoBack";
import { useCategories } from "@/hooks/useCategories";
import { useTags, useLocations, useProjects } from "@/hooks/useOrganization";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useWallets } from "@/hooks/useWallets";
import { useContacts } from "@/hooks/useContacts";
import { ExpenseCategory, PaymentMethod, WalletInfoType } from "@/types";
import toast from "react-hot-toast";

export const PlusButton = () => {
    const { user } = useAuth();
    const familyId = user?.family?.id;

    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
    const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
    const [prefilledData, setPrefilledData] = useState<any>(null);

    const { data: categoriesData } = useCategories(familyId || "", "EXPENSE");
    const { data: incomeTypesData } = useCategories(familyId || "", "INCOME");
    const { data: paymentMethodsData } = usePaymentMethods(familyId || "");
    const { data: walletsData } = useWallets(familyId || "", 1, 100);
    const { data: tagsData } = useTags(familyId || "");
    const { data: locationsData } = useLocations(familyId || "");
    const { data: projectsData } = useProjects(familyId || "");
    const { data: contactsData } = useContacts(familyId || "");

    const categories = categoriesData || [];
    const incomeTypes = incomeTypesData || [];
    const paymentMethods = paymentMethodsData || [];
    const wallets = walletsData?.wallets || [];
    const tags = tagsData || [];
    const locations = locationsData || [];
    const projects = projectsData || [];
    const contacts = contactsData || [];

    const handleAnalysisComplete = (data: any) => {
        setIsUploadDialogOpen(false);
        setPrefilledData({
            ...data.analysis,
            file_id: data.file_id,
        });
        // Open appropriate modal based on transaction type
        if (data.analysis.transaction_type === "INCOME") {
            setIsAddIncomeModalOpen(true);
        } else {
            setIsAddExpenseModalOpen(true);
        }
    };

    return (
        <div className="fixed right-6 bottom-24 z-[9998]">
            <div className="group relative">
                {/* Tooltip */}
                <span className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-lg border border-white/10 bg-gray-900 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 dark:border-gray-800 dark:bg-white dark:text-gray-900">
                    Upload & Analyze
                    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-8 border-transparent border-l-gray-900 dark:border-l-white"></div>
                </span>

                <button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="group flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl ring-4 ring-white transition-all duration-300 hover:scale-110 active:scale-95 dark:ring-gray-900"
                    title="Upload & Analyze"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <Plus className="h-7 w-7 transition-transform group-hover:rotate-90" />
                </button>
            </div>

            <UploadDialog
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onAnalysisComplete={handleAnalysisComplete}
            />

            <Modal
                isOpen={isAddExpenseModalOpen}
                onClose={() => {
                    setIsAddExpenseModalOpen(false);
                    setPrefilledData(null);
                }}
                className="max-w-7xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        Create Expense from AI
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        We've pre-filled the details from your document. Please
                        verify before saving.
                    </p>
                </div>
                {familyId && (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* File Preview - Left Side */}
                        {prefilledData?.file_id && (
                            <div className="lg:col-span-5">
                                <div className="sticky top-0 h-fit rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
                                    <h4 className="mb-4 text-xs font-black tracking-widest text-gray-500 uppercase">
                                        Uploaded Document
                                    </h4>
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_URL}/uploads/${prefilledData.file_id}`}
                                            alt="Uploaded receipt"
                                            className="h-auto max-h-[600px] w-full object-contain"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.style.display = "none";
                                                const parent =
                                                    target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML =
                                                        '<div class="flex items-center justify-center h-64 text-gray-400"><svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>';
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Form - Right Side */}
                        <div
                            className={
                                prefilledData?.file_id
                                    ? "lg:col-span-7"
                                    : "lg:col-span-12"
                            }
                        >
                            <AddExpenseForm
                                familyId={familyId}
                                categories={categories}
                                paymentMethods={paymentMethods}
                                wallets={wallets}
                                tags={tags}
                                locations={locations}
                                projects={projects}
                                contacts={contacts}
                                prefilledData={prefilledData}
                                onSuccess={() => {
                                    setIsAddExpenseModalOpen(false);
                                    setPrefilledData(null);
                                    toast.success(
                                        "Expense created successfully from AI analysis"
                                    );
                                }}
                                onCancel={() => {
                                    setIsAddExpenseModalOpen(false);
                                    setPrefilledData(null);
                                }}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Income Modal */}
            <Modal
                isOpen={isAddIncomeModalOpen}
                onClose={() => {
                    setIsAddIncomeModalOpen(false);
                    setPrefilledData(null);
                }}
                className="max-w-7xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        New Income Transaction
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Record a new income or scan a document to auto-fill
                        details.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* File Preview - Left Side */}
                    {prefilledData?.file_id && (
                        <div className="lg:col-span-5">
                            <div className="sticky top-0 h-fit rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
                                <h4 className="mb-4 text-xs font-black tracking-widest text-gray-500 uppercase">
                                    Uploaded Document
                                </h4>
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_URL}/uploads/${prefilledData.file_id}`}
                                        alt="Uploaded document"
                                        className="h-auto max-h-[600px] w-full object-contain"
                                        onError={(e) => {
                                            const target =
                                                e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML =
                                                    '<div class="flex items-center justify-center h-64 text-gray-400"><svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>';
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Form - Right Side */}
                    <div
                        className={
                            prefilledData?.file_id
                                ? "lg:col-span-7"
                                : "lg:col-span-12"
                        }
                    >
                        <IncomeForm
                            onSuccess={() => {
                                setIsAddIncomeModalOpen(false);
                                setPrefilledData(null);
                            }}
                            onCancel={() => {
                                setIsAddIncomeModalOpen(false);
                                setPrefilledData(null);
                            }}
                            incomeTypes={incomeTypes}
                            wallets={wallets}
                            familyId={user?.family?.id || ""}
                            prefilledData={prefilledData}
                            tags={tags}
                            locations={locations}
                            projects={projects}
                            contacts={contacts}
                            paymentMethods={paymentMethods}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
