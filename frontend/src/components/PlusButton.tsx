"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { UploadDialog } from "./UploadDialog";
import { Modal } from "@/components/ui/modal";
import { AddExpenseForm } from "./expenses/AddExpenseForm";
import { IncomeForm } from "./income/IncomeForm";
import { useAuth } from "@/context/AuthContext";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { paymentMethodService } from "@/services/paymentMethodService";
import { walletService } from "@/services/walletService";
import { ExpenseCategory, PaymentMethod, WalletInfoType } from "@/types";
import toast from "react-hot-toast";

export const PlusButton = () => {
    const { user } = useAuth();
    const familyId = user?.family?.id;
    
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
    const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
    const [prefilledData, setPrefilledData] = useState<any>(null);

    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [incomeTypes, setIncomeTypes] = useState<ExpenseCategory[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [wallets, setWallets] = useState<WalletInfoType[]>([]);

    React.useEffect(() => {
        if (familyId) {
            const fetchData = async () => {
                try {
                    const [cats, incTypes, pms, wals] = await Promise.all([
                        transactionCategoryService.getCategories(familyId, true, 'EXPENSE'),
                        transactionCategoryService.getCategories(familyId, true, 'INCOME'),
                        paymentMethodService.getPaymentMethods(familyId),
                        walletService.getWallets(familyId, 1, 100)
                    ]);
                    setCategories(cats);
                    setIncomeTypes(incTypes);
                    setPaymentMethods(pms);
                    setWallets(wals.wallets);
                } catch (error) {
                    console.error("PlusButton: Failed to pre-fetch data", error);
                }
            };
            fetchData();
        }
    }, [familyId]);

    const handleAnalysisComplete = (data: any) => {
        setIsUploadDialogOpen(false);
        setPrefilledData({
            ...data.analysis,
            file_id: data.file_id
        });
        // Open appropriate modal based on transaction type
        if (data.analysis.transaction_type === "INCOME") {
            setIsAddIncomeModalOpen(true);
        } else {
            setIsAddExpenseModalOpen(true);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-[9998]">
            <div className="relative group">
                {/* Tooltip */}
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 dark:border-gray-800">
                    Upload & Analyze
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-8 border-transparent border-l-gray-900 dark:border-l-white"></div>
                </span>

                <button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group ring-4 ring-white dark:ring-gray-900 overflow-hidden"
                    title="Upload & Analyze"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                onClose={() => { setIsAddExpenseModalOpen(false); setPrefilledData(null); }}
                className="max-w-7xl p-10"
            >
                <div className="mb-10">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Create Expense from AI</h3>
                    <p className="text-sm text-gray-500 font-medium">We've pre-filled the details from your document. Please verify before saving.</p>
                </div>
                {familyId && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* File Preview - Left Side */}
                        {prefilledData?.file_id && (
                            <div className="lg:col-span-5">
                                <div className="sticky top-0 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 h-fit">
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Uploaded Document</h4>
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_URL}/uploads/${prefilledData.file_id}`}
                                            alt="Uploaded receipt"
                                            className="w-full h-auto max-h-[600px] object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = '<div class="flex items-center justify-center h-64 text-gray-400"><svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>';
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Form - Right Side */}
                        <div className={prefilledData?.file_id ? "lg:col-span-7" : "lg:col-span-12"}>
                            <AddExpenseForm
                                familyId={familyId}
                                categories={categories}
                                paymentMethods={paymentMethods}
                                wallets={wallets}
                                prefilledData={prefilledData}
                                onSuccess={() => {
                                    setIsAddExpenseModalOpen(false);
                                    setPrefilledData(null);
                                    toast.success("Expense created successfully from AI analysis");
                                }}
                                onCancel={() => { setIsAddExpenseModalOpen(false); setPrefilledData(null); }}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Income Modal */}
            <Modal isOpen={isAddIncomeModalOpen} onClose={() => { setIsAddIncomeModalOpen(false); setPrefilledData(null); }} className="max-w-7xl p-10">
                <div className="mb-10">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">New Income Transaction</h3>
                    <p className="text-sm text-gray-500 font-medium">Record a new income or scan a document to auto-fill details.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* File Preview - Left Side */}
                    {prefilledData?.file_id && (
                        <div className="lg:col-span-5">
                            <div className="sticky top-0 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 h-fit">
                                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Uploaded Document</h4>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img 
                                        src={`${process.env.NEXT_PUBLIC_URL}/uploads/${prefilledData.file_id}`}
                                        alt="Uploaded document"
                                        className="w-full h-auto max-h-[600px] object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = '<div class="flex items-center justify-center h-64 text-gray-400"><svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>';
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Form - Right Side */}
                    <div className={prefilledData?.file_id ? "lg:col-span-7" : "lg:col-span-12"}>
                        <IncomeForm 
                            onSuccess={() => { setIsAddIncomeModalOpen(false); setPrefilledData(null); }} 
                            onCancel={() => { setIsAddIncomeModalOpen(false); setPrefilledData(null); }}
                            wallets={wallets}
                            incomeTypes={incomeTypes}
                            familyId={user?.family?.id || ""}
                            prefilledData={prefilledData}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
