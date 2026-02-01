"use client";
import React, { useState, useEffect } from "react";
import { ExpensesList } from "@/components/expenses/ExpensesList";
import { ExpensesStats } from "@/components/expenses/ExpensesStats";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { AddExpenseForm } from "@/components/expenses/AddExpenseForm";
import { BulkImportExpenses } from "@/components/expenses/BulkImportExpenses";
import { FileSpreadsheet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ExpenseCategory, PaymentMethod, WalletInfoType } from "@/types";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { paymentMethodService } from "@/services/paymentMethodService";
import { walletService } from "@/services/walletService";

export default function ExpensesPageClient() {
  const { user } = useAuth();
  const familyDetails = user?.family;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [wallets, setWallets] = useState<WalletInfoType[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const openBulkModal = () => setIsBulkModalOpen(true);
  const closeBulkModal = () => setIsBulkModalOpen(false);

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
    closeModal();
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!familyDetails?.id) return;

      try {
        const [categoriesResponse, paymentMethodsResponse, walletResponse] = await Promise.all([
          transactionCategoryService.getCategories(familyDetails.id, true, 'EXPENSE'),
          paymentMethodService.getPaymentMethods(familyDetails.id),
          walletService.getWallets(familyDetails.id, 1, 100)
        ]);

        if (isMounted) {
          setCategories(categoriesResponse);
          setPaymentMethods(paymentMethodsResponse);
          setWallets(walletResponse.wallets);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch categories or payment methods:', error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [familyDetails]);

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Family Expenses
          </h1>
          <p className="text-gray-500 font-medium">
            Manage and monitor your household spending.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={openBulkModal}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm"
          >
            <FileSpreadsheet className="w-5 h-5 text-green-600" /> Import
          </button>
          <button 
            onClick={openModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-5 h-5" /> Add New Expense
          </button>
        </div>
      </div>

      {/* Stats Summary Area */}
      <ExpensesStats familyId={familyDetails?.id || ""} refreshKey={refreshKey} />

      {/* Main Table / List Area */}
      <ExpensesList familyId={familyDetails?.id || ""} refreshKey={refreshKey} />

      {/* Add Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-5xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">New Transaction</h3>
          <p className="text-sm text-gray-500 font-medium">Record a new expense or scan a receipt to auto-fill details.</p>
        </div>
        <AddExpenseForm 
          onSuccess={handleExpenseAdded} 
          onCancel={closeModal}
          categories={categories}
          paymentMethods={paymentMethods}
          wallets={wallets}
          familyId={familyDetails?.id || ""}
        />
      </Modal>

      {/* Bulk Import Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={closeBulkModal} className="max-w-4xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Bulk Import</h3>
          <p className="text-sm text-gray-500 font-medium">Upload a CSV or Excel file to import multiple expenses at once.</p>
        </div>
        <BulkImportExpenses onSuccess={closeBulkModal} onCancel={closeBulkModal} />
      </Modal>
    </div>
  );
}
