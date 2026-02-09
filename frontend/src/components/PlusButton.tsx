"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { UploadDialog } from "./UploadDialog";
import { Modal } from "@/components/ui/modal";
import { AddExpenseForm } from "./expenses/AddExpenseForm";
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
    const [prefilledData, setPrefilledData] = useState<any>(null);

    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [wallets, setWallets] = useState<WalletInfoType[]>([]);

    React.useEffect(() => {
        if (familyId) {
            const fetchData = async () => {
                try {
                    const [cats, pms, wals] = await Promise.all([
                        transactionCategoryService.getCategories(familyId, true, 'EXPENSE'),
                        paymentMethodService.getPaymentMethods(familyId),
                        walletService.getWallets(familyId, 1, 100)
                    ]);
                    setCategories(cats);
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
        setIsAddExpenseModalOpen(true);
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
                onClose={() => setIsAddExpenseModalOpen(false)}
                className="max-w-5xl p-10"
            >
                <div className="mb-10">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Create Expense from AI</h3>
                    <p className="text-sm text-gray-500 font-medium">We've pre-filled the details from your document. Please verify before saving.</p>
                </div>
                {familyId && (
                    <AddExpenseForm
                        familyId={familyId}
                        categories={categories}
                        paymentMethods={paymentMethods}
                        wallets={wallets}
                        prefilledData={prefilledData}
                        onSuccess={() => {
                            setIsAddExpenseModalOpen(false);
                            toast.success("Expense created successfully from AI analysis");
                        }}
                        onCancel={() => setIsAddExpenseModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};
