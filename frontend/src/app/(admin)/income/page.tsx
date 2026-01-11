"use client";
import React, { useState } from "react";
import { IncomeList } from "@/components/income/IncomeList";
import { IncomeStats } from "@/components/income/IncomeStats";
import { Plus, TrendingUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { AddIncomeForm } from "@/components/income/AddIncomeForm";
import { BulkImportIncome } from "@/components/income/BulkImportIncome";
import { FileSpreadsheet } from "lucide-react";

export default function IncomePage() {
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
            Family Income
          </h1>
          <p className="text-gray-500 font-medium">
            Monitor inflows and track your earning sources.
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
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20"
          >
            <Plus className="w-5 h-5" /> Record Income
          </button>
        </div>
      </div>

      {/* Stats Summary Area */}
      <IncomeStats />

      {/* Main Table / List Area */}
      <IncomeList />

      {/* Add Income Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-5xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-green-500 w-8 h-8" /> New Transaction
          </h3>
          <p className="text-sm text-gray-500 font-medium">Add a new income source or payment to your records.</p>
        </div>
        <AddIncomeForm onSuccess={closeModal} onCancel={closeModal} />
      </Modal>

      {/* Bulk Import Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={closeBulkModal} className="max-w-4xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Bulk Import Income</h3>
          <p className="text-sm text-gray-500 font-medium">Upload a CSV or Excel file to batch import income records.</p>
        </div>
        <BulkImportIncome onSuccess={closeBulkModal} onCancel={closeBulkModal} />
      </Modal>
    </div>
  );
}
