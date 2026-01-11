"use client";
import React, { useState } from "react";
import { ExpensesList } from "@/components/expenses/ExpensesList";
import { ExpensesStats } from "@/components/expenses/ExpensesStats";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { AddExpenseForm } from "@/components/expenses/AddExpenseForm";
import { BulkImportExpenses } from "@/components/expenses/BulkImportExpenses";
import { FileSpreadsheet } from "lucide-react";

export default function ExpensesPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const openBulkModal = () => setIsBulkModalOpen(true);
  const closeBulkModal = () => setIsBulkModalOpen(false);

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
      <ExpensesStats />

      {/* Main Table / List Area */}
      <ExpensesList />

      {/* Add Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-5xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">New Transaction</h3>
          <p className="text-sm text-gray-500 font-medium">Record a new expense or scan a receipt to auto-fill details.</p>
        </div>
        <AddExpenseForm onSuccess={closeModal} onCancel={closeModal} />
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
