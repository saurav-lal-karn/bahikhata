"use client";
import React, { useEffect, useState } from "react";
import { IncomeList } from "@/components/income/IncomeList";
import { IncomeStats } from "@/components/income/IncomeStats";
import { Plus, TrendingUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { IncomeForm } from "@/components/income/IncomeForm";
import { BulkImportIncome } from "@/components/income/BulkImportIncome";
import { FileSpreadsheet, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { transactionService } from "@/services/transactionService";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { walletService } from "@/services/walletService";
import {
    Location,
    Tag,
    Transaction,
    TransactionCategory,
    WalletInfoType,
} from "@/types";
import toast from "react-hot-toast";
import { organizationService } from "@/services/organizationService";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useWallets } from "@/hooks/useWallets";
import { useCategories } from "@/hooks/useCategories";
import { useTags, useLocations, useProjects } from "@/hooks/useOrganization";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useIncomes } from "@/hooks/useIncomes";
import { useContacts } from "@/hooks/useContacts";

export default function IncomePageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
    const [isBulkLarge, setIsBulkLarge] = useState<boolean>(false);

    const [selectedIncome, setSelectedIncome] = useState<Transaction | null>(
        null
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [incomeToDelete, setIncomeToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(50);

    // Queries
    const { data: walletsData } = useWallets(familyDetails?.id || "", 1, 100);
    const { data: incomeTypes } = useCategories(
        familyDetails?.id || "",
        "INCOME"
    );

    const { data: incomesData, isLoading: isIncomesLoading } = useIncomes(
        familyDetails?.id || "",
        currentPage,
        pageSize
    );

    const { data: tags } = useTags(familyDetails?.id || "");
    const { data: locations } = useLocations(familyDetails?.id || "");
    const { data: paymentMethods } = usePaymentMethods(familyDetails?.id || "");
    const { data: contactsData } = useContacts(familyDetails?.id || "");
    const { data: projectsData } = useProjects(familyDetails?.id || "");

    const wallets = walletsData?.wallets || [];
    const incomes = incomesData?.transactions || [];
    const totalCount = incomesData?.total_count || 0;
    const isLoading = isIncomesLoading;
    const availableIncomeTypes = incomeTypes || [];
    const availableTags = tags || [];
    const availableLocations = locations || [];
    const availablePaymentMethods = paymentMethods || [];
    const availableContacts = contactsData || [];
    const availableProjects = projectsData || [];

    const openModal = () => {
        setSelectedIncome(null);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedIncome(null);
    };

    const openBulkModal = () => setIsBulkModalOpen(true);
    const closeBulkModal = () => {
        setIsBulkModalOpen(false);
        setIsBulkLarge(false);
    };

    const handleEdit = (income: Transaction) => {
        setSelectedIncome(income);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setIncomeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!incomeToDelete) return;
        try {
            await transactionService.deleteTransaction(incomeToDelete);
            toast.success("Income record deleted");
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.INCOMES, familyDetails?.id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.INCOME_STATS, familyDetails?.id],
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Failed to delete record");
        }
    };

    const refreshIncomes = () => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.INCOMES, familyDetails?.id],
        });
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.INCOME_STATS, familyDetails?.id],
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Family Income
                    </h1>
                    <p className="font-medium text-gray-500">
                        Monitor inflows and track your earning sources.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={openBulkModal}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-5 py-3 font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />{" "}
                        Import
                    </button>
                    <button
                        onClick={openModal}
                        className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:scale-105 hover:from-green-500 hover:to-emerald-500 active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> Add Income
                    </button>
                </div>
            </div>

            <IncomeStats familyId={familyDetails?.id || ""} />

            {/* Main Table / List Area */}
            <IncomeList
                incomes={incomes}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setCurrentPage}
            />

            {/* Add/Edit Income Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-5xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 flex items-center gap-3 text-2xl font-black text-gray-800 dark:text-white">
                        <TrendingUp className="h-8 w-8 text-green-500" />{" "}
                        {selectedIncome ? "Update Income" : "New Income"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {selectedIncome
                            ? "Modify the details of this income record."
                            : "Add a new income source or payment to your records."}
                    </p>
                </div>
                <IncomeForm
                    onSuccess={() => {
                        closeModal();
                        refreshIncomes();
                    }}
                    onCancel={closeModal}
                    wallets={wallets}
                    incomeTypes={availableIncomeTypes}
                    familyId={familyDetails?.id || ""}
                    income={selectedIncome || undefined}
                    tags={availableTags}
                    locations={availableLocations}
                    paymentMethods={availablePaymentMethods}
                    contacts={availableContacts}
                    projects={availableProjects}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="max-w-md p-8"
            >
                <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                        Delete Record?
                    </h3>
                    <p className="leading-relaxed font-medium text-gray-500">
                        Are you sure you want to delete this income record? This
                        action cannot be undone and will affect your balance.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-500"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Bulk Import Modal */}
            <Modal
                isOpen={isBulkModalOpen}
                onClose={closeBulkModal}
                className={
                    isBulkLarge
                        ? "max-w-[95vw] p-5 transition-all duration-500 ease-in-out md:p-10"
                        : "max-w-4xl p-10 transition-all duration-500 ease-in-out"
                }
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        Bulk Import Income
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Upload a CSV or Excel file to batch import income
                        records.
                    </p>
                </div>
                <BulkImportIncome
                    onSuccess={closeBulkModal}
                    onCancel={closeBulkModal}
                    onFileSelect={(hasFile) => setIsBulkLarge(hasFile)}
                    familyId={familyDetails?.id || ""}
                    incomeTypes={availableIncomeTypes}
                    wallets={wallets}
                    contacts={availableContacts}
                    projects={availableProjects}
                    tags={availableTags}
                    locations={availableLocations}
                    paymentMethods={availablePaymentMethods}
                />
            </Modal>
        </div>
    );
}
